import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { n as supabase } from "./client-B5YVWdzA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prefs-CI_11sXZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var KEY = "hq-theme";
function getStoredTheme() {
	if (typeof window === "undefined") return "light";
	const v = window.localStorage.getItem(KEY);
	return v === "light" || v === "dark" || v === "system" ? v : "light";
}
function resolveTheme(t) {
	if (t === "system" && typeof window !== "undefined") return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	return t === "light" ? "light" : "dark";
}
function applyTheme(t) {
	if (typeof document === "undefined") return;
	const resolved = resolveTheme(t);
	const root = document.documentElement;
	if (resolved === "dark") root.classList.add("dark");
	else root.classList.remove("dark");
}
function setStoredTheme(t) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, t);
	applyTheme(t);
}
function useHQTheme() {
	const [theme, setTheme] = (0, import_react.useState)(() => getStoredTheme());
	(0, import_react.useEffect)(() => {
		applyTheme(theme);
	}, [theme]);
	const update = (t) => {
		setStoredTheme(t);
		setTheme(t);
	};
	return {
		theme,
		setTheme: update
	};
}
var DEFAULT_PREFS = {
	density: "comfortable",
	accent: "orange",
	language: "en",
	timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Los_Angeles",
	timeFormat: "12h",
	weekStart: "sunday",
	notifyEmail: true,
	notifyDesktop: true,
	notifyMentions: true,
	notifyAnnouncements: true,
	notifyDigest: "daily",
	soundOn: true,
	pagerSound: true,
	sidebarCollapsed: false,
	showKeyboardHints: true,
	betaFeatures: false
};
var PREF_KEY = "hq-prefs";
var ACCENTS = {
	orange: "18 92% 55%",
	blue: "212 92% 58%",
	green: "152 62% 42%",
	violet: "266 78% 62%"
};
/** Synchronous cached read (localStorage) so the UI never flashes defaults. */
function cachedPrefs() {
	if (typeof window === "undefined") return DEFAULT_PREFS;
	try {
		const raw = window.localStorage.getItem(PREF_KEY);
		return raw ? {
			...DEFAULT_PREFS,
			...JSON.parse(raw)
		} : DEFAULT_PREFS;
	} catch {
		return DEFAULT_PREFS;
	}
}
/** Applies the visual preferences to the document so they actually do something. */
function applyPrefs(p) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.dataset["density"] = p.density;
	root.style.setProperty("--primary", ACCENTS[p.accent] ?? ACCENTS.orange);
	root.style.setProperty("--ring", ACCENTS[p.accent] ?? ACCENTS.orange);
	root.style.setProperty("--hq-density-scale", p.density === "compact" ? "0.9" : "1");
}
/** Loads from the account, falling back to the local cache when offline. */
async function loadPrefs() {
	const local = cachedPrefs();
	try {
		const { data: u } = await supabase.auth.getUser();
		const uid = u.user?.id;
		if (!uid) return local;
		const { data } = await supabase.from("user_prefs").select("prefs").eq("user_id", uid).maybeSingle();
		const merged = {
			...DEFAULT_PREFS,
			...local,
			...data?.prefs ?? {}
		};
		try {
			window.localStorage.setItem(PREF_KEY, JSON.stringify(merged));
		} catch {}
		return merged;
	} catch {
		return local;
	}
}
/** Persists to the account (and the local cache). Throws when the write is rejected. */
async function savePrefs(p) {
	try {
		window.localStorage.setItem(PREF_KEY, JSON.stringify(p));
	} catch {}
	const { data: u } = await supabase.auth.getUser();
	const uid = u.user?.id;
	if (!uid) throw new Error("You need to be signed in to save settings.");
	const { data, error } = await supabase.from("user_prefs").upsert({
		user_id: uid,
		prefs: p
	}, { onConflict: "user_id" }).select().maybeSingle();
	if (error) throw error;
	if (!data) throw new Error("Settings were not saved — please try again.");
}
//#endregion
export { loadPrefs as a, useHQTheme as c, getStoredTheme as i, applyTheme as n, resolveTheme as o, cachedPrefs as r, savePrefs as s, applyPrefs as t };
