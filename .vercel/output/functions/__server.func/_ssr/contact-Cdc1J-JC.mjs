import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as brand } from "./router-rvM-za4Z.mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-Cdc1J-JC.js
var import_jsx_runtime = require_jsx_runtime();
var desks = [
	{
		k: "General",
		email: brand.contact.general,
		note: "Anything that doesn't fit elsewhere."
	},
	{
		k: "Join the team",
		email: brand.contact.join,
		note: "Engineers, developers, researchers, volunteers, mentors."
	},
	{
		k: "Research",
		email: brand.contact.research,
		note: "Collaborations, studies, datasets, and methodology."
	},
	{
		k: "Partnerships",
		email: brand.contact.partners,
		note: "Fire service advisors, manufacturing, sponsors, funders."
	},
	{
		k: "Press",
		email: brand.contact.press,
		note: "Media enquiries about the programme and its status."
	}
];
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "Contact",
				title: "Reach the right desk.",
				lede: "We're a small team. Email is the fastest way to reach us."
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		wide: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-14 lg:grid-cols-[1.15fr_0.85fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
				n: "01",
				tone: "light",
				children: "Desks"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-px border border-border bg-border",
				children: desks.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-2 bg-[var(--night)] px-6 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground",
						children: d.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${d.email}`,
						className: "text-base text-ink hover:text-primary",
						children: d.email
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: d.note
					})] })]
				}, d.k))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				delay: 120,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "02",
						tone: "light",
						children: "Emergencies"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 border border-border bg-[var(--night)] px-6 py-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base leading-relaxed text-foreground/85",
							children: "We are not an emergency service. If you are reporting a fire or any emergency, contact your local emergency number and fire authority immediately."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border border-border bg-[var(--night)] px-6 py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground",
								children: "Operations Center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-base text-ink",
								children: brand.hours
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									brand.status,
									" · ",
									brand.mission01
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
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
					})
				]
			})]
		})
	})] });
}
//#endregion
export { ContactPage as component };
