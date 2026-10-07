import { r as createServerFn } from "./server-BrzklweG.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DX9VUQiX.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bv0AGlpV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mail-accounts.functions-ya6wRgF5.js
/** Create or update a mailbox. Admin only. */
var saveMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.label || !input.email_address || !input.imap_host || !input.smtp_host || !input.username) throw new Error("Label, address, IMAP host, SMTP host and username are required.");
	return input;
}).handler(createSsrRpc("b4b7c110436bbd40842ef6cc73e5750911c33fc2c5d5a631527e4294ba07172b"));
var deleteMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("01317dcdb30824f5ec979a6115edbe75d41beee10f847f81526efb4e554ac09a"));
/** Pull the newest messages from the mailbox over IMAP into the HQ inbox. */
var syncMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("0202a2a50d6f06c17019017ad6a5c9ca673ccae5d94e47b1f89e20404a6a3ffb"));
/** Send a message through the mailbox's SMTP server. */
var sendMailViaAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.accountId || !input.to || !input.subject) throw new Error("Mailbox, recipient and subject are required.");
	return input;
}).handler(createSsrRpc("ecda5e93cfbe1d7944b2e9548fa5db3496a6b78bbd5513b81002413314f0d295"));
/** Verify IMAP + SMTP credentials without sending anything. */
var testMailAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("6d707edb54b7fea8509028e0e739d360cbc15662c50ce49c2832d5fa081883a6"));
//#endregion
export { testMailAccount as a, syncMailAccount as i, saveMailAccount as n, sendMailViaAccount as r, deleteMailAccount as t };
