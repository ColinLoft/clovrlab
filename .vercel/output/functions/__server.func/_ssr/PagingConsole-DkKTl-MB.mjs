import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./client-B7QlDyqv.mjs";
import { Bt as Mail, C as Ticket, F as Smartphone, Hn as ExternalLink, L as Siren, Mr as BellRing, Nr as BellOff, Ot as MonitorSmartphone, Yn as Copy, cr as CircleCheck, it as Radio, mr as Check, nn as KeyRound, nt as RefreshCw, or as CircleMinus, s as Volume2, st as Plus, u as Users, v as TriangleAlert, x as Trash2 } from "../_libs/lucide-react.mjs";
import { E as usePeople, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, s as Modal, v as dt } from "./kit-L_nfYwfF.mjs";
import { a as stopSound, r as playSiren } from "./phone-C2YDgJKw.mjs";
import { _ as removeRotationMember, a as addRotationMember, b as saveTicket, c as deleteRotation, d as fetchPages, f as fetchRotationMembers, g as raisePage, h as fetchTickets, i as ackPage, l as fetchDeliveries, m as fetchTicketNotes, n as QUEUE_LABEL, o as addTicketNote, p as fetchRotations, r as TICKET_STATUSES, s as createTicket, t as QUEUE_KINDS, v as resolvePage, y as saveRotation } from "./paging-n8EiY-Tn.mjs";
import { t as UserMention } from "./UserMention-D5WbdqmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PagingConsole-DkKTl-MB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* ntfy.sh push notifications for on-call paging.
*
* Every operator gets a private, hard-to-guess topic. They subscribe to it in
* the ntfy app (iOS / Android) or the ntfy web app, and the paging worker
* publishes urgent pages straight to that topic.
*/
var NTFY_SERVER = "https://ntfy.sh";
function topicUrl(topic) {
	return `${NTFY_SERVER}/${topic}`;
}
function randomTopic() {
	const bytes = /* @__PURE__ */ new Uint8Array(12);
	(globalThis.crypto ?? window.crypto).getRandomValues(bytes);
	return `clovr-oncall-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}
/** Read this operator's topic, if they already have one. */
async function getMyTopic() {
	const { data: auth } = await supabase.auth.getUser();
	const uid = auth.user?.id;
	if (!uid) return null;
	const { data } = await supabase.from("push_topics").select("topic").eq("user_id", uid).maybeSingle();
	return data?.topic ?? null;
}
/** Read or create this operator's topic. */
async function ensureMyTopic() {
	const existing = await getMyTopic();
	if (existing) return existing;
	const { data: auth } = await supabase.auth.getUser();
	const uid = auth.user?.id;
	if (!uid) return null;
	const topic = randomTopic();
	const { data, error } = await supabase.from("push_topics").upsert({
		user_id: uid,
		topic
	}, { onConflict: "user_id" }).select("topic").maybeSingle();
	if (error) throw error;
	return data?.topic ?? topic;
}
/** Issue a brand new topic (old subscriptions stop receiving pages). */
async function rotateMyTopic() {
	const { data: auth } = await supabase.auth.getUser();
	const uid = auth.user?.id;
	if (!uid) return null;
	const topic = randomTopic();
	const { error } = await supabase.from("push_topics").upsert({
		user_id: uid,
		topic
	}, { onConflict: "user_id" });
	if (error) throw error;
	return topic;
}
/** Stop receiving pushes: delete the topic mapping. */
async function clearMyTopic() {
	const { data: auth } = await supabase.auth.getUser();
	const uid = auth.user?.id;
	if (!uid) return;
	await supabase.from("push_topics").delete().eq("user_id", uid);
}
/** Publish a test page to the operator's own topic. */
async function sendTestPush(topic) {
	const res = await fetch(topicUrl(topic), {
		method: "POST",
		headers: {
			Title: "Test page - Clovr Labs",
			Priority: "5",
			Tags: "rotating_light"
		},
		body: "If you can see this, on-call push is working on this device."
	});
	if (!res.ok) throw new Error(`ntfy ${res.status}`);
}
function isIOS() {
	if (typeof navigator === "undefined") return false;
	return /iP(hone|ad|od)/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
/** Admin view of all operator topics (RLS restricts this to HQ admins). */
async function listOperatorTopics() {
	const { data, error } = await supabase.from("push_topics").select("user_id, topic, revoked, last_sent_at, last_ack_at, updated_at").order("updated_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
/** Create or replace a topic for another operator. */
async function adminIssueTopic(user_id) {
	const topic = randomTopic();
	const { error } = await supabase.from("push_topics").upsert({
		user_id,
		topic,
		revoked: false,
		last_sent_at: null,
		last_ack_at: null
	}, { onConflict: "user_id" });
	if (error) throw error;
	return topic;
}
/** Stop pages going to a topic without deleting the record. */
async function adminSetRevoked(user_id, revoked) {
	const { error } = await supabase.from("push_topics").update({ revoked }).eq("user_id", user_id);
	if (error) throw error;
}
async function adminDeleteTopic(user_id) {
	const { error } = await supabase.from("push_topics").delete().eq("user_id", user_id);
	if (error) throw error;
}
/** Device-level push opt-in (ntfy.sh) for the on-call operator. */
function PushSettingsCard({ queue }) {
	const [topic, setTopic] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		getMyTopic().then((t) => {
			if (alive) setTopic(t);
		}).catch(() => {});
		return () => {
			alive = false;
		};
	}, []);
	const wrap = async (fn) => {
		setBusy(true);
		setMsg(null);
		try {
			await fn();
		} catch (e) {
			setMsg(e.message);
		} finally {
			setBusy(false);
		}
	};
	const turnOn = () => wrap(async () => {
		const t = await ensureMyTopic();
		setTopic(t);
		setMsg("Subscribe to this topic in the ntfy app to get paged on this device.");
	});
	const rotate = () => wrap(async () => {
		const t = await rotateMyTopic();
		setTopic(t);
		setMsg("New topic issued — re-subscribe on every device.");
	});
	const turnOff = () => wrap(async () => {
		await clearMyTopic();
		setTopic(null);
		setMsg("Push paging is off. You’ll still get pages by email and in the app.");
	});
	const test = () => wrap(async () => {
		if (!topic) return;
		await sendTestPush(topic);
		setMsg("Test page sent — check your phone.");
	});
	const copy = () => {
		if (!topic) return;
		navigator.clipboard?.writeText(topic).then(() => setMsg("Topic copied."), () => {});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Push notifications (ntfy)",
		hint: `Wakes you for ${QUEUE_LABEL[queue]} pages`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
			tone: topic ? "good" : "warn",
			children: topic ? "Topic active" : "Not set up"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs leading-5 text-muted-foreground",
				children: [
					"Pages are published to your own private ntfy topic. Install the free",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ntfy" }),
					" app, subscribe to the topic below, and every page reaches you even when the tab is closed. Set the ntfy notification priority to max so urgent pages break through Do Not Disturb."
				]
			}),
			topic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-md border border-border bg-muted/40 px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
						children: "Your topic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 break-all font-mono text-xs",
						children: topic
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 break-all text-[11px] text-muted-foreground",
						children: topicUrl(topic)
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						onClick: copy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), " Copy topic"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: topicUrl(topic),
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), " Open in ntfy web"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						disabled: busy,
						onClick: test,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-3.5 w-3.5" }), " Send test page"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						disabled: busy,
						onClick: rotate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " New topic"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						disabled: busy,
						onClick: turnOff,
						children: "Turn off"
					})
				]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					variant: "primary",
					disabled: busy,
					onClick: turnOn,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-3.5 w-3.5" }),
						" ",
						busy ? "Setting up…" : "Set up push paging"
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "mt-0.5 h-3.5 w-3.5 flex-none" }), isIOS() ? "On iPhone: install ntfy from the App Store, tap +, and enter the topic above." : "On Android: install ntfy from Google Play or F-Droid, tap +, and enter the topic above."]
			}),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: msg
			})
		]
	});
}
/**
* Admin control of every operator's ntfy topic: issue, rotate, revoke and see
* when a page was last pushed to them and last acknowledged.
*/
function OperatorTopics() {
	const { people } = usePeople();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [pick, setPick] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [allowed, setAllowed] = (0, import_react.useState)(true);
	const load = () => listOperatorTopics().then((r) => {
		setRows(r);
		setAllowed(true);
	}).catch(() => setAllowed(false));
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const run = async (fn) => {
		setBusy(true);
		setErr(null);
		try {
			await fn();
			await load();
		} catch (e) {
			setErr(e.message);
		} finally {
			setBusy(false);
		}
	};
	if (!allowed) return null;
	const named = (id) => people.find((p) => p.id === id);
	const candidates = people.filter((p) => !rows.some((r) => r.user_id === p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Operator push topics",
		hint: "Admin — issue, rotate or revoke the private ntfy topic each operator subscribes to",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
			tone: rows.filter((r) => !r.revoked).length ? "good" : "warn",
			children: [rows.filter((r) => !r.revoked).length, " active"]
		}),
		children: [
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "min-w-[220px] flex-1 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Issue a topic for"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						className: "w-full",
						value: pick,
						onChange: setPick,
						options: [{
							value: "",
							label: "Select an operator…"
						}, ...candidates.map((p) => ({
							value: p.id,
							label: p.full_name || p.email || p.id
						}))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					variant: "primary",
					disabled: !pick || busy,
					onClick: () => run(async () => {
						await adminIssueTopic(pick);
						setPick("");
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5" }), " Issue topic"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y divide-border rounded-md border border-border",
				children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No operator has push set up yet." }), rows.map((r) => {
					const p = named(r.user_id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 px-3 py-2.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-w-[160px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: r.user_id,
									name: p?.full_name || p?.email || "operator",
									size: "xs"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]",
								children: r.topic
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: r.revoked ? "risk" : "good",
								children: r.revoked ? "revoked" : "active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["Last sent ", r.last_sent_at ? dt(r.last_sent_at) : "—"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["Last ack ", r.last_ack_at ? dt(r.last_ack_at) : "—"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
										disabled: busy,
										onClick: () => run(() => adminIssueTopic(r.user_id)),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Rotate"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										disabled: busy,
										onClick: () => run(() => adminSetRevoked(r.user_id, !r.revoked)),
										children: r.revoked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-3.5 w-3.5" }), " Restore"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "h-3.5 w-3.5" }), " Revoke"] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										variant: "ghost",
										disabled: busy,
										onClick: () => run(() => adminDeleteTopic(r.user_id)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})
						]
					}, r.user_id);
				})]
			})
		]
	});
}
var ICON = {
	ntfy: Smartphone,
	email: Mail,
	app: MonitorSmartphone
};
var TONE = {
	sent: "good",
	acknowledged: "good",
	failed: "risk",
	skipped: "warn"
};
/** Everything the paging worker attempted: what was sent, when, and whether it stuck. */
function DeliveryTimeline({ alertIds }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let alive = true;
		fetchDeliveries(200).then((r) => alive && setRows(r)).catch(() => {}).finally(() => alive && setLoading(false));
		return () => {
			alive = false;
		};
	}, []);
	const visible = alertIds ? rows.filter((r) => !r.alert_id || alertIds.has(r.alert_id)) : rows;
	const count = (f) => visible.filter(f).length;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Push delivered",
				value: count((r) => r.channel === "ntfy" && r.status === "sent"),
				icon: Smartphone,
				tone: "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Emails delivered",
				value: count((r) => r.channel === "email" && r.status === "sent"),
				icon: Mail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Failures",
				value: count((r) => r.status === "failed"),
				icon: TriangleAlert,
				tone: count((r) => r.status === "failed") ? "risk" : "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Acknowledgements",
				value: count((r) => r.status === "acknowledged"),
				icon: Check,
				tone: "good"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			pad: false,
			title: `Delivery activity (${visible.length})`,
			hint: "Newest first — one row per attempt",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[62vh] divide-y divide-border overflow-y-auto",
				children: [visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing has been dispatched yet." }), visible.map((r) => {
					const Icon = ICON[r.channel] ?? CircleMinus;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 px-4 py-2.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 flex-none text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: TONE[r.status] ?? "muted",
								children: r.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium uppercase tracking-wider text-muted-foreground",
								children: r.channel
							}),
							r.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
								userId: r.user_id,
								name: "operator",
								size: "xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate text-muted-foreground",
								children: r.detail ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: dt(r.created_at)
							})
						]
					}, r.id);
				})]
			})
		})]
	});
}
function PagingConsole({ queue, lede }) {
	const [tab, setTab] = (0, import_react.useState)("live");
	const [pages, setPages] = (0, import_react.useState)([]);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [rotations, setRotations] = (0, import_react.useState)([]);
	const [members, setMembers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [compose, setCompose] = (0, import_react.useState)(false);
	const [tick, setTick] = (0, import_react.useState)(0);
	const people = usePeople();
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [p, t, r, m] = await Promise.all([
				fetchPages(void 0, 80, queue).catch(() => []),
				fetchTickets(queue).catch(() => []),
				fetchRotations(queue).catch(() => []),
				fetchRotationMembers().catch(() => [])
			]);
			if (!alive) return;
			setPages(p);
			setTickets(t);
			setRotations(r);
			setMembers(m);
			setLoading(false);
			fetchTicketNotes(t.map((x) => x.id)).then((n) => alive && setNotes(n)).catch(() => {});
		})();
		return () => {
			alive = false;
		};
	}, [tick, queue]);
	const reload = (0, import_react.useCallback)(() => setTick((v) => v + 1), []);
	const live = (0, import_react.useMemo)(() => pages.filter((p) => p.status !== "resolved"), [pages]);
	const open = live.filter((p) => p.status === "open");
	const openTickets = tickets.filter((t) => t.status !== "closed");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: `${QUEUE_LABEL[queue]} · Alerting`,
		title: queue === "ops" ? "Mission paging & on-call" : "Systems paging & on-call",
		lede,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				onClick: reload,
				children: "Refresh"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				onClick: () => {
					playSiren();
					setTimeout(() => stopSound("siren"), 3200);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" }), " Test alarm"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				variant: "primary",
				onClick: () => setCompose(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Siren, { className: "h-3.5 w-3.5" }), " Send a page"]
			})
		] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Unacknowledged",
					value: open.length,
					icon: BellRing,
					tone: open.length ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Acknowledged, open",
					value: live.length - open.length,
					tone: "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open tickets",
					value: openTickets.length,
					icon: Ticket,
					tone: openTickets.length ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Rotations",
					value: rotations.filter((r) => r.active).length,
					icon: Radio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "People on call",
					value: new Set(members.filter((m) => rotations.some((r) => r.id === m.rotation_id)).map((m) => m.user_id)).size,
					icon: Users
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-1.5 border-b border-border pb-2",
				children: [
					["live", "Live pages"],
					["tickets", "Tickets"],
					["delivery", "Delivery log"],
					["history", "History"],
					["roster", "On-call roster"]
				].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(k),
					className: `rounded-md px-3 py-1.5 text-xs font-medium transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`,
					children: [
						label,
						k === "live" && live.length ? ` (${live.length})` : "",
						k === "tickets" && openTickets.length ? ` (${openTickets.length})` : ""
					]
				}, k))
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					tab === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageList, {
						rows: live,
						reload,
						empty: "All quiet — nothing is paging right now."
					}),
					tab === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageList, {
						rows: pages.filter((p) => p.status === "resolved"),
						reload,
						empty: "No resolved pages yet."
					}),
					tab === "delivery" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryTimeline, { alertIds: new Set(pages.map((p) => p.id)) }),
					tab === "tickets" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tickets, {
						queue,
						tickets,
						notes,
						people: people.people,
						reload
					}),
					tab === "roster" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PushSettingsCard, { queue }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorTopics, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Roster, {
								queue,
								rotations,
								members,
								people: people.people,
								reload
							})
						]
					})
				]
			}),
			compose && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compose, {
				queue,
				onClose: () => setCompose(false),
				onSent: () => {
					setCompose(false);
					reload();
				}
			})
		]
	});
}
function PageList({ rows, reload, empty }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	const act = async (id, fn) => {
		setBusy(id);
		try {
			await fn(id);
			reload();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		pad: false,
		title: `Pages (${rows.length})`,
		hint: "Newest first",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "divide-y divide-border",
			children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: empty }), rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: p.status === "open" ? "risk" : p.status === "acked" ? "warn" : "good",
									children: p.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: "muted",
									children: p.kind
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["Level ", p.level]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto font-mono text-[11px] text-muted-foreground",
									children: dt(p.created_at)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm font-semibold",
							children: p.title
						}),
						p.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground",
							children: p.body
						}),
						p.acked_by && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [
								"Acknowledged ",
								dt(p.acked_at),
								" by ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
									userId: p.acked_by,
									name: "teammate",
									size: "xs"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-none flex-wrap gap-1.5",
					children: [
						p.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "ghost",
							onClick: () => {
								window.location.href = p.link;
							},
							children: "Open"
						}),
						p.status === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							disabled: busy === p.id,
							onClick: () => act(p.id, ackPage),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Ack"]
						}),
						p.status !== "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							variant: "primary",
							disabled: busy === p.id,
							onClick: () => act(p.id, resolvePage),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Resolve"]
						})
					]
				})]
			}, p.id))]
		})
	});
}
function Tickets({ queue, tickets, notes, people, reload }) {
	const [filter, setFilter] = (0, import_react.useState)("active");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const rows = tickets.filter((t) => filter === "active" ? t.status !== "closed" : filter === "all" ? true : t.status === filter);
	const current = tickets.find((t) => t.id === openId) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					className: "w-52",
					value: filter,
					onChange: setFilter,
					options: [
						{
							value: "active",
							label: "Active tickets"
						},
						{
							value: "all",
							label: "All tickets"
						},
						...TICKET_STATUSES.map((s) => ({
							value: s.value,
							label: s.label
						}))
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					className: "ml-auto",
					variant: "primary",
					onClick: () => setCreating(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New ticket"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: `Tickets (${rows.length})`,
				hint: "Every page opens one automatically",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No tickets in this view." }), rows.map((t) => {
						const owner = people.find((p) => p.id === t.assignee_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpenId(t.id),
							className: "flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-accent/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-muted-foreground",
									children: t.ref
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: t.status === "open" ? "risk" : t.status === "investigating" ? "warn" : t.status === "mitigated" ? "muted" : "good",
									children: t.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate text-sm font-medium",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: owner ? owner.full_name || owner.email : "Unassigned"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-muted-foreground",
									children: dt(t.opened_at)
								})
							]
						}, t.id);
					})]
				})
			}),
			current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketDetail, {
				ticket: current,
				notes: notes.filter((n) => n.ticket_id === current.id),
				people,
				onClose: () => setOpenId(null),
				reload
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewTicket, {
				queue,
				onClose: () => setCreating(false),
				onDone: () => {
					setCreating(false);
					reload();
				}
			})
		]
	});
}
function TicketDetail({ ticket, notes, people, onClose, reload }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const save = async (patch) => {
		setBusy(true);
		try {
			await saveTicket({
				id: ticket.id,
				...patch
			});
			reload();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	const postNote = async () => {
		if (!note.trim()) return;
		setBusy(true);
		try {
			await addTicketNote(ticket.id, note.trim());
			setNote("");
			reload();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: `${ticket.ref} — ${ticket.title}`,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-muted-foreground",
							children: "Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							className: "w-full",
							value: ticket.status,
							onChange: (v) => save({ status: v }),
							options: TICKET_STATUSES.map((s) => ({
								value: s.value,
								label: s.label
							}))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1 block text-muted-foreground",
							children: "Owner"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							className: "w-full",
							value: ticket.assignee_id ?? "",
							onChange: (v) => save({ assignee_id: v || null }),
							options: [{
								value: "",
								label: "Unassigned"
							}, ...people.map((p) => ({
								value: p.id,
								label: p.full_name || p.email || p.id
							}))]
						})]
					})]
				}),
				ticket.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
					children: ticket.summary
				}),
				[
					["impact", "Impact"],
					["root_cause", "Root cause"],
					["resolution", "Resolution / follow-up"]
				].map(([field, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						defaultValue: ticket[field] ?? "",
						disabled: busy,
						onBlur: (e) => e.target.value !== (ticket[field] ?? "") && save({ [field]: e.target.value }),
						className: "w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
					})]
				}, field)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold text-muted-foreground",
							children: "Timeline"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [notes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No updates yet."
							}), notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border border-border p-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2 text-[11px] text-muted-foreground",
									children: [n.author_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
										userId: n.author_id,
										name: "teammate",
										size: "xs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto font-mono",
										children: dt(n.created_at)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: n.body })]
							}, n.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Add an update…",
								onKeyDown: (e) => e.key === "Enter" && postNote(),
								className: "flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "primary",
								disabled: busy || !note.trim(),
								onClick: postNote,
								children: "Post"
							})]
						})
					]
				})
			]
		})
	});
}
function NewTicket({ queue, onClose, onDone }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)(QUEUE_KINDS[queue][0].value);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async () => {
		if (!title.trim()) return;
		setBusy(true);
		try {
			await createTicket({
				queue,
				title: title.trim(),
				summary: summary.trim() || void 0,
				kind
			});
			onDone();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "New ticket",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			variant: "primary",
			disabled: busy || !title.trim(),
			onClick: submit,
			children: "Create ticket"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						className: "w-full",
						value: kind,
						onChange: setKind,
						options: QUEUE_KINDS[queue]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: summary,
						onChange: (e) => setSummary(e.target.value),
						className: "w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
					})]
				})
			]
		})
	});
}
function Roster({ queue, rotations, members, people, reload }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const list = people;
	const run = async (fn) => {
		setBusy(true);
		try {
			await fn();
			reload();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					variant: "primary",
					disabled: busy,
					onClick: () => run(() => saveRotation({
						name: `${QUEUE_LABEL[queue]} rotation`,
						queue,
						kinds: [],
						escalation_minutes: 5,
						max_level: 3,
						active: true
					})),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add rotation"]
				})
			}),
			rotations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No rotations for this queue yet — add one and assign tiers." }),
			rotations.map((r) => {
				const mine = members.filter((m) => m.rotation_id === r.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: r.name,
					hint: `Escalates every ${r.escalation_minutes} min, up to tier ${r.max_level}`,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "ghost",
						disabled: busy,
						onClick: () => run(() => deleteRotation(r.id)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Remove"]
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-muted-foreground",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										defaultValue: r.name,
										onBlur: (e) => e.target.value !== r.name && run(() => saveRotation({
											id: r.id,
											name: e.target.value
										})),
										className: "w-full rounded border border-border bg-background px-2 py-1 text-sm"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-muted-foreground",
										children: "Escalate after (min)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 1,
										defaultValue: r.escalation_minutes,
										onBlur: (e) => run(() => saveRotation({
											id: r.id,
											escalation_minutes: Number(e.target.value) || 5
										})),
										className: "w-full rounded border border-border bg-background px-2 py-1 text-sm tabular-nums"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-muted-foreground",
										children: "Max tier"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 1,
										max: 5,
										defaultValue: r.max_level,
										onBlur: (e) => run(() => saveRotation({
											id: r.id,
											max_level: Number(e.target.value) || 3
										})),
										className: "w-full rounded border border-border bg-background px-2 py-1 text-sm tabular-nums"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-muted-foreground",
										children: "Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
										onClick: () => run(() => saveRotation({
											id: r.id,
											active: !r.active
										})),
										children: r.active ? "On" : "Off"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1 block text-xs text-muted-foreground",
									children: "Page types this rotation answers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: QUEUE_KINDS[queue].map((k) => {
										const on = r.kinds?.includes(k.value);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: busy,
											onClick: () => run(() => saveRotation({
												id: r.id,
												kinds: on ? r.kinds.filter((x) => x !== k.value) : [...r.kinds ?? [], k.value]
											})),
											className: `rounded-full border px-2.5 py-1 text-[11px] transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}`,
											children: k.label
										}, k.value);
									})
								}),
								(!r.kinds || r.kinds.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										"No types selected — this rotation catches everything in ",
										QUEUE_LABEL[queue],
										"."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3 border-t border-border pt-3",
							children: [
								1,
								2,
								3
							].filter((t) => t <= r.max_level).map((tier) => {
								const tierMembers = mine.filter((m) => m.tier === tier);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "w-16 text-xs font-semibold text-muted-foreground",
											children: ["Tier ", tier]
										}),
										tierMembers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Nobody assigned"
										}),
										tierMembers.map((m) => {
											const person = list.find((p) => p.id === m.user_id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
													userId: m.user_id,
													name: person?.full_name || person?.email || "Teammate",
													size: "xs"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => run(() => removeRotationMember(m.id)),
													className: "text-xs text-muted-foreground hover:text-destructive",
													children: "×"
												})]
											}, m.id);
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											className: "ml-auto w-56",
											value: "",
											onChange: (v) => v && run(() => addRotationMember(r.id, v, tier)),
											options: [{
												value: "",
												label: `Add to tier ${tier}…`
											}, ...list.map((p) => ({
												value: p.id,
												label: p.full_name || p.email || p.id
											}))]
										})
									]
								}, tier);
							})
						})
					]
				}, r.id);
			})
		]
	});
}
function Compose({ queue, onClose, onSent }) {
	const [kind, setKind] = (0, import_react.useState)(QUEUE_KINDS[queue][0].value);
	const [severity, setSeverity] = (0, import_react.useState)("critical");
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const send = async () => {
		if (!title.trim()) return;
		setBusy(true);
		try {
			await raisePage({
				kind,
				queue,
				title: title.trim(),
				body: body.trim() || void 0,
				severity,
				link: queue === "systems" ? "/systems/paging" : "/ops/paging"
			});
			onSent();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: `Page ${QUEUE_LABEL[queue]} on-call`,
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			variant: "primary",
			onClick: send,
			disabled: busy || !title.trim(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Siren, { className: "h-3.5 w-3.5" }),
				" ",
				busy ? "Paging…" : "Page on-call"
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Kind"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: kind,
						onChange: setKind,
						options: QUEUE_KINDS[queue],
						className: "w-full"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Severity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: severity,
						onChange: setSeverity,
						className: "w-full",
						options: [
							{
								value: "critical",
								label: "Critical — wake them up"
							},
							{
								value: "high",
								label: "High"
							},
							{
								value: "info",
								label: "Informational"
							}
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Headline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: queue === "systems" ? "Auth service returning 500s" : "Ground station offline at Placer base",
						className: "w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-muted-foreground",
						children: "Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: body,
						onChange: (e) => setBody(e.target.value),
						rows: 4,
						className: "w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground",
					children: "A tracking ticket is opened automatically for every page."
				})
			]
		})
	});
}
//#endregion
export { PagingConsole as t };
