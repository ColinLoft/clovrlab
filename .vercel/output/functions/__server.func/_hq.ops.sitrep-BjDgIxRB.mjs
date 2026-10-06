import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { $n as Clock, B as ShieldCheck, at as Radar, nt as RefreshCw, r as Wrench, ut as Plane } from "./_libs/lucide-react.mjs";
import { C as statusTone, E as usePeople, _ as db, b as nameOf, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, v as dt, w as titleCase } from "./_ssr/kit-CJyOYuhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.sitrep-BjDgIxRB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND = {
	detection: {
		icon: Radar,
		label: "Detection",
		cls: "text-primary bg-primary/10 border-primary/25"
	},
	flight: {
		icon: Plane,
		label: "Sortie",
		cls: "text-sky-500 bg-sky-500/10 border-sky-500/25"
	},
	airspace: {
		icon: ShieldCheck,
		label: "Airspace",
		cls: "text-amber-500 bg-amber-500/10 border-amber-500/25"
	},
	maintenance: {
		icon: Wrench,
		label: "Maintenance",
		cls: "text-muted-foreground bg-muted border-border"
	}
};
function SitrepPage() {
	const [beats, setBeats] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [tick, setTick] = (0, import_react.useState)(0);
	const { byId } = usePeople();
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [det, fl, auth, mx] = await Promise.all([
				db.from("ops_detections").select("*").order("detected_at", { ascending: false }).limit(40),
				db.from("ops_flights").select("*").order("created_at", { ascending: false }).limit(40),
				db.from("ops_authorizations").select("*").order("starts_at", { ascending: false }).limit(30),
				db.from("fleet_maintenance").select("*").order("opened_on", { ascending: false }).limit(30)
			]);
			if (!alive) return;
			const all = [
				...(det.data ?? []).map((x) => ({
					id: `d${x.id}`,
					at: x.detected_at || x.created_at,
					kind: "detection",
					title: x.name,
					status: x.status,
					detail: `${x.region || "unmapped"} · ${titleCase(x.source)} · confidence ${x.confidence ? Math.round(Number(x.confidence)) + "%" : "—"}`
				})),
				...(fl.data ?? []).map((x) => ({
					id: `f${x.id}`,
					at: x.departs_at || x.created_at,
					kind: "flight",
					title: `${x.callsign} — ${x.objective || "sortie"}`,
					status: x.status,
					detail: `PIC ${nameOf(byId, x.pilot_id)}${x.payload_released ? " · payload released" : ""}`
				})),
				...(auth.data ?? []).map((x) => ({
					id: `a${x.id}`,
					at: x.starts_at || x.created_at,
					kind: "airspace",
					title: `${x.reference} — ${x.authority}`,
					status: x.status,
					detail: `${titleCase(x.kind)} · ${x.region || "—"}${x.ceiling_ft ? ` · ceiling ${x.ceiling_ft} ft` : ""}`
				})),
				...(mx.data ?? []).map((x) => ({
					id: `m${x.id}`,
					at: x.opened_on || x.created_at,
					kind: "maintenance",
					title: x.title,
					status: x.status,
					detail: `${titleCase(x.kind)}${x.grounding ? " · grounding" : ""} · ${nameOf(byId, x.assignee_id)}`
				}))
			].filter((b) => b.at);
			all.sort((a, b) => +new Date(b.at) - +new Date(a.at));
			setBeats(all.slice(0, 60));
		})();
		return () => {
			alive = false;
		};
	}, [tick, byId]);
	const shown = (0, import_react.useMemo)(() => (beats ?? []).filter((b) => filter === "all" || b.kind === filter), [beats, filter]);
	const counts = (0, import_react.useMemo)(() => {
		const c = {
			detection: 0,
			flight: 0,
			airspace: 0,
			maintenance: 0
		};
		for (const b of beats ?? []) c[b.kind]++;
		return c;
	}, [beats]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		eyebrow: "Mission Operations",
		title: "Situation report",
		lede: "One chronological record of everything the operation did today — what was seen, what flew, who cleared the airspace and what came off the line for maintenance.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: () => setTick((t) => t + 1),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 4,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Detection events",
						value: counts.detection,
						icon: Radar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Sorties logged",
						value: counts.flight,
						icon: Plane
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Airspace actions",
						value: counts.airspace,
						icon: ShieldCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Maintenance events",
						value: counts.maintenance,
						icon: Wrench
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-1.5",
				children: [
					"all",
					"detection",
					"flight",
					"airspace",
					"maintenance"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(k),
					className: `rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${filter === k ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`,
					children: k === "all" ? "Everything" : KIND[k].label
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				children: !beats ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing on the timeline yet. Events appear here as the operation runs." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "relative px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "absolute bottom-4 left-[30px] top-4 w-px bg-border"
					}), shown.map((b) => {
						const K = KIND[b.kind];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative flex gap-4 py-3 pl-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${K.cls}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(K.icon, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium",
											children: b.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: statusTone(b.status),
											children: titleCase(b.status)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: b.detail
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden shrink-0 items-center gap-1 text-[11px] tabular-nums text-muted-foreground sm:flex",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
										" ",
										dt(b.at)
									]
								})
							]
						}, b.id);
					})]
				})
			})
		]
	});
}
//#endregion
export { SitrepPage as component };
