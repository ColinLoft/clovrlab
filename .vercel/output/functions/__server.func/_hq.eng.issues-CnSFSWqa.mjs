import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Er as Bug, K as Send, On as Flame, S as Timer } from "./_libs/lucide-react.mjs";
import { D as useRows, E as usePeople, S as raiseRequest, a as Kanban, b as nameOf, c as NewButton, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt, w as titleCase } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.issues-CnSFSWqa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "open",
		label: "Reported"
	},
	{
		key: "triaged",
		label: "Triaged"
	},
	{
		key: "in_progress",
		label: "In progress"
	},
	{
		key: "verifying",
		label: "Verifying"
	},
	{
		key: "closed",
		label: "Closed"
	}
];
function IssuesPage() {
	const { rows, loading, insert, patch } = useRows("eng_issues", { order: { column: "created_at" } });
	const projects = useRows("eng_projects", { order: {
		column: "name",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [sev, setSev] = (0, import_react.useState)("all");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const fields = [
		{
			key: "title",
			label: "Summary",
			type: "text",
			required: true,
			full: true
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
				label: titleCase(v)
			}))
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
			key: "assignee_id",
			label: "Owner",
			type: "user"
		},
		{
			key: "description",
			label: "What happened",
			type: "textarea",
			full: true
		}
	];
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => (!q || `${r.title} ${r.description ?? ""}`.toLowerCase().includes(q.toLowerCase())) && (sev === "all" || String(r.severity).toLowerCase() === sev)), [
		rows,
		q,
		sev
	]);
	const open = rows.filter((r) => r.status !== "closed");
	const critical = open.filter((r) => String(r.severity).toLowerCase() === "critical").length;
	const escalate = async (r) => {
		if (await raiseRequest({
			from_team: "eng",
			to_team: "ops",
			subject: `Field action required — ${r.title}`,
			details: "Engineering needs an operational hold or field check on this issue.",
			entity_type: "eng_issues",
			entity_id: r.id,
			priority: "urgent"
		})) alert("Mission Operations notified.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Engineering · Reliability",
		title: "Issue triage",
		lede: "Everything the fleet, the test bench and the field report — sorted by severity, owned by a named engineer, closed with verification.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Report issue",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open issues",
					value: open.length,
					icon: Bug,
					tone: open.length > 15 ? "warn" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Critical",
					value: critical,
					icon: Flame,
					tone: critical ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Unassigned",
					value: open.filter((r) => !r.assignee_id).length,
					icon: Timer,
					tone: open.some((r) => !r.assignee_id) ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Closed lifetime",
					value: rows.filter((r) => r.status === "closed").length,
					icon: Send
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search issues…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: sev,
					onChange: setSev,
					options: [{
						value: "all",
						label: "All severities"
					}, ...[
						"critical",
						"high",
						"medium",
						"low"
					].map((v) => ({
						value: v,
						label: titleCase(v)
					}))]
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No issues match." })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, {
					columns: COLUMNS,
					rows: filtered,
					statusKey: "status",
					onMove: (r, status) => patch(r.id, { status }),
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium leading-tight",
								children: r.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: String(r.severity).toLowerCase() === "critical" ? "risk" : String(r.severity).toLowerCase() === "high" ? "warn" : "muted",
								children: titleCase(r.severity)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-[11px] text-muted-foreground",
							children: [
								nameOf(byId, r.assignee_id),
								" · ",
								dt(r.created_at)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							onClick: (e) => {
								e.stopPropagation();
								escalate(r);
							},
							className: "mt-1 inline-block cursor-pointer text-[11px] text-primary hover:underline",
							children: "Notify ops"
						})
					] })
				})
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Report an issue",
				fields,
				people,
				initial: { severity: "medium" },
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						status: "open"
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { IssuesPage as component };
