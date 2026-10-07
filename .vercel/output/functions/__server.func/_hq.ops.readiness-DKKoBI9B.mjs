import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Sn as Gauge, r as Wrench, ut as Plane, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.readiness-DKKoBI9B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AC_STATUS = [
	"available",
	"reserved",
	"flying",
	"maintenance",
	"grounded",
	"retired"
];
function ReadinessPage() {
	const aircraft = useRows("fleet_aircraft", { order: {
		column: "tail_number",
		ascending: true
	} });
	const maint = useRows("fleet_maintenance", { order: { column: "opened_on" } });
	const { people, byId } = usePeople();
	const [addAircraft, setAddAircraft] = (0, import_react.useState)(false);
	const [addJob, setAddJob] = (0, import_react.useState)(null);
	const acFields = [
		{
			key: "tail_number",
			label: "Tail number",
			type: "text",
			required: true,
			placeholder: "N412CL"
		},
		{
			key: "model",
			label: "Model",
			type: "text",
			placeholder: "Athera VTOL"
		},
		{
			key: "base",
			label: "Home base",
			type: "text"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: AC_STATUS.map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "flight_hours",
			label: "Flight hours",
			type: "number"
		},
		{
			key: "cycles",
			label: "Cycles",
			type: "number"
		},
		{
			key: "next_service_hours",
			label: "Next service at (hours)",
			type: "number"
		},
		{
			key: "next_service_date",
			label: "Next service date",
			type: "date"
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	];
	const jobFields = [
		{
			key: "title",
			label: "Work item",
			type: "text",
			required: true
		},
		{
			key: "kind",
			label: "Type",
			type: "select",
			options: [
				"scheduled",
				"unscheduled",
				"inspection",
				"modification",
				"software"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "severity",
			label: "Severity",
			type: "select",
			options: [
				"normal",
				"high",
				"critical"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "grounding",
			label: "Grounds the aircraft",
			type: "bool"
		},
		{
			key: "assignee_id",
			label: "Assigned to",
			type: "user"
		},
		{
			key: "notes",
			label: "Details",
			type: "textarea",
			full: true
		}
	];
	const ready = aircraft.rows.filter((a) => a.status === "available").length;
	const down = aircraft.rows.filter((a) => ["maintenance", "grounded"].includes(a.status)).length;
	const openJobs = maint.rows.filter((m) => m.status !== "closed");
	const hours = aircraft.rows.reduce((s, a) => s + Number(a.flight_hours || 0), 0);
	const requestParts = async (a) => {
		const item = prompt(`Which part does ${a.tail_number} need from manufacturing?`);
		if (!item) return;
		if (await raiseRequest({
			from_team: "ops",
			to_team: "mfg",
			subject: `Part request — ${a.tail_number}`,
			details: `${item} required to return ${a.tail_number} to service.`,
			entity_type: "fleet_aircraft",
			entity_id: a.id,
			priority: "high"
		})) alert("Request sent to Manufacturing.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Fleet",
		title: "Fleet readiness",
		lede: "Which aircraft can launch right now, what is holding the rest on the ground, and who is fixing it.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add aircraft",
			onClick: () => setAddAircraft(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Mission ready",
					value: `${ready}/${aircraft.rows.length}`,
					icon: Plane,
					tone: ready ? "good" : "risk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Down for maintenance",
					value: down,
					icon: Wrench,
					tone: down ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open work items",
					value: openJobs.length,
					icon: TriangleAlert,
					tone: openJobs.some((m) => m.grounding) ? "risk" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Fleet hours",
					value: hours.toFixed(1),
					icon: Gauge
				})
			] }),
			aircraft.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [aircraft.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No aircraft registered yet." })
					}), aircraft.rows.map((a) => {
						const jobs = maint.rows.filter((m) => m.aircraft_id === a.id && m.status !== "closed");
						const service = Number(a.next_service_hours || 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-lg border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-lg font-semibold",
										children: a.tail_number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											a.model || "UAV",
											" · ",
											a.base || "no base"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: a.status,
										onChange: (e) => aircraft.patch(a.id, { status: e.target.value }),
										className: "rounded border border-border bg-background px-2 py-1 text-xs capitalize",
										children: AC_STATUS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: titleCase(s)
										}, s))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Number(a.flight_hours || 0).toFixed(1), " h flown"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: service ? `service at ${service} h` : "no service target" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: Number(a.flight_hours || 0),
											max: service || Math.max(1, Number(a.flight_hours || 1)),
											tone: service && Number(a.flight_hours || 0) >= service ? "risk" : "primary"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-[11px] text-muted-foreground",
									children: [
										a.cycles || 0,
										" cycles · next service ",
										a.next_service_date ? d(a.next_service_date) : "unscheduled"
									]
								}),
								jobs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-1 border-t border-border pt-2",
									children: jobs.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: m.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: m.grounding ? "risk" : statusTone(m.status),
											children: m.grounding ? "grounding" : titleCase(m.status)
										})]
									}, m.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
										onClick: () => setAddJob(a.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3.5 w-3.5" }), " Log maintenance"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										variant: "ghost",
										onClick: () => requestParts(a),
										children: "Request part"
									})]
								})
							]
						}, a.id);
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Maintenance queue",
					hint: "Shared with Manufacturing",
					pad: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[70vh] divide-y divide-border overflow-y-auto",
						children: [maint.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No maintenance logged." }), maint.rows.map((m) => {
							const a = aircraft.rows.find((x) => x.id === m.aircraft_id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium",
										children: m.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: m.status,
										onChange: (e) => maint.patch(m.id, {
											status: e.target.value,
											closed_on: e.target.value === "closed" ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : null
										}),
										className: "rounded border border-border bg-background px-1.5 py-0.5 text-[11px] capitalize",
										children: [
											"open",
											"in_progress",
											"waiting_parts",
											"closed"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: titleCase(s)
										}, s))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										a?.tail_number ?? "unassigned",
										" · ",
										titleCase(m.kind),
										" · ",
										titleCase(m.severity),
										" · ",
										nameOf(byId, m.assignee_id)
									]
								})]
							}, m.id);
						})]
					})
				})]
			}),
			addAircraft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Register aircraft",
				fields: acFields,
				people,
				initial: {
					status: "available",
					flight_hours: 0,
					cycles: 0
				},
				onCancel: () => setAddAircraft(false),
				onSave: async (v) => {
					await aircraft.insert(v);
					setAddAircraft(false);
				}
			}),
			addJob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Log maintenance",
				fields: jobFields,
				people,
				initial: {
					kind: "unscheduled",
					severity: "normal"
				},
				onCancel: () => setAddJob(null),
				onSave: async (v) => {
					await maint.insert({
						...v,
						aircraft_id: addJob,
						status: "open"
					});
					if (v.grounding) await aircraft.patch(addJob, { status: "grounded" });
					setAddJob(null);
				}
			})
		]
	});
}
//#endregion
export { ReadinessPage as component };
