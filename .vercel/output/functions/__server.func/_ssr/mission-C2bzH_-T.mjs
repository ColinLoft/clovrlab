import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as brand } from "./router-D9VViihH.mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { i as media, t as expansion } from "./system-C-OlbEAm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mission-C2bzH_-T.js
var import_jsx_runtime = require_jsx_runtime();
function MissionPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: media.aerialImg,
					alt: "Aerial view of a forested ridge with a small plume of smoke",
					className: "absolute inset-0 h-full w-full object-cover opacity-40",
					width: 1600,
					height: 1104
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "scrim-full absolute inset-0",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
						eyebrow: brand.mission01,
						title: "Wildfires move fast. Early information matters.",
						lede: brand.mission
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-14 lg:grid-cols-[0.9fr_1.1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "01",
					tone: "light",
					children: "The gap we're aiming at"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 100,
					className: "space-y-6 text-lg leading-relaxed text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Between a fire starting and someone knowing exactly what is happening, there is a stretch of time made of detection, verification, and observation. In remote terrain that stretch grows, and the situation changes while it does." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Our mission is to compress it — with a distributed sensor network that notices, an Operations Center that evaluates, aircraft that go and look, and software that turns all of it into something a responder can use." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-ink",
							children: "We are early-stage. We are building the system; we have not deployed it."
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				wide: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "02",
					tone: "light",
					children: "How we work"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
					children: brand.values.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "bg-[var(--night)] px-6 py-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[0.62rem] tabular-nums text-[var(--signal)]",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-lg font-semibold text-ink",
								children: v.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: v.body
							})
						]
					}, v.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-14 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "03",
					tone: "light",
					children: "Technology should serve people"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-lg leading-relaxed text-muted-foreground",
					children: "When conditions are dangerous and time matters, decisions get made with whatever information is at hand. Our job is to make that information arrive earlier and read more clearly. Fire professionals still decide; we are building the instrument, not the judgement."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 120,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
							n: "04",
							tone: "light",
							children: "Wildfire is only the beginning"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-base leading-relaxed text-muted-foreground",
							children: "Wildfire has our full attention. In time, the same foundation could support other emergencies."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 grid gap-px border border-border bg-border sm:grid-cols-2",
							children: expansion.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "bg-[var(--night)] px-5 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-ink",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: e.body
								})]
							}, e.title))
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/system",
					variant: "primary",
					children: "Explore the system"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/development",
					variant: "ghost",
					className: "border border-border text-ink hover:bg-surface",
					children: "Where we are"
				})]
			})]
		})
	] });
}
//#endregion
export { MissionPage as component };
