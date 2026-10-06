import { createFileRoute } from "@tanstack/react-router";
import { fetchCameras } from "@/lib/net/alertwest";
import { inArea } from "@/lib/net/area";

/**
 * Scheduled AI camera sweep. Called by pg_cron.
 * Bounded batch + single-flight DB lock + paused-state guard + circuit breaker.
 */
export const Route = createFileRoute("/api/public/net/sweep")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env['OPENROUTER_API_KEY'];
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { runSweep } = await import("@/lib/net/sweep.server");

        // Only the internal scheduler may trigger sweeps (paid AI + writes operational data).
        const presented = request.headers.get("x-cron-secret");
        if (!presented) return json({ error: "Unauthorized" }, 401);
        const { data: ok, error: authErr } = await supabaseAdmin.rpc("net_verify_cron_token" as never, {
          _token: presented,
        } as never);
        if (authErr || ok !== true) return json({ error: "Unauthorized" }, 401);


        const { data: st } = await supabaseAdmin.from("net_settings").select("*").eq("id", true).maybeSingle();
        const s: any = st;
        if (!s) return json({ skipped: "no settings row" });
        if (!s.sweep_enabled) return json({ skipped: "scheduled sweeps disabled" });
        if (!apiKey) return json({ skipped: "OPENROUTER_API_KEY missing" });

        const now = Date.now();
        const probeOnly = Boolean(s.paused);

        // Single-flight lock
        if (s.sweep_lock_until && new Date(s.sweep_lock_until).getTime() > now) {
          return json({ skipped: "another sweep is running" });
        }
        // Interval guard — minutes based, with a faster cadence for high-risk cameras
        const baseMin = Math.max(1, Number(s.sweep_interval_minutes ?? (s.sweep_interval_hours || 1) * 60));
        const riskMin = Math.max(1, Math.min(baseMin, Number(s.high_risk_interval_minutes ?? baseMin)));
        const { data: lastFullRun } = await supabaseAdmin
          .from("net_sweep_runs")
          .select("created_at")
          .eq("trigger", "scheduled")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        const lastFull = (lastFullRun as any)?.created_at ? new Date((lastFullRun as any).created_at).getTime() : 0;
        const last = s.last_sweep_at ? new Date(s.last_sweep_at).getTime() : 0;
        const fullDue = !lastFull || now >= lastFull + baseMin * 60_000;
        const riskDue = !last || now >= last + riskMin * 60_000;
        if (!probeOnly && !fullDue && !riskDue) return json({ skipped: "not due yet" });
        const highRiskOnly = !probeOnly && !fullDue && riskDue;



        await supabaseAdmin
          .from("net_settings")
          .update({ sweep_lock_until: new Date(now + 10 * 60_000).toISOString() } as never)
          .eq("id", true);

        try {
          const [{ data: area }, { data: prefs }, { data: muted }, { data: openInc }] = await Promise.all([
            supabaseAdmin.from("net_response_area").select("*").eq("id", true).maybeSingle(),
            supabaseAdmin.from("net_camera_prefs").select("camera_id, watch, priority, high_risk"),
            supabaseAdmin.from("net_muted_cameras").select("camera_id, muted_until"),
            supabaseAdmin.from("net_incidents").select("camera_id").not("status", "in", "(closed,false_positive)"),
          ]);

          const mutedIds = new Set(
            ((muted ?? []) as any[])
              .filter((m) => !m.muted_until || new Date(m.muted_until).getTime() > now)
              .map((m) => m.camera_id),
          );
          // A camera with an open incident is already being worked — don't re-scan it
          const busyIds = new Set(((openInc ?? []) as any[]).map((i) => i.camera_id).filter(Boolean));
          const prefById = new Map(((prefs ?? []) as any[]).map((p) => [p.camera_id, p]));

          const a: any = area;
          const cameras = (await fetchCameras())
            .filter((c) => c.image.url && !mutedIds.has(c.site.id) && !busyIds.has(c.site.id))
            .filter((c) => {
              const p = prefById.get(c.site.id);
              if (p && p.watch === false) return false;
              if (highRiskOnly && !(p && p.high_risk)) return false;
              if (s.sweep_priority_only && !(p && Number(p.priority) > 0)) return false;
              return inArea(a, {
                lat: Number(c.site.latitude),
                lng: Number(c.site.longitude),
                state: c.site.state,
                county: c.site.county,
              });

            })
            .sort((x, y) => {
              const px = prefById.get(x.site.id);
              const py = prefById.get(y.site.id);
              return (
                Number(!!py?.high_risk) - Number(!!px?.high_risk) ||
                (py?.priority ?? 0) - (px?.priority ?? 0)
              );
            });


          const cap = probeOnly ? 1 : Math.max(1, Math.min(50, Number(s.sweep_batch_size || 25)));
          const batch = cameras.slice(0, cap).map((c) => ({
            camera_id: c.site.id,
            camera_name: c.name,
            lat: Number(c.site.latitude),
            lng: Number(c.site.longitude),
            state: c.site.state,
            county: c.site.county,
            image_url: c.image.url as string,
            image_time: c.image.time ?? new Date().toISOString(),
          }));

          if (!batch.length) {
            await unlock(supabaseAdmin, { last_sweep_at: new Date().toISOString() });
            return json({ analyzed: 0, created: 0, note: "no eligible cameras" });
          }

          const res = await runSweep(supabaseAdmin as never, batch, apiKey, {
            model: s.ai_model,
            minConfidence: Number(s.min_confidence ?? 55),
            trigger: highRiskOnly ? "scheduled-highrisk" : "scheduled",
          });


          if (res.blocked) {
            await unlock(supabaseAdmin, { paused: true, pause_reason: res.blocked.message });
            return json({ paused: true, reason: res.blocked.message }, 200);
          }

          await unlock(supabaseAdmin, {
            last_sweep_at: new Date().toISOString(),
            ...(probeOnly ? { paused: false, pause_reason: null } : {}),
          });
          return json({ analyzed: res.analyzed, created: res.created, errors: res.errors, resumed: probeOnly });
        } catch (e) {
          await unlock(supabaseAdmin, {});
          return json({ error: (e as Error).message }, 500);
        }
      },
    },
  },
});

async function unlock(supabaseAdmin: any, patch: Record<string, unknown>) {
  await supabaseAdmin.from("net_settings").update({ sweep_lock_until: null, ...patch }).eq("id", true);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
