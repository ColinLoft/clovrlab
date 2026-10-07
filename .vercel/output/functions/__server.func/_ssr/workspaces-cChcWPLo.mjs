import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./client-B5YVWdzA.mjs";
import { Hn as ExternalLink, Ht as LogOut, Rr as ArrowUpRight, Ut as Lock, q as Search } from "../_libs/lucide-react.mjs";
import { i as fetchApps, n as appUrl } from "./apps-Dhu7lH49.mjs";
import { t as useRouteAccess } from "./route-access-D4Pf6U6G.mjs";
import { n as canEnter } from "./app-context-7ehkzQ_t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspaces-cChcWPLo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorkspacePicker() {
	const navigate = useNavigate();
	const access = useRouteAccess();
	const [apps, setApps] = (0, import_react.useState)([]);
	const [unitSlugById, setUnitSlugById] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [name, setName] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [list, units, user] = await Promise.all([
				fetchApps(),
				supabase.from("org_units").select("id, slug"),
				supabase.auth.getUser()
			]);
			if (!alive) return;
			setApps(list);
			setUnitSlugById(new Map((units?.data ?? []).map((u) => [u.id, u.slug])));
			setName((user.data.user?.user_metadata)?.full_name || user.data.user?.email || "");
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, []);
	const ready = !loading && !access.loading;
	const opts = {
		isAdmin: access.isAdmin,
		units: access.units,
		unitSlugById
	};
	const permitted = apps.filter((a) => a.enabled && !a.is_hub && canEnter(a, opts));
	const teamApps = permitted;
	const term = q.trim().toLowerCase();
	const shown = term ? permitted.filter((a) => `${a.label} ${a.tagline ?? ""} ${a.subdomain}`.toLowerCase().includes(term)) : permitted;
	const rest = shown;
	const soloTarget = ready && !access.isAdmin && teamApps.length === 1 ? teamApps[0] : null;
	(0, import_react.useEffect)(() => {
		if (!soloTarget) return;
		try {
			sessionStorage.setItem("hq.app.override", soloTarget.subdomain);
		} catch {}
		window.location.replace(appUrl(soloTarget));
	}, [soloTarget?.id]);
	const open = (a, newTab) => {
		const url = appUrl(a);
		if (newTab) {
			window.open(url, "_blank", "noopener");
			return;
		}
		try {
			sessionStorage.setItem("hq.app.override", a.subdomain);
		} catch {}
		window.location.href = url;
	};
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const partOfDay = hour < 5 ? "Late night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
	if (soloTarget) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground",
		children: [
			"Opening ",
			soloTarget.label,
			"…"
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.14]",
				style: { background: "radial-gradient(60% 100% at 50% 0%, var(--color-primary, hsl(0 72% 51%)) 0%, transparent 70%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-primary-foreground",
						children: "CL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold tracking-tight",
							children: "Clovr HQ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Internal operations"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: async () => {
						await supabase.auth.signOut();
						navigate({
							to: "/hq-login",
							replace: true
						});
					},
					className: "flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign out"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative mx-auto w-full max-w-5xl px-6 pb-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-[0.22em] text-primary",
								children: partOfDay
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 text-[2.25rem] font-semibold leading-[1.1] tracking-tight",
								children: name ? `${name.split(" ")[0]}, where are you working today?` : "Where are you working today?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
								children: "Each workspace is its own product with its own tools and look. Open as many as you need — they run side by side in separate tabs."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[240px] flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Search workspaces",
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search workspaces",
								className: "w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3.5 text-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: permitted.length
								}),
								" workspaces available",
								access.isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary",
									children: "Admin"
								})
							]
						})]
					}),
					!ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							0,
							1,
							2,
							3,
							4,
							5
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-36 animate-pulse rounded-2xl border border-border bg-card" }, i))
					}),
					ready && permitted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 rounded-2xl border border-border bg-card p-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "No workspaces assigned yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Ask an administrator to add you to a team, then reload this page."
							})
						]
					}),
					ready && rest.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground",
						children: "Team workspaces"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: rest.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									className: "absolute inset-x-0 top-0 h-1 opacity-70",
									style: { background: a.accent ?? "var(--primary)" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => open(a, false),
									className: "flex flex-1 flex-col text-left",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-11 w-11 items-center justify-center rounded-xl text-[12px] font-bold uppercase",
											style: {
												background: a.accent ? `color-mix(in oklab, ${a.accent} 18%, transparent)` : "color-mix(in oklab, var(--primary) 14%, transparent)",
												color: a.accent ?? "var(--primary)"
											},
											children: (a.short_code || a.subdomain).slice(0, 2)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-4 font-semibold",
											children: a.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground",
											children: a.tagline || a.subdomain
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100",
											children: ["Open workspace ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => open(a, true),
									className: "mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground transition hover:text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), " Open in a new tab"]
								})
							]
						}, a.id))
					})] }),
					ready && permitted.length > 0 && shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-10 text-center text-sm text-muted-foreground",
						children: [
							"No workspaces match “",
							q,
							"”."
						]
					})
				]
			})
		]
	});
}
//#endregion
export { WorkspacePicker as component };
