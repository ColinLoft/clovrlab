import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/mail-crypto.server-G7kO31Z9.js
function key() {
	const raw = process.env["EMAIL_ACCOUNT_KEY_SECRET"];
	if (!raw) throw new Error("EMAIL_ACCOUNT_KEY_SECRET is not set");
	return createHash("sha256").update(raw).digest();
}
function encryptMailPassword(plaintext) {
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", key(), iv);
	const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
	return Buffer.concat([
		iv,
		cipher.getAuthTag(),
		ct
	]).toString("base64");
}
function decryptMailPassword(stored) {
	const buf = Buffer.from(stored, "base64");
	const decipher = createDecipheriv("aes-256-gcm", key(), buf.subarray(0, 12));
	decipher.setAuthTag(buf.subarray(12, 28));
	return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString("utf8");
}
//#endregion
export { decryptMailPassword, encryptMailPassword };
