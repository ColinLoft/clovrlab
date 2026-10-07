import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Zt as LifeBuoy } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, T as useMe, a as Kanban, b as nameOf, c as NewButton, d as Select, f as Stat, h as WorkPage, l as Pill, m as Toolbar, o as Loading, p as StatRow, u as RecordDialog, v as dt } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.systems.helpdesk-Cq0LaRBk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "open",
		label: "New"
	},
	{
		key: "in_progress",
		label: "Working"
	},
	{
		key: "waiting",
		label: "Waiting on requester"
	},
	{
		key: "resolved",
		label: "Resolved"
	}
];
var TEAMS = [
	"Operations",
	"Engineering",
	"Product",
	"Manufacturing",
	"Leadership",
	"Funding & Partners",
	"People & Admin"
];
function Helpdesk() {
	const { rows, loading, insert, patch } = useRows("it_requests", { order: { column: "created_at" } });
	const { people, byId } = usePeople();
	const me = useMe();
	const [q, setQ] = (0, import_react.useState)("");
	const [urgency, setUrgency] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const fields = (0, import_react.useMemo)(() => [
		{
			key: "title",
			label: "What is broken?",
			type: "text",
			required: true
		},
		{
			key: "category",
			label: "Category",
			type: "select",
			options: [
				"access",
				"hardware",
				"software",
				"network",
				"security",
				"other"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "system",
			label: "System",
			type: "text",
			placeholder: "Mission console, Drive, Slack…"
		},
		{
			key: "urgency",
			label: "Urgency",
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
			key: "requester_team",
			label: "Requesting team",
			type: "select",
			options: TEAMS.map((t) => ({
				value: t,
				label: t
			}))
		},
		{
			key: "assignee_id",
			label: "Owner",
			type: "user"
		},
		{
			key: "details",
			label: "Details",
			type: "textarea",
			full: true
		}
	], []);
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => `${r.title} ${r.system ?? ""} ${r.requester_team ?? ""}`.toLowerCase().includes(q.toLowerCase()) && (urgency === "all" || r.urgency === urgency)), [
		rows,
		q,
		urgency
	]);
	const critical = rows.filter((r) => r.urgency === "critical" && r.status !== "resolved");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Enterprise systems",
		title: "Support desk",
		lede: "Requests from every team, triaged by urgency. Anything critical here is blocking someone's day.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Log request",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open",
					value: rows.filter((r) => r.status !== "resolved").length,
					icon: LifeBuoy
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Critical",
					value: critical.length,
					tone: critical.length ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Unassigned",
					value: rows.filter((r) => !r.assignee_id && r.status !== "resolved").length,
					tone: "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Resolved",
					value: rows.filter((r) => r.status === "resolved").length,
					tone: "good"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search requests…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: urgency,
					onChange: setUrgency,
					options: [{
						value: "all",
						label: "All urgencies"
					}, ...[
						"critical",
						"high",
						"normal",
						"low"
					].map((v) => ({
						value: v,
						label: v
					}))]
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, {
				columns: COLUMNS,
				rows: filtered,
				statusKey: "status",
				onMove: (r, status) => patch(r.id, { status }),
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: statusTone(r.urgency),
							children: r.urgency || "normal"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [r.requester_team || "Unknown team", r.system ? ` · ${r.system}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: [
							nameOf(byId, r.assignee_id),
							" · ",
							dt(r.created_at)
						]
					})
				] })
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Log support request",
				fields,
				people,
				initial: {
					status: "open",
					urgency: "normal",
					requester_id: me
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
export { Helpdesk as component };
