import { n as supabase } from "./client-B7QlDyqv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/detection-log-CqQUb7rh.js
var db = supabase;
async function fetchDetectionEvents(limit = 200) {
	const { data, error } = await db.from("net_detection_events").select("*").order("created_at", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
/** Record an operator decision (confirm / dismiss / mute) on the detection timeline. */
async function logDetectionEvent(row) {
	const { data: u } = await supabase.auth.getUser();
	await db.from("net_detection_events").insert({
		...row,
		actor: u.user?.id ?? null
	});
}
//#endregion
export { logDetectionEvent as n, fetchDetectionEvents as t };
