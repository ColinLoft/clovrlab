import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { P as Smile, Zt as LifeBuoy, jt as MessageSquare } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, t as Bar, v as dt, x as pct } from "./_ssr/kit-CJyOYuhv.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.product.support-HxGohizJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Product's read on operator support: what breaks in the field and how it feels. */
function ProductSupport() {
	const { rows, loading } = useRows("cs_tickets", { order: { column: "created_at" } });
	const csat = useRows("cs_csat_responses", { order: { column: "created_at" } });
	const { byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const open = rows.filter((r) => !["closed", "resolved"].includes((r.status ?? "").toLowerCase()));
	const filtered = rows.filter((r) => (priority === "all" || (r.priority ?? "").toLowerCase() === priority) && `${r.subject} ${r.ticket_number ?? ""} ${r.customer_name ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	const scores = csat.rows.map((c) => Number(c.score)).filter((n) => !Number.isNaN(n) && n > 0);
	const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";
	const byTheme = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of rows) for (const t of r.tags ?? ["untagged"]) m.set(t, (m.get(t) ?? 0) + 1);
		return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
	}, [rows]);
	const maxTheme = byTheme[0]?.[1] ?? 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Product & program",
		title: "Operator support signal",
		lede: "Support traffic read as product evidence — which themes recur, how satisfied operators are, and what should become roadmap work.",
		wide: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
			cols: 4,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open tickets",
					value: open.length,
					icon: LifeBuoy,
					tone: open.length > 10 ? "warn" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "All time",
					value: rows.length,
					icon: MessageSquare
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Avg satisfaction",
					value: avg,
					hint: `${scores.length} responses`,
					icon: Smile,
					tone: Number(avg) >= 4 ? "good" : "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Resolved share",
					value: `${pct(rows.length - open.length, rows.length || 1)}%`,
					tone: "good"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5 grid gap-4 xl:grid-cols-[1fr_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search tickets, operators…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: priority,
					onChange: setPriority,
					options: [{
						value: "all",
						label: "Any priority"
					}, ...[
						"low",
						"medium",
						"high",
						"urgent"
					].map((v) => ({
						value: v,
						label: v
					}))]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-3",
				pad: false,
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No support traffic yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-20 shrink-0 font-mono text-[11px] text-muted-foreground",
								children: r.ticket_number ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-medium",
									children: r.subject
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										r.customer_name ?? "Internal",
										" · ",
										dt(r.created_at),
										r.assignee_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
											userId: r.assignee_id,
											name: nameOf(byId, r.assignee_id),
											size: "xs"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(r.priority),
								children: r.priority ?? "medium"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(r.status),
								children: r.status ?? "new"
							})
						]
					}, r.id))
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Recurring themes",
					hint: "Tag frequency across all tickets",
					children: byTheme.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No tagged tickets." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: byTheme.map(([tag, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: tag
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted-foreground",
								children: n
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: n,
								max: maxTheme
							})
						})] }, tag))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Latest verbatims",
					pad: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border",
						children: [csat.rows.slice(0, 6).filter((c) => c.comment).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No comments yet." }), csat.rows.filter((c) => c.comment).slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm leading-snug",
								children: [
									"“",
									c.comment,
									"”"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									c.customer_name ?? "Operator",
									" · score ",
									c.score ?? "—"
								]
							})]
						}, c.id))]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { ProductSupport as component };
