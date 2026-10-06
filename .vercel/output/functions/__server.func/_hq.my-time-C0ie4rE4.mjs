import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, Ht as LogOut, S as Timer, lt as Play, st as Plus, vt as Pause, xr as CalendarDays } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_ssr/notify-Cokq0_dZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.my-time-C0ie4rE4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLANNED_WEEKLY = 40;
function hms(totalSeconds) {
	const s = Math.max(0, Math.floor(totalSeconds));
	return {
		h: String(Math.floor(s / 3600)).padStart(2, "0"),
		m: String(Math.floor(s % 3600 / 60)).padStart(2, "0"),
		sec: String(s % 60).padStart(2, "0")
	};
}
function punchSeconds(p, now) {
	const gross = ((p.clock_out ? new Date(p.clock_out).getTime() : now) - new Date(p.clock_in).getTime()) / 1e3;
	let breakSec = Number(p.break_minutes || 0) * 60;
	if (!p.clock_out && p.break_started_at) breakSec += (now - new Date(p.break_started_at).getTime()) / 1e3;
	return Math.max(0, gross - breakSec);
}
function startOfWeek(d = /* @__PURE__ */ new Date()) {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	x.setDate(x.getDate() - x.getDay());
	return x;
}
var LEAVE_TYPES = [
	"vacation",
	"sick",
	"personal",
	"bereavement",
	"parental",
	"unpaid"
];
var STATUS_TONE = {
	pending: "border-amber-500/20 bg-amber-500/10 text-amber-600",
	approved: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
	denied: "border-destructive/20 bg-destructive/10 text-destructive",
	cancelled: "border-border bg-muted/40 text-muted-foreground"
};
function MyTimePage() {
	const [userId, setUserId] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("");
	const [punches, setPunches] = (0, import_react.useState)([]);
	const [leaves, setLeaves] = (0, import_react.useState)([]);
	const [project, setProject] = (0, import_react.useState)("");
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [showLeave, setShowLeave] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, []);
	const load = (0, import_react.useCallback)(async (uid) => {
		const since = /* @__PURE__ */ new Date();
		since.setDate(since.getDate() - 30);
		const [{ data: p }, { data: l }] = await Promise.all([supabase.from("hr_time_clock").select("*").eq("user_id", uid).gte("clock_in", since.toISOString()).order("clock_in", { ascending: false }), supabase.from("hr_time_off").select("id, type, start_date, end_date, days, status, reason").eq("user_id", uid).order("start_date", { ascending: false }).limit(20)]);
		setPunches(p ?? []);
		setLeaves(l ?? []);
	}, []);
	(0, import_react.useEffect)(() => {
		let live = true;
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			const uid = u.user?.id;
			if (!uid || !live) return;
			setUserId(uid);
			const { data: prof } = await supabase.from("profiles").select("full_name, department").eq("id", uid).maybeSingle();
			if (!live) return;
			setName(prof?.full_name ?? u.user?.email ?? "there");
			setRole(prof?.department ?? "Team member");
			await load(uid);
		})();
		return () => {
			live = false;
		};
	}, [load]);
	const active = punches.find((p) => !p.clock_out) ?? null;
	const activeSeconds = active ? punchSeconds(active, now) : 0;
	const onBreak = !!active?.break_started_at;
	const weekSeconds = (0, import_react.useMemo)(() => {
		const ws = startOfWeek().getTime();
		return punches.filter((p) => new Date(p.clock_in).getTime() >= ws).reduce((s, p) => s + punchSeconds(p, now), 0);
	}, [punches, now]);
	const daysThisWeek = (0, import_react.useMemo)(() => {
		const ws = startOfWeek().getTime();
		return new Set(punches.filter((p) => new Date(p.clock_in).getTime() >= ws).map((p) => new Date(p.clock_in).toDateString())).size;
	}, [punches]);
	const byDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of punches) {
			const k = new Date(p.clock_in).toDateString();
			map.set(k, [...map.get(k) ?? [], p]);
		}
		return Array.from(map.entries()).slice(0, 7);
	}, [punches]);
	async function clockIn() {
		if (!userId || busy) return;
		setBusy(true);
		const { error } = await supabase.from("hr_time_clock").insert({
			user_id: userId,
			project: project || null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Clocked in");
		load(userId);
	}
	async function toggleBreak() {
		if (!active || !userId || busy) return;
		setBusy(true);
		const patch = active.break_started_at ? {
			break_started_at: null,
			break_minutes: Number(active.break_minutes || 0) + (Date.now() - new Date(active.break_started_at).getTime()) / 6e4
		} : { break_started_at: (/* @__PURE__ */ new Date()).toISOString() };
		const { error } = await supabase.from("hr_time_clock").update(patch).eq("id", active.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		load(userId);
	}
	async function clockOut() {
		if (!active || !userId || busy) return;
		setBusy(true);
		const extra = active.break_started_at ? (Date.now() - new Date(active.break_started_at).getTime()) / 6e4 : 0;
		const worked = punchSeconds(active, Date.now()) / 3600;
		const { error } = await supabase.from("hr_time_clock").update({
			clock_out: (/* @__PURE__ */ new Date()).toISOString(),
			break_started_at: null,
			break_minutes: Number(active.break_minutes || 0) + extra
		}).eq("id", active.id);
		if (!error) await supabase.from("hr_time_entries").insert({
			user_id: userId,
			entry_date: new Date(active.clock_in).toISOString().slice(0, 10),
			hours: Number(worked.toFixed(2)),
			project: active.project ?? "General",
			task: "Clocked shift",
			billable: true,
			created_by: userId
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(`Clocked out — ${worked.toFixed(2)} h logged`);
		load(userId);
	}
	const t = hms(activeSeconds);
	const weekPct = Math.min(100, weekSeconds / 3600 / PLANNED_WEEKLY * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-[1600px] px-6 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: "People & Operations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: ["Welcome, ", name]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							role,
							" · ",
							(/* @__PURE__ */ new Date()).toLocaleString(void 0, {
								dateStyle: "medium",
								timeStyle: "short"
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowLeave(true),
					className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), " Request leave"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center gap-2 border-b border-border pb-3 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
									className: "h-4 w-4 text-primary",
									"aria-hidden": "true"
								}), " Clock-in"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
										children: active ? onBreak ? "On break" : "Ongoing" : "Not clocked in"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-mono text-4xl font-semibold tabular-nums",
										children: [
											t.h,
											":",
											t.m,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [":", t.sec]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex justify-center gap-2",
										children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: toggleBreak,
											disabled: busy,
											className: "inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50",
											children: [onBreak ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}), onBreak ? "Resume" : "Break"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: clockOut,
											disabled: busy,
											className: "inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}), " Clock-out"]
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: clockIn,
											disabled: busy,
											className: "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}), " Clock in"]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 border-t border-border pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "mytime-project",
									className: "text-xs font-medium text-muted-foreground",
									children: "Job / project (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "mytime-project",
									value: active?.project ?? project,
									onChange: (e) => setProject(e.target.value),
									disabled: !!active,
									placeholder: "What are you working on…",
									className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm disabled:opacity-60"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center gap-2 border-b border-border pb-3 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									className: "h-4 w-4 text-primary",
									"aria-hidden": "true"
								}), " Planned hours"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Total hours (weekly)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-3xl font-semibold",
								children: [PLANNED_WEEKLY, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-base text-muted-foreground",
									children: "hrs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-muted-foreground",
								children: "Days worked this week"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-3xl font-semibold",
								children: [daysThisWeek, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-base text-muted-foreground",
									children: "days"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground",
								children: "Each employee should complete their weekly planned hours."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2 border-b border-border pb-3 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
								className: "h-4 w-4 text-primary",
								"aria-hidden": "true"
							}), " Worked hours"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-muted/40 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Total hours (this week)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-4xl font-semibold tabular-nums",
									children: [
										Math.floor(weekSeconds / 3600),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base text-muted-foreground",
											children: "hrs"
										}),
										" ",
										Math.floor(weekSeconds % 3600 / 60),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base text-muted-foreground",
											children: "mins"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 h-2 w-full overflow-hidden rounded-full bg-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-primary",
										style: { width: `${weekPct}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [weekPct.toFixed(0), "% of planned"]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-2xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "My timesheets"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Last 7 worked days"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [byDay.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-8 text-center text-sm text-muted-foreground",
						children: "No shifts recorded yet."
					}), byDay.map(([day, items]) => {
						const total = items.reduce((s, p) => s + punchSeconds(p, now), 0);
						const first = items[items.length - 1];
						const last = items[0];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: new Date(day).toLocaleDateString(void 0, {
										weekday: "long",
										month: "short",
										day: "numeric"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: ["Duration: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [(total / 3600).toFixed(2), "h"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["In ", new Date(first.clock_in).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 flex-1 overflow-hidden rounded-full bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-primary",
											style: { width: `${Math.min(100, total / 3600 / 8 * 100)}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: last.clock_out ? `Out ${new Date(last.clock_out).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit"
									})}` : "Ongoing" })
								]
							})]
						}, day);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-2xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
							className: "h-4 w-4 text-primary",
							"aria-hidden": "true"
						}), " My leave requests"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowLeave(true),
						className: "text-xs font-medium text-primary hover:underline",
						children: "New request"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [leaves.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-8 text-center text-sm text-muted-foreground",
						children: "No leave requests yet."
					}), leaves.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium capitalize",
							children: l.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								l.start_date,
								" → ",
								l.end_date,
								" · ",
								l.days ?? "—",
								" days"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full border px-2 py-0.5 text-[11px] capitalize ${STATUS_TONE[l.status ?? "pending"] ?? ""}`,
							children: l.status ?? "pending"
						})]
					}, l.id))]
				})]
			}),
			showLeave && userId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveDialog, {
				userId,
				onClose: () => setShowLeave(false),
				onSaved: () => {
					setShowLeave(false);
					load(userId);
				}
			})
		]
	});
}
function LeaveDialog({ userId, onClose, onSaved }) {
	const [type, setType] = (0, import_react.useState)("vacation");
	const [start, setStart] = (0, import_react.useState)("");
	const [end, setEnd] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const days = (0, import_react.useMemo)(() => {
		if (!start || !end) return 0;
		const d = (new Date(end).getTime() - new Date(start).getTime()) / 864e5 + 1;
		return d > 0 ? d : 0;
	}, [start, end]);
	async function submit() {
		if (!start || !end) return toast.error("Pick a start and end date");
		setSaving(true);
		const { error } = await supabase.from("hr_time_off").insert({
			user_id: userId,
			type,
			start_date: start,
			end_date: end,
			days,
			reason: reason || null,
			status: "pending",
			created_by: userId
		});
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Leave request submitted");
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Request leave",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold",
					children: "Request leave"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "leave-type",
							className: "text-xs font-medium text-muted-foreground",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "leave-type",
							value: type,
							onChange: (e) => setType(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm capitalize",
							children: LEAVE_TYPES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v,
								children: v
							}, v))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "leave-start",
								className: "text-xs font-medium text-muted-foreground",
								children: "Start"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "leave-start",
								type: "date",
								value: start,
								onChange: (e) => setStart(e.target.value),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "leave-end",
								className: "text-xs font-medium text-muted-foreground",
								children: "End"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "leave-end",
								type: "date",
								value: end,
								onChange: (e) => setEnd(e.target.value),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								days,
								" day",
								days === 1 ? "" : "s",
								" requested"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "leave-reason",
							className: "text-xs font-medium text-muted-foreground",
							children: "Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "leave-reason",
							value: reason,
							onChange: (e) => setReason(e.target.value),
							rows: 3,
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: submit,
						disabled: saving,
						className: "rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
						children: "Submit"
					})]
				})
			]
		})
	});
}
//#endregion
export { MyTimePage as component };
