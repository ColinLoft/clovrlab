import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B7QlDyqv.mjs";
import { Cr as Calculator, Gt as LoaderCircle, V as ShieldAlert, Zn as Coins, fn as HardHat, gr as ChartColumn, rt as Receipt, u as Users } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.analytics-D_rMneRH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var money = (n) => `$${Math.round(Number(n || 0)).toLocaleString()}`;
function Dashboards() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [jobs, setJobs] = (0, import_react.useState)([]);
	const [estimates, setEstimates] = (0, import_react.useState)([]);
	const [invoices, setInvoices] = (0, import_react.useState)([]);
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [incidents, setIncidents] = (0, import_react.useState)([]);
	const [leads, setLeads] = (0, import_react.useState)([]);
	const [employees, setEmployees] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const t = (name, cols = "*") => supabase.from(name).select(cols).limit(1e3);
			const [j, e, i, x, s, l, emp] = await Promise.all([
				t("con_jobs"),
				t("con_estimates"),
				t("fin_invoices"),
				t("fin_expenses"),
				t("con_safety_incidents"),
				t("con_leads"),
				t("hr_employees")
			]);
			if (!alive) return;
			setJobs(j.data ?? []);
			setEstimates(e.data ?? []);
			setInvoices(i.data ?? []);
			setExpenses(x.data ?? []);
			setIncidents(s.data ?? []);
			setLeads(l.data ?? []);
			setEmployees(emp.data ?? []);
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const active = jobs.filter((j) => j.stage === "active" || j.status === "active");
	const contract = jobs.reduce((s, j) => s + Number(j.contract_value || 0), 0);
	const actualCost = jobs.reduce((s, j) => s + Number(j.actual_cost || 0), 0);
	const billed = jobs.reduce((s, j) => s + Number(j.billed || 0), 0);
	const margin = contract > 0 ? Math.round((contract - actualCost) / contract * 100) : 0;
	const outstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + Number(i.total || 0), 0);
	const openLeads = leads.filter((l) => !["won", "lost"].includes(l.stage));
	const byStage = group(jobs, (j) => j.stage || "unset");
	const byDivision = group(jobs, (j) => j.division || j.job_type || "Unassigned");
	const expenseByCategory = sumBy(expenses, (e) => e.category || "Uncategorized", (e) => Number(e.amount || 0));
	const revenueByMonth = sumBy(invoices, (i) => monthKey(i.issue_date || i.created_at), (i) => Number(i.total || 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
					children: "Operations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-xl font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5 text-primary" }), " Dashboards"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Live rollup across jobs, finance, safety and people."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: HardHat,
						label: "Active jobs",
						value: active.length,
						hint: `${jobs.length} total`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Coins,
						label: "Contract value",
						value: money(contract),
						hint: `${money(billed)} billed`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Receipt,
						label: "Outstanding AR",
						value: money(outstanding),
						hint: `${invoices.filter((i) => i.status !== "paid").length} open invoices`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Calculator,
						label: "Gross margin",
						value: `${margin}%`,
						hint: `${money(actualCost)} cost to date`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Users,
						label: "Headcount",
						value: employees.filter((e) => e.status !== "terminated").length,
						hint: `${employees.filter((e) => e.status === "onboarding").length} onboarding`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: ShieldAlert,
						label: "Safety incidents",
						value: incidents.length,
						hint: `${incidents.filter((i) => i.osha_reportable).length} OSHA reportable`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: ChartColumn,
						label: "Open bids",
						value: openLeads.length,
						hint: money(openLeads.reduce((s, l) => s + Number(l.estimated_value || 0), 0))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Calculator,
						label: "Estimates",
						value: estimates.length,
						hint: `${estimates.filter((e) => e.status === "approved").length} approved`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Jobs by stage",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { data: byStage })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Jobs by division",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, { data: byDivision })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Revenue invoiced by month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, {
							data: revenueByMonth,
							format: money
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Expenses by category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, {
							data: expenseByCategory,
							format: money
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Job cost performance",
				children: jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: jobs.slice(0, 12).map((j) => {
						const pct = Number(j.percent_complete || 0);
						const cv = Number(j.contract_value || 0);
						const ac = Number(j.actual_cost || 0);
						const over = cv > 0 && ac > cv;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate font-medium",
										children: [j.job_number ? `${j.job_number} · ` : "", j.name]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-mono text-xs ${over ? "text-red-600" : "text-muted-foreground"}`,
										children: [
											money(ac),
											" / ",
											money(cv)
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 h-1.5 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-primary",
										style: { width: `${Math.min(100, pct)}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										pct,
										"% complete · ",
										j.stage ?? "—"
									]
								})
							]
						}, j.id);
					})
				})
			})
		]
	});
}
function monthKey(d) {
	if (!d) return "Unknown";
	return new Date(d).toLocaleDateString(void 0, {
		month: "short",
		year: "2-digit"
	});
}
function group(rows, key) {
	return sumBy(rows, key, () => 1);
}
function sumBy(rows, key, value) {
	const map = /* @__PURE__ */ new Map();
	for (const r of rows) map.set(key(r), (map.get(key(r)) ?? 0) + value(r));
	return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}
function Bars({ data, format }) {
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {});
	const max = Math.max(...data.map((d) => d[1])) || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2.5",
		children: data.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate capitalize text-muted-foreground",
				children: label.replace(/_/g, " ")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono font-medium",
				children: format ? format(value) : value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 h-2 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-primary/80",
				style: { width: `${value / max * 100}%` }
			})
		})] }, label))
	});
}
function Empty() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-4 text-center text-xs text-muted-foreground",
		children: "No data yet."
	});
}
function Kpi({ icon: Icon, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xl font-semibold",
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
function Panel({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border px-4 py-2.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
				children: title
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children
		})]
	});
}
//#endregion
export { Dashboards as component };
