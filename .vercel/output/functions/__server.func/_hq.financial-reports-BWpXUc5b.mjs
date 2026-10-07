import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { Gn as DollarSign, Gt as LoaderCircle, Ln as FileChartColumnIncreasing, b as TrendingDown, y as TrendingUp } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.financial-reports-BWpXUc5b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmt(n) {
	return `$${n.toLocaleString(void 0, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	})}`;
}
function FinancialReportsPage() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [invoices, setInvoices] = (0, import_react.useState)([]);
	const [bills, setBills] = (0, import_react.useState)([]);
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [inv, b, e, o, ac] = await Promise.all([
				supabase.from("fin_invoices").select("issue_date, total, subtotal, status"),
				supabase.from("fin_bills").select("issue_date, amount, status, category"),
				supabase.from("fin_expenses").select("spent_at, amount, category, status"),
				supabase.from("sales_orders").select("ordered_at, subtotal, total, status"),
				supabase.from("fin_accounts").select("name, type, balance")
			]);
			setInvoices(inv.data ?? []);
			setBills(b.data ?? []);
			setExpenses(e.data ?? []);
			setOrders(o.data ?? []);
			setAccounts(ac.data ?? []);
			setLoading(false);
		})();
	}, []);
	const revenue = invoices.filter((r) => r.status === "paid" || r.status === "sent").reduce((s, r) => s + Number(r.subtotal || r.total || 0), 0) + orders.filter((r) => !["cancelled", "refunded"].includes(r.status)).reduce((s, r) => s + Number(r.subtotal || r.total || 0), 0);
	const cogs = bills.filter((r) => (r.category || "").toLowerCase().includes("cogs")).reduce((s, r) => s + Number(r.amount || 0), 0);
	const opex = bills.filter((r) => !(r.category || "").toLowerCase().includes("cogs")).reduce((s, r) => s + Number(r.amount || 0), 0) + expenses.filter((r) => r.status !== "rejected").reduce((s, r) => s + Number(r.amount || 0), 0);
	const grossProfit = revenue - cogs;
	const netIncome = grossProfit - opex;
	const now = /* @__PURE__ */ new Date();
	const months = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		months.push({
			label: d.toLocaleDateString(void 0, { month: "short" }),
			key,
			rev: 0,
			costs: 0
		});
	}
	const addTo = (bucket, dateStr, amount) => {
		if (!dateStr) return;
		const key = dateStr.slice(0, 7);
		const m = months.find((x) => x.key === key);
		if (m) m[bucket] += amount;
	};
	for (const r of invoices) if (r.status === "paid" || r.status === "sent") addTo("rev", r.issue_date, Number(r.subtotal || r.total || 0));
	for (const r of orders) if (!["cancelled", "refunded"].includes(r.status)) addTo("rev", r.ordered_at, Number(r.subtotal || r.total || 0));
	for (const r of bills) addTo("costs", r.issue_date, Number(r.amount || 0));
	for (const r of expenses) if (r.status !== "rejected") addTo("costs", r.spent_at, Number(r.amount || 0));
	const maxMonth = Math.max(1, ...months.flatMap((m) => [m.rev, m.costs]));
	const assets = accounts.filter((a) => a.type === "asset").reduce((s, a) => s + Number(a.balance || 0), 0);
	const liabilities = accounts.filter((a) => a.type === "liability").reduce((s, a) => s + Number(a.balance || 0), 0);
	const equity = accounts.filter((a) => a.type === "equity").reduce((s, a) => s + Number(a.balance || 0), 0);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-12 text-center text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileChartColumnIncreasing, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Finance · Reports"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight",
					children: "Financial Reports"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						label: "Revenue",
						value: fmt(revenue),
						icon: TrendingUp
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						label: "COGS",
						value: fmt(cogs),
						icon: TrendingDown,
						hint: `Gross ${fmt(grossProfit)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						label: "Operating expenses",
						value: fmt(opex),
						icon: TrendingDown
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
						label: "Net income",
						value: fmt(netIncome),
						icon: DollarSign,
						hint: netIncome >= 0 ? "profit" : "loss"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
							children: "P&L · trailing 6 months"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex h-52 items-end gap-4",
							children: months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full flex-1 items-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 rounded-t bg-emerald-500/70",
										style: { height: `${m.rev / maxMonth * 100}%` },
										title: `Revenue ${fmt(m.rev)}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 rounded-t bg-destructive/60",
										style: { height: `${m.costs / maxMonth * 100}%` },
										title: `Costs ${fmt(m.costs)}`
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-medium",
									children: m.label
								})]
							}, m.key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-4 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-emerald-500/70" }), " Revenue"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-destructive/60" }), " Costs"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
							children: "Balance sheet snapshot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 divide-y divide-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Assets",
									value: fmt(assets)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Liabilities",
									value: fmt(liabilities)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Equity",
									value: fmt(equity)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "A − L",
									value: fmt(assets - liabilities),
									strong: true
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "Update account balances in Accounting to keep this in sync."
						})
					]
				})]
			})
		]
	});
}
function KPI({ label, value, icon: Icon, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-2xl font-semibold tabular-nums",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
function Row({ label, value, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: `text-sm ${strong ? "font-semibold" : "text-muted-foreground"}`,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `tabular-nums ${strong ? "font-semibold" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { FinancialReportsPage as component };
