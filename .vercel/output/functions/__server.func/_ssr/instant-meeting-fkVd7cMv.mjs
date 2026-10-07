import { n as supabase } from "./client-B5YVWdzA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/instant-meeting-fkVd7cMv.js
/** Create an ad-hoc meeting and return its id. Returns null on failure. */
async function createInstantMeeting(title, inviteeIds = []) {
	const { data: u } = await supabase.auth.getUser();
	if (!u.user) return null;
	const me = u.user.id;
	const now = /* @__PURE__ */ new Date();
	const ends = new Date(now.getTime() + 36e5);
	const { data, error } = await supabase.from("meetings").insert({
		title: title || "Instant meeting",
		description: null,
		host_id: me,
		starts_at: now.toISOString(),
		ends_at: ends.toISOString()
	}).select().single();
	if (error || !data) return null;
	const ids = Array.from(/* @__PURE__ */ new Set([me, ...inviteeIds]));
	await supabase.from("meeting_participants").upsert(ids.map((uid) => ({
		meeting_id: data.id,
		user_id: uid,
		rsvp: uid === me ? "yes" : "invited"
	})), { onConflict: "meeting_id,user_id" });
	return data.id;
}
//#endregion
export { createInstantMeeting };
