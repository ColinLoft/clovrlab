import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, R as ShoppingCart, _ as Truck, cr as CircleCheck } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell } from "./_ssr/ResourcePage-CoV-Rh10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.purchase-orders-IV7XDH2J.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	draft: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
	submitted: "border-blue-500/30 bg-blue-500/10 text-blue-500",
	approved: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
	shipped: "border-primary/30 bg-primary/10 text-primary",
	received: "border-green-500/30 bg-green-500/10 text-green-500",
	cancelled: "border-destructive/30 bg-destructive/10 text-destructive"
};
var money = (v) => `$${Number(v || 0).toLocaleString()}`;
var config = {
	table: "mfg_purchase_orders",
	title: "Purchasing",
	eyebrow: "Administration · Purchase orders",
	icon: ShoppingCart,
	itemName: "purchase order",
	searchable: ["po_number", "notes"],
	orderBy: {
		column: "order_date",
		ascending: false
	},
	kpis: (rows) => [
		{
			label: "Open POs",
			value: rows.filter((r) => r.status !== "received" && r.status !== "cancelled").length,
			icon: ShoppingCart
		},
		{
			label: "Awaiting approval",
			value: rows.filter((r) => r.status === "submitted").length,
			icon: Clock
		},
		{
			label: "In transit",
			value: rows.filter((r) => r.status === "shipped").length,
			icon: Truck
		},
		{
			label: "Committed",
			value: money(rows.filter((r) => r.status !== "cancelled").reduce((s, r) => s + Number(r.total || 0), 0)),
			icon: CircleCheck
		}
	],
	columns: [
		{
			key: "po_number",
			label: "PO",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.po_number
			})
		},
		{
			key: "status",
			label: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.status,
				palette: STATUS
			})
		},
		{
			key: "total",
			label: "Total",
			render: (r) => money(r.total)
		},
		{
			key: "order_date",
			label: "Ordered",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.order_date })
		},
		{
			key: "expected_date",
			label: "Expected",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.expected_date })
		}
	],
	fields: [
		{
			key: "po_number",
			label: "PO number",
			type: "text",
			required: true
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				{
					value: "draft",
					label: "Draft"
				},
				{
					value: "submitted",
					label: "Submitted"
				},
				{
					value: "approved",
					label: "Approved"
				},
				{
					value: "shipped",
					label: "Shipped"
				},
				{
					value: "received",
					label: "Received"
				},
				{
					value: "cancelled",
					label: "Cancelled"
				}
			]
		},
		{
			key: "total",
			label: "Total",
			type: "number"
		},
		{
			key: "order_date",
			label: "Order date",
			type: "date"
		},
		{
			key: "expected_date",
			label: "Expected date",
			type: "date"
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	],
	defaults: {
		status: "draft",
		total: 0
	}
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config });
//#endregion
export { SplitComponent as component };
