import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { N as Sparkles, Rt as Map, en as Layers, u as Users } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, a as Kanban, b as nameOf, c as NewButton, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, o as Loading, p as StatRow, r as Card, u as RecordDialog, w as titleCase } from "./_ssr/kit-CsnUfINY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.product.roadmap-TRA5wls7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		key: "idea",
		label: "Considering"
	},
	{
		key: "scoped",
		label: "Scoped"
	},
	{
		key: "building",
		label: "Building"
	},
	{
		key: "testing",
		label: "In test"
	},
	{
		key: "shipped",
		label: "Shipped"
	}
];
function RoadmapPage() {
	const { rows, loading, insert, patch } = useRows("prod_features", { order: { column: "created_at" } });
	const releases = useRows("prod_releases", { order: {
		column: "target_date",
		ascending: true
	} });
	const { people, byId } = usePeople();
	const [q, setQ] = (0, import_react.useState)("");
	const [horizon, setHorizon] = (0, import_react.useState)("all");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const fields = [
		{
			key: "title",
			label: "Feature",
			type: "text",
			required: true,
			full: true
		},
		{
			key: "problem",
			label: "Problem it solves",
			type: "textarea",
			full: true
		},
		{
			key: "horizon",
			label: "Horizon",
			type: "select",
			options: [
				"now",
				"next",
				"later"
			].map((v) => ({
				value: v,
				label: titleCase(v)
			}))
		},
		{
			key: "release_id",
			label: "Target release",
			type: "select",
			options: releases.rows.map((r) => ({
				value: r.id,
				label: r.name
			}))
		},
		{
			key: "owner_id",
			label: "Product owner",
			type: "user"
		},
		{
			key: "impact",
			label: "Expected impact",
			type: "text"
		}
	];
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => (!q || `${r.title} ${r.problem ?? ""}`.toLowerCase().includes(q.toLowerCase())) && (horizon === "all" || r.horizon === horizon)), [
		rows,
		q,
		horizon
	]);
	const shipped = rows.filter((r) => r.status === "shipped").length;
	const sendToEng = async (r) => {
		if (await raiseRequest({
			from_team: "product",
			to_team: "eng",
			subject: `Scope for build — ${r.title}`,
			details: r.problem || "Product has scoped this feature and needs an engineering estimate.",
			entity_type: "prod_features",
			entity_id: r.id,
			priority: "normal"
		})) alert("Engineering notified.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Product · Planning",
		title: "Roadmap",
		lede: "What we are building for the crews who fly, the analysts who read the imagery, and the agencies who act on it.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Add feature",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "On the board",
					value: rows.length,
					icon: Map
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Now",
					value: rows.filter((r) => r.horizon === "now").length,
					icon: Sparkles
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "In build or test",
					value: rows.filter((r) => ["building", "testing"].includes(r.status)).length,
					icon: Layers
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Shipped",
					value: shipped,
					icon: Users,
					tone: "good"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search the roadmap…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: horizon,
					onChange: setHorizon,
					options: [{
						value: "all",
						label: "All horizons"
					}, ...[
						"now",
						"next",
						"later"
					].map((v) => ({
						value: v,
						label: titleCase(v)
					}))]
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing on the roadmap yet." })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kanban, {
					columns: COLUMNS,
					rows: filtered,
					statusKey: "status",
					onMove: (r, status) => patch(r.id, { status }),
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium leading-tight",
								children: r.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: r.horizon === "now" ? "good" : "muted",
								children: titleCase(r.horizon)
							})]
						}),
						r.problem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-[11px] text-muted-foreground",
							children: r.problem
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[11px] text-muted-foreground",
							children: nameOf(byId, r.owner_id)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							onClick: (e) => {
								e.stopPropagation();
								sendToEng(r);
							},
							className: "mt-1 inline-block cursor-pointer text-[11px] text-primary hover:underline",
							children: "Send to engineering"
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-5",
				title: "Upcoming releases",
				pad: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [releases.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No releases planned." }), releases.rows.slice(0, 6).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									r.version,
									" · target ",
									r.target_date ?? "—"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: statusTone(r.status),
							children: titleCase(r.status)
						})]
					}, r.id))]
				})
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Add a feature",
				fields,
				people,
				initial: { horizon: "next" },
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						status: "idea"
					});
					setCreating(false);
				}
			})
		]
	});
}
//#endregion
export { RoadmapPage as component };
