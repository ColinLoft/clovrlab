import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { l as faqs } from "./router-rvM-za4Z.mjs";
import { n as Section, t as PageHeader } from "./Section-Bvhdy1hI.mjs";
import { t as CTAButton } from "./CTAButton-Ge38tcP0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-4ruNIauD.js
var import_jsx_runtime = require_jsx_runtime();
function FaqPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "FAQ",
				title: "Questions we get asked.",
				lede: "Straight answers about what exists, what doesn't yet, and how the system is meant to work."
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "grid gap-px border border-border bg-border",
		children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-[var(--night)] px-6 py-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-lg font-semibold text-ink",
				children: f.q
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground",
				children: f.a
			})]
		}, f.q))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12 flex flex-wrap gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
			to: "/system",
			variant: "primary",
			children: "Explore the system"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTAButton, {
			to: "/contact",
			variant: "ghost",
			className: "border border-border text-ink hover:bg-surface",
			children: "Contact us"
		})]
	})] })] });
}
//#endregion
export { FaqPage as component };
