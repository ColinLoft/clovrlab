import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { S as useNavigate, _ as Outlet, p as useRouterState, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { $t as LayoutDashboard, D as Sun, Dt as Moon, Ft as Menu, Ht as LogOut, Mr as BellRing, Rr as ArrowUpRight, U as Settings, Ut as Lock, bt as PanelLeftOpen, ft as Phone, hr as CheckCheck, jr as Bell, mr as Check, n as X, pr as ChevronDown, q as Search, rr as CircleQuestionMark, ur as ChevronsUpDown, v as TriangleAlert, xt as PanelLeftClose } from "./_libs/lucide-react.mjs";
import { a as stopSound, i as playSound, o as usePhone, r as playSiren, t as PhoneProvider } from "./_ssr/phone-BVB7nyHS.mjs";
import { n as navGroups, t as navForApp } from "./_ssr/nav-config-BQNdxmMi.mjs";
import { n as appUrl } from "./_ssr/apps-Dhu7lH49.mjs";
import { t as useRouteAccess } from "./_ssr/route-access-D4Pf6U6G.mjs";
import { t as toast } from "./_ssr/notify-Cokq0_dZ.mjs";
import { r as useCurrentApp, t as CurrentAppProvider } from "./_ssr/app-context-7ehkzQ_t.mjs";
import { i as ackPage, u as fetchMyLivePages, v as resolvePage } from "./_ssr/paging-Ch4naRed.mjs";
import { c as useHQTheme, i as getStoredTheme, n as applyTheme, o as resolveTheme, r as cachedPrefs } from "./_ssr/prefs-CI_11sXZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq-LZFm4htN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "hq.sidebar.collapsed";
var ALWAYS_VISIBLE = /* @__PURE__ */ new Set([
	"/dashboard",
	"/settings",
	"/profile",
	"/notifications",
	"/search",
	"/teams"
]);
function Sidebar({ onNavigate, onCollapse }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)({});
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const access = useRouteAccess();
	const { app } = useCurrentApp();
	const permittedGroups = (0, import_react.useMemo)(() => {
		const custom = navForApp(app?.slug);
		const inApp = custom ? custom : app && app.nav_groups.length > 0 ? navGroups.filter((g) => app.nav_groups.includes(g.label)) : navGroups;
		if (access.isAdmin || access.allowed === null) return inApp;
		return inApp.map((g) => ({
			...g,
			items: g.items.filter((i) => ALWAYS_VISIBLE.has(i.to) || access.allowed.has(i.to))
		})).filter((g) => g.items.length > 0);
	}, [access, app]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setCollapsed(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			const { data: p } = await supabase.from("profiles").select("full_name, email, department").eq("id", u.user.id).maybeSingle();
			if (p) setProfile(p);
		})();
	}, []);
	const toggle = (label) => {
		setCollapsed((prev) => {
			const next = {
				...prev,
				[label]: !prev[label]
			};
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {}
			return next;
		});
	};
	const initials = (profile?.full_name || profile?.email || "?").split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
	const onSearch = (e) => {
		e.preventDefault();
		const q = query.trim();
		navigate({
			to: "/search",
			search: q ? { q } : void 0
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"data-tour": "sidebar",
		className: "flex h-full flex-col text-sidebar-foreground",
		style: { background: "var(--sidebar-gradient)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl bg-white/[0.06] px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-[10px] font-black text-sidebar-accent-foreground",
							children: app?.short_code || "CL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[13px] font-semibold text-sidebar-foreground",
								children: app?.label || "Clovr Labs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[11px] text-sidebar-muted",
								children: app?.tagline || (profile?.department ? `${profile.department} workspace` : "Internal workspace")
							})]
						})]
					}), onCollapse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onCollapse,
						className: "hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-sidebar-muted hover:bg-white/[0.10] hover:text-sidebar-foreground lg:flex",
						"aria-label": "Collapse sidebar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: onSearch,
				"data-tour": "search",
				className: "px-3 pt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-xl bg-[color-mix(in_oklab,var(--sidebar-foreground)_6%,transparent)] px-3 py-2 focus-within:bg-[color-mix(in_oklab,var(--sidebar-foreground)_10%,transparent)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-sidebar-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search everything…",
							className: "flex-1 bg-transparent text-[13px] text-sidebar-foreground outline-none placeholder:text-sidebar-muted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-[color-mix(in_oklab,var(--sidebar-foreground)_12%,transparent)] px-1.5 py-0.5 text-[10px] font-mono text-sidebar-muted",
							children: "⌘K"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-2 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: permittedGroups.map((group) => {
					const isCollapsed = collapsed[group.label];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggle(group.label),
							className: "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted hover:text-sidebar-foreground",
							children: [group.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3 w-3 transition ${isCollapsed ? "-rotate-90" : ""}` })]
						}), !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 space-y-0.5",
							children: group.items.map((item) => {
								const active = pathname === item.to || item.to === "/dashboard" && pathname === "/";
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									onClick: onNavigate,
									className: `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_4px_14px_-6px_var(--sidebar-accent)]" : "text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-[15px] w-[15px] flex-shrink-0 ${active ? "" : "text-sidebar-muted group-hover:text-sidebar-foreground"}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 truncate",
											children: item.label
										}),
										item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${active ? "bg-white/20 text-sidebar-accent-foreground" : "bg-sidebar-accent/25 text-sidebar-foreground"}`,
											children: item.badge
										})
									]
								}, item.to);
							})
						})]
					}, group.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-sidebar-border px-3 py-2 text-[13px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/help",
					onClick: onNavigate,
					className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/75 hover:bg-sidebar-hover hover:text-sidebar-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-[15px] w-[15px] text-sidebar-muted" }), "Help & Support"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-sidebar-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-hover",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							onClick: onNavigate,
							className: "flex min-w-0 flex-1 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground",
								children: initials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[13px] font-medium text-sidebar-foreground",
									children: profile?.full_name || "Staff"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] text-sidebar-muted",
									children: profile?.department || profile?.email || "Team member"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							onClick: onNavigate,
							className: "rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground",
							"aria-label": "Settings",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								await supabase.auth.signOut();
								window.location.href = "/hq-login";
							},
							className: "rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground",
							"aria-label": "Sign out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" })
						})
					]
				})
			})
		]
	});
}
var KEY$1 = "hq.recordTabs.v1";
var DEFAULT_TABS = [{
	id: "dashboard",
	label: "Dashboard",
	to: "/dashboard",
	pinned: true
}];
var RecordTabsCtx = (0, import_react.createContext)(null);
function RecordTabsProvider({ children }) {
	const [tabs, setTabs] = (0, import_react.useState)(DEFAULT_TABS);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY$1);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed) && parsed.length > 0) setTabs(parsed);
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(KEY$1, JSON.stringify(tabs));
		} catch {}
	}, [tabs]);
	const openTab = (0, import_react.useCallback)((tab) => {
		setTabs((prev) => {
			if (prev.some((t) => t.id === tab.id)) return prev;
			return [...prev, tab];
		});
	}, []);
	const closeTab = (0, import_react.useCallback)((id) => {
		setTabs((prev) => prev.filter((t) => t.id === id ? t.pinned === true : true));
	}, []);
	const clear = (0, import_react.useCallback)(() => setTabs(DEFAULT_TABS), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordTabsCtx.Provider, {
		value: {
			tabs,
			openTab,
			closeTab,
			clear
		},
		children
	});
}
function useRecordTabs() {
	const ctx = (0, import_react.useContext)(RecordTabsCtx);
	if (!ctx) throw new Error("useRecordTabs must be used within RecordTabsProvider");
	return ctx;
}
function RecordTabs() {
	const { tabs, closeTab } = useRecordTabs();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-0 overflow-x-auto px-3 pt-2 pb-0",
		children: tabs.map((tab, idx) => {
			const active = pathname === tab.to || tab.id === "dashboard" && pathname === "/";
			const prev = tabs[idx - 1];
			const prevActive = prev && (pathname === prev.to || prev.id === "dashboard" && pathname === "/");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center",
				children: [idx > 0 && !active && !prevActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "mx-0.5 h-4 w-px bg-border/70"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "mx-0.5 h-4 w-px bg-transparent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `group relative flex h-9 items-center gap-2 rounded-t-lg border border-b-0 pl-3 pr-1.5 text-[13px] transition ${active ? "border-border bg-card text-foreground shadow-[0_-2px_0_0_var(--color-primary)_inset]" : "border-transparent bg-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						className: "flex items-center gap-2",
						children: [tab.id === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-[180px] truncate",
							children: tab.label
						})]
					}), !tab.pinned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();
							closeTab(tab.id);
						},
						className: "ml-1 flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground/70 transition hover:bg-muted hover:text-foreground",
						"aria-label": `Close ${tab.label}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
					})]
				})]
			}, tab.id);
		})
	});
}
function Topbar({ onMenuClick }) {
	const [unread, setUnread] = (0, import_react.useState)(0);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [notifs, setNotifs] = (0, import_react.useState)([]);
	const { theme, setTheme } = useHQTheme();
	const { permitted: allPermitted, app: current } = useCurrentApp();
	const permitted = allPermitted.filter((a) => !a.is_hub);
	const { incoming, acceptIncoming, declineIncoming } = usePhone();
	const navigate = useNavigate();
	const loadNotifs = async () => {
		const { data } = await supabase.from("notifications").select("id, title, body, link, created_at, read_at").order("created_at", { ascending: false }).limit(12);
		if (data) setNotifs(data);
		const { count } = await supabase.from("notifications").select("*", {
			count: "exact",
			head: true
		}).is("read_at", null);
		if (count !== null) setUnread(count);
	};
	(0, import_react.useEffect)(() => {
		let channel = null;
		let cancelled = false;
		(async () => {
			const { data } = await supabase.auth.getUser();
			const uid = data.user?.id;
			if (!uid || cancelled) return;
			channel = supabase.channel("topbar-notifications").on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "notifications",
				filter: `user_id=eq.${uid}`
			}, (payload) => {
				const n = payload.new;
				setNotifs((cur) => [n, ...cur].slice(0, 12));
				setUnread((c) => c + 1);
				playSound("notification");
				toast.info(n.title ?? "New notification");
			}).subscribe();
		})();
		return () => {
			cancelled = true;
			if (channel) supabase.removeChannel(channel);
		};
	}, []);
	const openNotif = async (n) => {
		if (!n.read_at) {
			await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", n.id);
			setNotifs((cur) => cur.map((x) => x.id === n.id ? {
				...x,
				read_at: (/* @__PURE__ */ new Date()).toISOString()
			} : x));
			setUnread((c) => Math.max(0, c - 1));
		}
		setOpen(null);
		if (n.link) navigate({ to: n.link });
	};
	const markAllRead = async () => {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).is("read_at", null);
		setNotifs((cur) => cur.map((n) => ({
			...n,
			read_at: n.read_at ?? (/* @__PURE__ */ new Date()).toISOString()
		})));
		setUnread(0);
	};
	(0, import_react.useEffect)(() => {
		loadNotifs();
	}, []);
	(0, import_react.useEffect)(() => {
		if (open === "notif") loadNotifs();
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onDoc = (e) => {
			if (!e.target.closest("[data-topbar-menu]")) setOpen(null);
		};
		const id = setTimeout(() => document.addEventListener("mousedown", onDoc), 0);
		return () => {
			clearTimeout(id);
			document.removeEventListener("mousedown", onDoc);
		};
	}, [open]);
	const toggle = (which) => setOpen((cur) => cur === which ? null : which);
	const iconBtn = "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition hover:bg-muted hover:border-primary/40";
	const iconBtnActive = "border-primary/60 bg-primary/10 text-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl",
		children: [
			incoming && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-emerald-500/30 bg-emerald-500/10 px-4 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 animate-pulse" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: incoming.fromName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300",
							children: "Incoming call…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: acceptIncoming,
						className: "rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600",
						children: "Accept"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: declineIncoming,
						className: "rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600",
						children: "Decline"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-12 items-center gap-2 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-lg p-2 hover:bg-muted lg:hidden",
						onClick: onMenuClick,
						"aria-label": "Menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						"data-topbar-menu": true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggle("apps"),
							className: `flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-foreground shadow-sm transition hover:bg-muted hover:border-primary/40 ${open === "apps" ? iconBtnActive : ""}`,
							"aria-label": "Switch workspace",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold uppercase",
									style: {
										background: current?.accent ? `color-mix(in oklab, ${current.accent} 20%, transparent)` : "color-mix(in oklab, var(--primary) 16%, transparent)",
										color: current?.accent ?? "var(--primary)"
									},
									children: (current?.short_code || current?.subdomain || "hq").slice(0, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden max-w-[160px] truncate text-[13px] font-medium sm:block",
									children: current?.label ?? "Workspace"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "h-3.5 w-3.5 text-muted-foreground" })
							]
						}), open === "apps" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 top-12 w-80 rounded-xl border border-border bg-card p-2 shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Switch workspace"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-h-[360px] space-y-0.5 overflow-y-auto",
									children: [permitted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-2 py-4 text-center text-xs text-muted-foreground",
										children: "No workspaces assigned."
									}), permitted.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: appUrl(a),
										onClick: () => {
											try {
												sessionStorage.setItem("hq.app.override", a.subdomain);
											} catch {}
											setOpen(null);
										},
										className: `flex items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-muted ${current?.id === a.id ? "bg-primary/10" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold uppercase",
												style: {
													background: a.accent ? `color-mix(in oklab, ${a.accent} 18%, transparent)` : "color-mix(in oklab, var(--primary) 14%, transparent)",
													color: a.accent ?? "var(--primary)"
												},
												children: (a.short_code || a.subdomain).slice(0, 2)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block truncate text-[13px] font-medium",
													children: a.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block truncate text-[11px] text-muted-foreground",
													children: a.tagline || a.subdomain
												})]
											}),
											current?.id === a.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 shrink-0 text-primary" })
										]
									}, a.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "/workspaces",
									onClick: () => setOpen(null),
									className: "mt-1 flex items-center gap-1.5 border-t border-border px-2 pt-2 text-[12px] font-medium text-primary hover:underline",
									children: ["All workspaces ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTheme(resolveTheme(theme) === "dark" ? "light" : "dark"),
						className: iconBtn,
						"aria-label": "Toggle light or dark mode",
						children: resolveTheme(theme) === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						"data-topbar-menu": true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggle("notif"),
							className: `${iconBtn} ${open === "notif" ? iconBtnActive : ""}`,
							"aria-label": "Notifications",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground shadow",
								children: unread > 9 ? "9+" : unread
							})]
						}), open === "notif" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-0 top-12 w-80 rounded-xl border border-border bg-card p-1 shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Notifications"
									}), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: markAllRead,
										className: "flex items-center gap-1 text-xs font-medium text-primary hover:underline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3.5 w-3.5" }), " Mark all read"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "All caught up"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-h-80 overflow-y-auto",
									children: [notifs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-3 py-6 text-center text-xs text-muted-foreground",
										children: "No notifications"
									}), notifs.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void openNotif(n),
										className: `block w-full border-b border-border/50 px-3 py-2 text-left text-sm transition last:border-0 hover:bg-muted ${!n.read_at ? "bg-primary/5" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "flex items-center gap-1.5 truncate font-medium",
												children: [!n.read_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }), n.title ?? "Notification"]
											}),
											n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "line-clamp-2 text-xs text-muted-foreground",
												children: n.body
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-0.5 text-[10px] text-muted-foreground",
												children: [new Date(n.created_at).toLocaleString(), n.link ? " · tap to open" : ""]
											})
										]
									}, n.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/notifications",
									onClick: () => setOpen(null),
									className: "block border-t border-border px-3 py-2 text-center text-xs font-medium text-primary hover:bg-muted",
									children: "View all notifications →"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordTabs, {})
		]
	});
}
var MENTION_RE = /@\[([^\]]+)\]\(([0-9a-fA-F-]{36})\)/g;
/** Extract distinct mentioned user IDs from a message body. */
function extractMentionIds(body) {
	const ids = /* @__PURE__ */ new Set();
	let m;
	const re = new RegExp(MENTION_RE.source, "g");
	while ((m = re.exec(body)) !== null) ids.add(m[2]);
	return Array.from(ids);
}
/** Does this body mention the given user? */
function bodyMentions(body, userId) {
	if (!body) return false;
	return extractMentionIds(body).includes(userId);
}
/**
* Site-wide sound effects + browser notifications. Subscribes to realtime
* inserts on notifications, direct_messages, and channel_messages for the
* current user. Silent for messages the user sent themselves.
*/
function SoundNotifier() {
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let channels = [];
		const askPerm = () => {
			if (typeof Notification !== "undefined" && Notification.permission === "default") Notification.requestPermission().catch(() => {});
			window.removeEventListener("click", askPerm);
			window.removeEventListener("keydown", askPerm);
		};
		window.addEventListener("click", askPerm, { once: true });
		window.addEventListener("keydown", askPerm, { once: true });
		const showNotif = (title, body) => {
			if (!cachedPrefs().notifyDesktop) return;
			if (typeof Notification !== "undefined" && Notification.permission === "granted" && document.visibilityState !== "visible") try {
				new Notification(title, {
					body: body?.slice(0, 200),
					silent: true
				});
			} catch {}
		};
		(async () => {
			const { data } = await supabase.auth.getUser();
			const uid = data.user?.id;
			if (!uid || cancelled) return;
			channels = [
				supabase.channel(`sfx:notif:${uid}`).on("postgres_changes", {
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${uid}`
				}, (p) => {
					const row = p.new || {};
					if (cachedPrefs().soundOn) playSound("notification");
					showNotif(row.title || "New notification", row.body || void 0);
				}).subscribe(),
				supabase.channel(`sfx:dm:${uid}`).on("postgres_changes", {
					event: "INSERT",
					schema: "public",
					table: "direct_messages"
				}, (p) => {
					const row = p.new || {};
					if (row.sender_id === uid) return;
					if (row.recipient_id && row.recipient_id !== uid) return;
					if (cachedPrefs().soundOn) playSound("message");
				}).subscribe(),
				supabase.channel(`sfx:ch:${uid}`).on("postgres_changes", {
					event: "INSERT",
					schema: "public",
					table: "channel_messages"
				}, (p) => {
					const row = p.new || {};
					if (row.author_id === uid || row.user_id === uid || row.sender_id === uid) return;
					const mentioned = Array.isArray(row.mentions) && row.mentions.includes(uid) || bodyMentions(row.body, uid);
					const sound = cachedPrefs().soundOn;
					if (mentioned) {
						if (sound) playSound("notification");
						showNotif("You were mentioned", row.body);
					} else if (sound) playSound("message");
				}).subscribe()
			];
		})();
		return () => {
			cancelled = true;
			channels.forEach((c) => supabase.removeChannel(c));
		};
	}, []);
	return null;
}
/**
* Site-wide pager. When an urgent page targets the signed-in operator this
* takes over the screen, sounds a loud repeating siren and fires a sticky
* desktop notification until someone acknowledges it.
*/
function Pager() {
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const seen = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const notifRef = (0, import_react.useRef)(null);
	const active = queue[0] ?? null;
	const push = (0, import_react.useCallback)((rows) => {
		setQueue((q) => {
			const fresh = rows.filter((r) => !q.some((x) => x.id === r.id));
			return fresh.length ? [...q, ...fresh] : q;
		});
	}, []);
	(0, import_react.useEffect)(() => {
		let alive = true;
		let channel = null;
		(async () => {
			const { data } = await supabase.auth.getUser();
			const uid = data.user?.id;
			if (!uid || !alive) return;
			fetchMyLivePages().then((rows) => alive && push(rows)).catch(() => {});
			channel = supabase.channel(`pager:${uid}`).on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "page_targets",
				filter: `user_id=eq.${uid}`
			}, async (p) => {
				const alertId = p.new?.alert_id;
				if (!alertId || seen.current.has(alertId)) return;
				seen.current.add(alertId);
				const { data: row } = await supabase.from("page_alerts").select("*").eq("id", alertId).maybeSingle();
				if (row && row.status === "open") push([row]);
			}).on("postgres_changes", {
				event: "UPDATE",
				schema: "public",
				table: "page_alerts"
			}, (p) => {
				const row = p.new;
				if (row && row.status !== "open") setQueue((q) => q.filter((x) => x.id !== row.id));
			}).subscribe();
		})();
		return () => {
			alive = false;
			if (channel) supabase.removeChannel(channel);
		};
	}, [push]);
	(0, import_react.useEffect)(() => {
		if (!active) {
			stopSound("siren");
			notifRef.current?.close();
			notifRef.current = null;
			return;
		}
		if (cachedPrefs().pagerSound) playSiren();
		if (typeof Notification !== "undefined") {
			if (Notification.permission === "default") Notification.requestPermission().catch(() => {});
			if (Notification.permission === "granted") try {
				notifRef.current = new Notification(`🚨 ${active.title}`, {
					body: active.body ?? "Urgent page — acknowledgement required.",
					requireInteraction: true,
					tag: active.id
				});
				notifRef.current.onclick = () => window.focus();
			} catch {}
		}
		return () => {
			stopSound("siren");
			notifRef.current?.close();
			notifRef.current = null;
		};
	}, [active]);
	if (!active) return null;
	const dismiss = () => setQueue((q) => q.slice(1));
	const onAck = async () => {
		setBusy(true);
		try {
			await ackPage(active.id);
			dismiss();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	const onResolve = async () => {
		setBusy(true);
		try {
			await resolvePage(active.id);
			dismiss();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	const onOpen = async () => {
		await onAck();
		if (active.link) navigate({ to: active.link }).catch(() => {});
	};
	const tone = active.severity === "critical" ? "bg-destructive" : "bg-amber-500";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg overflow-hidden rounded-2xl border border-destructive/60 bg-card shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-2 px-5 py-3 text-white ${tone} animate-pulse`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold uppercase tracking-[0.18em]",
							children: [
								active.severity,
								" page · ",
								active.kind
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto font-mono text-[11px] opacity-80",
							children: ["Level ", active.level]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-6 w-6 flex-none text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-semibold leading-tight",
									children: active.title
								}), active.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: active.body
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
							children: "This page escalates to the next on-call tier until someone acknowledges it."
						}),
						queue.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium text-amber-500",
							children: [queue.length - 1, " more page(s) waiting behind this one."]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 border-t border-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onAck,
							disabled: busy,
							className: "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Acknowledge"]
						}),
						active.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onOpen,
							disabled: busy,
							className: "rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50",
							children: "Acknowledge & open"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onResolve,
							disabled: busy,
							className: "rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50",
							children: "Resolve"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								stopSound("siren");
							},
							title: "Silence the alarm without acknowledging",
							className: "ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " Silence"]
						})
					]
				})
			]
		})
	});
}
var STEPS = [
	{
		selector: "[data-tour=\"sidebar\"]",
		title: "Navigation",
		body: "Every division lives here — Mission Ops, Engineering, Fleet, People and Funding. Groups collapse so you only see what you use.",
		placement: "right"
	},
	{
		selector: "[data-tour=\"search\"]",
		title: "Search everything",
		body: "Find people, incidents, files and messages from one box. ⌘K works anywhere in HQ.",
		placement: "right"
	},
	{
		selector: "[aria-label=\"Apps\"]",
		title: "Apps launcher",
		body: "Jump straight to Email, Channels, Phone, Calendar or Drive from any page.",
		placement: "bottom"
	},
	{
		selector: "[aria-label=\"Notifications\"]",
		title: "Notifications",
		body: "Mentions, task assignments and approvals land here. Click one to open the record it came from.",
		placement: "bottom"
	},
	{
		selector: "[aria-label=\"Phone\"]",
		title: "Calling",
		body: "Call teammates in-app. Calls are transcribed and saved to meeting notes automatically.",
		placement: "bottom"
	}
];
var KEY = "hq.tour.pending";
function ProductTour() {
	const [active, setActive] = (0, import_react.useState)(false);
	const [i, setI] = (0, import_react.useState)(0);
	const [rect, setRect] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		try {
			if (localStorage.getItem(KEY) === "1") setActive(true);
		} catch {}
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		if (!active) return;
		const measure = () => {
			const el = document.querySelector(STEPS[i]?.selector ?? "");
			setRect(el ? el.getBoundingClientRect() : null);
		};
		measure();
		window.addEventListener("resize", measure);
		const t = setInterval(measure, 400);
		return () => {
			window.removeEventListener("resize", measure);
			clearInterval(t);
		};
	}, [active, i]);
	if (!active) return null;
	const finish = () => {
		try {
			localStorage.removeItem(KEY);
		} catch {}
		setActive(false);
	};
	const next = () => i < STEPS.length - 1 ? setI(i + 1) : finish();
	const pad = 8;
	const box = rect ? {
		top: rect.top - pad,
		left: rect.left - pad,
		width: rect.width + 16,
		height: rect.height + 16
	} : null;
	const step = STEPS[i];
	const tip = box ? step.placement === "bottom" ? {
		top: box.top + box.height + 12,
		left: Math.max(12, Math.min(box.left + box.width / 2 - 160, window.innerWidth - 332))
	} : {
		top: Math.max(12, Math.min(box.top, window.innerHeight - 200)),
		left: box.left + box.width + 12
	} : {
		top: window.innerHeight / 2 - 100,
		left: window.innerWidth / 2 - 160
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-black/55",
				onClick: finish
			}),
			box && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute rounded-xl ring-2 ring-primary transition-all duration-300",
				style: {
					top: box.top,
					left: box.left,
					width: box.width,
					height: box.height,
					boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute w-80 rounded-xl border border-border bg-card p-4 shadow-2xl transition-all duration-300",
				style: tip,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-semibold uppercase tracking-widest text-primary",
						children: [
							"Step ",
							i + 1,
							" of ",
							STEPS.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 text-base font-semibold",
						children: step.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: step.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: finish,
							className: "text-xs text-muted-foreground hover:text-foreground",
							children: "Skip tour"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setI(i - 1),
								className: "rounded-lg border border-border px-3 py-1.5 text-xs",
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: next,
								className: "rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
								children: i < STEPS.length - 1 ? "Next" : "Done"
							})]
						})]
					})
				]
			})
		]
	});
}
/**
* Blocks entry to a team app the signed-in user has no role in.
* Everything inside a permitted app renders normally.
*/
function AppGate({ children }) {
	const { loading, app, denied, unknown, permitted, slug } = useCurrentApp();
	if (loading || !denied && !unknown) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	const title = unknown ? `No workspace at “${slug}”` : !app?.enabled ? `${app?.label ?? "This workspace"} isn’t live yet` : `You don’t have access to ${app?.label}`;
	const body = unknown ? "This subdomain isn’t linked to a workspace. Pick one of your workspaces below." : !app?.enabled ? "An administrator has this workspace turned off. It will appear here once it goes live." : "Your role isn’t part of this team. Ask an administrator for access, or open one of your workspaces.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh w-full items-center justify-center bg-surface p-6 text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: body
				}),
				permitted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
						children: "Your workspaces"
					}), permitted.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: appUrl(a),
						className: "flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm transition hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-medium",
								children: a.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: a.tagline || a.subdomain
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground" })]
					}, a.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/workspaces",
					className: "mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted",
					children: ["See all my workspaces ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: async () => {
						await supabase.auth.signOut();
						window.location.href = "/hq-login";
					},
					className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign out"]
				})
			]
		})
	});
}
var HIDE_KEY = "hq.sidebar.hidden";
function TabAutoOpener() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { openTab } = useRecordTabs();
	(0, import_react.useEffect)(() => {
		if (!pathname || pathname === "/" || pathname === "/dashboard") return;
		for (const g of navGroups) for (const item of g.items) if (item.to === pathname) {
			openTab({
				id: item.to,
				label: item.label,
				to: item.to
			});
			return;
		}
	}, [pathname, openTab]);
	return null;
}
function HQShell() {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [hidden, setHidden] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return window.localStorage.getItem(HIDE_KEY) === "1";
	});
	(0, import_react.useEffect)(() => {
		applyTheme(getStoredTheme());
	}, []);
	const setHiddenPersist = (v) => {
		setHidden(v);
		try {
			localStorage.setItem(HIDE_KEY, v ? "1" : "0");
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentAppProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RecordTabsProvider, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabAutoOpener, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundNotifier, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductTour, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-dvh w-full overflow-hidden bg-surface text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden h-full flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-out lg:block",
					style: { width: hidden ? 0 : "var(--sidebar-w, 260px)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { onCollapse: () => setHiddenPersist(true) })
				}),
				mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-30 flex lg:hidden",
					onClick: () => setMobileOpen(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "dialog",
						"aria-modal": "true",
						className: "h-full w-[260px]",
						onClick: (e) => e.stopPropagation(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { onNavigate: () => setMobileOpen(false) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 bg-black/40 backdrop-blur-sm" })]
				}),
				hidden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setHiddenPersist(false),
					className: "fixed left-3 top-3 z-40 hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition hover:bg-muted lg:flex",
					"aria-label": "Open sidebar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 flex-1 flex-col overflow-hidden py-2 pr-2 pl-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, { onMenuClick: () => setMobileOpen(true) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex min-h-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
								className: "min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
							})
						})]
					})
				})
			]
		})
	] }) }) }) });
}
var SplitComponent = HQShell;
//#endregion
export { SplitComponent as component };
