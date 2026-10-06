import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { K as Send, On as Flame, at as Radar, cr as CircleCheck, nr as CircleX } from "./_libs/lucide-react.mjs";
import { C as statusTone, D as useRows, E as usePeople, S as raiseRequest, T as useMe, c as NewButton, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt, w as titleCase } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.detections-DuQ47CSj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	{
		key: "name",
		label: "Detection name",
		type: "text",
		required: true,
		placeholder: "Ridge smoke column — sector 4"
	},
	{
		key: "source",
		label: "Source",
		type: "select",
		options: [
			"sensor",
			"satellite",
			"camera",
			"public_report",
			"partner"
		].map((v) => ({
			value: v,
			label: titleCase(v)
		}))
	},
	{
		key: "severity",
		label: "Severity",
		type: "select",
		options: [
			"low",
			"moderate",
			"high",
			"extreme"
		].map((v) => ({
			value: v,
			label: titleCase(v)
		}))
	},
	{
		key: "confidence",
		label: "Model confidence (%)",
		type: "number"
	},
	{
		key: "region",
		label: "Region",
		type: "text"
	},
	{
		key: "latitude",
		label: "Latitude",
		type: "number"
	},
	{
		key: "longitude",
		label: "Longitude",
		type: "number"
	},
	{
		key: "notes",
		label: "Analyst notes",
		type: "textarea",
		full: true
	}
];
function DetectionsPage() {
	const { rows, loading, insert, patch } = useRows("ops_detections", { order: { column: "detected_at" } });
	const { people, byId } = usePeople();
	const me = useMe();
	const [q, setQ] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => rows.filter((r) => !q || `${r.name} ${r.region} ${r.source}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
	const current = filtered.find((r) => r.id === selected) ?? filtered[0] ?? null;
	const confirm = (row) => patch(row.id, {
		status: "confirmed",
		confirmed_at: (/* @__PURE__ */ new Date()).toISOString(),
		confirmed_by: me
	});
	const dismiss = (row) => patch(row.id, { status: "dismissed" });
	const escalate = async (row) => {
		if (await raiseRequest({
			from_team: "ops",
			to_team: "exec",
			subject: `Authorize response — ${row.name}`,
			details: `Confirmed detection in ${row.region || "unmapped region"} at ${row.latitude ?? "?"}, ${row.longitude ?? "?"}. Requesting mission authorization.`,
			entity_type: "ops_detections",
			entity_id: row.id,
			priority: row.severity === "extreme" ? "urgent" : "high"
		})) {
			await patch(row.id, { status: "escalated" });
			alert("Escalated to leadership for mission authorization.");
		}
	};
	const counts = {
		unconfirmed: rows.filter((r) => r.status === "unconfirmed").length,
		confirmed: rows.filter((r) => r.status === "confirmed").length,
		escalated: rows.filter((r) => r.status === "escalated").length,
		dismissed: rows.filter((r) => r.status === "dismissed").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Triage",
		title: "Detection triage",
		lede: "Every sensor hit is reviewed by a human before anything flies. Confirm, dismiss, or escalate for mission authorization.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
			label: "Log detection",
			onClick: () => setCreating(true)
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Awaiting review",
					value: counts.unconfirmed,
					icon: Radar,
					tone: counts.unconfirmed ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Confirmed",
					value: counts.confirmed,
					icon: Flame,
					tone: counts.confirmed ? "risk" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Escalated",
					value: counts.escalated,
					icon: Send
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Dismissed",
					value: counts.dismissed,
					icon: CircleX
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search detections, regions, sources…"
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-[minmax(320px,420px)_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: `Queue (${filtered.length})`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[70vh] divide-y divide-border overflow-y-auto",
						children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing in the queue." }), filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(r.id),
							className: `flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-accent ${current?.id === r.id ? "bg-accent" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 font-mono text-[11px] text-muted-foreground",
									children: [
										r.region || "unmapped",
										" · ",
										dt(r.detected_at)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: statusTone(r.status),
								children: titleCase(r.status)
							})]
						}, r.id))]
					})
				}), current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: current.name,
					hint: `${titleCase(current.source)} · ${titleCase(current.severity)} severity`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Confidence",
									value: current.confidence ? `${Math.round(Number(current.confidence))}%` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Coordinates",
									value: `${current.latitude ?? "—"}, ${current.longitude ?? "—"}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Detected",
									value: dt(current.detected_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Region",
									value: current.region || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Status",
									value: titleCase(current.status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Confirmed by",
									value: current.confirmed_by ? byId.get(current.confirmed_by)?.full_name ?? "Team member" : "—"
								})
							]
						}),
						current.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm",
							children: current.notes
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2 border-t border-border pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
									variant: "primary",
									onClick: () => confirm(current),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Confirm fire"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
									onClick: () => escalate(current),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), " Escalate for authorization"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
									variant: "danger",
									onClick: () => dismiss(current),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), " Dismiss"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "Escalation opens a request to leadership. No aircraft launches until a named person authorizes the sortie in the flight log."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Select a detection." }) })]
			}),
			creating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Log a detection",
				fields,
				people,
				initial: {
					source: "sensor",
					severity: "moderate"
				},
				onCancel: () => setCreating(false),
				onSave: async (v) => {
					await insert({
						...v,
						status: "unconfirmed"
					});
					setCreating(false);
				}
			})
		]
	});
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm font-medium",
			children: value
		})]
	});
}
//#endregion
export { DetectionsPage as component };
