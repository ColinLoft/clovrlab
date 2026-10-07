import { n as supabase } from "./client-B5YVWdzA.mjs";
import { n as navGroups } from "./nav-config-BQNdxmMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/org-CNsh9lrJ.js
var db = supabase;
/** Every page in the app that can be permissioned, grouped for the matrix UI. */
var ROUTE_CATALOG = navGroups.map((g) => ({
	label: g.label,
	routes: g.items.map((i) => ({
		to: i.to,
		label: i.label
	}))
}));
Array.from(new Set(navGroups.flatMap((g) => g.items.map((i) => i.to))));
async function loadOrg() {
	const [units, roles, routes, people] = await Promise.all([
		db.from("org_units").select("*").order("sort_order"),
		db.from("org_roles").select("*").order("position"),
		db.from("org_role_routes").select("role_id, route"),
		db.from("profiles").select("id, full_name, email, title, org_unit_id").order("full_name")
	]);
	return {
		units: units.data ?? [],
		roles: roles.data ?? [],
		routes: routes.data ?? [],
		people: people.data ?? []
	};
}
function buildTree(units) {
	const byParent = /* @__PURE__ */ new Map();
	for (const u of units) {
		const key = u.parent_id;
		if (!byParent.has(key)) byParent.set(key, []);
		byParent.get(key).push(u);
	}
	for (const list of byParent.values()) list.sort((a, b) => a.sort_order - b.sort_order);
	return byParent;
}
async function setRoleRoute(roleId, route, on) {
	if (on) await db.from("org_role_routes").upsert({
		role_id: roleId,
		route
	}, { onConflict: "role_id,route" });
	else await db.from("org_role_routes").delete().eq("role_id", roleId).eq("route", route);
}
async function assignUserUnit(userId, unitId) {
	await db.from("profiles").update({ org_unit_id: unitId }).eq("id", userId);
	await db.from("hr_employees").update({ org_unit_id: unitId }).eq("user_id", userId);
}
async function setUserRole(userId, roleId, on) {
	if (on) await db.from("user_org_roles").upsert({
		user_id: userId,
		role_id: roleId
	}, { onConflict: "user_id,role_id" });
	else await db.from("user_org_roles").delete().eq("user_id", userId).eq("role_id", roleId);
}
async function setUserOverride(userId, route, granted) {
	if (granted === null) await db.from("user_route_overrides").delete().eq("user_id", userId).eq("route", route);
	else await db.from("user_route_overrides").upsert({
		user_id: userId,
		route,
		granted
	}, { onConflict: "user_id,route" });
}
function slugify(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
//#endregion
export { setRoleRoute as a, slugify as c, loadOrg as i, assignUserUnit as n, setUserOverride as o, buildTree as r, setUserRole as s, ROUTE_CATALOG as t };
