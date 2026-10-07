import { i as __toESM, n as __exportAll } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { r as createServerFn } from "./_ssr/server-BrzklweG.mjs";
import { d as fetchIncidents, r as STATUS_META, s as createIncidentFromHotspot } from "./_ssr/incidents-K3g8CGjt.mjs";
import { Et as Navigation, On as Flame, Rt as Map, _r as Camera, nt as RefreshCw, qn as Crosshair, ut as Plane } from "./_libs/lucide-react.mjs";
import { f as fetchCameras, i as inArea, m as relTime, n as fetchResponseArea, p as getStatus, r as haversineMi } from "./_ssr/router-D9VViihH.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-DX9VUQiX.mjs";
import { d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card } from "./_ssr/kit-L_nfYwfF.mjs";
import { t as ScanPanel } from "./_ssr/ScanPanel-BCWz_ZRC.mjs";
import { t as require_leaflet_src } from "./_libs/leaflet.mjs";
import { a as MapContainer, c as useMap, i as Marker, l as useMapEvents, n as TileLayer, o as CircleMarker, r as Popup, s as Circle, t as Tooltip } from "./_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.live-map-ChN-1Oj0.js
var _hq_ops_live_map_ChN_1Oj0_exports = /* @__PURE__ */ __exportAll({
	component: () => LiveMapPage,
	i: () => useMapLayers,
	n: () => LiveMap$1,
	r: () => useCameraFilter,
	t: () => BASEMAP_OPTIONS
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_leaflet_src = /* @__PURE__ */ __toESM(require_leaflet_src());
var BASEMAPS = {
	dark: {
		label: "Dark",
		url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
		attribution: "&copy; OpenStreetMap &copy; CARTO"
	},
	satellite: {
		label: "Satellite",
		url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
		attribution: "Tiles &copy; Esri"
	},
	terrain: {
		label: "Terrain",
		url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
		attribution: "&copy; OpenTopoMap (CC-BY-SA)"
	}
};
var BASEMAP_OPTIONS = Object.entries(BASEMAPS).map(([value, b]) => ({
	value,
	label: b.label
}));
function ClickCapture({ onPick }) {
	useMapEvents({ click(e) {
		onPick?.({
			lat: e.latlng.lat,
			lng: e.latlng.lng
		});
	} });
	return null;
}
function FlyTo({ target }) {
	const map = useMap();
	(0, import_react.useEffect)(() => {
		if (target) map.flyTo([target.lat, target.lng], target.zoom ?? 11, { duration: .8 });
	}, [target, map]);
	return null;
}
function Readout() {
	const [pos, setPos] = (0, import_react.useState)(null);
	const [zoom, setZoom] = (0, import_react.useState)(null);
	const map = useMapEvents({
		mousemove: (e) => setPos({
			lat: e.latlng.lat,
			lng: e.latlng.lng
		}),
		mouseout: () => setPos(null),
		zoomend: () => setZoom(map.getZoom())
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute bottom-2 left-2 z-[500] rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white/80",
		children: [
			pos ? `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : "move cursor for coordinates",
			" · z",
			zoom ?? ""
		]
	});
}
function planeIcon(heading) {
	return import_leaflet_src.default.divIcon({
		className: "",
		iconSize: [18, 18],
		iconAnchor: [9, 9],
		html: `<div style="transform:rotate(${heading ?? 0}deg);color:#38bdf8;font-size:14px;line-height:18px;text-align:center">&#10148;</div>`
	});
}
function LiveMap$1({ center = [37.5, -120], zoom = 6, basemap = "dark", layers, cameras = [], incidents = [], hotspots = [], planes = [], area = null, onPickPoint, onSelectCamera, onSelectIncident, focus = null, height = "70vh" }) {
	const base = BASEMAPS[basemap] ?? BASEMAPS.dark;
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-border bg-muted/30",
		style: { height }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative overflow-hidden rounded-lg border border-border",
		style: { height },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
			center,
			zoom,
			style: {
				height: "100%",
				width: "100%",
				background: "#0b1220"
			},
			preferCanvas: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
					url: base.url,
					attribution: base.attribution,
					subdomains: "abcd"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickCapture, { onPick: onPickPoint }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlyTo, { target: focus }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {}),
				layers.area && area && Number(area.radius_mi) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
					center: [Number(area.center_lat), Number(area.center_lng)],
					radius: Number(area.radius_mi) * 1609.34,
					pathOptions: {
						color: "#38bdf8",
						weight: 1,
						fillOpacity: .04
					}
				}),
				layers.hotspots && hotspots.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: [h.lat, h.lng],
					radius: Math.min(10, 3 + (Number(h.frp) || 0) / 15),
					pathOptions: {
						color: "#f97316",
						fillColor: "#f97316",
						fillOpacity: .6,
						weight: 1
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Satellite hotspot"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"FRP ",
								h.frp,
								" MW · confidence ",
								h.confidence || "—"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								h.satellite,
								" · ",
								new Date(h.acq_datetime).toLocaleString()
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono",
								children: [
									h.lat.toFixed(3),
									", ",
									h.lng.toFixed(3)
								]
							})
						]
					}) })
				}, `h${i}`)),
				layers.cameras && cameras.map((c) => {
					const lat = Number(c.site.latitude);
					const lng = Number(c.site.longitude);
					if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
					const st = getStatus(c);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CircleMarker, {
						center: [lat, lng],
						radius: 4,
						pathOptions: {
							color: st.color,
							fillColor: st.color,
							fillOpacity: .9,
							weight: 1
						},
						eventHandlers: { click: () => onSelectCamera?.(c) },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							direction: "top",
							offset: [0, -4],
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
							minWidth: 240,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs",
								children: [
									c.image.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: c.image.url,
										alt: `Latest frame from ${c.name}`,
										loading: "lazy",
										style: {
											width: 240,
											height: 140,
											objectFit: "cover",
											borderRadius: 4,
											marginBottom: 6
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [c.site.county ? `${c.site.county}, ` : "", c.site.state ?? ""] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										st.label,
										" · ",
										relTime(c.image.time) ?? "no frame"
									] })
								]
							})
						})]
					}, c.site.id);
				}),
				layers.incidents && incidents.map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleMarker, {
					center: [Number(inc.lat), Number(inc.lng)],
					radius: 8,
					pathOptions: {
						color: STATUS_META[inc.status]?.color ?? "#ef4444",
						fillColor: STATUS_META[inc.status]?.color ?? "#ef4444",
						fillOpacity: .35,
						weight: 2
					},
					eventHandlers: { click: () => onSelectIncident?.(inc) },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: inc.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								STATUS_META[inc.status]?.label,
								" · ",
								inc.priority.toUpperCase()
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono",
								children: [
									Number(inc.lat).toFixed(3),
									", ",
									Number(inc.lng).toFixed(3)
								]
							})
						]
					}) })
				}, inc.id)),
				layers.aircraft && planes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, {
					position: [p.lat, p.lng],
					icon: planeIcon(p.heading),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: p.callsign?.trim() || p.icao
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p.altFt != null ? `${p.altFt.toLocaleString()} ft` : "altitude unknown" })]
					}) })
				}, p.icao))
			]
		})
	});
}
function useMapLayers(initial) {
	return (0, import_react.useState)({
		cameras: true,
		incidents: true,
		hotspots: true,
		aircraft: false,
		area: true,
		...initial
	});
}
function useCameraFilter(cameras, q) {
	return (0, import_react.useMemo)(() => {
		if (!q) return cameras;
		const s = q.toLowerCase();
		return cameras.filter((c) => `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s));
	}, [cameras, q]);
}
var getFirmsHotspots = createServerFn({ method: "GET" }).handler(createSsrRpc("f3b1585e99b9b54bc187d006b484e9f0ea8c31c510669e6fedf54fd2212ee1c8"));
/** Poll the ADS-B proxy route for traffic inside a bounding box. */
function usePlanes(bbox, enabled) {
	const [planes, setPlanes] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!enabled || !bbox) {
			setPlanes([]);
			return;
		}
		let alive = true;
		const load = async () => {
			try {
				const qs = new URLSearchParams({
					lamin: String(bbox.lamin),
					lomin: String(bbox.lomin),
					lamax: String(bbox.lamax),
					lomax: String(bbox.lomax)
				});
				const res = await fetch(`/api/planes?${qs}`);
				if (!res.ok) return;
				const rows = ((await res.json()).states ?? []).map((s) => ({
					icao: String(s[0]),
					callsign: s[1] ? String(s[1]).trim() : null,
					lng: Number(s[5]),
					lat: Number(s[6]),
					altFt: s[7] != null ? Math.round(Number(s[7]) * 3.28084) : null,
					heading: s[10] != null ? Number(s[10]) : null
				})).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
				if (alive) setPlanes(rows);
			} catch {}
		};
		load();
		const t = setInterval(load, 2e4);
		return () => {
			alive = false;
			clearInterval(t);
		};
	}, [
		enabled,
		bbox?.lamin,
		bbox?.lomin,
		bbox?.lamax,
		bbox?.lomax
	]);
	return planes;
}
var LiveMap = (0, import_react.lazy)(() => import("./_ssr/LiveMap-D-lKA5ct.mjs"));
function LiveMapPage() {
	const [cameras, setCameras] = (0, import_react.useState)([]);
	const [incidents, setIncidents] = (0, import_react.useState)([]);
	const [hotspots, setHotspots] = (0, import_react.useState)([]);
	const [area, setArea] = (0, import_react.useState)(null);
	const [basemap, setBasemap] = (0, import_react.useState)("dark");
	const [layers, setLayers] = (0, import_react.useState)({
		cameras: true,
		incidents: true,
		hotspots: true,
		aircraft: false,
		area: true
	});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [tick, setTick] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [focus, setFocus] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			const [cams, incs, ar, firms] = await Promise.all([
				fetchCameras().catch(() => []),
				fetchIncidents().catch(() => []),
				fetchResponseArea().catch(() => null),
				getFirmsHotspots().catch(() => ({ hotspots: [] }))
			]);
			if (!alive) return;
			setCameras(cams);
			setIncidents(incs);
			setArea(ar);
			setHotspots(firms.hotspots ?? []);
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, [tick]);
	const center = (0, import_react.useMemo)(() => area ? [Number(area.center_lat), Number(area.center_lng)] : [37.5, -120], [area]);
	const origin = (0, import_react.useMemo)(() => ({
		lat: center[0],
		lng: center[1]
	}), [center]);
	const areaCameras = (0, import_react.useMemo)(() => cameras.filter((c) => inArea(area, {
		lat: Number(c.site.latitude),
		lng: Number(c.site.longitude),
		state: c.site.state,
		county: c.site.county
	})), [cameras, area]);
	const nearest = (0, import_react.useMemo)(() => {
		const s = q.toLowerCase();
		return areaCameras.filter((c) => !s || `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s)).map((c) => ({
			c,
			mi: haversineMi(origin, {
				lat: Number(c.site.latitude),
				lng: Number(c.site.longitude)
			})
		})).sort((a, b) => a.mi - b.mi);
	}, [
		areaCameras,
		origin,
		q
	]);
	const areaIncidents = (0, import_react.useMemo)(() => incidents.filter((i) => inArea(area, {
		lat: Number(i.lat),
		lng: Number(i.lng)
	})), [incidents, area]);
	const areaHotspots = (0, import_react.useMemo)(() => hotspots.filter((h) => inArea(area, {
		lat: h.lat,
		lng: h.lng
	})), [hotspots, area]);
	const planes = usePlanes((0, import_react.useMemo)(() => {
		const deg = area ? Math.max(1, Number(area.radius_mi) / 60) : 4;
		return {
			lamin: center[0] - deg,
			lamax: center[0] + deg,
			lomin: center[1] - deg,
			lomax: center[1] + deg
		};
	}, [center, area]), layers.aircraft);
	const openIncidents = areaIncidents.filter((i) => !["closed", "false_positive"].includes(i.status));
	const addIncidentAt = async (p) => {
		if (busy) return;
		if (!confirm(`Open a manual incident at ${p.lat.toFixed(3)}, ${p.lng.toFixed(3)}?`)) return;
		setBusy(true);
		try {
			await createIncidentFromHotspot({
				lat: p.lat,
				lng: p.lng,
				source: "manual",
				title: `Manual report ${p.lat.toFixed(3)}, ${p.lng.toFixed(3)}`
			});
			setTick((t) => t + 1);
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(false);
		}
	};
	const toggle = (k) => setLayers((l) => ({
		...l,
		[k]: !l[k]
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Common picture",
		title: "Live map",
		lede: area?.address ? `Everything inside the service area around ${area.address}: cameras, satellite hotspots, open incidents and nearby air traffic. Click anywhere on the map to open a manual incident.` : "Cameras, satellite hotspots, open incidents and nearby air traffic on one canvas. Click anywhere on the map to open a manual incident.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: () => setFocus({
				lat: origin.lat,
				lng: origin.lng,
				zoom: 9
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "h-3.5 w-3.5" }), " Recentre"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: () => setTick((t) => t + 1),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
		})] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Cameras in area",
					value: areaCameras.length,
					icon: Camera,
					hint: `${cameras.length} on the network`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Satellite hotspots",
					value: areaHotspots.length,
					icon: Flame,
					tone: areaHotspots.length ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open incidents",
					value: openIncidents.length,
					icon: Map,
					tone: openIncidents.length ? "risk" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Air traffic",
					value: planes.length,
					icon: Plane,
					hint: layers.aircraft ? "Live ADS-B" : "Layer off"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanPanel, {
					cameras: nearest.map((n) => n.c),
					scope: area?.address ? `nearest first from ${area.address}` : "response area",
					onChanged: () => setTick((t) => t + 1)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: "Common operating picture",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [[
							"cameras",
							"incidents",
							"hotspots",
							"aircraft",
							"area"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggle(k),
							className: `rounded-full border px-2.5 py-1 text-[11px] capitalize transition ${layers[k] ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`,
							children: k
						}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: basemap,
							onChange: (v) => setBasemap(v),
							options: BASEMAP_OPTIONS,
							className: "ml-1"
						})]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[70vh] rounded-lg border border-border bg-muted/30" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMap, {
								center,
								zoom: area ? 9 : 6,
								basemap,
								layers,
								cameras: areaCameras,
								incidents: areaIncidents,
								hotspots: areaHotspots,
								planes,
								area,
								focus,
								onSelectCamera: (c) => setSelected(c),
								onPickPoint: addIncidentAt
							})
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							pad: false,
							title: `Nearest cameras (${nearest.length})`,
							hint: "Distance from the service-area centre",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
									q,
									setQ,
									placeholder: "Search…"
								})
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-h-[38vh] divide-y divide-border overflow-y-auto",
								children: [nearest.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No cameras inside the service area." }), nearest.slice(0, 60).map(({ c, mi }) => {
									const st = getStatus(c);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setSelected(c);
											setFocus({
												lat: Number(c.site.latitude),
												lng: Number(c.site.longitude),
												zoom: 12
											});
										},
										className: "flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-accent",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-2 w-2 flex-none rounded-full",
												style: { background: st.color }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block truncate font-medium",
													children: c.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block truncate text-muted-foreground",
													children: [
														c.site.county ? `${c.site.county}, ` : "",
														c.site.state ?? "",
														" · ",
														relTime(c.image.time) ?? "no frame"
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex-none font-mono text-[11px] text-muted-foreground",
												children: [mi.toFixed(1), " mi"]
											})
										]
									}, c.site.id);
								})]
							})
						}),
						selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: selected.name,
							hint: `${selected.site.county ?? ""} ${selected.site.state ?? ""}`.trim(),
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "ghost",
								onClick: () => setSelected(null),
								children: "Close"
							}),
							children: [
								selected.image.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: selected.image.url,
									alt: `Latest frame from ${selected.name}`,
									loading: "lazy",
									className: "mb-2 aspect-video w-full rounded border border-border object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										getStatus(selected).label,
										" · ",
										relTime(selected.image.time) ?? "no frame"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-[11px] text-muted-foreground",
									children: [
										Number(selected.site.latitude).toFixed(4),
										", ",
										Number(selected.site.longitude).toFixed(4)
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							pad: false,
							title: `Open incidents (${openIncidents.length})`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-h-[30vh] divide-y divide-border overflow-y-auto",
								children: [openIncidents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing open in the service area." }), openIncidents.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFocus({
										lat: Number(i.lat),
										lng: Number(i.lng),
										zoom: 12
									}),
									className: "flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-accent",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3.5 w-3.5 flex-none text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 truncate font-medium",
											children: i.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: i.priority === "p1" ? "risk" : "warn",
											children: STATUS_META[i.status]?.label ?? i.status
										})
									]
								}, i.id))]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						tone: "warn",
						children: "Orange"
					}),
					" satellite hotspot (NASA FIRMS)",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						tone: "good",
						children: "Green"
					}),
					" camera reporting",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						tone: "risk",
						children: "Red"
					}),
					" open incident"
				]
			})
		]
	});
}
//#endregion
export { _hq_ops_live_map_ChN_1Oj0_exports as a, LiveMapPage as component, useMapLayers as i, LiveMap$1 as n, useCameraFilter as r, BASEMAP_OPTIONS as t };
