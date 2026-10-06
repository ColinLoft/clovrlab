//#region node_modules/.nitro/vite/services/ssr/assets/sweep.server-CfzOSjhm.js
var SYSTEM = `You are a wildfire detection analyst examining a wildfire watch camera frame.
Reply ONLY with strict JSON of shape: {"label":"fire"|"smoke"|"clear","confidence":0-100,"reasoning":"one short sentence"}.
- "fire": visible active flames or active fire glow.
- "smoke": visible smoke plume rising from terrain (not clouds, not fog, not haze on horizon).
- "clear": no signs of smoke or fire.
Be conservative: prefer "clear" unless you can point to specific visual evidence. Cloud cover, fog banks, sun glare, and lens artifacts are NOT smoke.`;
var GatewayBlocked = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
/** Camera hosts often block model-side fetching, so inline the frame as a data URL. */
async function toDataUrl(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`frame fetch ${res.status}`);
	const type = res.headers.get("content-type") || "image/jpeg";
	const buf = new Uint8Array(await res.arrayBuffer());
	let binary = "";
	for (let i = 0; i < buf.length; i += 32768) binary += String.fromCharCode(...buf.subarray(i, i + 32768));
	return `data:${type};base64,${btoa(binary)}`;
}
async function analyzeOne(input, apiKey, model) {
	const inlineImage = await toDataUrl(input.image_url);
	const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages: [{
				role: "system",
				content: SYSTEM
			}, {
				role: "user",
				content: [{
					type: "text",
					text: `Camera ${input.camera_name} at ${input.lat.toFixed(3)}, ${input.lng.toFixed(3)}. Analyze for smoke or fire.`
				}, {
					type: "image_url",
					image_url: { url: inlineImage }
				}]
			}],
			response_format: { type: "json_object" }
		})
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		if (res.status === 402 || res.status === 403) throw new GatewayBlocked(res.status, res.status === 402 ? "AI credits exhausted" : "AI access blocked by workspace policy");
		throw new Error(`AI ${res.status}: ${text.slice(0, 200)}`);
	}
	const raw = (await res.json())?.choices?.[0]?.message?.content ?? "{}";
	let parsed = {};
	try {
		parsed = JSON.parse(raw);
	} catch {
		parsed = {};
	}
	return {
		label: [
			"fire",
			"smoke",
			"clear"
		].includes(parsed.label) ? parsed.label : "clear",
		confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
		reasoning: String(parsed.reasoning ?? "").slice(0, 240)
	};
}
/**
* Analyse a bounded batch of camera frames and queue suggestions.
* Every flagged frame is turned into an incident by the database trigger on
* net_suggestions, so this function only records verdicts and the sweep audit
* trail (net_sweep_runs + net_detection_events).
*/
async function runSweep(supabase, cameras, apiKey, opts) {
	const started = Date.now();
	const errors = [];
	const results = [];
	let created = 0;
	let analyzed = 0;
	let blocked = null;
	const { data: runRow } = await supabase.from("net_sweep_runs").insert({
		trigger: opts.trigger,
		analyzed: 0,
		created_count: 0,
		error_count: 0
	}).select("id").single();
	const runId = runRow?.id ?? null;
	const logEvent = async (row) => {
		try {
			await supabase.from("net_detection_events").insert({
				sweep_run_id: runId,
				trigger: opts.trigger,
				...row
			});
		} catch {}
	};
	await logEvent({
		kind: "sweep_start",
		message: `${opts.trigger === "manual" ? "Manual" : "Scheduled"} sweep started across ${cameras.length} camera${cameras.length === 1 ? "" : "s"}`,
		detail: {
			model: opts.model,
			min_confidence: opts.minConfidence,
			cameras: cameras.length
		}
	});
	const BATCH = 5;
	for (let i = 0; i < cameras.length && !blocked; i += BATCH) {
		const chunk = cameras.slice(i, i + BATCH);
		(await Promise.allSettled(chunk.map(async (cam) => {
			const result = await analyzeOne(cam, apiKey, opts.model);
			analyzed++;
			let queued = false;
			if (result.label !== "clear" && result.confidence >= opts.minConfidence) {
				const { data: row, error } = await supabase.from("net_suggestions").insert({
					source: "camera",
					camera_id: cam.camera_id,
					camera_name: cam.camera_name,
					lat: cam.lat,
					lng: cam.lng,
					state: cam.state ?? null,
					county: cam.county ?? null,
					image_url: cam.image_url,
					image_time: cam.image_time,
					label: result.label,
					confidence: result.confidence,
					reasoning: result.reasoning,
					status: "pending"
				}).select("id").single();
				if (error) {
					if (!String(error.message).toLowerCase().includes("duplicate")) errors.push(`${cam.camera_id}: ${error.message}`);
				} else if (row) {
					created++;
					queued = true;
				}
			} else await logEvent({
				kind: "verdict",
				camera_id: cam.camera_id,
				camera_name: cam.camera_name,
				label: result.label,
				confidence: result.confidence,
				message: result.reasoning,
				detail: { below_threshold: result.label !== "clear" }
			});
			results.push({
				camera_id: cam.camera_id,
				camera_name: cam.camera_name,
				lat: cam.lat,
				lng: cam.lng,
				image_url: cam.image_url,
				label: result.label,
				confidence: result.confidence,
				reasoning: result.reasoning,
				queued
			});
		}))).forEach((s, idx) => {
			if (s.status === "rejected") {
				const cam = chunk[idx];
				if (s.reason instanceof GatewayBlocked) blocked = s.reason;
				errors.push(`${cam.camera_id}: ${s.reason?.message ?? "failed"}`);
				results.push({
					camera_id: cam.camera_id,
					camera_name: cam.camera_name,
					lat: cam.lat,
					lng: cam.lng,
					image_url: cam.image_url,
					label: "clear",
					confidence: 0,
					reasoning: "Analysis failed",
					queued: false,
					error: String(s.reason?.message ?? "failed")
				});
			}
		});
	}
	const duration = Date.now() - started;
	if (runId) await supabase.from("net_sweep_runs").update({
		analyzed,
		created_count: created,
		error_count: errors.length,
		first_error: errors[0] ?? null,
		duration_ms: duration
	}).eq("id", runId);
	await logEvent({
		kind: blocked ? "sweep_blocked" : "sweep_end",
		message: blocked ? `Sweep halted: ${blocked.message}` : `Sweep finished — ${analyzed} frame${analyzed === 1 ? "" : "s"} screened, ${created} flagged, ${errors.length} error${errors.length === 1 ? "" : "s"}`,
		detail: {
			analyzed,
			created,
			errors: errors.slice(0, 3),
			duration_ms: duration
		}
	});
	return {
		created,
		analyzed,
		errors: errors.slice(0, 5),
		results,
		runId,
		blocked
	};
}
//#endregion
export { runSweep };
