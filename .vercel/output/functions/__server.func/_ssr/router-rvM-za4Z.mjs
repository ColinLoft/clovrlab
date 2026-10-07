import { i as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./dist-F4HwcP_j.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { T as useRouter, X as redirect, _ as Outlet, b as createRootRouteWithContext, d as Scripts, f as HeadContent, g as useMatches, h as createRouter, p as useRouterState, v as lazyRouteComponent, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./client-B5YVWdzA.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as motion, o as MotionConfig } from "../_libs/framer-motion+[...].mjs";
import { Ft as Menu, Jt as Linkedin, Rr as ArrowUpRight, n as X, rn as Instagram, t as Youtube, yn as Github } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-rvM-za4Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function fetchCameras() {
	const res = await fetch("https://api.cdn.prod.alertwest.com/api/firecams/v0/cameras");
	if (!res.ok) throw new Error(`Failed to load cameras: ${res.status}`);
	return await res.json();
}
function getStatus(camera) {
	const t = camera.image.time ?? camera.position.time ?? camera.site.time;
	if (!t) return {
		status: "unknown",
		ageMs: null,
		label: "Unknown",
		color: "#94a3b8",
		signal: 0
	};
	const ageMs = Date.now() - new Date(t).getTime();
	if (!Number.isFinite(ageMs) || ageMs < 0) return {
		status: "unknown",
		ageMs: null,
		label: "Unknown",
		color: "#94a3b8",
		signal: 0
	};
	const min = ageMs / 6e4;
	if (min < 15) return {
		status: "online",
		ageMs,
		label: "Online",
		color: "#22c55e",
		signal: 4
	};
	if (min < 60) return {
		status: "online",
		ageMs,
		label: "Online",
		color: "#84cc16",
		signal: 3
	};
	if (min < 180) return {
		status: "stale",
		ageMs,
		label: "Stale",
		color: "#f4a261",
		signal: 2
	};
	if (min < 1440) return {
		status: "stale",
		ageMs,
		label: "Stale",
		color: "#f59e0b",
		signal: 1
	};
	return {
		status: "offline",
		ageMs,
		label: "Offline",
		color: "#ef4444",
		signal: 0
	};
}
function relTime(s) {
	if (!s) return null;
	const d = typeof s === "string" ? new Date(s).getTime() : s.getTime();
	if (!Number.isFinite(d)) return null;
	const diff = Math.max(0, Date.now() - d);
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "just now";
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return `${Math.floor(h / 24)}d ago`;
}
var styles_default = "/assets/styles-Ckg4TWWZ.css";
var brand = {
	name: "Clovr Labs",
	shortName: "Clovr",
	legalName: "Clovr Labs",
	mission01: "Autonomous wildfire detection + UAV response",
	tagline: "See the fire sooner.",
	status: "Early-stage",
	mission: "We're developing an autonomous wildfire detection and aerial response system designed to identify potential fires, investigate them quickly, and give responders better information.",
	shortMission: "An early-stage nonprofit developing distributed wildfire sensing, autonomous UAV investigation, and the software that connects them.",
	opsCenter: "24/7/365 Operations Center",
	hours: "Operations Center staffed 24/7/365",
	contact: {
		general: "hello@clovrlab.com",
		press: "press@clovrlab.com",
		partners: "partners@clovrlab.com",
		join: "join@clovrlab.com",
		research: "research@clovrlab.com"
	},
	socials: {
		instagram: "#",
		linkedin: "#",
		youtube: "#",
		github: "#"
	},
	/** Honest, non-numeric statements about where the organization actually is. */
	statusPoints: [
		{
			label: "Focus",
			value: "Wildfire detection + UAV response"
		},
		{
			label: "Stage",
			value: "Prototype in progress"
		},
		{
			label: "Operations Center",
			value: "24/7/365"
		},
		{
			label: "Structure",
			value: "Mission-driven nonprofit"
		}
	],
	values: [
		{
			title: "Early information matters",
			body: "The gap between a fire starting and someone knowing exactly what is happening is where the system should do its work. Every design decision is measured against that gap."
		},
		{
			title: "Build it, then claim it",
			body: "We describe what exists as built, what's on the bench as prototype, and what's ahead as intent. Nothing gets promoted before it is tested."
		},
		{
			title: "One system, not one gadget",
			body: "Sensors, communications, the Operations Center, the aircraft, and the software are designed together. The architecture is the product."
		},
		{
			title: "Responders decide",
			body: "We're building an information tool. Fire professionals make the calls; our job is to make the picture arrive earlier and clearer."
		},
		{
			title: "Engineered for the field",
			body: "Heat, smoke, dust, wind, remote terrain, and thin connectivity are the design environment — not edge cases discovered later."
		}
	]
};
function BrandLogo({ className = "", tone = "light" }) {
	const textColor = tone === "dark" ? "text-[oklch(0.18_0.02_250)]" : "text-ink";
	const subColor = tone === "dark" ? "text-[oklch(0.45_0.02_250)]" : "text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-3 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": true,
			className: "relative grid h-9 w-9 place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 36 36",
				className: "h-9 w-9",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "18",
						cy: "18",
						r: "16",
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.3",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "18",
						cy: "18",
						r: "9.5",
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.5",
						strokeWidth: "1",
						strokeDasharray: "2.4 2.4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M18 10.5l6.6 11.4H11.4z",
						fill: "none",
						stroke: "var(--signal)",
						strokeWidth: "1.2",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "18",
						cy: "18.6",
						r: "1.7",
						fill: "var(--signal)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M18 1.5v4M18 30.5v4M1.5 18h4M30.5 18h4",
						stroke: "currentColor",
						strokeOpacity: "0.45",
						strokeWidth: "1"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `block font-display text-[0.98rem] font-bold uppercase tracking-[0.16em] ${textColor}`,
				children: brand.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `mt-1.5 block text-[0.56rem] font-medium uppercase tracking-[0.22em] ${subColor}`,
				children: "Disaster detection + UAV response"
			})]
		})]
	});
}
var nav = [
	{
		to: "/technology",
		label: "Technology"
	},
	{
		to: "/system",
		label: "System"
	},
	{
		to: "/mission",
		label: "Mission"
	},
	{
		to: "/development",
		label: "Development"
	}
];
var secondary = [
	{
		to: "/operations",
		label: "Operations Center"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/partners",
		label: "Partners"
	},
	{
		to: "/join",
		label: "Join the team"
	},
	{
		to: "/contact",
		label: "Contact"
	},
	{
		to: "/faq",
		label: "FAQ"
	}
];
/**
* Floating overlay navigation. Over the film hero it sits wide and
* transparent; past the hero it condenses into a compact glass pill.
*/
function Header() {
	const isHome = useRouterState({ select: (s) => s.location.pathname }) === "/";
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [condensed, setCondensed] = (0, import_react.useState)(!isHome);
	(0, import_react.useEffect)(() => {
		if (!isHome) {
			setCondensed(true);
			return;
		}
		const onScroll = () => setCondensed(window.scrollY > window.innerHeight * .72);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [isHome]);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `pointer-events-auto flex w-full items-center justify-between transition-all duration-500 ease-out ${condensed ? "max-w-3xl gap-4 rounded-full border border-[var(--hair)] bg-[color-mix(in_oklab,var(--sheet)_88%,transparent)] px-2 py-1.5 shadow-[0_18px_50px_-30px_color-mix(in_oklab,var(--ink)_60%,transparent)] backdrop-blur-xl sm:px-2.5" : "max-w-7xl gap-6 rounded-full border border-transparent px-2 py-3 sm:px-4"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						"aria-label": "Clovr Labs home",
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, { className: condensed ? "[&_span:last-child>span:last-child]:hidden" : "" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Primary",
						className: "hidden items-center gap-7 lg:flex",
						children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: n.to,
							className: `text-sm font-medium text-ink/80 transition-colors hover:text-ink ${condensed ? "text-[0.82rem]" : ""}`,
							activeProps: { className: "text-[var(--signal)]" },
							children: n.label
						}, n.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden shrink-0 items-center gap-1.5 lg:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/partners",
							className: `inline-flex items-center whitespace-nowrap rounded-full border border-[color-mix(in_oklab,var(--ink)_25%,transparent)] font-semibold leading-none text-ink transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] ${condensed ? "px-3.5 py-2 text-[0.78rem]" : "px-5 py-2.5 text-sm"}`,
							children: "Partner with us"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/donate",
							className: `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--signal)] font-semibold leading-none text-[var(--on-signal)] transition-colors hover:bg-[var(--ink)] ${condensed ? "px-3.5 py-2 text-[0.78rem]" : "px-5 py-2.5 text-sm"}`,
							children: ["Support us", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": mobileOpen ? "Close menu" : "Open menu",
						"aria-expanded": mobileOpen,
						onClick: () => setMobileOpen((v) => !v),
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color-mix(in_oklab,var(--ink)_25%,transparent)] text-ink lg:hidden",
						children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					})
				]
			})
		}),
		mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-40 overflow-y-auto bg-[var(--background)] px-6 pb-16 pt-24 lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				"aria-label": "Mobile",
				className: "flex flex-col",
				children: [[...nav, ...secondary].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: n.to,
					onClick: () => setMobileOpen(false),
					className: "display-cond border-b border-[var(--hair)] py-4 text-3xl font-extrabold tracking-tight text-ink",
					children: n.label
				}, n.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/donate",
						onClick: () => setMobileOpen(false),
						className: "inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--signal)] px-6 text-sm font-semibold text-[var(--on-signal)]",
						children: "Support the mission"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/join",
						onClick: () => setMobileOpen(false),
						className: "inline-flex min-h-[48px] items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--ink)_25%,transparent)] px-6 text-sm font-semibold text-ink",
						children: "Build with us"
					})]
				})]
			})
		}) : null,
		isHome ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-24",
			"aria-hidden": true
		})
	] });
}
var j_ridge_default = "/assets/j-ridge-DVtGkFPS.jpg";
var colA = [
	{
		to: "/mission",
		label: "Mission"
	},
	{
		to: "/system",
		label: "The system"
	},
	{
		to: "/technology",
		label: "Technology"
	},
	{
		to: "/operations",
		label: "Operations Center"
	},
	{
		to: "/development",
		label: "Development status"
	}
];
var colB = [
	{
		to: "/join",
		label: "Join the team"
	},
	{
		to: "/partners",
		label: "Partner with us"
	},
	{
		to: "/donate",
		label: "Support the mission"
	},
	{
		to: "/contact",
		label: "Contact"
	},
	{
		to: "/faq",
		label: "FAQ"
	}
];
var legal = [
	{
		to: "/legal/privacy",
		label: "Privacy"
	},
	{
		to: "/legal/terms",
		label: "Terms"
	},
	{
		to: "/legal/cookies",
		label: "Cookies"
	}
];
var socials = [
	{
		href: brand.socials.instagram,
		label: "Instagram",
		Icon: Instagram
	},
	{
		href: brand.socials.linkedin,
		label: "LinkedIn",
		Icon: Linkedin
	},
	{
		href: brand.socials.youtube,
		label: "YouTube",
		Icon: Youtube
	},
	{
		href: brand.socials.github,
		label: "GitHub",
		Icon: Github
	}
];
/** Full-bleed cinematic footer — media plate with the sitemap laid over it. */
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative isolate min-h-[86svh] overflow-hidden bg-[var(--night)] text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: j_ridge_default,
				alt: "",
				"aria-hidden": true,
				className: "absolute inset-0 -z-10 h-full w-full object-cover",
				loading: "lazy",
				width: 1600,
				height: 1e3
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,_var(--night)_55%,_transparent),color-mix(in_oklab,_var(--night)_35%,_transparent)_35%,color-mix(in_oklab,_var(--night)_94%,_transparent))]",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 26
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .2
				},
				transition: {
					duration: .9,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "mx-auto flex min-h-[86svh] w-full max-w-7xl flex-col justify-between px-6 pb-10 pt-24 sm:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-cond text-[clamp(2.6rem,8vw,7rem)] leading-[0.86] text-ink",
							children: "See it sooner."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-md text-base text-ink/75",
							children: brand.shortMission
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid grid-cols-2 gap-x-12 gap-y-3 sm:gap-x-16",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3",
								children: colA.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: l.to,
									className: "text-sm font-semibold text-ink/85 transition-colors hover:text-[var(--signal)]",
									children: l.label
								}) }, l.to))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3",
								children: colB.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: l.to,
									className: "text-sm font-semibold text-ink/85 transition-colors hover:text-[var(--signal)]",
									children: l.label
								}) }, l.to))
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 sm:justify-end",
							children: socials.map(({ href, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href,
								"aria-label": label,
								className: "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-ink/85 backdrop-blur transition-colors hover:bg-white/15 hover:text-ink",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-4 w-4",
									"aria-hidden": true
								})
							}, label))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-ink/60 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" ",
							brand.legalName,
							". A mission-driven nonprofit organization."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "hover:text-ink",
								href: `mailto:${brand.contact.general}`,
								children: brand.contact.general
							}), legal.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: l.to,
								className: "hover:text-ink",
								children: l.label
							}, l.to))]
						})]
					})
				]
			})
		]
	});
}
var SITE_URL = "https://clovrlab.com";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex flex-1 items-center justify-center px-5 py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs font-medium uppercase tracking-[0.18em] text-primary",
							children: "404"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl font-semibold",
							children: "This page doesn't exist"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted-foreground",
							children: "You may have followed an old link, or the page has moved."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
								children: "Go home"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex flex-1 items-center justify-center px-5 py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-semibold",
							children: "This page didn't load"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted-foreground",
							children: "Something went wrong. Try again or head home."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									router.invalidate();
									reset();
								},
								className: "rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
								children: "Try again"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/",
								className: "rounded-full border border-border px-5 py-2.5 text-sm",
								children: "Go home"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var siteDescription = "Clovr Relief is a disaster-response nonprofit that reaches cut-off communities within hours — water, medical capacity, shelter and power — and stays through recovery.";
var Route$118 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: `${brand.name} — ${brand.tagline}` },
			{
				name: "description",
				content: siteDescription
			},
			{
				property: "og:site_name",
				content: brand.name
			},
			{
				property: "og:title",
				content: `${brand.name} — ${brand.tagline}`
			},
			{
				property: "og:description",
				content: siteDescription
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/app-icon-512.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Archivo:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Inter+Tight:wght@400;500;600;700&display=swap"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@graph": [{
					"@type": "WebSite",
					"@id": `${SITE_URL}/#website`,
					url: `${SITE_URL}/`,
					name: brand.name,
					description: siteDescription,
					publisher: { "@id": `${SITE_URL}/#organization` }
				}, {
					"@type": "Organization",
					"@id": `${SITE_URL}/#organization`,
					name: brand.name,
					url: `${SITE_URL}/`,
					slogan: brand.tagline,
					description: siteDescription,
					email: brand.contact.general,
					knowsAbout: [
						"Wildfire detection",
						"Environmental sensor networks",
						"Autonomous UAV systems",
						"Thermal imaging",
						"Emergency response technology"
					]
				}]
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `
    (function () {
      try {
        var host = window.location.hostname.toLowerCase();
        var path = window.location.pathname;
        var referrer = document.referrer || "";
        var isHqHost = host === "hq.clovrlab.com" || host.indexOf("hq.") === 0 || host.indexOf("hq--") === 0;
        var lowerRef = referrer.toLowerCase();
        var cameFromHq = lowerRef.indexOf("https://hq.clovrlab.com") === 0;
        var isRootPath = path === "/" || path === "" || path === "/index.html";
        if ((isHqHost || cameFromHq) && isRootPath) {
          window.location.replace("/hq-login");
        }
      } catch (error) {}
    })();
  ` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$118.useRouteContext();
	const matches = useMatches();
	const isHQ = matches.some((m) => m.routeId?.startsWith("/_hq") || m.routeId === "/hq-login" || m.routeId === "/workspaces" || m.routeId === "/welcome");
	const isChromeless = matches.some((m) => m.routeId?.startsWith("/meeting"));
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const h = window.location.hostname;
		if ((h === "hq.clovrlab.com" || h.startsWith("hq--") || h.startsWith("hq.")) && window.location.pathname === "/") window.location.replace("/hq-login");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: isHQ || isChromeless ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionConfig, {
			reducedMotion: "user",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "site-theme flex min-h-dvh flex-col bg-background text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
				]
			})
		})
	});
}
var $$splitComponentImporter$112 = () => import("./routes-CAHw_Eqj.mjs");
var title$11 = `${brand.name} — Disaster response, sooner`;
var desc$11 = "A nonprofit building sensing, operations software and autonomous aircraft so responders see wildfires, floods and storms sooner.";
var Route$117 = createFileRoute("/")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const h = window.location.hostname.toLowerCase();
		if (h === "hq.clovrlab.com" || h.startsWith("hq.") || h.startsWith("hq--")) throw redirect({ to: "/hq-login" });
	},
	head: () => ({
		meta: [
			{ title: title$11 },
			{
				name: "description",
				content: desc$11
			},
			{
				property: "og:title",
				content: title$11
			},
			{
				property: "og:description",
				content: desc$11
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/`
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "NGO",
				name: brand.legalName,
				url: `${SITE_URL}/`,
				slogan: brand.tagline,
				description: desc$11,
				email: brand.contact.general
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$112, "component")
});
var $$splitComponentImporter$111 = () => import("../_hq-LZFm4htN.mjs");
var Route$116 = createFileRoute("/_hq")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/hq-login" });
		return { userId: data.user.id };
	},
	component: lazyRouteComponent($$splitComponentImporter$111, "component")
});
var $$splitComponentImporter$110 = () => import("./about-C9XCZk88.mjs");
var title$10 = `About — An Early-Stage Wildfire Technology Nonprofit | ${brand.name}`;
var desc$10 = "Clovr Labs is an early-stage, mission-driven nonprofit developing wildfire detection and autonomous UAV response technology, with a 24/7/365 Operations Center.";
var Route$115 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: title$10 },
			{
				name: "description",
				content: desc$10
			},
			{
				property: "og:title",
				content: title$10
			},
			{
				property: "og:description",
				content: desc$10
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/about`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/about`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$110, "component")
});
var $$splitComponentImporter$109 = () => import("./contact-Cdc1J-JC.mjs");
var title$9 = `Contact | ${brand.name}`;
var desc$9 = "Contact Clovr Labs — general enquiries, press, research collaboration, partnerships, and joining the team on wildfire detection and UAV response.";
var Route$114 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: title$9 },
			{
				name: "description",
				content: desc$9
			},
			{
				property: "og:title",
				content: title$9
			},
			{
				property: "og:description",
				content: desc$9
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/contact`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/contact`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$109, "component")
});
var $$splitComponentImporter$108 = () => import("./development-CLv4oJ9R.mjs");
var title$8 = `Development Status | ${brand.name}`;
var desc$8 = "An honest development timeline: research, system design, prototype, field testing, pilot, and eventual deployment. Nothing is operationally deployed yet.";
var Route$113 = createFileRoute("/development")({
	head: () => ({
		meta: [
			{ title: title$8 },
			{
				name: "description",
				content: desc$8
			},
			{
				property: "og:title",
				content: title$8
			},
			{
				property: "og:description",
				content: desc$8
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/development`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/development`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$108, "component")
});
var $$splitComponentImporter$107 = () => import("./donate-BOJPR__C.mjs");
var title$7 = `Support the Mission | ${brand.name}`;
var desc$7 = "Support an early-stage nonprofit building autonomous wildfire detection and UAV investigation technology. Funding goes to prototype hardware, field testing, and the software behind the Operations Center.";
var Route$112 = createFileRoute("/donate")({
	head: () => ({
		meta: [
			{ title: title$7 },
			{
				name: "description",
				content: desc$7
			},
			{
				property: "og:title",
				content: title$7
			},
			{
				property: "og:description",
				content: desc$7
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/donate`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/donate`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$107, "component")
});
var faqs = [
	{
		q: "What are you actually building?",
		a: "An integrated wildfire detection and aerial investigation system: distributed environmental sensor nodes, automated detection, a 24/7/365 Operations Center that reviews alerts and coordinates missions, UAVs that fly to investigate, thermal and RGB imaging, and the software that connects all of it and delivers information to responders."
	},
	{
		q: "Is the system deployed?",
		a: "No. We are early-stage. Prototype work is in progress, field testing is ahead of us, and no sensor network or aircraft is in operational service. Our status page describes exactly where each stage stands."
	},
	{
		q: "Are you a disaster-relief or humanitarian aid organization?",
		a: "No. We are a technology organization. Our first and current mission is wildfire detection and UAV investigation. The same engineering foundation could eventually support other emergencies, but that is future work, not what we do today."
	},
	{
		q: "What does the Operations Center do?",
		a: "It monitors the detection network, receives and reviews alerts, opens and tracks incidents, coordinates UAV missions, tracks aircraft and field assets, reviews imagery and telemetry, maintains incident timelines, and communicates with field personnel and response partners. It operates 24/7/365."
	},
	{
		q: "Are the UAVs fully autonomous?",
		a: "No, and we are not claiming that. We are developing autonomous and operator-assisted navigation with a human in the loop by design. An operator can intervene at any point in a mission."
	},
	{
		q: "Do you replace fire agencies?",
		a: "No. We build an information tool. Fire professionals make the decisions; our aim is to get them a clearer picture earlier."
	},
	{
		q: "Why publish statistics-free pages?",
		a: "Because we have not measured anything in the field yet. We will not publish response times, coverage figures, or detection performance until they exist and can be described with their methodology."
	},
	{
		q: "How can I get involved?",
		a: "We are looking for engineers, robotics and software developers, researchers, fire professionals, mentors, sponsors, and manufacturing partners. The Join page explains how to reach us."
	}
];
var $$splitComponentImporter$106 = () => import("./faq-4ruNIauD.mjs");
var title$6 = `FAQ | ${brand.name}`;
var desc$6 = "Common questions about Clovr Labs: what the wildfire detection and UAV system is, what stage it is at, how the Operations Center works, and how to get involved.";
var Route$111 = createFileRoute("/faq")({
	head: () => ({
		meta: [
			{ title: title$6 },
			{
				name: "description",
				content: desc$6
			},
			{
				property: "og:title",
				content: title$6
			},
			{
				property: "og:description",
				content: desc$6
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/faq`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/faq`
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: faqs.map((f) => ({
					"@type": "Question",
					name: f.q,
					acceptedAnswer: {
						"@type": "Answer",
						text: f.a
					}
				}))
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$106, "component")
});
var $$splitComponentImporter$105 = () => import("./hq-login-Cz33q6uN.mjs");
var Route$110 = createFileRoute("/hq-login")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$105, "component"),
	head: () => ({ meta: [
		{ title: "Clovr HQ — Sign in" },
		{
			name: "description",
			content: "Sign in to Clovr HQ, the internal operations workspace for the Clovr Labs team."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] })
});
var $$splitComponentImporter$104 = () => import("./join-DkWzszUl.mjs");
var title$5 = `Join the Team | ${brand.name}`;
var desc$5 = "Engineers, robotics and software developers, researchers, fire professionals, mentors, sponsors, and manufacturing partners: help build an autonomous wildfire detection and UAV investigation system.";
var Route$109 = createFileRoute("/join")({
	head: () => ({
		meta: [
			{ title: title$5 },
			{
				name: "description",
				content: desc$5
			},
			{
				property: "og:title",
				content: title$5
			},
			{
				property: "og:description",
				content: desc$5
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/join`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/join`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$104, "component")
});
var $$splitComponentImporter$103 = () => import("./mission-lWXs4_fi.mjs");
var title$4 = `Mission — Wildfire Detection + UAV Investigation | ${brand.name}`;
var desc$4 = brand.mission;
var Route$108 = createFileRoute("/mission")({
	head: () => ({
		meta: [
			{ title: title$4 },
			{
				name: "description",
				content: desc$4
			},
			{
				property: "og:title",
				content: title$4
			},
			{
				property: "og:description",
				content: desc$4
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/mission`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/mission`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$103, "component")
});
var $$splitComponentImporter$102 = () => import("./operations-BHhTSfjo.mjs");
var title$3 = `24/7/365 Operations Center | ${brand.name}`;
var desc$3 = "Our Operations Center monitors the detection network, reviews alerts, opens and tracks incidents, coordinates UAV missions, and keeps the incident record — continuously.";
var Route$107 = createFileRoute("/operations")({
	head: () => ({
		meta: [
			{ title: title$3 },
			{
				name: "description",
				content: desc$3
			},
			{
				property: "og:title",
				content: title$3
			},
			{
				property: "og:description",
				content: desc$3
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/operations`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/operations`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$102, "component")
});
var $$splitComponentImporter$101 = () => import("./partners-c7_8_Txv.mjs");
var title$2 = `Partners — Research, Industry & Fire Service | ${brand.name}`;
var desc$2 = "Research partnerships, manufacturing and component partners, fire-service advisors, and sponsors supporting an early-stage wildfire detection and UAV investigation programme.";
var Route$106 = createFileRoute("/partners")({
	head: () => ({
		meta: [
			{ title: title$2 },
			{
				name: "description",
				content: desc$2
			},
			{
				property: "og:title",
				content: title$2
			},
			{
				property: "og:description",
				content: desc$2
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/partners`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/partners`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$101, "component")
});
var routes = [
	{
		path: "/",
		priority: "1.0",
		changefreq: "weekly"
	},
	{
		path: "/mission",
		priority: "0.9",
		changefreq: "monthly"
	},
	{
		path: "/system",
		priority: "0.9",
		changefreq: "monthly"
	},
	{
		path: "/technology",
		priority: "0.9",
		changefreq: "monthly"
	},
	{
		path: "/operations",
		priority: "0.8",
		changefreq: "monthly"
	},
	{
		path: "/development",
		priority: "0.8",
		changefreq: "weekly"
	},
	{
		path: "/about",
		priority: "0.7",
		changefreq: "monthly"
	},
	{
		path: "/join",
		priority: "0.7",
		changefreq: "monthly"
	},
	{
		path: "/partners",
		priority: "0.7",
		changefreq: "monthly"
	},
	{
		path: "/donate",
		priority: "0.7",
		changefreq: "monthly"
	},
	{
		path: "/contact",
		priority: "0.6",
		changefreq: "monthly"
	},
	{
		path: "/faq",
		priority: "0.6",
		changefreq: "monthly"
	},
	{
		path: "/legal/privacy",
		priority: "0.3",
		changefreq: "yearly"
	},
	{
		path: "/legal/terms",
		priority: "0.3",
		changefreq: "yearly"
	},
	{
		path: "/legal/cookies",
		priority: "0.3",
		changefreq: "yearly"
	}
];
var Route$105 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: () => {
	const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r.path}</loc><lastmod>${now}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`).join("\n")}
</urlset>`;
	return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
} } } });
var $$splitComponentImporter$100 = () => import("./system-43OVY_Xx.mjs");
var title$1 = `The System — Detection to Responder | ${brand.name}`;
var desc$1 = "Nine stages from a distributed sensor node to information in a responder's hands: detection, alert, 24/7/365 Operations Center, UAV dispatch, autonomous flight, thermal and RGB investigation, and intelligence.";
var Route$104 = createFileRoute("/system")({
	head: () => ({
		meta: [
			{ title: title$1 },
			{
				name: "description",
				content: desc$1
			},
			{
				property: "og:title",
				content: title$1
			},
			{
				property: "og:description",
				content: desc$1
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/system`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/system`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$100, "component")
});
var $$splitComponentImporter$99 = () => import("./technology-Z-7upTbf.mjs");
var title = `Technology — Sensors, UAV, Thermal, Software | ${brand.name}`;
var desc = "The technology under development: distributed environmental sensor nodes, wireless communications, autonomous UAV flight, thermal and RGB imaging, geospatial processing, and mission control software.";
var Route$103 = createFileRoute("/technology")({
	head: () => ({
		meta: [
			{ title },
			{
				name: "description",
				content: desc
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: desc
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: `${SITE_URL}/technology`
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/technology`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$99, "component")
});
var $$splitComponentImporter$98 = () => import("./welcome-oCRsQsiO.mjs");
var Route$102 = createFileRoute("/welcome")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Welcome to Clovr Labs HQ — Set up your account" },
		{
			name: "description",
			content: "Verify your work email, set a password, add a photo and finish your onboarding checklist for Clovr Labs HQ."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$98, "component")
});
var $$splitComponentImporter$97 = () => import("./workspaces-cChcWPLo.mjs");
var Route$101 = createFileRoute("/workspaces")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/hq-login" });
	},
	head: () => ({ meta: [
		{ title: "Clovr HQ — Choose a workspace" },
		{
			name: "description",
			content: "Pick which Clovr Labs internal workspace to open."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$97, "component")
});
var $$splitComponentImporter$96 = () => import("../_hq.accounting-Dd_RVAqh.mjs");
var Route$100 = createFileRoute("/_hq/accounting")({
	head: () => ({ meta: [{ title: "Accounting — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$96, "component")
});
var $$splitComponentImporter$95 = () => import("../_hq.analytics-Coqsr3sA.mjs");
var Route$99 = createFileRoute("/_hq/analytics")({
	head: () => ({ meta: [{ title: "Dashboards — Clovr Labs HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$95, "component")
});
var $$splitComponentImporter$94 = () => import("../_hq.attendance-a4SAlNpo.mjs");
var Route$98 = createFileRoute("/_hq/attendance")({
	head: () => ({ meta: [{ title: "Attendance & Leave — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$94, "component")
});
var $$splitComponentImporter$93 = () => import("../_hq.calendar-DBNPU42A.mjs");
var Route$97 = createFileRoute("/_hq/calendar")({
	head: () => ({ meta: [{ title: "Calendar — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$93, "component")
});
var $$splitComponentImporter$92 = () => import("../_hq.certifications-p69DJIPc.mjs");
var Route$96 = createFileRoute("/_hq/certifications")({
	head: () => ({ meta: [{ title: "Certifications — Clovr Labs HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$92, "component")
});
var $$splitComponentImporter$91 = () => import("../_hq.dashboard-CKDHNaA_.mjs");
/**
* The dashboard is always the current workspace's own dashboard — Operations
* sees flights, Engineering sees programs, Leadership sees the org briefing.
*/
var Route$95 = createFileRoute("/_hq/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — Clovr Labs HQ" },
		{
			name: "description",
			content: "Your workspace at a glance: missions, programs, production and people."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$91, "component")
});
var $$splitComponentImporter$90 = () => import("../_hq.drive-DWrYtpSZ.mjs");
var Route$94 = createFileRoute("/_hq/drive")({
	head: () => ({ meta: [{ title: "Drive — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$90, "component")
});
var $$splitComponentImporter$89 = () => import("../_hq.employees-Csx05XLN.mjs");
var Route$93 = createFileRoute("/_hq/employees")({
	head: () => ({ meta: [{ title: "People — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$89, "component")
});
var $$splitComponentImporter$88 = () => import("../_hq.expenses-C8OD-96I.mjs");
var Route$92 = createFileRoute("/_hq/expenses")({
	head: () => ({ meta: [{ title: "Expenses & Budgets — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$88, "component")
});
var $$splitComponentImporter$87 = () => import("../_hq.financial-reports-BWpXUc5b.mjs");
var Route$91 = createFileRoute("/_hq/financial-reports")({
	head: () => ({ meta: [{ title: "Financial Reports — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$87, "component")
});
var $$splitComponentImporter$86 = () => import("../_hq.help-XQTibqgs.mjs");
var Route$90 = createFileRoute("/_hq/help")({
	head: () => ({ meta: [{ title: "Help & Support — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$86, "component")
});
var $$splitComponentImporter$85 = () => import("../_hq.hiring-DjR5YiVB.mjs");
var Route$89 = createFileRoute("/_hq/hiring")({
	head: () => ({ meta: [{ title: "Hiring & Onboarding — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$85, "component")
});
var $$splitComponentImporter$84 = () => import("../_hq.invoices-DV3y5Ng0.mjs");
var Route$88 = createFileRoute("/_hq/invoices")({
	head: () => ({ meta: [{ title: "Invoices & Payments — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$84, "component")
});
var $$splitComponentImporter$83 = () => import("../_hq.kb-C5Fwl-3S.mjs");
var Route$87 = createFileRoute("/_hq/kb")({
	head: () => ({ meta: [{ title: "Knowledge Base — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$83, "component")
});
var $$splitComponentImporter$82 = () => import("../_hq.mail-Cz3R1NGe.mjs");
var Route$86 = createFileRoute("/_hq/mail")({
	head: () => ({ meta: [{ title: "Mail — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$82, "component")
});
var $$splitComponentImporter$81 = () => import("../_hq.meeting-notes-BxzctUGJ.mjs");
var Route$85 = createFileRoute("/_hq/meeting-notes")({
	head: () => ({ meta: [{ title: "Meeting Notes — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$81, "component")
});
var $$splitComponentImporter$80 = () => import("../_hq.meetings-BfeDfzcB.mjs");
var Route$84 = createFileRoute("/_hq/meetings")({
	head: () => ({ meta: [{ title: "Meetings — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$80, "component")
});
var $$splitComponentImporter$79 = () => import("../_hq.my-time-CE-2n3Z7.mjs");
var Route$83 = createFileRoute("/_hq/my-time")({
	head: () => ({ meta: [{ title: "My Time — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$79, "component")
});
var $$splitComponentImporter$78 = () => import("../_hq.notifications-CEKbNOY3.mjs");
var Route$82 = createFileRoute("/_hq/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$78, "component")
});
var $$splitComponentImporter$77 = () => import("../_hq.onboarding-DP2-exNX.mjs");
var Route$81 = createFileRoute("/_hq/onboarding")({
	head: () => ({ meta: [{ title: "Onboarding — Clovr Labs HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$77, "component")
});
var $$splitComponentImporter$76 = () => import("../_hq.org-chart-Dot1vYT2.mjs");
var Route$80 = createFileRoute("/_hq/org-chart")({
	head: () => ({ meta: [{ title: "Org Chart — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$76, "component")
});
var $$splitComponentImporter$75 = () => import("../_hq.phone-DK9j23Ry.mjs");
var Route$79 = createFileRoute("/_hq/phone")({
	head: () => ({ meta: [{ title: "Phone — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$75, "component")
});
var $$splitComponentImporter$74 = () => import("../_hq.profile-LdpTaOth.mjs");
var Route$78 = createFileRoute("/_hq/profile")({
	beforeLoad: () => {
		throw redirect({ to: "/settings" });
	},
	component: lazyRouteComponent($$splitComponentImporter$74, "component")
});
var $$splitComponentImporter$73 = () => import("../_hq.purchase-orders-Ry3vA5Vz.mjs");
var Route$77 = createFileRoute("/_hq/purchase-orders")({
	head: () => ({ meta: [{ title: "Purchasing — Clovr Labs HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$73, "component")
});
var $$splitComponentImporter$72 = () => import("../_hq.rd-ideas-CNTKlXgP.mjs");
var Route$76 = createFileRoute("/_hq/rd-ideas")({
	head: () => ({ meta: [{ title: "Ideas — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$72, "component")
});
var $$splitComponentImporter$71 = () => import("../_hq.requests-vDVO9jMv.mjs");
var Route$75 = createFileRoute("/_hq/requests")({
	head: () => ({ meta: [{ title: "Team Requests — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$71, "component")
});
var TEAMS = [
	{
		value: "exec",
		label: "Executive"
	},
	{
		value: "product",
		label: "Product & Program"
	},
	{
		value: "eng",
		label: "Engineering"
	},
	{
		value: "mfg",
		label: "Manufacturing"
	},
	{
		value: "ops",
		label: "Mission Operations"
	},
	{
		value: "systems",
		label: "Enterprise Systems"
	},
	{
		value: "commercial",
		label: "Commercial"
	},
	{
		value: "admin",
		label: "Operations & Admin"
	}
];
var $$splitComponentImporter$70 = () => import("../_hq.reviews-CmNOkYSs.mjs");
var Route$74 = createFileRoute("/_hq/reviews")({
	head: () => ({ meta: [{ title: "Performance & Benefits — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$70, "component")
});
var $$splitComponentImporter$69 = () => import("../_hq.search-BtT2MsrH.mjs");
var Route$73 = createFileRoute("/_hq/search")({
	validateSearch: (s) => ({ q: typeof s.q === "string" ? s.q : void 0 }),
	head: () => ({ meta: [{ title: "Universal Search — Clovr Labs HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$69, "component")
});
var $$splitComponentImporter$68 = () => import("../_hq.settings-CHsnO1sm.mjs");
var Route$72 = createFileRoute("/_hq/settings")({
	head: () => ({ meta: [{ title: "Settings — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$68, "component")
});
var $$splitComponentImporter$67 = () => import("../_hq.tasks-Cqcjifx0.mjs");
var Route$71 = createFileRoute("/_hq/tasks")({
	head: () => ({ meta: [{ title: "Tasks — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$67, "component")
});
var $$splitComponentImporter$66 = () => import("../_hq.teams-Bwxq_gTL.mjs");
var Route$70 = createFileRoute("/_hq/teams")({ component: lazyRouteComponent($$splitComponentImporter$66, "component") });
var $$splitComponentImporter$65 = () => import("../_hq.time-off-DJovKdOE.mjs");
var Route$69 = createFileRoute("/_hq/time-off")({
	head: () => ({ meta: [{ title: "Time Off — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
var $$splitComponentImporter$64 = () => import("../_hq.training-pfDGtPSa.mjs");
var Route$68 = createFileRoute("/_hq/training")({
	head: () => ({ meta: [{ title: "Training — Clovr Labs HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$64, "component")
});
var jsonHeaders = {
	"content-type": "application/json",
	"cache-control": "public, max-age=10"
};
function planeFallback(reason, extra = {}) {
	return new Response(JSON.stringify({
		time: Math.floor(Date.now() / 1e3),
		states: [],
		fallback: true,
		reason,
		...extra
	}), {
		status: 200,
		headers: jsonHeaders
	});
}
function withHardDeadline(promise, timeoutMs, reason) {
	return Promise.race([promise, new Promise((_, reject) => {
		setTimeout(() => reject(new Error(reason)), timeoutMs);
	})]);
}
function num(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}
function milesBetween(aLat, aLng, bLat, bLng) {
	const r = 3958.8;
	const dLat = (bLat - aLat) * Math.PI / 180;
	const dLng = (bLng - aLng) * Math.PI / 180;
	const s1 = Math.sin(dLat / 2);
	const s2 = Math.sin(dLng / 2);
	const h = s1 * s1 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * s2 * s2;
	return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}
async function fetchJsonWithTimeout(url, timeoutMs) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: { "user-agent": "ALERTWest-Viewer/1.0" }
		});
		return {
			res,
			json: await res.json()
		};
	} finally {
		clearTimeout(timeout);
	}
}
async function fetchTextWithTimeout(url, timeoutMs) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: { "user-agent": "ALERTWest-Viewer/1.0" }
		});
		return {
			res,
			text: await res.text()
		};
	} finally {
		clearTimeout(timeout);
	}
}
function ftToM(value) {
	return typeof value === "number" ? value * .3048 : null;
}
function ktToMs(value) {
	return typeof value === "number" ? value * .514444 : null;
}
function ftMinToMs(value) {
	return typeof value === "number" ? value * .00508 : null;
}
var Route$67 = createFileRoute("/api/planes")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const url = new URL(request.url);
		const lamin = num(url.searchParams.get("lamin"));
		const lomin = num(url.searchParams.get("lomin"));
		const lamax = num(url.searchParams.get("lamax"));
		const lomax = num(url.searchParams.get("lomax"));
		if (lamin == null || lomin == null || lamax == null || lomax == null) return new Response(JSON.stringify({ error: "bbox required" }), {
			status: 400,
			headers: jsonHeaders
		});
		const centerLat = (lamin + lamax) / 2;
		const centerLng = (lomin + lomax) / 2;
		const radiusMiles = Math.ceil(Math.min(500, Math.max(25, milesBetween(centerLat, centerLng, lamax, lomax))));
		const adsb = new URL(`https://api.adsb.lol/v2/lat/${centerLat.toFixed(4)}/lon/${centerLng.toFixed(4)}/dist/${radiusMiles}`);
		try {
			const { res, json } = await withHardDeadline(fetchJsonWithTimeout(adsb.toString(), 4e3), 4500, "adsb deadline");
			if (res.ok) {
				const now = typeof json.now === "number" ? json.now / 1e3 : Date.now() / 1e3;
				const states = (json.ac ?? []).filter((ac) => typeof ac.lat === "number" && typeof ac.lon === "number").filter((ac) => ac.lat >= lamin && ac.lat <= lamax && ac.lon >= lomin && ac.lon <= lomax).map((ac) => {
					const onGround = ac.alt_baro === "ground";
					const lastContact = Math.round(now - (typeof ac.seen === "number" ? ac.seen : 0));
					return [
						String(ac.hex ?? ""),
						String(ac.flight ?? ac.r ?? "").slice(0, 8),
						String(ac.t ?? "ADS-B"),
						lastContact,
						lastContact,
						ac.lon,
						ac.lat,
						ftToM(ac.alt_baro),
						onGround,
						ktToMs(ac.gs),
						typeof ac.track === "number" ? ac.track : null,
						ftMinToMs(ac.baro_rate),
						null,
						ftToM(ac.alt_geom),
						typeof ac.squawk === "string" ? ac.squawk : null,
						false,
						0
					];
				});
				return new Response(JSON.stringify({
					time: Math.round(now),
					states
				}), {
					status: 200,
					headers: jsonHeaders
				});
			}
		} catch (e) {
			console.warn("[api/planes] ADS-B failed:", String(e));
		}
		const upstream = new URL("https://opensky-network.org/api/states/all");
		upstream.searchParams.set("lamin", String(lamin));
		upstream.searchParams.set("lomin", String(lomin));
		upstream.searchParams.set("lamax", String(lamax));
		upstream.searchParams.set("lomax", String(lomax));
		try {
			const { res, text } = await withHardDeadline(fetchTextWithTimeout(upstream.toString(), 3e3), 3500, "opensky deadline");
			if (res.ok) return new Response(text, {
				status: 200,
				headers: jsonHeaders
			});
			return planeFallback("opensky non-ok", { upstream_status: res.status });
		} catch (e) {
			console.warn("[api/planes] OpenSky failed:", String(e));
			return planeFallback("upstream failed", { error: String(e) });
		}
	} catch (e) {
		console.warn("[api/planes] handler failed:", String(e));
		return planeFallback("handler failed", { error: String(e) });
	}
} } } });
var $$splitComponentImporter$63 = () => import("./legal.cookies-fSjjBpoW.mjs");
var Route$66 = createFileRoute("/legal/cookies")({
	head: () => ({
		meta: [
			{ title: `Cookie Policy — ${brand.name}` },
			{
				name: "description",
				content: "What cookies and similar technologies we use, and why."
			},
			{
				property: "og:title",
				content: `Cookie Policy — ${brand.name}`
			},
			{
				property: "og:description",
				content: "Cookies and similar technologies."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://clovrlab.com/legal/cookies"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://clovrlab.com/legal/cookies"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$63, "component")
});
var $$splitComponentImporter$62 = () => import("./legal.privacy-Cia-iHSu.mjs");
var Route$65 = createFileRoute("/legal/privacy")({
	head: () => ({
		meta: [
			{ title: `Privacy Policy — ${brand.name}` },
			{
				name: "description",
				content: `How ${brand.name} collects, uses, and protects personal information.`
			},
			{
				property: "og:title",
				content: `Privacy Policy — ${brand.name}`
			},
			{
				property: "og:description",
				content: `How ${brand.name} collects, uses, and protects personal information.`
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://clovrlab.com/legal/privacy"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://clovrlab.com/legal/privacy"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$62, "component")
});
var $$splitComponentImporter$61 = () => import("./legal.terms-DbXxZ3wU.mjs");
var Route$64 = createFileRoute("/legal/terms")({
	head: () => ({
		meta: [
			{ title: `Terms of Service — ${brand.name}` },
			{
				name: "description",
				content: `The terms that apply when you use ${brand.name}'s website and services.`
			},
			{
				property: "og:title",
				content: `Terms of Service — ${brand.name}`
			},
			{
				property: "og:description",
				content: `The terms that apply when you use ${brand.name}.`
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://clovrlab.com/legal/terms"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://clovrlab.com/legal/terms"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$61, "component")
});
var $$splitComponentImporter$60 = () => import("./meeting._id-D1tFGJqA.mjs");
var Route$63 = createFileRoute("/meeting/$id")({
	head: () => ({ meta: [{ title: "Meeting Room — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	validateSearch: (s) => ({ t: typeof s.t === "string" ? s.t : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$60, "component")
});
var $$splitComponentImporter$59 = () => import("../_hq.admin.apps-zYWGgKYj.mjs");
var Route$62 = createFileRoute("/_hq/admin/apps")({
	head: () => ({ meta: [
		{ title: "Team Apps — Clovr HQ" },
		{
			name: "description",
			content: "Manage per-team workspaces, their subdomains and Slack links."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$59, "component")
});
var $$splitComponentImporter$58 = () => import("../_hq.admin.company-DMMGqyjp.mjs");
var Route$61 = createFileRoute("/_hq/admin/company")({
	head: () => ({ meta: [{ title: "Company Settings — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	beforeLoad: async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) throw redirect({ to: "/hq-login" });
		const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
		const rs = (roles ?? []).map((r) => r.role);
		if (!(rs.includes("super_admin") || rs.includes("admin"))) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$58, "component")
});
var $$splitComponentImporter$57 = () => import("../_hq.admin.departments-ajSw5SSZ.mjs");
var Route$60 = createFileRoute("/_hq/admin/departments")({
	head: () => ({ meta: [{ title: "Departments — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$57, "component")
});
var $$splitComponentImporter$56 = () => import("../_hq.admin.health-BFpjegFb.mjs");
var Route$59 = createFileRoute("/_hq/admin/health")({
	head: () => ({ meta: [
		{ title: "Service health — Clovr HQ" },
		{
			name: "description",
			content: "Live uptime, database latency, and recent application errors across Clovr internal services."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$56, "component")
});
var $$splitComponentImporter$55 = () => import("../_hq.admin.it-DVzGbHeZ.mjs");
var Route$58 = createFileRoute("/_hq/admin/it")({
	head: () => ({ meta: [
		{ title: "Enterprise Systems — Clovr HQ" },
		{
			name: "description",
			content: "Internal applications, integrations, Slack, service health, and security operations."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$55, "component")
});
var $$splitComponentImporter$54 = () => import("../_hq.admin.org-CmMjzOxF.mjs");
var Route$57 = createFileRoute("/_hq/admin/org")({
	head: () => ({ meta: [{ title: "Organization — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	beforeLoad: async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) throw redirect({ to: "/hq-login" });
		const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
		const rs = (roles ?? []).map((r) => r.role);
		if (!(rs.includes("super_admin") || rs.includes("admin"))) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
var $$splitComponentImporter$53 = () => import("../_hq.admin.policies-Bq65jDpM.mjs");
/** The HR handbook: policies in force and the benefits package behind them. */
var Route$56 = createFileRoute("/_hq/admin/policies")({
	head: () => ({ meta: [{ title: "Handbook — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("../_hq.admin.slack-DLmhBv1V.mjs");
var Route$55 = createFileRoute("/_hq/admin/slack")({
	head: () => ({ meta: [
		{ title: "Slack administration — Clovr HQ" },
		{
			name: "description",
			content: "Create Slack channels, invite members, and monitor bot activity from the Enterprise Systems console."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
var $$splitComponentImporter$51 = () => import("../_hq.eng.board-BuY_SfdR.mjs");
var Route$54 = createFileRoute("/_hq/eng/board")({
	head: () => ({ meta: [{ title: "Sprint board — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("../_hq.eng.changes-JY8u_7Ka.mjs");
var Route$53 = createFileRoute("/_hq/eng/changes")({
	head: () => ({ meta: [{ title: "Change Control — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var $$splitComponentImporter$49 = () => import("../_hq.eng.firmware-BaU8O-uQ.mjs");
var Route$52 = createFileRoute("/_hq/eng/firmware")({
	head: () => ({ meta: [{ title: "Firmware & autonomy — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("../_hq.eng.hardware-BqoVG3Z1.mjs");
var Route$51 = createFileRoute("/_hq/eng/hardware")({
	head: () => ({ meta: [{ title: "Hardware & BOM — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("../_hq.eng.issues-B2fbiyuJ.mjs");
var Route$50 = createFileRoute("/_hq/eng/issues")({
	head: () => ({ meta: [{ title: "Issue Triage — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var $$splitComponentImporter$46 = () => import("../_hq.eng.library-lC4Dq3R0.mjs");
var Route$49 = createFileRoute("/_hq/eng/library")({
	head: () => ({ meta: [{ title: "Engineering Library — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("../_hq.eng.programs-B8JhN6lA.mjs");
var Route$48 = createFileRoute("/_hq/eng/programs")({
	head: () => ({ meta: [{ title: "Engineering Programs — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("../_hq.eng.reviews-BAkTp_MI.mjs");
var Route$47 = createFileRoute("/_hq/eng/reviews")({
	head: () => ({ meta: [{ title: "Design Reviews — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
/** Hardware gates run in order — the board is the gate ladder, not a generic list. */
var $$splitComponentImporter$43 = () => import("../_hq.exec.announcements-BI8nImnx.mjs");
/** Leadership's broadcast channel — with read-through so nothing is assumed. */
var Route$46 = createFileRoute("/_hq/exec/announcements")({
	head: () => ({ meta: [{ title: "Announcements — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("../_hq.exec.briefing-UrWdDKQe.mjs");
var Route$45 = createFileRoute("/_hq/exec/briefing")({
	head: () => ({ meta: [{ title: "Org briefing — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("../_hq.exec.decisions-DoLN0Kli.mjs");
var Route$44 = createFileRoute("/_hq/exec/decisions")({
	head: () => ({ meta: [{ title: "Decision log — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("../_hq.exec.okrs--jQAIcp9.mjs");
var Route$43 = createFileRoute("/_hq/exec/okrs")({
	head: () => ({ meta: [{ title: "Objectives — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("../_hq.fund.campaigns-BMKI1V91.mjs");
var Route$42 = createFileRoute("/_hq/fund/campaigns")({
	head: () => ({ meta: [{ title: "Campaign Performance — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
/** Giving rolled up the way fundraisers actually think: by campaign, by month, by who gave twice. */
var $$splitComponentImporter$38 = () => import("../_hq.fund.donations-B_MMbeKj.mjs");
var Route$41 = createFileRoute("/_hq/fund/donations")({
	head: () => ({ meta: [{ title: "Gift ledger — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("../_hq.fund.donors-BF-P8Ry8.mjs");
var Route$40 = createFileRoute("/_hq/fund/donors")({
	head: () => ({ meta: [{ title: "Donors — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("../_hq.fund.grants-DXMYZDsv.mjs");
var Route$39 = createFileRoute("/_hq/fund/grants")({
	head: () => ({ meta: [{ title: "Grant pipeline — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("../_hq.fund.pipeline-CVk1knR2.mjs");
/** Partnerships and institutional funding, staged like a relationship not a sale. */
var Route$38 = createFileRoute("/_hq/fund/pipeline")({
	head: () => ({ meta: [{ title: "Partnership pipeline — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("../_hq.mfg.line-aXpcfcr4.mjs");
var Route$37 = createFileRoute("/_hq/mfg/line")({
	head: () => ({ meta: [{ title: "Build line — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("../_hq.mfg.orders-C2QLzAqE.mjs");
var Route$36 = createFileRoute("/_hq/mfg/orders")({
	head: () => ({ meta: [{ title: "Build Schedule — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
/** Fourteen-day build horizon — the line plans in days, not in lists. */
var $$splitComponentImporter$32 = () => import("../_hq.mfg.quality-BGcrcCjN.mjs");
var Route$35 = createFileRoute("/_hq/mfg/quality")({
	head: () => ({ meta: [{ title: "Quality — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("../_hq.mfg.returns-B_OJJGkg.mjs");
var Route$34 = createFileRoute("/_hq/mfg/returns")({
	head: () => ({ meta: [{ title: "Returns & repairs — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("../_hq.mfg.stock-Ta5vTuIj.mjs");
var Route$33 = createFileRoute("/_hq/mfg/stock")({
	head: () => ({ meta: [{ title: "Stockroom — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("../_hq.mfg.supply-Baxrp5yg.mjs");
var Route$32 = createFileRoute("/_hq/mfg/supply")({
	head: () => ({ meta: [{ title: "Supply chain — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("../_hq.ops.airspace-DUWRRD0j.mjs");
var Route$31 = createFileRoute("/_hq/ops/airspace")({
	head: () => ({ meta: [{ title: "Airspace & Approvals — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("../_hq.ops.cameras-D26zuZ3O.mjs");
var Route$30 = createFileRoute("/_hq/ops/cameras")({
	head: () => ({ meta: [
		{ title: "Camera Network — Clovr Labs" },
		{
			name: "description",
			content: "Watch-camera wall with live frames and AI smoke triage: sweep, inspect, and promote real detections to incidents."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("../_hq.ops.control-3ymOuzVK.mjs");
var Route$29 = createFileRoute("/_hq/ops/control")({
	head: () => ({ meta: [{ title: "Mission Control — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("../_hq.ops.coverage-CJmTXiwZ.mjs");
var Route$28 = createFileRoute("/_hq/ops/coverage")({
	head: () => ({ meta: [{ title: "Regional Coverage — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("../_hq.ops.detections-BOZ9Nf92.mjs");
var Route$27 = createFileRoute("/_hq/ops/detections")({
	head: () => ({ meta: [{ title: "Detections — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("../_hq.ops.flights-BahAlPIp.mjs");
var Route$26 = createFileRoute("/_hq/ops/flights")({
	head: () => ({ meta: [{ title: "Flight Log — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("../_hq.ops.incidents-XABYgSE6.mjs");
var Route$25 = createFileRoute("/_hq/ops/incidents")({
	validateSearch: (s) => ({ id: typeof s["id"] === "string" ? s["id"] : void 0 }),
	head: () => ({ meta: [
		{ title: "Incidents & Dispatch — Clovr Labs" },
		{
			name: "description",
			content: "Track live incidents from detection to hand-off and dispatch the right aircraft with range and battery checks."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("../_hq.ops.live-map-D1qSalLO.mjs").then((n) => n.a);
var Route$24 = createFileRoute("/_hq/ops/live-map")({
	head: () => ({ meta: [
		{ title: "Live Map — Clovr Labs" },
		{
			name: "description",
			content: "Live detection map: watch cameras, satellite hotspots, open incidents and nearby air traffic inside the response area."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("../_hq.ops.logs-M46T0Gj5.mjs");
var Route$23 = createFileRoute("/_hq/ops/logs")({
	head: () => ({ meta: [
		{ title: "Detection Logs — Clovr Labs" },
		{
			name: "description",
			content: "A minute-by-minute timeline of the detection network: sweeps starting and finishing, frame verdicts, incidents opened, pages sent and operator decisions."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("../_hq.ops.maintenance-DZfW4RER.mjs");
var Route$22 = createFileRoute("/_hq/ops/maintenance")({
	head: () => ({ meta: [{ title: "Maintenance — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("../_hq.ops.network-fleet-Cy6M_NFO.mjs");
var Route$21 = createFileRoute("/_hq/ops/network-fleet")({
	head: () => ({ meta: [
		{ title: "Response Fleet — Clovr Labs" },
		{
			name: "description",
			content: "Aircraft in the detection network: readiness, battery, retardant load and home base."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("../_hq.ops.paging-BD__utjm.mjs");
var Route$20 = createFileRoute("/_hq/ops/paging")({
	head: () => ({ meta: [
		{ title: "Mission Paging & On-Call — Clovr Labs" },
		{
			name: "description",
			content: "Mission Operations paging: live fire, incident and fleet pages, acknowledgement, escalation tiers, tracking tickets and the flight-ops on-call roster."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("../_hq.ops.readiness-DKLE9W79.mjs");
var Route$19 = createFileRoute("/_hq/ops/readiness")({
	head: () => ({ meta: [{ title: "Fleet Readiness — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("../_hq.ops.sitrep-BL0EwlNK.mjs");
var Route$18 = createFileRoute("/_hq/ops/sitrep")({
	head: () => ({ meta: [{ title: "Situation Report — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("../_hq.product.feedback-BV160MXG.mjs");
var Route$17 = createFileRoute("/_hq/product/feedback")({
	head: () => ({ meta: [{ title: "Field Feedback — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("../_hq.product.insights-B1wiJBop.mjs");
var Route$16 = createFileRoute("/_hq/product/insights")({
	head: () => ({ meta: [{ title: "Field Insights — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("../_hq.product.portfolio-DMXScPuS.mjs");
var Route$15 = createFileRoute("/_hq/product/portfolio")({
	head: () => ({ meta: [{ title: "Feature Portfolio — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("../_hq.product.releases-7lFM5Qb2.mjs");
var Route$14 = createFileRoute("/_hq/product/releases")({
	head: () => ({ meta: [{ title: "Release Trains — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("../_hq.product.roadmap-TRA5wls7.mjs");
var Route$13 = createFileRoute("/_hq/product/roadmap")({
	head: () => ({ meta: [{ title: "Product Roadmap — Clovr Labs" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("../_hq.product.support-psq5M78m.mjs");
/** Product's read on operator support: what breaks in the field and how it feels. */
var Route$12 = createFileRoute("/_hq/product/support")({
	head: () => ({ meta: [{ title: "Operator support signal — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("../_hq.systems.access-avwUVnVX.mjs");
var Route$11 = createFileRoute("/_hq/systems/access")({
	head: () => ({ meta: [{ title: "Access & identity — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("../_hq.systems.analytics-Cp_R47kE.mjs");
var Route$10 = createFileRoute("/_hq/systems/analytics")({
	head: () => ({ meta: [
		{ title: "Detection & Paging Analytics — Clovr Labs" },
		{
			name: "description",
			content: "Response performance across the detection network: mean time to acknowledge, mean time to resolve, acknowledgement rates and escalation counts by camera, zone and incident type."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("../_hq.systems.assets-Ct6xxwXs.mjs");
/** Everything IT is on the hook for keeping patched, licensed and owned. */
var Route$9 = createFileRoute("/_hq/systems/assets")({
	head: () => ({ meta: [{ title: "Application register — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("../_hq.systems.detection-Dw7mQtf2.mjs");
var Route$8 = createFileRoute("/_hq/systems/detection")({
	head: () => ({ meta: [
		{ title: "Detection Network Settings — Clovr Labs" },
		{
			name: "description",
			content: "Configure the response area, AI triage model, scheduled sweeps, camera watch list, fleet registry and dispatch rules."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
/** Type-ahead address field: debounced suggestions with an exact-format dropdown. */
/** Interval field that lets an operator work in minutes or hours. */
var $$splitComponentImporter$4 = () => import("../_hq.systems.helpdesk-Cq0LaRBk.mjs");
var Route$7 = createFileRoute("/_hq/systems/helpdesk")({
	head: () => ({ meta: [{ title: "Support desk — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("../_hq.systems.paging-oJDBMdaA.mjs");
var Route$6 = createFileRoute("/_hq/systems/paging")({
	head: () => ({ meta: [
		{ title: "Systems Paging & On-Call — Clovr Labs" },
		{
			name: "description",
			content: "Enterprise Systems paging: service outages, infrastructure failures and security events with escalation tiers, tracking tickets and the platform on-call roster."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_hq.systems.services-BtDWsrbY.mjs");
var Route$5 = createFileRoute("/_hq/systems/services")({
	head: () => ({ meta: [{ title: "Service health — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_hq.teams.index-BtWUEd1G.mjs");
var Route$4 = createFileRoute("/_hq/teams/")({
	head: () => ({ meta: [{ title: "Teams — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_hq.teams._slug-wv2BdbYl.mjs");
var Route$3 = createFileRoute("/_hq/teams/$slug")({
	head: () => ({ meta: [{ title: "Team workspace — Clovr HQ" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/**
* One-tap acknowledgement endpoint for ntfy action buttons and email links.
* The token is a per-recipient secret minted with the page target, so no
* session is required — tapping "Acknowledge" on a phone stops escalation.
*/
var Route$2 = createFileRoute("/api/public/net/page-ack")({ server: { handlers: {
	POST: ({ request }) => handle(request),
	GET: ({ request }) => handle(request)
} } });
async function handle(request) {
	const token = new URL(request.url).searchParams.get("t") ?? "";
	if (!/^[0-9a-f-]{36}$/i.test(token)) return page("Invalid acknowledgement link.", 400);
	const { supabaseAdmin } = await import("./client.server-BX0Wzst5.mjs");
	const { data, error } = await supabaseAdmin.rpc("ack_page_by_token", { _token: token });
	const res = data;
	if (error || !res?.ok) return page(res?.error ?? error?.message ?? "Could not acknowledge this page.", 400);
	return page("Page acknowledged. Escalation stopped.", 200);
}
function page(message, status) {
	return new Response(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
     <title>Page acknowledgement</title>
     <div style="font-family:system-ui,sans-serif;background:#0b1220;color:#e2e8f0;min-height:100vh;display:grid;place-items:center;margin:0">
       <div style="text-align:center;padding:32px">
         <div style="font-size:44px">${status === 200 ? "&#10003;" : "&#9888;"}</div>
         <h1 style="font-size:19px;margin:12px 0 6px">${message}</h1>
         <p style="color:#94a3b8;font-size:13px;margin:0">Clovr Labs paging</p>
       </div>
     </div>`, {
		status,
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "no-store"
		}
	});
}
var NTFY_SERVER = "https://ntfy.sh";
/**
* Delivers urgent pages to whoever they were routed to, over ntfy push and
* email. Called every minute by the internal scheduler; only sends for targets
* that have not been delivered yet and whose page is still unacknowledged.
* Every attempt (and every failure) is written to page_deliveries.
*/
var Route$1 = createFileRoute("/api/public/net/page-email")({ server: { handlers: { POST: async ({ request }) => {
	const presented = request.headers.get("x-cron-secret");
	if (!presented) return json$1({ error: "Unauthorized" }, 401);
	const { supabaseAdmin } = await import("./client.server-BX0Wzst5.mjs");
	const { data: ok, error: authErr } = await supabaseAdmin.rpc("net_verify_cron_token", { _token: presented });
	if (authErr || ok !== true) return json$1({ error: "Unauthorized" }, 401);
	const origin = new URL(request.url).origin;
	const appBase = "https://hq.clovrlab.com";
	const apiKey = process.env["RESEND_API_KEY"];
	const { data: targets } = await supabaseAdmin.from("page_targets").select("id, user_id, alert_id, level, ack_token, email_sent_at, push_sent_at").or("email_sent_at.is.null,push_sent_at.is.null").limit(50);
	const rows = targets ?? [];
	if (!rows.length) return json$1({
		sent: 0,
		pushed: 0
	});
	const alertIds = Array.from(new Set(rows.map((r) => r.alert_id)));
	const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
	const [{ data: alerts }, { data: profiles }, { data: topics }] = await Promise.all([
		supabaseAdmin.from("page_alerts").select("id, title, body, link, severity, kind, status").in("id", alertIds),
		supabaseAdmin.from("profiles").select("id, email, full_name").in("id", userIds),
		supabaseAdmin.from("push_topics").select("user_id, topic, revoked").in("user_id", userIds)
	]);
	const alertById = new Map((alerts ?? []).map((a) => [a.id, a]));
	const emailById = new Map((profiles ?? []).map((p) => [p.id, p]));
	const topicByUser = new Map((topics ?? []).filter((t) => !t.revoked).map((t) => [t.user_id, t.topic]));
	let sent = 0;
	let pushed = 0;
	const errors = [];
	const stamp = () => (/* @__PURE__ */ new Date()).toISOString();
	const logDelivery = async (t, channel, status, detail) => {
		await supabaseAdmin.from("page_deliveries").insert({
			alert_id: t.alert_id,
			target_id: t.id,
			user_id: t.user_id,
			channel,
			status,
			detail
		});
	};
	for (const t of rows) {
		const a = alertById.get(t.alert_id);
		const p = emailById.get(t.user_id);
		if (!a) continue;
		if (a.status === "resolved") {
			await supabaseAdmin.from("page_targets").update({
				email_sent_at: stamp(),
				push_sent_at: stamp()
			}).eq("id", t.id);
			continue;
		}
		const ackUrl = `${origin}/api/public/net/page-ack?t=${t.ack_token}`;
		const openUrl = `${appBase}${a.link ?? "/ops/paging"}`;
		const topic = topicByUser.get(t.user_id);
		if (topic && !t.push_sent_at) try {
			const res = await fetch(`${NTFY_SERVER}/${topic}`, {
				method: "POST",
				headers: {
					Title: ascii(`${String(a.severity).toUpperCase()} PAGE - ${a.title}`).slice(0, 180),
					Priority: a.severity === "critical" ? "5" : "4",
					Tags: "rotating_light",
					Click: openUrl,
					"X-Actions": [`http, Acknowledge, ${ackUrl}, method=POST, clear=true`, `view, Open console, ${openUrl}`].join("; ")
				},
				body: `${a.body ? String(a.body).slice(0, 300) : "Urgent page - acknowledgement required."}\nTier ${t.level} - ${a.kind}`
			});
			if (!res.ok) throw new Error(`ntfy ${res.status}: ${(await res.text()).slice(0, 160)}`);
			await supabaseAdmin.from("page_targets").update({ push_sent_at: stamp() }).eq("id", t.id);
			await supabaseAdmin.from("push_topics").update({ last_sent_at: stamp() }).eq("user_id", t.user_id);
			await logDelivery(t, "ntfy", "sent", `Accepted by ntfy for topic ${topic}`);
			pushed++;
		} catch (e) {
			errors.push(e.message);
			await logDelivery(t, "ntfy", "failed", e.message.slice(0, 300));
		}
		else if (!topic && !t.push_sent_at) {
			await supabaseAdmin.from("page_targets").update({ push_sent_at: stamp() }).eq("id", t.id);
			await logDelivery(t, "ntfy", "skipped", "Operator has no active push topic");
		}
		if (!apiKey || !p?.email || t.email_sent_at) continue;
		try {
			const res = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					from: "Clovr Labs Paging <alerts@clovrlab.com>",
					to: [p.email],
					subject: `🚨 ${String(a.severity).toUpperCase()} PAGE — ${a.title}`,
					html: `
                  <div style="font-family:system-ui,sans-serif;max-width:520px">
                    <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#b91c1c;margin:0 0 8px">
                      ${a.severity} page · ${a.kind} · tier ${t.level}
                    </p>
                    <h1 style="font-size:20px;margin:0 0 8px">${escapeHtml(a.title)}</h1>
                    <p style="color:#475569;font-size:14px;margin:0 0 16px">${escapeHtml(a.body ?? "")}</p>
                    <a href="${ackUrl}"
                       style="display:inline-block;background:#dc2626;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">
                      Acknowledge this page
                    </a>
                    <p style="margin:14px 0 0"><a href="${openUrl}" style="color:#2563eb;font-size:13px">Open the paging console</a></p>
                    <p style="color:#94a3b8;font-size:12px;margin-top:16px">
                      This page keeps escalating to the next on-call tier until someone acknowledges it.
                    </p>
                  </div>`
				})
			});
			if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 160)}`);
			await supabaseAdmin.from("page_targets").update({ email_sent_at: stamp() }).eq("id", t.id);
			await logDelivery(t, "email", "sent", `Delivered to ${p.email}`);
			sent++;
		} catch (e) {
			errors.push(e.message);
			await logDelivery(t, "email", "failed", e.message.slice(0, 300));
		}
	}
	return json$1({
		sent,
		pushed,
		errors: errors.slice(0, 3)
	});
} } } });
function escapeHtml(s) {
	return s.replace(/[&<>"]/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	})[c]);
}
function json$1(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
/** ntfy headers must be ASCII; strip emoji/accents from titles. */
function ascii(s) {
	return s.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").trim();
}
var R = 3958.8;
function haversineMi(a, b) {
	const toRad = (x) => x * Math.PI / 180;
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(s));
}
async function fetchResponseArea() {
	const { data } = await supabase.from("net_response_area").select("*").eq("id", true).maybeSingle();
	return data ?? null;
}
async function saveResponseArea(patch) {
	const { data, error } = await supabase.from("net_response_area").upsert({
		id: true,
		...patch
	}, { onConflict: "id" }).select().maybeSingle();
	if (error) throw error;
	if (!data) throw new Error("Nothing was saved — admin access is required to change the service area.");
	return data;
}
var norm = (v) => (v ?? "").trim().toLowerCase().replace(/\s+county$/, "");
/**
* True when a point is inside the configured response area.
* - "address" mode: radius around the geocoded centre point.
* - "region" mode: the point's state / county must be on the subscribed list.
* Passing state/county is optional; without them a region area falls back to the radius.
*/
function inArea(area, p) {
	if (!area) return true;
	if (area.mode === "region") {
		const states = (area.states ?? []).map(norm).filter(Boolean);
		const counties = (area.counties ?? []).map(norm).filter(Boolean);
		if (!states.length && !counties.length) return true;
		if (p.state == null && p.county == null) return true;
		const stateOk = !states.length || states.includes(norm(p.state));
		const countyOk = !counties.length || counties.includes(norm(p.county));
		return stateOk && countyOk;
	}
	const radius = Number(area.radius_mi) || 0;
	if (radius <= 0) return true;
	return haversineMi({
		lat: Number(area.center_lat),
		lng: Number(area.center_lng)
	}, p) <= radius;
}
/**
* Scheduled AI camera sweep. Called by pg_cron.
* Bounded batch + single-flight DB lock + paused-state guard + circuit breaker.
*/
var Route = createFileRoute("/api/public/net/sweep")({ server: { handlers: { POST: async ({ request }) => {
	const apiKey = process.env["OPENROUTER_API_KEY"];
	const { supabaseAdmin } = await import("./client.server-BX0Wzst5.mjs");
	const { runSweep } = await import("./sweep.server-CfzOSjhm.mjs");
	const presented = request.headers.get("x-cron-secret");
	if (!presented) return json({ error: "Unauthorized" }, 401);
	const { data: ok, error: authErr } = await supabaseAdmin.rpc("net_verify_cron_token", { _token: presented });
	if (authErr || ok !== true) return json({ error: "Unauthorized" }, 401);
	const { data: st } = await supabaseAdmin.from("net_settings").select("*").eq("id", true).maybeSingle();
	const s = st;
	if (!s) return json({ skipped: "no settings row" });
	if (!s.sweep_enabled) return json({ skipped: "scheduled sweeps disabled" });
	if (!apiKey) return json({ skipped: "OPENROUTER_API_KEY missing" });
	const now = Date.now();
	const probeOnly = Boolean(s.paused);
	if (s.sweep_lock_until && new Date(s.sweep_lock_until).getTime() > now) return json({ skipped: "another sweep is running" });
	const baseMin = Math.max(1, Number(s.sweep_interval_minutes ?? (s.sweep_interval_hours || 1) * 60));
	const riskMin = Math.max(1, Math.min(baseMin, Number(s.high_risk_interval_minutes ?? baseMin)));
	const { data: lastFullRun } = await supabaseAdmin.from("net_sweep_runs").select("created_at").eq("trigger", "scheduled").order("created_at", { ascending: false }).limit(1).maybeSingle();
	const lastFull = lastFullRun?.created_at ? new Date(lastFullRun.created_at).getTime() : 0;
	const last = s.last_sweep_at ? new Date(s.last_sweep_at).getTime() : 0;
	const fullDue = !lastFull || now >= lastFull + baseMin * 6e4;
	const riskDue = !last || now >= last + riskMin * 6e4;
	if (!probeOnly && !fullDue && !riskDue) return json({ skipped: "not due yet" });
	const highRiskOnly = !probeOnly && !fullDue && riskDue;
	await supabaseAdmin.from("net_settings").update({ sweep_lock_until: new Date(now + 6e5).toISOString() }).eq("id", true);
	try {
		const [{ data: area }, { data: prefs }, { data: muted }, { data: openInc }] = await Promise.all([
			supabaseAdmin.from("net_response_area").select("*").eq("id", true).maybeSingle(),
			supabaseAdmin.from("net_camera_prefs").select("camera_id, watch, priority, high_risk"),
			supabaseAdmin.from("net_muted_cameras").select("camera_id, muted_until"),
			supabaseAdmin.from("net_incidents").select("camera_id").not("status", "in", "(closed,false_positive)")
		]);
		const mutedIds = new Set((muted ?? []).filter((m) => !m.muted_until || new Date(m.muted_until).getTime() > now).map((m) => m.camera_id));
		const busyIds = new Set((openInc ?? []).map((i) => i.camera_id).filter(Boolean));
		const prefById = new Map((prefs ?? []).map((p) => [p.camera_id, p]));
		const a = area;
		const cameras = (await fetchCameras()).filter((c) => c.image.url && !mutedIds.has(c.site.id) && !busyIds.has(c.site.id)).filter((c) => {
			const p = prefById.get(c.site.id);
			if (p && p.watch === false) return false;
			if (highRiskOnly && !(p && p.high_risk)) return false;
			if (s.sweep_priority_only && !(p && Number(p.priority) > 0)) return false;
			return inArea(a, {
				lat: Number(c.site.latitude),
				lng: Number(c.site.longitude),
				state: c.site.state,
				county: c.site.county
			});
		}).sort((x, y) => {
			const px = prefById.get(x.site.id);
			const py = prefById.get(y.site.id);
			return Number(!!py?.high_risk) - Number(!!px?.high_risk) || (py?.priority ?? 0) - (px?.priority ?? 0);
		});
		const cap = probeOnly ? 1 : Math.max(1, Math.min(50, Number(s.sweep_batch_size || 25)));
		const batch = cameras.slice(0, cap).map((c) => ({
			camera_id: c.site.id,
			camera_name: c.name,
			lat: Number(c.site.latitude),
			lng: Number(c.site.longitude),
			state: c.site.state,
			county: c.site.county,
			image_url: c.image.url,
			image_time: c.image.time ?? (/* @__PURE__ */ new Date()).toISOString()
		}));
		if (!batch.length) {
			await unlock(supabaseAdmin, { last_sweep_at: (/* @__PURE__ */ new Date()).toISOString() });
			return json({
				analyzed: 0,
				created: 0,
				note: "no eligible cameras"
			});
		}
		const res = await runSweep(supabaseAdmin, batch, apiKey, {
			model: s.ai_model,
			minConfidence: Number(s.min_confidence ?? 55),
			trigger: highRiskOnly ? "scheduled-highrisk" : "scheduled"
		});
		if (res.blocked) {
			await unlock(supabaseAdmin, {
				paused: true,
				pause_reason: res.blocked.message
			});
			return json({
				paused: true,
				reason: res.blocked.message
			}, 200);
		}
		await unlock(supabaseAdmin, {
			last_sweep_at: (/* @__PURE__ */ new Date()).toISOString(),
			...probeOnly ? {
				paused: false,
				pause_reason: null
			} : {}
		});
		return json({
			analyzed: res.analyzed,
			created: res.created,
			errors: res.errors,
			resumed: probeOnly
		});
	} catch (e) {
		await unlock(supabaseAdmin, {});
		return json({ error: e.message }, 500);
	}
} } } });
async function unlock(supabaseAdmin, patch) {
	await supabaseAdmin.from("net_settings").update({
		sweep_lock_until: null,
		...patch
	}).eq("id", true);
}
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
var IndexRoute = Route$117.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$118
});
var HqRoute = Route$116.update({
	id: "/_hq",
	getParentRoute: () => Route$118
});
var AboutRoute = Route$115.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$118
});
var ContactRoute = Route$114.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$118
});
var DevelopmentRoute = Route$113.update({
	id: "/development",
	path: "/development",
	getParentRoute: () => Route$118
});
var DonateRoute = Route$112.update({
	id: "/donate",
	path: "/donate",
	getParentRoute: () => Route$118
});
var FaqRoute = Route$111.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$118
});
var HqLoginRoute = Route$110.update({
	id: "/hq-login",
	path: "/hq-login",
	getParentRoute: () => Route$118
});
var JoinRoute = Route$109.update({
	id: "/join",
	path: "/join",
	getParentRoute: () => Route$118
});
var MissionRoute = Route$108.update({
	id: "/mission",
	path: "/mission",
	getParentRoute: () => Route$118
});
var OperationsRoute = Route$107.update({
	id: "/operations",
	path: "/operations",
	getParentRoute: () => Route$118
});
var PartnersRoute = Route$106.update({
	id: "/partners",
	path: "/partners",
	getParentRoute: () => Route$118
});
var SitemapDotxmlRoute = Route$105.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$118
});
var SystemRoute = Route$104.update({
	id: "/system",
	path: "/system",
	getParentRoute: () => Route$118
});
var TechnologyRoute = Route$103.update({
	id: "/technology",
	path: "/technology",
	getParentRoute: () => Route$118
});
var WelcomeRoute = Route$102.update({
	id: "/welcome",
	path: "/welcome",
	getParentRoute: () => Route$118
});
var WorkspacesRoute = Route$101.update({
	id: "/workspaces",
	path: "/workspaces",
	getParentRoute: () => Route$118
});
var HqAccountingRoute = Route$100.update({
	id: "/accounting",
	path: "/accounting",
	getParentRoute: () => HqRoute
});
var HqAnalyticsRoute = Route$99.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => HqRoute
});
var HqAttendanceRoute = Route$98.update({
	id: "/attendance",
	path: "/attendance",
	getParentRoute: () => HqRoute
});
var HqCalendarRoute = Route$97.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => HqRoute
});
var HqCertificationsRoute = Route$96.update({
	id: "/certifications",
	path: "/certifications",
	getParentRoute: () => HqRoute
});
var HqDashboardRoute = Route$95.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => HqRoute
});
var HqDriveRoute = Route$94.update({
	id: "/drive",
	path: "/drive",
	getParentRoute: () => HqRoute
});
var HqEmployeesRoute = Route$93.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => HqRoute
});
var HqExpensesRoute = Route$92.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => HqRoute
});
var HqFinancialReportsRoute = Route$91.update({
	id: "/financial-reports",
	path: "/financial-reports",
	getParentRoute: () => HqRoute
});
var HqHelpRoute = Route$90.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => HqRoute
});
var HqHiringRoute = Route$89.update({
	id: "/hiring",
	path: "/hiring",
	getParentRoute: () => HqRoute
});
var HqInvoicesRoute = Route$88.update({
	id: "/invoices",
	path: "/invoices",
	getParentRoute: () => HqRoute
});
var HqKbRoute = Route$87.update({
	id: "/kb",
	path: "/kb",
	getParentRoute: () => HqRoute
});
var HqMailRoute = Route$86.update({
	id: "/mail",
	path: "/mail",
	getParentRoute: () => HqRoute
});
var HqMeetingNotesRoute = Route$85.update({
	id: "/meeting-notes",
	path: "/meeting-notes",
	getParentRoute: () => HqRoute
});
var HqMeetingsRoute = Route$84.update({
	id: "/meetings",
	path: "/meetings",
	getParentRoute: () => HqRoute
});
var HqMyTimeRoute = Route$83.update({
	id: "/my-time",
	path: "/my-time",
	getParentRoute: () => HqRoute
});
var HqNotificationsRoute = Route$82.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => HqRoute
});
var HqOnboardingRoute = Route$81.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => HqRoute
});
var HqOrgChartRoute = Route$80.update({
	id: "/org-chart",
	path: "/org-chart",
	getParentRoute: () => HqRoute
});
var HqPhoneRoute = Route$79.update({
	id: "/phone",
	path: "/phone",
	getParentRoute: () => HqRoute
});
var HqProfileRoute = Route$78.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => HqRoute
});
var HqPurchaseOrdersRoute = Route$77.update({
	id: "/purchase-orders",
	path: "/purchase-orders",
	getParentRoute: () => HqRoute
});
var HqRdIdeasRoute = Route$76.update({
	id: "/rd-ideas",
	path: "/rd-ideas",
	getParentRoute: () => HqRoute
});
var HqRequestsRoute = Route$75.update({
	id: "/requests",
	path: "/requests",
	getParentRoute: () => HqRoute
});
var HqReviewsRoute = Route$74.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => HqRoute
});
var HqSearchRoute = Route$73.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => HqRoute
});
var HqSettingsRoute = Route$72.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => HqRoute
});
var HqTasksRoute = Route$71.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => HqRoute
});
var HqTeamsRoute = Route$70.update({
	id: "/teams",
	path: "/teams",
	getParentRoute: () => HqRoute
});
var HqTimeOffRoute = Route$69.update({
	id: "/time-off",
	path: "/time-off",
	getParentRoute: () => HqRoute
});
var HqTrainingRoute = Route$68.update({
	id: "/training",
	path: "/training",
	getParentRoute: () => HqRoute
});
var ApiPlanesRoute = Route$67.update({
	id: "/api/planes",
	path: "/api/planes",
	getParentRoute: () => Route$118
});
var LegalCookiesRoute = Route$66.update({
	id: "/legal/cookies",
	path: "/legal/cookies",
	getParentRoute: () => Route$118
});
var LegalPrivacyRoute = Route$65.update({
	id: "/legal/privacy",
	path: "/legal/privacy",
	getParentRoute: () => Route$118
});
var LegalTermsRoute = Route$64.update({
	id: "/legal/terms",
	path: "/legal/terms",
	getParentRoute: () => Route$118
});
var MeetingIdRoute = Route$63.update({
	id: "/meeting/$id",
	path: "/meeting/$id",
	getParentRoute: () => Route$118
});
var HqAdminAppsRoute = Route$62.update({
	id: "/admin/apps",
	path: "/admin/apps",
	getParentRoute: () => HqRoute
});
var HqAdminCompanyRoute = Route$61.update({
	id: "/admin/company",
	path: "/admin/company",
	getParentRoute: () => HqRoute
});
var HqAdminDepartmentsRoute = Route$60.update({
	id: "/admin/departments",
	path: "/admin/departments",
	getParentRoute: () => HqRoute
});
var HqAdminHealthRoute = Route$59.update({
	id: "/admin/health",
	path: "/admin/health",
	getParentRoute: () => HqRoute
});
var HqAdminItRoute = Route$58.update({
	id: "/admin/it",
	path: "/admin/it",
	getParentRoute: () => HqRoute
});
var HqAdminOrgRoute = Route$57.update({
	id: "/admin/org",
	path: "/admin/org",
	getParentRoute: () => HqRoute
});
var HqAdminPoliciesRoute = Route$56.update({
	id: "/admin/policies",
	path: "/admin/policies",
	getParentRoute: () => HqRoute
});
var HqAdminSlackRoute = Route$55.update({
	id: "/admin/slack",
	path: "/admin/slack",
	getParentRoute: () => HqRoute
});
var HqEngBoardRoute = Route$54.update({
	id: "/eng/board",
	path: "/eng/board",
	getParentRoute: () => HqRoute
});
var HqEngChangesRoute = Route$53.update({
	id: "/eng/changes",
	path: "/eng/changes",
	getParentRoute: () => HqRoute
});
var HqEngFirmwareRoute = Route$52.update({
	id: "/eng/firmware",
	path: "/eng/firmware",
	getParentRoute: () => HqRoute
});
var HqEngHardwareRoute = Route$51.update({
	id: "/eng/hardware",
	path: "/eng/hardware",
	getParentRoute: () => HqRoute
});
var HqEngIssuesRoute = Route$50.update({
	id: "/eng/issues",
	path: "/eng/issues",
	getParentRoute: () => HqRoute
});
var HqEngLibraryRoute = Route$49.update({
	id: "/eng/library",
	path: "/eng/library",
	getParentRoute: () => HqRoute
});
var HqEngProgramsRoute = Route$48.update({
	id: "/eng/programs",
	path: "/eng/programs",
	getParentRoute: () => HqRoute
});
var HqEngReviewsRoute = Route$47.update({
	id: "/eng/reviews",
	path: "/eng/reviews",
	getParentRoute: () => HqRoute
});
var HqExecAnnouncementsRoute = Route$46.update({
	id: "/exec/announcements",
	path: "/exec/announcements",
	getParentRoute: () => HqRoute
});
var HqExecBriefingRoute = Route$45.update({
	id: "/exec/briefing",
	path: "/exec/briefing",
	getParentRoute: () => HqRoute
});
var HqExecDecisionsRoute = Route$44.update({
	id: "/exec/decisions",
	path: "/exec/decisions",
	getParentRoute: () => HqRoute
});
var HqExecOkrsRoute = Route$43.update({
	id: "/exec/okrs",
	path: "/exec/okrs",
	getParentRoute: () => HqRoute
});
var HqFundCampaignsRoute = Route$42.update({
	id: "/fund/campaigns",
	path: "/fund/campaigns",
	getParentRoute: () => HqRoute
});
var HqFundDonationsRoute = Route$41.update({
	id: "/fund/donations",
	path: "/fund/donations",
	getParentRoute: () => HqRoute
});
var HqFundDonorsRoute = Route$40.update({
	id: "/fund/donors",
	path: "/fund/donors",
	getParentRoute: () => HqRoute
});
var HqFundGrantsRoute = Route$39.update({
	id: "/fund/grants",
	path: "/fund/grants",
	getParentRoute: () => HqRoute
});
var HqFundPipelineRoute = Route$38.update({
	id: "/fund/pipeline",
	path: "/fund/pipeline",
	getParentRoute: () => HqRoute
});
var HqMfgLineRoute = Route$37.update({
	id: "/mfg/line",
	path: "/mfg/line",
	getParentRoute: () => HqRoute
});
var HqMfgOrdersRoute = Route$36.update({
	id: "/mfg/orders",
	path: "/mfg/orders",
	getParentRoute: () => HqRoute
});
var HqMfgQualityRoute = Route$35.update({
	id: "/mfg/quality",
	path: "/mfg/quality",
	getParentRoute: () => HqRoute
});
var HqMfgReturnsRoute = Route$34.update({
	id: "/mfg/returns",
	path: "/mfg/returns",
	getParentRoute: () => HqRoute
});
var HqMfgStockRoute = Route$33.update({
	id: "/mfg/stock",
	path: "/mfg/stock",
	getParentRoute: () => HqRoute
});
var HqMfgSupplyRoute = Route$32.update({
	id: "/mfg/supply",
	path: "/mfg/supply",
	getParentRoute: () => HqRoute
});
var HqOpsAirspaceRoute = Route$31.update({
	id: "/ops/airspace",
	path: "/ops/airspace",
	getParentRoute: () => HqRoute
});
var HqOpsCamerasRoute = Route$30.update({
	id: "/ops/cameras",
	path: "/ops/cameras",
	getParentRoute: () => HqRoute
});
var HqOpsControlRoute = Route$29.update({
	id: "/ops/control",
	path: "/ops/control",
	getParentRoute: () => HqRoute
});
var HqOpsCoverageRoute = Route$28.update({
	id: "/ops/coverage",
	path: "/ops/coverage",
	getParentRoute: () => HqRoute
});
var HqOpsDetectionsRoute = Route$27.update({
	id: "/ops/detections",
	path: "/ops/detections",
	getParentRoute: () => HqRoute
});
var HqOpsFlightsRoute = Route$26.update({
	id: "/ops/flights",
	path: "/ops/flights",
	getParentRoute: () => HqRoute
});
var HqOpsIncidentsRoute = Route$25.update({
	id: "/ops/incidents",
	path: "/ops/incidents",
	getParentRoute: () => HqRoute
});
var HqOpsLiveMapRoute = Route$24.update({
	id: "/ops/live-map",
	path: "/ops/live-map",
	getParentRoute: () => HqRoute
});
var HqOpsLogsRoute = Route$23.update({
	id: "/ops/logs",
	path: "/ops/logs",
	getParentRoute: () => HqRoute
});
var HqOpsMaintenanceRoute = Route$22.update({
	id: "/ops/maintenance",
	path: "/ops/maintenance",
	getParentRoute: () => HqRoute
});
var HqOpsNetworkFleetRoute = Route$21.update({
	id: "/ops/network-fleet",
	path: "/ops/network-fleet",
	getParentRoute: () => HqRoute
});
var HqOpsPagingRoute = Route$20.update({
	id: "/ops/paging",
	path: "/ops/paging",
	getParentRoute: () => HqRoute
});
var HqOpsReadinessRoute = Route$19.update({
	id: "/ops/readiness",
	path: "/ops/readiness",
	getParentRoute: () => HqRoute
});
var HqOpsSitrepRoute = Route$18.update({
	id: "/ops/sitrep",
	path: "/ops/sitrep",
	getParentRoute: () => HqRoute
});
var HqProductFeedbackRoute = Route$17.update({
	id: "/product/feedback",
	path: "/product/feedback",
	getParentRoute: () => HqRoute
});
var HqProductInsightsRoute = Route$16.update({
	id: "/product/insights",
	path: "/product/insights",
	getParentRoute: () => HqRoute
});
var HqProductPortfolioRoute = Route$15.update({
	id: "/product/portfolio",
	path: "/product/portfolio",
	getParentRoute: () => HqRoute
});
var HqProductReleasesRoute = Route$14.update({
	id: "/product/releases",
	path: "/product/releases",
	getParentRoute: () => HqRoute
});
var HqProductRoadmapRoute = Route$13.update({
	id: "/product/roadmap",
	path: "/product/roadmap",
	getParentRoute: () => HqRoute
});
var HqProductSupportRoute = Route$12.update({
	id: "/product/support",
	path: "/product/support",
	getParentRoute: () => HqRoute
});
var HqSystemsAccessRoute = Route$11.update({
	id: "/systems/access",
	path: "/systems/access",
	getParentRoute: () => HqRoute
});
var HqSystemsAnalyticsRoute = Route$10.update({
	id: "/systems/analytics",
	path: "/systems/analytics",
	getParentRoute: () => HqRoute
});
var HqSystemsAssetsRoute = Route$9.update({
	id: "/systems/assets",
	path: "/systems/assets",
	getParentRoute: () => HqRoute
});
var HqSystemsDetectionRoute = Route$8.update({
	id: "/systems/detection",
	path: "/systems/detection",
	getParentRoute: () => HqRoute
});
var HqSystemsHelpdeskRoute = Route$7.update({
	id: "/systems/helpdesk",
	path: "/systems/helpdesk",
	getParentRoute: () => HqRoute
});
var HqSystemsPagingRoute = Route$6.update({
	id: "/systems/paging",
	path: "/systems/paging",
	getParentRoute: () => HqRoute
});
var HqSystemsServicesRoute = Route$5.update({
	id: "/systems/services",
	path: "/systems/services",
	getParentRoute: () => HqRoute
});
var HqTeamsIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => HqTeamsRoute
});
var HqTeamsSlugRoute = Route$3.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => HqTeamsRoute
});
var ApiPublicNetPageAckRoute = Route$2.update({
	id: "/api/public/net/page-ack",
	path: "/api/public/net/page-ack",
	getParentRoute: () => Route$118
});
var ApiPublicNetPageEmailRoute = Route$1.update({
	id: "/api/public/net/page-email",
	path: "/api/public/net/page-email",
	getParentRoute: () => Route$118
});
var ApiPublicNetSweepRoute = Route.update({
	id: "/api/public/net/sweep",
	path: "/api/public/net/sweep",
	getParentRoute: () => Route$118
});
var HqTeamsRouteChildren = {
	HqTeamsSlugRoute,
	HqTeamsIndexRoute
};
var HqRouteChildren = {
	HqAccountingRoute,
	HqAnalyticsRoute,
	HqAttendanceRoute,
	HqCalendarRoute,
	HqCertificationsRoute,
	HqDashboardRoute,
	HqDriveRoute,
	HqEmployeesRoute,
	HqExpensesRoute,
	HqFinancialReportsRoute,
	HqHelpRoute,
	HqHiringRoute,
	HqInvoicesRoute,
	HqKbRoute,
	HqMailRoute,
	HqMeetingNotesRoute,
	HqMeetingsRoute,
	HqMyTimeRoute,
	HqNotificationsRoute,
	HqOnboardingRoute,
	HqOrgChartRoute,
	HqPhoneRoute,
	HqProfileRoute,
	HqPurchaseOrdersRoute,
	HqRdIdeasRoute,
	HqRequestsRoute,
	HqReviewsRoute,
	HqSearchRoute,
	HqSettingsRoute,
	HqTasksRoute,
	HqTeamsRoute: HqTeamsRoute._addFileChildren(HqTeamsRouteChildren),
	HqTimeOffRoute,
	HqTrainingRoute,
	HqAdminAppsRoute,
	HqAdminCompanyRoute,
	HqAdminDepartmentsRoute,
	HqAdminHealthRoute,
	HqAdminItRoute,
	HqAdminOrgRoute,
	HqAdminPoliciesRoute,
	HqAdminSlackRoute,
	HqEngBoardRoute,
	HqEngChangesRoute,
	HqEngFirmwareRoute,
	HqEngHardwareRoute,
	HqEngIssuesRoute,
	HqEngLibraryRoute,
	HqEngProgramsRoute,
	HqEngReviewsRoute,
	HqExecAnnouncementsRoute,
	HqExecBriefingRoute,
	HqExecDecisionsRoute,
	HqExecOkrsRoute,
	HqFundCampaignsRoute,
	HqFundDonationsRoute,
	HqFundDonorsRoute,
	HqFundGrantsRoute,
	HqFundPipelineRoute,
	HqMfgLineRoute,
	HqMfgOrdersRoute,
	HqMfgQualityRoute,
	HqMfgReturnsRoute,
	HqMfgStockRoute,
	HqMfgSupplyRoute,
	HqOpsAirspaceRoute,
	HqOpsCamerasRoute,
	HqOpsControlRoute,
	HqOpsCoverageRoute,
	HqOpsDetectionsRoute,
	HqOpsFlightsRoute,
	HqOpsIncidentsRoute,
	HqOpsLiveMapRoute,
	HqOpsLogsRoute,
	HqOpsMaintenanceRoute,
	HqOpsNetworkFleetRoute,
	HqOpsPagingRoute,
	HqOpsReadinessRoute,
	HqOpsSitrepRoute,
	HqProductFeedbackRoute,
	HqProductInsightsRoute,
	HqProductPortfolioRoute,
	HqProductReleasesRoute,
	HqProductRoadmapRoute,
	HqProductSupportRoute,
	HqSystemsAccessRoute,
	HqSystemsAnalyticsRoute,
	HqSystemsAssetsRoute,
	HqSystemsDetectionRoute,
	HqSystemsHelpdeskRoute,
	HqSystemsPagingRoute,
	HqSystemsServicesRoute
};
var rootRouteChildren = {
	IndexRoute,
	HqRoute: HqRoute._addFileChildren(HqRouteChildren),
	AboutRoute,
	ContactRoute,
	DevelopmentRoute,
	DonateRoute,
	FaqRoute,
	HqLoginRoute,
	JoinRoute,
	MissionRoute,
	OperationsRoute,
	PartnersRoute,
	SitemapDotxmlRoute,
	SystemRoute,
	TechnologyRoute,
	WelcomeRoute,
	WorkspacesRoute,
	ApiPlanesRoute,
	LegalCookiesRoute,
	LegalPrivacyRoute,
	LegalTermsRoute,
	MeetingIdRoute,
	ApiPublicNetPageAckRoute,
	ApiPublicNetPageEmailRoute,
	ApiPublicNetSweepRoute
};
var routeTree = Route$118._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { saveResponseArea as a, TEAMS as c, brand as d, fetchCameras as f, inArea as i, faqs as l, relTime as m, fetchResponseArea as n, Route$25 as o, getStatus as p, haversineMi as r, Route$63 as s, router_exports as t, j_ridge_default as u };
