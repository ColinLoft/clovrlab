import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Hn as ExternalLink, I as Slack, Z as Save, hn as Grip, st as Plus, vn as Globe, x as Trash2 } from "./_libs/lucide-react.mjs";
import { n as navGroups } from "./_ssr/nav-config-BQNdxmMi.mjs";
import { c as rootDomain, i as fetchApps, l as saveApp, n as appUrl, r as deleteApp, t as APP_LAYOUTS } from "./_ssr/apps-2-64Dtxg.mjs";
import { t as useRouteAccess } from "./_ssr/route-access-BIUVO0kB.mjs";
import { n as saveSlackSettings, t as loadSlackSettings } from "./_ssr/slack-Bekkiy0X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.apps-CoNtgJZb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppsAdmin() {
	const access = useRouteAccess();
	const [apps, setApps] = (0, import_react.useState)([]);
	const [units, setUnits] = (0, import_react.useState)([]);
	const [slack, setSlack] = (0, import_react.useState)({
		workspaceUrl: "",
		channels: {}
	});
	const [savedAt, setSavedAt] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const reload = async () => {
		const [list, { data: u }, s] = await Promise.all([
			fetchApps(),
			supabase.from("org_units").select("id, name, slug, kind").order("sort_order"),
			loadSlackSettings()
		]);
		setApps(list);
		setUnits(u ?? []);
		setSlack(s);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const divisions = (0, import_react.useMemo)(() => units.filter((u) => u.kind === "division"), [units]);
	const groupLabels = (0, import_react.useMemo)(() => navGroups.map((g) => g.label), []);
	const domain = rootDomain();
	const patch = (id, changes) => setApps((prev) => prev.map((a) => a.id === id ? {
		...a,
		...changes
	} : a));
	const persist = async (app) => {
		setBusy(true);
		await saveApp({
			id: app.id,
			slug: app.slug,
			subdomain: app.subdomain.trim().toLowerCase(),
			label: app.label,
			tagline: app.tagline,
			org_unit_id: app.org_unit_id,
			landing_route: app.landing_route,
			nav_groups: app.nav_groups,
			enabled: app.enabled,
			sort_order: app.sort_order,
			accent: app.accent,
			accent_dark: app.accent_dark,
			layout: app.layout,
			short_code: app.short_code
		});
		setBusy(false);
		setSavedAt(Date.now());
		setTimeout(() => setSavedAt(null), 2e3);
	};
	const addApp = async () => {
		const n = apps.length;
		await saveApp({
			slug: `team-${n + 1}`,
			subdomain: `team${n + 1}`,
			label: "New workspace",
			tagline: "",
			landing_route: "/dashboard",
			nav_groups: ["Core"],
			enabled: false,
			sort_order: n + 10
		});
		reload();
	};
	const remove = async (app) => {
		if (app.is_hub) return;
		if (!confirm(`Delete the ${app.label} workspace?`)) return;
		await deleteApp(app.id);
		reload();
	};
	const saveSlack = async () => {
		setBusy(true);
		await saveSlackSettings(slack);
		setBusy(false);
		setSavedAt(Date.now());
		setTimeout(() => setSavedAt(null), 2e3);
	};
	if (!access.loading && !access.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Only administrators can manage team apps."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-6 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-6 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "flex items-center gap-2 text-xl font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grip, { className: "h-5 w-5 text-primary" }), " Team apps"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: ["Each workspace is served from its own subdomain and shows only its own sections.", domain ? ` Point DNS for each subdomain at ${domain}.` : " On preview links, add ?app=<subdomain> to test a workspace."]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: addApp,
					className: "flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New app"]
				})]
			}),
			savedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600",
				children: "Saved."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: apps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 border-b border-border px-5 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: app.label,
								onChange: (e) => patch(app.id, { label: e.target.value }),
								className: "min-w-[10rem] flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-sm font-semibold outline-none focus:border-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: app.subdomain,
										onChange: (e) => patch(app.id, { subdomain: e.target.value }),
										className: "w-28 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs outline-none focus:border-primary"
									}),
									domain && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono",
										children: [".", domain]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: app.enabled,
									onChange: (e) => patch(app.id, { enabled: e.target.checked })
								}), "Live"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: appUrl(app),
								target: "_blank",
								rel: "noopener",
								className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted",
								"aria-label": "Open workspace",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => persist(app),
								disabled: busy,
								className: "flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " Save"]
							}),
							!app.is_hub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => remove(app),
								className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-red-500",
								"aria-label": "Delete",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 px-5 py-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Tagline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: app.tagline ?? "",
								onChange: (e) => patch(app.id, { tagline: e.target.value }),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Division"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: app.org_unit_id ?? "",
								onChange: (e) => patch(app.id, { org_unit_id: e.target.value || null }),
								disabled: app.is_hub,
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Everyone (shared)"
								}), divisions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d.id,
									children: d.name
								}, d.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Landing page"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: app.landing_route,
								onChange: (e) => patch(app.id, { landing_route: e.target.value }),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Badge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: app.short_code ?? "",
								onChange: (e) => patch(app.id, { short_code: e.target.value.toUpperCase().slice(0, 3) }),
								placeholder: "EN",
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Signature colour"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-7 w-7 flex-shrink-0 rounded-md border border-border",
									style: { background: app.accent ?? "transparent" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: app.accent ?? "",
									onChange: (e) => patch(app.id, { accent: e.target.value }),
									placeholder: "oklch(0.6 0.15 220)",
									className: "w-full rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs outline-none focus:border-primary"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Layout style"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: app.layout,
								onChange: (e) => patch(app.id, { layout: e.target.value }),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary",
								children: APP_LAYOUTS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: l.value,
									children: [
										l.label,
										" — ",
										l.hint
									]
								}, l.value))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Sidebar sections"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: groupLabels.map((g) => {
										const on = app.nav_groups.includes(g);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => patch(app.id, { nav_groups: on ? app.nav_groups.filter((x) => x !== g) : [...app.nav_groups, g] }),
											className: `rounded-full px-3 py-1 text-xs transition ${on ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"}`,
											children: g
										}, g);
									})
								})]
							})
						]
					})]
				}, app.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border px-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slack, { className: "h-4 w-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Slack"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "internal chat lives here now"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 px-5 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Workspace URL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: slack.workspaceUrl,
							onChange: (e) => setSlack({
								...slack,
								workspaceUrl: e.target.value
							}),
							placeholder: "https://clovrlabs.slack.com",
							className: "w-full max-w-md rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Channel per division"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 md:grid-cols-2",
							children: divisions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-44 truncate text-xs text-muted-foreground",
									children: d.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: slack.channels[d.slug] ?? "",
									onChange: (e) => setSlack({
										...slack,
										channels: {
											...slack.channels,
											[d.slug]: e.target.value
										}
									}),
									placeholder: "#engineering",
									className: "flex-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
								})]
							}, d.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: saveSlack,
							disabled: busy,
							className: "flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " Save Slack settings"]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { AppsAdmin as component };
