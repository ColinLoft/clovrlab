import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { un as HeartHandshake } from "./_libs/lucide-react.mjs";
import { D as useRows, E as usePeople, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, i as Empty, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, u as RecordDialog, y as money } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.fund.donors-eFm7P82t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		key: "name",
		label: "Donor",
		type: "text",
		required: true
	},
	{
		key: "kind",
		label: "Type",
		type: "select",
		options: [
			"individual",
			"foundation",
			"corporate",
			"government"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "tier",
		label: "Tier",
		type: "select",
		options: [
			"principal",
			"major",
			"sustaining",
			"community"
		].map((v) => ({
			value: v,
			label: v
		}))
	},
	{
		key: "steward_id",
		label: "Relationship owner",
		type: "user"
	},
	{
		key: "email",
		label: "Email",
		type: "text"
	},
	{
		key: "phone",
		label: "Phone",
		type: "text"
	},
	{
		key: "notes",
		label: "Notes",
		type: "textarea",
		full: true
	}
];
function Donors() {
	const { rows, loading, insert } = useRows("fund_donors", { order: { column: "lifetime_amount" } });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => `${r.name} ${r.tier ?? ""} ${r.kind ?? ""}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
	const lifetime = rows.reduce((s, r) => s + Number(r.lifetime_amount || 0), 0);
	const stale = rows.filter((r) => !r.last_gift_on || new Date(r.last_gift_on).getTime() < Date.now() - 31536e6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Funding & partners",
		title: "Donors",
		lede: "The people and institutions funding the fleet, and who owns each relationship.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add donor",
			onClick: () => setOpen(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Donors",
					value: rows.length,
					icon: HeartHandshake
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Lifetime giving",
					value: money(lifetime)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Principal & major",
					value: rows.filter((r) => ["principal", "major"].includes(r.tier)).length,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "No gift in a year",
					value: stale.length,
					tone: stale.length ? "warn" : "good",
					hint: "Worth a check-in"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search donors…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No donors on file." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										r.kind || "individual",
										" · stewarded by ",
										nameOf(byId, r.steward_id),
										" · last gift ",
										d(r.last_gift_on)
									]
								})]
							}),
							r.tier && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: ["principal", "major"].includes(r.tier) ? "good" : "muted",
								children: r.tier
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-sm",
								children: money(Number(r.lifetime_amount || 0))
							})
						]
					}, r.id))
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Add donor",
				fields,
				people,
				initial: {
					kind: "individual",
					tier: "community"
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
export { Donors as component };
