import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { a as hasExplicitAppSelection, i as fetchApps, o as rememberApp, s as resolveAppSlug } from "./apps-2-64Dtxg.mjs";
import { t as useRouteAccess } from "./route-access-BIUVO0kB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-context-JK8H7_Nj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Each team app is visually its own product: own accent, own sidebar
* treatment, own layout personality. This paints the current app's identity
* onto the document so every HQ surface inherits it.
*/
function applyAppTheme(app) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.setAttribute("data-app", app?.slug ?? "hq");
	root.setAttribute("data-app-layout", app?.layout || "classic");
	const light = app?.accent;
	const dark = app?.accent_dark || app?.accent;
	if (!light) {
		for (const v of ["--app-accent", "--app-accent-dark"]) root.style.removeProperty(v);
		return;
	}
	root.style.setProperty("--app-accent", light);
	root.style.setProperty("--app-accent-dark", dark || light);
}
var Ctx = (0, import_react.createContext)({
	loading: true,
	slug: "hq",
	app: null,
	apps: [],
	permitted: [],
	denied: false,
	unknown: false
});
function useCurrentApp() {
	return (0, import_react.useContext)(Ctx);
}
/** Can this user enter the app? Hub + admins always yes; otherwise needs a role in the division. */
function canEnter(app, opts) {
	if (opts.isAdmin) return true;
	if (app.is_hub || !app.org_unit_id) return true;
	const slug = opts.unitSlugById.get(app.org_unit_id);
	return !!slug && opts.units.has(slug);
}
function CurrentAppProvider({ children }) {
	const access = useRouteAccess();
	const [apps, setApps] = (0, import_react.useState)([]);
	const [unitSlugById, setUnitSlugById] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const [loading, setLoading] = (0, import_react.useState)(true);
	const slug = resolveAppSlug();
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const list = await fetchApps();
			const { supabase } = await import("./client-PsXr_elE.mjs").then((n) => n.n).then((n) => n.t);
			const { data: units } = await supabase.from("org_units").select("id, slug");
			if (!alive) return;
			setApps(list);
			setUnitSlugById(new Map((units ?? []).map((u) => [u.id, u.slug])));
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, []);
	const matched = apps.find((a) => a.slug === slug || a.subdomain === slug) ?? null;
	const hub = apps.find((a) => a.is_hub) ?? null;
	const ready = !loading && !access.loading;
	const opts = {
		isAdmin: access.isAdmin,
		units: access.units,
		unitSlugById
	};
	const permitted = apps.filter((a) => a.enabled && canEnter(a, opts));
	const teamApps = permitted.filter((a) => !a.is_hub);
	const solo = !hasExplicitAppSelection() && teamApps.length === 1 ? teamApps[0] : null;
	const app = solo ?? matched;
	(0, import_react.useEffect)(() => {
		if (solo) rememberApp(solo.subdomain);
	}, [solo?.id]);
	(0, import_react.useEffect)(() => {
		applyAppTheme(app ?? hub);
	}, [
		app?.id,
		hub?.id,
		app?.accent,
		app?.layout
	]);
	const denied = ready && !solo && !!matched && (!matched.enabled || !canEnter(matched, opts));
	const unknown = ready && !solo && !matched;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			loading: !ready,
			slug,
			app: app ?? hub,
			apps,
			permitted,
			denied,
			unknown
		},
		children
	});
}
//#endregion
export { canEnter as n, useCurrentApp as r, CurrentAppProvider as t };
