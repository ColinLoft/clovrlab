import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Fn as FilePenLine } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, a as Kanban, b as nameOf, c as NewButton, f as Stat, g as d, h as WorkPage, l as Pill, o as Loading, p as StatRow, u as RecordDialog, y as money } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.fund.grants-DXMYZDsv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "researching",
		label: "Researching"
	},
	{
		key: "drafting",
		label: "Drafting"
	},
	{
		key: "submitted",
		label: "Submitted"
	},
	{
		key: "awarded",
		label: "Awarded"
	},
	{
		key: "declined",
		label: "Declined"
	}
];
var fields = [
	{
		key: "title",
		label: "Grant",
		type: "text",
		required: true
	},
	{
		key: "funder",
		label: "Funder",
		type: "text",
		required: true
	},
	{
		key: "amount",
		label: "Amount requested",
		type: "number"
	},
	{
		key: "stage",
		label: "Stage",
		type: "select",
		options: COLUMNS.map((c) => ({
			value: c.key,
			label: c.label
		}))
	},
	{
		key: "program",
		label: "Program",
		type: "text",
		placeholder: "Fleet expansion, sensor R&D…"
	},
	{
		key: "owner_id",
		label: "Owner",
		type: "user"
	},
	{
		key: "submitted_on",
		label: "Submitted",
		type: "date"
	},
	{
		key: "decision_on",
		label: "Decision expected",
		type: "date"
	},
	{
		key: "notes",
		label: "Notes",
		type: "textarea",
		full: true
	}
];
function Grants() {
	const { rows, loading, insert, patch } = useRows("fund_grants", { order: {
		column: "decision_on",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [open, setOpen] = (0, import_react.useState)(false);
	const pipeline = rows.filter((r) => !["awarded", "declined"].includes(r.stage)).reduce((s, r) => s + Number(r.amount || 0), 0);
	const won = rows.filter((r) => r.stage === "awarded").reduce((s, r) => s + Number(r.amount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Funding & partners",
		title: "Grant pipeline",
		lede: "Every application from first read of the RFP through the award letter.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Track grant",
			onClick: () => setOpen(true)
		}),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Live applications",
					value: rows.filter((r) => !["awarded", "declined"].includes(r.stage)).length,
					icon: FilePenLine
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "In pipeline",
					value: money(pipeline)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Awarded",
					value: money(won),
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Declined",
					value: rows.filter((r) => r.stage === "declined").length
				})
			] }),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, {
				columns: COLUMNS,
				rows,
				statusKey: "stage",
				onMove: (r, stage) => patch(r.id, { stage }),
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: statusTone(r.stage),
							children: money(Number(r.amount || 0))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: r.funder
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: [
							nameOf(byId, r.owner_id),
							" · decision ",
							d(r.decision_on)
						]
					})
				] })
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Track grant",
				fields,
				people,
				initial: { stage: "researching" },
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
export { Grants as component };
