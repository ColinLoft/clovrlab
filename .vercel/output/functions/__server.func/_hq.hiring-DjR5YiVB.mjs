import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { er as ClipboardCheck, f as UserSearch } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell, o as UserCell } from "./_ssr/ResourcePage-CMf_zApm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.hiring-DjR5YiVB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var applicantsCfg = {
	table: "hr_applicants",
	title: "Applicants",
	eyebrow: "People",
	icon: UserSearch,
	itemName: "applicant",
	orderBy: {
		column: "created_at",
		ascending: false
	},
	searchable: [
		"name",
		"email",
		"role",
		"department"
	],
	defaults: { stage: "applied" },
	kpis: (rows) => [
		{
			label: "Applicants",
			value: rows.length,
			icon: UserSearch
		},
		{
			label: "Interviewing",
			value: rows.filter((r) => r.stage === "interview").length,
			icon: UserSearch
		},
		{
			label: "Offers out",
			value: rows.filter((r) => r.stage === "offer").length,
			icon: UserSearch
		},
		{
			label: "Hired",
			value: rows.filter((r) => r.stage === "hired").length,
			icon: UserSearch
		}
	],
	columns: [
		{
			key: "name",
			label: "Candidate",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.name
			})
		},
		{
			key: "role",
			label: "Role"
		},
		{
			key: "department",
			label: "Team"
		},
		{
			key: "stage",
			label: "Stage",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: r.stage })
		},
		{
			key: "interviewer_id",
			label: "Interviewer",
			render: (r, ctx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.interviewer_id,
				profiles: ctx.profiles
			})
		},
		{
			key: "interview_date",
			label: "Interview",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.interview_date })
		},
		{
			key: "source",
			label: "Source"
		}
	],
	fields: [
		{
			key: "name",
			label: "Full name",
			type: "text",
			required: true
		},
		{
			key: "email",
			label: "Email",
			type: "text"
		},
		{
			key: "phone",
			label: "Phone",
			type: "text"
		},
		{
			key: "role",
			label: "Role applied for",
			type: "text"
		},
		{
			key: "department",
			label: "Team",
			type: "text"
		},
		{
			key: "stage",
			label: "Stage",
			type: "select",
			required: true,
			options: [
				"applied",
				"screening",
				"interview",
				"offer",
				"hired",
				"rejected"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "source",
			label: "Source",
			type: "text"
		},
		{
			key: "interviewer_id",
			label: "Interviewer",
			type: "user"
		},
		{
			key: "interview_date",
			label: "Interview date",
			type: "date"
		},
		{
			key: "resume_url",
			label: "Resume link",
			type: "text",
			full: true
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	]
};
var onboardingCfg = {
	table: "hr_onboarding",
	title: "Onboarding Tasks",
	eyebrow: "People",
	icon: ClipboardCheck,
	itemName: "task",
	orderBy: {
		column: "due_date",
		ascending: true
	},
	searchable: ["task", "category"],
	defaults: { status: "pending" },
	kpis: (rows) => [
		{
			label: "Tasks",
			value: rows.length,
			icon: ClipboardCheck
		},
		{
			label: "Pending",
			value: rows.filter((r) => r.status === "pending").length,
			icon: ClipboardCheck
		},
		{
			label: "In progress",
			value: rows.filter((r) => r.status === "in_progress").length,
			icon: ClipboardCheck
		},
		{
			label: "Done",
			value: rows.filter((r) => r.status === "done").length,
			icon: ClipboardCheck
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
			label: "Category",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: r.category })
		},
		{
			key: "assignee_id",
			label: "Assignee",
			render: (r, ctx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.assignee_id,
				profiles: ctx.profiles
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
				palette: {
					pending: "border-border bg-muted/40",
					in_progress: "border-blue-500/20 bg-blue-500/10 text-blue-600",
					done: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
				}
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
				"Equipment",
				"Access",
				"Training",
				"Intro",
				"Benefits"
			].map((v) => ({
				value: v,
				label: v
			}))
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
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{
					value: "pending",
					label: "Pending"
				},
				{
					value: "in_progress",
					label: "In progress"
				},
				{
					value: "done",
					label: "Done"
				},
				{
					value: "blocked",
					label: "Blocked"
				}
			],
			required: true
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	]
};
function HiringPage() {
	const [tab, setTab] = (0, import_react.useState)("applicants");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-6 pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "inline-flex rounded-lg border border-border bg-card p-1 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTab("applicants"),
				className: `px-3 py-1.5 rounded-md ${tab === "applicants" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
				children: "Applicants"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTab("onboarding"),
				className: `px-3 py-1.5 rounded-md ${tab === "onboarding" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
				children: "Onboarding"
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config: tab === "applicants" ? applicantsCfg : onboardingCfg }, tab)] });
}
//#endregion
export { HiringPage as component };
