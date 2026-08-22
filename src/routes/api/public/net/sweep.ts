import { createFileRoute } from "@tanstack/react-router";
import { fetchCameras } from "@/lib/net/alertwest";
import { haversineMi } from "@/lib/net/area";

/**
 * Scheduled AI camera sweep. Called by pg_cron.
 * Bounded batch + single-flight DB lock + paused-state guard + circuit breaker.
 */
export const Route = createFileRoute("/api/public/net/sweep")({
  server: {
    handlers: {
      POST: async () => {
        const apiKey = process.env['LOVABLE_API_KEY'];
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { runSweep } = await import("@/lib/net/sweep.server");

        const { data: st } = await supabaseAdmin.from("net_settings").select("*").eq("id", true).maybeSingle();
        const s: any = st;
        if (!s) return json({ skipped: "no settings row" });
        if (!s.sweep_enabled) return json({ skipped: "scheduled sweeps disabled" });
        if (!apiKey) return json({ skipped: "LOVABLE_API_KEY missing" });

        const now = Date.now();
        const probeOnly = Boolean(s.paused);

        // Single-flight lock
        if (s.sweep_lock_until && new Date(s.sweep_lock_until).getTime() > now) {
          return json({ skipped: "another sweep is running" });
        }
        // Interval guard
        const dueAfter = s.last_sweep_at
          ? new Date(s.last_sweep_at).getTime() + Number(s.sweep_interval_hours || 6) * 3600_000
          : 0;
        if (!probeOnly && now < dueAfter) return json({ skipped: "not due yet" });

        await supabaseAdmin
          .from("net_settings")
          .update({ sweep_lock_until: new Date(now + 10 * 60_000).toISOString() } as never)
          .eq("id", true);

        try {
          const [{ data: area }, { data: prefs }, { data: muted }] = await Promise.all([
            supabaseAdmin.from("net_response_area").select("*").eq("id", true).maybeSingle(),
            supabaseAdmin.from("net_camera_prefs").select("camera_id, watch, priority"),
            supabaseAdmin.from("net_muted_cameras").select("camera_id, muted_until"),
          ]);

          const mutedIds = new Set(
            ((muted ?? []) as any[])
              .filter((m) => !m.muted_until || new Date(m.muted_until).getTime() > now)
              .map((m) => m.camera_id),
          );
          const prefById = new Map(((prefs ?? []) as any[]).map((p) => [p.camera_id, p]));

          const a: any = area;
          const cameras = (await fetchCameras())
            .filter((c) => c.image.url && !mutedIds.has(c.site.id))
            .filter((c) => {
              const p = prefById.get(c.site.id);
              if (p && p.watch === false) return false;
              if (s.sweep_priority_only && !(p && Number(p.priority) > 0)) return false;
              return inArea(a, {
                lat: Number(c.site.latitude),
                lng: Number(c.site.longitude),
                state: c.site.state,
                county: c.site.county,
              });

            })
            .sort((x, y) => (prefById.get(y.site.id)?.priority ?? 0) - (prefById.get(x.site.id)?.priority ?? 0));

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
            autoPromote: Boolean(s.auto_promote),
            autoPromoteConfidence: Number(s.auto_promote_confidence ?? 90),
            trigger: "scheduled",
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
