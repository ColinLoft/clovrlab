import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { T as Target } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, x as pct } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.exec.okrs--jQAIcp9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var objectiveFields = [
	{
		key: "title",
		label: "Objective",
		type: "text",
		required: true
	},
	{
		key: "quarter",
		label: "Quarter",
		type: "text",
		placeholder: "Q1 2026"
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
			"planned",
			"on_track",
			"at_risk",
			"complete"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "progress",
		label: "Progress %",
		type: "number"
	},
	{
		key: "narrative",
		label: "Why this matters",
		type: "textarea",
		full: true
	}
];
function Okrs() {
	const objectives = useRows("exec_objectives", { order: { column: "created_at" } });
	const krs = useRows("exec_key_results", { order: {
		column: "created_at",
		ascending: true
	} });
	const [open, setOpen] = (0, import_react.useState)(null);
	const krFields = (0, import_react.useMemo)(() => [
		{
			key: "title",
			label: "Key result",
			type: "text",
			required: true
		},
		{
			key: "metric",
			label: "Metric",
			type: "text",
			placeholder: "Detections confirmed per week"
		},
		{
			key: "current_value",
			label: "Current",
			type: "number"
		},
		{
			key: "target_value",
			label: "Target",
			type: "number"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"on_track",
				"at_risk",
				"off_track",
				"complete"
			].map((v) => ({
				value: v,
				label: v
			}))
		}
	], []);
	const avg = objectives.rows.length ? Math.round(objectives.rows.reduce((s, o) => s + Number(o.progress || 0), 0) / objectives.rows.length) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Leadership",
		title: "Objectives",
		lede: "What the organization committed to this quarter, and the measures that prove it.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New objective",
			onClick: () => setOpen("objective")
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Objectives",
					value: objectives.rows.length,
					icon: Target
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Average progress",
					value: `${avg}%`,
					tone: avg >= 60 ? "good" : "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "At risk",
					value: objectives.rows.filter((o) => o.status === "at_risk").length,
					tone: "risk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Key results",
					value: krs.rows.length
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-4",
				children: objectives.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : objectives.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No objectives yet." }) : objectives.rows.map((o) => {
					const mine = krs.rows.filter((k) => k.objective_id === o.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						title: o.title,
						hint: `${o.owner_team || "Unowned"} · ${o.quarter || "no quarter set"}`,
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(o.status),
								children: o.status || "planned"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								onClick: () => setOpen(o.id),
								children: "Add key result"
							})]
						}),
						children: [
							o.narrative && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-sm text-muted-foreground",
								children: o.narrative
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									value: Number(o.progress || 0),
									tone: o.status === "at_risk" ? "risk" : "primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									defaultValue: o.progress ?? 0,
									onBlur: (e) => objectives.patch(o.id, { progress: Number(e.target.value) }),
									className: "w-16 rounded border border-border bg-background px-2 py-1 text-right text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 divide-y divide-border border-t border-border",
								children: [mine.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "py-3 text-xs text-muted-foreground",
									children: "No key results yet."
								}), mine.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 py-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm",
												children: k.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: k.metric || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs tabular-nums text-muted-foreground",
											children: [
												k.current_value ?? 0,
												" / ",
												k.target_value ?? 0,
												" (",
												pct(Number(k.current_value || 0), Number(k.target_value || 1)),
												"%)"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: statusTone(k.status),
											children: k.status || "on_track"
										})
									]
								}, k.id))]
							})
						]
					}, o.id);
				})
			}),
			open === "objective" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New objective",
				fields: objectiveFields,
				initial: {
					status: "planned",
					progress: 0
				},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await objectives.insert(v);
					setOpen(null);
				}
			}),
			open && open !== "objective" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New key result",
				fields: krFields,
				initial: {
					status: "on_track",
					current_value: 0
				},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await krs.insert({
						...v,
						objective_id: open
					});
					setOpen(null);
				}
			})
		]
	});
}
//#endregion
export { Okrs as component };
