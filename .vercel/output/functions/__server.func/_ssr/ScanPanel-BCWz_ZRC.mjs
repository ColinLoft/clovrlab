import { i as __toESM } from "../_runtime.mjs";
import { m as require_react } from "../_libs/@react-leaflet/core+[...].mjs";
import { u as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { r as createServerFn } from "./server-BrzklweG.mjs";
import { n as supabase } from "./client-B7QlDyqv.mjs";
import { n as logDetectionEvent } from "./detection-log-CqQUb7rh.mjs";
import { N as Sparkles, On as Flame, Qn as CloudFog, cr as CircleCheck, j as Square, nr as CircleX, v as TriangleAlert } from "../_libs/lucide-react.mjs";
import { m as relTime } from "./router-D9VViihH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DX9VUQiX.mjs";
import { f as Stat, i as Empty, l as Pill, n as Btn, p as StatRow, r as Card } from "./kit-L_nfYwfF.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bv0AGlpV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ScanPanel-BCWz_ZRC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sweepCameras = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => {
	if (!Array.isArray(d?.cameras)) throw new Error("cameras required");
	return { cameras: d.cameras.slice(0, 50) };
}).handler(createSsrRpc("4e163c8816466324e5b525c314ffbceedc176570271d90794a81fb2ef7c9b92e"));
var EMPTY = {
	total: 0,
	done: 0,
	analyzed: 0,
	fire: 0,
	smoke: 0,
	clear: 0,
	queued: 0,
	errors: [],
	startedAt: null,
	finishedAt: null,
	paused: false
};
var CHUNK = 3;
function toCameraInput(c) {
	return {
		camera_id: c.site.id,
		camera_name: c.name,
		lat: Number(c.site.latitude),
		lng: Number(c.site.longitude),
		state: c.site.state,
		county: c.site.county,
		image_url: c.image.url,
		image_time: c.image.time ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
/**
* Runs a manual AI check across a set of cameras in small chunks so the
* operator sees live progress, per-frame verdicts and running stats instead of
* one long silent request.
*/
function useAiScan() {
	const [stats, setStats] = (0, import_react.useState)(EMPTY);
	const [results, setResults] = (0, import_react.useState)([]);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [current, setCurrent] = (0, import_react.useState)(null);
	const cancelled = (0, import_react.useRef)(false);
	const cancel = (0, import_react.useCallback)(() => {
		cancelled.current = true;
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		setStats(EMPTY);
		setResults([]);
		setCurrent(null);
	}, []);
	return {
		stats,
		results,
		running,
		current,
		start: (0, import_react.useCallback)(async (cameras, max = 40) => {
			const batch = cameras.filter((c) => c.image.url).slice(0, max);
			if (!batch.length) return {
				ok: false,
				message: "No camera frames available to analyse."
			};
			cancelled.current = false;
			setRunning(true);
			setResults([]);
			setStats({
				...EMPTY,
				total: batch.length,
				startedAt: Date.now()
			});
			for (let i = 0; i < batch.length; i += CHUNK) {
				if (cancelled.current) break;
				const chunk = batch.slice(i, i + CHUNK);
				setCurrent(chunk.map((c) => c.name).join(", "));
				try {
					const res = await sweepCameras({ data: { cameras: chunk.map(toCameraInput) } });
					const items = res?.results ?? [];
					setResults((prev) => [...items, ...prev]);
					setStats((s) => ({
						...s,
						done: s.done + chunk.length,
						analyzed: s.analyzed + Number(res?.analyzed ?? items.length),
						queued: s.queued + Number(res?.created ?? 0),
						fire: s.fire + items.filter((r) => r.label === "fire").length,
						smoke: s.smoke + items.filter((r) => r.label === "smoke").length,
						clear: s.clear + items.filter((r) => r.label === "clear").length,
						errors: [...s.errors, ...res?.errors ?? []].slice(0, 8),
						paused: s.paused || Boolean(res?.paused)
					}));
					if (res?.paused) break;
				} catch (e) {
					setStats((s) => ({
						...s,
						done: s.done + chunk.length,
						errors: [...s.errors, e.message].slice(0, 8)
					}));
				}
			}
			setCurrent(null);
			setRunning(false);
			setStats((s) => ({
				...s,
				finishedAt: Date.now()
			}));
			return { ok: true };
		}, []),
		cancel,
		reset
	};
}
async function fetchPendingSuggestions() {
	const { data, error } = await supabase.from("net_suggestions").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(50);
	if (error) throw error;
	return data ?? [];
}
async function fetchSweepStatus() {
	const sinceWindow = (/* @__PURE__ */ new Date(Date.now() - 12e4)).toISOString();
	const since24h = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString();
	const [{ data: latest }, { count: winCount }, { count: pending }, { count: total24 }] = await Promise.all([
		supabase.from("net_suggestions").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
		supabase.from("net_suggestions").select("*", {
			count: "exact",
			head: true
		}).gte("created_at", sinceWindow),
		supabase.from("net_suggestions").select("*", {
			count: "exact",
			head: true
		}).eq("status", "pending"),
		supabase.from("net_suggestions").select("*", {
			count: "exact",
			head: true
		}).gte("created_at", since24h)
	]);
	return {
		last_run_at: latest?.created_at ?? null,
		last_window_count: winCount ?? 0,
		pending_in_area: pending ?? 0,
		total_24h: total24 ?? 0
	};
}
/** Mark a suggestion as a false positive (improves future sweeps for that camera via health-tracking). */
async function markFalsePositive(id) {
	await dismissSuggestion(id, "Marked a false positive by an operator");
}
async function dismissSuggestion(id, note = "Dismissed by an operator") {
	const { data, error } = await supabase.from("net_suggestions").update({
		status: "dismissed",
		resolved_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", id).select("*").maybeSingle();
	if (error) throw error;
	const s = data;
	await logDetectionEvent({
		kind: "dismissed",
		suggestion_id: id,
		camera_id: s?.camera_id ?? null,
		camera_name: s?.camera_name ?? null,
		label: s?.label ?? null,
		confidence: s?.confidence ?? null,
		message: note
	});
}
async function muteCamera(camera_id, camera_name, hours = 24, reason = "False positive") {
	const muted_until = new Date(Date.now() + hours * 36e5).toISOString();
	const { error } = await supabase.from("net_muted_cameras").upsert({
		camera_id,
		camera_name,
		reason,
		muted_until
	}, { onConflict: "camera_id" });
	if (error) throw error;
	await supabase.from("net_suggestions").update({
		status: "dismissed",
		resolved_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("camera_id", camera_id).eq("status", "pending");
	await logDetectionEvent({
		kind: "muted",
		camera_id,
		camera_name,
		message: `Camera muted for ${hours}h — ${reason}`
	});
}
async function promoteSuggestion(s) {
	const priority = s.label === "fire" ? s.confidence >= 80 ? "p1" : "p2" : "p3";
	const { data: inc, error: e1 } = await supabase.from("net_incidents").insert({
		title: `${s.label === "fire" ? "Fire" : "Smoke"} – ${s.camera_name ?? "Camera"}`,
		source: "alertwest",
		status: "new",
		priority,
		confidence: s.confidence,
		lat: s.lat,
		lng: s.lng,
		state: s.state,
		county: s.county,
		external_id: s.id,
		notes: s.reasoning ?? null
	}).select("id").single();
	if (e1) throw e1;
	await supabase.from("net_suggestions").update({
		status: "promoted",
		incident_id: inc.id,
		resolved_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", s.id);
	await supabase.from("net_incident_events").insert({
		incident_id: inc.id,
		event_type: "created",
		message: `Confirmed by an operator from AI camera detection (${s.label}, ${s.confidence}%)`
	});
	await logDetectionEvent({
		kind: "confirmed",
		suggestion_id: s.id,
		incident_id: inc.id,
		camera_id: s.camera_id,
		camera_name: s.camera_name,
		label: s.label,
		confidence: s.confidence,
		message: "Operator confirmed the detection and opened an incident"
	});
	return inc.id;
}
/**
* Manual AI check with live progress. Anything the model flags as fire or
* smoke surfaces here as an alert the operator must confirm or reject — a
* confirmation opens an incident, which pages the on-call rotation.
*/
function ScanPanel({ cameras, scope, onChanged, disabled }) {
	const { stats, results, running, current, start, cancel, reset } = useAiScan();
	const [alerts, setAlerts] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const scanned = new Set(results.map((r) => r.camera_id));
	const refreshAlerts = () => fetchPendingSuggestions().then((rows) => setAlerts(rows.filter((r) => r.camera_id && scanned.has(r.camera_id)))).catch(() => {});
	(0, import_react.useEffect)(() => {
		if (!running && stats.finishedAt) refreshAlerts();
	}, [running, stats.finishedAt]);
	const pct = stats.total ? Math.round(stats.done / stats.total * 100) : 0;
	const secs = stats.startedAt ? Math.round(((stats.finishedAt ?? Date.now()) - stats.startedAt) / 1e3) : 0;
	const act = async (s, confirm) => {
		setBusy(s.id);
		try {
			if (confirm) await promoteSuggestion(s);
			else await markFalsePositive(s.id);
			setAlerts((a) => a.filter((x) => x.id !== s.id));
			onChanged?.();
		} catch (e) {
			alert(e.message);
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Manual AI check",
		hint: `${cameras.filter((c) => c.image.url).length} frames available · ${scope}`,
		action: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			onClick: cancel,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3.5 w-3.5" }), " Stop"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1.5",
			children: [stats.finishedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "ghost",
				onClick: reset,
				children: "Clear"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				variant: "primary",
				disabled,
				onClick: () => start(cameras),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Run AI check"]
			})]
		}),
		children: [
			(running || stats.finishedAt) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: running ? `Scanning ${current ?? "…"}` : `Scan complete in ${secs}s` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: [
								stats.done,
								"/",
								stats.total,
								" · ",
								pct,
								"%"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${pct}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Frames analysed",
						value: stats.analyzed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Fire signatures",
						value: stats.fire,
						icon: Flame,
						tone: stats.fire ? "risk" : "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Smoke signatures",
						value: stats.smoke,
						icon: CloudFog,
						tone: stats.smoke ? "warn" : "good"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Queued for review",
						value: stats.queued,
						tone: stats.queued ? "warn" : "good"
					})
				] }),
				stats.paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-500",
					children: "AI automation paused mid-scan. Resume it in Enterprise Systems → Detection network."
				}),
				stats.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive",
					children: [stats.errors[0], stats.errors.length > 1 ? ` (+${stats.errors.length - 1} more)` : ""]
				})
			] }),
			alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1.5 text-xs font-semibold text-destructive",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }),
						" ",
						alerts.length,
						" possible detection",
						alerts.length > 1 ? "s" : "",
						" need a human decision"
					]
				}), alerts.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 rounded-md border border-border bg-background p-2",
					children: [s.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.image_url,
						alt: `Frame from ${s.camera_name ?? "camera"}`,
						loading: "lazy",
						className: "h-20 w-32 flex-none rounded border border-border object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								className: "mt-0.5 truncate text-sm font-medium",
								children: s.camera_name ?? "Unknown camera"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2 text-xs text-muted-foreground",
								children: s.reasoning ?? "No reasoning recorded."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
									variant: "primary",
									disabled: busy === s.id,
									onClick: () => act(s, true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Confirm — open incident"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
									disabled: busy === s.id,
									onClick: () => act(s, false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), " Not a fire"]
								})]
							})
						]
					})]
				}, s.id))]
			}),
			!running && stats.finishedAt && alerts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Nothing suspicious in this sweep — every frame came back clear." }),
			!running && !stats.finishedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-5 text-muted-foreground",
				children: "Runs the detection model across the frames in view, in small batches, so you can watch verdicts land. Fire and smoke hits are held for your confirmation before an incident is opened."
			})
		]
	});
}
//#endregion
export { markFalsePositive as a, sweepCameras as c, fetchSweepStatus as i, dismissSuggestion as n, muteCamera as o, fetchPendingSuggestions as r, promoteSuggestion as s, ScanPanel as t };
