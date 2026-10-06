import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { S as useNavigate, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { o as Loading$1 } from "./_ssr/kit-CJyOYuhv.mjs";
import { r as useCurrentApp } from "./_ssr/app-context-JK8H7_Nj.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.dashboard-BBhWKR06.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = supabase;
/** Count rows matching an optional filter. */
async function count(table, filter) {
	let q = db.from(table).select("id", {
		count: "exact",
		head: true
	});
	if (filter) q = filter(q);
	const { count: n } = await q;
	return n ?? 0;
}
/** Read rows with an optional filter/order. */
async function rows(table, fields, shape, limit = 8) {
	let q = db.from(table).select(fields);
	if (shape) q = shape(q);
	const { data } = await q.limit(limit);
	return data ?? [];
}
function useDash(key, load) {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let alive = true;
		setData(null);
		setError("");
		load().then((d) => alive && setData(d)).catch(() => alive && setError("Live data is temporarily unavailable."));
		return () => {
			alive = false;
		};
	}, [key]);
	return {
		data,
		error
	};
}
var money = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${Math.round(n || 0)}`;
var pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
function DashShell({ eyebrow, title, summary, actions, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `mx-auto w-full max-w-[1400px] px-5 py-7 sm:px-8 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-primary",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight sm:text-4xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
					children: summary
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [actions, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/workspaces",
					className: "text-sm font-medium text-primary hover:underline",
					children: "Switch workspace"
				})]
			})]
		}), children]
	});
}
function Loading({ variant = "grid" }) {
	const n = variant === "grid" ? 4 : 6;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: variant === "grid" ? "mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" : "mt-7 space-y-2",
		children: Array.from({ length: n }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `animate-pulse rounded-md bg-muted ${variant === "grid" ? "h-32" : "h-14"}` }, i))
	});
}
function ErrorNote({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
		children: message
	});
}
/** Horizontal capacity/progress bar built from semantic tokens. */
function Bar({ value, max, tone = "primary" }) {
	const w = Math.min(100, Math.max(2, pct(value, max || 1)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full rounded-full ${tone === "destructive" ? "bg-destructive" : tone === "muted" ? "bg-muted-foreground/50" : "bg-primary"} transition-all`,
			style: { width: `${w}%` }
		})
	});
}
function Donut({ value, label }) {
	const c = 2 * Math.PI * 26;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid h-24 w-24 place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 64",
			className: "h-24 w-24 -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "26",
				className: "fill-none stroke-muted",
				strokeWidth: "7"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "26",
				strokeWidth: "7",
				strokeLinecap: "round",
				className: "fill-none stroke-primary transition-all",
				strokeDasharray: `${value / 100 * c} ${c}`
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-lg font-semibold leading-none",
				children: [value, "%"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[10px] uppercase tracking-wide text-muted-foreground",
				children: label
			})]
		})]
	});
}
function Panel({ title, hint, children, right, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-lg border border-border bg-card ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: title
			}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: hint
			})] }), right]
		}), children]
	});
}
function Empty({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8 text-center text-sm text-muted-foreground",
		children
	});
}
function RowLink({ to, title, meta, badge, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex items-center gap-3 px-4 py-3 transition hover:bg-muted/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 shrink-0 rounded-full ${tone === "risk" ? "bg-destructive" : tone === "good" ? "bg-primary" : tone === "warn" ? "bg-muted-foreground" : "bg-primary/60"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-xs text-muted-foreground",
					children: meta
				})]
			}),
			badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground",
				children: badge
			})
		]
	});
}
async function load$7() {
	const [objectives, detections, flights, fleetReady, fleetTotal, people, ecos, grants, donations, decisions] = await Promise.all([
		rows("exec_objectives", "id,title,owner_team,status,progress,quarter", (q) => q.order("created_at", { ascending: false }), 6),
		count("ops_detections"),
		count("ops_flights"),
		count("fleet_aircraft", (q) => q.eq("status", "available")),
		count("fleet_aircraft"),
		count("hr_employees", (q) => q.eq("status", "active")),
		count("eng_ecos", (q) => q.neq("status", "implemented")),
		rows("fund_grants", "id,title,funder,amount,stage,decision_on", (q) => q, 200),
		rows("fund_donations", "id,amount,received_on", (q) => q, 300),
		rows("exec_decisions", "id,title,owner_team,status,decided_on", (q) => q.order("decided_on", { ascending: false }), 5)
	]);
	return {
		objectives,
		detections,
		flights,
		fleetReady,
		fleetTotal,
		people,
		ecos,
		awarded: grants.filter((g) => g.stage === "awarded").reduce((s, g) => s + Number(g.amount || 0), 0),
		pipeline: grants.filter((g) => !["awarded", "declined"].includes(g.stage)).reduce((s, g) => s + Number(g.amount || 0), 0),
		given: donations.reduce((s, dn) => s + Number(dn.amount || 0), 0),
		decisions,
		submitted: grants.filter((g) => g.stage === "submitted")
	};
}
function ExecDashboard() {
	const { data, error } = useDash("exec", load$7);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "Leadership",
		title: "Organizational readiness",
		summary: "One brief across missions, fleet, people and funding — and the calls that need to be made this week.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-7 rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[repeat(3,auto)_1fr] lg:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Donut, {
							value: pct(data.fleetReady, data.fleetTotal),
							label: "Fleet ready"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Donut, {
							value: pct(data.awarded, data.awarded + data.pipeline),
							label: "Funding won"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Donut, {
							value: data.objectives.length ? Math.round(data.objectives.reduce((s, o) => s + Number(o.progress || 0), 0) / data.objectives.length) : 0,
							label: "Objectives"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
							children: [
								{
									k: "Detections",
									v: data.detections,
									to: "/ops/detections"
								},
								{
									k: "Flights",
									v: data.flights,
									to: "/ops/flights"
								},
								{
									k: "Headcount",
									v: data.people,
									to: "/employees"
								},
								{
									k: "Given to date",
									v: money(data.given),
									to: "/fund/donations"
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: s.to,
								className: "rounded-lg border border-border/70 bg-background/60 p-3 hover:border-primary/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[11px] uppercase tracking-wide text-muted-foreground",
									children: s.k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 text-xl font-semibold tabular-nums",
									children: s.v
								})]
							}, s.k))
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Objectives",
					hint: "Progress across the organization",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [data.objectives.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No objectives set." }), data.objectives.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/exec/okrs",
							className: "block px-4 py-3 hover:bg-muted/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium",
										children: o.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 text-xs tabular-nums text-muted-foreground",
										children: [o.progress ?? 0, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: [
										o.owner_team ?? "Unowned",
										" · ",
										o.quarter ?? "—"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										value: Number(o.progress ?? 0),
										max: 100,
										tone: o.status === "at_risk" ? "destructive" : "primary"
									})
								})
							]
						}, o.id))]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Needs a decision",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/eng/changes",
										className: "font-medium hover:underline",
										children: [data.ecos, " open engineering changes"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Design churn on the platform"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/fund/grants",
										className: "font-medium hover:underline",
										children: [data.submitted.length, " grants awaiting decision"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [money(data.pipeline), " in the pipeline"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/requests",
										className: "font-medium hover:underline",
										children: "Cross-team hand-offs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Escalations routed to leadership"
									})]
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Recent decisions",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-border",
							children: [data.decisions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing logged yet." }), data.decisions.map((dc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/exec/decisions",
									className: "text-sm font-medium hover:underline",
									children: dc.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										dc.owner_team ?? "Leadership",
										" · ",
										dc.decided_on ?? "undated"
									]
								})]
							}, dc.id))]
						})
					})]
				})]
			})] })
		]
	});
}
var COLUMNS = [
	{
		key: "discovery",
		label: "Discovery",
		match: (s) => [
			"planned",
			"discovery",
			"backlog",
			"draft"
		].includes(s)
	},
	{
		key: "design",
		label: "Design",
		match: (s) => [
			"design",
			"in_review",
			"review"
		].includes(s)
	},
	{
		key: "build",
		label: "Build",
		match: (s) => [
			"active",
			"in_progress",
			"build",
			"open"
		].includes(s)
	},
	{
		key: "test",
		label: "Test & validate",
		match: (s) => [
			"testing",
			"validation",
			"qa",
			"blocked"
		].includes(s)
	}
];
async function load$6() {
	const [projects, milestones, issues, tasks, reviews, ecos] = await Promise.all([
		rows("eng_projects", "id,name,status,progress,target_date", (q) => q.neq("status", "complete"), 40),
		rows("eng_milestones", "id,title,status,due_date", (q) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 8),
		count("eng_issues", (q) => q.neq("status", "closed")),
		rows("eng_tasks", "id,title,status,due_date,priority", (q) => q.neq("status", "done"), 40),
		count("eng_design_reviews", (q) => q.neq("status", "approved")),
		count("eng_ecos", (q) => q.neq("status", "implemented"))
	]);
	return {
		projects,
		milestones,
		issues,
		tasks,
		reviews,
		ecos
	};
}
function ProductDashboard() {
	const { data, error } = useDash("product", load$6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "Product & program",
		title: "Delivery board",
		summary: "Every program on one board — where it sits in the lifecycle, what gates are next, and where delivery risk is building.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: COLUMNS.map((col) => {
					const items = data.projects.filter((p) => col.match((p.status ?? "").toLowerCase()));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-muted/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-semibold uppercase tracking-wide",
								children: col.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-background px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground",
								children: items.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-2",
							children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-4 text-center text-xs text-muted-foreground",
								children: "Empty"
							}), items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/product/roadmap",
								className: "block rounded-md border border-border bg-card p-3 transition hover:border-primary/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: [
											p.status ?? "—",
											" · ",
											p.target_date ?? "no target"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: Number(p.progress ?? 0),
											max: 100
										})
									})
								]
							}, p.id))]
						})]
					}, col.key);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Upcoming gates"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border",
						children: [data.milestones.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No milestones scheduled." }), data.milestones.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-4 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-24 shrink-0 font-mono text-xs text-muted-foreground",
									children: m.due_date ?? "TBD"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate text-sm font-medium",
									children: m.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: m.status ?? "open"
								})
							]
						}, m.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-3",
					children: [[
						{
							label: "Open issues",
							value: data.issues,
							to: "/eng/issues"
						},
						{
							label: "Reviews pending",
							value: data.reviews,
							to: "/eng/programs"
						},
						{
							label: "Open changes",
							value: data.ecos,
							to: "/eng/changes"
						}
					].slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: s.to,
						className: "block rounded-lg border border-border bg-card p-4 hover:border-primary/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-semibold tabular-nums",
							children: s.value
						})]
					}, s.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: "Open work items"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-semibold tabular-nums",
								children: data.tasks.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Across all active programs"
							})
						]
					})]
				})]
			})] })
		]
	});
}
async function load$5() {
	const [projects, milestones, issues, reviews, ecos, bom, tasks, openIssues, closedIssues] = await Promise.all([
		rows("eng_projects", "id,name,status,target_date,progress", (q) => q.neq("status", "complete").order("target_date", { nullsFirst: false }), 6),
		rows("eng_milestones", "id,title,due_date,status,project_id", (q) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 6),
		rows("eng_issues", "id,title,severity,status,created_at", (q) => q.neq("status", "closed").order("created_at", { ascending: false }), 8),
		rows("eng_design_reviews", "id,title,status,review_date", (q) => q.neq("status", "approved").order("scheduled_date", { nullsFirst: false }), 5),
		rows("eng_ecos", "id,title,status,created_at", (q) => q.neq("status", "implemented").order("created_at", { ascending: false }), 5),
		count("eng_bom_items"),
		rows("eng_tasks", "id,title,status,priority,due_date", (q) => q.neq("status", "done").order("due_date", { nullsFirst: false }), 8),
		count("eng_issues", (q) => q.neq("status", "closed")),
		count("eng_issues", (q) => q.eq("status", "closed"))
	]);
	return {
		projects,
		milestones,
		issues,
		reviews,
		ecos,
		bom,
		tasks,
		openIssues,
		closedIssues
	};
}
var SEV = [
	"critical",
	"high",
	"medium",
	"low"
];
function EngDashboard() {
	const { data, error } = useDash("eng", load$5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "Engineering",
		title: "Build readiness",
		summary: "Programs, milestone burn-down, issue triage, design reviews and change control for the aircraft platform.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, { variant: "rows" }),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Program burn-down"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/eng/programs",
							className: "text-xs text-primary hover:underline",
							children: "All projects"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [data.projects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No active projects." }), data.projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between font-mono text-xs uppercase tracking-wide text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-foreground",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								p.status ?? "active",
								" · ",
								p.target_date ?? "no target"
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: Number(p.progress ?? 0),
								max: 100
							})
						})] }, p.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Issue triage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								data.openIssues,
								" open · ",
								pct(data.closedIssues, data.openIssues + data.closedIssues),
								"% resolved lifetime"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2",
							children: SEV.map((s) => {
								const n = data.issues.filter((i) => (i.severity ?? "medium").toLowerCase() === s).length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-16 font-mono text-[11px] uppercase text-muted-foreground",
											children: s
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												value: n,
												max: Math.max(1, data.issues.length),
												tone: s === "critical" ? "destructive" : "primary"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 text-right text-xs tabular-nums",
											children: n
										})
									]
								}, s);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: [data.bom, " BOM line items tracked"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Open issues",
						hint: "Newest first",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.issues.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Backlog clear." }), data.issues.slice(0, 6).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/eng/issues",
								title: i.title,
								meta: `${i.severity ?? "medium"} · ${i.status ?? "open"}`,
								tone: (i.severity ?? "").toLowerCase() === "critical" ? "risk" : void 0
							}, i.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Milestones & reviews",
						hint: "Gate events ahead",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [
								[...data.milestones, ...data.reviews].length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing scheduled." }),
								data.milestones.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/eng/programs",
									title: m.title,
									meta: `Milestone · ${m.due_date ?? "unscheduled"}`,
									badge: "gate"
								}, m.id)),
								data.reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/eng/programs",
									title: r.title,
									meta: `Review · ${r.review_date ?? "unscheduled"}`,
									badge: "review"
								}, r.id))
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Change control",
						hint: "ECOs and engineering tasks",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [
								data.ecos.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/eng/changes",
									title: e.title,
									meta: `ECO · ${e.status ?? "open"}`,
									badge: "eco"
								}, e.id)),
								data.tasks.slice(0, 5).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/tasks",
									title: t.title,
									meta: `${t.priority ?? "normal"} · ${t.due_date ?? "no due date"}`
								}, t.id)),
								data.ecos.length === 0 && data.tasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No open changes." })
							]
						})
					})
				]
			})] })
		]
	});
}
async function load$4() {
	const [orders, inventory, inspections, suppliers, pos, assets] = await Promise.all([
		rows("mfg_work_orders", "id,order_number,product_name,status,priority,due_date,quantity", (q) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 10),
		rows("mfg_inventory", "id,name,quantity,reorder_point,location", (q) => q.order("quantity"), 8),
		rows("mfg_inspections", "id,status,defect_count,inspected_at", (q) => q.order("inspected_at", { ascending: false }), 8),
		count("mfg_suppliers"),
		rows("mfg_purchase_orders", "id,po_number,status,total,expected_date", (q) => q.neq("status", "received").order("expected_date", { nullsFirst: false }), 6),
		rows("fleet_aircraft", "id,tail_number,model,status,next_service_date", (q) => q.order("next_service_date", { nullsFirst: false }), 8)
	]);
	return {
		orders,
		inventory,
		inspections,
		suppliers,
		pos,
		assets
	};
}
function MfgDashboard() {
	const { data, error } = useDash("mfg", load$4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "Manufacturing & fleet",
		title: "Production floor control",
		summary: "Work order queue, stock exposure, quality dispositions, inbound purchasing and airframe availability.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, { variant: "rows" }),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 overflow-hidden rounded-lg border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-semibold uppercase tracking-[0.16em]",
						children: "Work order queue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mfg/stock",
						className: "text-xs text-primary hover:underline",
						children: "Inventory"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left font-medium",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-left font-medium",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-right font-medium",
								children: "Qty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-right font-medium",
								children: "Due"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [data.orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Queue is clear." })
						}) }), data.orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 font-medium",
									children: o.product_name ?? o.order_number ?? "Work order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 text-muted-foreground",
									children: o.status ?? "open"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 text-muted-foreground",
									children: o.priority ?? "normal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 text-right tabular-nums",
									children: o.quantity ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 text-right tabular-nums text-muted-foreground",
									children: o.due_date ?? "—"
								})
							]
						}, o.id))]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Stock exposure",
						hint: `${data.suppliers} suppliers on record`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 p-4",
							children: [data.inventory.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No inventory tracked." }), data.inventory.map((i) => {
								const rp = Number(i.reorder_point ?? 10);
								const qty = Number(i.quantity ?? 0);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-medium",
										children: i.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums text-muted-foreground",
										children: [
											qty,
											" / ",
											rp
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										value: qty,
										max: Math.max(rp * 2, qty, 1),
										tone: qty <= rp ? "destructive" : "primary"
									})
								})] }, i.id);
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Quality log",
						hint: "Latest inspections",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.inspections.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No inspections recorded." }), data.inspections.slice(0, 6).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/mfg/quality",
								title: x.status ?? "Inspection",
								meta: `${x.defect_count ?? 0} defects · ${x.inspected_at ? new Date(x.inspected_at).toLocaleDateString() : "undated"}`,
								tone: Number(x.defect_count ?? 0) > 0 ? "risk" : "good"
							}, x.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Inbound & airframes",
						hint: "Purchasing and asset readiness",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [
								data.pos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/mfg/supply",
									title: p.po_number ?? "Purchase order",
									meta: `${p.status ?? "open"} · ETA ${p.expected_date ?? "TBD"}`,
									badge: "po"
								}, p.id)),
								data.assets.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/ops/readiness",
									title: a.tail_number ?? a.model ?? "Airframe",
									meta: `${a.status ?? "unknown"} · service ${a.next_service_date ?? "n/a"}`,
									tone: a.status === "available" ? "good" : "warn"
								}, a.id)),
								data.pos.length === 0 && data.assets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing inbound." })
							]
						})
					})
				]
			})] })
		]
	});
}
async function load$3() {
	const [detections, flights, authorizations, ready, fleet, grounded, handoffs] = await Promise.all([
		rows("ops_detections", "id,name,region,severity,status,confidence,detected_at", (q) => q.neq("status", "closed").order("detected_at", { ascending: false }), 8),
		rows("ops_flights", "id,callsign,objective,status,departs_at,outcome", (q) => q.order("departs_at", { ascending: false }), 8),
		rows("ops_authorizations", "id,reference,authority,region,status,ends_at", (q) => q.order("ends_at", { nullsFirst: false }), 6),
		count("fleet_aircraft", (q) => q.eq("status", "available")),
		count("fleet_aircraft"),
		rows("fleet_maintenance", "id,title,severity,grounding,status", (q) => q.eq("grounding", true).neq("status", "closed"), 5),
		rows("team_requests", "id,subject,from_team,priority,status,due_date", (q) => q.eq("to_team", "Operations").neq("status", "closed").order("created_at", { ascending: false }), 5)
	]);
	return {
		detections,
		flights,
		authorizations,
		ready,
		fleet,
		grounded,
		handoffs
	};
}
function OpsDashboard() {
	const { data, error } = useDash("ops", load$3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "Mission operations",
		title: "Live operational picture",
		summary: "Active detections, aircraft in the air, airspace approvals and anything grounding the fleet.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [data.detections.slice(0, 4).map((dtn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ops/detections",
					className: "rounded-lg border border-primary/30 bg-primary/5 p-4 transition hover:border-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-widest text-primary",
							children: dtn.region ?? "UNKNOWN SECTOR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 truncate text-base font-semibold",
							children: dtn.name ?? "Unnamed detection"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								dtn.severity ?? "review",
								" · ",
								dtn.status ?? "new"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: Math.round(Number(dtn.confidence ?? 0) * (Number(dtn.confidence ?? 0) <= 1 ? 100 : 1)),
								max: 100
							})
						})
					]
				}, dtn.id)), data.detections.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground sm:col-span-2 xl:col-span-4",
					children: "No open detections. Sensors are quiet."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_320px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Flight log",
						hint: "Most recent sorties",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.flights.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No flights recorded." }), data.flights.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/ops/flights",
								title: f.callsign ?? "Sortie",
								meta: `${f.objective ?? "Patrol"} · ${f.departs_at?.slice(0, 16).replace("T", " ") ?? "unscheduled"}`,
								badge: f.status ?? "planned"
							}, f.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Airspace approvals",
						hint: "Authorizations in force",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.authorizations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing on file." }), data.authorizations.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/ops/airspace",
								title: a.reference ?? "Authorization",
								meta: `${a.authority ?? "authority"} · ${a.region ?? "region"}`,
								badge: a.status ?? "pending"
							}, a.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-card p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Fleet availability"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-3xl font-semibold tabular-nums",
										children: [data.ready, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-base text-muted-foreground",
											children: ["/", data.fleet]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											value: data.ready,
											max: Math.max(data.fleet, 1)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: [pct(data.ready, data.fleet), "% mission capable"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Grounding faults",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "divide-y divide-border",
									children: [data.grounded.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing grounded." }), data.grounded.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
										to: "/ops/readiness",
										title: m.title,
										meta: `${m.severity ?? "review"} · ${m.status ?? "open"}`,
										tone: "risk"
									}, m.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
								title: "Asks from other teams",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "divide-y divide-border",
									children: [data.handoffs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing waiting on Operations." }), data.handoffs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
										to: "/requests",
										title: r.subject,
										meta: `${r.from_team} · ${r.priority ?? "normal"}`
									}, r.id))]
								})
							})
						]
					})
				]
			})] })
		]
	});
}
async function load$2() {
	const [apps, integrations, infra, software, repos, security, errors] = await Promise.all([
		rows("org_apps", "id,label,slug,enabled,subdomain", (q) => q.order("sort_order"), 12),
		rows("dev_integrations", "id,name,status,vendor", (q) => q, 8),
		rows("dev_infrastructure", "id,name,status,environment,provider", (q) => q, 8),
		count("dev_software"),
		count("dev_repos"),
		rows("dev_security_logs", "id,event,severity,details,created_at", (q) => q.order("created_at", { ascending: false }), 6),
		rows("sys_error_log", "id,message,created_at,path", (q) => q.order("created_at", { ascending: false }), 6)
	]);
	return {
		apps,
		integrations,
		infra,
		software,
		repos,
		security,
		errors
	};
}
var dot = (ok) => ok ? "bg-primary" : "bg-destructive";
function SystemsDashboard() {
	const { data, error } = useDash("systems", load$2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "Enterprise systems",
		title: "Systems control",
		summary: "Workspace registry, integration and infrastructure state, security events and recent application errors.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin/health",
			className: "rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary",
			children: "Service health"
		}),
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, { variant: "rows" }),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-7 rounded-lg border border-border bg-card font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-4 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "uppercase tracking-[0.2em] text-muted-foreground",
							children: "workspace_registry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/apps",
							className: "text-primary hover:underline",
							children: "manage"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3",
						children: [data.apps.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 bg-card px-4 py-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${dot(!!a.enabled)}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-foreground",
									children: a.slug
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto truncate text-muted-foreground",
									children: a.enabled ? "live" : "disabled"
								})
							]
						}, a.id)), data.apps.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-card p-6 text-muted-foreground",
							children: "no workspaces registered"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5 grid gap-5 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Integrations",
						hint: `${data.software} software records · ${data.repos} repositories`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border font-mono text-xs",
							children: [data.integrations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No integrations registered." }), data.integrations.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 px-4 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${dot(i.status === "connected")}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: i.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-muted-foreground",
										children: i.status ?? "unknown"
									})
								]
							}, i.id))]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Infrastructure",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border font-mono text-xs",
							children: [data.infra.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No services registered." }), data.infra.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 px-4 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${dot(s.status === "healthy")}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-auto text-muted-foreground",
										children: [
											s.environment ?? s.provider ?? "",
											" ",
											s.status ?? ""
										]
									})
								]
							}, s.id))]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-5 grid gap-5 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Security events",
						hint: "Newest first",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.security.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No security events." }), data.security.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/admin/it",
								title: s.event ?? "Event",
								meta: `${s.severity ?? "info"} · ${typeof s.details === "string" ? s.details : ""}`,
								tone: ["high", "critical"].includes((s.severity ?? "").toLowerCase()) ? "risk" : void 0
							}, s.id))]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Application errors",
						hint: "Captured from the running app",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.errors.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No errors logged." }), data.errors.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/admin/health",
								title: e.message ?? "Error",
								meta: `${e.path ?? ""} ${new Date(e.created_at).toLocaleString()}`,
								tone: "risk"
							}, e.id))]
						})
					})]
				})
			] })
		]
	});
}
var STAGES = [
	"researching",
	"drafting",
	"submitted",
	"awarded",
	"declined"
];
async function load$1() {
	const [grants, donors, donations, partners] = await Promise.all([
		rows("fund_grants", "id,title,funder,amount,stage,submitted_on,decision_on,program", (q) => q.order("decision_on", { nullsFirst: false }), 120),
		rows("fund_donors", "id,name,kind,tier,lifetime_amount,last_gift_on", (q) => q.order("lifetime_amount", { ascending: false }), 8),
		rows("fund_donations", "id,amount,received_on,campaign,restriction", (q) => q.order("received_on", { ascending: false }), 200),
		count("fund_donors")
	]);
	return {
		grants,
		donors,
		donations,
		partners,
		pipeline: grants.filter((g) => !["awarded", "declined"].includes(g.stage)).reduce((s, g) => s + Number(g.amount || 0), 0),
		awarded: grants.filter((g) => g.stage === "awarded").reduce((s, g) => s + Number(g.amount || 0), 0),
		given: donations.reduce((s, d) => s + Number(d.amount || 0), 0),
		restricted: donations.filter((d) => d.restriction && d.restriction !== "unrestricted").reduce((s, d) => s + Number(d.amount || 0), 0)
	};
}
function CommercialDashboard() {
	const { data, error } = useDash("commercial", load$1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "Funding & partners",
		title: "Fuel for the mission",
		summary: "Grant pipeline by stage, top donor relationships and every gift landing in the ledger.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "Grant pipeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-4xl font-semibold tabular-nums",
						children: money(data.pipeline)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-8 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase text-muted-foreground",
								children: "Awarded"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xl font-semibold tabular-nums",
								children: money(data.awarded)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase text-muted-foreground",
								children: "Gifts received"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xl font-semibold tabular-nums",
								children: money(data.given)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase text-muted-foreground",
								children: "Restricted"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xl font-semibold tabular-nums",
								children: money(data.restricted)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase text-muted-foreground",
								children: "Donors"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xl font-semibold tabular-nums",
								children: data.partners
							})] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-5",
					children: STAGES.map((stage) => {
						const inStage = data.grants.filter((g) => (g.stage ?? "researching") === stage);
						const value = inStage.reduce((s, g) => s + Number(g.amount || 0), 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/fund/grants",
							className: "rounded-lg border border-border p-3 transition hover:border-primary/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-wide text-muted-foreground",
									children: stage
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-lg font-semibold tabular-nums",
									children: money(value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [inStage.length, " applications"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										value,
										max: Math.max(data.pipeline + data.awarded, 1),
										tone: stage === "declined" ? "muted" : "primary"
									})
								})
							]
						}, stage);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Awaiting decision",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.grants.filter((g) => g.stage === "submitted").length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing submitted." }), data.grants.filter((g) => g.stage === "submitted").slice(0, 6).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/fund/grants",
								title: g.title,
								meta: `${g.funder ?? "Funder"} · ${money(Number(g.amount || 0))} · decision ${g.decision_on ?? "TBD"}`
							}, g.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Top donors",
						hint: "By lifetime giving",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.donors.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No donors on record." }), data.donors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/fund/donors",
								title: d.name,
								meta: `${money(Number(d.lifetime_amount || 0))} lifetime · last gift ${d.last_gift_on ?? "n/a"}`,
								badge: d.tier ?? d.kind ?? void 0
							}, d.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Recent gifts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.donations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No gifts recorded." }), data.donations.slice(0, 6).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/fund/donations",
								title: money(Number(g.amount || 0)),
								meta: `${g.campaign ?? "General"} · ${g.received_on ?? ""}`,
								tone: "good"
							}, g.id))]
						})
					})
				]
			})] })
		]
	});
}
async function load() {
	const [employees, applicants, onboarding, timeOff, training, certs, reviews, depts] = await Promise.all([
		rows("hr_employees", "id,user_id,full_name,title,department,status,start_date", (q) => q.order("start_date", { ascending: false }), 200),
		rows("hr_applicants", "id,name,stage,role,created_at", (q) => q.not("stage", "in", "(hired,rejected)").order("created_at", { ascending: false }), 6),
		rows("hr_onboarding", "id,task,status,due_date,assignee_id", (q) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 6),
		rows("hr_time_off", "id,type,status,start_date,end_date,user_id", (q) => q.eq("status", "pending").order("start_date"), 6),
		count("hr_training", (q) => q.neq("status", "complete")),
		rows("hr_certifications", "id,name,expires_date,user_id", (q) => q.order("expires_date", { nullsFirst: false }), 6),
		count("hr_reviews", (q) => q.neq("status", "complete")),
		rows("hr_departments", "id,name", (q) => q, 20)
	]);
	const active = employees.filter((e) => e.status === "active");
	const byDept = {};
	active.forEach((e) => {
		const d = e.department || "Unassigned";
		byDept[d] = (byDept[d] ?? 0) + 1;
	});
	return {
		employees,
		active,
		byDept,
		recent: employees.slice(0, 5),
		applicants,
		onboarding,
		timeOff,
		training,
		certs,
		reviews,
		depts
	};
}
function AdminDashboard() {
	const { data, error } = useDash("admin", load);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashShell, {
		eyebrow: "People & administration",
		title: "Organization health",
		summary: "Headcount distribution, hiring funnel, onboarding progress, leave coverage and compliance expiry.",
		children: [
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorNote, { message: error }),
			!data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}),
			data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-7 grid gap-5 lg:grid-cols-[280px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Donut, {
							value: pct(data.active.length, data.employees.length),
							label: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-3xl font-semibold tabular-nums",
							children: data.active.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"people on the team · ",
								data.depts.length,
								" departments"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-3 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold tabular-nums",
									children: data.applicants.length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Applicants"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold tabular-nums",
									children: data.training
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Training"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold tabular-nums",
									children: data.reviews
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Reviews"
								})] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Headcount by department"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [Object.keys(data.byDept).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No employee records." }), Object.entries(data.byDept).sort((a, b) => b[1] - a[1]).map(([dept, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-medium",
								children: dept
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted-foreground",
								children: n
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: n,
								max: Math.max(...Object.values(data.byDept), 1)
							})
						})] }, dept))]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Newest teammates",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "divide-y divide-border",
							children: [data.recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No records." }), data.recent.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "px-4 py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: e.user_id,
									name: e.full_name ?? "Team member"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										e.title ?? "—",
										" · started ",
										e.start_date ?? "n/a"
									]
								})]
							}, e.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Hiring funnel",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.applicants.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No open applicants." }), data.applicants.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/hiring",
								title: a.name,
								meta: `${a.role ?? "Role TBD"} · ${a.stage ?? "applied"}`
							}, a.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Onboarding",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [data.onboarding.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "All tasks complete." }), data.onboarding.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
								to: "/onboarding",
								title: o.task,
								meta: `${o.status ?? "pending"} · ${o.due_date ?? "no due date"}`
							}, o.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Leave & compliance",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [
								data.timeOff.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/time-off",
									title: t.type ?? "Time off",
									meta: `${t.start_date ?? ""} → ${t.end_date ?? ""}`,
									badge: "pending"
								}, t.id)),
								data.certs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowLink, {
									to: "/certifications",
									title: c.name,
									meta: `expires ${c.expires_date ?? "n/a"}`,
									tone: "warn"
								}, c.id)),
								data.timeOff.length === 0 && data.certs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing pending." })
							]
						})
					})
				]
			})] })
		]
	});
}
/**
* Every workspace gets its own purpose-built dashboard — different data,
* different layout, different information design. This only picks the right
* one for the active app.
*/
function WorkspaceDashboard({ app }) {
	switch (app.slug) {
		case "exec": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecDashboard, {});
		case "product": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDashboard, {});
		case "eng": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngDashboard, {});
		case "mfg": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MfgDashboard, {});
		case "ops": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsDashboard, {});
		case "systems": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemsDashboard, {});
		case "commercial": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommercialDashboard, {});
		case "admin": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecDashboard, {});
	}
}
/**
* The dashboard is always the current workspace's own dashboard — Operations
* sees flights, Engineering sees programs, Leadership sees the org briefing.
*/
function DashboardPage() {
	const { app, loading } = useCurrentApp();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!loading && (!app || app.is_hub)) navigate({
			to: "/workspaces",
			replace: true
		});
	}, [
		loading,
		app?.id,
		app?.is_hub,
		navigate
	]);
	if (loading || !app || app.is_hub) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading$1, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceDashboard, { app });
}
//#endregion
export { DashboardPage as component };
