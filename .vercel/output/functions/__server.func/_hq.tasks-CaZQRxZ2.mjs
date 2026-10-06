import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, M as SquareCheckBig, cr as CircleCheck, lr as CircleAlert } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell, o as UserCell, r as ProjectCell } from "./_ssr/ResourcePage-CoV-Rh10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.tasks-CaZQRxZ2.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	todo: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
	in_progress: "border-blue-500/30 bg-blue-500/10 text-blue-500",
	review: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
	done: "border-green-500/30 bg-green-500/10 text-green-500",
	blocked: "border-destructive/30 bg-destructive/10 text-destructive"
};
var PRIORITY = {
	low: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
	medium: "border-blue-500/30 bg-blue-500/10 text-blue-500",
	high: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
	urgent: "border-destructive/30 bg-destructive/10 text-destructive"
};
var config = {
	table: "eng_tasks",
	title: "Tasks & Boards",
	eyebrow: "Engineering · Tasks",
	icon: SquareCheckBig,
	itemName: "task",
	searchable: ["title", "description"],
	orderBy: {
		column: "created_at",
		ascending: false
	},
	kpis: (rows) => [
		{
			label: "Total",
			value: rows.length,
			icon: SquareCheckBig
		},
		{
			label: "In progress",
			value: rows.filter((r) => r.status === "in_progress").length,
			icon: Clock
		},
		{
			label: "Blocked",
			value: rows.filter((r) => r.status === "blocked").length,
			icon: CircleAlert
		},
		{
			label: "Done",
			value: rows.filter((r) => r.status === "done").length,
			icon: CircleCheck
		}
	],
	columns: [
		{
			key: "title",
			label: "Task",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.title
			})
		},
		{
			key: "project_id",
			label: "Project",
			render: (r, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCell, {
				projectId: r.project_id,
				projects: c.projects
			})
		},
		{
			key: "status",
			label: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.status,
				palette: STATUS
			})
		},
		{
			key: "priority",
			label: "Priority",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.priority,
				palette: PRIORITY
			})
		},
		{
			key: "assignee_id",
			label: "Assignee",
			render: (r, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.assignee_id,
				profiles: c.profiles
			})
		},
		{
			key: "due_date",
			label: "Due",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.due_date })
		}
	],
	fields: [
		{
			key: "title",
			label: "Title",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "project_id",
			label: "Project",
			type: "project"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{
					value: "todo",
					label: "To do"
				},
				{
					value: "in_progress",
					label: "In progress"
				},
				{
					value: "review",
					label: "Review"
				},
				{
					value: "done",
					label: "Done"
				},
				{
					value: "blocked",
					label: "Blocked"
				}
			]
		},
		{
			key: "priority",
			label: "Priority",
			type: "select",
			options: [
				{
					value: "low",
					label: "Low"
				},
				{
					value: "medium",
					label: "Medium"
				},
				{
					value: "high",
					label: "High"
				},
				{
					value: "urgent",
					label: "Urgent"
				}
			]
		},
		{
			key: "assignee_id",
			label: "Assignee",
			type: "user"
		},
		{
			key: "due_date",
			label: "Due date",
			type: "date"
		},
		{
			key: "tags",
			label: "Tags (comma-separated)",
			type: "tags",
			full: true
		},
		{
			key: "description",
			label: "Description",
			type: "textarea",
			full: true
		}
	],
	defaults: {
		status: "todo",
		priority: "medium",
		tags: []
	}
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config });
//#endregion
export { SplitComponent as component };
