import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Bn as Eye, Vn as EyeOff, kr as BookOpen, vn as Globe } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell } from "./_ssr/ResourcePage-CYDkQVfk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.kb-DXwcVmo9.js
var import_jsx_runtime = require_jsx_runtime();
var AUDIENCE_PALETTE = {
	internal: "border-border bg-muted/40 text-muted-foreground",
	public: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
};
var config = {
	table: "cs_kb_articles",
	title: "Knowledge Base",
	eyebrow: "Research & Partners · KB",
	icon: BookOpen,
	itemName: "article",
	baseFilter: { kind: "kb" },
	searchable: [
		"title",
		"category",
		"body"
	],
	orderBy: {
		column: "updated_at",
		ascending: false
	},
	kpis: (rows) => [
		{
			label: "Articles",
			value: rows.length,
			icon: BookOpen
		},
		{
			label: "Published",
			value: rows.filter((r) => r.published).length,
			icon: Eye
		},
		{
			label: "Drafts",
			value: rows.filter((r) => !r.published).length,
			icon: EyeOff
		},
		{
			label: "Public",
			value: rows.filter((r) => r.audience === "public").length,
			icon: Globe
		}
	],
	columns: [
		{
			key: "title",
			label: "Title",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.title
			})
		},
		{
			key: "category",
			label: "Category"
		},
		{
			key: "audience",
			label: "Audience",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.audience,
				palette: AUDIENCE_PALETTE
			})
		},
		{
			key: "published",
			label: "Status",
			render: (r) => r.published ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-emerald-500 text-xs",
				children: "Published"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground text-xs",
				children: "Draft"
			})
		},
		{
			key: "views",
			label: "Views",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-xs",
				children: r.views ?? 0
			})
		},
		{
			key: "updated_at",
			label: "Updated",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.updated_at })
		}
	],
	fields: [
		{
			key: "title",
			label: "Title",
			type: "text",
			required: true
		},
		{
			key: "category",
			label: "Category",
			type: "text",
			placeholder: "Setup, Troubleshooting..."
		},
		{
			key: "audience",
			label: "Audience",
			type: "select",
			options: [{
				value: "internal",
				label: "Internal only"
			}, {
				value: "public",
				label: "Public / customers"
			}]
		},
		{
			key: "published",
			label: "Published",
			type: "bool",
			placeholder: "Visible to audience"
		},
		{
			key: "body",
			label: "Body (markdown)",
			type: "textarea",
			full: true
		},
		{
			key: "tags",
			label: "Tags",
			type: "tags",
			full: true
		}
	],
	defaults: {
		audience: "internal",
		published: false,
		views: 0
	}
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config });
//#endregion
export { SplitComponent as component };
