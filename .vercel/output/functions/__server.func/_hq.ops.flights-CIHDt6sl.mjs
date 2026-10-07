import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { B as ShieldCheck, Un as Droplets, cr as CircleCheck, ut as Plane } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, T as useMe, _ as db, b as nameOf, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.flights-CIHDt6sl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS = [
	"planned",
	"authorized",
	"launched",
	"flying",
	"returning",
	"complete",
	"cancelled"
];
function FlightsPage() {
	const { rows, loading, insert, patch } = useRows("ops_flights", { order: { column: "created_at" } });
	const { rows: aircraft } = useRows("fleet_aircraft", { order: {
		column: "tail_number",
		ascending: true
	} });
	const { rows: detections } = useRows("ops_detections", { order: { column: "detected_at" } });
	const { people, byId } = usePeople();
	const me = useMe();
	const [q, setQ] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const fields = [
		{
			key: "callsign",
			label: "Callsign",
			type: "text",
			required: true,
			placeholder: "CLVR-114"
		},
		{
			key: "aircraft_id",
			label: "Aircraft",
			type: "select",
			options: aircraft.map((a) => ({
				value: a.id,
				label: `${a.tail_number} — ${a.model ?? "UAV"}`
			}))
		},
		{
			key: "detection_id",
			label: "Responding to detection",
			type: "select",
			options: detections.map((x) => ({
				value: x.id,
				label: x.name
			}))
		},
		{
			key: "pilot_id",
			label: "Pilot in command",
			type: "user",
			required: true
		},
		{
			key: "objective",
			label: "Objective",
			type: "text",
			full: true,
			placeholder: "Confirm ignition and attempt initial suppression"
		},
		{
			key: "departs_at",
			label: "Planned departure",
			type: "datetime"
		},
		{
			key: "notes",
			label: "Brief",
			type: "textarea",
			full: true
		}
	];
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => !q || `${r.callsign} ${r.objective ?? ""} ${r.status}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
	const authorize = async (row) => {
		if (!confirm(`Authorize ${row.callsign}? Your name is recorded as the authorizing officer.`)) return;
		await patch(row.id, {
			status: "authorized",
			authorized_by: me,
			authorized_at: (/* @__PURE__ */ new Date()).toISOString()
		});
	};
	const release = async (row) => {
		if (!confirm("Confirm human-approved payload release for this sortie?")) return;
		await patch(row.id, { payload_released: true });
	};
	const closeOut = async (row) => {
		const outcome = prompt("Outcome of the sortie (e.g. suppressed, contained, handed to responders):", row.outcome ?? "");
		if (outcome === null) return;
		await patch(row.id, {
			status: "complete",
			outcome,
			returns_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (row.aircraft_id) {
			const a = aircraft.find((x) => x.id === row.aircraft_id);
			if (a) await db.from("fleet_aircraft").update({
				flight_hours: Number(a.flight_hours || 0) + 1,
				cycles: Number(a.cycles || 0) + 1
			}).eq("id", a.id);
		}
		await raiseRequest({
			from_team: "ops",
			to_team: "eng",
			subject: `Flight data review — ${row.callsign}`,
			details: `Sortie closed with outcome: ${outcome}. Telemetry and imagery ready for engineering review.`,
			entity_type: "ops_flights",
			entity_id: row.id,
			priority: "normal"
		});
	};
	const airborne = rows.filter((r) => [
		"launched",
		"flying",
		"returning"
	].includes(r.status)).length;
	const awaiting = rows.filter((r) => r.status === "planned").length;
	const releases = rows.filter((r) => r.payload_released).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Flight",
		title: "Flight log",
		lede: "Autonomous, not unsupervised. Each sortie carries a named pilot in command and a named authorizing officer before launch.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Plan sortie",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Airborne now",
					value: airborne,
					icon: Plane,
					tone: airborne ? "info" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Awaiting authorization",
					value: awaiting,
					icon: ShieldCheck,
					tone: awaiting ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Payload releases",
					value: releases,
					icon: Droplets
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Sorties logged",
					value: rows.length,
					icon: CircleCheck
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search callsign, objective…"
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Callsign"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Objective"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "PIC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Authorized by"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Payload"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No sorties planned." })
							}) }), filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-accent/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-semibold",
										children: r.callsign
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "max-w-[280px] truncate px-4 py-3 text-muted-foreground",
										children: r.objective || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: nameOf(byId, r.pilot_id)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs",
										children: r.authorized_by ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											nameOf(byId, r.authorized_by),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: dt(r.authorized_at)
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-500",
											children: "Not authorized"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: r.status,
											onChange: (e) => patch(r.id, { status: e.target.value }),
											className: "rounded border border-border bg-background px-2 py-1 text-xs capitalize",
											children: STATUS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: s,
												children: titleCase(s)
											}, s))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: r.payload_released ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: "good",
											children: "Released"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: "Held" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1.5",
											children: [
												!r.authorized_by && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
													onClick: () => authorize(r),
													children: "Authorize"
												}),
												r.authorized_by && !r.payload_released && r.status !== "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
													onClick: () => release(r),
													children: "Release payload"
												}),
												r.status !== "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
													variant: "ghost",
													onClick: () => closeOut(r),
													children: "Close out"
												}),
												r.status === "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
													tone: statusTone(r.outcome),
													children: r.outcome || "complete"
												})
											]
										})
									})
								]
							}, r.id))]
						})]
					})
				})
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Plan a sortie",
				fields,
				people,
				initial: {},
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						status: "planned"
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { FlightsPage as component };
