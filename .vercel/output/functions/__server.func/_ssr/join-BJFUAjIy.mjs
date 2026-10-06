import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as brand } from "./router-E4663KdI.mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { n as CTAButtonA, t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { i as media, r as involvement } from "./system-C-OlbEAm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-BJFUAjIy.js
var import_jsx_runtime = require_jsx_runtime();
function JoinPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					eyebrow: "Get involved",
					title: "Build with us.",
					lede: "We are early, which is the best time to join. There is hardware to design, autonomy to write, data to analyse, and a system architecture that is still being shaped."
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "01",
					tone: "light",
					children: "Who we're looking for"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
					children: involvement.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "bg-[var(--night)] px-6 py-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-semibold text-ink",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: r.body
						})]
					}, r.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-muted-foreground",
					children: "Roles are a mix of volunteer, project-based, and mentorship depending on the work and your availability."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				wide: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
							n: "02",
							tone: "light",
							children: "How to reach us"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-cond mt-6 text-[clamp(2rem,4.6vw,3.4rem)] text-ink",
							children: "Tell us what you'd want to work on."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-lg leading-relaxed text-muted-foreground",
							children: "Email us with what you build, what you'd like to build here, and roughly how much time you have. Short is fine — a link to your work is better than a cover letter."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-9 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButtonA, {
								href: `mailto:${brand.contact.join}`,
								variant: "primary",
								children: brand.contact.join
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
								to: "/contact",
								variant: "ghost",
								className: "border border-border text-ink hover:bg-surface",
								children: "Other contacts"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-10 grid gap-px border border-border bg-border sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "bg-[var(--night)] px-5 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-ink",
									children: "Research collaboration"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-1 block text-xs text-muted-foreground hover:text-primary",
									href: `mailto:${brand.contact.research}`,
									children: brand.contact.research
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "bg-[var(--night)] px-5 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-ink",
									children: "Sponsorship & manufacturing"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-1 block text-xs text-muted-foreground hover:text-primary",
									href: `mailto:${brand.contact.partners}`,
									children: brand.contact.partners
								})]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 120,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: media.benchImg,
							alt: "UAV prototype and electronics on an engineering workbench",
							className: "w-full border border-border object-cover",
							loading: "lazy",
							width: 1600,
							height: 1104
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			wide: true,
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display-cond mx-auto max-w-3xl text-[clamp(2rem,5vw,4rem)] text-ink",
				children: "Support the mission another way."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-9 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/donate",
					variant: "primary",
					children: "Donate"
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
export { JoinPage as component };
