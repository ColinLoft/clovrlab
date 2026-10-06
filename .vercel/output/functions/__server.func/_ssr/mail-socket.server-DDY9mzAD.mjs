//#region node_modules/.nitro/vite/services/ssr/assets/mail-socket.server-DDY9mzAD.js
async function cloudflareSocket(host, port) {
	try {
		const socket = (await import(
			/* @vite-ignore */
			"cloudflare:sockets"
)).connect({
			hostname: host,
			port
		}, {
			secureTransport: "on",
			allowHalfOpen: false
		});
		const reader = socket.readable.getReader();
		const writer = socket.writable.getWriter();
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();
		return {
			write: async (data) => {
				await writer.write(encoder.encode(data));
			},
			read: async () => {
				const { value, done } = await reader.read();
				if (done) return null;
				return decoder.decode(value);
			},
			close: async () => {
				try {
					reader.releaseLock();
				} catch {}
				try {
					await writer.close();
				} catch {}
				try {
					await socket.close();
				} catch {}
			}
		};
	} catch {
		return null;
	}
}
async function nodeSocket(host, port) {
	const socket = (await import("node:tls")).connect({
		host,
		port,
		servername: host,
		rejectUnauthorized: true
	});
	const chunks = [];
	let waiter = null;
	let closed = false;
	socket.setEncoding("utf8");
	socket.on("data", (d) => {
		if (waiter) {
			const w = waiter;
			waiter = null;
			w(d);
		} else chunks.push(d);
	});
	const finish = () => {
		closed = true;
		if (waiter) {
			const w = waiter;
			waiter = null;
			w(null);
		}
	};
	socket.on("end", finish);
	socket.on("close", finish);
	socket.on("error", finish);
	await new Promise((resolve, reject) => {
		socket.once("secureConnect", () => resolve());
		socket.once("error", (e) => reject(e));
	});
	return {
		write: async (data) => {
			socket.write(data);
		},
		read: () => new Promise((resolve) => {
			if (chunks.length) return resolve(chunks.shift());
			if (closed) return resolve(null);
			waiter = resolve;
		}),
		close: async () => {
			try {
				socket.end();
				socket.destroy();
			} catch {}
		}
	};
}
async function connectTLS(host, port) {
	const cf = await cloudflareSocket(host, port);
	if (cf) return cf;
	return nodeSocket(host, port);
}
/** Reads until `predicate(buffer)` is true, or the timeout elapses. */
async function readUntil(socket, predicate, timeoutMs = 2e4) {
	let buffer = "";
	const deadline = Date.now() + timeoutMs;
	while (!predicate(buffer)) {
		if (Date.now() > deadline) throw new Error(`Mail server timed out. Received: ${buffer.slice(-300)}`);
		const chunk = await socket.read();
		if (chunk === null) break;
		buffer += chunk;
	}
	return buffer;
}
//#endregion
export { readUntil as n, connectTLS as t };
