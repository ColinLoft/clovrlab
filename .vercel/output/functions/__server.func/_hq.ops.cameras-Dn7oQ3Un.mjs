import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { N as Sparkles, Nr as BellOff, _r as Camera, cr as CircleCheck, gn as Grid3x3, k as Star, nr as CircleX, nt as RefreshCw, qt as ListChecks } from "./_libs/lucide-react.mjs";
import { f as fetchCameras, i as inArea, m as relTime, n as fetchResponseArea, p as getStatus, r as haversineMi } from "./_ssr/router-E4663KdI.mjs";
import { d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, s as Modal } from "./_ssr/kit-CJyOYuhv.mjs";
import { a as markFalsePositive, c as sweepCameras, i as fetchSweepStatus, n as dismissSuggestion, o as muteCamera, r as fetchPendingSuggestions, s as promoteSuggestion, t as ScanPanel } from "./_ssr/ScanPanel-HUjrzMY3.mjs";
import { a as saveCameraPref, n as fetchCameraPrefs, r as fetchSettings } from "./_ssr/settings-CDKDDxvb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.ops.cameras-Dn7oQ3Un.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REFRESH_OPTIONS = [
	{
		value: "0",
		label: "Manual refresh"
	},
	{
		value: "60",
		label: "Auto every 1 min"
	},
	{
		value: "300",
		label: "Auto every 5 min"
	},
	{
		value: "900",
		label: "Auto every 15 min"
	}
];
function CamerasPage() {
	const [cameras, setCameras] = (0, import_react.useState)([]);
	const [area, setArea] = (0, import_react.useState)(null);
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [prefs, setPrefs] = (0, import_react.useState)({});
	const [suggestions, setSuggestions] = (0, import_react.useState)([]);
	const [sweep, setSweep] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("wall");
	const [onlyPriority, setOnlyPriority] = (0, import_react.useState)(false);
	const [refreshSec, setRefreshSec] = (0, import_react.useState)("300");
	const [stamp, setStamp] = (0, import_react.useState)(Date.now());
	const [tick, setTick] = (0, import_react.useState)(0);
	const [detail, setDetail] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			const [cams, ar, sugg, st, cfg, pr] = await Promise.all([
				fetchCameras().catch(() => []),
				fetchResponseArea().catch(() => null),
				fetchPendingSuggestions().catch(() => []),
				fetchSweepStatus().catch(() => null),
				fetchSettings().catch(() => null),
				fetchCameraPrefs().catch(() => ({}))
			]);
			if (!alive) return;
			setCameras(cams);
			setArea(ar);
			setSuggestions(sugg);
			setSweep(st);
			setSettings(cfg);
			setPrefs(pr);
			setStamp(Date.now());
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, [tick]);
	(0, import_react.useEffect)(() => {
		const sec = Number(refreshSec);
		if (!sec) return;
		const id = setInterval(() => {
			setStamp(Date.now());
			fetchPendingSuggestions().then(setSuggestions).catch(() => {});
		}, sec * 1e3);
		return () => clearInterval(id);
	}, [refreshSec]);
	const center = (0, import_react.useMemo)(() => area ? {
		lat: Number(area.center_lat),
		lng: Number(area.center_lng)
	} : null, [area]);
	const distanceOf = (0, import_react.useCallback)((c) => center ? haversineMi(center, {
		lat: Number(c.site.latitude),
		lng: Number(c.site.longitude)
	}) : Number.POSITIVE_INFINITY, [center]);
	const inRange = (0, import_react.useMemo)(() => cameras.filter((c) => inArea(area, {
		lat: Number(c.site.latitude),
		lng: Number(c.site.longitude),
		state: c.site.state,
		county: c.site.county
	})), [cameras, area]);
	const filtered = (0, import_react.useMemo)(() => {
		const s = q.toLowerCase();
		let list = s ? inRange.filter((c) => `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s)) : inRange;
		if (onlyPriority) list = list.filter((c) => (prefs[c.site.id]?.priority ?? 0) > 0);
		return list.slice().sort((a, b) => {
			const pri = (prefs[b.site.id]?.priority ?? 0) - (prefs[a.site.id]?.priority ?? 0);
			if (pri) return pri;
			if (!center) return a.name.localeCompare(b.name);
			return distanceOf(a) - distanceOf(b);
		});
	}, [
		inRange,
		q,
		onlyPriority,
		prefs,
		center,
		distanceOf
	]);
	const wall = (0, import_react.useMemo)(() => filtered.filter((c) => c.image.url).slice(0, 60), [filtered]);
	const togglePriority = (0, import_react.useCallback)(async (c) => {
		const cur = prefs[c.site.id];
		const next = {
			camera_id: c.site.id,
			camera_name: c.name,
			watch: cur?.watch ?? true,
			priority: (cur?.priority ?? 0) > 0 ? 0 : 1,
			high_risk: cur?.high_risk ?? false,
			label: cur?.label ?? null,
			notes: cur?.notes ?? null
		};
		setPrefs((p) => ({
			...p,
			[c.site.id]: next
		}));
		await saveCameraPref(next);
	}, [prefs]);
	const doSweep = async (batchCams, label) => {
		const batch = batchCams.filter((c) => c.image.url).slice(0, Math.min(50, Number(settings?.sweep_batch_size ?? 25)));
		if (!batch.length) {
			alert("No camera frames available to analyse.");
			return;
		}
		setRunning(true);
		try {
			const res = await sweepCameras({ data: { cameras: batch.map((c) => ({
				camera_id: c.site.id,
				camera_name: c.name,
				lat: Number(c.site.latitude),
				lng: Number(c.site.longitude),
				state: c.site.state,
				county: c.site.county,
				image_url: c.image.url,
				image_time: c.image.time ?? (/* @__PURE__ */ new Date()).toISOString()
			})) } });
			alert(res.paused ? "AI sweep halted — automation paused. Check Enterprise Systems → Detection network." : `${label}: analysed ${res.analyzed ?? 0} frames · ${res.created ?? 0} new suggestions${res.errors?.length ? `\n${res.errors[0]}` : ""}`);
			setTick((t) => t + 1);
		} catch (e) {
			alert(e.message);
		} finally {
			setRunning(false);
		}
	};
	const online = filtered.filter((c) => getStatus(c).status === "online").length;
	const frameUrl = (c) => c.image.url ? `${c.image.url}${c.image.url.includes("?") ? "&" : "?"}t=${stamp}` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Mission Operations · Detection",
		title: "Camera network",
		lede: "A live wall of watch cameras inside the response area, screened by an AI first pass. A person reviews every suggestion before it becomes an incident.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
			value: refreshSec,
			onChange: setRefreshSec,
			options: REFRESH_OPTIONS,
			className: "w-40"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: () => {
				setStamp(Date.now());
				setTick((t) => t + 1);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh"]
		})] }),
		children: [
			settings?.paused && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-500",
				children: [
					"AI automation is paused",
					settings.pause_reason ? ` — ${settings.pause_reason}` : "",
					". Resume it in Enterprise Systems → Detection network."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Cameras in area",
					value: filtered.length,
					icon: Camera
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Reporting",
					value: online,
					tone: online ? "good" : "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Pending review",
					value: suggestions.length,
					icon: Sparkles,
					tone: suggestions.length ? "warn" : "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Sweeps",
					value: settings?.sweep_enabled ? `Every ${settings.sweep_interval_hours}h` : "Manual",
					hint: sweep?.last_run_at ? `Last suggestion ${relTime(sweep.last_run_at)}` : "No sweeps yet"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanPanel, {
					cameras: filtered,
					scope: area?.address ? `nearest first from ${area.address}` : "response area",
					disabled: settings?.paused || running,
					onChanged: () => setTick((t) => t + 1)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							variant: view === "wall" ? "primary" : "default",
							onClick: () => setView("wall"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "h-3.5 w-3.5" }), " Camera wall"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							variant: view === "queue" ? "primary" : "default",
							onClick: () => setView("queue"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-3.5 w-3.5" }),
								" Review queue",
								suggestions.length ? ` (${suggestions.length})` : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: onlyPriority ? "primary" : "default",
						onClick: () => setOnlyPriority((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5" }), " Priority only"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-[220px] flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
							q,
							setQ,
							placeholder: "Search cameras, counties…"
						})
					})
				]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : view === "wall" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				title: `Live frames (${wall.length})`,
				hint: "Click a tile for the full frame, PTZ and a single-camera sweep",
				children: wall.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No camera frames inside the response area." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
					children: wall.map((c) => {
						const st = getStatus(c);
						const pri = (prefs[c.site.id]?.priority ?? 0) > 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setDetail(c),
							className: "group relative overflow-hidden rounded-md border border-border text-left transition hover:border-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: frameUrl(c) ?? "",
									alt: `Latest frame from ${c.name}`,
									loading: "lazy",
									className: "h-32 w-full bg-muted object-cover transition group-hover:scale-[1.02]"
								}),
								pri && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "absolute left-2 top-2 h-3.5 w-3.5 fill-amber-400 text-amber-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-2 top-2 h-2 w-2 rounded-full",
									style: { background: st.color }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[11px] font-medium text-white",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate font-mono text-[10px] text-white/70",
										children: [
											c.site.county ?? "—",
											" · ",
											relTime(c.image.time) ?? "no frame"
										]
									})]
								})
							]
						}, c.site.id);
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4",
				pad: false,
				title: `Review queue (${suggestions.length})`,
				hint: "AI first pass — a human decides",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[72vh] divide-y divide-border overflow-y-auto",
					children: [suggestions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing waiting. Run a sweep to screen the latest frames." }), suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 p-3",
						children: [s.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.image_url,
							alt: `Frame from ${s.camera_name ?? "camera"}`,
							loading: "lazy",
							className: "h-24 w-36 flex-none rounded-md border border-border object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 w-36 flex-none rounded-md border border-border bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: s.label === "fire" ? "risk" : "warn",
											children: s.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [Math.round(s.confidence), "% confidence"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-auto text-[11px] text-muted-foreground",
											children: relTime(s.created_at)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 truncate text-sm font-medium",
									children: s.camera_name ?? "Unknown camera"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-xs text-muted-foreground",
									children: s.reasoning ?? "No reasoning recorded."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
											variant: "primary",
											onClick: async () => {
												await promoteSuggestion(s);
												setTick((t) => t + 1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Open incident"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
											onClick: async () => {
												await markFalsePositive(s.id);
												setTick((t) => t + 1);
											},
											children: "False positive"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
											variant: "ghost",
											onClick: async () => {
												await dismissSuggestion(s.id);
												setTick((t) => t + 1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), " Dismiss"]
										}),
										s.camera_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
											variant: "ghost",
											onClick: async () => {
												await muteCamera(s.camera_id, s.camera_name, 24);
												setTick((t) => t + 1);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "h-3.5 w-3.5" }), " Mute 24h"]
										})
									]
								})
							]
						})]
					}, s.id))]
				})
			}),
			detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				wide: true,
				title: detail.name,
				onClose: () => setDetail(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: frameUrl(detail) ?? "",
						alt: `Full frame from ${detail.name}`,
						className: "max-h-[55vh] w-full rounded-md border border-border bg-muted object-contain"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2 text-xs sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Status",
								value: getStatus(detail).label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Frame age",
								value: relTime(detail.image.time) ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Coordinates",
								value: `${Number(detail.site.latitude).toFixed(3)}, ${Number(detail.site.longitude).toFixed(3)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "County / state",
								value: `${detail.site.county ?? "—"}, ${detail.site.state ?? "—"}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Pan",
								value: detail.position.pan ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Tilt",
								value: detail.position.tilt ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Zoom",
								value: detail.position.zoom ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
								label: "Priority",
								value: (prefs[detail.site.id]?.priority ?? 0) > 0 ? "Priority" : "Standard"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2 border-t border-border pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								variant: "primary",
								disabled: running || settings?.paused,
								onClick: () => doSweep([detail], detail.name),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Sweep this camera"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								onClick: () => togglePriority(detail),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5" }),
									" ",
									(prefs[detail.site.id]?.priority ?? 0) > 0 ? "Remove priority" : "Mark priority"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								variant: "ghost",
								onClick: async () => {
									await muteCamera(detail.site.id, detail.name, 24);
									setDetail(null);
									setTick((t) => t + 1);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "h-3.5 w-3.5" }), " Mute 24h"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								variant: "ghost",
								onClick: () => setStamp(Date.now()),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Refresh frame"]
							})
						]
					})
				]
			})
		]
	});
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 truncate font-medium",
			children: value
		})]
	});
}
//#endregion
export { CamerasPage as component };
