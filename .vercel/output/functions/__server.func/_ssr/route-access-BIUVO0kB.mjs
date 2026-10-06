import { i as __toESM } from "../_runtime.mjs";
import { r as supabase } from "./client-PsXr_elE.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-access-BIUVO0kB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Resolves the current user's page access from the org permission engine:
* default team role → assigned roles → per-person overrides. Admins are
* unrestricted. Falls back to the legacy custom-role mapping if the RPC
* returns nothing.
*/
function useRouteAccess() {
	const [state, setState] = (0, import_react.useState)({
		loading: true,
		isAdmin: false,
		allowed: null,
		suspended: false,
		units: /* @__PURE__ */ new Set()
	});
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) {
				if (alive) setState({
					loading: false,
					isAdmin: false,
					allowed: /* @__PURE__ */ new Set(),
					suspended: false,
					units: /* @__PURE__ */ new Set()
				});
				return;
			}
			const uid = u.user.id;
			const [accessRes, legacy, suspRes] = await Promise.all([
				supabase.rpc("my_access"),
				supabase.from("user_custom_roles").select("role_id, custom_roles(permissions)").eq("user_id", uid),
				supabase.from("hr_suspensions").select("id, ends_at").eq("user_id", uid).eq("active", true).lte("starts_at", (/* @__PURE__ */ new Date()).toISOString()).limit(50)
			]);
			const access = accessRes?.data ?? null;
			const legacyAdmin = (legacy.data ?? []).some((r) => r?.custom_roles?.permissions?.admin);
			const isAdmin = !!access?.is_admin || legacyAdmin;
			let allowed = null;
			if (!isAdmin) {
				const routes = access?.routes ?? [];
				allowed = /* @__PURE__ */ new Set([
					...routes,
					"/meetings",
					"/phone",
					"/meeting-notes"
				]);
			}
			const now = Date.now();
			const suspended = (suspRes.data ?? []).some((s) => !s.ends_at || new Date(s.ends_at).getTime() > now);
			if (alive) setState({
				loading: false,
				isAdmin,
				allowed,
				suspended,
				units: new Set(access?.units ?? [])
			});
		})();
		return () => {
			alive = false;
		};
	}, []);
	return state;
}
//#endregion
export { useRouteAccess as t };
