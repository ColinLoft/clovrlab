import { createFileRoute } from "@tanstack/react-router";

const NTFY_SERVER = "https://ntfy.sh";

/**
 * Delivers urgent pages to whoever they were routed to, over ntfy push and
 * email. Called every minute by the internal scheduler; only sends for targets
 * that have not been delivered yet and whose page is still unacknowledged.
 * Every attempt (and every failure) is written to page_deliveries.
 */
export const Route = createFileRoute("/api/public/net/page-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const presented = request.headers.get("x-cron-secret");
        if (!presented) return json({ error: "Unauthorized" }, 401);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: ok, error: authErr } = await supabaseAdmin.rpc("net_verify_cron_token" as never, {
          _token: presented,
        } as never);
        if (authErr || ok !== true) return json({ error: "Unauthorized" }, 401);

        const origin = new URL(request.url).origin;
        const appBase = "https://hq.clovrlab.com";
        const apiKey = process.env["RESEND_API_KEY"];

        const { data: targets } = await supabaseAdmin
          .from("page_targets" as never)
          .select("id, user_id, alert_id, level, ack_token, email_sent_at, push_sent_at")
          .or("email_sent_at.is.null,push_sent_at.is.null")
          .limit(50);

        const rows = (targets ?? []) as any[];
        if (!rows.length) return json({ sent: 0, pushed: 0 });

        const alertIds = Array.from(new Set(rows.map((r) => r.alert_id)));
        const userIds = Array.from(new Set(rows.map((r) => r.user_id)));

        const [{ data: alerts }, { data: profiles }, { data: topics }] = await Promise.all([
          supabaseAdmin.from("page_alerts" as never).select("id, title, body, link, severity, kind, status").in("id", alertIds),
          supabaseAdmin.from("profiles").select("id, email, full_name").in("id", userIds),
          supabaseAdmin.from("push_topics" as never).select("user_id, topic, revoked").in("user_id", userIds),
        ]);

        const alertById = new Map((alerts ?? []).map((a: any) => [a.id, a]));
        const emailById = new Map((profiles ?? []).map((p: any) => [p.id, p]));
        const topicByUser = new Map(
          (topics ?? []).filter((t: any) => !t.revoked).map((t: any) => [t.user_id, t.topic]),
        );

        let sent = 0;
        let pushed = 0;
        const errors: string[] = [];
        const stamp = () => new Date().toISOString();

        const logDelivery = async (t: any, channel: string, status: string, detail: string | null) => {
          await supabaseAdmin.from("page_deliveries" as never).insert({
            alert_id: t.alert_id, target_id: t.id, user_id: t.user_id, channel, status, detail,
          } as never);
        };

        for (const t of rows) {
          const a: any = alertById.get(t.alert_id);
          const p: any = emailById.get(t.user_id);
          if (!a) continue;

          if (a.status === "resolved") {
            await supabaseAdmin.from("page_targets" as never)
              .update({ email_sent_at: stamp(), push_sent_at: stamp() } as never).eq("id", t.id);
            continue;
          }

          const ackUrl = `${origin}/api/public/net/page-ack?t=${t.ack_token}`;
          const openUrl = `${appBase}${a.link ?? "/ops/paging"}`;

          // ---- Push (ntfy.sh) ----
          const topic = topicByUser.get(t.user_id);
          if (topic && !t.push_sent_at) {
            try {
              const res = await fetch(`${NTFY_SERVER}/${topic}`, {
                method: "POST",
                headers: {
                  Title: ascii(`${String(a.severity).toUpperCase()} PAGE - ${a.title}`).slice(0, 180),
                  Priority: a.severity === "critical" ? "5" : "4",
                  Tags: "rotating_light",
                  Click: openUrl,
                  "X-Actions": [
                    `http, Acknowledge, ${ackUrl}, method=POST, clear=true`,
                    `view, Open console, ${openUrl}`,
                  ].join("; "),
                },
                body: `${a.body ? String(a.body).slice(0, 300) : "Urgent page - acknowledgement required."}\nTier ${t.level} - ${a.kind}`,
              });
              if (!res.ok) throw new Error(`ntfy ${res.status}: ${(await res.text()).slice(0, 160)}`);
              await supabaseAdmin.from("page_targets" as never)
                .update({ push_sent_at: stamp() } as never).eq("id", t.id);
              await supabaseAdmin.from("push_topics" as never)
                .update({ last_sent_at: stamp() } as never).eq("user_id", t.user_id);
              await logDelivery(t, "ntfy", "sent", `Accepted by ntfy for topic ${topic}`);
              pushed++;
            } catch (e) {
              errors.push((e as Error).message);
              await logDelivery(t, "ntfy", "failed", (e as Error).message.slice(0, 300));
            }
          } else if (!topic && !t.push_sent_at) {
            await supabaseAdmin.from("page_targets" as never)
              .update({ push_sent_at: stamp() } as never).eq("id", t.id);
            await logDelivery(t, "ntfy", "skipped", "Operator has no active push topic");
          }

          // ---- Email (Resend) ----
          if (!apiKey || !p?.email || t.email_sent_at) continue;

          try {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "Clovr Labs Paging <alerts@clovrlab.com>",
                to: [p.email],
                subject: `🚨 ${String(a.severity).toUpperCase()} PAGE — ${a.title}`,
                html: `
                  <div style="font-family:system-ui,sans-serif;max-width:520px">
                    <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#b91c1c;margin:0 0 8px">
                      ${a.severity} page · ${a.kind} · tier ${t.level}
                    </p>
                    <h1 style="font-size:20px;margin:0 0 8px">${escapeHtml(a.title)}</h1>
                    <p style="color:#475569;font-size:14px;margin:0 0 16px">${escapeHtml(a.body ?? "")}</p>
                    <a href="${ackUrl}"
                       style="display:inline-block;background:#dc2626;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">
                      Acknowledge this page
                    </a>
                    <p style="margin:14px 0 0"><a href="${openUrl}" style="color:#2563eb;font-size:13px">Open the paging console</a></p>
                    <p style="color:#94a3b8;font-size:12px;margin-top:16px">
                      This page keeps escalating to the next on-call tier until someone acknowledges it.
                    </p>
                  </div>`,
              }),
            });
            if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 160)}`);
            await supabaseAdmin.from("page_targets" as never).update({ email_sent_at: stamp() } as never).eq("id", t.id);
            await logDelivery(t, "email", "sent", `Delivered to ${p.email}`);
            sent++;
          } catch (e) {
            errors.push((e as Error).message);
            await logDelivery(t, "email", "failed", (e as Error).message.slice(0, 300));
          }
        }

        return json({ sent, pushed, errors: errors.slice(0, 3) });
      },
    },
  },
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

/** ntfy headers must be ASCII; strip emoji/accents from titles. */
function ascii(s: string) {
  return s.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").trim();
}
