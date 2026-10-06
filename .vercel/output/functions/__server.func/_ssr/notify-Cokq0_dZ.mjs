//#region node_modules/.nitro/vite/services/ssr/assets/notify-Cokq0_dZ.js
/** Minimal dependency-free toast. Renders a floating pill in the corner. */
function show(text, kind) {
	if (typeof document === "undefined") return;
	let host = document.getElementById("hq-toast-host");
	if (!host) {
		host = document.createElement("div");
		host.id = "hq-toast-host";
		host.setAttribute("aria-live", "polite");
		host.className = "fixed bottom-4 right-4 z-[100] flex flex-col gap-2";
		document.body.appendChild(host);
	}
	const el = document.createElement("div");
	el.className = `rounded-xl border px-4 py-2 text-sm shadow-lg transition-opacity ${kind === "error" ? "border-destructive/30 bg-destructive text-destructive-foreground" : kind === "success" ? "border-emerald-500/30 bg-emerald-600 text-white" : "border-border bg-card text-foreground"}`;
	el.textContent = text;
	host.appendChild(el);
	setTimeout(() => {
		el.style.opacity = "0";
		setTimeout(() => el.remove(), 300);
	}, 3200);
}
var toast = {
	success: (t) => show(t, "success"),
	error: (t) => show(t, "error"),
	info: (t) => show(t, "info")
};
//#endregion
export { toast as t };
