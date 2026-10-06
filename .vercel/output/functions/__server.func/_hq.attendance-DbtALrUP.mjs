import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, S as Timer, mr as Check, n as X, u as Users, xr as CalendarDays } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_ssr/notify-Cokq0_dZ.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.attendance-DbtALrUP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function punchSeconds(p, now) {
	const gross = ((p.clock_out ? new Date(p.clock_out).getTime() : now) - new Date(p.clock_in).getTime()) / 1e3;
	let br = Number(p.break_minutes || 0) * 60;
	if (!p.clock_out && p.break_started_at) br += (now - new Date(p.break_started_at).getTime()) / 1e3;
	return Math.max(0, gross - br);
}
var STATUS_TONE = {
	pending: "border-amber-500/20 bg-amber-500/10 text-amber-600",
	approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
	denied: "border-destructive/20 bg-destructive/10 text-destructive",
	cancelled: "border-border bg-muted/40 text-muted-foreground"
};
function AttendancePage() {
	const [tab, setTab] = (0, import_react.useState)("today");
	const [punches, setPunches] = (0, import_react.useState)([]);
	const [leaves, setLeaves] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [me, setMe] = (0, import_react.useState)(null);
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const [days, setDays] = (0, import_react.useState)(7);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(Date.now()), 3e4);
		return () => clearInterval(t);
	}, []);
	const load = (0, import_react.useCallback)(async () => {
		const since = /* @__PURE__ */ new Date();
		since.setDate(since.getDate() - days);
		since.setHours(0, 0, 0, 0);
		const [{ data: p }, { data: l }, { data: pr }, { data: u }] = await Promise.all([
			supabase.from("hr_time_clock").select("*").gte("clock_in", since.toISOString()).order("clock_in", { ascending: false }),
			supabase.from("hr_time_off").select("id, user_id, type, start_date, end_date, days, status, reason").order("start_date", { ascending: false }).limit(200),
			supabase.from("profiles").select("id, full_name, department"),
			supabase.auth.getUser()
		]);
		setPunches(p ?? []);
		setLeaves(l ?? []);
		setProfiles(pr ?? []);
		setMe(u.user?.id ?? null);
	}, [days]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const nameOf = (0, import_react.useCallback)((id) => profiles.find((p) => p.id === id)?.full_name ?? "Unknown", [profiles]);
	const onShift = (0, import_react.useMemo)(() => punches.filter((p) => !p.clock_out), [punches]);
	const hoursToday = (0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setHours(0, 0, 0, 0);
		return punches.filter((p) => new Date(p.clock_in).getTime() >= d.getTime());
	}, [punches]).reduce((s, p) => s + punchSeconds(p, now), 0) / 3600;
	const pendingLeave = leaves.filter((l) => (l.status ?? "pending") === "pending");
	const perPerson = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of punches) {
			const cur = map.get(p.user_id) ?? {
				seconds: 0,
				shifts: 0
			};
			map.set(p.user_id, {
				seconds: cur.seconds + punchSeconds(p, now),
				shifts: cur.shifts + 1
			});
		}
		return Array.from(map.entries()).sort((a, b) => b[1].seconds - a[1].seconds);
	}, [punches, now]);
	async function decide(l, status) {
		const { error } = await supabase.from("hr_time_off").update({
			status,
			approver_id: me
		}).eq("id", l.id);
		if (error) return toast.error(error.message);
		toast.success(`Request ${status}`);
		load();
	}
	const kpis = [
		{
			label: "On shift now",
			value: onShift.length,
			icon: Users
		},
		{
			label: "Hours today",
			value: hoursToday.toFixed(1),
			icon: Clock
		},
		{
			label: `Hours last ${days}d`,
			value: (punches.reduce((s, p) => s + punchSeconds(p, now), 0) / 3600).toFixed(1),
			icon: Timer
		},
		{
			label: "Leave awaiting review",
			value: pendingLeave.length,
			icon: CalendarDays
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-[1600px] px-6 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: "People & Operations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: "Attendance & Leave"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Live clock-ins, timesheets and leave approvals across the company."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium uppercase tracking-wide",
							children: k.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, {
							className: "h-4 w-4",
							"aria-hidden": "true"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl font-semibold",
						children: k.value
					})]
				}, k.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex rounded-xl border border-border bg-card p-1 text-sm",
					children: [
						["today", "On shift"],
						["timesheets", "Timesheets"],
						["leave", "Leave requests"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(id),
						className: `rounded-lg px-3 py-1.5 ${tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
						children: label
					}, id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: ["Range", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: days,
						onChange: (e) => setDays(Number(e.target.value)),
						"aria-label": "Date range",
						className: "rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 1,
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 7,
								children: "Last 7 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 30,
								children: "Last 30 days"
							})
						]
					})]
				})]
			}),
			tab === "today" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-5 py-4 text-sm font-semibold",
					children: [
						"Currently clocked in (",
						onShift.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [onShift.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-8 text-center text-sm text-muted-foreground",
						children: "Nobody is on the clock right now."
					}), onShift.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: p.user_id,
									name: nameOf(p.user_id)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: p.project ?? "General"
								}),
								p.break_started_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-600",
									children: "On break"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								"In ",
								new Date(p.clock_in).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								}),
								" ·",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-foreground",
									children: [(punchSeconds(p, now) / 3600).toFixed(2), "h"]
								})
							]
						})]
					}, p.id))]
				})]
			}),
			tab === "timesheets" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-5 py-4 text-sm font-semibold",
						children: "Hours by person"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [perPerson.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-5 py-8 text-center text-sm text-muted-foreground",
							children: "No punches in this range."
						}), perPerson.map(([uid, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: uid,
								name: nameOf(uid)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: [(v.seconds / 3600).toFixed(2), "h"]
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"· ",
											v.shifts,
											" shifts"
										]
									})
								]
							})]
						}, uid))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border px-5 py-4 text-sm font-semibold",
						children: "Punch log"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[520px] divide-y divide-border overflow-auto",
						children: [punches.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: p.user_id,
									name: nameOf(p.user_id),
									size: "xs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: new Date(p.clock_in).toLocaleDateString()
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									new Date(p.clock_in).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit"
									}),
									" –",
									" ",
									p.clock_out ? new Date(p.clock_out).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit"
									}) : "ongoing",
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [(punchSeconds(p, now) / 3600).toFixed(2), "h"]
									})
								]
							})]
						}, p.id)), punches.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-5 py-8 text-center text-sm text-muted-foreground",
							children: "No punches in this range."
						})]
					})]
				})]
			}),
			tab === "leave" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-2xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border px-5 py-4 text-sm font-semibold",
					children: "Leave requests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [leaves.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-8 text-center text-sm text-muted-foreground",
						children: "No leave requests."
					}), leaves.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[220px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [l.user_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: l.user_id,
									name: nameOf(l.user_id),
									size: "xs"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Unassigned"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium capitalize",
									children: l.type
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									l.start_date,
									" → ",
									l.end_date,
									" · ",
									l.days ?? "—",
									" days",
									l.reason ? ` · ${l.reason}` : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full border px-2 py-0.5 text-[11px] capitalize ${STATUS_TONE[l.status ?? "pending"] ?? ""}`,
								children: l.status ?? "pending"
							}), (l.status ?? "pending") === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => decide(l, "approved"),
								"aria-label": "Approve request",
								className: "inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								}), " Approve"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => decide(l, "denied"),
								"aria-label": "Deny request",
								className: "inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								}), " Deny"]
							})] })]
						})]
					}, l.id))]
				})]
			})
		]
	});
}
//#endregion
export { AttendancePage as component };
