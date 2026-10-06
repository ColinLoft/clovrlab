import { r as createServerFn } from "./server-D_zSarl9.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CDjNu8j6.mjs";
import { t as createServerRpc } from "./createServerRpc-DZoXAkE6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-detect.functions-Dr9C_Lwi.js
var sweepCameras_createServerFn_handler = createServerRpc({
	id: "4e163c8816466324e5b525c314ffbceedc176570271d90794a81fb2ef7c9b92e",
	name: "sweepCameras",
	filename: "src/lib/net/ai-detect.functions.ts"
}, (opts) => sweepCameras.__executeServer(opts));
var sweepCameras = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => {
	if (!Array.isArray(d?.cameras)) throw new Error("cameras required");
	return { cameras: d.cameras.slice(0, 50) };
}).handler(sweepCameras_createServerFn_handler, async ({ data, context }) => {
	const apiKey = process.env["OPENROUTER_API_KEY"];
	if (!apiKey) return {
		created: 0,
		errors: ["OPENROUTER_API_KEY missing"],
		analyzed: 0,
		results: []
	};
	const { runSweep } = await import("./sweep.server-CfzOSjhm.mjs");
	const supabase = context.supabase;
	const { data: st } = await supabase.from("net_settings").select("*").eq("id", true).maybeSingle();
	const res = await runSweep(supabase, data.cameras, apiKey, {
		model: st?.ai_model ?? "google/gemini-2.5-flash",
		minConfidence: Number(st?.min_confidence ?? 55),
		trigger: "manual"
	});
	if (res.blocked) await supabase.from("net_settings").update({
		paused: true,
		pause_reason: res.blocked.message
	}).eq("id", true);
	return {
		created: res.created,
		analyzed: res.analyzed,
		errors: res.errors,
		results: res.results,
		paused: Boolean(res.blocked)
	};
});
//#endregion
export { sweepCameras_createServerFn_handler };
