import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { v as TriangleAlert, yr as CalendarRange, zn as Factory } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, u as RecordDialog, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.mfg.orders-6kDamDyL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"queued",
	"in_progress",
	"inspection",
	"complete",
	"blocked"
];
var fields = [
	{
		key: "order_number",
		label: "Order number",
		type: "text",
		required: true,
		placeholder: "WO-0142"
	},
	{
		key: "product_name",
		label: "Product",
		type: "text",
		required: true,
		placeholder: "Athera VTOL airframe"
	},
	{
		key: "quantity",
		label: "Quantity",
		type: "number"
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: STATUSES.map((v) => ({
			value: v,
			label: titleCase(v)
		}))
	},
	{
		key: "priority",
		label: "Priority",
		type: "select",
		options: [
			"low",
			"normal",
			"high",
			"urgent"
		].map((v) => ({
			value: v,
			label: titleCase(v)
		}))
	},
	{
		key: "assignee_id",
		label: "Build lead",
		type: "user"
	},
	{
		key: "due_date",
		label: "Due",
		type: "date"
	},
	{
		key: "notes",
		label: "Notes",
		type: "textarea",
		full: true
	}
];
/** Fourteen-day build horizon — the line plans in days, not in lists. */
function OrdersPage() {
	const { rows, loading, insert, patch } = useRows("mfg_work_orders", { order: {
		column: "due_date",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [creating, setCreating] = (0, import_react.useState)(false);
	const days = (0, import_react.useMemo)(() => {
		const out = [];
		const start = /* @__PURE__ */ new Date();
		start.setHours(0, 0, 0, 0);
		for (let i = 0; i < 14; i++) {
			const dt2 = new Date(start.getTime() + i * 864e5);
			out.push({
				key: dt2.toISOString().slice(0, 10),
				date: dt2
			});
		}
		return out;
	}, []);
	const scheduled = rows.filter((r) => r.due_date && days.some((x) => x.key === String(r.due_date).slice(0, 10)));
	const overdue = rows.filter((r) => r.due_date && new Date(String(r.due_date)) < new Date(days[0].key) && r.status !== "complete");
	const unscheduled = rows.filter((r) => !r.due_date);
	const blocked = rows.filter((r) => r.status === "blocked");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Production",
		title: "Build schedule",
		lede: "A fourteen-day horizon for the line: what has to leave each station, what slipped, and what still has no date.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New work order",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open orders",
						value: rows.filter((r) => r.status !== "complete").length,
						icon: Factory
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "In the next 14 days",
						value: scheduled.length,
						icon: CalendarRange
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Past due",
						value: overdue.length,
						tone: overdue.length ? "risk" : "good",
						icon: TriangleAlert
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Blocked",
						value: blocked.length,
						tone: blocked.length ? "warn" : "good"
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				overdue.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "mt-5 border-destructive/40",
					title: "Past due",
					hint: "These missed their date and are still open",
					pad: false,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: overdue.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 px-4 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 truncate text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-muted-foreground",
										children: r.order_number
									}),
									" · ",
									r.product_name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-destructive",
									children: ["due ", d(r.due_date)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.status),
									children: titleCase(r.status)
								})]
							})]
						}, r.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 overflow-x-auto pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-w-max gap-3",
						children: days.map(({ key, date }) => {
							const items = rows.filter((r) => String(r.due_date ?? "").slice(0, 10) === key);
							const weekend = [0, 6].includes(date.getDay());
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `w-[220px] shrink-0 rounded-lg border border-border ${weekend ? "bg-muted/40" : "bg-card"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
									className: "flex items-center justify-between border-b border-border px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: date.toLocaleDateString(void 0, { weekday: "short" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: date.toLocaleDateString(void 0, {
											month: "short",
											day: "numeric"
										})
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-muted px-1.5 text-[11px] tabular-nums text-muted-foreground",
										children: items.length
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 p-2",
									children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-1 py-4 text-center text-[11px] text-muted-foreground",
										children: "Clear"
									}), items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: "rounded-md border border-border bg-background p-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-[10px] text-muted-foreground",
												children: r.order_number
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 truncate text-[13px] font-medium",
												children: r.product_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"×",
													r.quantity ?? 1,
													" · ",
													nameOf(byId, r.assignee_id)
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
													tone: statusTone(r.status),
													children: titleCase(r.status)
												}), r.priority === "urgent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
													tone: "risk",
													children: "Urgent"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: r.status ?? "queued",
												onChange: (e) => patch(r.id, { status: e.target.value }),
												className: "mt-2 w-full rounded border border-border bg-card px-1.5 py-1 text-[11px]",
												children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s,
													children: titleCase(s)
												}, s))
											})
										]
									}, r.id))]
								})]
							}, key);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "mt-5",
					title: "Needs a date",
					hint: "Orders on the books with nowhere to sit",
					pad: false,
					children: unscheduled.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Every order is scheduled." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: unscheduled.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 px-4 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-muted-foreground",
										children: r.order_number
									}),
									" · ",
									r.product_name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								onChange: (e) => patch(r.id, { due_date: e.target.value }),
								className: "rounded-md border border-border bg-background px-2 py-1 text-xs"
							})]
						}, r.id))
					})
				})
			] }),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New work order",
				fields,
				initial: {
					status: "queued",
					priority: "normal",
					quantity: 1
				},
				people,
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						quantity: Number(v.quantity || 1)
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { OrdersPage as component };
