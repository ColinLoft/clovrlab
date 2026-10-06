import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as brand } from "./router-E4663KdI.mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { n as CTAButtonA, t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { i as media } from "./system-C-OlbEAm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/donate-o_cK8Lei.js
var import_jsx_runtime = require_jsx_runtime();
var uses = [
	{
		title: "Prototype hardware",
		body: "Sensor node enclosures, radios, boards, airframe components, and payload sensors on the bench."
	},
	{
		title: "Field testing",
		body: "Getting hardware outside the lab: transport, test sites, instrumentation, and repeat runs."
	},
	{
		title: "Software development",
		body: "Mission control, geospatial tooling, alerting, and the Operations Center stack."
	},
	{
		title: "Operations Center",
		body: "Keeping continuous monitoring and coordination running as the system grows."
	}
];
function DonatePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: media.heroImg,
					alt: "Prototype UAV over smoke-covered ridgelines",
					className: "absolute inset-0 h-full w-full object-cover opacity-35",
					width: 1920,
					height: 1088
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "scrim-full absolute inset-0",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
						eyebrow: "Support the mission",
						title: "Fund the prototype, not the press release.",
						lede: "We are building autonomous wildfire detection and UAV response. Support at this stage buys parts, test days, and engineering time."
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "01",
					tone: "light",
					children: "Where support goes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
					children: uses.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "bg-[var(--night)] px-6 py-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-semibold text-ink",
							children: u.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: u.body
						})]
					}, u.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-muted-foreground",
					children: "We do not publish impact statistics we have not measured. Reporting will describe what was built and tested."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				wide: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 lg:grid-cols-[1fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "02",
						tone: "light",
						children: "Ways to give"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 grid gap-px border border-border bg-border",
						children: [
							{
								k: "One-time gift",
								v: "Direct support for current prototype and test work."
							},
							{
								k: "Recurring support",
								v: "Predictable funding that lets us plan test campaigns."
							},
							{
								k: "Equipment & in-kind",
								v: "Components, tooling, fabrication, or lab access."
							},
							{
								k: "Grants & institutional",
								v: "Foundation and programme funding for the wildfire system."
							}
						].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-[var(--night)] px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink",
								children: r.k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: r.v
							})]
						}, r.k))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 120,
						className: "flex flex-col justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "display-cond text-[clamp(1.9rem,4.2vw,3.4rem)] text-ink",
								children: "Talk to us about giving."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-base text-muted-foreground",
								children: "Online giving is being set up. In the meantime, email us and we will arrange it directly and tell you exactly what your support is buying."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButtonA, {
									href: `mailto:${brand.contact.general}`,
									variant: "primary",
									children: brand.contact.general
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
									to: "/development",
									variant: "ghost",
									className: "border border-border text-ink hover:bg-surface",
									children: "See where we are"
								})]
							})
						]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display-cond mx-auto max-w-3xl text-[clamp(2rem,5vw,4rem)] text-ink",
				children: "Other ways to help."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-9 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/join",
					variant: "primary",
					children: "Join the team"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/partners",
					variant: "ghost",
					className: "border border-border text-ink hover:bg-surface",
					children: "Partner with us"
				})]
			})]
		})
	] });
}
//#endregion
export { DonatePage as component };
