import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { d as brand } from "./router-D9VViihH.mjs";
import { n as Section, r as SectionLabel, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as Reveal } from "./Reveal-CackW1Ez.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
import { a as opsResponsibilities, i as media } from "./system-C-OlbEAm.mjs";
import { t as MissionControl } from "./MissionControl-Hm_BrXOP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/operations-CnYvgh3s.js
var import_jsx_runtime = require_jsx_runtime();
function OperationsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: media.opsImg,
					alt: "Operations center interior at night with map and telemetry displays",
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
						eyebrow: brand.opsCenter,
						title: "When an alert comes in, someone is watching.",
						lede: "The Operations Center is a real organizational capability, staffed continuously. It is where automated detection meets human judgement, and where a mission is coordinated from alert to hand-off."
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-14 lg:grid-cols-[0.85fr_1.15fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					n: "01",
					tone: "light",
					children: "Responsibilities"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-base leading-relaxed text-muted-foreground",
					children: "These are the functions the Operations Center owns across the system. As the detection network and aircraft mature, the same desk carries the new capability."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 120,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-px border border-border bg-border",
						children: opsResponsibilities.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline gap-4 bg-[var(--night)] px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[0.62rem] tabular-nums text-[var(--signal)]",
								children: String(i + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-foreground/85",
								children: r
							})]
						}, r))
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-y border-border bg-[var(--night)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				wide: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "02",
						tone: "light",
						children: "Concept interface"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-cond mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] text-ink",
						children: "One screen, one incident record."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-lg text-muted-foreground",
						children: "Live map, sensor nodes, active alerts, UAV location and flight path, thermal and RGB imagery, weather, incident status, communications, and mission timeline. The view below is a concept representation — the operational version lives inside our internal HQ."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 120,
					className: "mt-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionControl, {})
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
					children: "Human in the loop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-lg leading-relaxed text-muted-foreground",
					children: "Automated detection raises candidates. People decide what becomes an incident, whether an aircraft is worth launching, and what gets passed to responders. That review step is deliberate — a system that cries wolf is worse than no system."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 120,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						n: "04",
						tone: "light",
						children: "What we will not publish"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-lg leading-relaxed text-muted-foreground",
						children: "We do not publish staffing numbers, response times, deployment counts, or performance statistics, because the system has not been evaluated in the field yet. When there is measured data, it will be published with its methodology."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
					to: "/system",
					variant: "primary",
					children: "See the architecture"
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
export { OperationsPage as component };
