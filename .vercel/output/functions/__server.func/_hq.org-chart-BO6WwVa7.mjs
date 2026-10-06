import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Gt as LoaderCircle, Tt as Network } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.org-chart-BO6WwVa7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrgChart() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		supabase.from("hr_employees").select("id, full_name, title, department, manager_id, status").eq("status", "active").order("full_name").then(({ data }) => {
			setRows(data ?? []);
			setLoading(false);
		});
	}, []);
	const { roots, byManager } = (0, import_react.useMemo)(() => {
		const byManager = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const k = r.manager_id ?? null;
			if (!byManager.has(k)) byManager.set(k, []);
			byManager.get(k).push(r);
		}
		const ids = new Set(rows.map((r) => r.id));
		return {
			roots: rows.filter((r) => !r.manager_id || !ids.has(r.manager_id)),
			byManager
		};
	}, [rows]);
	const byDept = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const k = r.department ?? "Unassigned";
			if (!m.has(k)) m.set(k, []);
			m.get(k).push(r);
		}
		return m;
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
				children: "HR"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold tracking-tight",
				children: "Org Chart"
			})] })]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-12 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin text-muted-foreground" })
		}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-12 text-center text-muted-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "No employees yet. Add people to the directory to see the org chart."
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
					children: "Reporting hierarchy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: roots.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
						emp: r,
						byManager,
						depth: 0
					}, r.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
					children: "By department"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: Array.from(byDept.entries()).sort().map(([dept, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold uppercase text-muted-foreground",
						children: [
							dept,
							" · ",
							list.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-0.5",
						children: list.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [e.full_name, e.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [" · ", e.title]
							}) : null]
						}, e.id))
					})] }, dept))
				})]
			})]
		})]
	});
}
function Node({ emp, byManager, depth }) {
	const children = byManager.get(emp.id) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: { marginLeft: depth * 20 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:bg-muted/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold",
				children: emp.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium truncate",
					children: emp.full_name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground truncate",
					children: [emp.title ?? "—", emp.department ? ` · ${emp.department}` : ""]
				})]
			})]
		}), children.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 space-y-1 border-l border-border pl-3 ml-4",
			children: children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, {
				emp: c,
				byManager,
				depth: 0
			}, c.id))
		})]
	});
}
//#endregion
export { OrgChart as component };
