import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Nt as MessageSquareHeart, Rr as ArrowUpRight, it as Radio, w as ThumbsUp } from "./_libs/lucide-react.mjs";
import { D as useRows, E as usePeople, S as raiseRequest, b as nameOf, c as NewButton, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.product.feedback-BZTqy90W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SOURCES = [
	"pilot",
	"analyst",
	"agency",
	"internal",
	"partner"
];
function FeedbackPage() {
	const { rows, loading, insert, patch } = useRows("prod_feedback", { order: { column: "created_at" } });
	const features = useRows("prod_features", { order: { column: "created_at" } });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("all");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const fields = [
		{
			key: "summary",
			label: "What did they say?",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "detail",
			label: "Detail",
			type: "textarea",
			full: true
		},
		{
			key: "source",
			label: "Who it came from",
			type: "select",
			options: SOURCES.map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "sentiment",
			label: "Sentiment",
			type: "select",
			options: [
				"positive",
				"neutral",
				"negative"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "submitted_by",
			label: "Logged by",
			type: "user"
		}
	];
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => (!q || `${r.summary} ${r.detail ?? ""}`.toLowerCase().includes(q.toLowerCase())) && (source === "all" || r.source === source)), [
		rows,
		q,
		source
	]);
	const promote = async (r) => {
		await features.insert({
			title: r.summary,
			problem: r.detail,
			horizon: "next",
			status: "idea"
		});
		await patch(r.id, { status: "promoted" });
		alert("Added to the roadmap as a candidate feature.");
	};
	const escalate = async (r) => {
		if (await raiseRequest({
			from_team: "product",
			to_team: "eng",
			subject: `Field report — ${r.summary}`,
			details: r.detail || "Operator feedback that may indicate a defect.",
			entity_type: "prod_feedback",
			entity_id: r.id,
			priority: "high"
		})) alert("Engineering notified.");
	};
	const negative = rows.filter((r) => r.sentiment === "negative").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Product · Voice of the field",
		title: "Field feedback",
		lede: "Everything pilots, analysts and agency partners tell us about the system in real use — triaged into roadmap candidates or engineering defects.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Log feedback",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total captured",
					value: rows.length,
					icon: MessageSquareHeart
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Positive",
					value: rows.filter((r) => r.sentiment === "positive").length,
					icon: ThumbsUp,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Negative",
					value: negative,
					icon: Radio,
					tone: negative ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Promoted to roadmap",
					value: rows.filter((r) => r.status === "promoted").length,
					icon: ArrowUpRight
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search feedback…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: source,
					onChange: setSource,
					options: [{
						value: "all",
						label: "All sources"
					}, ...SOURCES.map((v) => ({
						value: v,
						label: titleCase(v)
					}))]
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 lg:grid-cols-2",
				children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No feedback captured yet." }) }), filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: r.summary
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: r.sentiment === "negative" ? "risk" : r.sentiment === "positive" ? "good" : "muted",
								children: titleCase(r.sentiment)
							})]
						}),
						r.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: r.detail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[11px] text-muted-foreground",
							children: [
								titleCase(r.source),
								" · logged by ",
								nameOf(byId, r.submitted_by),
								" · ",
								dt(r.created_at)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								onClick: () => promote(r),
								children: "Add to roadmap"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								onClick: () => escalate(r),
								children: "Send to engineering"
							})]
						})
					]
				}, r.id))]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Log field feedback",
				fields,
				people,
				initial: {
					sentiment: "neutral",
					source: "pilot"
				},
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						status: "new"
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { FeedbackPage as component };
