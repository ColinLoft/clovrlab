import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { _n as GraduationCap } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell, o as UserCell } from "./_ssr/ResourcePage-CMf_zApm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.training-pfDGtPSa.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	assigned: "border-border bg-muted/40 text-muted-foreground",
	in_progress: "border-blue-200 bg-blue-50 text-blue-700",
	completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
	expired: "border-red-200 bg-red-50 text-red-700"
};
var cfg = {
	table: "hr_training",
	title: "Training",
	eyebrow: "People",
	icon: GraduationCap,
	itemName: "training record",
	noCreatedBy: true,
	orderBy: {
		column: "completed_date",
		ascending: false
	},
	searchable: [
		"course",
		"category",
		"instructor",
		"score"
	],
	kpis: (rows) => [
		{
			label: "Records",
			value: rows.length,
			icon: GraduationCap
		},
		{
			label: "Completed",
			value: rows.filter((r) => r.status === "completed").length,
			icon: GraduationCap
		},
		{
			label: "Outstanding required",
			value: rows.filter((r) => r.required && r.status !== "completed").length,
			icon: GraduationCap
		},
		{
			label: "Trained staff",
			value: new Set(rows.map((r) => r.user_id).filter(Boolean)).size,
			icon: GraduationCap
		}
	],
	columns: [
		{
			key: "course",
			label: "Course",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.course
			})
		},
		{
			key: "user_id",
			label: "Employee",
			render: (r, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.user_id,
				profiles: c.profiles
			})
		},
		{
			key: "category",
			label: "Category"
		},
		{
			key: "required",
			label: "Required",
			render: (r) => r.required ? "Yes" : "No"
		},
		{
			key: "instructor",
			label: "Instructor"
		},
		{
			key: "completed_date",
			label: "Completed",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.completed_date })
		},
		{
			key: "expires_date",
			label: "Expires",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.expires_date })
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
			key: "course",
			label: "Course",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "user_id",
			label: "Employee",
			type: "user"
		},
		{
			key: "category",
			label: "Category",
			type: "select",
			options: [
				"Safety",
				"Equipment",
				"Compliance",
				"Trade skills",
				"Leadership",
				"Software"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "required",
			label: "Required training",
			type: "bool"
		},
		{
			key: "instructor",
			label: "Instructor / provider",
			type: "text"
		},
		{
			key: "completed_date",
			label: "Completed",
			type: "date"
		},
		{
			key: "expires_date",
			label: "Expires",
			type: "date"
		},
		{
			key: "score",
			label: "Score / result",
			type: "text"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"assigned",
				"in_progress",
				"completed",
				"expired"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "document_url",
			label: "Certificate URL",
			type: "text",
			full: true
		}
	],
	defaults: {
		status: "assigned",
		required: false
	}
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config: cfg });
//#endregion
export { SplitComponent as component };
