import { r as supabase } from "./client-PsXr_elE.mjs";
import { n as logDetectionEvent } from "./detection-log-Ch9n7bMa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/incidents-m7NY0JN5.js
var RESOLUTIONS = [
	{
		value: "confirmed_fire",
		label: "Confirmed fire — responders dispatched"
	},
	{
		value: "controlled_burn",
		label: "Controlled / prescribed burn"
	},
	{
		value: "no_fire",
		label: "No fire found on scene"
	},
	{
		value: "false_positive",
		label: "False positive (cloud, dust, glare)"
	},
	{
		value: "duplicate",
		label: "Duplicate of another incident"
	},
	{
		value: "other",
		label: "Other"
	}
];
var STATUS_META = {
	new: {
		label: "New",
		color: "#ef4444"
	},
	triaging: {
		label: "Triaging",
		color: "#f59e0b"
	},
	dispatched: {
		label: "Dispatched",
		color: "#3b82f6"
	},
	onscene: {
		label: "On Scene",
		color: "#22c55e"
	},
	contained: {
		label: "Contained",
		color: "#06b6d4"
	},
	closed: {
		label: "Closed",
		color: "#64748b"
	},
	false_positive: {
		label: "False Positive",
		color: "#475569"
	}
};
var PRIORITY_META = {
	p1: {
		label: "P1",
		color: "#ef4444"
	},
	p2: {
		label: "P2",
		color: "#f97316"
	},
	p3: {
		label: "P3",
		color: "#eab308"
	},
	p4: {
		label: "P4",
		color: "#64748b"
	}
};
async function fetchIncidents() {
	const { data, error } = await supabase.from("net_incidents").select("*").order("discovered_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchIncidentEvents(incidentId) {
	const { data, error } = await supabase.from("net_incident_events").select("*").eq("incident_id", incidentId).order("created_at", { ascending: false }).limit(50);
	if (error) throw error;
	return data ?? [];
}
async function createIncidentFromHotspot(input) {
	const priority = (input.frp ?? 0) > 50 ? "p1" : (input.frp ?? 0) > 20 ? "p2" : "p3";
	const conf = input.confidence === "h" ? 90 : input.confidence === "n" ? 65 : input.confidence === "l" ? 35 : null;
	const title = input.title ?? `FIRMS detection ${input.lat.toFixed(3)}, ${input.lng.toFixed(3)}`;
	const { data: area } = await supabase.from("net_response_area").select("*").eq("id", true).single();
	if (area) {
		const R = 3958.8;
		const toRad = (x) => x * Math.PI / 180;
		const dLat = toRad(input.lat - Number(area.center_lat));
		const dLng = toRad(input.lng - Number(area.center_lng));
		const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(Number(area.center_lat))) * Math.cos(toRad(input.lat)) * Math.sin(dLng / 2) ** 2;
		const dist = 2 * R * Math.asin(Math.sqrt(s));
		const inRadius = Number(area.radius_mi) > 0 && dist <= Number(area.radius_mi);
		if (!inRadius && (area.states?.length ?? 0) === 0 && (area.counties?.length ?? 0) === 0) throw new Error("Location is outside the configured detection area. Update Settings → Detection area.");
		if (!inRadius && (area.states?.length ?? 0) > 0) {}
	}
	const { data, error } = await supabase.from("net_incidents").insert({
		title,
		source: input.source ?? "firms",
		status: "new",
		priority,
		confidence: conf,
		lat: input.lat,
		lng: input.lng,
		frp: input.frp ?? null
	}).select("*").single();
	if (error) throw error;
	await supabase.from("net_incident_events").insert({
		incident_id: data.id,
		event_type: "created",
		message: `Incident opened from ${input.source ?? "firms"}`
	});
	return data;
}
async function updateIncidentStatus(id, status) {
	const { error } = await supabase.from("net_incidents").update({ status }).eq("id", id);
	if (error) throw error;
	await supabase.from("net_incident_events").insert({
		incident_id: id,
		event_type: "status_change",
		message: `Status → ${status}`
	});
	await logDetectionEvent({
		kind: "incident_status",
		incident_id: id,
		message: `Operator set incident status to ${STATUS_META[status]?.label ?? status}`
	});
}
async function logEvent(id, type, message) {
	const { data: u } = await supabase.auth.getUser();
	await supabase.from("net_incident_events").insert({
		incident_id: id,
		event_type: type,
		message,
		actor: u.user?.id ?? null
	});
}
async function fetchIncidentMedia(incidentId) {
	const { data, error } = await supabase.from("net_incident_media").select("*").eq("incident_id", incidentId).order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function addIncidentMedia(incidentId, input) {
	const { data: u } = await supabase.auth.getUser();
	const { error } = await supabase.from("net_incident_media").insert({
		incident_id: incidentId,
		url: input.url,
		kind: input.kind ?? "photo",
		caption: input.caption ?? null,
		created_by: u.user?.id ?? null
	});
	if (error) throw error;
	await logEvent(incidentId, "media_added", `Attachment added${input.caption ? ` — ${input.caption}` : ""}`);
}
async function deleteIncidentMedia(id) {
	const { error } = await supabase.from("net_incident_media").delete().eq("id", id);
	if (error) throw error;
}
async function addIncidentNote(incidentId, message) {
	await logEvent(incidentId, "note", message);
}
async function resolveIncident(id, input) {
	const { data: u } = await supabase.auth.getUser();
	const status = input.status ?? (input.resolution === "false_positive" ? "false_positive" : "contained");
	const { error } = await supabase.from("net_incidents").update({
		status,
		resolution: input.resolution,
		resolution_notes: input.notes,
		resolved_by: u.user?.id ?? null
	}).eq("id", id);
	if (error) throw error;
	await logEvent(id, "resolved", `Resolved as ${input.resolution.replace(/_/g, " ")}${input.notes ? ` — ${input.notes}` : ""}`);
	await logDetectionEvent({
		kind: "incident_status",
		incident_id: id,
		message: `Incident resolved (${input.resolution})`
	});
}
async function closeIncident(id) {
	const { error } = await supabase.from("net_incidents").update({ status: "closed" }).eq("id", id);
	if (error) throw error;
	await logEvent(id, "closed", "Incident closed — camera returns to normal sweeping");
	await logDetectionEvent({
		kind: "incident_status",
		incident_id: id,
		message: "Incident closed"
	});
}
async function reopenIncident(id) {
	const { error } = await supabase.from("net_incidents").update({
		status: "triaging",
		closed_at: null,
		closed_by: null
	}).eq("id", id);
	if (error) throw error;
	await logEvent(id, "reopened", "Incident reopened");
}
async function saveIncidentReview(id, review) {
	const { data: u } = await supabase.auth.getUser();
	const { error } = await supabase.from("net_incidents").update({
		...review,
		review_completed_at: (/* @__PURE__ */ new Date()).toISOString(),
		review_by: u.user?.id ?? null
	}).eq("id", id);
	if (error) throw error;
	await logEvent(id, "review", "Post-incident review completed");
}
async function setIncidentHighRisk(id, high) {
	const { error } = await supabase.from("net_incidents").update({ high_risk: high }).eq("id", id);
	if (error) throw error;
	await logEvent(id, "flag", high ? "Flagged high risk" : "High-risk flag cleared");
}
//#endregion
export { addIncidentNote as a, deleteIncidentMedia as c, fetchIncidents as d, reopenIncident as f, updateIncidentStatus as g, setIncidentHighRisk as h, addIncidentMedia as i, fetchIncidentEvents as l, saveIncidentReview as m, RESOLUTIONS as n, closeIncident as o, resolveIncident as p, STATUS_META as r, createIncidentFromHotspot as s, PRIORITY_META as t, fetchIncidentMedia as u };
