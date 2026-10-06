import { n as readUntil, t as connectTLS } from "./mail-socket.server-DDY9mzAD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/imap.server-DpQEZuk2.js
var CRLF = "\r\n";
function decodeMimeWords(value) {
	return value.replace(/=\?([^?]+)\?([bBqQ])\?([^?]*)\?=/g, (_m, _cs, enc, text) => {
		try {
			if (enc.toLowerCase() === "b") return Buffer.from(text, "base64").toString("utf8");
			return text.replace(/_/g, " ").replace(/=([A-Fa-f0-9]{2})/g, (_x, h) => String.fromCharCode(parseInt(h, 16)));
		} catch {
			return text;
		}
	});
}
var ImapClient = class {
	socket = null;
	counter = 0;
	async connect(config) {
		this.socket = await connectTLS(config.host, config.port);
		await readUntil(this.socket, (b) => /\r?\n$/.test(b) && /^\* (OK|PREAUTH)/.test(b));
		await this.run(`LOGIN "${config.username}" "${config.password.replace(/(["\\])/g, "\\$1")}"`);
	}
	async run(command) {
		if (!this.socket) throw new Error("IMAP socket is not connected");
		const tag = `a${++this.counter}`;
		await this.socket.write(`${tag} ${command}${CRLF}`);
		const response = await readUntil(this.socket, (b) => new RegExp(`^${tag} (OK|NO|BAD)`, "m").test(b) && /\r?\n$/.test(b));
		const status = response.match(new RegExp(`^${tag} (OK|NO|BAD)(.*)$`, "m"));
		if (status && status[1] !== "OK") throw new Error(`IMAP ${status[1]}:${status[2]}`);
		return response;
	}
	async selectMailbox(mailbox = "INBOX") {
		return this.run(`SELECT "${mailbox}"`);
	}
	async recentUids(limit) {
		return ((await this.run("UID SEARCH ALL")).split(/\r?\n/).find((l) => l.startsWith("* SEARCH")) ?? "").replace("* SEARCH", "").trim().split(/\s+/).filter(Boolean).slice(-limit);
	}
	async fetchMessage(uid) {
		const response = await this.run(`UID FETCH ${uid} (BODY.PEEK[HEADER.FIELDS (FROM TO CC SUBJECT DATE MESSAGE-ID)] BODY.PEEK[TEXT])`);
		const headerBlock = extractLiteral(response, 0);
		const textBlock = extractLiteral(response, 1);
		if (headerBlock === null) return null;
		const header = (name) => {
			const match = headerBlock.match(new RegExp(`^${name}:\\s*([\\s\\S]*?)(?=\\r?\\n[A-Za-z-]+:|$)`, "im"));
			return match ? decodeMimeWords(match[1].replace(/\r?\n\s+/g, " ").trim()) : null;
		};
		return {
			uid,
			messageId: header("Message-ID"),
			from: header("From"),
			to: header("To"),
			cc: header("Cc"),
			subject: header("Subject") ?? "(no subject)",
			date: header("Date"),
			body: (textBlock ?? "").trim().slice(0, 2e4)
		};
	}
	async close() {
		try {
			if (this.socket) await this.run("LOGOUT");
		} catch {}
		try {
			await this.socket?.close();
		} catch {}
		this.socket = null;
	}
};
/** Pulls the nth `{size}\r\n<payload>` literal out of an IMAP response. */
function extractLiteral(response, index) {
	const regex = /\{(\d+)\}\r?\n/g;
	let match;
	let seen = 0;
	while (match = regex.exec(response)) {
		const size = Number(match[1]);
		const start = match.index + match[0].length;
		if (seen === index) return response.slice(start, start + size);
		seen += 1;
		regex.lastIndex = start + size;
	}
	return null;
}
//#endregion
export { ImapClient };
