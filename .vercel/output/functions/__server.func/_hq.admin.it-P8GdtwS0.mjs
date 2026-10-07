import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B7QlDyqv.mjs";
import { B as ShieldCheck, Gr as AppWindow, I as Slack, Kn as Database, Kr as Activity, Rr as ArrowUpRight, W as Server, Wt as LockKeyhole } from "./_libs/lucide-react.mjs";
import { t as useRouteAccess } from "./_ssr/route-access-CdzD_jLq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.it-P8GdtwS0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ITConsole() {
	const access = useRouteAccess();
	const [counts, setCounts] = (0, import_react.useState)({
		apps: 0,
		integrations: 0,
		infrastructure: 0,
		security: 0
	});
	const [events, setEvents] = (0, import_react.useState)([]);
	const db = supabase;
	(0, import_react.useEffect)(() => {
		if (!access.isAdmin) return;
		Promise.all([
			db.from("org_apps").select("id", {
				count: "exact",
				head: true
			}).eq("enabled", true),
			db.from("dev_integrations").select("id", {
				count: "exact",
				head: true
			}),
			db.from("dev_infrastructure").select("id", {
				count: "exact",
				head: true
			}),
			db.from("dev_security_logs").select("id", {
				count: "exact",
				head: true
			}).in("severity", ["high", "critical"]),
			db.from("dev_security_logs").select("id,event_type,severity,description,created_at").order("created_at", { ascending: false }).limit(8)
		]).then(([apps, integrations, infrastructure, security, recent]) => {
			setCounts({
				apps: apps.count ?? 0,
				integrations: integrations.count ?? 0,
				infrastructure: infrastructure.count ?? 0,
				security: security.count ?? 0
			});
			setEvents(recent.data ?? []);
		});
	}, [access.isAdmin]);
	if (access.loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Checking systems access…"
	});
	if (!access.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Enterprise Systems is restricted to administrators."
	});
	const cards = [
		{
			label: "Live applications",
			value: counts.apps,
			icon: AppWindow,
			to: "/admin/apps",
			text: "Workspace identity, navigation, availability, and launch routes."
		},
		{
			label: "Integrations",
			value: counts.integrations,
			icon: Activity,
			to: "/admin/apps",
			text: "External services, ownership, connection state, and configuration."
		},
		{
			label: "Infrastructure",
			value: counts.infrastructure,
			icon: Server,
			to: "/admin/company",
			text: "Internal systems, environments, service ownership, and health."
		},
		{
			label: "Security alerts",
			value: counts.security,
			icon: ShieldCheck,
			to: "/admin/org",
			text: "High-priority access, policy, and system events."
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-6 py-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-border pb-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase text-primary",
						children: "Enterprise Systems"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-3xl font-semibold",
						children: "IT operations console"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
						children: "Manage internal products, identity and access, connected services, Slack tooling, and platform health from one control surface."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4",
				children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: card.to,
					className: "group border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-semibold",
								children: card.value
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 text-sm font-semibold",
							children: card.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-5 text-muted-foreground",
							children: card.text
						})
					]
				}, card.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-5 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-5 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Recent security and systems events"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-8 text-center text-sm text-muted-foreground",
							children: "No recent events."
						}), events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 px-5 py-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "mt-0.5 h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: event.event_type ?? "System event"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "line-clamp-2 text-xs text-muted-foreground",
									children: [
										event.severity ?? "info",
										" · ",
										event.description ?? "No description"
									]
								})]
							})]
						}, event.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/health",
							className: "block border border-border bg-card p-5 hover:border-primary/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-5 text-sm font-semibold",
									children: "Service health"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-5 text-muted-foreground",
									children: "Live uptime, database latency, integration status, and recent application errors."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-4 flex items-center gap-1 text-xs font-medium text-primary",
									children: ["Open board ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/slack",
							className: "block border border-border bg-card p-5 hover:border-primary/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slack, { className: "h-5 w-5 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-5 text-sm font-semibold",
									children: "Slack administration"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-5 text-muted-foreground",
									children: "Create channels, invite members, and monitor bot activity."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-4 flex items-center gap-1 text-xs font-medium text-primary",
									children: ["Configure ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/org",
							className: "block border border-border bg-card p-5 hover:border-primary/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-5 w-5 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-5 text-sm font-semibold",
									children: "Identity & access"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-5 text-muted-foreground",
									children: "Teams, roles, page access, exceptions, and administrative oversight."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/company",
							className: "block border border-border bg-card p-5 hover:border-primary/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-5 w-5 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-5 text-sm font-semibold",
									children: "Organization settings"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-5 text-muted-foreground",
									children: "Shared company configuration and internal service defaults."
								})
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ITConsole as component };
