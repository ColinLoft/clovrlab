import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { dt as PlaneTakeoff, r as Wrench, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, d as Select, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog } from "./_ssr/kit-CJyOYuhv.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.maintenance-p7w5oGU7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"open",
	"in_progress",
	"waiting_parts",
	"closed"
];
function Maintenance() {
	const aircraft = useRows("fleet_aircraft", { order: {
		column: "tail_number",
		ascending: true
	} });
	const { rows, loading, insert, patch } = useRows("fleet_maintenance", { order: { column: "opened_on" } });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("open");
	const [open, setOpen] = (0, import_react.useState)(false);
	const tailOf = (0, import_react.useMemo)(() => new Map(aircraft.rows.map((a) => [a.id, a.tail_number])), [aircraft.rows]);
	const fields = [
		{
			key: "aircraft_id",
			label: "Aircraft",
			type: "select",
			required: true,
			options: aircraft.rows.map((a) => ({
				value: a.id,
				label: `${a.tail_number} · ${a.model ?? ""}`
			}))
		},
		{
			key: "title",
			label: "Work item",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "kind",
			label: "Type",
			type: "select",
			options: [
				"scheduled",
				"unscheduled",
				"inspection",
				"modification"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "severity",
			label: "Severity",
			type: "select",
			options: [
				"low",
				"medium",
				"high",
				"critical"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: STATUSES.map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "assignee_id",
			label: "Technician",
			type: "user"
		},
		{
			key: "grounding",
			label: "Grounds the aircraft",
			type: "bool"
		},
		{
			key: "opened_on",
			label: "Opened",
			type: "date"
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	];
	const filtered = rows.filter((r) => (status === "all" || (r.status ?? "open") === status) && `${r.title} ${tailOf.get(r.aircraft_id) ?? ""} ${r.kind ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	const grounded = rows.filter((r) => r.grounding && r.status !== "closed");
	const groundedTails = new Set(grounded.map((r) => r.aircraft_id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Flight operations",
		title: "Maintenance",
		lede: "Every open work item against the fleet, who is turning the wrench, and which airframes cannot fly until it clears.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Log work item",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open work items",
						value: rows.filter((r) => r.status !== "closed").length,
						icon: Wrench
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Grounding",
						value: grounded.length,
						tone: grounded.length ? "risk" : "good",
						icon: TriangleAlert
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Airframes affected",
						value: groundedTails.size,
						hint: `${aircraft.rows.length} in fleet`,
						icon: PlaneTakeoff
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Closed this list",
						value: rows.filter((r) => r.status === "closed").length,
						tone: "good"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-4 xl:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
					q,
					setQ,
					placeholder: "Search work items, tail numbers…",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: status,
						onChange: setStatus,
						options: [{
							value: "all",
							label: "All statuses"
						}, ...STATUSES.map((s) => ({
							value: s,
							label: s.replace("_", " ")
						}))]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "mt-3",
					pad: false,
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing in this queue." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center gap-3 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-20 shrink-0 font-mono text-xs text-muted-foreground",
									children: tailOf.get(r.aircraft_id) ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-sm font-medium",
										children: r.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-xs text-muted-foreground",
										children: [
											r.kind ?? "unscheduled",
											" · opened ",
											d(r.opened_on),
											" ·",
											" ",
											r.assignee_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
												userId: r.assignee_id,
												name: nameOf(byId, r.assignee_id),
												size: "xs"
											}) : "Unassigned"
										]
									})]
								}),
								r.grounding && r.status !== "closed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: "risk",
									children: "grounding"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.severity),
									children: r.severity ?? "low"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: r.status ?? "open",
									onChange: (e) => patch(r.id, {
										status: e.target.value,
										closed_on: e.target.value === "closed" ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : null
									}),
									className: "rounded border border-border bg-background px-2 py-1 text-xs",
									children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s.replace("_", " ")
									}, s))
								})
							]
						}, r.id))
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: "Fleet status",
					hint: "Live airworthiness by tail",
					pad: false,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border",
						children: [aircraft.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No aircraft registered." }), aircraft.rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: a.tail_number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate text-xs text-muted-foreground",
									children: a.model ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: groundedTails.has(a.id) ? "risk" : statusTone(a.status),
									children: groundedTails.has(a.id) ? "grounded" : a.status ?? "unknown"
								})
							]
						}, a.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: () => setStatus("waiting_parts"),
							className: "w-full justify-center",
							children: "Show parts holds"
						})
					})]
				})]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Log maintenance work",
				fields,
				people,
				initial: {
					status: "open",
					severity: "medium",
					kind: "unscheduled",
					opened_on: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				},
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await insert(v);
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Maintenance as component };
