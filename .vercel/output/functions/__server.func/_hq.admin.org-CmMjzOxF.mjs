import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { Tt as Network, mr as Check, st as Plus, u as Users, x as Trash2, z as Shield } from "./_libs/lucide-react.mjs";
import { t as UserMention } from "./_ssr/UserMention-B7i_AS2Q.mjs";
import { a as setRoleRoute, c as slugify, i as loadOrg, n as assignUserUnit, o as setUserOverride, r as buildTree, s as setUserRole, t as ROUTE_CATALOG } from "./_ssr/org-CNsh9lrJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.admin.org-CmMjzOxF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = supabase;
function OrgAdmin() {
	const [tab, setTab] = (0, import_react.useState)("structure");
	const [units, setUnits] = (0, import_react.useState)([]);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [routes, setRoutes] = (0, import_react.useState)([]);
	const [people, setPeople] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const reload = async () => {
		const data = await loadOrg();
		setUnits(data.units);
		setRoles(data.roles);
		setRoutes(data.routes);
		setPeople(data.people);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
						children: "Administration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight",
						children: "Organization"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Divisions, teams, team roles and exactly which pages each team can open."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-1 border-b border-border",
				children: [
					[
						"structure",
						"Structure",
						Network
					],
					[
						"access",
						"Roles & Access",
						Shield
					],
					[
						"people",
						"People",
						Users
					]
				].map(([k, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(k),
					className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
						" ",
						label
					]
				}, k))
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading organization…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				tab === "structure" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Structure, {
					units,
					people,
					roles,
					onChange: reload
				}),
				tab === "access" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessMatrix, {
					units,
					roles,
					routes,
					onChange: reload
				}),
				tab === "people" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeopleTab, {
					units,
					roles,
					people,
					onChange: reload
				})
			] })
		]
	});
}
function Structure({ units, people, roles, onChange }) {
	const tree = (0, import_react.useMemo)(() => buildTree(units), [units]);
	const [newTeam, setNewTeam] = (0, import_react.useState)({});
	const [newDivision, setNewDivision] = (0, import_react.useState)("");
	const headcount = (unitId) => {
		const kids = (tree.get(unitId) ?? []).map((u) => u.id);
		return people.filter((p) => p.org_unit_id === unitId || kids.includes(p.org_unit_id ?? "")).length;
	};
	const addUnit = async (name, parentId, kind) => {
		if (!name.trim()) return;
		const { data } = await db.from("org_units").insert({
			name: name.trim(),
			slug: slugify(name) + "-" + Math.random().toString(36).slice(2, 6),
			parent_id: parentId,
			kind,
			sort_order: units.filter((u) => u.parent_id === parentId).length
		}).select("id, name, slug").maybeSingle();
		if (data) await db.from("org_roles").insert([{
			name: `${data.name} — Member`,
			slug: `${data.slug}-member`,
			org_unit_id: data.id,
			kind: "department",
			level: "member",
			is_default: true
		}, {
			name: `${data.name} — Lead`,
			slug: `${data.slug}-lead`,
			org_unit_id: data.id,
			kind: "department",
			level: "lead"
		}]);
		onChange();
	};
	const removeUnit = async (id) => {
		if (!confirm("Delete this unit and its teams, roles and access?")) return;
		await db.from("org_units").delete().eq("id", id);
		onChange();
	};
	const divisions = tree.get(null) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: newDivision,
				onChange: (e) => setNewDivision(e.target.value),
				placeholder: "New division name…",
				className: "w-72 rounded-lg border border-border bg-background px-3 py-2 text-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					addUnit(newDivision, null, "division");
					setNewDivision("");
				},
				className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add division"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: divisions.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/teams/$slug",
							params: { slug: d.slug },
							className: "text-base font-semibold hover:text-primary",
							children: d.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								headcount(d.id),
								" people · ",
								(tree.get(d.id) ?? []).length,
								" teams · ",
								roles.filter((r) => r.org_unit_id === d.id).length,
								" roles"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => removeUnit(d.id),
							className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-1",
						children: (tree.get(d.id) ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg bg-muted/40 px-3 py-1.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/teams/$slug",
								params: { slug: t.slug },
								className: "hover:text-primary",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [
									people.filter((p) => p.org_unit_id === t.id).length,
									" people",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeUnit(t.id),
										className: "rounded p-1 hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
									})
								]
							})]
						}, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: newTeam[d.id] ?? "",
							onChange: (e) => setNewTeam((s) => ({
								...s,
								[d.id]: e.target.value
							})),
							placeholder: "Add team…",
							className: "flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								addUnit(newTeam[d.id] ?? "", d.id, "team");
								setNewTeam((s) => ({
									...s,
									[d.id]: ""
								}));
							},
							className: "rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted",
							children: "Add"
						})]
					})
				]
			}, d.id))
		})]
	});
}
function AccessMatrix({ units, roles, routes, onChange }) {
	const [roleId, setRoleId] = (0, import_react.useState)(roles[0]?.id ?? "");
	const [newRole, setNewRole] = (0, import_react.useState)("");
	const active = roles.find((r) => r.id === roleId);
	const has = (route) => routes.some((r) => r.role_id === roleId && r.route === route);
	const unitName = (id) => units.find((u) => u.id === id)?.name ?? "Company-wide";
	const toggle = async (route, on) => {
		await setRoleRoute(roleId, route, on);
		onChange();
	};
	const createRole = async () => {
		if (!newRole.trim()) return;
		const { data } = await db.from("org_roles").insert({
			name: newRole.trim(),
			slug: slugify(newRole) + "-" + Math.random().toString(36).slice(2, 6),
			kind: "custom",
			level: "member"
		}).select("id").maybeSingle();
		setNewRole("");
		onChange();
		if (data?.id) setRoleId(data.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[300px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: newRole,
					onChange: (e) => setNewRole(e.target.value),
					placeholder: "New custom role…",
					className: "min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: createRole,
					className: "rounded-lg bg-primary px-2.5 py-1.5 text-sm text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[70vh] space-y-0.5 overflow-y-auto",
				children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setRoleId(r.id),
					className: `w-full rounded-lg px-3 py-2 text-left text-sm ${roleId === r.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate font-medium",
						children: r.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block truncate text-[11px] text-muted-foreground",
						children: [unitName(r.org_unit_id), r.is_default ? " · default" : ""]
					})]
				}, r.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-card p-4",
			children: !active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Pick a role."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: active.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-4 text-xs text-muted-foreground",
					children: [
						unitName(active.org_unit_id),
						" · ",
						active.level,
						active.is_default ? " · automatically applied to everyone in this team" : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: ROUTE_CATALOG.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
						children: group.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-0.5",
						children: group.routes.map((r) => {
							const on = has(r.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toggle(r.to, !on),
								className: `flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${on ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `flex h-4 w-4 items-center justify-center rounded border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
									children: on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
								}), r.label]
							}, r.to + group.label);
						})
					})] }, group.label))
				})
			] })
		})]
	});
}
function PeopleTab({ units, roles, people, onChange }) {
	const [assigned, setAssigned] = (0, import_react.useState)([]);
	const [overrides, setOverrides] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [openUser, setOpenUser] = (0, import_react.useState)(null);
	const reloadAssignments = async () => {
		const [a, o] = await Promise.all([db.from("user_org_roles").select("user_id, role_id"), db.from("user_route_overrides").select("user_id, route, granted")]);
		setAssigned(a.data ?? []);
		setOverrides(o.data ?? []);
	};
	(0, import_react.useEffect)(() => {
		reloadAssignments();
	}, []);
	const filtered = people.filter((p) => `${p.full_name ?? ""} ${p.email ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search people…",
			className: "w-72 rounded-lg border border-border bg-background px-3 py-2 text-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2",
							children: "Person"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2",
							children: "Team"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2",
							children: "Extra roles"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2",
							children: "Overrides"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((p) => {
					const myRoles = assigned.filter((a) => a.user_id === p.id);
					const myOverrides = overrides.filter((o) => o.user_id === p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: p.id,
									name: p.full_name || p.email || "Unknown"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: p.title || "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: p.org_unit_id ?? "",
									onChange: async (e) => {
										await assignUserUnit(p.id, e.target.value || null);
										onChange();
									},
									className: "rounded-lg border border-border bg-background px-2 py-1 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Unassigned"
									}), units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: u.id,
										children: [u.parent_id ? "— " : "", u.name]
									}, u.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setOpenUser(openUser === p.id ? null : p.id),
									className: "rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted",
									children: [
										myRoles.length,
										" role",
										myRoles.length === 1 ? "" : "s",
										" · edit"
									]
								}), openUser === p.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 max-h-64 w-72 space-y-0.5 overflow-y-auto rounded-lg border border-border bg-background p-2",
									children: roles.map((r) => {
										const on = myRoles.some((a) => a.role_id === r.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: async () => {
												await setUserRole(p.id, r.id, !on);
												reloadAssignments();
											},
											className: `flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs ${on ? "bg-primary/10 text-primary" : "hover:bg-muted"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `flex h-3.5 w-3.5 items-center justify-center rounded border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
												children: on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2.5 w-2.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: r.name
											})]
										}, r.id);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-1",
									children: [myOverrides.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: async () => {
											await setUserOverride(p.id, o.route, null);
											reloadAssignments();
										},
										className: `rounded-full px-2 py-0.5 text-[11px] ${o.granted ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`,
										children: [o.granted ? "+" : "−", o.route]
									}, o.route)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverrideAdder, {
										userId: p.id,
										onDone: reloadAssignments
									})]
								})
							})
						]
					}, p.id);
				}) })]
			})
		})]
	});
}
function OverrideAdder({ userId, onDone }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [route, setRoute] = (0, import_react.useState)("");
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => setOpen(true),
		className: "rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted",
		children: "+ override"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: route,
				onChange: (e) => setRoute(e.target.value),
				className: "rounded border border-border bg-background px-1 py-0.5 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "page…"
				}), ROUTE_CATALOG.flatMap((g) => g.routes).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: r.to,
					children: r.label
				}, r.to + r.label))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: async () => {
					if (route) {
						await setUserOverride(userId, route, true);
						onDone();
					}
					setOpen(false);
				},
				className: "rounded bg-primary px-1.5 py-0.5 text-[11px] text-primary-foreground",
				children: "allow"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: async () => {
					if (route) {
						await setUserOverride(userId, route, false);
						onDone();
					}
					setOpen(false);
				},
				className: "rounded bg-destructive px-1.5 py-0.5 text-[11px] text-destructive-foreground",
				children: "block"
			})
		]
	});
}
//#endregion
export { OrgAdmin as component };
