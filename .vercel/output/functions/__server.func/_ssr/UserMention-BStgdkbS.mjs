import { i as __toESM } from "../_runtime.mjs";
import { r as supabase } from "./client-PsXr_elE.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { Bt as Mail, O as StickyNote, Tr as Building2, c as Video, d as User, ft as Phone, jt as MessageSquare, n as X } from "../_libs/lucide-react.mjs";
import { o as usePhone } from "./phone-DibgJetL.mjs";
import { i as useSlackSettings, r as slackLink } from "./slack-Bekkiy0X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/UserMention-BStgdkbS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function initials(name) {
	return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function ProfilePopover({ userId, onClose, anchor }) {
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const boxRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [{ data: p }, { data: r }] = await Promise.all([supabase.from("profiles").select("id, full_name, email, department").eq("id", userId).maybeSingle(), supabase.from("user_custom_roles").select("custom_roles(id, name, color, position)").eq("user_id", userId)]);
			setProfile(p);
			setRoles((r ?? []).map((x) => x.custom_roles).filter(Boolean).sort((a, b) => b.position - a.position));
		})();
	}, [userId]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (boxRef.current && !boxRef.current.contains(e.target)) onClose();
		};
		setTimeout(() => document.addEventListener("mousedown", handler), 0);
		return () => document.removeEventListener("mousedown", handler);
	}, [onClose]);
	const name = profile?.full_name || profile?.email || "Loading…";
	const navigate = useNavigate();
	const style = anchor ? {
		position: "fixed",
		top: anchor.y,
		left: anchor.x,
		zIndex: 60
	} : {
		position: "fixed",
		top: "20%",
		left: "50%",
		transform: "translateX(-50%)",
		zIndex: 60
	};
	const { startCall, active } = usePhone();
	const slack = useSlackSettings();
	const openSlack = () => {
		const url = slackLink(slack);
		onClose();
		if (url) window.open(url, "_blank", "noopener");
	};
	const call = () => {
		if (!profile || active) return;
		onClose();
		startCall(userId, name, "user");
	};
	const meet = async () => {
		if (!profile) return;
		onClose();
		const { createInstantMeeting } = await import("./instant-meeting-0Fe-Q1lB.mjs");
		const id = await createInstantMeeting(`Meeting with ${name}`, [userId]);
		if (id) navigate({
			to: "/meeting/$id",
			params: { id }
		});
	};
	const notes = () => {
		onClose();
		navigate({ to: "/meeting-notes" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: boxRef,
		style,
		className: "w-72 rounded-xl border border-border bg-card p-4 shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary",
						children: initials(name)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: name
						}), profile?.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1 truncate text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), profile.department]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded p-1 hover:bg-muted",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: openSlack,
						disabled: !slack.workspaceUrl,
						title: slack.workspaceUrl ? "Message on Slack" : "Slack workspace not configured",
						className: "flex items-center justify-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3 w-3" }), " Slack"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: call,
						disabled: !profile || !!active,
						className: "flex items-center justify-center gap-1 rounded-lg bg-emerald-500 px-2 py-1.5 text-xs font-medium text-white disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), " Call"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: meet,
						className: "flex items-center justify-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3 w-3" }), " Meeting"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: notes,
						className: "flex items-center justify-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-3 w-3" }), " Notes"]
					}),
					profile?.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `mailto:${profile.email}`,
						className: "col-span-2 flex items-center justify-center gap-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), " Email"]
					}) : null
				]
			}),
			profile?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 flex items-center gap-1 truncate text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }), profile.email]
			}),
			roles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Roles"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full px-2 py-0.5 text-[10px] font-medium",
						style: {
							backgroundColor: `${r.color}22`,
							color: r.color,
							borderColor: r.color
						},
						children: r.name
					}, r.id))
				})]
			})
		]
	});
}
/**
* Clickable user mention chip. Renders as an inline pill with the user's
* name (and optional avatar dot); clicking opens the ProfilePopover with
* quick actions (message, email, view details).
*
* Use this anywhere a user's name would appear in text/UI — attendee lists,
* hosts, authors, assignees, mentions, etc.
*/
function UserMention({ userId, name, tone, showAt = false, size = "sm", className = "" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [anchor, setAnchor] = (0, import_react.useState)(null);
	const btnRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!open || !btnRef.current) return;
		const r = btnRef.current.getBoundingClientRect();
		const x = Math.min(r.left, window.innerWidth - 288 - 8);
		const y = Math.min(r.bottom + 4, window.innerHeight - 260);
		setAnchor({
			x: Math.max(8, x),
			y: Math.max(8, y)
		});
	}, [open]);
	const initial = name.charAt(0).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref: btnRef,
		type: "button",
		onClick: (e) => {
			e.stopPropagation();
			setOpen(true);
		},
		className: `inline-flex items-center gap-1 rounded-full border transition ${size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5"} ${tone ?? "border-border bg-muted/50 text-foreground hover:bg-muted"} ${className}`,
		title: `View ${name}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex h-4 w-4 items-center justify-center rounded-full bg-background text-[9px] font-semibold",
			children: initial
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "max-w-[10rem] truncate",
			children: showAt ? `@${name}` : name
		})]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePopover, {
		userId,
		onClose: () => setOpen(false),
		anchor: anchor ?? void 0
	})] });
}
//#endregion
export { UserMention as t };
