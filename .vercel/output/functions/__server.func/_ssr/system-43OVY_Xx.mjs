import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { c as stages } from "./system-C-OlbEAm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/system-43OVY_Xx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* The signature architecture visual: sensor node → detection → alert →
* operations center → UAV dispatch → autonomous flight → investigation →
* intelligence → responder. A signal pulse travels the chain; each stage can
* be selected to reveal detail.
*/
function SystemArchitecture() {
	const [active, setActive] = (0, import_react.useState)(0);
	const [pulse, setPulse] = (0, import_react.useState)(0);
	const paused = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => {
			if (!paused.current) setPulse((p) => (p + 1) % stages.length);
		}, 1400);
		return () => window.clearInterval(id);
	}, []);
	const s = stages[active];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "blueprint-grid border border-border bg-[var(--night)] text-foreground",
		onMouseEnter: () => paused.current = true,
		onMouseLeave: () => paused.current = false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid grid-cols-3 gap-px bg-border sm:grid-cols-5 lg:grid-cols-9",
			children: stages.map((st, i) => {
				const isActive = i === active;
				const isPulse = i === pulse;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setActive(i),
					"aria-pressed": isActive,
					className: `group relative flex h-full w-full flex-col items-start gap-2 px-3 py-5 text-left transition-colors ${isActive ? "bg-surface" : "bg-[var(--night)] hover:bg-surface/60"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute left-0 top-0 h-[2px] w-full transition-opacity duration-500",
							style: {
								background: st.accent,
								opacity: isActive ? 1 : isPulse ? .7 : .14
							},
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[0.65rem] tabular-nums tracking-[0.2em]",
							style: { color: st.accent },
							children: st.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[0.72rem] font-semibold uppercase leading-tight tracking-[0.1em] ${isActive ? "text-ink" : "text-foreground/70 group-hover:text-ink"}`,
							children: st.title
						})
					]
				}) }, st.slug);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 border-t border-border p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[0.68rem] uppercase tracking-[0.22em]",
					style: { color: s.accent },
					children: [
						"Stage ",
						s.n,
						" · ",
						s.kicker
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "display-cond mt-4 text-[clamp(2rem,4.4vw,3.4rem)] text-ink",
					children: s.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-lg text-base leading-relaxed text-muted-foreground",
					children: s.body
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-px self-start bg-border",
				children: s.detail.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 bg-[var(--night)] px-5 py-4 text-sm text-foreground/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full",
						style: { background: s.accent },
						"aria-hidden": true
					}), d]
				}, d))
			})]
		})]
	});
}
function SystemPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					eyebrow: "The system",
					title: "One system. From detection to eyes on the fire.",
					lede: "Every stage below is being designed as part of a single pipeline. Some of it exists on the bench, some of it exists on paper, and we say which is which."
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemArchitecture, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				wide: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "01",
					tone: "light",
					children: "Stage by stage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-12 grid gap-px bg-border",
					children: stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						id: s.slug,
						className: "scroll-mt-28 bg-[var(--night)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							className: "grid gap-8 px-6 py-10 lg:grid-cols-[16rem_1fr_1fr] lg:gap-12 lg:px-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "display-cond text-[clamp(2.4rem,5vw,4rem)]",
										style: { color: s.accent },
										children: s.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 text-xl font-semibold text-ink",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground",
										children: s.kicker
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base leading-relaxed text-foreground/85",
									children: s.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2.5",
									children: s.detail.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3 text-sm text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full",
											style: { background: s.accent },
											"aria-hidden": true
										}), d]
									}, d))
								})
							]
						})
					}, s.slug))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display-cond mx-auto max-w-3xl text-[clamp(2rem,5vw,4rem)] text-ink",
				children: "The integration is the product."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-9 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/technology",
					variant: "primary",
					children: "See the technology"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/operations",
					variant: "ghost",
					className: "border border-border text-ink hover:bg-surface",
					children: "The Operations Center"
				})]
			})]
		})
	] });
}
//#endregion
export { SystemPage as component };
