import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Tr as Building2 } from "./_libs/lucide-react.mjs";
import { i as ResourcePage, o as UserCell } from "./_ssr/ResourcePage-CoV-Rh10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.departments-DPCdj-Py.js
var import_jsx_runtime = require_jsx_runtime();
var cfg = {
	table: "hr_departments",
	title: "Departments",
	eyebrow: "Administration",
	icon: Building2,
	itemName: "department",
	orderBy: {
		column: "name",
		ascending: true
	},
	searchable: ["name", "description"],
	kpis: (rows) => [
		{
			label: "Departments",
			value: rows.length,
			icon: Building2
		},
		{
			label: "Total headcount",
			value: rows.reduce((s, r) => s + Number(r.headcount || 0), 0),
			icon: Building2
		},
		{
			label: "Total budget",
			value: `$${rows.reduce((s, r) => s + Number(r.budget || 0), 0).toLocaleString()}`,
			icon: Building2
		}
	],
	columns: [
		{
			key: "name",
			label: "Name",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.name
			})
		},
		{
			key: "lead_id",
			label: "Lead",
			render: (r, ctx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.lead_id,
				profiles: ctx.profiles
			})
		},
		{
			key: "headcount",
			label: "Headcount"
		},
		{
			key: "budget",
			label: "Budget",
			render: (r) => r.budget ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono",
				children: ["$", Number(r.budget).toLocaleString()]
			}) : "—"
		},
		{
			key: "description",
			label: "Description"
		}
	],
	fields: [
		{
			key: "name",
			label: "Department name",
			type: "text",
			required: true
		},
		{
			key: "lead_id",
			label: "Department lead",
			type: "user"
		},
		{
			key: "headcount",
			label: "Headcount",
			type: "number"
		},
		{
			key: "budget",
			label: "Annual budget",
			type: "number"
		},
		{
			key: "description",
			label: "Description",
			type: "textarea",
			full: true
		}
	]
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config: cfg });
//#endregion
export { SplitComponent as component };
