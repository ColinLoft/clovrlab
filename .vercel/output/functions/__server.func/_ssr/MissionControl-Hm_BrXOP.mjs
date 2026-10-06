import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MissionControl-Hm_BrXOP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NODES = [
	{
		x: 12,
		y: 68,
		r: 0
	},
	{
		x: 24,
		y: 52,
		r: 1
	},
	{
		x: 33,
		y: 74,
		r: 2
	},
	{
		x: 44,
		y: 44,
		r: 3
	},
	{
		x: 52,
		y: 66,
		r: 4
	},
	{
		x: 61,
		y: 34,
		r: 5
	},
	{
		x: 66,
		y: 58,
		r: 6
	},
	{
		x: 76,
		y: 46,
		r: 7
	},
	{
		x: 84,
		y: 70,
		r: 8
	},
	{
		x: 90,
		y: 36,
		r: 9
	},
	{
		x: 38,
		y: 26,
		r: 10
	},
	{
		x: 20,
		y: 34,
		r: 11
	}
];
var LINKS = [
	[0, 1],
	[1, 2],
	[1, 3],
	[2, 4],
	[3, 4],
	[3, 5],
	[4, 6],
	[5, 6],
	[5, 7],
	[6, 8],
	[7, 8],
	[7, 9],
	[3, 10],
	[10, 11],
	[11, 1],
	[10, 5]
];
/**
* Distributed sensor-node network map. One node raises a detection on a
* rotating cycle and the signal propagates toward the Operations Center node.
*/
function SensorNetwork({ className = "" }) {
	const [alert, setAlert] = (0, import_react.useState)(2);
	const timer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
		timer.current = window.setInterval(() => {
			setAlert(Math.floor(Math.random() * NODES.length));
		}, 3600);
		return () => {
			if (timer.current) window.clearInterval(timer.current);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 100 90",
		className: `h-full w-full ${className}`,
		role: "img",
		"aria-label": "Concept map of distributed wildfire sensor nodes linked across terrain, reporting to an operations center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				stroke: "currentColor",
				strokeOpacity: "0.13",
				fill: "none",
				strokeWidth: "0.3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 74 C 18 62, 30 80, 46 68 S 74 54, 100 66" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 62 C 20 48, 34 66, 50 54 S 78 40, 100 52" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 50 C 22 36, 36 52, 54 40 S 80 28, 100 38" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 38 C 24 26, 40 40, 58 28 S 82 18, 100 26" })
				]
			}),
			LINKS.map(([a, b]) => {
				const A = NODES[a];
				const B = NODES[b];
				const hot = a === alert || b === alert;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: A.x,
					y1: A.y,
					x2: B.x,
					y2: B.y,
					stroke: hot ? "#f59e0b" : "currentColor",
					strokeOpacity: hot ? .75 : .22,
					strokeWidth: hot ? .4 : .22,
					style: { transition: "stroke 600ms ease, stroke-opacity 600ms ease" }
				}, `${a}-${b}`);
			}),
			NODES.map((n, i) => {
				const hot = i === alert;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					hot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: n.x,
						cy: n.y,
						r: "3.4",
						fill: "#f59e0b",
						fillOpacity: "0.16",
						className: "live-pulse"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: n.x,
						cy: n.y,
						r: hot ? 1.5 : 1,
						fill: hot ? "#f59e0b" : "#38bdf8",
						fillOpacity: hot ? 1 : .75,
						style: { transition: "all 500ms ease" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: n.x - 2.4,
						y: n.y - 2.4,
						width: "4.8",
						height: "4.8",
						fill: "none",
						stroke: hot ? "#f59e0b" : "currentColor",
						strokeOpacity: hot ? .6 : .2,
						strokeWidth: "0.18"
					})
				] }, i);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "12",
					r: "5",
					fill: "none",
					stroke: "#f59e0b",
					strokeOpacity: "0.35",
					strokeWidth: "0.25"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "12",
					r: "2.4",
					fill: "#f59e0b",
					fillOpacity: "0.85"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: NODES[alert].x,
					y1: NODES[alert].y,
					x2: "50",
					y2: "12",
					stroke: "#f59e0b",
					strokeOpacity: "0.5",
					strokeWidth: "0.25",
					strokeDasharray: "1.4 1.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "50",
					y: "5.5",
					textAnchor: "middle",
					fill: "currentColor",
					fillOpacity: "0.6",
					fontSize: "2.6",
					letterSpacing: "0.35",
					children: "OPERATIONS CENTER"
				})
			] })
		]
	});
}
var feed = [
	{
		t: "T+00:00",
		s: "Node 07 reports temperature anomaly",
		tone: "sig"
	},
	{
		t: "T+00:00",
		s: "Detection candidate raised · cross-checking neighbours",
		tone: "sig"
	},
	{
		t: "T+00:01",
		s: "Alert routed to Operations Center",
		tone: "sig"
	},
	{
		t: "T+00:03",
		s: "Operator review · incident opened",
		tone: ""
	},
	{
		t: "T+00:06",
		s: "UAV mission assigned to incident",
		tone: "cyan"
	},
	{
		t: "T+00:09",
		s: "Aircraft airborne · navigating to coordinates",
		tone: "cyan"
	},
	{
		t: "T+00:21",
		s: "Thermal + RGB on station",
		tone: "cyan"
	},
	{
		t: "T+00:23",
		s: "Intelligence package prepared for responders",
		tone: "ok"
	}
];
var toneColor = {
	sig: "var(--signal)",
	cyan: "#22d3ee",
	ok: "#4ade80",
	"": "currentColor"
};
/** Concept mission-control interface. All values are illustrative. */
function MissionControl() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-[var(--night)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "live-pulse h-1.5 w-1.5 rounded-full bg-[var(--signal)]",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[0.66rem] uppercase tracking-[0.22em] text-foreground/75",
					children: "Mission control · concept interface"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground",
				children: "Illustrative data — not live operations"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-px bg-border lg:grid-cols-[1.45fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "blueprint-grid relative bg-[var(--night)] p-5 text-foreground/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[16/11] w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SensorNetwork, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-2 gap-px bg-border sm:grid-cols-4",
					children: [
						{
							k: "Network",
							v: "Nodes reporting"
						},
						{
							k: "Alerts",
							v: "1 under review"
						},
						{
							k: "Aircraft",
							v: "1 assigned"
						},
						{
							k: "Weather",
							v: "Gusting, low RH"
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[var(--night)] px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground",
							children: c.k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-ink",
							children: c.v
						})]
					}, c.k))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[var(--night)] p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground",
						children: "Incident timeline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-4 space-y-3",
						children: feed.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[0.68rem] tabular-nums text-muted-foreground",
								children: f.t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-start gap-2 text-foreground/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full",
									style: { background: toneColor[f.tone] },
									"aria-hidden": true
								}), f.s]
							})]
						}, f.s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 border-t border-border pt-4 text-xs text-muted-foreground",
						children: "The internal HQ carries the operational version of this interface: live alerts, incident queue, sensor network, UAV fleet, communications, and the incident record."
					})
				]
			})]
		})]
	});
}
//#endregion
export { SensorNetwork as n, MissionControl as t };
