import { i as __toESM } from "../_runtime.mjs";
import { r as supabase } from "./client-PsXr_elE.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/slack-Bekkiy0X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var EMPTY = {
	workspaceUrl: "",
	channels: {}
};
async function loadSlackSettings() {
	const { data } = await supabase.from("admin_settings").select("key, value").eq("category", "slack");
	const out = {
		workspaceUrl: "",
		channels: {}
	};
	for (const row of data ?? []) if (row.key === "workspace_url") out.workspaceUrl = row.value ?? "";
	else if (row.key.startsWith("channel.")) out.channels[row.key.slice(8)] = row.value ?? "";
	return out;
}
async function saveSlackSettings(s) {
	const rows = [{
		category: "slack",
		key: "workspace_url",
		value: s.workspaceUrl
	}, ...Object.entries(s.channels).filter(([, v]) => (v ?? "").trim().length > 0).map(([k, v]) => ({
		category: "slack",
		key: `channel.${k}`,
		value: v.trim().replace(/^#/, "")
	}))].filter((r) => (r.value ?? "").length > 0);
	await supabase.from("admin_settings").delete().eq("category", "slack");
	if (rows.length) await supabase.from("admin_settings").insert(rows);
}
function useSlackSettings() {
	const [settings, setSettings] = (0, import_react.useState)(EMPTY);
	(0, import_react.useEffect)(() => {
		let alive = true;
		loadSlackSettings().then((s) => {
			if (alive) setSettings(s);
		});
		return () => {
			alive = false;
		};
	}, []);
	return settings;
}
/** Deep link into the Slack workspace (channel optional). */
function slackLink(s, channel) {
	if (!s.workspaceUrl) return null;
	const base = s.workspaceUrl.replace(/\/+$/, "");
	return channel ? `${base}/app_redirect?channel=${encodeURIComponent(channel)}` : base;
}
//#endregion
export { useSlackSettings as i, saveSlackSettings as n, slackLink as r, loadSlackSettings as t };
