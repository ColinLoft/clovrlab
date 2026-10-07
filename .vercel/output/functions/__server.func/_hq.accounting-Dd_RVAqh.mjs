import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Rr as ArrowUpRight, Ur as ArrowDownRight, a as Wallet, tn as Landmark } from "./_libs/lucide-react.mjs";
import { i as ResourcePage, n as DateCell, t as AccountCell } from "./_ssr/ResourcePage-CMf_zApm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.accounting-Dd_RVAqh.js
var import_jsx_runtime = require_jsx_runtime();
var config = {
	table: "fin_transactions",
	title: "Accounting",
	eyebrow: "Funding · Journal",
	icon: Landmark,
	itemName: "entry",
	searchable: ["memo", "reference"],
	orderBy: {
		column: "transaction_date",
		ascending: false
	},
	kpis: (rows) => {
		const debits = rows.filter((r) => r.kind === "deposit").reduce((s, r) => s + Number(r.amount || 0), 0);
		const credits = rows.filter((r) => r.kind === "withdrawal").reduce((s, r) => s + Number(r.amount || 0), 0);
		const unreconciled = rows.filter((r) => !r.reconciled).length;
		return [
			{
				label: "Entries",
				value: rows.length,
				icon: Landmark
			},
			{
				label: "Deposits",
				value: `$${debits.toFixed(0)}`,
				icon: ArrowUpRight
			},
			{
				label: "Withdrawals",
				value: `$${credits.toFixed(0)}`,
				icon: ArrowDownRight
			},
			{
				label: "Unreconciled",
				value: unreconciled,
				icon: Wallet
			}
		];
	},
	columns: [
		{
			key: "transaction_date",
			label: "Date",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateCell, { date: r.transaction_date })
		},
		{
			key: "memo",
			label: "Memo",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.memo
			})
		},
		{
			key: "kind",
			label: "Kind",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: r.kind
			})
		},
		{
			key: "debit_account_id",
			label: "Debit",
			render: (r, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountCell, {
				accountId: r.debit_account_id,
				accounts: c.accounts
			})
		},
		{
			key: "credit_account_id",
			label: "Credit",
			render: (r, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountCell, {
				accountId: r.credit_account_id,
				accounts: c.accounts
			})
		},
		{
			key: "amount",
			label: "Amount",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums font-medium",
				children: ["$", Number(r.amount).toFixed(2)]
			})
		},
		{
			key: "reference",
			label: "Ref",
			render: (r) => r.reference ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs",
				children: r.reference
			}) : "—"
		},
		{
			key: "reconciled",
			label: "Rec.",
			render: (r) => r.reconciled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-emerald-500 text-xs",
				children: "✓"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground text-xs",
				children: "—"
			})
		}
	],
	fields: [
		{
			key: "transaction_date",
			label: "Date",
			type: "date",
			required: true
		},
		{
			key: "memo",
			label: "Memo / description",
			type: "text",
			required: true
		},
		{
			key: "kind",
			label: "Kind",
			type: "select",
			options: [
				{
					value: "journal",
					label: "Journal entry"
				},
				{
					value: "deposit",
					label: "Deposit"
				},
				{
					value: "withdrawal",
					label: "Withdrawal"
				},
				{
					value: "transfer",
					label: "Transfer"
				},
				{
					value: "expense",
					label: "Expense"
				}
			]
		},
		{
			key: "debit_account_id",
			label: "Debit account",
			type: "account"
		},
		{
			key: "credit_account_id",
			label: "Credit account",
			type: "account"
		},
		{
			key: "amount",
			label: "Amount ($)",
			type: "number",
			required: true
		},
		{
			key: "reference",
			label: "Reference",
			type: "text",
			placeholder: "Invoice #, check #..."
		},
		{
			key: "reconciled",
			label: "Reconciled",
			type: "bool"
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	],
	defaults: {
		kind: "journal",
		reconciled: false
	}
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourcePage, { config });
//#endregion
export { SplitComponent as component };
