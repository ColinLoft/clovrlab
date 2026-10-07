import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B7QlDyqv.mjs";
import { $n as Clock, O as StickyNote, c as Video, d as User, dr as ChevronRight, fr as ChevronLeft, n as X, st as Plus, u as Users, vr as Calendar, x as Trash2, zt as MapPin } from "./_libs/lucide-react.mjs";
import { t as EscapeKey } from "./_ssr/EscapeKey-s0O3wTFo.mjs";
import { t as UserMention } from "./_ssr/UserMention-D5WbdqmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.calendar-BO0gYFgh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"orange",
	"blue",
	"green",
	"purple",
	"pink",
	"red"
];
var COLOR_STYLES = {
	orange: "bg-orange-500/20 text-orange-500 border-orange-500/40",
	blue: "bg-blue-500/20 text-blue-500 border-blue-500/40",
	green: "bg-green-500/20 text-green-500 border-green-500/40",
	purple: "bg-purple-500/20 text-purple-500 border-purple-500/40",
	pink: "bg-pink-500/20 text-pink-500 border-pink-500/40",
	red: "bg-red-500/20 text-red-500 border-red-500/40"
};
function toLocalInput(iso) {
	const d = new Date(iso);
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function startOfMonth(d) {
	return new Date(d.getFullYear(), d.getMonth(), 1);
}
function daysInMonth(d) {
	return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
function sameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatDuration(startIso, endIso, allDay) {
	if (allDay) return "All day";
	const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
	if (ms <= 0) return "";
	const mins = Math.round(ms / 6e4);
	if (mins < 60) return `${mins} min`;
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return m ? `${h}h ${m}m` : `${h}h`;
}
function CalendarPage() {
	const [me, setMe] = (0, import_react.useState)(null);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [meetingsMeta, setMeetingsMeta] = (0, import_react.useState)({});
	const [cursor, setCursor] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [selectedDay, setSelectedDay] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)({});
	const load = async () => {
		const { data: u } = await supabase.auth.getUser();
		setMe(u.user?.id ?? null);
		const { data } = await supabase.from("calendar_events").select("*").order("starts_at", { ascending: true });
		const evs = data ?? [];
		setEvents(evs);
		const mIds = Array.from(new Set(evs.map((e) => e.meeting_id).filter(Boolean)));
		if (mIds.length) {
			const [{ data: mts }, { data: parts }, { data: notes }] = await Promise.all([
				supabase.from("meetings").select("id, host_id").in("id", mIds),
				supabase.from("meeting_participants").select("meeting_id, user_id").in("meeting_id", mIds),
				supabase.from("meeting_notes").select("meeting_id, body, content_md").in("meeting_id", mIds)
			]);
			const hostIds = (mts ?? []).map((m) => m.host_id);
			const partUserIds = (parts ?? []).map((p) => p.user_id);
			const profileIds = Array.from(/* @__PURE__ */ new Set([...hostIds, ...partUserIds]));
			const { data: profs } = profileIds.length ? await supabase.from("profiles").select("id, full_name, email").in("id", profileIds) : { data: [] };
			const nameMap = /* @__PURE__ */ new Map();
			(profs ?? []).forEach((h) => nameMap.set(h.id, h.full_name || h.email || "Someone"));
			const counts = /* @__PURE__ */ new Map();
			const names = /* @__PURE__ */ new Map();
			(parts ?? []).forEach((p) => {
				counts.set(p.meeting_id, (counts.get(p.meeting_id) ?? 0) + 1);
				const arr = names.get(p.meeting_id) ?? [];
				arr.push({
					id: p.user_id,
					name: nameMap.get(p.user_id) ?? "Someone"
				});
				names.set(p.meeting_id, arr);
			});
			const noteMap = /* @__PURE__ */ new Map();
			(notes ?? []).forEach((n) => {
				const preview = (n.content_md || n.body || "").replace(/[#*_>`\-]/g, "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 3).join(" · ");
				noteMap.set(n.meeting_id, preview.slice(0, 220));
			});
			const meta = {};
			(mts ?? []).forEach((m) => {
				meta[m.id] = {
					id: m.id,
					host_id: m.host_id,
					host_name: nameMap.get(m.host_id) ?? null,
					attendee_count: counts.get(m.id) ?? 0,
					attendees: names.get(m.id) ?? [],
					note_preview: noteMap.get(m.id) ?? null
				};
			});
			setMeetingsMeta(meta);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const monthStart = startOfMonth(cursor);
	const monthDays = daysInMonth(cursor);
	const firstDow = monthStart.getDay();
	const cells = [];
	for (let i = 0; i < firstDow; i++) cells.push(null);
	for (let d = 1; d <= monthDays; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
	while (cells.length % 7 !== 0) cells.push(null);
	const eventsByDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const e of events) {
			const key = new Date(e.starts_at).toDateString();
			const arr = map.get(key) ?? [];
			arr.push(e);
			map.set(key, arr);
		}
		return map;
	}, [events]);
	const openNew = (day) => {
		const d = day ?? /* @__PURE__ */ new Date();
		d.setHours(9, 0, 0, 0);
		const end = new Date(d.getTime() + 36e5);
		setDraft({
			title: "",
			description: "",
			starts_at: d.toISOString(),
			ends_at: end.toISOString(),
			all_day: false,
			location: "",
			color: "orange",
			visibility: "private"
		});
		setShowForm(true);
	};
	const save = async () => {
		if (!me || !draft.title?.trim()) return;
		const payload = {
			title: draft.title.trim(),
			description: draft.description?.trim() || null,
			starts_at: draft.starts_at,
			ends_at: draft.ends_at,
			all_day: !!draft.all_day,
			location: draft.location?.trim() || null,
			color: draft.color ?? "orange",
			visibility: draft.visibility ?? "private"
		};
		if (draft.id) {
			const { data } = await supabase.from("calendar_events").update(payload).eq("id", draft.id).select().single();
			if (data) setEvents((prev) => prev.map((e) => e.id === draft.id ? data : e));
		} else {
			const { data, error } = await supabase.from("calendar_events").insert({
				...payload,
				owner_id: me
			}).select().single();
			if (error) {
				alert(error.message);
				return;
			}
			if (data) setEvents((prev) => [...prev, data]);
		}
		setShowForm(false);
	};
	const remove = async (e) => {
		if (!confirm("Delete event?")) return;
		await supabase.from("calendar_events").delete().eq("id", e.id);
		setEvents((prev) => prev.filter((x) => x.id !== e.id));
		setShowForm(false);
	};
	const today = /* @__PURE__ */ new Date();
	const dayEvents = selectedDay ? eventsByDay.get(selectedDay.toDateString()) ?? [] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full w-full max-w-7xl gap-4 px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-1 flex-col rounded-xl border border-border bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl font-semibold",
								children: cursor.toLocaleDateString([], {
									month: "long",
									year: "numeric"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Previous",
									onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)),
									className: "rounded-lg border border-border p-1.5 hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCursor(/* @__PURE__ */ new Date()),
									className: "rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted",
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Next",
									onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)),
									className: "rounded-lg border border-border p-1.5 hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openNew(selectedDay ?? /* @__PURE__ */ new Date()),
									className: "ml-2 flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Event"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 border-b border-border bg-muted/30 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: [
							"Sun",
							"Mon",
							"Tue",
							"Wed",
							"Thu",
							"Fri",
							"Sat"
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-2",
							children: d
						}, d))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid flex-1 grid-cols-7 grid-rows-6 gap-px bg-border/40",
						children: cells.map((day, i) => {
							if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-card/40" }, i);
							const isToday = sameDay(day, today);
							const isSelected = selectedDay && sameDay(day, selectedDay);
							const es = eventsByDay.get(day.toDateString()) ?? [];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelectedDay(day),
								onDoubleClick: () => openNew(day),
								className: `flex flex-col items-start gap-1 bg-card p-1.5 text-left transition hover:bg-muted/40 ${isSelected ? "ring-2 ring-primary ring-inset" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs ${isToday ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground" : "text-muted-foreground"}`,
									children: day.getDate()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full flex-col gap-0.5 overflow-hidden",
									children: [es.slice(0, 3).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex items-center gap-1 truncate rounded border px-1 py-0.5 text-[10px] ${COLOR_STYLES[e.color] ?? COLOR_STYLES.orange}`,
										children: [e.meeting_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-2.5 w-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate",
											children: [!e.all_day && `${new Date(e.starts_at).toLocaleTimeString([], {
												hour: "numeric",
												minute: "2-digit"
											})} `, e.title]
										})]
									}, e.id)), es.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground",
										children: [
											"+",
											es.length - 3,
											" more"
										]
									})]
								})]
							}, i);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex w-80 shrink-0 flex-col rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold uppercase tracking-wider",
						children: selectedDay ? selectedDay.toLocaleDateString([], {
							weekday: "long",
							month: "long",
							day: "numeric"
						}) : "Upcoming"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: selectedDay ? "Events on this day" : "Next 5 events"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-2 overflow-y-auto p-4",
					children: [(selectedDay ? dayEvents : events.filter((e) => new Date(e.ends_at) >= today).slice(0, 8)).map((e) => {
						const meta = e.meeting_id ? meetingsMeta[e.meeting_id] : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "button",
							tabIndex: 0,
							onClick: () => {
								setDraft(e);
								setShowForm(true);
							},
							onKeyDown: (ev) => {
								if (ev.key === "Enter") {
									setDraft(e);
									setShowForm(true);
								}
							},
							className: `block w-full cursor-pointer rounded-lg border p-3 text-left transition hover:shadow ${COLOR_STYLES[e.color] ?? COLOR_STYLES.orange}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [e.meeting_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: e.title
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 flex items-center gap-1 text-xs opacity-80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
										e.all_day ? "All day" : `${new Date(e.starts_at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})}–${new Date(e.ends_at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})}`,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] opacity-70",
											children: ["· ", formatDuration(e.starts_at, e.ends_at, e.all_day)]
										})
									]
								}),
								meta?.host_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 flex flex-wrap items-center gap-1 text-xs opacity-80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }),
										" Host: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
											userId: meta.host_id,
											name: meta.host_name
										})
									]
								}),
								meta && meta.attendee_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 flex items-center gap-1 text-xs opacity-80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
										" ",
										meta.attendee_count,
										" attendee",
										meta.attendee_count === 1 ? "" : "s"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap gap-1",
									onClick: (e) => e.stopPropagation(),
									children: [meta.attendees.slice(0, 6).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
										userId: a.id,
										name: a.name,
										size: "xs"
									}, a.id)), meta.attendees.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] opacity-70",
										children: ["+", meta.attendees.length - 6]
									})]
								})] }),
								e.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 flex items-center gap-1 text-xs opacity-80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
										" ",
										e.location
									]
								}),
								e.description && !meta?.note_preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-xs opacity-70",
									children: e.description
								}),
								meta?.note_preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 rounded-md border border-current/20 bg-background/40 p-2 text-[11px] opacity-90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider opacity-70",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-2.5 w-2.5" }), " Notes preview"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "line-clamp-3",
										children: meta.note_preview
									})]
								}),
								e.visibility === "team" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[10px] uppercase tracking-wider opacity-70",
									children: "Team-wide"
								})
							]
						}, e.id);
					}), (selectedDay ? dayEvents : events).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "No events. Click a date or \"Event\" to create one."
					})]
				})]
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
				onClick: () => setShowForm(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "New event",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setShowForm(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: draft.id ? "Edit event" : "New event"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowForm(false),
								className: "rounded p-1 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "Event title",
									autoFocus: true,
									placeholder: "Event title",
									value: draft.title ?? "",
									onChange: (e) => setDraft({
										...draft,
										title: e.target.value
									}),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									"aria-label": "Description (optional)",
									placeholder: "Description (optional)",
									rows: 2,
									value: draft.description ?? "",
									onChange: (e) => setDraft({
										...draft,
										description: e.target.value
									}),
									className: "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: !!draft.all_day,
										onChange: (e) => setDraft({
											...draft,
											all_day: e.target.checked
										})
									}), " All day"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
										children: "Starts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Starts",
										type: "datetime-local",
										value: draft.starts_at ? toLocalInput(draft.starts_at) : "",
										onChange: (e) => setDraft({
											...draft,
											starts_at: new Date(e.target.value).toISOString()
										}),
										className: "w-full rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-primary"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
										children: "Ends"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Ends",
										type: "datetime-local",
										value: draft.ends_at ? toLocalInput(draft.ends_at) : "",
										onChange: (e) => setDraft({
											...draft,
											ends_at: new Date(e.target.value).toISOString()
										}),
										className: "w-full rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-primary"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "Location (optional)",
									placeholder: "Location (optional)",
									value: draft.location ?? "",
									onChange: (e) => setDraft({
										...draft,
										location: e.target.value
									}),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
									children: "Color"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setDraft({
											...draft,
											color: c
										}),
										className: `h-7 w-7 rounded-full border-2 transition ${COLOR_STYLES[c]} ${draft.color === c ? "ring-2 ring-offset-2 ring-offset-card" : ""}`,
										"aria-label": c
									}, c))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
									children: "Visibility"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Visibility",
									value: draft.visibility ?? "private",
									onChange: (e) => setDraft({
										...draft,
										visibility: e.target.value
									}),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "private",
										children: "Private (just me)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "team",
										children: "Team-wide"
									})]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-between gap-2",
							children: [draft.id && draft.owner_id === me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Delete",
								onClick: () => remove(draft),
								className: "rounded-lg border border-destructive/30 p-2 text-destructive hover:bg-destructive/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowForm(false),
									className: "rounded-lg border border-border px-4 py-2 text-sm",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: save,
									className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
									children: "Save"
								})]
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { CalendarPage as component };
