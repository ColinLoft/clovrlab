import { n as supabase } from "./client-B7QlDyqv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-lSj6-alv.js
var AI_MODELS = [
	{
		value: "google/gemini-2.5-flash",
		label: "Gemini 2.5 Flash — balanced (default)"
	},
	{
		value: "google/gemini-2.5-flash-lite",
		label: "Gemini 2.5 Flash Lite — cheapest, fastest"
	},
	{
		value: "google/gemini-2.5-pro",
		label: "Gemini 2.5 Pro — highest accuracy"
	}
];
async function fetchSettings() {
	const { data } = await supabase.from("net_settings").select("*").eq("id", true).maybeSingle();
	return data ?? null;
}
async function saveSettings(patch) {
	const { data, error } = await supabase.from("net_settings").upsert({
		id: true,
		...patch
	}, { onConflict: "id" }).select().maybeSingle();
	if (error) throw error;
	if (!data) throw new Error("Nothing was saved — admin access is required to change detection settings.");
	return data;
}
async function fetchCameraPrefs() {
	const { data } = await supabase.from("net_camera_prefs").select("*");
	const out = {};
	for (const r of data ?? []) out[r.camera_id] = r;
	return out;
}
async function saveCameraPref(pref) {
	const { data, error } = await supabase.from("net_camera_prefs").upsert(pref, { onConflict: "camera_id" }).select().maybeSingle();
	if (error) throw error;
	if (!data) throw new Error("Camera preference was not saved — staff access is required.");
	return data;
}
async function fetchSweepRuns(limit = 12) {
	const { data } = await supabase.from("net_sweep_runs").select("*").order("created_at", { ascending: false }).limit(limit);
	return data ?? [];
}
//#endregion
export { saveCameraPref as a, fetchSweepRuns as i, fetchCameraPrefs as n, saveSettings as o, fetchSettings as r, AI_MODELS as t };
