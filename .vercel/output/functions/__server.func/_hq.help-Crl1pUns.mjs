import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B7QlDyqv.mjs";
import { K as Send, St as Palette, Zt as LifeBuoy, d as User, jr as Bell, kr as BookOpen, nn as KeyRound, q as Search } from "./_libs/lucide-react.mjs";
import { t as UserMention } from "./_ssr/UserMention-D5WbdqmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.help-Crl1pUns.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUICK = [
	{
		icon: KeyRound,
		title: "Reset your password",
		desc: "Sign out and use the ‘Forgot password’ flow on the login page.",
		to: "/hq-login"
	},
	{
		icon: User,
		title: "Update your profile",
		desc: "Change your name, avatar, and department.",
		to: "/profile"
	},
	{
		icon: Palette,
		title: "Change theme",
		desc: "Switch between light and dark mode.",
		to: "/settings"
	},
	{
		icon: Bell,
		title: "Notifications",
		desc: "See recent alerts and mark them read.",
		to: "/notifications"
	}
];
var STARTER_DOCS = [
	{
		id: "d1",
		title: "Getting started with Clovr HQ",
		body: "Tour the sidebar, record tabs, and quick add. Your workspace is organized by team — Product, Growth, Customer Service, HR & Administration.",
		category: "Basics"
	},
	{
		id: "d2",
		title: "How to reset your password",
		body: "Sign out from the sidebar footer. On the login page click ‘Forgot password’ and follow the emailed link. If email doesn't arrive, contact Operations below.",
		category: "Account"
	},
	{
		id: "d3",
		title: "Booking a meeting",
		body: "Open Meetings, click New meeting, invite attendees via @mention. Recurring meetings support daily, weekly, biweekly, monthly. Time is auto-logged for attendees.",
		category: "Software"
	},
	{
		id: "d4",
		title: "Requesting time off",
		body: "People → Time Off. Submit a request, your manager gets a notification. Approved days appear on the team calendar.",
		category: "HR"
	},
	{
		id: "d5",
		title: "Reporting an outage",
		body: "Use the Contact Operations form below. Set urgency to ‘Urgent’ for production/customer impact. Ops is paged for urgent tickets.",
		category: "IT"
	},
	{
		id: "d6",
		title: "Using the AI Assistant",
		body: "The Assistant page can draft emails, summarize threads, and search across HQ. It respects your role permissions.",
		category: "Software"
	}
];
function HelpPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [opsUser, setOpsUser] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		subject: "",
		urgency: "normal",
		body: ""
	});
	const [sending, setSending] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("admin_settings").select("value").eq("key", "ops_support_user_id").maybeSingle();
			const uid = (data?.value)?.user_id;
			if (uid) {
				const { data: p } = await supabase.from("profiles").select("id, full_name, email").eq("id", uid).maybeSingle();
				if (p) setOpsUser({
					id: p.id,
					name: p.full_name || p.email || "Operations"
				});
			}
		})();
	}, []);
	const filtered = STARTER_DOCS.filter((d) => {
		if (!query) return true;
		const q = query.toLowerCase();
		return d.title.toLowerCase().includes(q) || (d.body ?? "").toLowerCase().includes(q) || (d.category ?? "").toLowerCase().includes(q);
	});
	const submit = async (e) => {
		e.preventDefault();
		if (!form.subject.trim()) return;
		setSending(true);
		const { data: u } = await supabase.auth.getUser();
		await supabase.from("cs_tickets").insert({
			subject: form.subject,
			description: form.body,
			priority: form.urgency === "urgent" ? "high" : form.urgency,
			channel: "internal",
			status: "open",
			assignee_id: opsUser?.id ?? null,
			created_by: u.user?.id ?? null
		});
		setSending(false);
		setSent(true);
		setForm({
			subject: "",
			urgency: "normal",
			body: ""
		});
		setTimeout(() => setSent(false), 4e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: "Support"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-semibold tracking-tight",
						children: "Help & Support"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Self-serve docs and a direct line to Operations."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-semibold text-foreground",
					children: "Quick self-serve"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: QUICK.map((q) => {
						const Icon = q.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: q.to,
							className: "group rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm font-semibold text-foreground",
									children: q.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
									children: q.desc
								})
							]
						}, q.title);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-foreground",
						children: "Internal docs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-64 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search docs…",
							className: "flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
					children: [filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							className: "flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 flex-shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-foreground",
									children: d.title
								}), d.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-wider text-muted-foreground",
									children: d.category
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border bg-muted/30 px-4 py-3 text-sm text-foreground/80",
							children: d.body
						})]
					}, d.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "px-4 py-6 text-center text-sm text-muted-foreground",
						children: [
							"No docs match “",
							query,
							"”."
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "flex items-center gap-2 text-sm font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-4 w-4 text-primary" }), " Contact Operations"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Can't self-serve? Send a ticket to the operations team."
					})] }), opsUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "On call:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
							userId: opsUser.id,
							name: opsUser.name
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-muted-foreground",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Subject",
							value: form.subject,
							onChange: (e) => setForm({
								...form,
								subject: e.target.value
							}),
							required: true,
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
							placeholder: "Short summary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-muted-foreground",
							children: "Urgency"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": "Urgency",
							value: form.urgency,
							onChange: (e) => setForm({
								...form,
								urgency: e.target.value
							}),
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "low",
									children: "Low — general question"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "normal",
									children: "Normal — needs attention this week"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "high",
									children: "High — blocking work"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "urgent",
									children: "Urgent — production / customer impact"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-muted-foreground",
							children: "Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							"aria-label": "Details",
							value: form.body,
							onChange: (e) => setForm({
								...form,
								body: e.target.value
							}),
							rows: 4,
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
							placeholder: "What's happening? Include any error messages or steps to reproduce."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-success",
								children: "Ticket sent — Operations will follow up."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Your ticket is logged in Customer Service → Tickets."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: sending || !form.subject.trim(),
								className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), sending ? "Sending…" : "Send to Operations"]
							})]
						})
					]
				})]
			}) })
		]
	});
}
//#endregion
export { HelpPage as component };
