import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { k as Star, un as HeartHandshake } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell, o as UserCell } from "./_ssr/ResourcePage-CoV-Rh10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.reviews-DmkQ1Gz7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var reviewsCfg = {
	table: "hr_reviews",
	title: "Performance Reviews",
	eyebrow: "People",
	icon: Star,
	itemName: "review",
	orderBy: {
		column: "review_date",
		ascending: false
	},
	searchable: [
		"period",
		"strengths",
		"growth_areas"
	],
	defaults: { status: "draft" },
	kpis: (rows) => [
		{
			label: "Reviews",
			value: rows.length,
			icon: Star
		},
		{
			label: "Completed",
			value: rows.filter((r) => r.status === "completed").length,
			icon: Star
		},
		{
			label: "Avg rating",
			value: rows.length ? (rows.reduce((s, r) => s + Number(r.rating || 0), 0) / rows.length).toFixed(1) : "—",
			icon: Star
		}
	],
	columns: [
		{
			key: "employee_id",
			label: "Employee",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeName, { id: r.employee_id })
		},
		{
			key: "period",
			label: "Period"
		},
		{
			key: "review_date",
			label: "Date",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.review_date })
		},
		{
			key: "rating",
			label: "Rating",
			render: (r) => r.rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: `${r.rating}/5` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "—"
			})
		},
		{
			key: "reviewer_id",
			label: "Reviewer",
			render: (r, ctx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCell, {
				userId: r.reviewer_id,
				profiles: ctx.profiles
			})
		},
		{
			key: "status",
			label: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.status,
				palette: {
					draft: "border-border bg-muted/40",
					in_review: "border-amber-500/20 bg-amber-500/10 text-amber-600",
					completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
				}
			})
		}
	],
	fields: [
		{
			key: "employee_id",
			label: "Employee",
			type: "select",
			required: true,
			options: [],
			full: true
		},
		{
			key: "period",
			label: "Period",
			type: "text",
			placeholder: "Q1 2026"
		},
		{
			key: "review_date",
			label: "Date",
			type: "date"
		},
		{
			key: "rating",
			label: "Rating (1-5)",
			type: "number"
		},
		{
			key: "reviewer_id",
			label: "Reviewer",
			type: "user"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{
					value: "draft",
					label: "Draft"
				},
				{
					value: "in_review",
					label: "In review"
				},
				{
					value: "completed",
					label: "Completed"
				}
			]
		},
		{
			key: "strengths",
			label: "Strengths",
			type: "textarea",
			full: true
		},
		{
			key: "growth_areas",
			label: "Growth areas",
			type: "textarea",
			full: true
		},
		{
			key: "goals",
			label: "Goals",
			type: "textarea",
			full: true
		}
	]
};
function EmployeeName({ id }) {
	const [name, setName] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		if (!id) return;
		supabase.from("hr_employees").select("full_name").eq("id", id).maybeSingle().then(({ data }) => {
			if (live) setName(data?.full_name ?? null);
		});
		return () => {
			live = false;
		};
	}, [id]);
	if (!id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground text-xs",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-sm font-medium",
		children: name ?? id.slice(0, 8)
	});
}
var benefitsCfg = {
	table: "hr_benefits",
	title: "Benefits",
	eyebrow: "People",
	icon: HeartHandshake,
	itemName: "benefit",
	orderBy: {
		column: "name",
		ascending: true
	},
	searchable: [
		"name",
		"provider",
		"type"
	],
	defaults: { active: true },
	kpis: (rows) => [
		{
			label: "Plans",
			value: rows.length,
			icon: HeartHandshake
		},
		{
			label: "Active",
			value: rows.filter((r) => r.active).length,
			icon: HeartHandshake
		},
		{
			label: "Monthly cost",
			value: `$${rows.filter((r) => r.active).reduce((s, r) => s + Number(r.monthly_cost || 0), 0).toFixed(0)}`,
			icon: HeartHandshake
		}
	],
	columns: [
		{
			key: "name",
			label: "Plan",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.name
			})
		},
		{
			key: "provider",
			label: "Provider"
		},
		{
			key: "type",
			label: "Type",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: r.type })
		},
		{
			key: "monthly_cost",
			label: "Cost/mo",
			render: (r) => r.monthly_cost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono",
				children: ["$", Number(r.monthly_cost).toFixed(2)]
			}) : "—"
		},
		{
			key: "employer_contribution",
			label: "Employer %",
			render: (r) => r.employer_contribution ? `${r.employer_contribution}%` : "—"
		},
		{
			key: "active",
			label: "Active",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.active ? "yes" : "no",
				palette: {
					yes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
					no: "border-border bg-muted/40"
				}
			})
		}
	],
	fields: [
		{
			key: "name",
			label: "Plan name",
			type: "text",
			required: true
		},
		{
			key: "provider",
			label: "Provider",
			type: "text"
		},
		{
			key: "type",
			label: "Type",
			type: "select",
			options: [
				"health",
				"dental",
				"vision",
				"401k",
				"life",
				"disability",
				"stipend",
				"other"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "monthly_cost",
			label: "Monthly cost",
			type: "number"
		},
		{
			key: "employer_contribution",
			label: "Employer contribution %",
			type: "number"
		},
		{
			key: "active",
			label: "Active",
			type: "bool"
		},
		{
			key: "enrollment_deadline",
			label: "Enrollment deadline",
			type: "date"
		},
		{
			key: "description",
			label: "Description",
			type: "textarea",
			full: true
		}
	]
};
function ReviewsPage() {
	const [tab, setTab] = (0, import_react.useState)("reviews");
	const [empOpts, setEmpOpts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		supabase.from("hr_employees").select("id, full_name").order("full_name").then(({ data }) => {
			setEmpOpts((data ?? []).map((e) => ({
				value: e.id,
				label: e.full_name
			})));
		});
	}, []);
	const cfg = tab === "reviews" ? {
		...reviewsCfg,
		fields: reviewsCfg.fields.map((f) => f.key === "employee_id" ? {
			...f,
			options: empOpts
		} : f)
	} : benefitsCfg;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-6 pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "inline-flex rounded-lg border border-border bg-card p-1 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTab("reviews"),
				className: `px-3 py-1.5 rounded-md ${tab === "reviews" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
				children: "Reviews"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTab("benefits"),
				className: `px-3 py-1.5 rounded-md ${tab === "benefits" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
				children: "Benefits"
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config: cfg }, tab)] });
}
//#endregion
export { ReviewsPage as component };
