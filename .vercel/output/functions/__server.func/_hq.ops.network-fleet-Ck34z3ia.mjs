import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Pr as BatteryCharging, Un as Droplets, i as Warehouse, nt as RefreshCw, ut as Plane } from "./_libs/lucide-react.mjs";
import { f as Stat, h as WorkPage, i as Empty, n as Btn, o as Loading, p as StatRow, r as Card, t as Bar, v as dt } from "./_ssr/kit-CJyOYuhv.mjs";
import { n as fetchBases, r as fetchDrones, t as STATUS_META } from "./_ssr/drones-DTO3jNJI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.network-fleet-Ck34z3ia.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NetworkFleetPage() {
	const [drones, setDrones] = (0, import_react.useState)([]);
	const [bases, setBases] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [tick, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			const [d, b] = await Promise.all([fetchDrones().catch(() => []), fetchBases().catch(() => [])]);
			if (!alive) return;
			setDrones(d);
			setBases(b);
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, [tick]);
	const ready = drones.filter((d) => d.status === "ready").length;
	const inflight = drones.filter((d) => d.status === "inflight" || d.status === "returning").length;
	const loaded = drones.filter((d) => (d.retardant_l ?? 0) > 0).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Fleet",
		title: "Response fleet",
		lede: "The aircraft the dispatcher can actually launch: readiness state, energy, payload and where each one lives.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: () => setTick((t) => t + 1),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Ready to launch",
				value: `${ready}/${drones.length}`,
				icon: Plane,
				tone: ready ? "good" : "risk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Airborne",
				value: inflight,
				icon: Plane
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Payload loaded",
				value: loaded,
				icon: Droplets
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
				label: "Bases",
				value: bases.length,
				icon: Warehouse
			})
		] }), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: `Aircraft (${drones.length})`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [drones.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No aircraft registered in the detection network yet." }), drones.map((d) => {
						const meta = STATUS_META[d.status];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-sm font-semibold",
										children: d.tail_number
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: [
											d.airframe?.model ?? "Airframe unknown",
											" · ",
											d.base?.name ?? "No home base"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full px-2 py-0.5 text-[11px]",
									style: {
										color: meta?.color,
										border: `1px solid ${meta?.color}55`
									},
									children: meta?.label ?? d.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatteryCharging, { className: "h-3 w-3" }),
											" Battery ",
											d.battery_pct ?? 0,
											"%"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										value: Number(d.battery_pct ?? 0),
										tone: (d.battery_pct ?? 0) >= 40 ? "good" : "risk"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-3 w-3" }),
											" Retardant ",
											d.retardant_l ?? 0,
											" L"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										value: Number(d.retardant_l ?? 0),
										max: Number(d.airframe?.retardant_capacity_l ?? 100)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: [
											Number(d.flight_hours ?? 0).toFixed(1),
											" h flown · next service ",
											d.next_service_at ? dt(d.next_service_at) : "—"
										]
									})
								]
							})]
						}, d.id);
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: "Bases",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [bases.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No bases configured." }), bases.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: b.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: [
									b.code,
									" · ",
									Number(b.lat).toFixed(3),
									", ",
									Number(b.lng).toFixed(3)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [drones.filter((d) => d.base?.id === b.id).length, " aircraft"]
						})]
					}, b.id))]
				})
			})]
		})]
	});
}
//#endregion
export { NetworkFleetPage as component };
