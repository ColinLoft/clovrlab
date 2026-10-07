import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, Gn as DollarSign, Mn as FileSpreadsheet, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { a as StatusBadge, i as ResourcePage, n as DateCell } from "./_ssr/ResourcePage-CYDkQVfk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.invoices-BBY5L7Ko.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_PALETTE = {
	draft: "border-border bg-muted/40 text-muted-foreground",
	sent: "border-blue-500/30 bg-blue-500/10 text-blue-500",
	paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
	overdue: "border-destructive/40 bg-destructive/10 text-destructive",
	void: "border-border bg-muted/40 text-muted-foreground"
};
var config = {
	table: "fin_invoices",
	title: "Invoices & Payments",
	eyebrow: "Funding · Accounts Receivable",
	icon: FileSpreadsheet,
	itemName: "invoice",
	searchable: [
		"invoice_number",
		"customer_name",
		"customer_email"
	],
	orderBy: {
		column: "issue_date",
		ascending: false
	},
	kpis: (rows) => {
		const now = Date.now();
		const outstanding = rows.filter((r) => r.status === "sent" || r.status === "overdue");
		const outstandingTotal = outstanding.reduce((s, r) => s + Number(r.total || 0), 0);
		const paid = rows.filter((r) => r.status === "paid");
		const paidTotal = paid.reduce((s, r) => s + Number(r.total || 0), 0);
		const overdue = rows.filter((r) => r.status !== "paid" && r.status !== "void" && r.due_date && new Date(r.due_date).getTime() < now).length;
		return [
			{
				label: "Outstanding",
				value: `$${outstandingTotal.toFixed(0)}`,
				icon: Clock,
				hint: `${outstanding.length} invoices`
			},
			{
				label: "Paid",
				value: `$${paidTotal.toFixed(0)}`,
				icon: DollarSign,
				hint: `${paid.length} invoices`
			},
			{
				label: "Overdue",
				value: overdue,
				icon: TriangleAlert
			},
			{
				label: "Total",
				value: rows.length,
				icon: FileSpreadsheet
			}
		];
	},
	columns: [
		{
			key: "invoice_number",
			label: "#",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs",
				children: r.invoice_number || r.id.slice(0, 8)
			})
		},
		{
			key: "customer_name",
			label: "Customer",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.customer_name
				}), r.customer_email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-muted-foreground",
					children: r.customer_email
				})]
			})
		},
		{
			key: "total",
			label: "Total",
			render: (r) => r.total != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums font-medium",
				children: ["$", Number(r.total).toFixed(2)]
			}) : "—"
		},
		{
			key: "tax",
			label: "Tax",
			render: (r) => r.tax != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-xs text-muted-foreground",
				children: ["$", Number(r.tax).toFixed(2)]
			}) : "—"
		},
		{
			key: "status",
			label: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
				value: r.status,
				palette: STATUS_PALETTE
			})
		},
		{
			key: "issue_date",
			label: "Issued",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.issue_date })
		},
		{
			key: "due_date",
			label: "Due",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.due_date })
		},
		{
			key: "paid_at",
			label: "Paid",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.paid_at })
		}
	],
	fields: [
		{
			key: "invoice_number",
			label: "Invoice #",
			type: "text"
		},
		{
			key: "customer_name",
			label: "Customer",
			type: "text",
			required: true
		},
		{
			key: "customer_email",
			label: "Customer email",
			type: "text"
		},
		{
			key: "issue_date",
			label: "Issue date",
			type: "date"
		},
		{
			key: "due_date",
			label: "Due date",
			type: "date"
		},
		{
			key: "subtotal",
			label: "Subtotal ($)",
			type: "number"
		},
		{
			key: "tax",
			label: "Tax ($)",
			type: "number"
		},
		{
			key: "total",
			label: "Total ($)",
			type: "number",
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
					value: "sent",
					label: "Sent"
				},
				{
					value: "paid",
					label: "Paid"
				},
				{
					value: "overdue",
					label: "Overdue"
				},
				{
					value: "void",
					label: "Void"
				}
			]
		},
		{
			key: "paid_at",
			label: "Paid at",
			type: "date"
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	],
	defaults: { status: "draft" }
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config });
//#endregion
export { SplitComponent as component };
