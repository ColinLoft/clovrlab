import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Ct as PackageOpen, g as Undo2, r as Wrench } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, y as money } from "./_ssr/kit-CJyOYuhv.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.mfg.returns-DOVsnJlT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var repairFields = (people) => [
	{
		key: "repair_number",
		label: "Repair no.",
		type: "text",
		required: true
	},
	{
		key: "product_name",
		label: "Assembly",
		type: "text",
		required: true
	},
	{
		key: "serial_number",
		label: "Serial",
		type: "text"
	},
	{
		key: "issue",
		label: "Reported fault",
		type: "textarea",
		full: true
	},
	{
		key: "status",
		label: "Status",
		type: "select",
		options: [
			"received",
			"diagnosing",
			"repairing",
			"testing",
			"shipped"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "technician_id",
		label: "Technician",
		type: "user"
	},
	{
		key: "received_at",
		label: "Received",
		type: "date"
	},
	{
		key: "cost",
		label: "Repair cost",
		type: "number"
	}
];
function Returns() {
	const rmas = useRows("cs_rmas", { order: { column: "received_at" } });
	const repairs = useRows("cs_repairs", { order: { column: "received_at" } });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("repairs");
	const [open, setOpen] = (0, import_react.useState)(false);
	const match = (s) => s.toLowerCase().includes(q.toLowerCase());
	const openRepairs = repairs.rows.filter((r) => r.status !== "shipped");
	const openRmas = rmas.rows.filter((r) => !["resolved", "closed"].includes((r.status ?? "").toLowerCase()));
	const refunded = rmas.rows.reduce((s, r) => s + Number(r.refund_amount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Production",
		title: "Returns & repair bench",
		lede: "Hardware coming back off the line: what is on the bench, what is being replaced outright, and what it costs the build.",
		actions: tab === "repairs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Open repair",
			onClick: () => setOpen(true)
		}) : void 0,
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "On the bench",
						value: openRepairs.length,
						icon: Wrench,
						tone: openRepairs.length ? "warn" : "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Open RMAs",
						value: openRmas.length,
						icon: Undo2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Units returned",
						value: rmas.rows.length,
						icon: PackageOpen
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Refunded",
						value: money(refunded),
						hint: "Lifetime RMA credits"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toolbar, {
				q,
				setQ,
				placeholder: "Search serial, assembly, number…",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: tab === "repairs" ? "primary" : "default",
					onClick: () => setTab("repairs"),
					children: "Repair bench"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: tab === "rmas" ? "primary" : "default",
					onClick: () => setTab("rmas"),
					children: "Returns"
				})]
			}),
			tab === "repairs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				children: repairs.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "divide-y divide-border",
					children: [repairs.rows.filter((r) => match(`${r.repair_number} ${r.product_name ?? ""} ${r.serial_number ?? ""}`)).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Bench is clear." }), repairs.rows.filter((r) => match(`${r.repair_number} ${r.product_name ?? ""} ${r.serial_number ?? ""}`)).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-24 shrink-0 font-mono text-[11px] text-muted-foreground",
								children: r.repair_number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-sm font-medium",
									children: [
										r.product_name,
										" ",
										r.serial_number ? `· ${r.serial_number}` : ""
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
									children: [
										r.issue ? String(r.issue).slice(0, 80) : "No fault recorded",
										" · in ",
										d(r.received_at),
										r.technician_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
											userId: r.technician_id,
											name: nameOf(byId, r.technician_id),
											size: "xs"
										})
									]
								})]
							}),
							r.cost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tabular-nums text-muted-foreground",
								children: money(Number(r.cost))
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: r.status ?? "received",
								onChange: (e) => repairs.patch(r.id, { status: e.target.value }),
								className: "rounded border border-border bg-background px-2 py-1 text-xs",
								children: [
									"received",
									"diagnosing",
									"repairing",
									"testing",
									"shipped"
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))
							})
						]
					}, r.id))]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-4",
				pad: false,
				children: [rmas.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "RMA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "Assembly"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "Reason"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "Received"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-right",
								children: "Credit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rmas.rows.filter((r) => match(`${r.rma_number} ${r.product_name ?? ""} ${r.reason ?? ""}`)).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60 last:border-0 hover:bg-muted/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 font-mono text-[11px]",
								children: r.rma_number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5",
								children: r.product_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-muted-foreground",
								children: r.reason ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-muted-foreground",
								children: d(r.received_at)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5 text-right tabular-nums",
								children: r.refund_amount ? money(Number(r.refund_amount)) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(r.status),
									children: r.status ?? "open"
								})
							})
						]
					}, r.id)) })]
				}), !rmas.loading && rmas.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No returns recorded." })]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Open a repair",
				fields: repairFields(people),
				people,
				initial: {
					status: "received",
					received_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				},
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await repairs.insert(v);
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Returns as component };
