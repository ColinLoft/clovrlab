import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Section-Bvhdy1hI.js
var import_jsx_runtime = require_jsx_runtime();
function Section({ children, className = "", id, wide = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: `mx-auto w-full ${wide ? "max-w-7xl" : "max-w-6xl"} px-5 py-20 sm:px-8 sm:py-28 ${className}`,
		children
	});
}
/** Numbered architectural section marker: "— 02 / THE McGUIRE GROUP" */
function SectionLabel({ n, children, tone = "dark", className = "", as: Tag = "p" }) {
	const color = tone === "light" ? "text-white/55" : "text-muted-foreground";
	const rule = tone === "light" ? "bg-white/30" : "bg-ink/30";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
		className: `rule-label flex items-center gap-3 ${color} ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `h-px w-10 ${rule}`,
				"aria-hidden": true
			}),
			n ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums",
				children: n
			}) : null,
			n ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: color,
				children: "/"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children })
		]
	});
}
function Eyebrow({ children, as: Tag = "p" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
		className: "rule-label mb-4 flex items-center gap-3 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "h-px w-8 bg-ink/30",
			"aria-hidden": true
		}), children]
	});
}
function PageHeader({ eyebrow, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: eyebrow }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl",
				children: title
			}),
			lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground",
				children: lede
			}) : null
		]
	});
}
//#endregion
export { Section as n, SectionLabel as r, PageHeader as t };
