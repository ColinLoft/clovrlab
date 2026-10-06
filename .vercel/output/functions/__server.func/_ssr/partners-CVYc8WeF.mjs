import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as brand } from "./router-E4663KdI.mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { n as CTAButtonA, t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/partners-CVYc8WeF.js
var import_jsx_runtime = require_jsx_runtime();
var tracks = [
	{
		n: "01",
		title: "Research partnership",
		body: "Universities, labs, and independent researchers working on detection methods, remote sensing, autonomy, or evaluation methodology. We are interested in collaborators who will hold our claims to a standard.",
		ask: "Joint studies, shared datasets, review of detection approaches, student projects.",
		email: brand.contact.research
	},
	{
		n: "02",
		title: "Fire service & response advisors",
		body: "Fire professionals and agencies willing to tell us what information is actually useful, in what form, and at what moment. Design input now is worth more than a pilot later.",
		ask: "Advisory conversations, requirements review, eventual supervised evaluation.",
		email: brand.contact.partners
	},
	{
		n: "03",
		title: "Manufacturing & components",
		body: "Fabrication, enclosures, PCB assembly, airframe components, batteries, and small-batch production support for prototype and field-test hardware.",
		ask: "In-kind supply, discounted production runs, engineering support.",
		email: brand.contact.partners
	},
	{
		n: "04",
		title: "Sponsors & funders",
		body: "Foundations, companies, and individuals funding a system that is being built in the open, with an honest development timeline attached to it.",
		ask: "Programme funding, equipment sponsorship, grants.",
		email: brand.contact.partners
	}
];
function PartnersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					eyebrow: "Partners",
					title: "Partner with us.",
					lede: "We do not list partners we do not have. These are the four tracks where collaboration would move the wildfire system forward right now."
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-px border border-border bg-border lg:grid-cols-2",
				children: tracks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "bg-[var(--night)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "flex h-full flex-col px-7 py-9",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "display-cond text-[clamp(2rem,3.6vw,3rem)] text-[var(--signal)]",
								children: t.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-xl font-semibold text-ink",
								children: t.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-base leading-relaxed text-muted-foreground",
								children: t.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-5 border-t border-border pt-4 text-sm text-foreground/80",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground",
										children: "What helps"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									t.ask
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${t.email}`,
								className: "mt-5 text-sm text-foreground/80 underline underline-offset-4 hover:text-primary",
								children: t.email
							})
						]
					})
				}, t.n))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				wide: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 lg:grid-cols-[1fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "05",
						tone: "light",
						children: "What you should know first"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-3 text-base text-muted-foreground",
						children: [
							"Nothing is deployed operationally yet.",
							"We publish an honest development timeline and update it as stages move.",
							"We do not publish performance figures we have not measured.",
							"Our Operations Center runs 24/7/365 and is the coordination point for everything."
						].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--signal)]",
								"aria-hidden": true
							}), x]
						}, x))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 120,
						className: "flex flex-col justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-cond text-[clamp(1.9rem,4vw,3.2rem)] text-ink",
							children: "Start a conversation."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButtonA, {
								href: `mailto:${brand.contact.partners}`,
								variant: "primary",
								children: brand.contact.partners
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
								to: "/system",
								variant: "ghost",
								className: "border border-border text-ink hover:bg-surface",
								children: "Review the architecture"
							})]
						})]
					})]
				})
			})
		})
	] });
}
//#endregion
export { PartnersPage as component };
