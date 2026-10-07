import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { $ as Reply, Cn as Funnel, Gt as LoaderCircle, K as Send, Pn as FilePen, U as Settings, Vt as MailOpen, Wr as Archive, dr as ChevronRight, et as ReplyAll, in as Inbox, jn as FileText, k as Star, kn as Flag, n as X, nt as RefreshCw, q as Search, st as Plus, tr as Circle, u as Users, wn as Forward, x as Trash2, yt as Paperclip } from "./_libs/lucide-react.mjs";
import { t as EscapeKey } from "./_ssr/EscapeKey-s0O3wTFo.mjs";
import { t as useServerFn } from "./_ssr/useServerFn-CrZF2pjq.mjs";
import { i as syncMailAccount, r as sendMailViaAccount } from "./_ssr/mail-accounts.functions-B_0Odk0C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.mail-Cz3R1NGe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_FROM_DOMAIN = "clovrlab.com";
var MAILBOX_FROM = {
	personal: `hq@${DEFAULT_FROM_DOMAIN}`,
	support: `support@${DEFAULT_FROM_DOMAIN}`,
	sales: `sales@${DEFAULT_FROM_DOMAIN}`,
	info: `info@${DEFAULT_FROM_DOMAIN}`,
	billing: `billing@${DEFAULT_FROM_DOMAIN}`
};
var SHARED_BOXES = [
	"support",
	"sales",
	"info",
	"billing"
];
function fmtDate(iso) {
	const d = new Date(iso);
	const now = /* @__PURE__ */ new Date();
	if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});
	const y = /* @__PURE__ */ new Date(now.getTime() - 864e5);
	if (d.toDateString() === y.toDateString()) return "Yesterday";
	if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString([], {
		month: "short",
		day: "numeric"
	});
	return d.toLocaleDateString();
}
function initials(addr) {
	if (!addr) return "?";
	return addr.split("@")[0].replace(/[._-]/g, " ").split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}
