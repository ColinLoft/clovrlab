import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Sr as CalendarClock, er as ClipboardCheck } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, u as RecordDialog, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.reviews-DMqQjM4U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Hardware gates run in order — the board is the gate ladder, not a generic list. */
var GATES = [
	{
		key: "concept",
		label: "Concept",
		blurb: "Is the idea worth building?"
	},
	{
		key: "preliminary",
		label: "Preliminary",
		blurb: "Architecture and interfaces agreed."
	},
	{
		key: "critical",
		label: "Critical",
		blurb: "Design frozen, drawings released."
	},
	{
		key: "test_readiness",
		label: "Test readiness",
		blurb: "Safe to fly the article."
	},
	{
		key: "flight_readiness",
		label: "Flight readiness",
		blurb: "Cleared for mission use."
	}
];
var fields = (projects, gates) => [
	{
		key: "title",
		label: "Review",
		type: "text",
		required: true,
		full: true,
		placeholder: "Airframe CDR — rev C"
	},
	{
		key: "project_id",
		label: "Program",
		type: "select",
		options: projects.map((p) => ({
			value: p.id,
			label: p.name
		}))
	},
	{
		key: "gate",
		label: "Gate",
		type: "select",
		options: gates.map((g) => ({
			value: g,
			label: titleCase(g)
		}))
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: [
			"scheduled",
			"in_review",
			"approved",
			"rejected"
		].map((v) => ({
			value: v,
			label: titleCase(v)
		}))
	},
	{
		key: "review_date",
		label: "Review date",
		type: "date"
	},
	{
		key: "reviewer_id",
		label: "Chair",
		type: "user"
	},
	{
		key: "notes",
		label: "Actions & findings",
		type: "textarea",
		full: true
	}
];
function ReviewsPage() {
	const { rows, loading, insert, patch } = useRows("eng_design_reviews", { order: {
		column: "review_date",
		ascending: true
	} });
	const { rows: projects } = useRows("eng_projects", {
		select: "id, name",
		order: {
			column: "name",
			ascending: true
		}
	});
	const { people, byId } = usePeople();
	const [creating, setCreating] = (0, import_react.useState)(false);
	const byGate = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const g of GATES) m.set(g.key, []);
		for (const r of rows) {
			const key = GATES.some((g) => g.key === r.gate) ? r.gate : "concept";
			m.set(key, [...m.get(key) ?? [], r]);
		}
		return m;
	}, [rows]);
	const approved = rows.filter((r) => r.status === "approved").length;
	const blocked = rows.filter((r) => r.status === "rejected").length;
	const upcoming = rows.filter((r) => r.review_date && new Date(r.review_date) >= /* @__PURE__ */ new Date(Date.now() - 864e5)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Engineering",
		title: "Design gate ladder",
		lede: "Every airframe and avionics change climbs the same five gates. A gate only opens when a chair signs it off — nothing skips ahead.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Schedule review",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Reviews on the ladder",
						value: rows.length,
						icon: ClipboardCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Signed off",
						value: approved,
						tone: "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Sent back",
						value: blocked,
						tone: blocked ? "risk" : "default"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Upcoming",
						value: upcoming,
						icon: CalendarClock,
						tone: "warn"
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [GATES.map((g, i) => {
					const items = byGate.get(g.key) ?? [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						pad: false,
						className: "overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 border-b border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[11px] font-bold text-primary",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: g.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: g.blurb
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] tabular-nums text-muted-foreground",
								children: [
									items.length,
									" review",
									items.length === 1 ? "" : "s"
								]
							})]
						}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-4 text-xs text-muted-foreground",
							children: "Nothing at this gate."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border",
							children: items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-[200px] flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: r.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-0.5 text-[11px] text-muted-foreground",
												children: [
													"Chair ",
													nameOf(byId, r.reviewer_id),
													" · ",
													d(r.review_date)
												]
											}),
											r.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
												children: r.notes
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: statusTone(r.status),
										children: titleCase(r.status)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: r.status ?? "scheduled",
										onChange: (e) => patch(r.id, { status: e.target.value }),
										className: "rounded-md border border-border bg-background px-2 py-1 text-[11px]",
										children: [
											"scheduled",
											"in_review",
											"approved",
											"rejected"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: titleCase(s)
										}, s))
									})
								]
							}, r.id))
						})]
					}, g.key);
				}), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No reviews scheduled yet." })]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Schedule design review",
				fields: fields(projects, GATES.map((g) => g.key)),
				initial: {
					gate: "concept",
					status: "scheduled"
				},
				people,
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert(v);
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { ReviewsPage as component };
