import { r as createServerFn } from "./server-DjCj4rPg.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DJmRtREQ.mjs";
import { i as stringType, n as booleanType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-nqu-4SJ1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/slack-admin.functions-B7b8CFlH.js
var GATEWAY_URL = "https://slack.com/api";
async function assertAdmin(context) {
	const { data: roles, error } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	if (!(roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin")) throw new Error("Only administrators can manage Slack");
}
function creds() {
	const slackKey = process.env["SLACK_API_KEY"];
	return {
		slackKey,
		configured: Boolean(slackKey)
	};
}
async function slack(method, body) {
	const { slackKey, configured } = creds();
	if (!configured) throw new Error("Slack is not connected for this project yet.");
	const res = await fetch(`${GATEWAY_URL}/${method}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${slackKey}`,
			"Content-Type": "application/json; charset=utf-8"
		},
		body: body ? JSON.stringify(body) : void 0
	});
	const text = await res.text();
	if (!res.ok) throw new Error(`Slack request failed [${res.status}]: ${text.slice(0, 400)}`);
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		throw new Error(`Slack returned a non-JSON response: ${text.slice(0, 200)}`);
	}
	if (!json.ok) throw new Error(`Slack error: ${json.error ?? "unknown_error"}`);
	return json;
}
/** Bot identity + channel/member inventory for the Enterprise Systems console. */
var slackOverview_createServerFn_handler = createServerRpc({
	id: "10491c1e3808233c57588073064c1425647cdee168955cc918438ed81947f3f6",
	name: "slackOverview",
	filename: "src/lib/hq/slack-admin.functions.ts"
}, (opts) => slackOverview.__executeServer(opts));
var slackOverview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(slackOverview_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	if (!creds().configured) return {
		configured: false,
		bot: null,
		channels: [],
		members: []
	};
	const auth = await slack("auth.test");
	const chans = await slack("conversations.list", {
		limit: 200,
		exclude_archived: true,
		types: "public_channel,private_channel"
	});
	const users = await slack("users.list", { limit: 200 });
	return {
		configured: true,
		bot: {
			user: auth.user,
			userId: auth.user_id,
			team: auth.team,
			teamId: auth.team_id,
			url: auth.url
		},
		channels: (chans.channels ?? []).map((c) => ({
			id: c.id,
			name: c.name,
			isPrivate: Boolean(c.is_private),
			members: c.num_members ?? 0,
			topic: c.topic?.value ?? "",
			botIsMember: Boolean(c.is_member)
		})),
		members: (users.members ?? []).filter((m) => !m.deleted && !m.is_bot && m.id !== "USLACKBOT").map((m) => ({
			id: m.id,
			name: m.profile?.display_name || m.real_name || m.name,
			email: m.profile?.email ?? null
		}))
	};
});
var slackCreateChannel_createServerFn_handler = createServerRpc({
	id: "d8df867b2dc621a57a9fd30655b6128701d9a992f0e5f922451f3da9c5605e88",
	name: "slackCreateChannel",
	filename: "src/lib/hq/slack-admin.functions.ts"
}, (opts) => slackCreateChannel.__executeServer(opts));
var slackCreateChannel = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().min(1).max(80),
	isPrivate: booleanType().default(false),
	purpose: stringType().max(250).optional(),
	invite: arrayType(stringType().min(1)).max(200).default([])
}).parse(d)).handler(slackCreateChannel_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const channel = (await slack("conversations.create", {
		name: data.name.trim().toLowerCase().replace(/^#/, "").replace(/[^a-z0-9-_]/g, "-").slice(0, 80),
		is_private: data.isPrivate
	})).channel;
	if (data.purpose) await slack("conversations.setPurpose", {
		channel: channel.id,
		purpose: data.purpose
	});
	if (data.invite.length) await slack("conversations.invite", {
		channel: channel.id,
		users: data.invite.join(",")
	});
	return {
		id: channel.id,
		name: channel.name
	};
});
var slackInviteMembers_createServerFn_handler = createServerRpc({
	id: "bbbd9596772dd1245e9e6f66c363d626ed40df3d6ae42158bb7eba86462ff445",
	name: "slackInviteMembers",
	filename: "src/lib/hq/slack-admin.functions.ts"
}, (opts) => slackInviteMembers.__executeServer(opts));
var slackInviteMembers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	channel: stringType().min(1),
	users: arrayType(stringType().min(1)).min(1).max(200)
}).parse(d)).handler(slackInviteMembers_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	await slack("conversations.invite", {
		channel: data.channel,
		users: data.users.join(",")
	});
	return {
		ok: true,
		invited: data.users.length
	};
});
var slackBotActivity_createServerFn_handler = createServerRpc({
	id: "ac22ec0510c3163aae2876461488c16ebdf94dd6297a299dbd39c4507df8284b",
	name: "slackBotActivity",
	filename: "src/lib/hq/slack-admin.functions.ts"
}, (opts) => slackBotActivity.__executeServer(opts));
var slackBotActivity = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ channel: stringType().min(1) }).parse(d)).handler(slackBotActivity_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const auth = await slack("auth.test");
	const msgs = ((await slack("conversations.history", {
		channel: data.channel,
		limit: 50
	})).messages ?? []).map((m) => ({
		ts: m.ts,
		text: m.text ?? "",
		byBot: Boolean(m.bot_id) || m.user === auth.user_id,
		user: m.user ?? m.bot_id ?? "unknown"
	}));
	return {
		total: msgs.length,
		botMessages: msgs.filter((m) => m.byBot).length,
		messages: msgs.slice(0, 25)
	};
});
var slackPostMessage_createServerFn_handler = createServerRpc({
	id: "bc134d808093432146df2b7296279c612aeeb71806cb6f1a87d4c251efdf8eda",
	name: "slackPostMessage",
	filename: "src/lib/hq/slack-admin.functions.ts"
}, (opts) => slackPostMessage.__executeServer(opts));
var slackPostMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	channel: stringType().min(1),
	text: stringType().min(1).max(3e3)
}).parse(d)).handler(slackPostMessage_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	await slack("chat.postMessage", {
		channel: data.channel,
		text: data.text
	});
	return { ok: true };
});
//#endregion
export { slackBotActivity_createServerFn_handler, slackCreateChannel_createServerFn_handler, slackInviteMembers_createServerFn_handler, slackOverview_createServerFn_handler, slackPostMessage_createServerFn_handler };
