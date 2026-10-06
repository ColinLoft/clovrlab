import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { CameraInput, SweepResultItem } from "./sweep.server";

export type { CameraInput, SweepResultItem };

export const sweepCameras = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { cameras: CameraInput[] }) => {
    if (!Array.isArray(d?.cameras)) throw new Error("cameras required");
    return { cameras: d.cameras.slice(0, 50) };
  })
  .handler(async ({ data, context }) => {
    const apiKey = process.env['OPENROUTER_API_KEY'];
    if (!apiKey) return { created: 0, errors: ["OPENROUTER_API_KEY missing"], analyzed: 0, results: [] as SweepResultItem[] };

    const { runSweep } = await import("./sweep.server");
    const supabase = context.supabase;
    const { data: st } = await supabase.from("net_settings").select("*").eq("id", true).maybeSingle();

    const res = await runSweep(supabase as never, data.cameras, apiKey, {
      model: (st as any)?.ai_model ?? "google/gemini-2.5-flash",
      minConfidence: Number((st as any)?.min_confidence ?? 55),
      trigger: "manual",
    });

    if (res.blocked) {
      await supabase
        .from("net_settings")
        .update({ paused: true, pause_reason: res.blocked.message } as never)
        .eq("id", true);
    }

    return {
      created: res.created,
      analyzed: res.analyzed,
      errors: res.errors,
      results: res.results,
      paused: Boolean(res.blocked),
    };
  });
