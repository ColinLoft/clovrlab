import { r as createServerFn } from "./server-DjCj4rPg.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DJmRtREQ.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-nqu-4SJ1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invite.functions-C74ezioC.js
var inviteSchema = objectType({
	email: stringType().email(),
	full_name: stringType().optional().nullable(),
	department: stringType().optional().nullable(),
	role: stringType()
});
/**
* Admin-only: insert an invite row (which the DB signup trigger honors) and send
* a Supabase auth invite email so the recipient can accept in one click.
*/
var sendInvite_createServerFn_handler = createServerRpc({
	id: "776ceea5b5ea6fa0dec74d45aafd1098a9888305334c1dcffbb8f712e874191e",
	name: "sendInvite",
	filename: "src/lib/hq/invite.functions.ts"
}, (opts) => sendInvite.__executeServer(opts));
var sendInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => inviteSchema.parse(data)).handler(sendInvite_createServerFn_handler, async ({ data, context }) => {
	const { data: roles, error: rolesErr } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
	if (rolesErr) throw new Error(rolesErr.message);
	if (!(roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin")) throw new Error("Only admins can send invites");
	const email = data.email.trim().toLowerCase();
	const { error: invErr } = await context.supabase.from("invites").insert({
		email,
		role: data.role,
		department: data.department || null,
		full_name: data.full_name || null,
		invited_by: context.userId
	});
	if (invErr && !invErr.message.includes("duplicate")) throw new Error(invErr.message);
	const { supabaseAdmin } = await import("./client.server-BX0Wzst5.mjs");
	const redirectBase = process.env.SITE_URL || "https://hq.clovrlab.com";
	const { error: mailErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
		redirectTo: `${redirectBase}/hq-login`,
		data: {
			full_name: data.full_name,
			department: data.department,
			role: data.role
		}
	});
	if (mailErr) return {
		ok: true,
		emailSent: false,
		warning: mailErr.message
	};
	return {
		ok: true,
		emailSent: true
	};
});
//#endregion
export { sendInvite_createServerFn_handler };
