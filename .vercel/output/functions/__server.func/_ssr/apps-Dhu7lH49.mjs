import { n as supabase } from "./client-B5YVWdzA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apps-Dhu7lH49.js
var db = supabase;
var APP_LAYOUTS = [
	{
		value: "classic",
		label: "Classic",
		hint: "Balanced HQ shell"
	},
	{
		value: "executive",
		label: "Executive",
		hint: "Graphite, wide, calm"
	},
	{
		value: "board",
		label: "Board",
		hint: "Airy, rounded, light rail"
	},
	{
		value: "rail",
		label: "Rail",
		hint: "Slim sidebar, dense lists"
	},
	{
		value: "industrial",
		label: "Industrial",
		hint: "Square, uppercase labels"
	},
	{
		value: "ops",
		label: "Ops",
		hint: "Dark chrome, mono, tight"
	},
	{
		value: "console",
		label: "Console",
		hint: "Flat terminal styling"
	}
];
var APP_OVERRIDE_KEY = "hq.app.override";
/** Hostnames that never carry a team subdomain (previews, local dev, apex). */
var NEUTRAL_HOSTS = [/^localhost$/, /^127\./];
/**
* Every workspace lives on the single HQ host. `?app=<slug>` selects it and is
* remembered per browser tab, so several workspaces can be open at once.
* A legacy team subdomain (eng.clovrlab.com) still resolves for compatibility.
*/
function resolveAppSlug() {
	if (typeof window === "undefined") return "hq";
	const { hostname, search } = window.location;
	const param = new URLSearchParams(search).get("app");
	if (param) {
		try {
			sessionStorage.setItem(APP_OVERRIDE_KEY, param);
		} catch {}
		return param;
	}
	let stored = null;
	try {
		stored = sessionStorage.getItem(APP_OVERRIDE_KEY);
	} catch {}
	if (stored) return stored;
	if (!NEUTRAL_HOSTS.some((re) => re.test(hostname))) {
		const parts = hostname.split(".");
		if (parts.length >= 3) {
			const label = parts[0].toLowerCase();
			if (label !== "www" && label !== "hq") return label;
		}
	}
	return "hq";
}
/**
* True when the person actually picked a workspace (query param, this tab's
* memory, or a legacy team subdomain). When false we are free to send them
* straight to the one workspace they belong to.
*/
function hasExplicitAppSelection() {
	if (typeof window === "undefined") return false;
	const { hostname, search } = window.location;
	if (new URLSearchParams(search).get("app")) return true;
	try {
		if (sessionStorage.getItem("hq.app.override")) return true;
	} catch {}
	if (NEUTRAL_HOSTS.some((re) => re.test(hostname))) return false;
	const parts = hostname.split(".");
	return parts.length >= 3 && !["www", "hq"].includes(parts[0].toLowerCase());
}
/** Remember a workspace for this browser tab. */
function rememberApp(subdomain) {
	try {
		sessionStorage.setItem(APP_OVERRIDE_KEY, subdomain);
	} catch {}
}
/** Root domain used to build cross-app links (clovrlab.com). */
function rootDomain() {
	if (typeof window === "undefined") return null;
	const { hostname } = window.location;
	if (NEUTRAL_HOSTS.some((re) => re.test(hostname))) return null;
	const parts = hostname.split(".");
	return parts.length >= 2 ? parts.slice(-2).join(".") : null;
}
/** Same-origin URL for a workspace — one host, `?app=` selects the workspace. */
function appUrl(app) {
	return `${app.landing_route}?app=${encodeURIComponent(app.subdomain)}`;
}
async function fetchApps() {
	const { data } = await db.from("org_apps").select("*").order("sort_order");
	return data ?? [];
}
async function saveApp(app) {
	if (app.id) {
		const { id, ...rest } = app;
		return db.from("org_apps").update(rest).eq("id", id);
	}
	return db.from("org_apps").insert(app);
}
async function deleteApp(id) {
	return db.from("org_apps").delete().eq("id", id);
}
//#endregion
export { hasExplicitAppSelection as a, rootDomain as c, fetchApps as i, saveApp as l, appUrl as n, rememberApp as o, deleteApp as r, resolveAppSlug as s, APP_LAYOUTS as t };
