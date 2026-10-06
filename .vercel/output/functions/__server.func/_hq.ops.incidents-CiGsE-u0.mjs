import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { a as addIncidentNote, c as deleteIncidentMedia, d as fetchIncidents, f as reopenIncident, g as updateIncidentStatus, h as setIncidentHighRisk, i as addIncidentMedia, l as fetchIncidentEvents, m as saveIncidentReview, n as RESOLUTIONS, o as closeIncident, p as resolveIncident, r as STATUS_META, t as PRIORITY_META, u as fetchIncidentMedia } from "./_ssr/incidents-m7NY0JN5.mjs";
import { $n as Clock, K as Send, On as Flame, Wn as Download, an as Image, er as ClipboardCheck, it as Radio, nt as RefreshCw, ot as Printer, ut as Plane, v as TriangleAlert, x as Trash2 } from "./_libs/lucide-react.mjs";
import { o as Route$25 } from "./_ssr/router-E4663KdI.mjs";
import { d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, v as dt } from "./_ssr/kit-CJyOYuhv.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
import { n as printReport, t as downloadCsv } from "./_ssr/export-DkQJ2nl7.mjs";
import { r as fetchDrones } from "./_ssr/drones-DTO3jNJI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.incidents-CiGsE-u0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var R_MI = 3958.8;
function haversineMi(a, b) {
	const toRad = (d) => d * Math.PI / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * R_MI * Math.asin(Math.sqrt(h));
}
function rankCandidates(drones, incident) {
	return drones.map((d) => {
		const origin = d.last_lat != null && d.last_lng != null ? {
			lat: Number(d.last_lat),
			lng: Number(d.last_lng)
		} : d.base ? {
			lat: Number(d.base.lat),
			lng: Number(d.base.lng)
		} : null;
		const distance_mi = origin ? haversineMi(origin, {
			lat: Number(incident.lat),
			lng: Number(incident.lng)
		}) : Infinity;
		const cruise = d.airframe?.cruise_speed_mph ?? 90;
		const range = d.airframe?.range_mi ?? 100;
		const eta_min = isFinite(distance_mi) ? distance_mi / cruise * 60 : Infinity;
		const ready = d.status === "ready";
		const battery_ok = (d.battery_pct ?? 0) >= 40;
		const retardant_ok = (d.retardant_l ?? 0) > 0;
		const in_range = distance_mi * 2 <= range * .8;
		const reasons = [];
		if (!ready) reasons.push(`status: ${d.status}`);
		if (!battery_ok) reasons.push(`battery ${d.battery_pct}%`);
		if (!retardant_ok) reasons.push("no retardant");
		if (!in_range) reasons.push(`out of range (${distance_mi.toFixed(0)} mi / ${range} mi)`);
		return {
			drone: d,
			distance_mi,
			eta_min,
			in_range,
			ready,
			battery_ok,
			retardant_ok,
			reasons
		};
	}).sort((a, b) => {
		const aOk = a.ready && a.in_range && a.battery_ok ? 0 : 1;
		const bOk = b.ready && b.in_range && b.battery_ok ? 0 : 1;
		if (aOk !== bOk) return aOk - bOk;
		return a.eta_min - b.eta_min;
	});
}
async function assignDroneToIncident(incidentId, droneId, etaMin, distMi) {
	const { error: e1 } = await supabase.from("net_incidents").update({
		assigned_drone_id: droneId,
		status: "dispatched"
	}).eq("id", incidentId);
	if (e1) throw e1;
	const { error: e2 } = await supabase.from("net_drones").update({ status: "preflight" }).eq("id", droneId);
	if (e2) throw e2;
	await supabase.from("net_incident_events").insert({
		incident_id: incidentId,
		event_type: "dispatched",
		message: `Drone dispatched · ${distMi.toFixed(1)} mi · ETA ${etaMin.toFixed(0)} min`,
		payload: {
			drone_id: droneId,
			distance_mi: distMi,
			eta_min: etaMin
		}
	});
}
async function releaseDroneFromIncident(incidentId, droneId) {
	const { error } = await supabase.from("net_incidents").update({ assigned_drone_id: null }).eq("id", incidentId);
	if (error) throw error;
	if (droneId) await supabase.from("net_drones").update({ status: "ready" }).eq("id", droneId);
	await supabase.from("net_incident_events").insert({
		incident_id: incidentId,
		event_type: "released",
		message: "Drone released"
	});
}
async function markDroneInflight(droneId, incidentId) {
	const { error } = await supabase.from("net_drones").update({ status: "inflight" }).eq("id", droneId);
	if (error) throw error;
	await supabase.from("net_incident_events").insert({
		incident_id: incidentId,
		event_type: "inflight",
		message: "Drone in-flight to scene"
	});
}
var STATUSES = Object.keys(STATUS_META);
function IncidentsPage() {
	const search = Route$25.useSearch();
	const [incidents, setIncidents] = (0, import_react.useState)([]);
	const [drones, setDrones] = (0, import_react.useState)([]);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [media, setMedia] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(search.id ?? null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)(search.id ? "all" : "open");
	const [tick, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			const [inc, dr] = await Promise.all([fetchIncidents().catch(() => []), fetchDrones().catch(() => [])]);
			if (!alive) return;
			setIncidents(inc);
			setDrones(dr);
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, [tick]);
	const filtered = (0, import_react.useMemo)(() => {
		return incidents.filter((i) => {
			if (status === "open" && ["closed", "false_positive"].includes(i.status)) return false;
			if (status !== "open" && status !== "all" && i.status !== status) return false;
			if (q && !`${i.title} ${i.county ?? ""} ${i.state ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [
		incidents,
		q,
		status
	]);
	const current = filtered.find((i) => i.id === selected) ?? filtered[0] ?? null;
	(0, import_react.useEffect)(() => {
		if (!current) {
			setEvents([]);
			setMedia([]);
			return;
		}
		let alive = true;
		fetchIncidentEvents(current.id).then((e) => alive && setEvents(e)).catch(() => setEvents([]));
		fetchIncidentMedia(current.id).then((m) => alive && setMedia(m)).catch(() => setMedia([]));
		return () => {
			alive = false;
		};
	}, [current?.id, tick]);
	const refresh = (0, import_react.useCallback)(() => setTick((t) => t + 1), []);
	const exportTimeline = (mode) => {
		if (!current) return;
		const columns = [
			{
				key: "time",
				label: "Time (UTC)"
			},
			{
				key: "type",
				label: "Event"
			},
			{
				key: "message",
				label: "Detail"
			}
		];
		const rows = [...events].reverse().map((e) => ({
			time: new Date(e.created_at).toISOString(),
			type: e.event_type.replace(/_/g, " "),
			message: e.message ?? ""
		}));
		const slug = current.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
		if (mode === "csv") return downloadCsv(`incident-${slug}`, columns, rows);
		printReport({
			title: `Incident report — ${current.title}`,
			subtitle: `${current.source.toUpperCase()} · ${STATUS_META[current.status]?.label} · discovered ${dt(current.discovered_at)}`,
			columns,
			rows,
			summary: [
				{
					label: "Priority",
					value: PRIORITY_META[current.priority]?.label ?? current.priority
				},
				{
					label: "Coordinates",
					value: `${Number(current.lat).toFixed(4)}, ${Number(current.lng).toFixed(4)}`
				},
				{
					label: "Camera",
					value: current.camera_name ?? "—"
				},
				{
					label: "Resolution",
					value: current.resolution?.replace(/_/g, " ") ?? "Open"
				}
			]
		});
	};
	const candidates = (0, import_react.useMemo)(() => current ? rankCandidates(drones, current) : [], [drones, current]);
	const dispatch = async (c) => {
		if (!current) return;
		if (!confirm(`Dispatch ${c.drone.tail_number} to ${current.title}? You are recorded as the dispatching operator.`)) return;
		await assignDroneToIncident(current.id, c.drone.id, Math.round(c.eta_min), Math.round(c.distance_mi));
		setTick((t) => t + 1);
	};
	const counts = {
		open: incidents.filter((i) => !["closed", "false_positive"].includes(i.status)).length,
		dispatched: incidents.filter((i) => i.status === "dispatched").length,
		onscene: incidents.filter((i) => i.status === "onscene").length,
		p1: incidents.filter((i) => i.priority === "p1" && !["closed", "false_positive"].includes(i.status)).length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Response",
		title: "Incidents & dispatch",
		lede: "Every confirmed detection becomes an incident with a timeline. Aircraft are ranked by distance, endurance and battery — a person makes the call.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: () => setTick((t) => t + 1),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open incidents",
					value: counts.open,
					icon: Flame,
					tone: counts.open ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "P1 priority",
					value: counts.p1,
					icon: Radio,
					tone: counts.p1 ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Dispatched",
					value: counts.dispatched,
					icon: Plane
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "On scene",
					value: counts.onscene,
					icon: Clock
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
					q,
					setQ,
					placeholder: "Search incidents, counties…",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: status,
						onChange: setStatus,
						options: [
							{
								value: "open",
								label: "Open"
							},
							{
								value: "all",
								label: "All"
							},
							...STATUSES.map((s) => ({
								value: s,
								label: STATUS_META[s].label
							}))
						]
					})
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 xl:grid-cols-[minmax(300px,380px)_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: `Incidents (${filtered.length})`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[70vh] divide-y divide-border overflow-y-auto",
						children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No incidents match this filter." }), filtered.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(i.id),
							className: `flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-accent ${current?.id === i.id ? "bg-accent" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: i.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 font-mono text-[11px] text-muted-foreground",
									children: [
										i.county ?? "—",
										" · ",
										Number(i.lat).toFixed(2),
										", ",
										Number(i.lng).toFixed(2),
										" · ",
										dt(i.discovered_at)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full px-2 py-0.5 text-[11px]",
									style: {
										color: STATUS_META[i.status]?.color,
										border: `1px solid ${STATUS_META[i.status]?.color}55`
									},
									children: STATUS_META[i.status]?.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px]",
									style: { color: PRIORITY_META[i.priority]?.color },
									children: PRIORITY_META[i.priority]?.label
								})]
							})]
						}, i.id))]
					})
				}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: current.title,
							hint: `${current.source.toUpperCase()} · discovered ${dt(current.discovered_at)}`,
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex flex-wrap gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
										onClick: () => exportTimeline("csv"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " CSV"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
										onClick: () => exportTimeline("pdf"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " PDF"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
										variant: current.high_risk ? "primary" : "ghost",
										onClick: async () => {
											await setIncidentHighRisk(current.id, !current.high_risk);
											refresh();
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }),
											" ",
											current.high_risk ? "High risk" : "Flag high risk"
										]
									})
								]
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Status",
											value: STATUS_META[current.status]?.label ?? current.status
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Priority",
											value: PRIORITY_META[current.priority]?.label ?? current.priority
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Coordinates",
											value: `${Number(current.lat).toFixed(3)}, ${Number(current.lng).toFixed(3)}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Confidence",
											value: current.confidence != null ? `${Math.round(current.confidence)}%` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Camera",
											value: current.camera_name ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "FRP",
											value: current.frp != null ? `${current.frp} MW` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "County",
											value: current.county ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
											label: "Assigned aircraft",
											value: drones.find((d) => d.id === current.assigned_drone_id)?.tail_number ?? "None"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-2 rounded-md border border-border px-3 py-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: current.acked_at ? "good" : current.alert_id ? "risk" : "muted",
											children: current.acked_at ? "Page acknowledged" : current.alert_id ? "Awaiting acknowledgement" : "No page raised"
										}),
										current.acked_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-muted-foreground",
											children: [
												dt(current.acked_at),
												" by",
												" ",
												current.acked_by ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
													userId: current.acked_by,
													name: "teammate",
													size: "xs"
												}) : "an operator"
											]
										}),
										!current.acked_at && current.alert_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "On-call is being paged; escalation continues until someone acknowledges."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4",
									children: [STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										variant: current.status === s ? "primary" : "ghost",
										onClick: async () => {
											await updateIncidentStatus(current.id, s);
											refresh();
										},
										children: STATUS_META[s].label
									}, s)), current.assigned_drone_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										onClick: async () => {
											await markDroneInflight(current.assigned_drone_id, current.id);
											refresh();
										},
										children: "Mark in flight"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										variant: "danger",
										onClick: async () => {
											await releaseDroneFromIncident(current.id, current.assigned_drone_id);
											refresh();
										},
										children: "Release aircraft"
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResolutionCard, {
								incident: current,
								refresh
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
								incident: current,
								media,
								refresh
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewCard, {
							incident: current,
							refresh
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								pad: false,
								title: "Dispatch candidates",
								hint: "Ranked by ETA, range and battery",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "divide-y divide-border",
									children: [candidates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No aircraft registered in the detection network yet." }), candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3 px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-medium",
													children: c.drone.tail_number
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-mono text-[11px] text-muted-foreground",
													children: [
														Math.round(c.distance_mi),
														" mi · ETA ",
														Math.round(c.eta_min),
														" min · ",
														c.drone.battery_pct ?? "—",
														"% battery"
													]
												}),
												!(c.ready && c.in_range && c.battery_ok) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-amber-500",
													children: c.reasons.join(" · ")
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
											variant: "primary",
											disabled: !(c.ready && c.in_range && c.battery_ok),
											onClick: () => dispatch(c),
											children: "Dispatch"
										})]
									}, c.drone.id))]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								pad: false,
								title: "Timeline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-h-[46vh] divide-y divide-border overflow-y-auto",
									children: [events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No events recorded." }), events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: e.event_type.replace(/_/g, " ") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground",
												children: dt(e.created_at)
											})]
										}), e.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm",
											children: e.message
										})]
									}, e.id))]
								})
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Select an incident." }) })]
			})
		]
	});
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm font-medium",
			children: value
		})]
	});
}
function ResolutionCard({ incident, refresh }) {
	const [resolution, setResolution] = (0, import_react.useState)(incident.resolution ?? "confirmed_fire");
	const [notes, setNotes] = (0, import_react.useState)(incident.resolution_notes ?? "");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const closed = ["closed", "false_positive"].includes(incident.status);
	(0, import_react.useEffect)(() => {
		setResolution(incident.resolution ?? "confirmed_fire");
		setNotes(incident.resolution_notes ?? "");
	}, [incident.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Resolution",
		hint: "Record the outcome before closing — this is what the report shows",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground",
					children: "Outcome"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: resolution,
					onChange: setResolution,
					options: RESOLUTIONS,
					className: "w-full"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground",
					children: "Resolution notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					rows: 3,
					placeholder: "What was found on scene, who responded, what closed it out…",
					className: "w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "primary",
						disabled: busy,
						onClick: async () => {
							setBusy(true);
							try {
								await resolveIncident(incident.id, {
									resolution,
									notes
								});
								refresh();
							} finally {
								setBusy(false);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-3.5 w-3.5" }), " Save resolution"]
					}), closed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: async () => {
							await reopenIncident(incident.id);
							refresh();
						},
						children: "Reopen incident"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "danger",
						onClick: async () => {
							if (!confirm("Close this incident? The camera returns to normal sweeping and can open new incidents again.")) return;
							await closeIncident(incident.id);
							refresh();
						},
						children: "Close incident"
					})]
				}),
				incident.resolved_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-muted-foreground",
					children: [
						"Resolved ",
						dt(incident.resolved_at),
						incident.closed_at ? ` · closed ${dt(incident.closed_at)}` : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground",
						children: "Add a note to the timeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: note,
							onChange: (e) => setNote(e.target.value),
							onKeyDown: async (e) => {
								if (e.key === "Enter" && note.trim()) {
									e.preventDefault();
									await addIncidentNote(incident.id, note.trim());
									setNote("");
									refresh();
								}
							},
							placeholder: "Spotted second column of smoke to the north…",
							className: "flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							disabled: !note.trim(),
							onClick: async () => {
								await addIncidentNote(incident.id, note.trim());
								setNote("");
								refresh();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Post"]
						})]
					})]
				})
			]
		})
	});
}
function MediaCard({ incident, media, refresh }) {
	const [url, setUrl] = (0, import_react.useState)("");
	const [caption, setCaption] = (0, import_react.useState)("");
	const frames = incident.snapshot_url && !media.some((m) => m.url === incident.snapshot_url) ? [{
		id: "snapshot",
		incident_id: incident.id,
		kind: "frame",
		url: incident.snapshot_url,
		caption: "Detection frame",
		captured_at: incident.discovered_at,
		created_by: null,
		created_at: incident.created_at
	}, ...media] : media;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Camera footage & attachments",
		hint: "Detection frames are captured automatically; add ground photos, maps or documents",
		children: [frames.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing attached yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
			children: frames.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "group relative overflow-hidden rounded-md border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: m.url,
						target: "_blank",
						rel: "noreferrer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: m.url,
							alt: m.caption ?? "Incident attachment",
							loading: "lazy",
							className: "h-24 w-full bg-muted object-cover transition group-hover:opacity-80"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "truncate px-2 py-1 text-[10px] text-muted-foreground",
						children: [m.caption ?? m.kind, m.captured_at ? ` · ${dt(m.captured_at)}` : ""]
					}),
					m.id !== "snapshot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Remove attachment",
						onClick: async () => {
							await deleteIncidentMedia(m.id);
							refresh();
						},
						className: "absolute right-1 top-1 hidden rounded bg-background/90 p-1 text-destructive group-hover:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
					})
				]
			}, m.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					placeholder: "https://… image or document URL",
					className: "min-w-[14rem] flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: caption,
					onChange: (e) => setCaption(e.target.value),
					placeholder: "Caption",
					className: "w-40 rounded border border-border bg-background px-2 py-1 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					disabled: !url.trim(),
					onClick: async () => {
						await addIncidentMedia(incident.id, {
							url: url.trim(),
							caption: caption.trim() || null
						});
						setUrl("");
						setCaption("");
						refresh();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3.5 w-3.5" }), " Attach"]
				})
			]
		})]
	});
}
function ReviewCard({ incident, refresh }) {
	const [cause, setCause] = (0, import_react.useState)(incident.review_cause ?? "");
	const [actions, setActions] = (0, import_react.useState)(incident.review_actions ?? "");
	const [lessons, setLessons] = (0, import_react.useState)(incident.review_lessons ?? "");
	(0, import_react.useEffect)(() => {
		setCause(incident.review_cause ?? "");
		setActions(incident.review_actions ?? "");
		setLessons(incident.review_lessons ?? "");
	}, [incident.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Post-incident review",
		hint: incident.review_completed_at ? `Completed ${dt(incident.review_completed_at)}` : "Complete after the incident is closed",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Cause / what happened",
					value: cause,
					onChange: setCause
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Actions taken",
					value: actions,
					onChange: setActions
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Lessons & follow-ups",
					value: lessons,
					onChange: setLessons
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				variant: "primary",
				onClick: async () => {
					await saveIncidentReview(incident.id, {
						review_cause: cause,
						review_actions: actions,
						review_lessons: lessons
					});
					refresh();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-3.5 w-3.5" }), " Save review"]
			})
		})]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			onChange: (e) => onChange(e.target.value),
			rows: 3,
			className: "w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
		})]
	});
}
//#endregion
export { IncidentsPage as component };
