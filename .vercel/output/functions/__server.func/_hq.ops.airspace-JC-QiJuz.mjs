import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, B as ShieldCheck, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, a as Kanban, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.airspace-JC-QiJuz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "requested",
		label: "Requested"
	},
	{
		key: "pending",
		label: "Under review"
	},
	{
		key: "approved",
		label: "Approved"
	},
	{
		key: "active",
		label: "Active window"
	},
	{
		key: "expired",
		label: "Expired"
	},
	{
		key: "denied",
		label: "Denied"
	}
];
function AirspacePage() {
	const { rows, loading, insert, patch } = useRows("ops_authorizations", { order: { column: "starts_at" } });
	const { rows: flights } = useRows("ops_flights", { order: { column: "created_at" } });
	const { people } = usePeople();
	const [creating, setCreating] = (0, import_react.useState)(false);
	const fields = [
		{
			key: "reference",
			label: "Reference",
			type: "text",
			required: true,
			placeholder: "LAANC-2026-0142"
		},
		{
			key: "authority",
			label: "Authority",
			type: "select",
			options: [
				"FAA LAANC",
				"FAA Part 107 Waiver",
				"State Fire Agency",
				"Local TFR Coordinator",
				"Landowner"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "kind",
			label: "Type",
			type: "select",
			options: [
				"laanc",
				"waiver",
				"tfr_entry",
				"bvlos",
				"night_ops"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "region",
			label: "Region / airspace",
			type: "text"
		},
		{
			key: "ceiling_ft",
			label: "Ceiling (ft AGL)",
			type: "number"
		},
		{
			key: "starts_at",
			label: "Window opens",
			type: "datetime"
		},
		{
			key: "ends_at",
			label: "Window closes",
			type: "datetime"
		},
		{
			key: "flight_id",
			label: "Linked sortie",
			type: "select",
			options: flights.map((f) => ({
				value: f.id,
				label: f.callsign
			}))
		},
		{
			key: "notes",
			label: "Conditions & restrictions",
			type: "textarea",
			full: true
		}
	];
	const approved = rows.filter((r) => ["approved", "active"].includes(r.status)).length;
	const waiting = rows.filter((r) => ["requested", "pending"].includes(r.status)).length;
	const denied = rows.filter((r) => r.status === "denied").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Compliance",
		title: "Airspace & approvals",
		lede: "Nothing launches into controlled airspace without a live clearance. Track every LAANC request, waiver and TFR entry from request to expiry.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "New authorization",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cleared to fly",
						value: approved,
						icon: ShieldCheck,
						tone: approved ? "good" : "warn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Awaiting decision",
						value: waiting,
						icon: Clock,
						tone: waiting ? "warn" : "default"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Denied",
						value: denied,
						icon: TriangleAlert,
						tone: denied ? "risk" : "default"
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No airspace authorizations on file yet." })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, {
					columns: COLUMNS,
					rows,
					statusKey: "status",
					onMove: (r, status) => patch(r.id, { status }),
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-semibold",
								children: r.reference
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(r.status),
								children: titleCase(r.kind)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: r.authority
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [
								r.region || "—",
								" · ",
								r.ceiling_ft ? `${r.ceiling_ft} ft AGL` : "no ceiling set"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [
								dt(r.starts_at),
								" → ",
								dt(r.ends_at)
							]
						})
					] })
				})
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Request airspace authorization",
				fields,
				people,
				initial: {
					authority: "FAA LAANC",
					kind: "laanc"
				},
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						status: "requested"
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { AirspacePage as component };
