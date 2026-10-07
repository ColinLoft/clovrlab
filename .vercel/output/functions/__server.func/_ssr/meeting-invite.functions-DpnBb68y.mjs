import { r as createServerFn } from "./server-BrzklweG.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-dTzrDJiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/meeting-invite.functions-DpnBb68y.js
var lookupSchema = objectType({
	token: stringType().min(8).max(200),
	meetingId: stringType().uuid()
});
var joinSchema = objectType({
	token: stringType().min(8).max(200),
	meetingId: stringType().uuid(),
	name: stringType().trim().min(1).max(120).nullable().optional()
});
/** Resolve a guest meeting invite from its token. Returns null when the token is invalid. */
var lookupMeetingInvite_createServerFn_handler = createServerRpc({
	id: "b5a00bf46c82250e21b4230e3b59f6c39c0e1a07754a20d0caabae71a77303ba",
	name: "lookupMeetingInvite",
	filename: "src/lib/hq/meeting-invite.functions.ts"
}, (opts) => lookupMeetingInvite.__executeServer(opts));
var lookupMeetingInvite = createServerFn({ method: "POST" }).inputValidator((data) => lookupSchema.parse(data)).handler(lookupMeetingInvite_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-BDMADYe_.mjs");
	const { data: row, error } = await supabaseAdmin.from("meeting_external_invites").select("id, email, name").eq("token", data.token).eq("meeting_id", data.meetingId).maybeSingle();
	if (error) throw error;
	if (!row) return null;
	return {
		id: row.id,
		email: row.email,
		name: row.name
	};
});
var markMeetingInviteJoined_createServerFn_handler = createServerRpc({
	id: "e38c8e23a6b1843dd86f35d56ee3847da934918ae586cac6ace1f06b848cc227",
	name: "markMeetingInviteJoined",
	filename: "src/lib/hq/meeting-invite.functions.ts"
}, (opts) => markMeetingInviteJoined.__executeServer(opts));
var markMeetingInviteJoined = createServerFn({ method: "POST" }).inputValidator((data) => joinSchema.parse(data)).handler(markMeetingInviteJoined_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-BDMADYe_.mjs");
	const patch = { joined_at: (/* @__PURE__ */ new Date()).toISOString() };
	if (data.name) patch.name = data.name;
	const { error } = await supabaseAdmin.from("meeting_external_invites").update(patch).eq("token", data.token).eq("meeting_id", data.meetingId);
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { lookupMeetingInvite_createServerFn_handler, markMeetingInviteJoined_createServerFn_handler };
