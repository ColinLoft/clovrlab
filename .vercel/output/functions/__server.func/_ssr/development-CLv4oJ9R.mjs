import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { o as phases, t as expansion } from "./system-C-OlbEAm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/development-CLv4oJ9R.js
var import_jsx_runtime = require_jsx_runtime();
function DevelopmentPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					eyebrow: "Development status",
					title: "Building it in public.",
					lede: "We are an early-stage organization. Nothing described on this site is operationally deployed. Here is exactly where the programme stands and what has to happen next."
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-px border border-border bg-border",
				children: phases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "bg-[var(--night)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "grid gap-6 px-6 py-8 sm:grid-cols-[6rem_1fr_10rem] sm:items-start sm:gap-10 sm:px-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "display-cond text-[clamp(2.2rem,4vw,3.4rem)] text-[var(--signal)]",
								children: p.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-ink",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground",
								children: p.body
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `justify-self-start border px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.16em] sm:justify-self-end ${p.state === "Ahead" ? "border-border text-muted-foreground" : "border-[color:var(--signal)]/50 text-[var(--signal)]"}`,
								children: p.state
							})
						]
					})
				}, p.n))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs text-muted-foreground",
				children: "No stage is marked complete. Stages marked \"Ahead\" have not started and have no committed dates."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				wide: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-14 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "01",
						tone: "light",
						children: "What is true today"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-3 text-base text-foreground/85",
						children: [
							"We are developing a wildfire detection and UAV response system.",
							"We are developing supporting sensor, software, aerospace, and robotics technologies.",
							"Wildfire is our first major mission.",
							"The organization operates a 24/7/365 Operations Center."
						].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]",
								"aria-hidden": true
							}), x]
						}, x))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 120,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
								n: "02",
								tone: "light",
								children: "What is not true yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-8 space-y-3 text-base text-muted-foreground",
								children: [
									"No sensor network is deployed in the field.",
									"No aircraft fleet is in operational service.",
									"No fires have been detected or responded to by this system.",
									"No response times, coverage areas, or performance figures exist to publish."
								].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--signal)]",
										"aria-hidden": true
									}), x]
								}, x))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm text-muted-foreground",
								children: "When any of that changes, this page changes first."
							})
						]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
				n: "03",
				tone: "light",
				children: "Later, not now"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl",
				children: "Wildfire is only the beginning."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground",
				children: "The same foundation could eventually serve other emergencies. That is a direction, not a roadmap — the wildfire system comes first."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
				children: expansion.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "bg-[var(--night)] px-5 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-ink",
						children: e.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-muted-foreground",
						children: e.body
					})]
				}, e.title))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
				to: "/join",
				variant: "primary",
				children: "Build with us"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
				to: "/donate",
				variant: "ghost",
				className: "border border-border text-ink hover:bg-surface",
				children: "Support the mission"
			})]
		})] })
	] });
}
//#endregion
export { DevelopmentPage as component };
