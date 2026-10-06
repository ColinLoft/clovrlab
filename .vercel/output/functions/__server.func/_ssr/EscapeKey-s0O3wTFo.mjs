import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EscapeKey-s0O3wTFo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Headless helper: render inside a modal overlay so pressing Escape closes it.
* Keeps keyboard users from being stranded in hand-rolled dialogs.
*/
function EscapeKey({ onEscape }) {
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				onEscape();
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [onEscape]);
	return null;
}
//#endregion
export { EscapeKey as t };
