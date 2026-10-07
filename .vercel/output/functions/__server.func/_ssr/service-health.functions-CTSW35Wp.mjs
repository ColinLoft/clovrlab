import { r as createServerFn } from "./server-DjCj4rPg.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DJmRtREQ.mjs";
import { t as createServerRpc } from "./createServerRpc-nqu-4SJ1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-health.functions-CTSW35Wp.js
async function assertAdmin(context) {
	const { data: roles, error } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	if (!(roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin")) throw new Error("Only administrators can view service health");
}
async function timed(fn) {
	const start = Date.now();
	try {
		await fn();
		return {
			ms: Date.now() - start,
			error: null
		};
	} catch (err) {
		return {
			ms: Date.now() - start,
			error: err?.message ?? "Unknown error"
		};
	}
}
function classify(ms, error, slow = 800) {
	if (error) return "down";
	return ms > slow ? "degraded" : "operational";
}
async function verifyResend(key) {
	if ((await fetch("https://api.resend.com/emails", { headers: { Authorization: `Bearer ${key}` } })).status === 401) throw new Error("Invalid Resend API key");
}
async function verifySlack(key) {
	const json = await (await fetch("https://slack.com/api/auth.test", {
		method: "POST",
		headers: { Authorization: `Bearer ${key}` }
	})).json();
	if (!json.ok) throw new Error(json.error ?? "Invalid Slack token");
}
var getServiceHealth_createServerFn_handler = createServerRpc({
	id: "b9ca9f8e84e6c79025499add8e7bb63bf87656c4380c520a728c251e32ee12cf",
	name: "getServiceHealth",
	filename: "src/lib/hq/service-health.functions.ts"
}, (opts) => getServiceHealth.__executeServer(opts));
var getServiceHealth = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getServiceHealth_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const supabaseUrl = process.env["SUPABASE_URL"];
	const probes = [];
	const db = await timed(async () => {
		const { error } = await context.supabase.from("org_apps").select("id", {
			count: "exact",
			head: true
		});
		if (error) throw new Error(error.message);
	});
	probes.push({
		key: "database",
		label: "Database",
		status: classify(db.ms, db.error, 600),
		latencyMs: db.ms,
		detail: db.error ?? "Read query succeeded"
	});
	const auth = await timed(async () => {
		if (!supabaseUrl) throw new Error("Backend URL not configured");
		const res = await fetch(`${supabaseUrl}/auth/v1/health`, { headers: { apikey: process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "" } });
		if (!res.ok) throw new Error(`Auth health responded ${res.status}`);
	});
	probes.push({
		key: "auth",
		label: "Authentication",
		status: classify(auth.ms, auth.error),
		latencyMs: auth.ms,
		detail: auth.error ?? "Sign-in service reachable"
	});
	const storage = await timed(async () => {
		if (!supabaseUrl) throw new Error("Backend URL not configured");
		const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "";
		const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, { headers: {
			apikey: key,
			Authorization: `Bearer ${key}`
		} });
		if (res.status >= 500) throw new Error(`Storage responded ${res.status}`);
	});
	probes.push({
		key: "storage",
		label: "File storage",
		status: classify(storage.ms, storage.error),
		latencyMs: storage.ms,
		detail: storage.error ?? "Storage endpoint reachable"
	});
	const resendKey = process.env["RESEND_API_KEY"];
	if (!resendKey) probes.push({
		key: "email",
		label: "Email delivery",
		status: "not_configured",
		latencyMs: null,
		detail: "Resend is not linked"
	});
	else {
		const email = await timed(() => verifyResend(resendKey));
		probes.push({
			key: "email",
			label: "Email delivery",
			status: classify(email.ms, email.error, 1500),
			latencyMs: email.ms,
			detail: email.error ?? "Resend credentials verified"
		});
	}
	const slackKey = process.env["SLACK_API_KEY"];
	if (!slackKey) probes.push({
		key: "slack",
		label: "Slack bot",
		status: "not_configured",
		latencyMs: null,
		detail: "Slack is not connected"
	});
	else {
		const slack = await timed(() => verifySlack(slackKey));
		probes.push({
			key: "slack",
			label: "Slack bot",
			status: classify(slack.ms, slack.error, 1500),
			latencyMs: slack.ms,
			detail: slack.error ?? "Bot token verified"
		});
	}
	probes.push({
		key: "ai",
		label: "AI provider",
		status: process.env["OPENROUTER_API_KEY"] ? "operational" : "not_configured",
		latencyMs: null,
		detail: process.env["OPENROUTER_API_KEY"] ? "OpenRouter key present" : "No OpenRouter key"
	});
	const dayAgo = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString();
	const weekAgo = (/* @__PURE__ */ new Date(Date.now() - 6048e5)).toISOString();
	const [recent, day, week] = await Promise.all([
		context.supabase.from("sys_error_log").select("id, service, path, method, status, message, created_at").order("created_at", { ascending: false }).limit(25),
		context.supabase.from("sys_error_log").select("created_at").gte("created_at", dayAgo).limit(2e3),
		context.supabase.from("sys_error_log").select("id", {
			count: "exact",
			head: true
		}).gte("created_at", weekAgo)
	]);
	const hoursWithErrors = new Set((day.data ?? []).map((r) => new Date(r.created_at).toISOString().slice(0, 13)));
	const uptime24h = Math.round((24 - Math.min(24, hoursWithErrors.size)) / 24 * 1e3) / 10;
	return {
		checkedAt: (/* @__PURE__ */ new Date()).toISOString(),
		probes,
		errors24h: (day.data ?? []).length,
		errors7d: week.count ?? 0,
		uptime24h,
		recentErrors: recent.data ?? []
	};
});
//#endregion
export { getServiceHealth_createServerFn_handler };
