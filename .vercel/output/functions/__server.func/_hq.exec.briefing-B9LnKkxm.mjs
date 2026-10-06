import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Er as Bug, Sn as Gauge, T as Target, Zn as Coins, at as Radar, ut as Plane } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, t as Bar, x as pct, y as money } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.exec.briefing-B9LnKkxm.js
var import_jsx_runtime = require_jsx_runtime();
function Briefing() {
	const objectives = useRows("exec_objectives", { order: { column: "created_at" } });
	const detections = useRows("ops_detections", {
		order: { column: "created_at" },
		limit: 100
	});
	const flights = useRows("ops_flights", {
		order: { column: "created_at" },
		limit: 100
	});
	const aircraft = useRows("fleet_aircraft", { limit: 100 });
	const grants = useRows("fund_grants", { limit: 200 });
	const issues = useRows("eng_issues", { limit: 200 });
	const requests = useRows("team_requests", {
		order: { column: "created_at" },
		limit: 50
	});
	const ready = aircraft.rows.filter((a) => ["available", "ready"].includes(String(a.status).toLowerCase())).length;
	const awarded = grants.rows.filter((g) => g.stage === "awarded").reduce((s, g) => s + Number(g.amount || 0), 0);
	const blockers = issues.rows.filter((i) => ["critical", "high"].includes(String(i.severity ?? i.priority).toLowerCase()) && i.status !== "closed");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Leadership",
		title: "Org briefing",
		lede: "One read of the whole organization: what flew, what is funded, what is blocked, and who needs a decision.",
		wide: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
			cols: 5,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Detections logged",
					value: detections.rows.length,
					icon: Radar
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Flights flown",
					value: flights.rows.length,
					icon: Plane
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Aircraft ready",
					value: `${ready}/${aircraft.rows.length}`,
					tone: ready ? "good" : "warn",
					icon: Gauge
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Funding awarded",
					value: money(awarded),
					icon: Coins
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "High-severity issues",
					value: blockers.length,
					tone: blockers.length ? "risk" : "good",
					icon: Bug
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-[1.3fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Objectives this quarter",
				hint: "Progress rolled up from every team",
				pad: false,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/exec/okrs",
					className: "text-xs font-medium text-primary hover:underline",
					children: "Open OKRs"
				}),
				children: objectives.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : objectives.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No objectives set for this quarter." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: objectives.rows.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: o.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(o.status),
									children: o.status || "planned"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [
									o.owner_team || "Unowned",
									" · ",
									o.quarter || "—"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { value: Number(o.progress || 0) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground",
									children: [o.progress ?? 0, "%"]
								})]
							})
						]
					}, o.id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Waiting on leadership",
					hint: "Cross-team requests escalated here",
					pad: false,
					children: requests.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : requests.rows.filter((r) => r.to_team === "Leadership" && r.status !== "closed").length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing waiting on you." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: requests.rows.filter((r) => r.to_team === "Leadership" && r.status !== "closed").map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: r.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"From ",
									r.from_team,
									" · due ",
									d(r.due_date)
								]
							})]
						}, r.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: "Where the risk is",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Fleet availability"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [pct(ready, aircraft.rows.length || 1), "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Open high-severity issues"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: blockers.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Grants awaiting decision"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: grants.rows.filter((g) => g.stage === "submitted").length
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/exec/decisions",
						className: "mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5" }), " Record a decision"]
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { Briefing as component };
