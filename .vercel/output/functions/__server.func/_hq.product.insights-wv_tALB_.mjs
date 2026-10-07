import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Nt as MessageSquareHeart, y as TrendingUp } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, f as Stat, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, t as Bar, v as dt, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.product.insights-wv_tALB_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var IMPACTS = [
	"blocker",
	"high",
	"medium",
	"low"
];
function InsightsPage() {
	const { rows, loading, patch } = useRows("prod_feedback", { order: {
		column: "created_at",
		ascending: false
	} });
	const { rows: features } = useRows("prod_features", { select: "id, title, stage" });
	const [team, setTeam] = (0, import_react.useState)("all");
	const teams = (0, import_react.useMemo)(() => [...new Set(rows.map((r) => r.source_team).filter(Boolean))], [rows]);
	const shown = (0, import_react.useMemo)(() => rows.filter((r) => team === "all" || r.source_team === team), [rows, team]);
	const byImpact = IMPACTS.map((i) => ({
		impact: i,
		items: shown.filter((r) => (r.impact || "medium") === i)
	}));
	const linked = shown.filter((r) => r.feature_id).length;
	const open = shown.filter((r) => r.status !== "closed" && r.status !== "resolved").length;
	const maxTeam = Math.max(1, ...teams.map((t) => rows.filter((r) => r.source_team === t).length));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Product & Program",
		title: "Field insights",
		lede: "What operators, engineers and partners actually told us — sorted by how much it hurts, and whether it turned into a commitment.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
			cols: 4,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Signals collected",
					value: shown.length,
					icon: MessageSquareHeart
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Still open",
					value: open,
					tone: open ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Turned into features",
					value: linked,
					tone: "good",
					icon: TrendingUp
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Conversion",
					value: `${shown.length ? Math.round(linked / shown.length * 100) : 0}%`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 xl:grid-cols-[260px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Where it came from",
					pad: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 p-4",
						children: [teams.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No sources yet."
						}), teams.map((t) => {
							const n = rows.filter((r) => r.source_team === t).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setTeam(team === t ? "all" : t),
								className: "block w-full text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: team === t ? "font-semibold text-primary" : "",
										children: titleCase(t)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-muted-foreground",
										children: n
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										value: n,
										max: maxTeam
									})
								})]
							}, t);
						})]
					})
				}), team !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTeam("all"),
					className: "w-full rounded-md border border-border py-2 text-xs hover:bg-muted",
					children: "Clear filter"
				})]
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [byImpact.map(({ impact, items }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: `${titleCase(impact)} impact`,
					hint: impact === "blocker" ? "Stops the mission — decide this week" : void 0,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs tabular-nums text-muted-foreground",
						children: items.length
					}),
					children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-3 text-xs text-muted-foreground",
						children: "Nothing at this level."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: items.map((r) => {
							const f = features.find((x) => x.id === r.feature_id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "min-w-[200px] flex-1 text-sm font-medium",
												children: r.summary
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												tone: statusTone(r.status),
												children: titleCase(r.status)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: r.status ?? "new",
												onChange: (e) => patch(r.id, { status: e.target.value }),
												className: "rounded-md border border-border bg-background px-2 py-1 text-[11px]",
												children: [
													"new",
													"triaged",
													"planned",
													"resolved",
													"closed"
												].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s,
													children: titleCase(s)
												}, s))
											})
										]
									}),
									r.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
										children: r.details
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1.5 text-[11px] text-muted-foreground",
										children: [
											titleCase(r.source_team),
											" · ",
											dt(r.created_at),
											f && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · linked to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary",
												children: f.title
											})] })
										]
									})
								]
							}, r.id);
						})
					})
				}, impact)), shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No field feedback recorded yet." }) })]
			})]
		})]
	});
}
//#endregion
export { InsightsPage as component };
