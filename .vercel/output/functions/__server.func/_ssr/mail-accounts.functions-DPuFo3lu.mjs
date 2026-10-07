import { r as createServerFn } from "./server-BrzklweG.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bv0AGlpV.mjs";
import { t as createServerRpc } from "./createServerRpc-dTzrDJiC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mail-accounts.functions-DPuFo3lu.js
async function assertAdmin(supabase, userId) {
	const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
	const roles = (data ?? []).map((r) => r.role);
	if (!roles.includes("admin") && !roles.includes("super_admin")) throw new Error("Only administrators can manage company mailboxes.");
}
/** Create or update a mailbox. Admin only. */
var saveMailAccount_createServerFn_handler = createServerRpc({
	id: "b4b7c110436bbd40842ef6cc73e5750911c33fc2c5d5a631527e4294ba07172b",
	name: "saveMailAccount",
	filename: "src/lib/hq/mail-accounts.functions.ts"
}, (opts) => saveMailAccount.__executeServer(opts));
var saveMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.label || !input.email_address || !input.imap_host || !input.smtp_host || !input.username) throw new Error("Label, address, IMAP host, SMTP host and username are required.");
	return input;
}).handler(saveMailAccount_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BDMADYe_.mjs");
	const { encryptMailPassword } = await import("./mail-crypto.server-G7kO31Z9.mjs");
	const row = {
		label: data.label,
		email_address: data.email_address.trim().toLowerCase(),
		display_name: data.display_name ?? null,
		imap_host: data.imap_host.trim(),
		imap_port: data.imap_port || 993,
		smtp_host: data.smtp_host.trim(),
		smtp_port: data.smtp_port || 465,
		username: data.username.trim(),
		is_shared: data.is_shared,
		active: data.active,
		assigned_user_id: data.assigned_user_id || null,
		created_by: context.userId
	};
	let accountId = data.id ?? null;
	if (accountId) {
		const { error } = await supabaseAdmin.from("email_accounts").update(row).eq("id", accountId);
		if (error) throw new Error(error.message);
	} else {
		const { data: created, error } = await supabaseAdmin.from("email_accounts").insert(row).select("id").single();
		if (error) throw new Error(error.message);
		accountId = created.id;
	}
	if (data.password) {
		const { error } = await supabaseAdmin.from("email_account_secrets").upsert({
			account_id: accountId,
			password_ciphertext: encryptMailPassword(data.password),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "account_id" });
		if (error) throw new Error(error.message);
	}
	return {
		ok: true,
		id: accountId
	};
});
var deleteMailAccount_createServerFn_handler = createServerRpc({
	id: "01317dcdb30824f5ec979a6115edbe75d41beee10f847f81526efb4e554ac09a",
	name: "deleteMailAccount",
	filename: "src/lib/hq/mail-accounts.functions.ts"
}, (opts) => deleteMailAccount.__executeServer(opts));
var deleteMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteMailAccount_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-BDMADYe_.mjs");
	const { error } = await supabaseAdmin.from("email_accounts").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
