import { r as supabase } from "./client-PsXr_elE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paging-Ce037zhk.js
/** Page kinds, split by which console owns the response. */
var QUEUE_KINDS = {
	ops: [
		{
			value: "detection",
			label: "Fire / smoke detection"
		},
		{
			value: "incident",
			label: "New incident"
		},
		{
			value: "fleet",
			label: "Aircraft or fleet emergency"
		},
		{
			value: "airspace",
			label: "Airspace conflict"
		},
		{
			value: "manual",
			label: "Manual page"
		}
	],
	systems: [
		{
			value: "system",
			label: "Service or platform outage"
		},
		{
			value: "infrastructure",
			label: "Infrastructure failure"
		},
		{
			value: "security",
			label: "Security event"
		},
		{
			value: "integration",
			label: "Integration / data feed down"
		},
		{
			value: "manual",
			label: "Manual page"
		}
	]
};
[...QUEUE_KINDS.ops, ...QUEUE_KINDS.systems.filter((k) => k.value !== "manual")];
var TICKET_STATUSES = [
	{
		value: "open",
		label: "Open"
	},
	{
		value: "investigating",
		label: "Investigating"
	},
	{
		value: "mitigated",
		label: "Mitigated"
	},
	{
		value: "closed",
		label: "Closed"
	}
];
var QUEUE_LABEL = {
	ops: "Mission Operations",
	systems: "Enterprise Systems"
};
var db = supabase;
async function fetchPages(status, limit = 60, queue) {
	let q = db.from("page_alerts").select("*").order("created_at", { ascending: false }).limit(limit);
	if (queue) q = q.eq("queue", queue);
	if (status === "active") q = q.in("status", ["open", "acked"]);
	else if (status) q = q.eq("status", status);
	const { data, error } = await q;
	if (error) throw error;
	return data ?? [];
}
/** Pages currently targeted at me that still need a human response. */
async function fetchMyLivePages() {
	const { data: u } = await supabase.auth.getUser();
	const uid = u.user?.id;
	if (!uid) return [];
	const { data: targets } = await db.from("page_targets").select("alert_id").eq("user_id", uid);
	const ids = (targets ?? []).map((t) => t.alert_id);
	if (!ids.length) return [];
	const { data } = await db.from("page_alerts").select("*").in("id", ids).eq("status", "open").order("created_at", { ascending: false }).limit(10);
	return data ?? [];
}
async function ackPage(id) {
	const { error } = await db.rpc("ack_page", { _alert_id: id });
	if (error) throw error;
}
async function resolvePage(id) {
	const { error } = await db.rpc("resolve_page", { _alert_id: id });
	if (error) throw error;
}
async function raisePage(input) {
	const { data, error } = await db.rpc("raise_page", {
		_kind: input.kind,
		_title: input.title,
		_body: input.body ?? null,
		_link: input.link ?? null,
		_severity: input.severity ?? "critical",
		_source_table: null,
		_source_id: null,
		_queue: input.queue ?? null
	});
	if (error) throw error;
	return data;
}
async function fetchTickets(queue, limit = 100) {
	let q = db.from("page_tickets").select("*").order("opened_at", { ascending: false }).limit(limit);
	if (queue) q = q.eq("queue", queue);
	const { data, error } = await q;
	if (error) throw error;
	return data ?? [];
}
async function fetchTicketNotes(ticketIds) {
	if (!ticketIds.length) return [];
	const { data, error } = await db.from("page_ticket_notes").select("*").in("ticket_id", ticketIds).order("created_at");
	if (error) throw error;
	return data ?? [];
}
async function saveTicket(patch) {
	const body = { ...patch };
	if (patch.status === "closed" && !patch.closed_at) body.closed_at = (/* @__PURE__ */ new Date()).toISOString();
	if (patch.status && patch.status !== "closed") body.closed_at = null;
	const { data, error } = await db.from("page_tickets").update(body).eq("id", patch.id).select().maybeSingle();
	if (error) throw error;
	if (!data) throw new Error("Nothing saved — you need staff access to edit tickets.");
	return data;
}
async function createTicket(input) {
	const { data: u } = await supabase.auth.getUser();
	const { data, error } = await db.from("page_tickets").insert({
		queue: input.queue,
		title: input.title,
		summary: input.summary ?? null,
		kind: input.kind ?? "manual",
		severity: input.severity ?? "high",
		created_by: u.user?.id ?? null
	}).select().maybeSingle();
	if (error) throw error;
	return data;
}
async function addTicketNote(ticket_id, body) {
	const { data: u } = await supabase.auth.getUser();
	const { error } = await db.from("page_ticket_notes").insert({
		ticket_id,
		body,
		author_id: u.user?.id ?? null
	});
	if (error) throw error;
}
async function fetchRotations(queue) {
	let q = db.from("oncall_rotations").select("*").order("created_at");
	if (queue) q = q.eq("queue", queue);
	const { data, error } = await q;
	if (error) throw error;
	return data ?? [];
}
async function fetchRotationMembers() {
	const { data, error } = await db.from("oncall_members").select("*").order("tier");
	if (error) throw error;
	return data ?? [];
}
async function saveRotation(patch) {
	const { data, error } = await db.from("oncall_rotations").upsert(patch).select().maybeSingle();
	if (error) throw error;
	if (!data) throw new Error("Nothing saved — you need admin access to change rotations.");
	return data;
}
async function deleteRotation(id) {
	const { error } = await db.from("oncall_rotations").delete().eq("id", id);
	if (error) throw error;
}
async function addRotationMember(rotation_id, user_id, tier) {
	const { data, error } = await db.from("oncall_members").upsert({
		rotation_id,
		user_id,
		tier
	}).select().maybeSingle();
	if (error) throw error;
	if (!data) throw new Error("Nothing saved — admin access is required to edit the roster.");
	return data;
}
async function removeRotationMember(id) {
	const { error } = await db.from("oncall_members").delete().eq("id", id);
	if (error) throw error;
}
/** Everything the paging worker attempted, newest first. */
async function fetchDeliveries(limit = 120, alertId) {
	let q = db.from("page_deliveries").select("*").order("created_at", { ascending: false }).limit(limit);
	if (alertId) q = q.eq("alert_id", alertId);
	const { data, error } = await q;
	if (error) throw error;
	return data ?? [];
}
//#endregion
export { removeRotationMember as _, addRotationMember as a, saveTicket as b, deleteRotation as c, fetchPages as d, fetchRotationMembers as f, raisePage as g, fetchTickets as h, ackPage as i, fetchDeliveries as l, fetchTicketNotes as m, QUEUE_LABEL as n, addTicketNote as o, fetchRotations as p, TICKET_STATUSES as r, createTicket as s, QUEUE_KINDS as t, fetchMyLivePages as u, resolvePage as v, saveRotation as y };
