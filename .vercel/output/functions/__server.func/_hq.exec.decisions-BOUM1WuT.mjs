import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { J as ScrollText } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, u as RecordDialog } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.exec.decisions-BOUM1WuT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		key: "title",
		label: "Decision",
		type: "text",
		required: true
	},
	{
		key: "owner_team",
		label: "Owning team",
		type: "select",
		options: [
			"Leadership",
			"Operations",
			"Engineering",
			"Product",
			"Manufacturing",
			"Enterprise Systems",
			"Funding & Partners",
			"People & Admin"
		].map((t) => ({
			value: t,
			label: t
		}))
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: [
			"proposed",
			"approved",
			"rejected",
			"superseded"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "decided_on",
		label: "Decided",
		type: "date"
	},
	{
		key: "review_on",
		label: "Revisit on",
		type: "date"
	},
	{
		key: "context",
		label: "Context — what forced the call",
		type: "textarea",
		full: true
	},
	{
		key: "decision",
		label: "What we decided",
		type: "textarea",
		full: true
	}
];
function Decisions() {
	const { rows, loading, insert } = useRows("exec_decisions", { order: { column: "decided_on" } });
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => `${r.title} ${r.owner_team ?? ""} ${r.decision ?? ""}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
	const dueReview = rows.filter((r) => r.review_on && r.review_on <= (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Leadership",
		title: "Decision log",
		lede: "The calls that shaped the program, why they were made, and when to revisit them.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Record decision",
			onClick: () => setOpen(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Decisions logged",
					value: rows.length,
					icon: ScrollText
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Approved",
					value: rows.filter((r) => r.status === "approved").length,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Awaiting a call",
					value: rows.filter((r) => r.status === "proposed").length,
					tone: "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Due for review",
					value: dueReview.length,
					tone: dueReview.length ? "warn" : "good"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search decisions…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing logged yet." }) : filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(r.status),
								children: r.status || "proposed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									r.owner_team || "Leadership",
									" · ",
									d(r.decided_on)
								]
							})]
						})]
					}),
					r.context && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: r.context
					}),
					r.decision && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 border-l-2 border-primary pl-3 text-sm",
						children: r.decision
					}),
					r.review_on && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: ["Revisit ", d(r.review_on)]
					})
				] }, r.id))
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Record decision",
				fields,
				initial: {
					status: "approved",
					decided_on: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				},
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await insert(v);
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Decisions as component };
