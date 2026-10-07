import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { $n as Clock, Bt as Mail, Yt as Link$1, c as Video, mr as Check, n as X, nr as CircleX, p as UserPlus, q as Search, rr as CircleQuestionMark, st as Plus, u as Users, vr as Calendar, x as Trash2, zt as MapPin } from "./_libs/lucide-react.mjs";
import { t as EscapeKey } from "./_ssr/EscapeKey-s0O3wTFo.mjs";
import { t as UserMention } from "./_ssr/UserMention-B7i_AS2Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.meetings-BfeDfzcB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toLocalInput(iso) {
	const d = new Date(iso);
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function MeetingsPage() {
	const [me, setMe] = (0, import_react.useState)(null);
	const [meetings, setMeetings] = (0, import_react.useState)([]);
	const [participants, setParticipants] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)({});
	const [allProfiles, setAllProfiles] = (0, import_react.useState)([]);
	const [extInvites, setExtInvites] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("upcoming");
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const [detailOpen, setDetailOpen] = (0, import_react.useState)(null);
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(() => {
		const now = /* @__PURE__ */ new Date();
		now.setMinutes(0);
		now.setSeconds(0);
		const end = new Date(now.getTime() + 36e5);
		return {
			title: "",
			description: "",
			starts_at: toLocalInput(now.toISOString()),
			ends_at: toLocalInput(end.toISOString()),
			location: "",
			color: "orange",
			teammates: [],
			externals: [],
			recurrence: "none",
			occurrences: 4
		};
	});
	const [teamSearch, setTeamSearch] = (0, import_react.useState)("");
	const [extEmail, setExtEmail] = (0, import_react.useState)("");
	const [extName, setExtName] = (0, import_react.useState)("");
	const load = async () => {
		const { data: u } = await supabase.auth.getUser();
		setMe(u.user?.id ?? null);
		const [{ data: m }, { data: pa }, { data: p }, { data: ei }] = await Promise.all([
			supabase.from("meetings").select("*").order("starts_at", { ascending: true }),
			supabase.from("meeting_participants").select("*"),
			supabase.from("profiles").select("id, full_name, email, department").order("full_name"),
			supabase.from("meeting_external_invites").select("*")
		]);
		setMeetings(m ?? []);
		setParticipants(pa ?? []);
		setAllProfiles(p ?? []);
		setExtInvites(ei ?? []);
		const map = {};
		(p ?? []).forEach((row) => {
			map[row.id] = row;
		});
		setProfiles(map);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		return meetings.filter((m) => {
			if (m.ended_at) return false;
			const end = new Date(m.ends_at);
			if (tab === "upcoming") return end >= now;
			if (tab === "past") return end < now;
			return m.host_id === me;
		});
	}, [
		meetings,
		tab,
		me
	]);
	const rsvpFor = (mid) => participants.find((p) => p.meeting_id === mid && p.user_id === me)?.rsvp;
	const attending = (mid) => participants.filter((p) => p.meeting_id === mid && p.rsvp !== "no");
	const setRsvp = async (mid, rsvp) => {
		if (!me) return;
		if (participants.find((p) => p.meeting_id === mid && p.user_id === me)) {
			await supabase.from("meeting_participants").update({ rsvp }).eq("meeting_id", mid).eq("user_id", me);
			setParticipants((prev) => prev.map((p) => p.meeting_id === mid && p.user_id === me ? {
				...p,
				rsvp
			} : p));
		} else {
			await supabase.from("meeting_participants").insert({
				meeting_id: mid,
				user_id: me,
				rsvp
			});
			setParticipants((prev) => [...prev, {
				meeting_id: mid,
				user_id: me,
				rsvp
			}]);
		}
	};
	const create = async (e) => {
		e.preventDefault();
		if (!me || !form.title.trim()) return;
		const startsIso = new Date(form.starts_at).toISOString();
		const endsIso = new Date(form.ends_at).toISOString();
		const stepDays = form.recurrence === "daily" ? 1 : form.recurrence === "weekly" ? 7 : form.recurrence === "biweekly" ? 14 : form.recurrence === "monthly" ? 0 : null;
		const total = form.recurrence === "none" ? 1 : Math.max(1, Math.min(24, form.occurrences));
		const occurrences = [];
		for (let i = 0; i < total; i++) {
			let s = new Date(startsIso);
			let en = new Date(endsIso);
			if (stepDays !== null && i > 0) {
				if (form.recurrence === "monthly") {
					s.setMonth(s.getMonth() + i);
					en.setMonth(en.getMonth() + i);
				} else {
					s.setDate(s.getDate() + stepDays * i);
					en.setDate(en.getDate() + stepDays * i);
				}
			}
			occurrences.push({
				starts: s.toISOString(),
				ends: en.toISOString()
			});
		}
		const inviteeIds = Array.from(/* @__PURE__ */ new Set([me, ...form.teammates]));
		for (const occ of occurrences) {
			const { data: mData, error } = await supabase.from("meetings").insert({
				title: form.title.trim(),
				description: form.description.trim() || null,
				host_id: me,
				starts_at: occ.starts,
				ends_at: occ.ends,
				location: form.location.trim() || null
			}).select().single();
			if (error || !mData) {
				alert(error?.message ?? "Failed");
				return;
			}
			if (inviteeIds.length) await supabase.from("meeting_participants").upsert(inviteeIds.map((uid) => ({
				meeting_id: mData.id,
				user_id: uid,
				rsvp: uid === me ? "yes" : "invited"
			})), { onConflict: "meeting_id,user_id" });
			const evPayload = inviteeIds.map((uid) => ({
				owner_id: uid,
				title: form.title.trim(),
				description: form.description.trim() || null,
				starts_at: occ.starts,
				ends_at: occ.ends,
				all_day: false,
				location: form.location.trim() || null,
				color: form.color,
				visibility: "private",
				meeting_id: mData.id
			}));
			if (evPayload.length) await supabase.from("calendar_events").insert(evPayload);
			if (form.externals.length) await supabase.from("meeting_external_invites").insert(form.externals.map((x) => ({
				meeting_id: mData.id,
				email: x.email,
				name: x.name || null,
				invited_by: me
			})));
		}
		setShowNew(false);
		setForm({
			title: "",
			description: "",
			starts_at: toLocalInput((/* @__PURE__ */ new Date()).toISOString()),
			ends_at: toLocalInput(new Date(Date.now() + 36e5).toISOString()),
			location: "",
			color: "orange",
			teammates: [],
			externals: [],
			recurrence: "none",
			occurrences: 4
		});
		load();
	};
	const remove = async (m) => {
		if (!confirm("Delete this meeting? It'll also be removed from attendees' calendars.")) return;
		await supabase.from("calendar_events").delete().eq("meeting_id", m.id);
		await supabase.from("meetings").delete().eq("id", m.id);
		setMeetings((prev) => prev.filter((x) => x.id !== m.id));
		setDetailOpen(null);
	};
	const copyLink = async (m, token) => {
		const host = window.location.hostname.toLowerCase();
		const base = `${host === "hq.clovrlab.com" || host === "clovrlab.com" || host === "www.clovrlab.com" ? window.location.origin : "https://hq.clovrlab.com"}/meeting/${m.id}`;
		const url = token ? `${base}?t=${token}` : base;
		await navigator.clipboard.writeText(url);
		setCopiedId(m.id + (token ?? ""));
		setTimeout(() => setCopiedId(null), 1500);
	};
	const filteredTeam = allProfiles.filter((p) => p.id !== me && (!teamSearch || (p.full_name ?? "").toLowerCase().includes(teamSearch.toLowerCase()) || (p.email ?? "").toLowerCase().includes(teamSearch.toLowerCase())));
	const addExternal = () => {
		const email = extEmail.trim().toLowerCase();
		if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
			alert("Enter a valid email");
			return;
		}
		if (form.externals.some((x) => x.email === email)) return;
		setForm({
			...form,
			externals: [...form.externals, {
				email,
				name: extName.trim()
			}]
		});
		setExtEmail("");
		setExtName("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
						children: "Communication · Meetings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight",
						children: "Meetings"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowNew(true),
					className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Schedule"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-1 rounded-lg border border-border bg-card p-1 text-sm w-fit",
				children: [
					"upcoming",
					"past",
					"mine"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: `rounded-md px-3 py-1.5 transition ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
					children: t === "mine" ? "Hosted by me" : t.charAt(0).toUpperCase() + t.slice(1)
				}, t))
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed border-border p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "No meetings to show."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: filtered.map((m) => {
					const rsvp = rsvpFor(m.id);
					const host = profiles[m.host_id]?.full_name || profiles[m.host_id]?.email || "Someone";
					const start = new Date(m.starts_at);
					const end = new Date(m.ends_at);
					const isPast = end < /* @__PURE__ */ new Date();
					const attendees = attending(m.id);
					const externals = extInvites.filter((x) => x.meeting_id === m.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl border border-border bg-card p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								role: "button",
								tabIndex: 0,
								onClick: () => setDetailOpen(m),
								onKeyDown: (e) => {
									if (e.key === "Enter") setDetailOpen(m);
								},
								className: "min-w-0 flex-1 cursor-pointer text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }),
											start.toLocaleDateString([], {
												weekday: "short",
												month: "short",
												day: "numeric"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
											start.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											}),
											"–",
											end.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 text-lg font-semibold",
										children: m.title
									}),
									m.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground line-clamp-2",
										children: m.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: ["Hosted by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
													userId: m.host_id,
													name: host
												})]
											}),
											m.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
													" ",
													m.location
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }),
													attendees.length,
													" teammate",
													attendees.length === 1 ? "" : "s"
												]
											}),
											externals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
													externals.length,
													" guest",
													externals.length === 1 ? "" : "s"
												]
											})
										]
									}),
									(attendees.length > 0 || externals.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-1",
										onClick: (e) => e.stopPropagation(),
										children: [
											attendees.slice(0, 8).map((p) => {
												const prof = profiles[p.user_id];
												const name = prof?.full_name || prof?.email || "Unknown";
												const tone = p.rsvp === "yes" ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20" : p.rsvp === "no" ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20" : p.rsvp === "maybe" ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20" : "border-border bg-muted/50 text-muted-foreground hover:bg-muted";
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
													userId: p.user_id,
													name,
													tone
												}, p.user_id);
											}),
											attendees.length > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"+",
													attendees.length - 8,
													" more"
												]
											}),
											externals.slice(0, 4).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground",
												title: `Guest · ${x.email}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-2.5 w-2.5" }),
													x.name || x.email,
													x.joined_at ? " ✓" : ""
												]
											}, x.id))
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-2",
								children: [
									!isPast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/meeting/$id",
										params: { id: m.id },
										className: "flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3 w-3" }), " Join room"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => copyLink(m),
										className: "flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted",
										children: [copiedId === m.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, { className: "h-3 w-3" }), "Copy link"]
									}),
									!isPast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1",
										children: [
											["yes", Check],
											["maybe", CircleQuestionMark],
											["no", CircleX]
										].map(([k, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setRsvp(m.id, k),
											className: `rounded-md border p-1.5 text-xs transition ${rsvp === k ? k === "yes" ? "border-green-500 bg-green-500/10 text-green-500" : k === "no" ? "border-destructive bg-destructive/10 text-destructive" : "border-yellow-500 bg-yellow-500/10 text-yellow-500" : "border-border hover:bg-muted"}`,
											"aria-label": k,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
										}, k))
									}),
									m.host_id === me && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": "Delete",
										onClick: () => remove(m),
										className: "rounded p-1 text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})]
						})
					}, m.id);
				})
			}),
			detailOpen && (() => {
				const m = detailOpen;
				const attendees = participants.filter((p) => p.meeting_id === m.id);
				const externals = extInvites.filter((x) => x.meeting_id === m.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
					onClick: () => setDetailOpen(null),
					role: "dialog",
					"aria-modal": "true",
					"aria-label": "Meeting details",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setDetailOpen(null) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "dialog",
						"aria-modal": "true",
						className: "w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl",
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold",
									children: m.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: new Date(m.starts_at).toLocaleString([], {
										dateStyle: "medium",
										timeStyle: "short"
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDetailOpen(null),
									className: "rounded p-1 hover:bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})]
							}),
							m.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-sm text-muted-foreground",
								children: m.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Teammates"
								}), attendees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Just the host."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-1",
									children: attendees.map((p) => {
										const nm = profiles[p.user_id]?.full_name || profiles[p.user_id]?.email || "Unknown";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
												userId: p.user_id,
												name: nm
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase tracking-wider text-muted-foreground",
												children: p.rsvp
											})]
										}, p.user_id);
									})
								})]
							}),
							externals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "External guests"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-1",
									children: externals.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 truncate",
											children: [
												x.name ? `${x.name} · ` : "",
												x.email,
												x.joined_at ? " ✓" : ""
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => copyLink(m, x.token),
											className: "shrink-0 rounded border border-border px-2 py-0.5 text-[10px] hover:bg-muted",
											children: copiedId === m.id + x.token ? "Copied" : "Copy guest link"
										})]
									}, x.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => copyLink(m),
									className: "rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted",
									children: copiedId === m.id ? "Copied" : "Copy team link"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/meeting/$id",
									params: { id: m.id },
									className: "rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground",
									children: "Join room"
								})]
							})
						]
					})]
				});
			})(),
			showNew && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
				onClick: () => setShowNew(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "New meeting",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setShowNew(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: create,
					className: "max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Schedule meeting"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowNew(false),
								className: "rounded p-1 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "Meeting title",
									required: true,
									autoFocus: true,
									placeholder: "Meeting title",
									value: form.title,
									onChange: (e) => setForm({
										...form,
										title: e.target.value
									}),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									"aria-label": "Agenda / description",
									placeholder: "Agenda / description",
									rows: 2,
									value: form.description,
									onChange: (e) => setForm({
										...form,
										description: e.target.value
									}),
									className: "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
										children: "Starts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Starts",
										required: true,
										type: "datetime-local",
										value: form.starts_at,
										onChange: (e) => setForm({
											...form,
											starts_at: e.target.value
										}),
										className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
										children: "Ends"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Ends",
										required: true,
										type: "datetime-local",
										value: form.ends_at,
										onChange: (e) => setForm({
											...form,
											ends_at: e.target.value
										}),
										className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "Location (optional)",
									placeholder: "Location (optional)",
									value: form.location,
									onChange: (e) => setForm({
										...form,
										location: e.target.value
									}),
									className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
										children: "Repeats"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										"aria-label": "Repeats",
										value: form.recurrence,
										onChange: (e) => setForm({
											...form,
											recurrence: e.target.value
										}),
										className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "none",
												children: "Does not repeat"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "daily",
												children: "Daily"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "weekly",
												children: "Weekly"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "biweekly",
												children: "Every 2 weeks"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "monthly",
												children: "Monthly"
											})
										]
									})] }), form.recurrence !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs uppercase tracking-wider text-muted-foreground",
										children: "Occurrences (max 24)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": "Occurrences (max 24)",
										type: "number",
										min: 1,
										max: 24,
										value: form.occurrences,
										onChange: (e) => setForm({
											...form,
											occurrences: Math.max(1, Math.min(24, Number(e.target.value) || 1))
										}),
										className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1 flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3 w-3" }), " Invite teammates"]
									}),
									form.teammates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 flex flex-wrap gap-1",
										children: form.teammates.map((tid) => {
											const p = allProfiles.find((x) => x.id === tid);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary",
												children: [p?.full_name || p?.email || "Unknown", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setForm({
														...form,
														teammates: form.teammates.filter((x) => x !== tid)
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
												})]
											}, tid);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: teamSearch,
											onChange: (e) => setTeamSearch(e.target.value),
											placeholder: "Search teammates…",
											className: "w-full rounded-lg border border-border bg-background pl-7 pr-2 py-2 text-sm outline-none focus:border-primary"
										})]
									}),
									teamSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-background",
										children: filteredTeam.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "p-2 text-xs text-muted-foreground",
											children: "No matches."
										}) : filteredTeam.map((p) => {
											const already = form.teammates.includes(p.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: already,
												onClick: () => {
													setForm({
														...form,
														teammates: [...form.teammates, p.id]
													});
													setTeamSearch("");
												},
												className: "flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.full_name || p.email }), p.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground",
													children: p.department
												})]
											}, p.id);
										})
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mb-1 flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), " Invite external guests"]
									}),
									form.externals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 flex flex-wrap gap-1",
										children: form.externals.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs",
											children: [
												x.name ? `${x.name} · ` : "",
												x.email,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setForm({
														...form,
														externals: form.externals.filter((y) => y.email !== x.email)
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
												})
											]
										}, x.email))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: extName,
												onChange: (e) => setExtName(e.target.value),
												placeholder: "Name (optional)",
												className: "w-32 rounded-lg border border-border bg-background px-2 py-2 text-sm outline-none focus:border-primary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: extEmail,
												onChange: (e) => setExtEmail(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														addExternal();
													}
												},
												placeholder: "guest@example.com",
												className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: addExternal,
												className: "rounded-lg border border-border px-3 text-sm hover:bg-muted",
												children: "Add"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[10px] text-muted-foreground",
										children: "Guests get a unique join link (copy it from the meeting after saving)."
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowNew(false),
								className: "rounded-lg border border-border px-4 py-2 text-sm",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
								children: "Schedule"
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { MeetingsPage as component };