async function loadAccount(supabase, userId, accountId) {
	const { supabaseAdmin } = await import("./client.server-BDMADYe_.mjs");
	const { decryptMailPassword } = await import("./mail-crypto.server-G7kO31Z9.mjs");
	const { data: allowed } = await supabase.from("email_accounts").select("id").eq("id", accountId).maybeSingle();
	if (!allowed) throw new Error("You do not have access to this mailbox.");
	const { data: account, error } = await supabaseAdmin.from("email_accounts").select("*").eq("id", accountId).maybeSingle();
	if (error || !account) throw new Error("Mailbox not found.");
	const { data: secret } = await supabaseAdmin.from("email_account_secrets").select("password_ciphertext").eq("account_id", accountId).maybeSingle();
	if (!secret) throw new Error("This mailbox has no password saved yet. Ask an admin to set it.");
	return {
		account,
		password: decryptMailPassword(secret.password_ciphertext),
		supabaseAdmin,
		userId
	};
}
/** Pull the newest messages from the mailbox over IMAP into the HQ inbox. */
var syncMailAccount_createServerFn_handler = createServerRpc({
	id: "0202a2a50d6f06c17019017ad6a5c9ca673ccae5d94e47b1f89e20404a6a3ffb",
	name: "syncMailAccount",
	filename: "src/lib/hq/mail-accounts.functions.ts"
}, (opts) => syncMailAccount.__executeServer(opts));
var syncMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(syncMailAccount_createServerFn_handler, async ({ data, context }) => {
	const { account, password, supabaseAdmin } = await loadAccount(context.supabase, context.userId, data.accountId);
	const { ImapClient } = await import("./imap.server-DpQEZuk2.mjs");
	const client = new ImapClient();
	try {
		await client.connect({
			host: account.imap_host,
			port: account.imap_port,
			username: account.username,
			password
		});
		await client.selectMailbox("INBOX");
		const uids = await client.recentUids(Math.min(data.limit ?? 25, 50));
		let imported = 0;
		for (const uid of uids) {
			const message = await client.fetchMessage(uid);
			if (!message) continue;
			const dedupeId = message.messageId ?? `${account.email_address}:${uid}`;
			const { data: existing } = await supabaseAdmin.from("hq_emails").select("id").eq("message_id", dedupeId).maybeSingle();
			if (existing) continue;
			await supabaseAdmin.from("hq_emails").insert({
				folder: "inbox",
				mailbox: account.email_address,
				direction: "inbound",
				subject: message.subject,
				from_addr: message.from,
				to_addr: message.to ?? account.email_address,
				cc: message.cc,
				body: message.body,
				message_id: dedupeId,
				sent_at: message.date ? new Date(message.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
				owner_id: account.assigned_user_id,
				is_read: false,
				status: "unread"
			});
			imported += 1;
		}
		await supabaseAdmin.from("email_accounts").update({
			last_sync_at: (/* @__PURE__ */ new Date()).toISOString(),
			last_sync_error: null
		}).eq("id", account.id);
		return {
			ok: true,
			imported,
			scanned: uids.length
		};
	} catch (err) {
		const messageText = err instanceof Error ? err.message : String(err);
		await supabaseAdmin.from("email_accounts").update({
			last_sync_at: (/* @__PURE__ */ new Date()).toISOString(),
			last_sync_error: messageText.slice(0, 500)
		}).eq("id", account.id);
		throw new Error(messageText);
	} finally {
		await client.close();
	}
});
var sendMailViaAccount_createServerFn_handler = createServerRpc({
	id: "ecda5e93cfbe1d7944b2e9548fa5db3496a6b78bbd5513b81002413314f0d295",
	name: "sendMailViaAccount",
	filename: "src/lib/hq/mail-accounts.functions.ts"
}, (opts) => sendMailViaAccount.__executeServer(opts));
var sendMailViaAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.accountId || !input.to || !input.subject) throw new Error("Mailbox, recipient and subject are required.");
	return input;
}).handler(sendMailViaAccount_createServerFn_handler, async ({ data, context }) => {
	const { account, password, supabaseAdmin } = await loadAccount(context.supabase, context.userId, data.accountId);
	const { sendSmtpMail } = await import("./smtp.server-B5t8o0V0.mjs");
	const split = (value) => (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
	const { messageId } = await sendSmtpMail({
		host: account.smtp_host,
		port: account.smtp_port,
		username: account.username,
		password
	}, {
		from: account.email_address,
		fromName: account.display_name,
		to: split(data.to),
		cc: split(data.cc),
		subject: data.subject,
		text: data.body,
		html: data.html ?? void 0,
		inReplyTo: data.inReplyTo ?? null
	});
	await supabaseAdmin.from("hq_emails").insert({
		folder: "sent",
		mailbox: account.email_address,
		direction: "outbound",
		subject: data.subject,
		from_addr: account.email_address,
		to_addr: data.to,
		cc: data.cc ?? null,
		body: data.body,
		message_id: messageId,
		in_reply_to: data.inReplyTo ?? null,
		sent_at: (/* @__PURE__ */ new Date()).toISOString(),
		status: "sent",
		is_read: true,
		owner_id: context.userId,
		created_by: context.userId
	});
	return {
		ok: true,
		messageId
	};
});
var testMailAccount_createServerFn_handler = createServerRpc({
	id: "6d707edb54b7fea8509028e0e739d360cbc15662c50ce49c2832d5fa081883a6",
	name: "testMailAccount",
	filename: "src/lib/hq/mail-accounts.functions.ts"
}, (opts) => testMailAccount.__executeServer(opts));
var testMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(testMailAccount_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { account, password } = await loadAccount(context.supabase, context.userId, data.accountId);
	const { ImapClient } = await import("./imap.server-DpQEZuk2.mjs");
	const client = new ImapClient();
	try {
		await client.connect({
			host: account.imap_host,
			port: account.imap_port,
			username: account.username,
			password
		});
		await client.selectMailbox("INBOX");
		return {
			ok: true,
			message: "IMAP connection succeeded."
		};
	} finally {
		await client.close();
	}
});
//#endregion
export { deleteMailAccount_createServerFn_handler, saveMailAccount_createServerFn_handler, sendMailViaAccount_createServerFn_handler, syncMailAccount_createServerFn_handler, testMailAccount_createServerFn_handler };
