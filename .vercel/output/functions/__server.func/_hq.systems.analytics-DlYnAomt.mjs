import { i as __toESM } from "./_runtime.mjs";
import { r as supabase } from "./_ssr/client-PsXr_elE.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Mr as BellRing, On as Flame, Rr as ArrowUpRight, S as Timer, Sn as Gauge, Wn as Download, cr as CircleCheck, gr as ChartColumn, nt as RefreshCw, ot as Printer } from "./_libs/lucide-react.mjs";
import { d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, v as dt } from "./_ssr/kit-CJyOYuhv.mjs";
import { n as printReport, t as downloadCsv } from "./_ssr/export-DkQJ2nl7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.systems.analytics-DlYnAomt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RANGES = [
	{
		value: "7",
		label: "Last 7 days"
	},
	{
		value: "30",
		label: "Last 30 days"
	},
	{
		value: "90",
		label: "Last 90 days"
	},
	{
		value: "365",
		label: "Last 12 months"
	}
];
var mins = (a, b) => a && b ? (new Date(b).getTime() - new Date(a).getTime()) / 6e4 : null;
var avg = (xs) => xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
function dur(m) {
	if (m == null) return "—";
	if (m < 1) return `${Math.round(m * 60)}s`;
	if (m < 90) return `${m.toFixed(1)}m`;
	return `${(m / 60).toFixed(1)}h`;
}
function AnalyticsPage() {
	const [range, setRange] = (0, import_react.useState)("30");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [tick, setTick] = (0, import_react.useState)(0);
	const [alerts, setAlerts] = (0, import_react.useState)([]);
	const [incidents, setIncidents] = (0, import_react.useState)([]);
	const [events, setEvents] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		setLoading(true);
		const since = (/* @__PURE__ */ new Date(Date.now() - Number(range) * 864e5)).toISOString();
		const db = supabase;
		Promise.all([
			db.from("page_alerts").select("*").gte("created_at", since).limit(2e3),
			db.from("net_incidents").select("*").gte("discovered_at", since).limit(2e3),
			db.from("net_detection_events").select("*").gte("created_at", since).limit(5e3)
		]).then(([a, i, e]) => {
			if (!alive) return;
			setAlerts(a.data ?? []);
			setIncidents(i.data ?? []);
			setEvents(e.data ?? []);
		}).finally(() => alive && setLoading(false));
		return () => {
			alive = false;
		};
	}, [range, tick]);
	const m = (0, import_react.useMemo)(() => {
		const acked = alerts.filter((a) => a.acked_at);
		const mtta = avg(acked.map((a) => mins(a.created_at, a.acked_at)).filter((x) => x != null));
		const mttrPage = avg(alerts.filter((a) => a.resolved_at).map((a) => mins(a.created_at, a.resolved_at)).filter((x) => x != null));
		const ackRate = alerts.length ? acked.length / alerts.length * 100 : null;
		const escalated = alerts.filter((a) => Number(a.level ?? 0) > 1);
		const mttrInc = avg(incidents.filter((i) => i.resolved_at ?? i.closed_at).map((i) => mins(i.discovered_at, i.resolved_at ?? i.closed_at)).filter((x) => x != null));
		const mttaInc = avg(incidents.filter((i) => i.acked_at).map((i) => mins(i.discovered_at, i.acked_at)));
		const byCamera = /* @__PURE__ */ new Map();
		for (const e of events) {
			const key = e.camera_name ?? e.camera_id ?? "Unknown camera";
			const row = byCamera.get(key) ?? {
				name: key,
				detections: 0,
				incidents: 0,
				escalations: 0
			};
			if (e.kind === "verdict" && (e.label === "fire" || e.label === "smoke")) row.detections += 1;
			if (e.kind === "incident_opened") row.incidents += 1;
			if (e.kind === "escalated") row.escalations += 1;
			byCamera.set(key, row);
		}
		const zone = /* @__PURE__ */ new Map();
		for (const i of incidents) {
			const key = [i.county, i.state].filter(Boolean).join(", ") || "Unzoned";
			const row = zone.get(key) ?? {
				name: key,
				count: 0,
				mttr: [],
				escalations: 0
			};
			row.count += 1;
			const d = mins(i.discovered_at, i.resolved_at ?? i.closed_at);
			if (d != null) row.mttr.push(d);
			zone.set(key, row);
		}
		for (const a of alerts) if (Number(a.level ?? 0) > 1 && a.source_table === "net_incidents") {
			const inc = incidents.find((i) => i.id === a.source_id);
			const key = inc ? [inc.county, inc.state].filter(Boolean).join(", ") || "Unzoned" : "Unzoned";
			const row = zone.get(key);
			if (row) row.escalations += 1;
		}
		const byType = /* @__PURE__ */ new Map();
		for (const i of incidents) {
			const key = String(i.source ?? "other");
			const row = byType.get(key) ?? {
				name: key,
				count: 0,
				mtta: [],
				mttr: []
			};
			row.count += 1;
			const ta = mins(i.discovered_at, i.acked_at);
			const tr = mins(i.discovered_at, i.resolved_at ?? i.closed_at);
			if (ta != null) row.mtta.push(ta);
			if (tr != null) row.mttr.push(tr);
			byType.set(key, row);
		}
		const falsePositives = incidents.filter((i) => i.status === "false_positive" || i.resolution === "false_positive").length;
		return {
			mtta,
			mttrPage,
			ackRate,
			escalated: escalated.length,
			mttaInc,
			mttrInc,
			pages: alerts.length,
			incidents: incidents.length,
			falsePositives,
			cameras: [...byCamera.values()].sort((a, b) => b.incidents - a.incidents || b.detections - a.detections),
			zones: [...zone.values()].sort((a, b) => b.count - a.count),
			types: [...byType.values()].sort((a, b) => b.count - a.count)
		};
	}, [
		alerts,
		incidents,
		events
	]);
	const cameraCols = [
		{
			key: "name",
			label: "Camera"
		},
		{
			key: "detections",
			label: "Fire/smoke verdicts"
		},
		{
			key: "incidents",
			label: "Incidents"
		},
		{
			key: "escalations",
			label: "Escalations"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Enterprise Systems · Detection",
		title: "Response analytics",
		lede: "How fast the network gets a human on a detection, and how often it takes more than one page to get there. Everything below is measured over the selected window.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
				value: range,
				onChange: setRange,
				options: RANGES,
				className: "w-40"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				onClick: () => downloadCsv("camera-performance", cameraCols, m.cameras),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " CSV"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				onClick: () => printReport({
					title: "Detection response analytics",
					subtitle: RANGES.find((r) => r.value === range)?.label ?? "",
					columns: cameraCols,
					rows: m.cameras,
					summary: [
						{
							label: "MTTA (pages)",
							value: dur(m.mtta)
						},
						{
							label: "MTTR (incidents)",
							value: dur(m.mttrInc)
						},
						{
							label: "Ack rate",
							value: m.ackRate == null ? "—" : `${m.ackRate.toFixed(0)}%`
						},
						{
							label: "Escalations",
							value: String(m.escalated)
						}
					]
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " PDF"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				onClick: () => setTick((t) => t + 1),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
			})
		] }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "MTTA — page to ack",
				value: dur(m.mtta),
				icon: Timer,
				tone: m.mtta != null && m.mtta > 10 ? "warn" : "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "MTTR — incident closed",
				value: dur(m.mttrInc),
				icon: Gauge
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Acknowledgement rate",
				value: m.ackRate == null ? "—" : `${m.ackRate.toFixed(0)}%`,
				icon: CircleCheck,
				tone: m.ackRate != null && m.ackRate < 90 ? "warn" : "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Escalated pages",
				value: m.escalated,
				icon: ArrowUpRight,
				tone: m.escalated ? "risk" : "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Pages sent",
				value: m.pages,
				icon: BellRing
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Incidents",
				value: m.incidents,
				icon: Flame
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "False positives",
				value: m.falsePositives,
				icon: ChartColumn
			})
		] }), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 xl:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: `By camera (${m.cameras.length})`,
					hint: "Ranked by incidents opened",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
						head: [
							"Camera",
							"Verdicts",
							"Incidents",
							"Escalations"
						],
						rows: m.cameras.map((c) => [
							c.name,
							String(c.detections),
							String(c.incidents),
							c.escalations ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: "risk",
								children: c.escalations
							}) : "0"
						]),
						empty: "No camera activity in this window."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: `By zone (${m.zones.length})`,
					hint: "County / state of each incident",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
						head: [
							"Zone",
							"Incidents",
							"Avg time to close",
							"Escalations"
						],
						rows: m.zones.map((z) => [
							z.name,
							String(z.count),
							dur(avg(z.mttr)),
							z.escalations ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: "risk",
								children: z.escalations
							}) : "0"
						]),
						empty: "No incidents in this window."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: "By incident type",
					hint: "Grouped by detection source",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
						head: [
							"Type",
							"Incidents",
							"MTTA",
							"MTTR"
						],
						rows: m.types.map((t) => [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: t.name
							}),
							String(t.count),
							dur(avg(t.mtta)),
							dur(avg(t.mttr))
						]),
						empty: "No incidents in this window."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: "Slowest acknowledgements",
					hint: "Pages that took longest to reach a human",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
						head: [
							"Page",
							"Queue",
							"Sent",
							"Time to ack"
						],
						rows: alerts.filter((a) => a.acked_at).map((a) => ({
							a,
							t: mins(a.created_at, a.acked_at) ?? 0
						})).sort((x, y) => y.t - x.t).slice(0, 12).map(({ a, t }) => [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-clamp-1",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: a.queue === "ops" ? "warn" : "muted",
								children: a.queue ?? "ops"
							}),
							dt(a.created_at),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: t > 15 ? "font-medium text-destructive" : "",
								children: dur(t)
							})
						]),
						empty: "No acknowledged pages in this window."
					})
				})
			]
		})]
	});
}
function Table({ head, rows, empty }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: empty });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-h-[46vh] overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "sticky top-0 bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground",
					children: head.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-2 font-medium",
						children: h
					}, h))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border",
				children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "hover:bg-muted/40",
					children: r.map((c, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-2 align-middle",
						children: c
					}, j))
				}, i))
			})]
		})
	});
}
//#endregion
export { AnalyticsPage as component };
