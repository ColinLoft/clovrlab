import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Ir as Award } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell, o as UserCell } from "./_ssr/ResourcePage-CYDkQVfk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.certifications-DuRKRMos.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	active: "border-emerald-200 bg-emerald-50 text-emerald-700",
	expiring: "border-amber-200 bg-amber-50 text-amber-700",
	expired: "border-red-200 bg-red-50 text-red-700"
};
var soon = (d) => !!d && new Date(d).getTime() - Date.now() < 5184e6;
var cfg = {
	table: "hr_certifications",
	title: "Certifications",
	eyebrow: "People",
	icon: Award,
	itemName: "certification",
	noCreatedBy: true,
	orderBy: {
		column: "expires_date",
		ascending: true
	},
	searchable: [
		"name",
		"issuer",
		"notes"
	],
	kpis: (rows) => [
		{
			label: "Certifications",
			value: rows.length,
			icon: Award
		},
		{
			label: "Expiring < 60d",
			value: rows.filter((r) => soon(r.expires_date) && r.status !== "expired").length,
			icon: Award
		},
		{
			label: "Expired",
			value: rows.filter((r) => r.expires_date && new Date(r.expires_date) < /* @__PURE__ */ new Date()).length,
			icon: Award
		},
		{
			label: "Certified staff",
			value: new Set(rows.map((r) => r.user_id).filter(Boolean)).size,
			icon: Award
		}
	],
	columns: [
		{
			key: "name",
			label: "Certification",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.name
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
			key: "issuer",
			label: "Issuer"
		},
		{
			key: "issue_date",
			label: "Issued",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.issue_date })
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
			key: "name",
			label: "Certification",
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
			key: "issuer",
			label: "Issuing body",
			type: "text",
			placeholder: "OSHA, NCCER, State"
		},
		{
			key: "issue_date",
			label: "Issue date",
			type: "date"
		},
		{
			key: "expires_date",
			label: "Expiration",
			type: "date"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"active",
				"expiring",
				"expired"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "document_url",
			label: "Document URL",
			type: "text",
			full: true
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea"
		}
	],
	defaults: { status: "active" }
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config: cfg });
//#endregion
export { SplitComponent as component };
