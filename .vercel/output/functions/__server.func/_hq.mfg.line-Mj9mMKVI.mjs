import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { v as TriangleAlert, zn as Factory } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, a as Kanban, b as nameOf, c as NewButton, d as Select, f as Stat, g as d, h as WorkPage, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, u as RecordDialog } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.mfg.line-Mj9mMKVI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "queued",
		label: "Queued"
	},
	{
		key: "building",
		label: "On the line"
	},
	{
		key: "in_review",
		label: "Inspection"
	},
	{
		key: "complete",
		label: "Complete"
	}
];
var fields = (people) => [
	{
		key: "order_number",
		label: "Work order",
		type: "text",
		required: true,
		placeholder: "WO-0142"
	},
	{
		key: "product_name",
		label: "Assembly",
		type: "text",
		required: true
	},
	{
		key: "quantity",
		label: "Units",
		type: "number"
	},
	{
		key: "priority",
		label: "Priority",
		type: "select",
		options: [
			"low",
			"normal",
			"high",
			"critical"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "status",
		label: "Stage",
		type: "select",
		options: COLUMNS.map((c) => ({
			value: c.key,
			label: c.label
		}))
	},
	{
		key: "assignee_id",
		label: "Build lead",
		type: "user"
	},
	{
		key: "due_date",
		label: "Need by",
		type: "date"
	},
	{
		key: "notes",
		label: "Build notes",
		type: "textarea",
		full: true
	},
	...people.length ? [] : []
];
function BuildLine() {
	const { rows, loading, insert, patch } = useRows("mfg_work_orders", { order: {
		column: "due_date",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => {
		return `${r.order_number} ${r.product_name}`.toLowerCase().includes(q.toLowerCase()) && (priority === "all" || r.priority === priority);
	}), [
		rows,
		q,
		priority
	]);
	const late = rows.filter((r) => r.due_date && r.due_date < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) && r.status !== "complete");
	const units = rows.filter((r) => r.status !== "complete").reduce((s, r) => s + Number(r.quantity || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Manufacturing",
		title: "Build line",
		lede: "Every airframe and sensor pod in production, stage by stage. Move a card as the work moves down the line.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New work order",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open orders",
					value: rows.filter((r) => r.status !== "complete").length,
					icon: Factory
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Units in build",
					value: units,
					hint: "Across all open orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Past need-by",
					value: late.length,
					tone: late.length ? "risk" : "good",
					icon: TriangleAlert
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Completed",
					value: rows.filter((r) => r.status === "complete").length,
					tone: "good"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toolbar, {
				q,
				setQ,
				placeholder: "Search order or assembly…",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: priority,
					onChange: setPriority,
					options: [{
						value: "all",
						label: "All priorities"
					}, ...[
						"critical",
						"high",
						"normal",
						"low"
					].map((v) => ({
						value: v,
						label: v
					}))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: async () => {
						const subject = prompt("What do you need from Engineering?");
						if (subject && await raiseRequest({
							from_team: "Manufacturing",
							to_team: "Engineering",
							subject,
							priority: "high"
						})) alert("Sent to Engineering.");
					},
					children: "Escalate to Engineering"
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, {
				columns: COLUMNS,
				rows: filtered,
				statusKey: "status",
				onMove: (r, status) => patch(r.id, { status }),
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: r.order_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: statusTone(r.priority),
							children: r.priority || "normal"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							r.product_name,
							" · ",
							r.quantity ?? 1,
							" units"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: [
							nameOf(byId, r.assignee_id),
							" · due ",
							d(r.due_date)
						]
					})
				] })
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New work order",
				fields: fields(people),
				people,
				initial: {
					status: "queued",
					priority: "normal",
					quantity: 1
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
export { BuildLine as component };
