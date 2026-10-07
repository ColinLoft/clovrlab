import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as brand } from "./router-D9VViihH.mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { i as media, o as phases } from "./system-C-OlbEAm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-DBlEQkry.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					eyebrow: "About",
					title: "An engineering organization with one mission in front of it.",
					lede: `${brand.name} is a mission-driven nonprofit developing technology to improve wildfire detection and early response. We are early-stage, and we say so.`
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "space-y-6 text-lg leading-relaxed text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
							n: "01",
							tone: "light",
							children: "Who we are"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We are engineers, developers, and researchers building one integrated system: distributed wildfire sensing, autonomous UAV investigation, and the mission software that connects them. The organization is structured as a nonprofit because the output should be a capability for responders, not a product line." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Alongside the engineering, we run a ",
							brand.opsCenter,
							" — the part of the organization that already operates continuously, and the seat from which every future mission will be coordinated."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-ink",
							children: "Prototype in progress. Building the wildfire response system."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 120,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: media.opsImg,
						alt: "Operations center workstations at night",
						className: "w-full border border-border object-cover",
						loading: "lazy",
						width: 1600,
						height: 1104
					})
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
					children: "What we hold ourselves to"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
					children: brand.values.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "bg-[var(--night)] px-6 py-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold text-ink",
							children: v.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: v.body
						})]
					}, v.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "03",
					tone: "light",
					children: "Programme status"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3",
					children: phases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "bg-[var(--night)] px-6 py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular-nums text-[var(--signal)]",
								children: p.n
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "border border-border px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground",
								children: p.state
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-base font-semibold text-ink",
							children: p.title
						})]
					}, p.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
						to: "/development",
						variant: "primary",
						children: "Full development status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
						to: "/join",
						variant: "ghost",
						className: "border border-border text-ink hover:bg-surface",
						children: "Join the team"
					})]
				})
			]
		})
	] });
}
//#endregion
export { AboutPage as component };