function MailClient() {
	const [emails, setEmails] = (0, import_react.useState)([]);
	const [rules, setRules] = (0, import_react.useState)([]);
	const [templates, setTemplates] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)({
		kind: "folder",
		folder: "inbox",
		mailbox: "personal",
		label: "Inbox"
	});
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [compose, setCompose] = (0, import_react.useState)(null);
	const [sending, setSending] = (0, import_react.useState)(false);
	const sendViaAccount = useServerFn(sendMailViaAccount);
	const syncFn = useServerFn(syncMailAccount);
	const [accounts, setAccounts] = (0, import_react.useState)([]);
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [userSettings, setUserSettings] = (0, import_react.useState)({
		signature: "",
		auto_reply_enabled: false,
		auto_reply_subject: "",
		auto_reply_body: "",
		notify_on_new: true,
		notify_on_mention: true,
		digest_frequency: "off",
		display_name: ""
	});
	const [showSettings, setShowSettings] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			const { data } = await supabase.from("user_email_settings").select("*").eq("user_id", u.user.id).maybeSingle();
			if (data) setUserSettings({
				signature: data.signature ?? "",
				auto_reply_enabled: !!data.auto_reply_enabled,
				auto_reply_subject: data.auto_reply_subject ?? "",
				auto_reply_body: data.auto_reply_body ?? "",
				notify_on_new: data.notify_on_new ?? true,
				notify_on_mention: data.notify_on_mention ?? true,
				digest_frequency: data.digest_frequency ?? "off",
				display_name: data.display_name ?? ""
			});
		})();
	}, []);
	const saveUserSettings = async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return;
		await supabase.from("user_email_settings").upsert({
			user_id: u.user.id,
			...userSettings,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setShowSettings(false);
	};
	const refresh = async () => {
		setLoading(true);
		const [{ data: em }, { data: rl }, { data: tp }] = await Promise.all([
			supabase.from("hq_emails").select("*").order("created_at", { ascending: false }),
			supabase.from("hq_email_rules").select("*").order("created_at", { ascending: false }),
			supabase.from("hq_email_templates").select("*").order("updated_at", { ascending: false })
		]);
		const { data: accts } = await supabase.from("email_accounts").select("*").eq("active", true).order("label");
		setAccounts(accts ?? []);
		setEmails(em ?? []);
		setRules(rl ?? []);
		setTemplates(tp ?? []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		refresh();
	}, []);
	const syncAll = async () => {
		if (syncing || accounts.length === 0) return;
		setSyncing(true);
		try {
			let imported = 0;
			const failures = [];
			for (const a of accounts) try {
				const res = await syncFn({ data: { accountId: a.id } });
				imported += res.imported;
			} catch (err) {
				failures.push(`${a.email_address}: ${err instanceof Error ? err.message : String(err)}`);
			}
			await refresh();
			if (failures.length) alert(`Sync finished with errors:\n${failures.join("\n")}`);
			else if (imported === 0) alert("Mailboxes are up to date.");
		} finally {
			setSyncing(false);
		}
	};
	const counts = (0, import_react.useMemo)(() => {
		const c = {
			inbox: 0,
			unread: 0,
			sent: 0,
			drafts: 0,
			archived: 0,
			flagged: 0
		};
		for (const e of emails) {
			if (e.folder === "inbox" && e.mailbox === "personal") c.inbox++;
			if (e.folder === "inbox" && e.mailbox === "personal" && !e.is_read) c.unread++;
			if (e.folder === "sent") c.sent++;
			if (e.folder === "drafts") c.drafts++;
			if (e.status === "archived") c.archived++;
			if (e.status === "flagged") c.flagged++;
		}
		return c;
	}, [emails]);
	const sharedCounts = (0, import_react.useMemo)(() => {
		const map = {};
		for (const e of emails) if (!e.is_read && e.mailbox && e.mailbox !== "personal") map[e.mailbox] = (map[e.mailbox] ?? 0) + 1;
		return map;
	}, [emails]);
	const listed = (0, import_react.useMemo)(() => {
		let rows = emails;
		if (active.kind === "folder") rows = rows.filter((e) => e.folder === active.folder && (active.mailbox ? e.mailbox === active.mailbox : true));
		else if (active.kind === "flag") rows = rows.filter((e) => e.status === active.label.toLowerCase());
		else if (active.kind === "shared") rows = rows.filter((e) => e.mailbox === active.mailbox);
		if (query.trim()) {
			const q = query.toLowerCase();
			rows = rows.filter((e) => (e.subject ?? "").toLowerCase().includes(q) || (e.from_addr ?? "").toLowerCase().includes(q) || (e.to_addr ?? "").toLowerCase().includes(q) || (e.body ?? "").toLowerCase().includes(q));
		}
		return rows;
	}, [
		emails,
		active,
		query
	]);
	const selected = (0, import_react.useMemo)(() => emails.find((e) => e.id === selectedId) ?? null, [emails, selectedId]);
	(0, import_react.useEffect)(() => {
		if (selected && !selected.is_read && active.kind === "folder" && active.folder === "inbox") (async () => {
			await supabase.from("hq_emails").update({
				is_read: true,
				status: "read"
			}).eq("id", selected.id);
			setEmails((prev) => prev.map((e) => e.id === selected.id ? {
				...e,
				is_read: true,
				status: "read"
			} : e));
		})();
	}, [selected?.id]);
	const openCompose = (init) => {
		const sig = userSettings.signature ? `\n\n${userSettings.signature}` : "";
		const baseBody = init?.body ?? "";
		setCompose({
			to: init?.to ?? "",
			cc: init?.cc ?? "",
			subject: init?.subject ?? "",
			body: baseBody + (baseBody.includes(userSettings.signature) || !sig ? "" : sig),
			mailbox: init?.mailbox ?? "personal",
			inReplyTo: init?.inReplyTo ?? null
		});
	};
	const sendCompose = async (asDraft) => {
		if (!compose) return;
		if (sending) return;
		setSending(true);
		try {
			const { data: u } = await supabase.auth.getUser();
			const account = accounts.find((a) => a.email_address === compose.mailbox);
			if (account && !asDraft) {
				try {
					await sendViaAccount({ data: {
						accountId: account.id,
						to: compose.to,
						cc: compose.cc || null,
						subject: compose.subject || "(no subject)",
						body: compose.body || "",
						inReplyTo: compose.inReplyTo ?? null
					} });
					await refresh();
					setCompose(null);
					setActive({
						kind: "folder",
						folder: "sent",
						label: "Sent"
					});
				} catch (err) {
					alert(`Delivery failed: ${err?.message ?? err}`);
				}
				return;
			}
			if (!asDraft) {
				alert("No mailbox connected. Ask an admin to connect an IMAP/SMTP mailbox in Settings → Company → Mailboxes.");
				return;
			}
			const fromAddr = MAILBOX_FROM[compose.mailbox] ?? MAILBOX_FROM.personal;
			const row = {
				folder: asDraft ? "drafts" : "sent",
				mailbox: compose.mailbox,
				subject: compose.subject || "(no subject)",
				from_addr: asDraft ? u.user?.email ?? fromAddr : fromAddr,
				to_addr: compose.to,
				cc: compose.cc || null,
				body: compose.body || null,
				status: asDraft ? "draft" : "sent",
				is_read: true,
				direction: "outbound",
				in_reply_to: compose.inReplyTo ?? null,
				sent_at: asDraft ? null : (/* @__PURE__ */ new Date()).toISOString(),
				owner_id: u.user?.id,
				created_by: u.user?.id
			};
			const { data, error } = await supabase.from("hq_emails").insert(row).select().single();
			if (error) {
				alert(error.message);
				return;
			}
			const inserted = data;
			if (inserted) setEmails((prev) => [inserted, ...prev]);
			setCompose(null);
			setActive({
				kind: "folder",
				folder: asDraft ? "drafts" : "sent",
				label: asDraft ? "Drafts" : "Sent"
			});
		} finally {
			setSending(false);
		}
	};
	const setFlag = async (id, status) => {
		await supabase.from("hq_emails").update({ status }).eq("id", id);
		setEmails((prev) => prev.map((e) => e.id === id ? {
			...e,
			status
		} : e));
	};
	const deleteEmail = async (id) => {
		if (!confirm("Delete this email?")) return;
		await supabase.from("hq_emails").delete().eq("id", id);
		setEmails((prev) => prev.filter((e) => e.id !== id));
		if (selectedId === id) setSelectedId(null);
	};
	const NavItem = ({ icon: Icon, label, count, isActive, onClick }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-[13px] transition ${isActive ? "bg-primary/10 font-semibold text-primary" : "text-foreground/80 hover:bg-muted"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 truncate",
				children: label
			}),
			count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
				children: count
			}) : null
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-full w-full max-w-[1600px] gap-3 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex w-60 shrink-0 flex-col rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => openCompose(),
						className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New email"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-4 overflow-y-auto p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Personal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Inbox,
								label: "Inbox",
								count: counts.unread,
								isActive: active.kind === "folder" && active.folder === "inbox" && active.mailbox === "personal",
								onClick: () => setActive({
									kind: "folder",
									folder: "inbox",
									mailbox: "personal",
									label: "Inbox"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Send,
								label: "Sent",
								count: counts.sent,
								isActive: active.kind === "folder" && active.folder === "sent",
								onClick: () => setActive({
									kind: "folder",
									folder: "sent",
									label: "Sent"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: FilePen,
								label: "Drafts",
								count: counts.drafts,
								isActive: active.kind === "folder" && active.folder === "drafts",
								onClick: () => setActive({
									kind: "folder",
									folder: "drafts",
									label: "Drafts"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Flag,
								label: "Flagged",
								count: counts.flagged,
								isActive: active.kind === "flag" && active.label === "Flagged",
								onClick: () => setActive({
									kind: "flag",
									label: "Flagged"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Archive,
								label: "Archived",
								count: counts.archived,
								isActive: active.kind === "flag" && active.label === "Archived",
								onClick: () => setActive({
									kind: "flag",
									label: "Archived"
								})
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), " Shared mailboxes"]
								})
							}),
							accounts.length === 0 && SHARED_BOXES.map((mb) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Inbox,
								label: `${mb}@`,
								count: sharedCounts[mb],
								isActive: active.kind === "shared" && active.mailbox === mb,
								onClick: () => setActive({
									kind: "shared",
									mailbox: mb,
									label: `${mb}@`
								})
							}, mb)),
							accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Inbox,
								label: a.label,
								count: sharedCounts[a.email_address],
								isActive: active.kind === "shared" && active.mailbox === a.email_address,
								onClick: () => setActive({
									kind: "shared",
									mailbox: a.email_address,
									label: a.label
								})
							}, a.id)),
							accounts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: syncAll,
								disabled: syncing,
								className: "mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-[13px] text-foreground/80 transition hover:bg-muted disabled:opacity-60",
								children: [syncing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 shrink-0 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate",
									children: syncing ? "Syncing…" : "Sync mail"
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Manage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Funnel,
								label: "Rules",
								count: rules.filter((r) => r.active).length,
								isActive: active.kind === "manage" && active.view === "rules",
								onClick: () => setActive({
									kind: "manage",
									view: "rules",
									label: "Rules"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: FileText,
								label: "Templates",
								count: templates.length,
								isActive: active.kind === "manage" && active.view === "templates",
								onClick: () => setActive({
									kind: "manage",
									view: "templates",
									label: "Templates"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								icon: Settings,
								label: "Settings",
								isActive: false,
								onClick: () => setShowSettings(true)
							})
						] })
					]
				})]
			}),
			showSettings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6",
				onClick: () => setShowSettings(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Mail settings",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setShowSettings(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-center justify-between border-b border-border px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Mail"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: "Your email settings"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowSettings(false),
								className: "rounded p-1.5 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-[70vh] space-y-5 overflow-y-auto p-5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-semibold text-muted-foreground",
									children: "Display name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "Display name",
									value: userSettings.display_name,
									onChange: (e) => setUserSettings({
										...userSettings,
										display_name: e.target.value
									}),
									placeholder: "Jane Doe",
									className: "w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-semibold text-muted-foreground",
										children: "Signature"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										"aria-label": "Signature",
										value: userSettings.signature,
										onChange: (e) => setUserSettings({
											...userSettings,
											signature: e.target.value
										}),
										rows: 5,
										placeholder: "— Jane Doe\nEngineering, Clovr Lab",
										className: "w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: "Automatically appended when composing new email."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-border bg-muted/30 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: userSettings.auto_reply_enabled,
											onChange: (e) => setUserSettings({
												...userSettings,
												auto_reply_enabled: e.target.checked
											})
										}), " Auto-reply / vacation responder"]
									}), userSettings.auto_reply_enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: userSettings.auto_reply_subject,
											onChange: (e) => setUserSettings({
												...userSettings,
												auto_reply_subject: e.target.value
											}),
											placeholder: "Subject (e.g. Out of office)",
											className: "w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: userSettings.auto_reply_body,
											onChange: (e) => setUserSettings({
												...userSettings,
												auto_reply_body: e.target.value
											}),
											rows: 4,
											placeholder: "I'm currently away and will reply when I'm back…",
											className: "w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
											children: "Notifications"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: userSettings.notify_on_new,
												onChange: (e) => setUserSettings({
													...userSettings,
													notify_on_new: e.target.checked
												})
											}), " Notify me for new email"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: userSettings.notify_on_mention,
												onChange: (e) => setUserSettings({
													...userSettings,
													notify_on_mention: e.target.checked
												})
											}), " Notify me when I'm @-mentioned in email"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-semibold text-muted-foreground",
									children: "Digest frequency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Digest frequency",
									value: userSettings.digest_frequency,
									onChange: (e) => setUserSettings({
										...userSettings,
										digest_frequency: e.target.value
									}),
									className: "rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-primary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "off",
											children: "Off"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "daily",
											children: "Daily"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "weekly",
											children: "Weekly"
										})
									]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: "flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-5 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowSettings(false),
								className: "rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: saveUserSettings,
								className: "rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90",
								children: "Save settings"
							})]
						})
					]
				})]
			}),
			active.kind !== "manage" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex w-[380px] shrink-0 flex-col rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: active.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: listed.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search mail…",
							className: "w-full rounded-md border border-border bg-background pl-7 pr-2 py-1.5 text-xs outline-none focus:border-primary"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-4 text-xs text-muted-foreground",
						children: "Loading…"
					}) : listed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-6 text-center text-xs text-muted-foreground",
						children: "No messages."
					}) : listed.map((e) => {
						const isSel = selectedId === e.id;
						const unread = !e.is_read && e.folder === "inbox";
						const person = active.kind === "folder" && (active.folder === "sent" || active.folder === "drafts") ? e.to_addr : e.from_addr;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedId(e.id),
							className: `flex w-full gap-2.5 border-b border-border/60 px-3 py-2.5 text-left transition ${isSel ? "bg-primary/10" : "hover:bg-muted/50"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${unread ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
									children: initials(person)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `truncate text-[13px] ${unread ? "font-bold" : "font-medium"}`,
												children: person || "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "shrink-0 text-[10px] text-muted-foreground",
												children: fmtDate(e.created_at)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `truncate text-[12px] ${unread ? "font-semibold text-foreground" : "text-foreground/80"}`,
											children: e.subject || "(no subject)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[11px] text-muted-foreground",
											children: e.body?.slice(0, 90) || "—"
										})
									]
								}),
								unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "mt-1 h-2 w-2 shrink-0 fill-primary text-primary" })
							]
						}, e.id);
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card",
				children: active.kind === "manage" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageView, {
					view: active.view,
					rules,
					templates,
					onRefresh: refresh,
					onUseTemplate: (t) => openCompose({
						subject: t.subject ?? "",
						body: t.body ?? ""
					})
				}) : !selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center justify-center text-center text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailOpen, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Select a message to read." })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b border-border px-6 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openCompose({
										to: selected.from_addr ?? "",
										subject: `Re: ${selected.subject ?? ""}`,
										body: `\n\n---\n${selected.body ?? ""}`,
										inReplyTo: selected.message_id ?? null
									}),
									className: "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "h-3 w-3" }), " Reply"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openCompose({
										to: selected.from_addr ?? "",
										cc: selected.cc ?? "",
										subject: `Re: ${selected.subject ?? ""}`,
										body: `\n\n---\n${selected.body ?? ""}`,
										inReplyTo: selected.message_id ?? null
									}),
									className: "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReplyAll, { className: "h-3 w-3" }), " Reply all"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openCompose({
										subject: `Fwd: ${selected.subject ?? ""}`,
										body: `\n\n---\nFrom: ${selected.from_addr}\n${selected.body ?? ""}`
									}),
									className: "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forward, { className: "h-3 w-3" }), " Forward"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-auto flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": "Star",
											onClick: () => setFlag(selected.id, selected.status === "flagged" ? "read" : "flagged"),
											className: "rounded-md p-1.5 hover:bg-muted",
											title: "Flag",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 ${selected.status === "flagged" ? "fill-amber-400 text-amber-500" : ""}` })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": "Archive",
											onClick: () => setFlag(selected.id, "archived"),
											className: "rounded-md p-1.5 hover:bg-muted",
											title: "Archive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": "Delete",
											onClick: () => deleteEmail(selected.id),
											className: "rounded-md p-1.5 hover:bg-destructive/10 hover:text-destructive",
											title: "Delete",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-semibold",
							children: selected.subject || "(no subject)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary",
									children: initials(selected.from_addr)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1 text-[13px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: selected.from_addr || "—"
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: [
											"to ",
											selected.to_addr,
											selected.cc ? `, cc: ${selected.cc}` : ""
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: new Date(selected.created_at).toLocaleString()
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-6 py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap break-words font-sans text-[14px] leading-relaxed text-foreground",
						children: selected.body || "(empty)"
					})
				})] })
			}),
			compose && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-end bg-black/30 p-6",
				onClick: () => setCompose(null),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Compose message",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setCompose(null) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					className: "flex h-[560px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "New message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCompose(null),
								className: "rounded p-1 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[80px_1fr] gap-x-3 gap-y-1 border-b border-border px-4 py-3 text-[13px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pt-1.5 text-muted-foreground",
									children: "From"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: compose.mailbox,
									onChange: (e) => setCompose({
										...compose,
										mailbox: e.target.value
									}),
									className: "rounded border border-border bg-background px-2 py-1 outline-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "personal",
											children: "Personal"
										}),
										accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: a.email_address,
											children: [
												a.label,
												" — ",
												a.email_address
											]
										}, a.id)),
										accounts.length === 0 && SHARED_BOXES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: m,
											children: [m, "@"]
										}, m))
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pt-1.5 text-muted-foreground",
									children: "To"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: compose.to,
									onChange: (e) => setCompose({
										...compose,
										to: e.target.value
									}),
									placeholder: "recipient@example.com",
									className: "rounded border border-border bg-background px-2 py-1 outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pt-1.5 text-muted-foreground",
									children: "Cc"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: compose.cc,
									onChange: (e) => setCompose({
										...compose,
										cc: e.target.value
									}),
									className: "rounded border border-border bg-background px-2 py-1 outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pt-1.5 text-muted-foreground",
									children: "Subject"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: compose.subject,
									onChange: (e) => setCompose({
										...compose,
										subject: e.target.value
									}),
									className: "rounded border border-border bg-background px-2 py-1 outline-none"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: compose.body,
							onChange: (e) => setCompose({
								...compose,
								body: e.target.value
							}),
							placeholder: "Write your message…",
							className: "flex-1 resize-none border-0 bg-background p-4 text-[14px] outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: "flex items-center justify-between gap-2 border-t border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [templates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									onChange: (e) => {
										const t = templates.find((x) => x.id === e.target.value);
										if (t) setCompose({
											...compose,
											subject: t.subject ?? compose.subject,
											body: t.body ?? compose.body
										});
										e.target.value = "";
									},
									className: "rounded border border-border bg-background px-2 py-1.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Insert template…"
									}), templates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t.id,
										children: t.name
									}, t.id))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground",
									disabled: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3" }), " Attach"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => sendCompose(true),
									className: "rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted",
									children: "Save draft"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									disabled: sending,
									onClick: () => sendCompose(false),
									className: "inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3 w-3" }),
										" ",
										sending ? "Sending…" : "Send"
									]
								})]
							})]
						})
					]
				})]
			})
		]
	});
}
function ManageView({ view, rules, templates, onRefresh, onUseTemplate }) {
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [ruleForm, setRuleForm] = (0, import_react.useState)({
		name: "",
		match_field: "from_addr",
		match_value: "",
		action: "label",
		action_value: "",
		active: true
	});
	const [tplForm, setTplForm] = (0, import_react.useState)({
		name: "",
		category: "general",
		subject: "",
		body: ""
	});
	const saveRule = async (e) => {
		e.preventDefault();
		const { data: u } = await supabase.auth.getUser();
		const { error } = await supabase.from("hq_email_rules").insert({
			...ruleForm,
			created_by: u.user?.id
		});
		if (error) return alert(error.message);
		setRuleForm({
			name: "",
			match_field: "from_addr",
			match_value: "",
			action: "label",
			action_value: "",
			active: true
		});
		setShowForm(false);
		onRefresh();
	};
	const saveTpl = async (e) => {
		e.preventDefault();
		const { data: u } = await supabase.auth.getUser();
		const { error } = await supabase.from("hq_email_templates").insert({
			...tplForm,
			created_by: u.user?.id
		});
		if (error) return alert(error.message);
		setTplForm({
			name: "",
			category: "general",
			subject: "",
			body: ""
		});
		setShowForm(false);
		onRefresh();
	};
	const remove = async (table, id) => {
		if (!confirm("Delete?")) return;
		await supabase.from(table).delete().eq("id", id);
		onRefresh();
	};
	const toggleRule = async (r) => {
		await supabase.from("hq_email_rules").update({ active: !r.active }).eq("id", r.id);
		onRefresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-border px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
					children: "Manage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: view === "rules" ? "Email Rules" : "Templates"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowForm(true),
					className: "inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }),
						" New ",
						view === "rules" ? "rule" : "template"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-6",
				children: view === "rules" ? rules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No rules yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-lg border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "When"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Action"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left",
									children: "Value"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-medium",
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: [
										r.match_field,
										" contains \"",
										r.match_value,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase",
										children: r.action
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-muted-foreground",
									children: r.action_value || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleRule(r),
										className: `mr-2 rounded px-2 py-1 text-[10px] font-semibold ${r.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`,
										children: r.active ? "Active" : "Off"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": "Delete",
										onClick: () => remove("hq_email_rules", r.id),
										className: "rounded p-1 hover:bg-destructive/10 hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								})
							]
						}, r.id)) })]
					})
				}) : templates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No templates yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: templates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-background p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-semibold",
										children: t.name
									}), t.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 inline-block rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground",
										children: t.category
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Delete",
									onClick: () => remove("hq_email_templates", t.id),
									className: "rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 truncate text-sm text-muted-foreground",
								children: t.subject
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-3 text-xs text-muted-foreground",
								children: t.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onUseTemplate(t),
								className: "mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline",
								children: ["Use template ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
							})
						]
					}, t.id))
				})
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-6",
				onClick: () => setShowForm(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Form",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: () => setShowForm(false) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: view === "rules" ? saveRule : saveTpl,
					className: "w-full max-w-lg space-y-3 rounded-2xl border border-border bg-card p-6 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-lg font-semibold",
							children: ["New ", view === "rules" ? "rule" : "template"]
						}),
						view === "rules" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Rule name",
								required: true,
								placeholder: "Rule name",
								value: ruleForm.name,
								onChange: (e) => setRuleForm({
									...ruleForm,
									name: e.target.value
								}),
								className: "w-full rounded border border-border bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: ruleForm.match_field,
									onChange: (e) => setRuleForm({
										...ruleForm,
										match_field: e.target.value
									}),
									className: "rounded border border-border bg-background px-2 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "from_addr",
											children: "From"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "to_addr",
											children: "To"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "subject",
											children: "Subject"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "body",
											children: "Body"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "contains",
									required: true,
									placeholder: "contains…",
									value: ruleForm.match_value,
									onChange: (e) => setRuleForm({
										...ruleForm,
										match_value: e.target.value
									}),
									className: "rounded border border-border bg-background px-3 py-2 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: ruleForm.action,
									onChange: (e) => setRuleForm({
										...ruleForm,
										action: e.target.value
									}),
									className: "rounded border border-border bg-background px-2 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "label",
											children: "Apply label"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "forward",
											children: "Forward"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "move",
											children: "Move"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "reply",
											children: "Auto-reply"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "delete",
											children: "Delete"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									"aria-label": "value",
									placeholder: "value",
									value: ruleForm.action_value,
									onChange: (e) => setRuleForm({
										...ruleForm,
										action_value: e.target.value
									}),
									className: "rounded border border-border bg-background px-3 py-2 text-sm"
								})]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Template name",
								required: true,
								placeholder: "Template name",
								value: tplForm.name,
								onChange: (e) => setTplForm({
									...tplForm,
									name: e.target.value
								}),
								className: "w-full rounded border border-border bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: tplForm.category,
								onChange: (e) => setTplForm({
									...tplForm,
									category: e.target.value
								}),
								className: "w-full rounded border border-border bg-background px-2 py-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "general",
										children: "General"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "sales",
										children: "Sales"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "support",
										children: "Support"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "onboarding",
										children: "Onboarding"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "marketing",
										children: "Marketing"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Subject",
								placeholder: "Subject",
								value: tplForm.subject,
								onChange: (e) => setTplForm({
									...tplForm,
									subject: e.target.value
								}),
								className: "w-full rounded border border-border bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								"aria-label": "Body",
								placeholder: "Body",
								value: tplForm.body,
								onChange: (e) => setTplForm({
									...tplForm,
									body: e.target.value
								}),
								rows: 6,
								className: "w-full rounded border border-border bg-background px-3 py-2 text-sm"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowForm(false),
								className: "rounded-md border border-border px-3 py-1.5 text-sm",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground",
								children: "Save"
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { MailClient as component };
