import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { w as useParams, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Br as ArrowLeft, Qt as LayoutGrid, u as Users, z as Shield } from "./_libs/lucide-react.mjs";
import { n as navGroups } from "./_ssr/nav-config-BQNdxmMi.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
import { i as loadOrg, r as buildTree } from "./_ssr/org-DDqmU5f9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.teams._slug-C5tTJ8P2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = supabase;
var ROUTE_LABEL = new Map(navGroups.flatMap((g) => g.items.map((i) => [i.to, i])));
function TeamWorkspace() {
	const { slug } = useParams({ from: "/_hq/teams/$slug" });
	const [units, setUnits] = (0, import_react.useState)([]);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [routes, setRoutes] = (0, import_react.useState)([]);
	const [people, setPeople] = (0, import_react.useState)([]);
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		(async () => {
			const d = await loadOrg();
			setUnits(d.units);
			setRoles(d.roles);
			setRoutes(d.routes);
			setPeople(d.people);
			const t = await db.from("con_tasks").select("id, title, status, priority, due_date, department").limit(200);
			setTasks(t.data ?? []);
			setLoading(false);
		})();
	}, [slug]);
	const tree = (0, import_react.useMemo)(() => buildTree(units), [units]);
	const unit = units.find((u) => u.slug === slug);
	const children = unit ? tree.get(unit.id) ?? [] : [];
	const memberIds = (0, import_react.useMemo)(() => {
		if (!unit) return [];
		const ids = [unit.id, ...children.map((c) => c.id)];
		return people.filter((p) => ids.includes(p.org_unit_id ?? "")).map((p) => p.id);
	}, [
		unit,
		children,
		people
	]);
	const members = people.filter((p) => memberIds.includes(p.id));
	const teamRoles = unit ? roles.filter((r) => r.org_unit_id === unit.id || children.some((c) => c.id === r.org_unit_id)) : [];
	const teamRouteSet = Array.from(new Set(routes.filter((r) => teamRoles.some((tr) => tr.id === r.role_id)).map((r) => r.route)));
	const openTasks = tasks.filter((t) => t.status !== "done" && t.status !== "closed");
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Loading team…"
	});
	if (!unit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Team not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/teams",
				className: "mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " All teams"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
						children: [unit.kind === "division" ? "Division" : "Team", " workspace"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight",
						children: unit.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: unit.description || `${members.length} people · ${teamRoles.length} roles · ${teamRouteSet.length} tools`
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 grid gap-3 sm:grid-cols-4",
				children: [
					["People", members.length],
					["Sub-teams", children.length],
					["Roles", teamRoles.length],
					["Open tasks", openTasks.length]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-semibold",
						children: value
					})]
				}, String(label)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mb-3 flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4 text-primary" }), " This team's tools"]
							}), teamRouteSet.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No pages assigned yet — set them in Organization → Roles & Access."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
								children: teamRouteSet.map((r) => {
									const item = ROUTE_LABEL.get(r);
									const Icon = item?.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: r,
										className: "flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary",
										children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), item?.label ?? r]
									}, r);
								})
							})]
						}),
						children.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-sm font-semibold",
								children: "Sub-teams"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/teams/$slug",
									params: { slug: c.slug },
									className: "rounded-full bg-muted px-3 py-1 text-xs hover:bg-primary/10 hover:text-primary",
									children: [
										c.name,
										" · ",
										people.filter((p) => p.org_unit_id === c.id).length
									]
								}, c.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-sm font-semibold",
								children: "Open work"
							}), openTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Nothing open."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: openTasks.slice(0, 8).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: t.due_date ?? t.priority ?? ""
									})]
								}, t.id))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-3 flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), " Members"]
						}), members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No one assigned yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: m.id,
								name: m.full_name || m.email || "Unknown"
							}, m.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-3 flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }), " Roles"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: teamRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg bg-muted/40 px-3 py-1.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: r.is_default ? "default" : r.level
								})]
							}, r.id))
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { TeamWorkspace as component };
