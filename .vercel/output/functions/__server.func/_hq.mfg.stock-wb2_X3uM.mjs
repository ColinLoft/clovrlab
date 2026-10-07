import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Dr as Boxes, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { D as useRows, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, t as Bar, u as RecordDialog, y as money } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.mfg.stock-wb2_X3uM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		key: "sku",
		label: "SKU",
		type: "text",
		required: true
	},
	{
		key: "name",
		label: "Part name",
		type: "text",
		required: true
	},
	{
		key: "category",
		label: "Category",
		type: "text"
	},
	{
		key: "quantity",
		label: "On hand",
		type: "number"
	},
	{
		key: "reorder_point",
		label: "Reorder at",
		type: "number"
	},
	{
		key: "unit_cost",
		label: "Unit cost",
		type: "number"
	},
	{
		key: "location",
		label: "Bin / location",
		type: "text"
	},
	{
		key: "description",
		label: "Notes",
		type: "textarea",
		full: true
	}
];
function Stockroom() {
	const { rows, loading, insert, patch, remove } = useRows("mfg_inventory", { order: {
		column: "name",
		ascending: true
	} });
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [lowOnly, setLowOnly] = (0, import_react.useState)(false);
	const isLow = (r) => Number(r.quantity || 0) <= Number(r.reorder_point || 0);
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => `${r.sku} ${r.name} ${r.category ?? ""} ${r.location ?? ""}`.toLowerCase().includes(q.toLowerCase()) && (!lowOnly || isLow(r))), [
		rows,
		q,
		lowOnly
	]);
	const value = rows.reduce((s, r) => s + Number(r.quantity || 0) * Number(r.unit_cost || 0), 0);
	const low = rows.filter(isLow);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Manufacturing",
		title: "Stockroom",
		lede: "Parts on hand, what is about to run out, and what it is all worth. Adjust counts inline as parts are pulled.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add part",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Distinct parts",
						value: rows.length,
						icon: Boxes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Below reorder point",
						value: low.length,
						tone: low.length ? "warn" : "good",
						icon: TriangleAlert
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Inventory value",
						value: money(value),
						hint: "On-hand quantity × unit cost"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search SKU, part, bin…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: lowOnly ? "primary" : "default",
					onClick: () => setLowOnly((v) => !v),
					children: "Needs reordering"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No parts match." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "Part"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "Location"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 w-56",
								children: "Stock level"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-right",
								children: "On hand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-right",
								children: "Value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60 last:border-0 hover:bg-muted/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [r.sku, r.category ? ` · ${r.category}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-muted-foreground",
								children: r.location || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									value: Number(r.quantity || 0),
									max: Math.max(Number(r.reorder_point || 0) * 3, Number(r.quantity || 1)),
									tone: isLow(r) ? "risk" : "good"
								}), isLow(r) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 inline-block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: "risk",
										children: "reorder"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									defaultValue: r.quantity ?? 0,
									onBlur: (e) => Number(e.target.value) !== Number(r.quantity) && patch(r.id, { quantity: Number(e.target.value) }),
									className: "w-20 rounded border border-border bg-background px-2 py-1 text-right text-sm"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-right tabular-nums",
								children: money(Number(r.quantity || 0) * Number(r.unit_cost || 0))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									variant: "ghost",
									onClick: () => remove(r.id),
									children: "Remove"
								})
							})
						]
					}, r.id)) })]
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Add part",
				fields,
				initial: {
					quantity: 0,
					reorder_point: 0
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
export { Stockroom as component };
