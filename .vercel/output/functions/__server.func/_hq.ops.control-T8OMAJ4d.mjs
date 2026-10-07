import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { B as ShieldCheck, Sn as Gauge, at as Radar, nt as RefreshCw, sr as CircleDot, ut as Plane } from "./_libs/lucide-react.mjs";
import { C as statusTone, E as usePeople, _ as db, b as nameOf, f as Stat, h as WorkPage, i as Empty, l as Pill, n as Btn, o as Loading, p as StatRow, r as Card, v as dt, w as titleCase } from "./_ssr/kit-L_nfYwfF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.control-T8OMAJ4d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MissionControl() {
	const [s, setS] = (0, import_react.useState)(null);
	const [tick, setTick] = (0, import_react.useState)(0);
	const { byId } = usePeople();
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [detections, flights, aircraft, auths, requests] = await Promise.all([
				db.from("ops_detections").select("*").order("detected_at", { ascending: false }).limit(25),
				db.from("ops_flights").select("*").order("created_at", { ascending: false }).limit(25),
				db.from("fleet_aircraft").select("*").order("tail_number"),
				db.from("ops_authorizations").select("*").order("starts_at", { ascending: false }).limit(15),
				db.from("team_requests").select("*").eq("to_team", "ops").neq("status", "closed").limit(10)
			]);
			if (!alive) return;
			setS({
				detections: detections.data ?? [],
				flights: flights.data ?? [],
				aircraft: aircraft.data ?? [],
				auths: auths.data ?? [],
				requests: requests.data ?? []
			});
		})();
		return () => {
			alive = false;
		};
	}, [tick]);
	const live = (0, import_react.useMemo)(() => {
		if (!s) return null;
		return {
			airborne: s.flights.filter((f) => [
				"launched",
				"flying",
				"returning"
			].includes(String(f.status))),
			openDet: s.detections.filter((x) => x.status === "unconfirmed" || x.status === "confirmed"),
			ready: s.aircraft.filter((a) => a.status === "available"),
			grounded: s.aircraft.filter((a) => a.status === "grounded" || a.status === "maintenance"),
			pendingAuth: s.auths.filter((a) => a.status === "requested" || a.status === "pending")
		};
	}, [s]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations",
		title: "Mission control",
		lede: "The live picture: what the sensor network sees, what is airborne, who authorized it, and which aircraft can launch next.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: () => setTick((t) => t + 1),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
		}),
		children: !s || !live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
			cols: 5,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open detections",
					value: live.openDet.length,
					icon: Radar,
					tone: live.openDet.length ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Airborne",
					value: live.airborne.length,
					icon: Plane,
					tone: live.airborne.length ? "info" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Aircraft ready",
					value: `${live.ready.length}/${s.aircraft.length}`,
					icon: Gauge,
					tone: live.ready.length ? "good" : "risk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Awaiting airspace",
					value: live.pendingAuth.length,
					icon: ShieldCheck,
					tone: live.pendingAuth.length ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Inbound requests",
					value: s.requests.length,
					icon: CircleDot,
					hint: "From other teams"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr_0.9fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Detection feed",
					hint: "Newest sensor and satellite hits",
					pad: false,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ops/detections",
						className: "text-xs text-primary hover:underline",
						children: "Triage"
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [s.detections.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No detections yet. The feed fills as sensors report." }), s.detections.slice(0, 8).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: x.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 font-mono text-[11px] text-muted-foreground",
									children: [
										x.region || "unmapped",
										" · ",
										x.latitude ?? "—",
										", ",
										x.longitude ?? "—",
										" · ",
										dt(x.detected_at)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(x.status),
									children: titleCase(x.status)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-muted-foreground",
									children: x.confidence ? `${Math.round(Number(x.confidence))}%` : "—"
								})]
							})]
						}, x.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Active sorties",
					hint: "Human-authorized flights",
					pad: false,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ops/flights",
						className: "text-xs text-primary hover:underline",
						children: "Flight log"
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [s.flights.filter((f) => f.status !== "complete" && f.status !== "cancelled").length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing airborne or queued." }), s.flights.filter((f) => f.status !== "complete" && f.status !== "cancelled").slice(0, 8).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-sm font-semibold",
										children: f.callsign
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: statusTone(f.status),
										children: titleCase(f.status)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 truncate text-xs text-muted-foreground",
									children: f.objective || "No objective set"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										"PIC ",
										nameOf(byId, f.pilot_id),
										" · ",
										f.authorized_at ? `authorized ${dt(f.authorized_at)}` : "awaiting authorization"
									]
								})
							]
						}, f.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Fleet at a glance",
						pad: false,
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ops/readiness",
							className: "text-xs text-primary hover:underline",
							children: "Readiness"
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [s.aircraft.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No aircraft registered." }), s.aircraft.slice(0, 8).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-4 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm",
									children: a.tail_number
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] tabular-nums text-muted-foreground",
										children: [Number(a.flight_hours || 0).toFixed(1), " h"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										tone: statusTone(a.status),
										children: titleCase(a.status)
									})]
								})]
							}, a.id))]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Airspace",
						pad: false,
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ops/airspace",
							className: "text-xs text-primary hover:underline",
							children: "Approvals"
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [s.auths.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No authorizations on file." }), s.auths.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-4 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-mono text-xs",
										children: a.reference
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: [
											a.authority,
											" · ",
											a.region || "—"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									tone: statusTone(a.status),
									children: titleCase(a.status)
								})]
							}, a.id))]
						})
					})]
				})
			]
		})] })
	});
}
//#endregion
export { MissionControl as component };
