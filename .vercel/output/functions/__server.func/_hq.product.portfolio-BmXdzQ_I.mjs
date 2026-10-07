import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { T as Target, en as Layers } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.product.portfolio-BmXdzQ_I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRIORITIES = [
	"p0",
	"p1",
	"p2",
	"p3"
];
var STAGES = [
	"discovery",
	"defined",
	"building",
	"validating",
	"shipped"
];
var fields = (releases) => [
	{
		key: "title",
		label: "Feature",
		type: "text",
		required: true,
		full: true
	},
	{
		key: "area",
		label: "Area",
		type: "text",
		placeholder: "Detection, Autonomy, Ground station…"
	},
	{
		key: "owner_team",
		label: "Owning team",
		type: "select",
		options: [
			"product",
			"eng",
			"ops",
			"mfg",
			"systems"
		].map((v) => ({
			value: v,
			label: titleCase(v)
		}))
	},
	{
		key: "stage",
		label: "Stage",
		type: "select",
		options: STAGES.map((v) => ({
			value: v,
			label: titleCase(v)
		}))
	},
	{
		key: "priority",
		label: "Priority",
		type: "select",
		options: PRIORITIES.map((v) => ({
			value: v,
			label: v.toUpperCase()
		}))
	},
	{
		key: "release_id",
		label: "Release",
		type: "select",
		options: releases.map((r) => ({
			value: r.id,
			label: `${r.version} — ${r.name}`
		}))
	},
	{
		key: "progress",
		label: "Progress %",
		type: "number"
	},
	{
		key: "problem",
		label: "Problem it solves",
		type: "textarea",
		full: true
	},
	{
		key: "success_metric",
		label: "How we know it worked",
		type: "textarea",
		full: true
	}
];
function PortfolioPage() {
	const { rows, loading, insert, patch } = useRows("prod_features", { order: {
		column: "updated_at",
		ascending: false
	} });
	const { rows: releases } = useRows("prod_releases", { select: "id, version, name" });
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [focus, setFocus] = (0, import_react.useState)(null);
	const matrix = (0, import_react.useMemo)(() => {
		return [...new Set(rows.map((r) => r.area || "Unassigned"))].sort().map((area) => ({
			area,
			cells: PRIORITIES.map((p) => rows.filter((r) => (r.area || "Unassigned") === area && (r.priority || "p2") === p))
		}));
	}, [rows]);
	const shipped = rows.filter((r) => r.stage === "shipped").length;
	const avg = rows.length ? Math.round(rows.reduce((n, r) => n + Number(r.progress || 0), 0) / rows.length) : 0;
	const p0 = rows.filter((r) => (r.priority || "") === "p0" && r.stage !== "shipped").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Product & Program",
		title: "Feature portfolio",
		lede: "Every committed feature laid out by product area and priority, so trade-offs are argued with the whole board in view.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add feature",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Features tracked",
						value: rows.length,
						icon: Layers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open P0s",
						value: p0,
						tone: p0 ? "risk" : "good",
						icon: Target
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Shipped",
						value: shipped,
						tone: "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Average progress",
						value: `${avg}%`
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No features yet. Add the first commitment to build the board." })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-5",
				pad: false,
				title: "Area × priority",
				hint: "Click a card to inspect the bet",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[900px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[180px_repeat(4,1fr)] border-b border-border bg-muted/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Area"
							}), PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: p.toUpperCase()
							}, p))]
						}), matrix.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[180px_repeat(4,1fr)] border-b border-border last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-r border-border px-4 py-3 text-sm font-medium",
								children: row.area
							}), row.cells.map((cell, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 border-r border-border p-2 last:border-0",
								children: [cell.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block px-2 py-3 text-[11px] text-muted-foreground",
									children: "—"
								}), cell.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFocus(f),
									className: "w-full rounded-md border border-border bg-card p-2.5 text-left transition hover:border-primary/40 hover:shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[13px] font-medium",
											children: f.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												tone: statusTone(f.stage),
												children: titleCase(f.stage)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] tabular-nums text-muted-foreground",
												children: [Number(f.progress || 0), "%"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { value: Number(f.progress || 0) })
										})
									]
								}, f.id))]
							}, i))]
						}, row.area))]
					})
				})
			}),
			focus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6",
				onClick: () => setFocus(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-xl rounded-t-xl border border-border bg-card p-5 shadow-2xl sm:rounded-xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: [
								focus.area || "Unassigned",
								" · ",
								(focus.priority || "p2").toUpperCase()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-lg font-semibold",
							children: focus.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Problem"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted-foreground",
									children: focus.problem || "Not written down yet."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Success metric"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-muted-foreground",
									children: focus.success_metric || "Not defined."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Stage"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: focus.stage ?? "discovery",
										onChange: (e) => {
											patch(focus.id, { stage: e.target.value });
											setFocus({
												...focus,
												stage: e.target.value
											});
										},
										className: "rounded-md border border-border bg-background px-2 py-1 text-xs",
										children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: titleCase(s)
										}, s))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFocus(null),
							className: "mt-5 w-full rounded-md border border-border py-2 text-sm hover:bg-muted",
							children: "Close"
						})
					]
				})
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Add feature",
				fields: fields(releases),
				initial: {
					stage: "discovery",
					priority: "p2",
					owner_team: "product",
					progress: 0
				},
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						progress: Number(v.progress || 0)
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { PortfolioPage as component };
