import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { r as createServerFn } from "./_ssr/server-BrzklweG.mjs";
import { Br as ArrowLeft, Kr as Activity, nt as RefreshCw, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-DX9VUQiX.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-Bv0AGlpV.mjs";
import { t as useRouteAccess } from "./_ssr/route-access-CdzD_jLq.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.health-dtTapfym.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getServiceHealth = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b9ca9f8e84e6c79025499add8e7bb63bf87656c4380c520a728c251e32ee12cf"));
var STATUS = {
	operational: {
		label: "Operational",
		dot: "bg-emerald-500",
		text: "text-emerald-600"
	},
	degraded: {
		label: "Degraded",
		dot: "bg-amber-500",
		text: "text-amber-600"
	},
	down: {
		label: "Down",
		dot: "bg-destructive",
		text: "text-destructive"
	},
	not_configured: {
		label: "Not configured",
		dot: "bg-muted-foreground",
		text: "text-muted-foreground"
	}
};
function HealthBoard() {
	const access = useRouteAccess();
	const probe = useServerFn(getServiceHealth);
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			setData(await probe({ data: void 0 }));
		} catch (err) {
			setError(err?.message ?? "Could not run health checks.");
		} finally {
			setLoading(false);
		}
	}, [probe]);
	(0, import_react.useEffect)(() => {
		if (!access.isAdmin) return;
		refresh();
		const id = setInterval(() => void refresh(), 6e4);
		return () => clearInterval(id);
	}, [access.isAdmin, refresh]);
	if (access.loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Checking systems access…"
	});
	if (!access.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Service health is restricted to administrators."
	});
	const worst = (data?.probes ?? []).some((p) => p.status === "down") ? "Incident in progress" : (data?.probes ?? []).some((p) => p.status === "degraded") ? "Partially degraded" : "All systems operational";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-6 py-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/it",
				className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Enterprise Systems"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase text-primary",
						children: "Service health"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-3xl font-semibold",
						children: loading && !data ? "Running checks…" : worst
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: data ? `Last checked ${new Date(data.checkedAt).toLocaleTimeString()} · auto-refreshes every minute` : "Live probes against database, auth, storage, email, Slack, and AI."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void refresh(),
					className: "inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium hover:border-primary/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${loading ? "animate-spin" : ""}` }), " Run checks"]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive",
				children: error
			}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-5 text-2xl font-semibold",
								children: [data.uptime24h, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Error-free hours in the last 24h"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-2xl font-semibold",
								children: data.errors24h
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Errors captured in the last 24 hours"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-2xl font-semibold",
								children: data.errors7d
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Errors captured in the last 7 days"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-5 lg:grid-cols-[1fr_400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-5 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Services"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: data.probes.map((p) => {
							const s = STATUS[p.status] ?? STATUS.not_configured;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 px-5 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2.5 w-2.5 rounded-full ${s.dot}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: p.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: p.detail
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-xs font-medium ${s.text}`,
											children: s.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: p.latencyMs === null ? "—" : `${p.latencyMs} ms`
										})]
									})
								]
							}, p.key);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-5 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Recent errors"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[520px] divide-y divide-border overflow-y-auto",
						children: [data.recentErrors.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-8 text-center text-sm text-muted-foreground",
							children: "No errors recorded. "
						}), data.recentErrors.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] uppercase tracking-wide text-muted-foreground",
									children: [
										e.service,
										" · ",
										e.status ?? "500",
										" · ",
										new Date(e.created_at).toLocaleString()
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium",
									children: e.message
								}),
								e.path && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										e.method ?? "GET",
										" ",
										e.path
									]
								})
							]
						}, e.id))]
					})]
				})]
			})] })
		]
	});
}
//#endregion
export { HealthBoard as component };
