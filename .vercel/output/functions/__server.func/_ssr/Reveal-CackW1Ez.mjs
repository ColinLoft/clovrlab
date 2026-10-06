import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-CackW1Ez.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reveal({ children, delay = 0, as: Tag = "div", className = "", variant }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const show = () => el.classList.add("is-in");
		if (el.getBoundingClientRect().top < window.innerHeight * .92) {
			show();
			return;
		}
		if (typeof IntersectionObserver === "undefined") {
			show();
			return;
		}
		const io = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					show();
					io.unobserve(el);
				}
			});
		}, {
			rootMargin: "0px 0px -8% 0px",
			threshold: .01
		});
		io.observe(el);
		const t = window.setTimeout(show, 2500);
		return () => {
			window.clearTimeout(t);
			io.disconnect();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className: `reveal ${variant ? `fx-${variant}` : ""} ${className}`,
		style: { "--reveal-delay": `${delay}ms` },
		children
	});
}
//#endregion
export { Reveal as t };
