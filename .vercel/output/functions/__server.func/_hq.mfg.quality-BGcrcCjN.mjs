import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { er as ClipboardCheck } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, b as nameOf, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt, x as pct } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.mfg.quality-BGcrcCjN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Quality() {
	const { rows, loading, insert } = useRows("mfg_inspections", { order: { column: "inspected_at" } });
	const wos = useRows("mfg_work_orders", { order: {
		column: "order_number",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [open, setOpen] = (0, import_react.useState)(false);
	const fields = (0, import_react.useMemo)(() => [
		{
			key: "work_order_id",
			label: "Work order",
			type: "select",
			required: true,
			options: wos.rows.map((w) => ({
				value: w.id,
				label: `${w.order_number} — ${w.product_name}`
			}))
		},
		{
			key: "status",
			label: "Result",
			type: "select",
			options: [
				"pass",
				"rework",
				"failed"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "defect_count",
			label: "Defects found",
			type: "number"
		},
		{
			key: "inspector_id",
			label: "Inspector",
			type: "user"
		},
		{
			key: "inspected_at",
			label: "Inspected",
			type: "datetime"
		},
		{
			key: "notes",
			label: "Findings",
			type: "textarea",
			full: true
		}
	], [wos.rows]);
	const passed = rows.filter((r) => r.status === "pass").length;
	const defects = rows.reduce((s, r) => s + Number(r.defect_count || 0), 0);
	const woLabel = (id) => wos.rows.find((w) => w.id === id)?.order_number ?? "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Manufacturing",
		title: "Quality",
		lede: "First-pass yield, defect trends, and the findings behind every rework call.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Log inspection",
			onClick: () => setOpen(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Inspections",
					value: rows.length,
					icon: ClipboardCheck
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "First-pass yield",
					value: `${pct(passed, rows.length)}%`,
					tone: pct(passed, rows.length) >= 90 ? "good" : "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Defects logged",
					value: defects,
					tone: defects ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Rework open",
					value: rows.filter((r) => r.status === "rework").length,
					tone: "warn"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-5",
				pad: false,
				title: "Inspection log",
				hint: "Newest first",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: async () => {
						const subject = prompt("Describe the defect for Engineering:");
						if (subject && await raiseRequest({
							from_team: "Manufacturing",
							to_team: "Engineering",
							subject,
							priority: "high",
							entity_type: "quality"
						})) alert("Raised with Engineering.");
					},
					children: "Raise defect"
				}),
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No inspections recorded yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(r.status),
								children: r.status || "logged"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: woLabel(r.work_order_id)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: r.notes || "No findings recorded."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: [
											nameOf(byId, r.inspector_id),
											" · ",
											dt(r.inspected_at ?? r.created_at)
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-xs tabular-nums text-muted-foreground",
								children: [r.defect_count ?? 0, " defects"]
							})
						]
					}, r.id))
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Log inspection",
				fields,
				people,
				initial: {
					status: "pass",
					defect_count: 0
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
export { Quality as component };
