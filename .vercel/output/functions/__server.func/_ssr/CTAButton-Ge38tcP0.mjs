import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CTAButton-Ge38tcP0.js
var import_jsx_runtime = require_jsx_runtime();
var base = "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
var variants = {
	primary: "bg-primary text-primary-foreground hover:bg-ink",
	secondary: "border border-ink/25 text-ink hover:bg-ink hover:text-primary-foreground",
	ghost: "text-ink hover:bg-muted",
	light: "bg-white text-ink hover:bg-white/85"
};
function CTAButton({ children, variant = "primary", className = "", ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		...rest,
		className: `${base} ${variants[variant]} ${className}`,
		children
	});
}
function CTAButtonA({ children, variant = "primary", className = "", ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		...rest,
		className: `${base} ${variants[variant]} ${className}`,
		children
	});
}
//#endregion
export { CTAButtonA as n, CTAButton as t };
