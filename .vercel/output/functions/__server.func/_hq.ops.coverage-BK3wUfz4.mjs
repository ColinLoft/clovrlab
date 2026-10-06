import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { On as Flame, S as Timer, ut as Plane, zt as MapPin } from "./_libs/lucide-react.mjs";
import { C as statusTone, _ as db, f as Stat, h as WorkPage, i as Empty, l as Pill, o as Loading, p as StatRow, r as Card, t as Bar, v as dt, w as titleCase } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.coverage-BK3wUfz4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoveragePage() {
	const [state, setState] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [det, fl] = await Promise.all([db.from("ops_detections").select("*").order("detected_at", { ascending: false }).limit(500), db.from("ops_flights").select("*").limit(500)]);
			if (!alive) return;
			setState({
				det: det.data ?? [],
				fl: fl.data ?? []
			});
		})();
		return () => {
			alive = false;
		};
	}, []);
	const regions = (0, import_react.useMemo)(() => {
		if (!state) return [];
		const rank = [
			"low",
			"moderate",
			"high",
			"extreme"
		];
		const byRegion = /* @__PURE__ */ new Map();
		const flightsByDetection = /* @__PURE__ */ new Map();
		for (const f of state.fl) {
			if (!f.detection_id) continue;
			flightsByDetection.set(f.detection_id, [...flightsByDetection.get(f.detection_id) ?? [], f]);
		}
		for (const dRow of state.det) {
			const key = dRow.region || "Unmapped";
			const cur = byRegion.get(key) ?? {
				name: key,
				detections: 0,
				confirmed: 0,
				sorties: 0,
				worst: "low",
				lastAt: null,
				responseMins: null
			};
			cur.detections++;
			if (dRow.status === "confirmed") cur.confirmed++;
			if (rank.indexOf(String(dRow.severity)) > rank.indexOf(cur.worst)) cur.worst = String(dRow.severity);
			if (!cur.lastAt || +new Date(dRow.detected_at) > +new Date(cur.lastAt)) cur.lastAt = dRow.detected_at;
			const fls = flightsByDetection.get(dRow.id) ?? [];
			cur.sorties += fls.length;
			const first = fls.map((f) => f.departs_at).filter(Boolean).sort()[0];
			if (first && dRow.detected_at) {
				const mins = Math.max(0, Math.round((+new Date(first) - +new Date(dRow.detected_at)) / 6e4));
				cur.responseMins = cur.responseMins === null ? mins : Math.round((cur.responseMins + mins) / 2);
			}
			byRegion.set(key, cur);
		}
		return [...byRegion.values()].sort((a, b) => b.detections - a.detections);
	}, [state]);
	const maxDet = Math.max(1, ...regions.map((r) => r.detections));
	const active = regions.find((r) => r.name === selected) ?? null;
	const activeDetections = (state?.det ?? []).filter((x) => (x.region || "Unmapped") === active?.name).slice(0, 12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations",
		title: "Regional coverage",
		lede: "Where the network is watching, how hot each region runs and how quickly a sortie reaches a confirmed detection there.",
		children: !state ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
			cols: 4,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Regions watched",
					value: regions.length,
					icon: MapPin
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Detections",
					value: regions.reduce((n, r) => n + r.detections, 0),
					icon: Flame
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Confirmed",
					value: regions.reduce((n, r) => n + r.confirmed, 0),
					icon: Flame,
					tone: "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Sorties launched",
					value: regions.reduce((n, r) => n + r.sorties, 0),
					icon: Plane
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Coverage grid",
				hint: "Click a region to inspect its recent activity",
				pad: false,
				children: regions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No regions on record yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3",
					children: regions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelected(r.name),
						className: `bg-card p-4 text-left transition hover:bg-muted ${selected === r.name ? "ring-1 ring-inset ring-primary" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: r.worst === "extreme" || r.worst === "high" ? "risk" : r.worst === "moderate" ? "warn" : "muted",
									children: titleCase(r.worst)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-2xl font-semibold tabular-nums",
								children: r.detections
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] uppercase tracking-wider text-muted-foreground",
								children: "detections"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									value: r.detections,
									max: maxDet,
									tone: r.confirmed ? "risk" : "primary"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									r.confirmed,
									" confirmed · ",
									r.sorties,
									" sorties"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: r.responseMins === null ? "—" : `${r.responseMins}m`
								})]
							})
						]
					}, r.name))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: active ? active.name : "Region detail",
				hint: active ? "Most recent detections in this region" : "Pick a region from the grid",
				pad: false,
				children: !active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Select a region to see its detection history." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-px border-b border-border bg-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Last hit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs font-medium",
								children: dt(active.lastAt)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Confirm rate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs font-medium tabular-nums",
								children: [active.detections ? Math.round(active.confirmed / active.detections * 100) : 0, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3 w-3" }), " Response"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs font-medium tabular-nums",
								children: active.responseMins === null ? "—" : `${active.responseMins} min`
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [activeDetections.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No detections recorded here." }), activeDetections.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: x.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 font-mono text-[11px] text-muted-foreground",
								children: [
									x.latitude ?? "—",
									", ",
									x.longitude ?? "—",
									" · ",
									dt(x.detected_at)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: statusTone(x.status),
							children: titleCase(x.status)
						})]
					}, x.id))]
				})] })
			})]
		})] })
	});
}
//#endregion
export { CoveragePage as component };
