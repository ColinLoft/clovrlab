import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { t as fetchDetectionEvents } from "./_ssr/detection-log-Ch9n7bMa.mjs";
import { J as ScrollText, Mr as BellRing, N as Sparkles, Nr as BellOff, On as Flame, Qn as CloudFog, Rr as ArrowUpRight, S as Timer, Wn as Download, cr as CircleCheck, ir as CirclePlay, it as Radio, nr as CircleX, nt as RefreshCw, o as VolumeX, ot as Printer, v as TriangleAlert } from "./_libs/lucide-react.mjs";
import { m as relTime } from "./_ssr/router-E4663KdI.mjs";
import { d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, v as dt } from "./_ssr/kit-CJyOYuhv.mjs";
import { t as UserMention } from "./_ssr/UserMention-BStgdkbS.mjs";
import { i as fetchSweepRuns } from "./_ssr/settings-CDKDDxvb.mjs";
import { n as printReport, t as downloadCsv } from "./_ssr/export-DkQJ2nl7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.logs-CVHMZ53C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		value: "all",
		label: "Everything"
	},
	{
		value: "sweeps",
		label: "Sweep start / end"
	},
	{
		value: "verdicts",
		label: "Frame verdicts"
	},
	{
		value: "flagged",
		label: "Fire & smoke only"
	},
	{
		value: "incidents",
		label: "Incidents opened"
	},
	{
		value: "paging",
		label: "Paging & acks"
	},
	{
		value: "operator",
		label: "Operator decisions"
	}
];
var META = {
	sweep_start: {
		label: "Sweep started",
		icon: CirclePlay,
		tone: "muted"
	},
	sweep_end: {
		label: "Sweep finished",
		icon: CircleCheck,
		tone: "good"
	},
	sweep_blocked: {
		label: "Sweep halted",
		icon: TriangleAlert,
		tone: "risk"
	},
	verdict: {
		label: "Frame verdict",
		icon: ScrollText,
		tone: "muted"
	},
	incident_opened: {
		label: "Incident opened",
		icon: Flame,
		tone: "risk"
	},
	confirmed: {
		label: "Operator confirmed",
		icon: CircleCheck,
		tone: "risk"
	},
	dismissed: {
		label: "Operator dismissed",
		icon: CircleX,
		tone: "muted"
	},
	muted: {
		label: "Camera muted",
		icon: VolumeX,
		tone: "muted"
	},
	paged: {
		label: "On-call paged",
		icon: BellRing,
		tone: "warn"
	},
	acked: {
		label: "Page acknowledged",
		icon: BellOff,
		tone: "good"
	},
	escalated: {
		label: "Page escalated",
		icon: ArrowUpRight,
		tone: "risk"
	}
};
function matches(filter, e) {
	switch (filter) {
		case "sweeps": return e.kind.startsWith("sweep_");
		case "verdicts": return e.kind === "verdict";
		case "flagged": return e.label === "fire" || e.label === "smoke";
		case "incidents": return e.kind === "incident_opened";
		case "paging": return [
			"paged",
			"acked",
			"escalated"
		].includes(e.kind);
		case "operator": return [
			"confirmed",
			"dismissed",
			"muted"
		].includes(e.kind);
		default: return true;
	}
}
function LogsPage() {
	const [runs, setRuns] = (0, import_react.useState)([]);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [tick, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let alive = true;
		setLoading(true);
		Promise.all([fetchSweepRuns(40).catch(() => []), fetchDetectionEvents(300).catch(() => [])]).then(([r, e]) => {
			if (!alive) return;
			setRuns(r);
			setEvents(e);
		}).finally(() => alive && setLoading(false));
		return () => {
			alive = false;
		};
	}, [tick]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setTick((v) => v + 1), 3e4);
		return () => clearInterval(t);
	}, []);
	const visible = (0, import_react.useMemo)(() => events.filter((e) => matches(filter, e)), [events, filter]);
	const last24 = runs.filter((r) => Date.now() - new Date(r.created_at).getTime() < 864e5);
	const analyzed24 = last24.reduce((n, r) => n + r.analyzed, 0);
	const errors24 = last24.reduce((n, r) => n + r.error_count, 0);
	const incidents24 = events.filter((e) => e.kind === "incident_opened" && Date.now() - new Date(e.created_at).getTime() < 864e5).length;
	const avgMs = last24.filter((r) => r.duration_ms).length ? Math.round(last24.reduce((n, r) => n + (r.duration_ms ?? 0), 0) / last24.filter((r) => r.duration_ms).length) : 0;
	const exportCols = [
		{
			key: "time",
			label: "Time (UTC)"
		},
		{
			key: "kind",
			label: "Event"
		},
		{
			key: "camera",
			label: "Camera"
		},
		{
			key: "label",
			label: "Label"
		},
		{
			key: "confidence",
			label: "Confidence %"
		},
		{
			key: "message",
			label: "Detail"
		}
	];
	const exportRows = () => [...visible].reverse().map((e) => ({
		time: new Date(e.created_at).toISOString(),
		kind: (META[e.kind]?.label ?? e.kind).toString(),
		camera: e.camera_name ?? "",
		label: e.label ?? "",
		confidence: e.confidence != null ? Math.round(e.confidence) : "",
		message: e.message ?? ""
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Detection",
		title: "Detection logs",
		lede: "One timeline for the whole detection loop: when a sweep starts and ends, what the model said about each frame, which detections became incidents, who was paged and what a human decided.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				onClick: () => downloadCsv("detection-timeline", exportCols, exportRows()),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " CSV"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				onClick: () => printReport({
					title: "Detection timeline",
					subtitle: FILTERS.find((f) => f.value === filter)?.label ?? "",
					columns: exportCols,
					rows: exportRows(),
					summary: [
						{
							label: "Sweeps 24h",
							value: String(last24.length)
						},
						{
							label: "Frames 24h",
							value: String(analyzed24)
						},
						{
							label: "Incidents 24h",
							value: String(incidents24)
						},
						{
							label: "Errors 24h",
							value: String(errors24)
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
				label: "Sweeps (24h)",
				value: last24.length,
				icon: Sparkles
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Frames screened (24h)",
				value: analyzed24,
				icon: ScrollText
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Incidents opened (24h)",
				value: incidents24,
				icon: Flame,
				tone: incidents24 ? "risk" : "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Sweep errors (24h)",
				value: errors24,
				icon: TriangleAlert,
				tone: errors24 ? "risk" : "good"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Avg sweep time",
				value: avgMs ? `${(avgMs / 1e3).toFixed(1)}s` : "—",
				icon: Timer
			})
		] }), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: `Sweep runs (${runs.length})`,
				hint: "Newest first",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[68vh] divide-y divide-border overflow-y-auto",
					children: [runs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No sweeps have run yet." }), runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: r.error_count ? "risk" : r.created_count ? "warn" : "good",
										children: r.trigger
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: relTime(r.created_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto font-mono text-[11px] text-muted-foreground",
										children: r.duration_ms != null ? `${(r.duration_ms / 1e3).toFixed(1)}s` : "running…"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted-foreground",
								children: [
									r.analyzed,
									" frame",
									r.analyzed === 1 ? "" : "s",
									" screened · ",
									r.created_count,
									" flagged · ",
									r.error_count,
									" error",
									r.error_count === 1 ? "" : "s"
								]
							}),
							r.first_error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-destructive",
								children: r.first_error
							})
						]
					}, r.id))]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: `Timeline (${visible.length})`,
				hint: "Sweeps, verdicts, incidents, pages and human decisions",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: filter,
					onChange: setFilter,
					options: FILTERS,
					className: "w-48"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[68vh] overflow-y-auto",
					children: [visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing logged for this filter yet." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "relative ml-5 border-l border-border",
						children: visible.map((e) => {
							const m = META[e.kind] ?? {
								label: e.kind.replace(/_/g, " "),
								icon: Radio,
								tone: "muted"
							};
							const Icon = e.label === "fire" ? Flame : e.label === "smoke" ? CloudFog : m.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "relative py-2.5 pl-5 pr-4 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -left-[9px] top-3.5 grid h-4 w-4 place-items-center rounded-full border border-border bg-background",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-2.5 w-2.5 ${m.tone === "risk" ? "text-destructive" : m.tone === "warn" ? "text-amber-500" : m.tone === "good" ? "text-emerald-500" : "text-muted-foreground"}` })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												tone: m.tone,
												children: m.label
											}),
											e.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												tone: e.label === "fire" ? "risk" : e.label === "smoke" ? "warn" : "good",
												children: e.label
											}),
											e.confidence != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[11px] text-muted-foreground",
												children: [Math.round(e.confidence), "%"]
											}),
											e.camera_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: e.camera_name
											}),
											e.trigger && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground",
												children: e.trigger
											}),
											e.actor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMention, {
												userId: e.actor,
												name: "teammate",
												size: "xs"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto font-mono text-[11px] text-muted-foreground",
												children: dt(e.created_at)
											})
										]
									}),
									e.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-muted-foreground",
										children: e.message
									}),
									e.incident_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/ops/incidents",
										search: { id: e.incident_id },
										className: "mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline",
										children: ["Open incident ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
									})
								]
							}, e.id);
						})
					})]
				})
			})]
		})]
	});
}
//#endregion
export { LogsPage as component };
