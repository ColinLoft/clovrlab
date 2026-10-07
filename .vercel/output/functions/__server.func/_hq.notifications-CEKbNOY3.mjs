import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { n as supabase } from "./_ssr/client-B5YVWdzA.mjs";
import { jr as Bell } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.notifications-CEKbNOY3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const load = async () => {
		const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
		setItems(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const markRead = async (id) => {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
		load();
	};
	const markAllRead = async () => {
		await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).is("read_at", null);
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-4xl px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold",
					children: "Notifications"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: markAllRead,
				className: "rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted",
				children: "Mark all read"
			})]
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground",
			children: "No notifications. When workflows and mentions land in HQ, they'll show up here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: `rounded-lg border border-border p-4 ${n.read_at ? "bg-card/40" : "bg-card"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-sm ${n.read_at ? "text-muted-foreground" : "font-semibold"}`,
								children: n.title
							}),
							n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: n.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: new Date(n.created_at).toLocaleString()
							})
						]
					}), !n.read_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => markRead(n.id),
						className: "text-xs text-primary hover:underline",
						children: "Mark read"
					})]
				})
			}, n.id))
		})]
	});
}
//#endregion
export { NotificationsPage as component };
