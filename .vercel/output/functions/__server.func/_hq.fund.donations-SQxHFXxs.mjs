import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Zn as Coins } from "./_libs/lucide-react.mjs";
import { D as useRows, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, u as RecordDialog, y as money } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.fund.donations-SQxHFXxs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Donations() {
	const { rows, loading, insert } = useRows("fund_donations", { order: { column: "received_on" } });
	const donors = useRows("fund_donors", { order: {
		column: "name",
		ascending: true
	} });
	const [open, setOpen] = (0, import_react.useState)(false);
	const fields = (0, import_react.useMemo)(() => [
		{
			key: "donor_id",
			label: "Donor",
			type: "select",
			required: true,
			options: donors.rows.map((dn) => ({
				value: dn.id,
				label: dn.name
			}))
		},
		{
			key: "amount",
			label: "Amount",
			type: "number",
			required: true
		},
		{
			key: "received_on",
			label: "Received",
			type: "date",
			required: true
		},
		{
			key: "campaign",
			label: "Campaign",
			type: "text"
		},
		{
			key: "restriction",
			label: "Restriction",
			type: "select",
			options: [
				"unrestricted",
				"restricted",
				"endowment"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "method",
			label: "Method",
			type: "select",
			options: [
				"card",
				"ach",
				"check",
				"wire",
				"stock",
				"in_kind"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	], [donors.rows]);
	const donorName = (id) => donors.rows.find((dn) => dn.id === id)?.name ?? "Anonymous";
	const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
	const ytd = rows.filter((r) => r.received_on && new Date(r.received_on).getFullYear() === (/* @__PURE__ */ new Date()).getFullYear()).reduce((s, r) => s + Number(r.amount || 0), 0);
	const unrestricted = rows.filter((r) => r.restriction === "unrestricted").reduce((s, r) => s + Number(r.amount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Funding & partners",
		title: "Gift ledger",
		lede: "Every gift received, what it is restricted to, and how the year is tracking.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Record gift",
			onClick: () => setOpen(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Gifts recorded",
					value: rows.length,
					icon: Coins
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Received this year",
					value: money(ytd),
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "All time",
					value: money(total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Unrestricted",
					value: money(unrestricted),
					hint: "Free to deploy where needed"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-5",
				pad: false,
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No gifts recorded yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: donorName(r.donor_id)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										[r.campaign, r.method].filter(Boolean).join(" · ") || "—",
										" · ",
										d(r.received_on)
									]
								})]
							}),
							r.restriction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: r.restriction === "unrestricted" ? "good" : "muted",
								children: r.restriction
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-sm font-medium",
								children: money(Number(r.amount || 0))
							})
						]
					}, r.id))
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Record gift",
				fields,
				initial: {
					restriction: "unrestricted",
					received_on: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				},
				onCancel: () => setOpen(false),
				onSave: async (v) => {
					await insert(v);
					setOpen(false);
				}
			})
		]
	});
}
//#endregion
export { Donations as component };
