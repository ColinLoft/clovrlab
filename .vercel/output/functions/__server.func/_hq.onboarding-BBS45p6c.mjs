import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { _n as GraduationCap } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell, o as UserCell } from "./_ssr/ResourcePage-CoV-Rh10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.onboarding-BBS45p6c.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	pending: "border-amber-200 bg-amber-50 text-amber-700",
	in_progress: "border-blue-200 bg-blue-50 text-blue-700",
	complete: "border-emerald-200 bg-emerald-50 text-emerald-700"
};
var cfg = {
	table: "hr_onboarding",
	title: "Onboarding",
	eyebrow: "People",
	icon: GraduationCap,
	itemName: "onboarding task",
	orderBy: {
		column: "due_date",
		ascending: true
	},
	searchable: [
		"task",
		"category",
		"notes"
	],
	kpis: (rows) => [
		{
			label: "Open tasks",
			value: rows.filter((r) => r.status !== "complete").length,
			icon: GraduationCap
		},
		{
			label: "Complete",
			value: rows.filter((r) => r.status === "complete").length,
			icon: GraduationCap
		},
		{
			label: "Overdue",
			value: rows.filter((r) => r.status !== "complete" && r.due_date && new Date(r.due_date) < /* @__PURE__ */ new Date()).length,
			icon: GraduationCap
		},
		{
			label: "New hires",
			value: new Set(rows.map((r) => r.employee_id).filter(Boolean)).size,
			icon: GraduationCap
		}
	],
	columns: [
		{
			key: "task",
			label: "Task",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.task
			})
		},
		{
			key: "category",
			label: "Category"
		},
		{
			key: "assignee_id",
			label: "Owner",
			render: (r, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.assignee_id,
				profiles: c.profiles
			})
		},
		{
			key: "due_date",
			label: "Due",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.due_date })
		},
		{
			key: "status",
			label: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.status,
				palette: STATUS
			})
		}
	],
	fields: [
		{
			key: "task",
			label: "Task",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "category",
			label: "Category",
			type: "select",
			options: [
				"Paperwork",
				"Safety",
				"Equipment",
				"Systems",
				"Site orientation",
				"Training"
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
			label: "Due date",
			type: "date"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"pending",
				"in_progress",
				"complete"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea"
		}
	],
	defaults: { status: "pending" }
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config: cfg });
//#endregion
export { SplitComponent as component };
