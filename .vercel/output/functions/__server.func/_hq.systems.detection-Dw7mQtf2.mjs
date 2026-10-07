import { i as __toESM } from "./_runtime.mjs";
import { m as require_react } from "./_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "./_libs/@react-three/drei+[...].mjs";
import { Jn as Cpu, Z as Save, _r as Camera, ar as CirclePause, cn as History, ir as CirclePlay, it as Radio, q as Search, st as Plus, ut as Plane, zt as MapPin } from "./_libs/lucide-react.mjs";
import { a as saveResponseArea, f as fetchCameras, i as inArea, n as fetchResponseArea, p as getStatus } from "./_ssr/router-rvM-za4Z.mjs";
import { C as statusTone, D as useRows, c as NewButton, d as Select, f as Stat, h as WorkPage, i as Empty, l as Pill, m as Toolbar, n as Btn, o as Loading, p as StatRow, r as Card, u as RecordDialog, v as dt } from "./_ssr/kit-CsnUfINY.mjs";
import { a as saveCameraPref, i as fetchSweepRuns, n as fetchCameraPrefs, o as saveSettings, r as fetchSettings, t as AI_MODELS } from "./_ssr/settings-DsyUupEe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_hq.systems.detection-Dw7mQtf2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Geocode an address. Tries Nominatim, then Photon (Komoot) as a fallback. */
async function geocode(query) {
	const q = query.trim();
	if (!q) return null;
	const variants = [q, /,\s*USA?$/i.test(q) ? q : `${q}, USA`];
	for (const v of variants) try {
		const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(v)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (res.ok) {
			const data = await res.json();
			if (data?.length) return {
				display_name: data[0].display_name,
				lat: parseFloat(data[0].lat),
				lng: parseFloat(data[0].lon)
			};
		}
	} catch {}
	for (const v of variants) try {
		const url = `https://photon.komoot.io/api/?limit=1&q=${encodeURIComponent(v)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (res.ok) {
			const f = (await res.json())?.features?.[0];
			if (f?.geometry?.coordinates) {
				const [lng, lat] = f.geometry.coordinates;
				return {
					display_name: [
						f.properties?.name,
						f.properties?.city,
						f.properties?.state,
						f.properties?.country
					].filter(Boolean).join(", ") || v,
					lat,
					lng
				};
			}
		}
	} catch {}
	return null;
}
/** Type-ahead suggestions for an address search box (Photon first, Nominatim fallback). */
async function geocodeSuggest(query, limit = 6) {
	const q = query.trim();
	if (q.length < 3) return [];
	const norm = (name, lat, lng) => ({
		display_name: name,
		short: name,
		lat,
		lng
	});
	try {
		const url = `https://photon.komoot.io/api/?limit=${limit}&lang=en&q=${encodeURIComponent(q)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (res.ok) {
			const data = await res.json();
			const out = [];
			for (const f of data?.features ?? []) {
				const c = f?.geometry?.coordinates;
				if (!c) continue;
				const p = f.properties ?? {};
				const line = [
					[p.housenumber, p.street].filter(Boolean).join(" ") || p.name,
					p.city || p.county,
					p.state,
					p.postcode,
					p.countrycode === "US" ? "USA" : p.country
				].filter(Boolean).join(", ");
				out.push(norm(line, c[1], c[0]));
			}
			if (out.length) return out;
		}
	} catch {}
	try {
		const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=${limit}&countrycodes=us&q=${encodeURIComponent(q)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (res.ok) return (await res.json()).map((d) => norm(d.display_name, parseFloat(d.lat), parseFloat(d.lon)));
	} catch {}
	return [];
}
var TABS = [
	{
		key: "ai",
		label: "Response area & AI",
		icon: Cpu
	},
	{
		key: "cameras",
		label: "Camera network",
		icon: Camera
	},
	{
		key: "fleet",
		label: "Bases, airframes & drones",
		icon: Plane
	},
	{
		key: "dispatch",
		label: "Dispatch & alerts",
		icon: Radio
	}
];
function DetectionSettings() {
	const [tab, setTab] = (0, import_react.useState)("ai");
	const [s, setS] = (0, import_react.useState)(null);
	const [area, setArea] = (0, import_react.useState)(null);
	const [runs, setRuns] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [a, b, c] = await Promise.all([
				fetchSettings().catch(() => null),
				fetchResponseArea().catch(() => null),
				fetchSweepRuns().catch(() => [])
			]);
			setS(a);
			setArea(b);
			setRuns(c);
		})();
	}, []);
	const persist = async (patch, areaPatch) => {
		setSaving(true);
		try {
			if (Object.keys(patch).length) await saveSettings(patch);
			if (areaPatch && Object.keys(areaPatch).length) await saveResponseArea(areaPatch);
			setMsg("Saved");
			setTimeout(() => setMsg(null), 2e3);
		} catch (e) {
			setMsg(e.message);
		} finally {
			setSaving(false);
		}
	};
	if (!s) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkPage, {
		eyebrow: "Enterprise systems",
		title: "Detection network",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkPage, {
		wide: true,
		eyebrow: "Enterprise systems",
		title: "Detection network settings",
		lede: "The control panel behind the camera network: where we watch, how the AI screens frames, how often it sweeps, and the rules dispatch has to satisfy.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			variant: s.paused ? "primary" : "default",
			onClick: async () => {
				const next = !s.paused;
				setS({
					...s,
					paused: next
				});
				await persist({
					paused: next,
					pause_reason: next ? "Paused by operator" : null
				});
			},
			children: s.paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-3.5 w-3.5" }), " Resume automation"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-3.5 w-3.5" }), " Pause automation"] })
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Scheduled sweeps",
					value: s.sweep_enabled ? fmtEvery(s.sweep_interval_minutes ?? (s.sweep_interval_hours || 1) * 60) : "Off",
					icon: History,
					tone: s.sweep_enabled ? "good" : "default",
					hint: s.sweep_enabled ? `High risk ${fmtEvery(s.high_risk_interval_minutes ?? 15)}` : void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Last sweep",
					value: s.last_sweep_at ? dt(s.last_sweep_at) : "Never"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Automation",
					value: s.paused ? "Paused" : "Active",
					tone: s.paused ? "risk" : "good",
					hint: s.pause_reason ?? void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Service area",
					value: area ? area.mode === "region" ? `${(area.states ?? []).length + (area.counties ?? []).length} regions` : `${Math.round(Number(area.radius_mi))} mi radius` : "—",
					icon: MapPin,
					hint: area?.mode === "region" ? [...area.counties ?? [], ...area.states ?? []].join(", ") || void 0 : area?.address ?? void 0
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-1.5 border-b border-border pb-2",
				children: [TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(t.key),
					className: `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-3.5 w-3.5" }),
						" ",
						t.label
					]
				}, t.key)), msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto self-center text-xs text-muted-foreground",
					children: msg
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					tab === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiTab, {
						s,
						setS,
						area,
						setArea,
						persist,
						saving,
						runs
					}),
					tab === "cameras" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CamerasTab, { area }),
					tab === "fleet" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FleetTab, {}),
					tab === "dispatch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DispatchTab, {
						s,
						setS,
						persist,
						saving
					})
				]
			})
		]
	});
}
function Row({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-start justify-between gap-4 border-b border-border py-3 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm font-medium",
				children: label
			}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-xs text-muted-foreground",
				children: hint
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex-none",
			children
		})]
	});
}
function Num({ value, onChange, suffix, width = "w-24" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: `${width} rounded border border-border bg-background px-2 py-1 text-sm tabular-nums`
		}), suffix && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: suffix
		})]
	});
}
function Toggle({ on, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => onChange(!on),
		"aria-pressed": on,
		className: `h-6 w-11 rounded-full border transition ${on ? "border-primary bg-primary/80" : "border-border bg-muted"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block h-5 w-5 rounded-full bg-background transition ${on ? "translate-x-5" : "translate-x-0.5"}` })
	});
}
function Chips({ items, onRemove }) {
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground",
		children: "None yet — the whole network stays out of scope until you add one."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: items.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onRemove(v),
			className: "rounded-full border border-border px-2.5 py-1 text-xs hover:border-destructive hover:text-destructive",
			children: [v, " ×"]
		}, v))
	});
}
function ChipInput({ placeholder, onAdd }) {
	const [v, setV] = (0, import_react.useState)("");
	const commit = () => {
		const t = v.trim();
		if (t) {
			onAdd(t);
			setV("");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: v,
			onChange: (e) => setV(e.target.value),
			onKeyDown: (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					commit();
				}
			},
			placeholder,
			className: "flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: commit,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add"]
		})]
	});
}
function AreaCard({ area, setArea, persist, saving }) {
	const [geo, setGeo] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [cams, setCams] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetchCameras().then(setCams).catch(() => setCams([]));
	}, []);
	if (!area) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Response area",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {})
	});
	const mode = area.mode === "region" ? "region" : "address";
	const states = area.states ?? [];
	const counties = area.counties ?? [];
	const inScope = (cams ?? []).filter((c) => inArea(area, {
		lat: Number(c.site.latitude),
		lng: Number(c.site.longitude),
		state: c.site.state,
		county: c.site.county
	})).length;
	const lookup = async () => {
		if (!area.address?.trim()) return;
		setBusy(true);
		setGeo(null);
		try {
			const r = await geocode(area.address);
			if (!r) {
				setGeo("No match found — try a fuller address.");
				return;
			}
			setArea({
				...area,
				address: r.display_name,
				center_lat: r.lat,
				center_lng: r.lng
			});
			setGeo(`Matched: ${r.display_name}`);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Service area",
		hint: "The only ground we monitor. Cameras, hazards and sweeps outside it are ignored.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Area type",
				hint: "Address radius for a single customer site, or named regions for county/state contracts",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: mode,
					onChange: (v) => setArea({
						...area,
						mode: v
					}),
					options: [{
						value: "address",
						label: "Address + radius"
					}, {
						value: "region",
						label: "Specific counties / states"
					}],
					className: "w-56"
				})
			}),
			mode === "address" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Address or place",
					hint: "Start typing — pick a suggestion to set the centre point exactly",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressAutocomplete, {
						value: area.address ?? "",
						busy,
						onText: (v) => setArea({
							...area,
							address: v
						}),
						onPick: (sug) => {
							setArea({
								...area,
								address: sug.display_name,
								center_lat: sug.lat,
								center_lng: sug.lng
							});
							setGeo(`Matched: ${sug.display_name}`);
						},
						onLookup: lookup
					})
				}),
				geo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pb-2 text-xs text-muted-foreground",
					children: geo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Centre latitude",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						value: Number(area.center_lat ?? 0),
						onChange: (v) => setArea({
							...area,
							center_lat: v
						}),
						width: "w-32"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Centre longitude",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						value: Number(area.center_lng ?? 0),
						onChange: (v) => setArea({
							...area,
							center_lng: v
						}),
						width: "w-32"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Radius",
					hint: "0 means the whole camera network is in scope",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						value: Number(area.radius_mi ?? 0),
						onChange: (v) => setArea({
							...area,
							radius_mi: v
						}),
						suffix: "mi"
					})
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "States"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-muted-foreground",
						children: "Two-letter codes as the camera network reports them, e.g. CA."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chips, {
						items: states,
						onRemove: (v) => setArea({
							...area,
							states: states.filter((x) => x !== v)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipInput, {
						placeholder: "CA",
						onAdd: (v) => setArea({
							...area,
							states: Array.from(/* @__PURE__ */ new Set([...states, v.toUpperCase()]))
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Counties"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-muted-foreground",
						children: "Leave empty to cover every county in the listed states."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chips, {
						items: counties,
						onRemove: (v) => setArea({
							...area,
							counties: counties.filter((x) => x !== v)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipInput, {
						placeholder: "El Dorado",
						onAdd: (v) => setArea({
							...area,
							counties: Array.from(/* @__PURE__ */ new Set([...counties, v]))
						})
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
					variant: "primary",
					disabled: saving,
					onClick: () => persist({}, {
						mode: area.mode,
						address: area.address,
						center_lat: area.center_lat,
						center_lng: area.center_lng,
						radius_mi: area.radius_mi,
						states,
						counties
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " Save service area"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: cams === null ? "Counting cameras…" : `${inScope} of ${cams.length} cameras in scope`
				})]
			})
		]
	});
}
function AiTab({ s, setS, area, setArea, persist, saving, runs }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 xl:grid-cols-[1.2fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaCard, {
					area,
					setArea,
					persist,
					saving
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: "AI triage",
					hint: "How camera frames are screened before a human sees them",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Vision model",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: s.ai_model,
								onChange: (v) => setS({
									...s,
									ai_model: v
								}),
								options: AI_MODELS,
								className: "w-72"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Minimum confidence to open an incident",
							hint: "At or above this, a smoke/fire call opens an incident and pages on-call. Below it, the frame is logged only.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								value: s.min_confidence,
								onChange: (v) => setS({
									...s,
									min_confidence: v
								}),
								suffix: "%"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								variant: "primary",
								disabled: saving,
								onClick: () => persist({
									ai_model: s.ai_model,
									min_confidence: s.min_confidence
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " Save AI settings"]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: "Scheduled sweeps",
					hint: "Operators can always sweep manually from the camera console",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Run sweeps automatically",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								on: s.sweep_enabled,
								onChange: (v) => setS({
									...s,
									sweep_enabled: v
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Sweep every",
							hint: "The scheduler checks every few minutes and runs a sweep once this much time has passed",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interval, {
								minutes: s.sweep_interval_minutes ?? 60,
								onChange: (m) => setS({
									...s,
									sweep_interval_minutes: m,
									sweep_interval_hours: Math.max(1, Math.round(m / 60))
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "High-risk cameras sweep every",
							hint: "Cameras flagged high risk are re-checked on this faster cadence",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interval, {
								minutes: s.high_risk_interval_minutes ?? 15,
								onChange: (m) => setS({
									...s,
									high_risk_interval_minutes: m
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Cameras per run",
							hint: "Keeps AI spend and run time bounded (max 50)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								value: s.sweep_batch_size,
								onChange: (v) => setS({
									...s,
									sweep_batch_size: v
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Priority cameras only",
							hint: "Restrict scheduled sweeps to cameras flagged as priority",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								on: s.sweep_priority_only,
								onChange: (v) => setS({
									...s,
									sweep_priority_only: v
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								variant: "primary",
								disabled: saving,
								onClick: () => persist({
									sweep_enabled: s.sweep_enabled,
									sweep_interval_hours: s.sweep_interval_hours,
									sweep_interval_minutes: s.sweep_interval_minutes,
									high_risk_interval_minutes: s.high_risk_interval_minutes,
									sweep_batch_size: s.sweep_batch_size,
									sweep_priority_only: s.sweep_priority_only
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " Save schedule"]
							})
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			pad: false,
			title: "Sweep history",
			hint: "Manual and scheduled runs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[70vh] divide-y divide-border overflow-y-auto",
				children: [runs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No sweeps recorded yet." }), runs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: r.error_count ? "warn" : "good",
								children: r.trigger
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: dt(r.created_at)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								r.analyzed,
								" frames · ",
								r.created_count,
								" queued · ",
								r.error_count,
								" errors",
								r.duration_ms ? ` · ${(r.duration_ms / 1e3).toFixed(1)}s` : ""
							]
						}),
						r.first_error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 line-clamp-2 text-[11px] text-amber-500",
							children: r.first_error
						})
					]
				}, r.id))]
			})
		})]
	});
}
function CamerasTab({ area }) {
	const [cameras, setCameras] = (0, import_react.useState)([]);
	const [prefs, setPrefs] = (0, import_react.useState)({});
	const [muted, setMuted] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [c, p] = await Promise.all([fetchCameras().catch(() => []), fetchCameraPrefs().catch(() => ({}))]);
			setCameras(c);
			setPrefs(p);
			setLoading(false);
			const { supabase } = await import("./_ssr/client-B5YVWdzA.mjs").then((n) => n.t).then((n) => n.t);
			const { data } = await supabase.from("net_muted_cameras").select("*");
			setMuted(data ?? []);
		})();
	}, []);
	const list = (0, import_react.useMemo)(() => {
		const inside = cameras.filter((c) => inArea(area, {
			lat: Number(c.site.latitude),
			lng: Number(c.site.longitude),
			state: c.site.state,
			county: c.site.county
		}));
		const s = q.toLowerCase();
		return (s ? inside.filter((c) => `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s)) : inside).slice().sort((a, b) => (prefs[b.site.id]?.priority ?? 0) - (prefs[a.site.id]?.priority ?? 0)).slice(0, 300);
	}, [
		cameras,
		area,
		q,
		prefs
	]);
	const update = async (id, name, patch) => {
		const next = {
			...prefs[id] ?? {
				camera_id: id,
				camera_name: name,
				watch: true,
				priority: 0,
				high_risk: false,
				label: null,
				notes: null
			},
			camera_id: id,
			camera_name: name,
			...patch
		};
		setPrefs({
			...prefs,
			[id]: next
		});
		await saveCameraPref(next);
	};
	const watching = list.filter((c) => prefs[c.site.id]?.watch !== false).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Cameras in area",
					value: list.length,
					icon: Camera
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "On watch list",
					value: watching,
					tone: "good"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Priority flagged",
					value: Object.values(prefs).filter((p) => p.priority > 0).length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "High risk",
					value: Object.values(prefs).filter((p) => p.high_risk).length,
					tone: "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Muted",
					value: muted.length,
					tone: muted.length ? "warn" : "default"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {
				q,
				setQ,
				placeholder: "Search cameras, counties…"
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loading, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: "Watch list",
				hint: "Priority cameras are swept first; high-risk cameras are also re-swept on the faster cadence set under scheduled sweeps",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[62vh] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "sticky top-0 border-b border-border bg-muted/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Camera"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Label"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Priority"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "High risk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 text-right",
									children: "Watch"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No cameras match." })
							}) }), list.map((c) => {
								const p = prefs[c.site.id];
								const st = getStatus(c);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-accent/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "max-w-[240px] truncate px-4 py-2",
											children: c.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-2 text-xs text-muted-foreground",
											children: [
												c.site.county ?? "—",
												", ",
												c.site.state ?? "—"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-xs",
											style: { color: st.color },
											children: st.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												defaultValue: p?.label ?? "",
												placeholder: "—",
												onBlur: (e) => e.target.value !== (p?.label ?? "") && update(c.site.id, c.name, { label: e.target.value || null }),
												className: "w-32 rounded border border-border bg-background px-2 py-1 text-xs"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
												value: String(p?.priority ?? 0),
												className: "w-28",
												onChange: (v) => update(c.site.id, c.name, { priority: Number(v) }),
												options: [
													{
														value: "0",
														label: "Standard"
													},
													{
														value: "1",
														label: "Priority"
													},
													{
														value: "2",
														label: "Critical"
													}
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												on: !!p?.high_risk,
												onChange: (v) => update(c.site.id, c.name, { high_risk: v })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												on: p?.watch !== false,
												onChange: (v) => update(c.site.id, c.name, { watch: v })
											})
										})
									]
								}, c.site.id);
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: "Muted cameras",
				hint: "Muted cameras are skipped by every sweep until the mute expires",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [muted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing muted." }), muted.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-2.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate",
								children: m.camera_name ?? m.camera_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									m.reason ?? "—",
									" · until ",
									dt(m.muted_until)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: async () => {
								const { supabase } = await import("./_ssr/client-B5YVWdzA.mjs").then((n) => n.t).then((n) => n.t);
								await supabase.from("net_muted_cameras").delete().eq("camera_id", m.camera_id);
								setMuted(muted.filter((x) => x.camera_id !== m.camera_id));
							},
							children: "Unmute"
						})]
					}, m.camera_id))]
				})
			})
		]
	});
}
var baseFields = [
	{
		key: "code",
		label: "Code",
		type: "text",
		required: true,
		placeholder: "BASE-01"
	},
	{
		key: "name",
		label: "Base name",
		type: "text",
		required: true
	},
	{
		key: "lat",
		label: "Latitude",
		type: "number",
		required: true
	},
	{
		key: "lng",
		label: "Longitude",
		type: "number",
		required: true
	},
	{
		key: "city",
		label: "City",
		type: "text"
	},
	{
		key: "state",
		label: "State",
		type: "text"
	},
	{
		key: "hangar_capacity",
		label: "Hangar capacity",
		type: "number"
	}
];
var airframeFields = [
	{
		key: "model",
		label: "Model",
		type: "text",
		required: true
	},
	{
		key: "manufacturer",
		label: "Manufacturer",
		type: "text"
	},
	{
		key: "range_mi",
		label: "Range (mi)",
		type: "number"
	},
	{
		key: "cruise_speed_mph",
		label: "Cruise speed (mph)",
		type: "number"
	},
	{
		key: "retardant_capacity_l",
		label: "Retardant capacity (L)",
		type: "number"
	},
	{
		key: "endurance_min",
		label: "Endurance (min)",
		type: "number"
	}
];
function FleetTab() {
	const bases = useRows("net_bases", { order: {
		column: "name",
		ascending: true
	} });
	const airframes = useRows("net_airframes", { order: {
		column: "model",
		ascending: true
	} });
	const drones = useRows("net_drones", { order: {
		column: "tail_number",
		ascending: true
	} });
	const [open, setOpen] = (0, import_react.useState)(null);
	const droneFields = [
		{
			key: "tail_number",
			label: "Tail number",
			type: "text",
			required: true,
			placeholder: "N204CL"
		},
		{
			key: "airframe_id",
			label: "Airframe",
			type: "select",
			options: airframes.rows.map((a) => ({
				value: a.id,
				label: a.model
			}))
		},
		{
			key: "base_id",
			label: "Home base",
			type: "select",
			options: bases.rows.map((b) => ({
				value: b.id,
				label: `${b.code} — ${b.name}`
			}))
		},
		{
			key: "status",
			label: "Status",
			type: "select",
			options: [
				"ready",
				"preflight",
				"inflight",
				"returning",
				"charging",
				"maintenance",
				"offline"
			].map((v) => ({
				value: v,
				label: v
			}))
		},
		{
			key: "battery_pct",
			label: "Battery (%)",
			type: "number"
		},
		{
			key: "retardant_l",
			label: "Retardant on board (L)",
			type: "number"
		},
		{
			key: "next_service_at",
			label: "Next service",
			type: "date"
		},
		{
			key: "notes",
			label: "Notes",
			type: "textarea",
			full: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Bases",
						value: bases.rows.length,
						icon: MapPin
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Airframe types",
						value: airframes.rows.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Registered aircraft",
						value: drones.rows.length,
						icon: Plane
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: "Launch bases",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
						label: "Add base",
						onClick: () => setOpen("base")
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [bases.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No bases registered." }), bases.rows.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-2.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: [
									b.code,
									" — ",
									b.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: [
									Number(b.lat).toFixed(3),
									", ",
									Number(b.lng).toFixed(3),
									" · ",
									b.city ?? "—",
									", ",
									b.state ?? "—"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "ghost",
								onClick: () => bases.remove?.(b.id),
								children: "Remove"
							})]
						}, b.id))]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					pad: false,
					title: "Airframes",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
						label: "Add airframe",
						onClick: () => setOpen("airframe")
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [airframes.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No airframe types." }), airframes.rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-2.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: a.model
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									a.range_mi ?? "—",
									" mi · ",
									a.cruise_speed_mph ?? "—",
									" mph · ",
									a.retardant_capacity_l ?? "—",
									" L"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "ghost",
								onClick: () => airframes.remove?.(a.id),
								children: "Remove"
							})]
						}, a.id))]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				pad: false,
				title: "Registered aircraft",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewButton, {
					label: "Add aircraft",
					onClick: () => setOpen("drone")
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Tail"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Battery"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Retardant"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5",
									children: "Next service"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [drones.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "No aircraft registered." })
							}) }), drones.rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-accent/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 font-mono font-semibold",
										children: d.tail_number
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											tone: statusTone(d.status),
											children: d.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-2 tabular-nums",
										children: [d.battery_pct ?? "—", "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-2 tabular-nums",
										children: [d.retardant_l ?? "—", " L"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 text-xs text-muted-foreground",
										children: d.next_service_at ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
											variant: "ghost",
											onClick: () => drones.remove?.(d.id),
											children: "Remove"
										})
									})
								]
							}, d.id))]
						})]
					})
				})
			}),
			open === "base" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Add launch base",
				fields: baseFields,
				people: [],
				initial: {},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await bases.insert(v);
					setOpen(null);
				}
			}),
			open === "airframe" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Add airframe",
				fields: airframeFields,
				people: [],
				initial: {},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await airframes.insert(v);
					setOpen(null);
				}
			}),
			open === "drone" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
				title: "Register aircraft",
				fields: droneFields,
				people: [],
				initial: {
					status: "ready",
					battery_pct: 100
				},
				onCancel: () => setOpen(null),
				onSave: async (v) => {
					await drones.insert(v);
					setOpen(null);
				}
			})
		]
	});
}
function DispatchTab({ s, setS, persist, saving }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Dispatch rules",
			hint: "Applied when ranking aircraft for an incident",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Minimum battery to launch",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						value: s.dispatch_min_battery,
						onChange: (v) => setS({
							...s,
							dispatch_min_battery: v
						}),
						suffix: "%"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Maximum response distance",
					hint: "Aircraft farther than this are shown but not launchable",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						value: Number(s.dispatch_max_range_mi),
						onChange: (v) => setS({
							...s,
							dispatch_max_range_mi: v
						}),
						suffix: "mi"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "primary",
						disabled: saving,
						onClick: () => persist({
							dispatch_min_battery: s.dispatch_min_battery,
							dispatch_max_range_mi: s.dispatch_max_range_mi
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " Save dispatch rules"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Alerting",
			hint: "Who hears about what, and when",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Notify managers on new AI suggestion",
					hint: "Noisy on busy days — off by default",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: s.notify_on_suggestion,
						onChange: (v) => setS({
							...s,
							notify_on_suggestion: v
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Notify managers on new incident",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: s.notify_on_incident,
						onChange: (v) => setS({
							...s,
							notify_on_incident: v
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "primary",
						disabled: saving,
						onClick: () => persist({
							notify_on_suggestion: s.notify_on_suggestion,
							notify_on_incident: s.notify_on_incident
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), " Save alerting"]
					})
				})
			]
		})]
	});
}
/** Type-ahead address field: debounced suggestions with an exact-format dropdown. */
function AddressAutocomplete({ value, busy, onText, onPick, onLookup }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [hi, setHi] = (0, import_react.useState)(0);
	const typed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!typed.current) return;
		const q = value.trim();
		if (q.length < 3) {
			setItems([]);
			return;
		}
		setLoading(true);
		const t = setTimeout(async () => {
			try {
				const res = await geocodeSuggest(q);
				setItems(res);
				setOpen(res.length > 0);
				setHi(0);
			} finally {
				setLoading(false);
			}
		}, 280);
		return () => clearTimeout(t);
	}, [value]);
	const choose = (s) => {
		typed.current = false;
		onPick(s);
		setOpen(false);
		setItems([]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative flex gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value,
				onChange: (e) => {
					typed.current = true;
					onText(e.target.value);
				},
				onFocus: () => items.length && setOpen(true),
				onBlur: () => setTimeout(() => setOpen(false), 150),
				onKeyDown: (e) => {
					if (!open || !items.length) {
						if (e.key === "Enter") {
							e.preventDefault();
							onLookup();
						}
						return;
					}
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setHi((h) => Math.min(h + 1, items.length - 1));
					} else if (e.key === "ArrowUp") {
						e.preventDefault();
						setHi((h) => Math.max(h - 1, 0));
					} else if (e.key === "Enter") {
						e.preventDefault();
						const pick = items[hi];
						if (pick) choose(pick);
					} else if (e.key === "Escape") setOpen(false);
				},
				className: "w-72 rounded border border-border bg-background px-2 py-1 text-sm",
				placeholder: "1200 K St, Sacramento, CA, 95814, USA",
				autoComplete: "off"
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "absolute left-0 top-full z-50 mt-1 max-h-64 w-[26rem] overflow-y-auto rounded-md border border-border bg-popover shadow-lg",
				children: items.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => choose(s),
					onMouseEnter: () => setHi(i),
					className: `flex w-full items-start gap-2 px-3 py-2 text-left text-xs ${i === hi ? "bg-accent" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-3.5 w-3.5 flex-none text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-medium",
							children: s.short
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block truncate text-[11px] text-muted-foreground",
							children: [
								s.lat.toFixed(4),
								", ",
								s.lng.toFixed(4)
							]
						})]
					})]
				}) }, `${s.lat},${s.lng},${i}`))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: onLookup,
			disabled: busy || loading,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" }),
				" ",
				busy || loading ? "Finding…" : "Find"
			]
		})]
	});
}
/** Interval field that lets an operator work in minutes or hours. */
function Interval({ minutes, onChange }) {
	const useHours = minutes >= 60 && minutes % 60 === 0;
	const [unit, setUnit] = (0, import_react.useState)(useHours ? "h" : "m");
	const shown = unit === "h" ? Math.max(1, Math.round(minutes / 60)) : Math.max(1, minutes);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			min: 1,
			value: shown,
			onChange: (e) => {
				const n = Math.max(1, Number(e.target.value) || 1);
				onChange(unit === "h" ? n * 60 : n);
			},
			className: "w-20 rounded border border-border bg-background px-2 py-1 text-sm tabular-nums"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
			value: unit,
			className: "w-28",
			onChange: (v) => {
				const u = v;
				setUnit(u);
				onChange(u === "h" ? Math.max(60, Math.round(minutes / 60) * 60) : minutes);
			},
			options: [{
				value: "m",
				label: "minutes"
			}, {
				value: "h",
				label: "hours"
			}]
		})]
	});
}
function fmtEvery(minutes) {
	const m = Math.max(1, Math.round(minutes));
	if (m % 60 === 0) return `Every ${m / 60}h`;
	if (m > 60) return `Every ${Math.floor(m / 60)}h ${m % 60}m`;
	return `Every ${m}m`;
}
//#endregion
export { DetectionSettings as component };
