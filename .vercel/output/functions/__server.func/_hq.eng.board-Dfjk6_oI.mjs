import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { On as Flame, Sr as CalendarClock, qt as ListChecks } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, a as Kanban, b as nameOf, c as NewButton, d as Select, f as Stat, g as d, h as WorkPage, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, u as RecordDialog } from "./_ssr/kit-L_nfYwfF.mjs";
import { t as UserMention } from "./_ssr/UserMention-D5WbdqmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.board-Dfjk6_oI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "todo",
		label: "To do"
	},
	{
		key: "in_progress",
		label: "In progress"
	},
	{
		key: "blocked",
		label: "Blocked"
	},
	{
		key: "review",
		label: "In review"
	},
	{
		key: "done",
		label: "Done"
	}
];
function EngBoard() {
	const projects = useRows("eng_projects", {
		select: "id,name,code",
		order: {
			column: "name",
			ascending: true
		}
	});
	const { rows, loading, insert, patch } = useRows("eng_tasks", { order: {
		column: "due_date",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [project, setProject] = (0, import_react.useState)("all");
	const [mine, setMine] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const projName = (0, import_react.useMemo)(() => new Map(projects.rows.map((p) => [p.id, p.code || p.name])), [projects.rows]);
	const fields = [
		{
			key: "title",
			label: "Task",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "project_id",
			label: "Program",
			type: "select",
			options: projects.rows.map((p) => ({
				value: p.id,
				label: p.name
			}))
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: COLUMNS.map((c) => ({
				value: c.key,
				label: c.label
			}))
		},
		{
			key: "priority",
			label: "Priority",
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
			key: "assignee_id",
			label: "Owner",
			type: "user"
		},
		{
			key: "due_date",
			label: "Due",
			type: "date"
		},
		{
			key: "description",
			label: "Detail",
			type: "textarea",
			full: true
		}
	];
	const filtered = rows.filter((r) => (project === "all" || r.project_id === project) && (mine === "all" || r.assignee_id === mine) && `${r.title} ${projName.get(r.project_id) ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const overdue = filtered.filter((r) => r.due_date && r.due_date < today && r.status !== "done");
	const critical = filtered.filter((r) => ["high", "critical"].includes((r.priority ?? "").toLowerCase()) && r.status !== "done");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Engineering",
		title: "Sprint board",
		lede: "The week's engineering work in flight — one card per task, moved by the person who owns it.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New task",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Active tasks",
						value: filtered.filter((r) => r.status !== "done").length,
						icon: ListChecks
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Overdue",
						value: overdue.length,
						tone: overdue.length ? "risk" : "good",
						icon: CalendarClock
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "High priority open",
						value: critical.length,
						tone: critical.length ? "warn" : "good",
						icon: Flame
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toolbar, {
				q,
				setQ,
				placeholder: "Search tasks…",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: project,
					onChange: setProject,
					options: [{
						value: "all",
						label: "All programs"
					}, ...projects.rows.map((p) => ({
						value: p.id,
						label: p.name
					}))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: mine,
					onChange: setMine,
					options: [{
						value: "all",
						label: "Everyone"
					}, ...people.map((p) => ({
						value: p.id,
						label: p.full_name || p.email || "—"
					}))]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, {
					columns: COLUMNS,
					rows: filtered,
					statusKey: "status",
					onMove: (r, status) => patch(r.id, { status }),
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium leading-snug",
								children: r.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [projName.get(r.project_id) ?? "Unassigned program", r.due_date ? ` · due ${d(r.due_date)}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.priority),
									children: r.priority ?? "medium"
								}), r.assignee_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: r.assignee_id,
									name: nameOf(byId, r.assignee_id),
									size: "xs"
								})]
							})
						]
					})
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New engineering task",
				fields,
				people,
				initial: {
					status: "todo",
					priority: "medium"
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
export { EngBoard as component };
