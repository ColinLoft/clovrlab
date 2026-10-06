import { n as readUntil, t as connectTLS } from "./mail-socket.server-DDY9mzAD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smtp.server-B5t8o0V0.js
var CRLF = "\r\n";
function isComplete(buffer) {
	if (!/\r?\n$/.test(buffer)) return false;
	const lines = buffer.replace(/\r?\n$/, "").split(/\r?\n/);
	return /^\d{3} /.test(lines[lines.length - 1] ?? "");
}
async function command(socket, line, expect) {
	if (line !== null) await socket.write(line + CRLF);
	const response = await readUntil(socket, isComplete);
	const lastLine = response.trim().split(/\r?\n/).pop() ?? "";
	const code = Number(lastLine.slice(0, 3));
	if (!expect.includes(code)) throw new Error(`SMTP error (expected ${expect.join("/")}, got ${code}): ${response.trim().slice(-300)}`);
	return response;
}
function b64(value) {
	return Buffer.from(value, "utf8").toString("base64");
}
/** Strip CR/LF and other control chars so a value can never inject headers/commands. */
function sanitizeHeaderValue(value) {
	return value.replace(/[\x00-\x1F\x7F]+/g, " ").trim();
}
var EMAIL_RE = /^[^\s@<>,;:"'\\]+@[^\s@<>,;:"'\\]+\.[^\s@<>,;:"'\\]+$/;
/** Validate a single recipient address; rejects CR/LF and malformed values. */
function assertAddress(value) {
	const addr = value.trim();
	if (!EMAIL_RE.test(addr)) throw new Error(`Invalid email address: ${addr.slice(0, 80)}`);
	return addr;
}
function encodeHeader(value) {
	const clean = sanitizeHeaderValue(value);
	return /^[\x00-\x7F]*$/.test(clean) ? clean : `=?UTF-8?B?${b64(clean)}?=`;
}
function buildMessageId(domain) {
	return `<${crypto.randomUUID()}@${domain}>`;
}
function buildMimeMessage(mail, messageId) {
	const boundary = `bnd_${crypto.randomUUID().replace(/-/g, "")}`;
	const from = assertAddress(mail.from);
	const to = mail.to.map(assertAddress);
	const cc = (mail.cc ?? []).map(assertAddress);
	const inReplyTo = mail.inReplyTo ? sanitizeHeaderValue(mail.inReplyTo) : null;
	const headers = [
		`From: ${mail.fromName ? `${encodeHeader(mail.fromName)} <${from}>` : from}`,
		`To: ${to.join(", ")}`,
		...cc.length ? [`Cc: ${cc.join(", ")}`] : [],
		`Subject: ${encodeHeader(mail.subject)}`,
		`Message-ID: ${messageId}`,
		...inReplyTo ? [`In-Reply-To: ${inReplyTo}`, `References: ${inReplyTo}`] : [],
		`Date: ${(/* @__PURE__ */ new Date()).toUTCString()}`,
		"MIME-Version: 1.0"
	];
	if (mail.html) {
		headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
		const body = [
			"",
			`--${boundary}`,
			"Content-Type: text/plain; charset=\"UTF-8\"",
			"",
			mail.text || mail.html.replace(/<[^>]+>/g, " "),
			`--${boundary}`,
			"Content-Type: text/html; charset=\"UTF-8\"",
			"",
			mail.html,
			`--${boundary}--`,
			""
		];
		return headers.join(CRLF) + CRLF + body.join(CRLF);
	}
	headers.push("Content-Type: text/plain; charset=\"UTF-8\"");
	return headers.join(CRLF) + "\r\n\r\n" + (mail.text ?? "") + CRLF;
}
async function sendSmtpMail(config, mail) {
	const envelopeFrom = assertAddress(config.username);
	const recipients = [...mail.to, ...mail.cc ?? []].map(assertAddress);
	if (recipients.length === 0) throw new Error("At least one recipient is required.");
	const socket = await connectTLS(config.host, config.port);
	try {
		await command(socket, null, [220]);
		await command(socket, `EHLO ${config.host}`, [250]);
		await command(socket, "AUTH LOGIN", [334]);
		await command(socket, b64(config.username), [334]);
		await command(socket, b64(config.password), [235]);
		await command(socket, `MAIL FROM:<${envelopeFrom}>`, [250]);
		for (const rcpt of recipients) await command(socket, `RCPT TO:<${rcpt}>`, [250, 251]);
		await command(socket, "DATA", [354]);
		const messageId = buildMessageId(assertAddress(mail.from).split("@")[1] || "localhost");
		await command(socket, buildMimeMessage(mail, messageId).split(/\r?\n/).map((line) => line.startsWith(".") ? "." + line : line).join(CRLF) + "\r\n.", [250]);
		try {
			await command(socket, "QUIT", [221]);
		} catch {}
		return { messageId };
	} finally {
		await socket.close();
	}
}
//#endregion
export { sendSmtpMail };
