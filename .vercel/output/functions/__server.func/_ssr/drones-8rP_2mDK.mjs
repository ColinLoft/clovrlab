import { n as supabase } from "./client-B5YVWdzA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drones-8rP_2mDK.js
async function fetchDrones() {
	const { data, error } = await supabase.from("net_drones").select("id, tail_number, status, battery_pct, retardant_l, flight_hours, last_lat, last_lng, heading_deg, next_service_at, notes, base:net_bases(id, code, name, lat, lng), airframe:net_airframes(id, model, manufacturer, range_mi, cruise_speed_mph, retardant_capacity_l)").order("tail_number");
	if (error) throw error;
	return data ?? [];
}
async function fetchBases() {
	const { data, error } = await supabase.from("net_bases").select("id, code, name, lat, lng, city, state, hangar_capacity, is_hq").order("name");
	if (error) throw error;
	return data ?? [];
}
var STATUS_META = {
	ready: {
		label: "Ready",
		color: "#22c55e",
		dot: "bg-emerald-400"
	},
	preflight: {
		label: "Pre-flight",
		color: "#84cc16",
		dot: "bg-lime-400"
	},
	inflight: {
		label: "In-flight",
		color: "#f4a261",
		dot: "bg-orange-400"
	},
	returning: {
		label: "Returning",
		color: "#fbbf24",
		dot: "bg-amber-400"
	},
	charging: {
		label: "Charging",
		color: "#22d3ee",
		dot: "bg-cyan-400"
	},
	maintenance: {
		label: "Maintenance",
		color: "#a78bfa",
		dot: "bg-violet-400"
	},
	offline: {
		label: "Offline",
		color: "#64748b",
		dot: "bg-slate-500"
	}
};
//#endregion
export { fetchBases as n, fetchDrones as r, STATUS_META as t };
