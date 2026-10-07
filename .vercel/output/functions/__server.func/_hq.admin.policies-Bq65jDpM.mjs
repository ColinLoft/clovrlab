import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { B as ShieldCheck, J as ScrollText, ln as HeartPulse } from "./_libs/lucide-react.mjs";
import { D as useRows, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, w as titleCase, y as money } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.policies-Bq65jDpM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var policyFields = [
	{
		key: "title",
		label: "Policy",
		type: "text",
		required: true,
		full: true
	},
	{
		key: "category",
		label: "Category",
		type: "select",
		options: [
			"conduct",
			"safety",
			"security",
			"leave",
			"travel",
			"finance"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "version",
		label: "Version",
		type: "text"
	},
	{
		key: "effective_date",
		label: "Effective",
		type: "date"
	},
	{
		key: "active",
		label: "In force",
		type: "bool"
	},
	{
		key: "content",
		label: "Policy text",
		type: "textarea",
		full: true
	}
];
var benefitFields = [
	{
		key: "name",
		label: "Benefit",
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
			"retirement",
			"wellness",
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
		label: "Employer share",
		type: "number"
	},
	{
		key: "enrollment_deadline",
		label: "Enrollment closes",
		type: "date"
	},
	{
		key: "active",
		label: "Offered",
		type: "bool"
	},
	{
		key: "description",
		label: "Summary",
		type: "textarea",
		full: true
	}
];
/** The HR handbook: policies in force and the benefits package behind them. */
function Policies() {
	const policies = useRows("hr_policies", { order: { column: "effective_date" } });
	const benefits = useRows("hr_benefits", { order: {
		column: "name",
		ascending: true
	} });
	const [q, setQ] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("policies");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const activePolicies = policies.rows.filter((p) => p.active !== false);
	const monthly = benefits.rows.filter((b) => b.active !== false).reduce((s, b) => s + Number(b.employer_contribution || 0), 0);
	const filteredPolicies = policies.rows.filter((p) => `${p.title} ${p.category ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "People & administration",
		title: "Handbook",
		lede: "Policies in force across the company and the benefits package they sit alongside — one source everyone can point at.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: tab === "policies" ? "Add policy" : "Add benefit",
			onClick: () => setOpen(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Policies in force",
						value: activePolicies.length,
						hint: `${policies.rows.length} total`,
						icon: ScrollText
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Benefits offered",
						value: benefits.rows.filter((b) => b.active !== false).length,
						icon: HeartPulse
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Employer contribution",
						value: money(monthly),
						hint: "Per month, all plans",
						icon: ShieldCheck,
						tone: "good"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toolbar, {
				q,
				setQ,
				placeholder: "Search the handbook…",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: tab === "policies" ? "primary" : "default",
					onClick: () => setTab("policies"),
					children: "Policies"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: tab === "benefits" ? "primary" : "default",
					onClick: () => setTab("benefits"),
					children: "Benefits"
				})]
			}),
			tab === "policies" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				children: policies.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filteredPolicies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No policies published." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: filteredPolicies.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setExpanded(expanded === p.id ? null : p.id),
						className: "flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-muted/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-muted-foreground",
								children: [
									titleCase(p.category),
									" · v",
									p.version ?? "1",
									" · effective ",
									d(p.effective_date)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: p.active === false ? "muted" : "good",
							children: p.active === false ? "retired" : "in force"
						})]
					}), expanded === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border bg-muted/20 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-sm leading-6 text-muted-foreground",
							children: p.content || "No text recorded."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								onClick: () => policies.patch(p.id, { active: p.active === false }),
								children: p.active === false ? "Reinstate" : "Retire"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "danger",
								onClick: () => policies.remove(p.id),
								children: "Delete"
							})]
						})]
					})] }, p.id))
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: [
					benefits.loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) }),
					!benefits.loading && benefits.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No benefits recorded." }) }),
					benefits.rows.filter((b) => `${b.name} ${b.provider ?? ""}`.toLowerCase().includes(q.toLowerCase())).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: b.name,
						hint: b.provider ?? void 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: titleCase(b.type)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: b.active === false ? "muted" : "good",
									children: b.active === false ? "closed" : "offered"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 space-y-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Monthly cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "tabular-nums",
											children: money(Number(b.monthly_cost || 0))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Employer share" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "tabular-nums",
											children: money(Number(b.employer_contribution || 0))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Enrollment closes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d(b.enrollment_deadline) })]
									})
								]
							}),
							b.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-5 text-muted-foreground",
								children: b.description
							})
						]
					}, b.id))
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: tab === "policies" ? "Publish a policy" : "Add a benefit",
				fields: tab === "policies" ? policyFields : benefitFields,
				initial: { active: true },
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await (tab === "policies" ? policies.insert(v) : benefits.insert(v));
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Policies as component };
