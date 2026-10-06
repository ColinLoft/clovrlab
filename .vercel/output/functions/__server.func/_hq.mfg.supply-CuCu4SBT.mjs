import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { _ as Truck, k as Star } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, y as money } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.mfg.supply-CuCu4SBT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supplierFields = [
	{
		key: "name",
		label: "Supplier",
		type: "text",
		required: true
	},
	{
		key: "category",
		label: "Supplies",
		type: "text",
		placeholder: "Composites, avionics…"
	},
	{
		key: "contact_name",
		label: "Contact",
		type: "text"
	},
	{
		key: "email",
		label: "Email",
		type: "text"
	},
	{
		key: "phone",
		label: "Phone",
		type: "text"
	},
	{
		key: "rating",
		label: "Rating (1-5)",
		type: "number"
	},
	{
		key: "notes",
		label: "Notes",
		type: "textarea",
		full: true
	}
];
function Supply() {
	const suppliers = useRows("mfg_suppliers", { order: {
		column: "name",
		ascending: true
	} });
	const pos = useRows("mfg_purchase_orders", { order: { column: "order_date" } });
	const [tab, setTab] = (0, import_react.useState)("pos");
	const [open, setOpen] = (0, import_react.useState)(null);
	const poFields = (0, import_react.useMemo)(() => [
		{
			key: "po_number",
			label: "PO number",
			type: "text",
			required: true
		},
		{
			key: "supplier_id",
			label: "Supplier",
			type: "select",
			required: true,
			options: suppliers.rows.map((s) => ({
				value: s.id,
				label: s.name
			}))
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"draft",
				"sent",
				"confirmed",
				"received",
				"closed"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "total",
			label: "Total",
			type: "number"
		},
		{
			key: "order_date",
			label: "Ordered",
			type: "date"
		},
		{
			key: "expected_date",
			label: "Expected",
			type: "date"
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	], [suppliers.rows]);
	const supplierName = (id) => suppliers.rows.find((s) => s.id === id)?.name ?? "—";
	const openPos = pos.rows.filter((p) => !["received", "closed"].includes(p.status));
	const committed = openPos.reduce((s, p) => s + Number(p.total || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Manufacturing",
		title: "Supply chain",
		lede: "Who we buy from, what is on order, and when it lands on the dock.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: tab === "pos" ? "New PO" : "New supplier",
			onClick: () => setOpen(tab === "pos" ? "po" : "supplier")
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Suppliers",
					value: suppliers.rows.length,
					icon: Truck
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open POs",
					value: openPos.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Committed spend",
					value: money(committed),
					hint: "Ordered, not yet received"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Late deliveries",
					value: openPos.filter((p) => p.expected_date && p.expected_date < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).length,
					tone: "risk"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: tab === "pos" ? "primary" : "default",
					onClick: () => setTab("pos"),
					children: "Purchase orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: tab === "suppliers" ? "primary" : "default",
					onClick: () => setTab("suppliers"),
					children: "Suppliers"
				})]
			}),
			tab === "pos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				children: pos.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : pos.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No purchase orders yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: pos.rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(p.status),
								children: p.status || "draft"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium",
									children: [
										p.po_number,
										" · ",
										supplierName(p.supplier_id)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Ordered ",
										d(p.order_date),
										" · expected ",
										d(p.expected_date)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-sm",
								children: money(Number(p.total || 0))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: p.status ?? "draft",
								onChange: (e) => pos.patch(p.id, { status: e.target.value }),
								className: "rounded border border-border bg-background px-2 py-1 text-xs",
								children: [
									"draft",
									"sent",
									"confirmed",
									"received",
									"closed"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))
							})
						]
					}, p.id))
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: suppliers.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : suppliers.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No suppliers on file." }) : suppliers.rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: s.category || "Uncategorised"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" }), s.rating ?? "—"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: [s.contact_name || "No contact", s.email ? ` · ${s.email}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [pos.rows.filter((p) => p.supplier_id === s.id).length, " purchase orders"]
					})
				] }, s.id))
			}),
			open === "po" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New purchase order",
				fields: poFields,
				initial: { status: "draft" },
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await pos.insert(v);
					setOpen(null);
				}
			}),
			open === "supplier" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New supplier",
				fields: supplierFields,
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await suppliers.insert(v);
					setOpen(null);
				}
			})
		]
	});
}
//#endregion
export { Supply as component };
