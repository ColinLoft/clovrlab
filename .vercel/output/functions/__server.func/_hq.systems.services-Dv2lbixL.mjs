import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { G as ServerCog, Kr as Activity, ct as Plug } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, u as RecordDialog } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.systems.services-Dv2lbixL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var infraFields = [
	{
		key: "name",
		label: "Service",
		type: "text",
		required: true
	},
	{
		key: "kind",
		label: "Kind",
		type: "select",
		options: [
			"api",
			"database",
			"worker",
			"storage",
			"network",
			"device"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "environment",
		label: "Environment",
		type: "select",
		options: [
			"production",
			"staging",
			"development"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "provider",
		label: "Provider",
		type: "text"
	},
	{
		key: "region",
		label: "Region",
		type: "text"
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: [
			"operational",
			"degraded",
			"maintenance",
			"down"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "url",
		label: "URL",
		type: "text"
	},
	{
		key: "notes",
		label: "Runbook notes",
		type: "textarea",
		full: true
	}
];
var integrationFields = [
	{
		key: "name",
		label: "Integration",
		type: "text",
		required: true
	},
	{
		key: "vendor",
		label: "Vendor",
		type: "text"
	},
	{
		key: "category",
		label: "Category",
		type: "text"
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: [
			"connected",
			"degraded",
			"disconnected"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "connected_at",
		label: "Connected",
		type: "date"
	},
	{
		key: "notes",
		label: "Notes",
		type: "textarea",
		full: true
	}
];
function Services() {
	const infra = useRows("dev_infrastructure", { order: {
		column: "name",
		ascending: true
	} });
	const integrations = useRows("dev_integrations", { order: {
		column: "name",
		ascending: true
	} });
	const [open, setOpen] = (0, import_react.useState)(null);
	const down = infra.rows.filter((r) => ["down", "degraded"].includes(r.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Enterprise systems",
		title: "Service health",
		lede: "Everything IT keeps running — the platform services behind flight ops and the third-party tools bolted onto them.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add service",
			onClick: () => setOpen("infra")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add integration",
			onClick: () => setOpen("integration")
		})] }),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Services tracked",
					value: infra.rows.length,
					icon: ServerCog
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Operational",
					value: infra.rows.filter((r) => r.status === "operational").length,
					tone: "good",
					icon: Activity
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Degraded or down",
					value: down.length,
					tone: down.length ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Integrations",
					value: integrations.rows.length,
					icon: Plug
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Platform services",
					hint: "Change status inline during an incident",
					pad: false,
					children: infra.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : infra.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing registered yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: infra.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.status),
									children: r.status || "unknown"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											r.kind,
											r.environment,
											r.provider,
											r.region
										].filter(Boolean).join(" · ") || "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: r.status ?? "operational",
									onChange: (e) => infra.patch(r.id, { status: e.target.value }),
									className: "rounded border border-border bg-background px-2 py-1 text-xs",
									children: [
										"operational",
										"degraded",
										"maintenance",
										"down"
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})
							]
						}, r.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Third-party integrations",
					pad: false,
					children: integrations.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : integrations.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No integrations connected." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: integrations.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.status),
									children: r.status || "unknown"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: [r.vendor, r.category].filter(Boolean).join(" · ") || "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: d(r.connected_at)
								})
							]
						}, r.id))
					})
				})]
			}),
			open === "infra" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Register service",
				fields: infraFields,
				initial: {
					status: "operational",
					environment: "production"
				},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await infra.insert(v);
					setOpen(null);
				}
			}),
			open === "integration" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Add integration",
				fields: integrationFields,
				initial: { status: "connected" },
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await integrations.insert(v);
					setOpen(null);
				}
			})
		]
	});
}
//#endregion
export { Services as component };
