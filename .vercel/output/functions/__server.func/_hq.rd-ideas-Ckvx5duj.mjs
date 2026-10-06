import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { B as ShieldCheck, Cn as Funnel, K as Send, Lr as ArrowUp, Pt as MessageCircle, Vn as EyeOff, Xt as Lightbulb, er as ClipboardCheck, mr as Check, n as X, nr as CircleX, p as UserPlus, q as Search, st as Plus, vr as Calendar, x as Trash2, y as TrendingUp } from "./_libs/lucide-react.mjs";
import { t as EscapeKey } from "./_ssr/EscapeKey-s0O3wTFo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.rd-ideas-Ckvx5duj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"new",
	"reviewing",
	"planned",
	"in-progress",
	"done",
	"archived"
];
var CATEGORIES = [
	"Product",
	"Manufacturing",
	"Sales",
	"Marketing",
	"Operations",
	"R&D",
	"Culture",
	"Other"
];
var STATUS_COLORS = {
	new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
	reviewing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	planned: "bg-purple-500/10 text-purple-500 border-purple-500/20",
	"in-progress": "bg-primary/10 text-primary border-primary/20",
	done: "bg-green-500/10 text-green-500 border-green-500/20",
	archived: "bg-muted text-muted-foreground border-border"
};
var APPROVAL_META = {
	pending: {
		label: "Pending review",
		className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
	},
	approved: {
		label: "Approved",
		className: "bg-green-500/10 text-green-500 border-green-500/20"
	},
	denied: {
		label: "Denied",
		className: "bg-destructive/10 text-destructive border-destructive/20"
	}
};
var VOTE_KEY = "hq-idea-votes";
function loadVoted() {
	if (typeof window === "undefined") return /* @__PURE__ */ new Set();
	try {
		return new Set(JSON.parse(localStorage.getItem(VOTE_KEY) ?? "[]"));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function saveVoted(s) {
	if (typeof window !== "undefined") localStorage.setItem(VOTE_KEY, JSON.stringify([...s]));
}
function timeAgo(iso) {
	const diff = (Date.now() - new Date(iso).getTime()) / 1e3;
	if (diff < 60) return "just now";
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
	return new Date(iso).toLocaleDateString();
}
function initials(name) {
	return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function IdeasPage() {
	const [ideas, setIdeas] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)({});
	const [teammates, setTeammates] = (0, import_react.useState)([]);
	const [userId, setUserId] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [approvalFilter, setApprovalFilter] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("top");
	const [error, setError] = (0, import_react.useState)(null);
	const [voted, setVoted] = (0, import_react.useState)(loadVoted);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		category: "Product",
		impact: 3,
		effort: 3,
		is_anonymous: false
	});
	const load = async () => {
		setLoading(true);
		const { data: u } = await supabase.auth.getUser();
		setUserId(u.user?.id ?? null);
		if (u.user) {
			const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
			setIsAdmin((roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin"));
		}
		const { data, error } = await supabase.from("ideas_masked").select("*").order("created_at", { ascending: false });
		if (error) setError(error.message);
		const list = data ?? [];
		setIdeas(list);
		const authorIds = Array.from(new Set([...list.map((i) => i.author_id), ...list.map((i) => i.assigned_to)].filter(Boolean)));
		if (authorIds.length) {
			const { data: p } = await supabase.from("profiles").select("id, full_name, email").in("id", authorIds);
			const map = {};
			(p ?? []).forEach((row) => {
				map[row.id] = row;
			});
			setProfiles(map);
		}
		const { data: all } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
		setTeammates(all ?? []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel("ideas-live").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "ideas"
		}, (payload) => {
			if (payload.eventType === "INSERT") {
				const n = payload.new;
				setIdeas((prev) => prev.some((x) => x.id === n.id) ? prev : [n, ...prev]);
			} else if (payload.eventType === "UPDATE") {
				const n = payload.new;
				setIdeas((prev) => prev.map((x) => x.id === n.id ? n : x));
				setDetail((d) => d && d.id === n.id ? n : d);
			} else if (payload.eventType === "DELETE") {
				const o = payload.old;
				setIdeas((prev) => prev.filter((x) => x.id !== o.id));
				setDetail((d) => d && d.id === o.id ? null : d);
			}
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		return ideas.filter((i) => {
			if (statusFilter !== "all" && i.status !== statusFilter) return false;
			if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
			if (approvalFilter !== "all" && i.approval_status !== approvalFilter) return false;
			if (search && !`${i.title} ${i.description ?? ""} ${i.category ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
			return true;
		}).sort((a, b) => {
			if (sort === "top") return b.upvotes - a.upvotes;
			if (sort === "impact") return b.impact - a.impact;
			if (sort === "roi") return b.impact / b.effort - a.impact / a.effort;
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		});
	}, [
		ideas,
		search,
		statusFilter,
		categoryFilter,
		approvalFilter,
		sort
	]);
	const stats = (0, import_react.useMemo)(() => ({
		total: ideas.length,
		pending: ideas.filter((i) => i.approval_status === "pending").length,
		approved: ideas.filter((i) => i.approval_status === "approved").length,
		done: ideas.filter((i) => i.status === "done").length
	}), [ideas]);
	const submit = async (e) => {
		e.preventDefault();
		if (!userId || !form.title.trim()) return;
		setError(null);
		const { error } = await supabase.from("ideas").insert({
			author_id: userId,
			title: form.title.trim(),
			description: form.description.trim() || null,
			category: form.category,
			impact: form.impact,
			effort: form.effort,
			is_anonymous: form.is_anonymous
		});
		if (error) {
			setError(error.message);
			return;
		}
		setForm({
			title: "",
			description: "",
			category: "Product",
			impact: 3,
			effort: 3,
			is_anonymous: false
		});
		setShowForm(false);
	};
	const toggleVote = async (idea) => {
		const has = voted.has(idea.id);
		const delta = has ? -1 : 1;
		const nextVoted = new Set(voted);
		if (has) nextVoted.delete(idea.id);
		else nextVoted.add(idea.id);
		setVoted(nextVoted);
		saveVoted(nextVoted);
		setIdeas((prev) => prev.map((i) => i.id === idea.id ? {
			...i,
			upvotes: Math.max(0, i.upvotes + delta)
		} : i));
		await supabase.from("ideas").update({ upvotes: Math.max(0, idea.upvotes + delta) }).eq("id", idea.id);
	};
	const updateStatus = async (idea, status) => {
		const { error } = await supabase.from("ideas").update({ status }).eq("id", idea.id);
		if (error) alert(error.message);
	};
	const setApproval = async (idea, approval_status, note) => {
		if (!userId) return;
		const patch = {
			approval_status,
			reviewed_by: userId,
			reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (note !== void 0) patch.review_note = note || null;
		const { error } = await supabase.from("ideas").update(patch).eq("id", idea.id);
		if (error) alert(error.message);
	};
	const assign = async (idea, assignee) => {
		const { error } = await supabase.from("ideas").update({ assigned_to: assignee }).eq("id", idea.id);
		if (error) alert(error.message);
	};
	const remove = async (idea) => {
		if (!confirm("Delete this idea?")) return;
		const { error } = await supabase.from("ideas").delete().eq("id", idea.id);
		if (error) alert(error.message);
	};
	const displayAuthor = (idea) => {
		if (!idea.author_id || idea.is_anonymous && !isAdmin && idea.author_id !== userId) return {
			name: "Anonymous",
			masked: true
		};
		const p = profiles[idea.author_id];
		return {
			name: p?.full_name || p?.email || "Someone",
			masked: idea.is_anonymous
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
							children: "Core · Ideas & Tips"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-semibold tracking-tight",
							children: "Ideas board"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Share ideas, drop anonymous tips, discuss in threads. Admins approve, deny, and assign."
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowForm((v) => !v),
					className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 hover:opacity-90",
					children: [showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), showForm ? "Cancel" : "New idea or tip"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						label: "Total submissions",
						value: stats.total,
						icon: Lightbulb
					},
					{
						label: "Pending review",
						value: stats.pending,
						icon: ClipboardCheck
					},
					{
						label: "Approved",
						value: stats.approved,
						icon: ShieldCheck
					},
					{
						label: "Shipped",
						value: stats.done,
						icon: TrendingUp
					}
				].map((s) => {
					const Icon = s.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-2xl font-semibold",
							children: s.value
						})]
					}, s.label);
				})
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mb-6 space-y-4 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Title",
						value: form.title,
						onChange: (e) => setForm({
							...form,
							title: e.target.value
						}),
						placeholder: "A short summary of your idea or tip",
						required: true,
						autoFocus: true,
						className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						"aria-label": "Details",
						value: form.description,
						onChange: (e) => setForm({
							...form,
							description: e.target.value
						}),
						rows: 4,
						placeholder: "What's the idea, why does it matter, and what would it change? Include context, examples, or links.",
						className: "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Category",
								value: form.category,
								onChange: (e) => setForm({
									...form,
									category: e.target.value
								}),
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
								children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Impact" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-foreground",
									children: [form.impact, "/5"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 1,
								max: 5,
								value: form.impact,
								onChange: (e) => setForm({
									...form,
									impact: Number(e.target.value)
								}),
								className: "w-full accent-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Effort" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-foreground",
									children: [form.effort, "/5"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 1,
								max: 5,
								value: form.effort,
								onChange: (e) => setForm({
									...form,
									effort: Number(e.target.value)
								}),
								className: "w-full accent-primary"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.is_anonymous,
							onChange: (e) => setForm({
								...form,
								is_anonymous: e.target.checked
							}),
							className: "mt-0.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }), " Submit as anonymous tip"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-xs text-muted-foreground",
							children: "Your name will be hidden from teammates. Super-admins can still see the submitter for audit and abuse prevention."
						})] })]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowForm(false),
							className: "rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
							children: "Submit"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-[220px] flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search ideas…",
							className: "w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-2 py-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "ml-1 h-3.5 w-3.5 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: approvalFilter,
								onChange: (e) => setApprovalFilter(e.target.value),
								className: "bg-transparent px-1 py-1 text-sm outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All approvals"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "approved",
										children: "Approved"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "denied",
										children: "Denied"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: statusFilter,
								onChange: (e) => setStatusFilter(e.target.value),
								className: "bg-transparent px-1 py-1 text-sm outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All statuses"
								}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: categoryFilter,
								onChange: (e) => setCategoryFilter(e.target.value),
								className: "bg-transparent px-1 py-1 text-sm outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All categories"
								}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex overflow-hidden rounded-lg border border-border bg-card text-xs",
						children: [
							"top",
							"recent",
							"roi",
							"impact"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSort(k),
							className: `px-3 py-2 transition ${sort === k ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
							children: k === "top" ? "Top voted" : k === "recent" ? "Newest" : k === "roi" ? "Best ROI" : "Impact"
						}, k))
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading ideas…"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed border-border p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: ideas.length === 0 ? "No ideas yet. Be the first to share one!" : "No ideas match your filters."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: filtered.map((idea) => {
					const has = voted.has(idea.id);
					const author = displayAuthor(idea);
					const roi = (idea.impact / idea.effort).toFixed(1);
					const approval = APPROVAL_META[idea.approval_status] ?? APPROVAL_META.pending;
					const assignee = idea.assigned_to ? profiles[idea.assigned_to] : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						onClick: () => setDetail(idea),
						className: "group cursor-pointer rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${approval.className}`,
													children: approval.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[idea.status] ?? STATUS_COLORS.new}`,
													children: idea.status
												}),
												idea.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
													children: idea.category
												}),
												idea.is_anonymous && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3" }), " Anon"]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-2 font-semibold group-hover:text-primary",
											children: idea.title
										}),
										idea.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted-foreground line-clamp-2",
											children: idea.description
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: (e) => {
										e.stopPropagation();
										toggleVote(idea);
									},
									className: `flex flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5 text-xs transition ${has ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary hover:bg-primary/5"}`,
									"aria-label": "Upvote",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: idea.upvotes
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-3 gap-2 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded bg-muted/40 p-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: "Impact"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold",
											children: [idea.impact, "/5"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded bg-muted/40 p-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: "Effort"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold",
											children: [idea.effort, "/5"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded bg-primary/10 p-2 text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-wider",
											children: "ROI"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold",
											children: [roi, "×"]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary",
										children: author.masked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3" }) : initials(author.name)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: author.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex shrink-0 items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
										" ",
										timeAgo(idea.created_at)
									]
								})]
							}),
							assignee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-1 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3 w-3" }),
									" Assigned to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: assignee.full_name || assignee.email
									})
								]
							})
						]
					}, idea.id);
				})
			}),
			detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaDetail, {
				idea: detail,
				onClose: () => setDetail(null),
				userId,
				isAdmin,
				profiles,
				teammates,
				voted,
				onVote: toggleVote,
				onStatus: updateStatus,
				onApprove: (note) => setApproval(detail, "approved", note),
				onDeny: (note) => setApproval(detail, "denied", note),
				onAssign: (uid) => assign(detail, uid),
				onDelete: () => remove(detail),
				displayAuthor
			})
		]
	});
}
function IdeaDetail(props) {
	const { idea, onClose, userId, isAdmin, profiles, teammates, voted, onVote, onStatus, onApprove, onDeny, onAssign, onDelete, displayAuthor } = props;
	const [comments, setComments] = (0, import_react.useState)([]);
	const [commentBody, setCommentBody] = (0, import_react.useState)("");
	const [commentAnon, setCommentAnon] = (0, import_react.useState)(false);
	const [reviewNote, setReviewNote] = (0, import_react.useState)(idea.review_note ?? "");
	const [posting, setPosting] = (0, import_react.useState)(false);
	const [commentProfiles, setCommentProfiles] = (0, import_react.useState)({});
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("idea_comments_masked").select("*").eq("idea_id", idea.id).order("created_at", { ascending: true });
			const list = data ?? [];
			setComments(list);
			const ids = Array.from(new Set(list.map((c) => c.author_id).filter(Boolean)));
			if (ids.length) {
				const { data: p } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
				const map = {};
				(p ?? []).forEach((row) => {
					map[row.id] = row;
				});
				setCommentProfiles(map);
			}
		})();
	}, [idea.id]);
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel(`idea-comments-${idea.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "idea_comments",
			filter: `idea_id=eq.${idea.id}`
		}, (payload) => {
			const c = payload.new;
			setComments((prev) => {
				if (prev.some((x) => x.id === c.id)) return prev;
				const idx = prev.findIndex((x) => x.id.startsWith("tmp-") && x.author_id === c.author_id && x.body === c.body);
				if (idx >= 0) {
					const next = prev.slice();
					next[idx] = c;
					return next;
				}
				return [...prev, c];
			});
		}).on("postgres_changes", {
			event: "DELETE",
			schema: "public",
			table: "idea_comments",
			filter: `idea_id=eq.${idea.id}`
		}, (payload) => {
			const id = payload.old.id;
			setComments((prev) => prev.filter((x) => x.id !== id));
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [idea.id]);
	(0, import_react.useEffect)(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [comments]);
	const postComment = async (e) => {
		e.preventDefault();
		if (!commentBody.trim() || !userId) return;
		setPosting(true);
		const body = commentBody.trim();
		const anon = commentAnon;
		setCommentBody("");
		setCommentAnon(false);
		const tempId = `tmp-${crypto.randomUUID()}`;
		setComments((prev) => [...prev, {
			id: tempId,
			idea_id: idea.id,
			author_id: userId,
			body,
			is_anonymous: anon,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		const { data, error } = await supabase.from("idea_comments").insert({
			idea_id: idea.id,
			author_id: userId,
			body,
			is_anonymous: anon
		}).select().single();
		if (error) {
			setComments((prev) => prev.filter((c) => c.id !== tempId));
			alert(error.message);
		} else if (data) setComments((prev) => prev.map((c) => c.id === tempId ? data : c));
		setPosting(false);
	};
	const removeComment = async (id) => {
		setComments((prev) => prev.filter((c) => c.id !== id));
		await supabase.from("idea_comments").delete().eq("id", id);
	};
	const commentAuthor = (c) => {
		if (!c.author_id || c.is_anonymous && !isAdmin && c.author_id !== userId) return {
			name: "Anonymous",
			masked: true
		};
		const p = commentProfiles[c.author_id] || profiles[c.author_id];
		return {
			name: p?.full_name || p?.email || "Someone",
			masked: c.is_anonymous
		};
	};
	const author = displayAuthor(idea);
	const approval = APPROVAL_META[idea.approval_status] ?? APPROVAL_META.pending;
	const canEditStatus = isAdmin || idea.author_id === userId || idea.assigned_to === userId;
	const assignee = idea.assigned_to ? teammates.find((t) => t.id === idea.assigned_to) : null;
	const reviewer = idea.reviewed_by ? teammates.find((t) => t.id === idea.reviewed_by) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
		onClick: onClose,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Details",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EscapeKey, { onEscape: onClose }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			className: "flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-card shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 border-b border-border p-6 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${approval.className}`,
										children: approval.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_COLORS[idea.status] ?? STATUS_COLORS.new}`,
										children: idea.status
									}),
									idea.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground",
										children: idea.category
									}),
									idea.is_anonymous && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3" }), " Anonymous"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-2xl font-semibold",
								children: idea.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"by ",
									author.name,
									author.masked && isAdmin ? " (admin view)" : "",
									" · ",
									timeAgo(idea.created_at),
									assignee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · assigned to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: assignee.full_name || assignee.email
									})] })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "shrink-0 rounded-lg p-2 hover:bg-muted",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6 overflow-y-auto p-6",
					children: [
						idea.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-sm leading-relaxed",
							children: idea.description
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm italic text-muted-foreground",
							children: "No description provided."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-4 gap-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted-foreground",
										children: "Votes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xl font-bold",
										children: idea.upvotes
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted-foreground",
										children: "Impact"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xl font-bold",
										children: [idea.impact, "/5"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/40 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted-foreground",
										children: "Effort"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xl font-bold",
										children: [idea.effort, "/5"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-primary/10 p-3 text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider",
										children: "ROI"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xl font-bold",
										children: [(idea.impact / idea.effort).toFixed(1), "×"]
									})]
								})
							]
						}),
						idea.review_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-muted/40 p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }),
									" Reviewer note",
									reviewer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", reviewer.full_name || reviewer.email] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap",
								children: idea.review_note
							})]
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Admin controls"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: reviewNote,
									onChange: (e) => setReviewNote(e.target.value),
									rows: 2,
									placeholder: "Optional review note (visible to everyone)…",
									className: "w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => onApprove(reviewNote),
											className: "flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Approve"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => onDeny(reviewNote),
											className: "flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:opacity-90",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), " Deny"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: idea.assigned_to ?? "",
												onChange: (e) => onAssign(e.target.value || null),
												className: "bg-transparent py-1 pr-2 text-xs outline-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Unassigned"
												}), teammates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: t.id,
													children: t.full_name || t.email
												}, t.id))]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: onDelete,
											className: "ml-auto flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "flex items-center gap-2 text-sm font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }),
										" Discussion (",
										comments.length,
										")"
									]
								}), canEditStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: idea.status,
									onChange: (e) => onStatus(idea, e.target.value),
									className: "rounded border border-border bg-background px-2 py-1 text-xs outline-none",
									children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								ref: scrollRef,
								className: "max-h-72 space-y-3 overflow-y-auto rounded-lg border border-border bg-background/50 p-3",
								children: comments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "py-6 text-center text-xs text-muted-foreground",
									children: "No comments yet. Start the discussion."
								}) : comments.map((c) => {
									const a = commentAuthor(c);
									const mine = c.author_id === userId;
									const opt = c.id.startsWith("tmp-");
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group flex gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary",
												children: a.masked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3" }) : initials(a.name)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-baseline gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-semibold",
															children: a.name
														}),
														a.masked && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[9px] italic text-muted-foreground",
															children: "admin view"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-muted-foreground",
															children: timeAgo(c.created_at)
														}),
														opt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] italic text-muted-foreground",
															children: "sending…"
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: `whitespace-pre-wrap text-sm ${opt ? "opacity-70" : ""}`,
													children: c.body
												})]
											}),
											(mine || isAdmin) && !opt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removeComment(c.id),
												className: "shrink-0 rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100",
												"aria-label": "Delete comment",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
											})
										]
									}, c.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: postComment,
								className: "mt-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: commentBody,
										onChange: (e) => setCommentBody(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												postComment(e);
											}
										},
										rows: 1,
										placeholder: "Add to the discussion…",
										className: "max-h-32 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: !commentBody.trim() || posting,
										className: "rounded-lg bg-primary p-2 text-primary-foreground disabled:opacity-40",
										"aria-label": "Post",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: commentAnon,
											onChange: (e) => setCommentAnon(e.target.checked)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3" }),
										" Post anonymously (admins can still see who you are)"
									]
								})]
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 border-t border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onVote(idea),
						className: `flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${voted.has(idea.id) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4 w-4" }),
							" ",
							voted.has(idea.id) ? "Voted" : "Upvote",
							" · ",
							idea.upvotes
						]
					}), idea.author_id === userId && !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onDelete,
						className: "rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10",
						children: "Delete my idea"
					})]
				})
			]
		})]
	});
}
//#endregion
export { IdeasPage as component };
