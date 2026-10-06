import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { B as ShieldCheck, nn as KeyRound } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.systems.access-GRyCB_BF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		key: "event",
		label: "Event",
		type: "text",
		required: true
	},
	{
		key: "severity",
		label: "Severity",
		type: "select",
		options: [
			"info",
			"warning",
			"critical"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "source",
		label: "Source",
		type: "text",
		placeholder: "Auth, VPN, Drive…"
	},
	{
		key: "actor_id",
		label: "Person involved",
		type: "user"
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: [
			"open",
			"in_review",
			"resolved"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "occurred_at",
		label: "Occurred",
		type: "datetime"
	},
	{
		key: "details",
		label: "Details",
		type: "textarea",
		full: true
	}
];
function Access() {
	const logs = useRows("dev_security_logs", { order: { column: "occurred_at" } });
	const roles = useRows("user_roles", { select: "id, user_id, role" });
	const { people, byId } = usePeople();
	const [open, setOpen] = (0, import_react.useState)(false);
	const critical = logs.rows.filter((r) => r.severity === "critical" && r.status !== "resolved");
	const admins = roles.rows.filter((r) => ["admin", "super_admin"].includes(r.role));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Enterprise systems",
		title: "Access & identity",
		lede: "Who holds elevated access, and every security event worth a second look.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Log event",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "People with accounts",
					value: people.length,
					icon: KeyRound
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Elevated access",
					value: admins.length,
					tone: "warn",
					icon: ShieldCheck
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open security events",
					value: logs.rows.filter((r) => r.status !== "resolved").length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Critical unresolved",
					value: critical.length,
					tone: critical.length ? "risk" : "good"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Security events",
					pad: false,
					children: logs.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : logs.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing logged. Quiet is good." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: logs.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.severity),
									children: r.severity || "info"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: r.event
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: r.details || r.source || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-[11px] text-muted-foreground",
											children: [
												nameOf(byId, r.actor_id),
												" · ",
												dt(r.occurred_at ?? r.created_at)
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: r.status ?? "open",
									onChange: (e) => logs.patch(r.id, { status: e.target.value }),
									className: "rounded border border-border bg-background px-2 py-1 text-xs",
									children: [
										"open",
										"in_review",
										"resolved"
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})
							]
						}, r.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Elevated access",
					hint: "Managed from Organization settings",
					pad: false,
					children: admins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No elevated accounts." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: admins.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: nameOf(byId, r.user_id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: "warn",
								children: r.role
							})]
						}, r.id))
					})
				})]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Log security event",
				fields,
				people,
				initial: {
					severity: "info",
					status: "open"
				},
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await logs.insert(v);
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Access as component };
