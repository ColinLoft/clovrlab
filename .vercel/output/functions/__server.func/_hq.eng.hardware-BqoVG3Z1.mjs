import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Dr as Boxes, r as Wrench } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, b as nameOf, c as NewButton, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, y as money } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.eng.hardware-BqoVG3Z1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Hardware() {
	const projects = useRows("eng_projects", { order: {
		column: "name",
		ascending: true
	} });
	const parts = useRows("eng_cad_parts", { order: {
		column: "part_number",
		ascending: true
	} });
	const bom = useRows("eng_bom_items", { order: {
		column: "part_number",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [project, setProject] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(null);
	const projectOptions = (0, import_react.useMemo)(() => [{
		value: "all",
		label: "All programs"
	}, ...projects.rows.map((p) => ({
		value: p.id,
		label: p.name
	}))], [projects.rows]);
	const inScope = (rows) => project === "all" ? rows : rows.filter((r) => r.project_id === project);
	const partFields = (0, import_react.useMemo)(() => [
		{
			key: "part_number",
			label: "Part number",
			type: "text",
			required: true
		},
		{
			key: "name",
			label: "Name",
			type: "text",
			required: true
		},
		{
			key: "project_id",
			label: "Program",
			type: "select",
			options: projects.rows.map((p) => ({
				value: p.id,
				label: p.name
			}))
		},
		{
			key: "revision",
			label: "Revision",
			type: "text",
			placeholder: "A"
		},
		{
			key: "assembly",
			label: "Assembly",
			type: "text"
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"draft",
				"in_review",
				"released",
				"obsolete"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "owner_id",
			label: "Owner",
			type: "user"
		},
		{
			key: "file_url",
			label: "CAD file link",
			type: "text",
			full: true
		},
		{
			key: "description",
			label: "Description",
			type: "textarea",
			full: true
		}
	], [projects.rows]);
	const bomFields = (0, import_react.useMemo)(() => [
		{
			key: "part_number",
			label: "Part number",
			type: "text",
			required: true
		},
		{
			key: "name",
			label: "Name",
			type: "text",
			required: true
		},
		{
			key: "project_id",
			label: "Program",
			type: "select",
			options: projects.rows.map((p) => ({
				value: p.id,
				label: p.name
			}))
		},
		{
			key: "quantity",
			label: "Qty per unit",
			type: "number"
		},
		{
			key: "unit_cost",
			label: "Unit cost",
			type: "number"
		},
		{
			key: "supplier",
			label: "Supplier",
			type: "text"
		},
		{
			key: "risk_level",
			label: "Supply risk",
			type: "select",
			options: [
				"low",
				"medium",
				"high"
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
	], [projects.rows]);
	const scopedBom = inScope(bom.rows);
	const unitCost = scopedBom.reduce((s, r) => s + Number(r.quantity || 1) * Number(r.unit_cost || 0), 0);
	const risky = scopedBom.filter((r) => r.risk_level === "high");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Engineering",
		title: "Hardware & BOM",
		lede: "Released CAD, revision state, and the bill of materials behind each airframe — including where supply is fragile.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New part",
			onClick: () => setOpen("part")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "BOM line",
			onClick: () => setOpen("bom")
		})] }),
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "CAD parts",
					value: inScope(parts.rows).length,
					icon: Wrench
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Released",
					value: inScope(parts.rows).filter((p) => p.status === "released").length,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Cost per unit",
					value: money(unitCost),
					icon: Boxes
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "High supply risk",
					value: risky.length,
					tone: risky.length ? "risk" : "good"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: project,
					onChange: setProject,
					options: projectOptions
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: async () => {
						const subject = prompt("What should Manufacturing be told about this BOM?");
						if (subject && await raiseRequest({
							from_team: "Engineering",
							to_team: "Manufacturing",
							subject,
							priority: "normal",
							entity_type: "bom"
						})) alert("Manufacturing notified.");
					},
					children: "Hand off to Manufacturing"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 xl:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "CAD parts",
					hint: "Revision-controlled geometry",
					pad: false,
					children: parts.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : inScope(parts.rows).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No parts released yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: inScope(parts.rows).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(p.status),
									children: p.status || "draft"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-medium",
										children: [
											p.part_number,
											" rev ",
											p.revision || "—"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [p.name, p.assembly ? ` · ${p.assembly}` : ""]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: nameOf(byId, p.owner_id)
								})
							]
						}, p.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Bill of materials",
					hint: "Cost and supply risk per line",
					pad: false,
					children: bom.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : scopedBom.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No BOM lines yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: scopedBom.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-medium",
										children: [
											b.part_number,
											" — ",
											b.name
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											b.supplier || "No supplier",
											" · qty ",
											b.quantity ?? 1
										]
									})]
								}),
								b.risk_level && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
									tone: b.risk_level === "high" ? "risk" : b.risk_level === "medium" ? "warn" : "good",
									children: [b.risk_level, " risk"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-sm",
									children: money(Number(b.quantity || 1) * Number(b.unit_cost || 0))
								})
							]
						}, b.id))
					})
				})]
			}),
			open === "part" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New CAD part",
				fields: partFields,
				people,
				initial: {
					status: "draft",
					revision: "A"
				},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await parts.insert(v);
					setOpen(null);
				}
			}),
			open === "bom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "New BOM line",
				fields: bomFields,
				initial: {
					quantity: 1,
					risk_level: "low"
				},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await bom.insert(v);
					setOpen(null);
				}
			})
		]
	});
}
//#endregion
export { Hardware as component };
