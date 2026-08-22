import { createFileRoute } from "@tanstack/react-router";

/**
 * Emails urgent pages to whoever they were routed to. Called every minute by
 * the internal scheduler; only sends for targets that have not been emailed
 * yet and whose page is still unacknowledged.
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

        const apiKey = process.env["RESEND_API_KEY"];
        const pushKey = process.env["ONESIGNAL_REST_API_KEY"];

        const { data: targets } = await supabaseAdmin
          .from("page_targets" as never)
          .select("id, user_id, alert_id, level, email_sent_at, push_sent_at")
          .or("email_sent_at.is.null,push_sent_at.is.null")
          .limit(50);

        const rows = (targets ?? []) as any[];
        if (!rows.length) return json({ sent: 0, pushed: 0 });


        const alertIds = Array.from(new Set(rows.map((r) => r.alert_id)));
        const userIds = Array.from(new Set(rows.map((r) => r.user_id)));

        const [{ data: alerts }, { data: profiles }] = await Promise.all([
          supabaseAdmin.from("page_alerts" as never).select("id, title, body, link, severity, kind, status").in("id", alertIds),
          supabaseAdmin.from("profiles").select("id, email, full_name").in("id", userIds),
        ]);

        const alertById = new Map((alerts ?? []).map((a: any) => [a.id, a]));
        const emailById = new Map((profiles ?? []).map((p: any) => [p.id, p]));

        let sent = 0;
        let pushed = 0;
        const errors: string[] = [];
        const stamp = () => new Date().toISOString();

        for (const t of rows) {
          const a: any = alertById.get(t.alert_id);
          const p: any = emailById.get(t.user_id);
          if (!a) continue;

          if (a.status === "resolved") {
            await supabaseAdmin.from("page_targets" as never)
              .update({ email_sent_at: stamp(), push_sent_at: stamp() } as never).eq("id", t.id);
            continue;
          }

          // ---- Push (OneSignal) ----
          if (pushKey && !t.push_sent_at) {
            try {
              const res = await fetch("https://api.onesignal.com/notifications", {
                method: "POST",
                headers: {
                  Authorization: `Key ${pushKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  app_id: ONESIGNAL_APP_ID,
                  include_aliases: { external_id: [t.user_id] },
                  target_channel: "push",
                  headings: { en: `🚨 ${String(a.severity).toUpperCase()} PAGE` },
                  contents: { en: `${a.title}${a.body ? ` — ${String(a.body).slice(0, 120)}` : ""}` },
                  url: `https://hq.clovrlab.com${a.link ?? "/ops/paging"}`,
                  priority: 10,
                  ios_interruption_level: "critical",
                  ios_sound: "default",
                  android_channel_priority: "high",
                  collapse_id: String(a.id),
                }),
              });
              if (!res.ok) throw new Error(`OneSignal ${res.status}: ${(await res.text()).slice(0, 160)}`);
              await supabaseAdmin.from("page_targets" as never)
                .update({ push_sent_at: stamp() } as never).eq("id", t.id);
              pushed++;
            } catch (e) {
              errors.push((e as Error).message);
            }
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
                    <a href="https://hq.clovrlab.com${a.link ?? "/ops/paging"}"
                       style="display:inline-block;background:#dc2626;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">
                      Acknowledge this page
                    </a>
                    <p style="color:#94a3b8;font-size:12px;margin-top:16px">
                      This page keeps escalating to the next on-call tier until someone acknowledges it.
                    </p>
                  </div>`,
              }),
            });
            if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 160)}`);
            await supabaseAdmin.from("page_targets" as never).update({ email_sent_at: stamp() } as never).eq("id", t.id);
            sent++;
          } catch (e) {
            errors.push((e as Error).message);
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
