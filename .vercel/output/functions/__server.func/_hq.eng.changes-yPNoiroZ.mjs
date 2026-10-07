import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, bn as GitPullRequestArrow, cr as CircleCheck, zn as Factory } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, T as useMe, b as nameOf, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.changes-yPNoiroZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"draft",
	"in_review",
	"approved",
	"implemented",
	"rejected"
];
function ChangesPage() {
	const { rows, loading, insert, patch } = useRows("eng_ecos", { order: { column: "created_at" } });
	const reviews = useRows("eng_design_reviews", { order: { column: "created_at" } });
	const projects = useRows("eng_projects", { order: {
		column: "name",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const me = useMe();
	const [creating, setCreating] = (0, import_react.useState)(false);
	const fields = [
		{
			key: "title",
			label: "Change title",
			type: "text",
			required: true,
			full: true
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
			key: "reason",
			label: "Reason for change",
			type: "textarea",
			full: true
		},
		{
			key: "impact",
			label: "Impact (cost, weight, schedule)",
			type: "textarea",
			full: true
		},
		{
			key: "requested_by",
			label: "Requested by",
			type: "user"
		}
	];
	const byStage = (s) => rows.filter((r) => (r.status ?? "draft") === s);
	const approveAndBuild = async (r) => {
		await patch(r.id, {
			status: "approved",
			approved_by: me,
			approved_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		await raiseRequest({
			from_team: "eng",
			to_team: "mfg",
			subject: `Implement change — ${r.title}`,
			details: r.impact || "Approved engineering change ready for production implementation.",
			entity_type: "eng_ecos",
			entity_id: r.id,
			priority: "high"
		});
		alert("Approved and routed to Manufacturing.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Engineering · Configuration",
		title: "Change control",
		lede: "Nothing on a flying aircraft changes silently. Every engineering change is reviewed, approved by a named engineer, and handed to production.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Raise change",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "In review",
					value: byStage("in_review").length,
					icon: Clock,
					tone: byStage("in_review").length ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Approved",
					value: byStage("approved").length,
					icon: CircleCheck,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Implemented",
					value: byStage("implemented").length,
					icon: Factory
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Design reviews",
					value: reviews.rows.length,
					icon: GitPullRequestArrow
				})
			] }),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 xl:grid-cols-[1.6fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Change orders",
					pad: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No changes raised." }), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: r.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: [
												"Raised ",
												dt(r.created_at),
												" by ",
												nameOf(byId, r.requested_by),
												r.approved_by ? ` · approved by ${nameOf(byId, r.approved_by)}` : ""
											]
										}),
										r.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1.5 text-xs text-muted-foreground",
											children: r.reason
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: r.status ?? "draft",
										onChange: (e) => patch(r.id, { status: e.target.value }),
										className: "rounded border border-border bg-background px-2 py-1 text-xs capitalize",
										children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: titleCase(s)
										}, s))
									}), r.status !== "approved" && r.status !== "implemented" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										variant: "primary",
										onClick: () => approveAndBuild(r),
										children: "Approve"
									})]
								})]
							})
						}, r.id))]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Design reviews",
					hint: "Gate events",
					pad: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [reviews.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No reviews scheduled." }), reviews.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm",
									children: r.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: dt(r.scheduled_date ?? r.review_date)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(r.status),
								children: titleCase(r.status)
							})]
						}, r.id))]
					})
				})]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Raise an engineering change",
				fields,
				people,
				initial: { requested_by: me },
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						status: "draft"
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { ChangesPage as component };
