import type { SupabaseClient } from "@supabase/supabase-js";

export interface CameraInput {
  camera_id: string;
  camera_name: string;
  image_url: string;
  image_time: string;
  lat: number;
  lng: number;
  state?: string | null;
  county?: string | null;
}

export interface SweepResultItem {
  camera_id: string;
  camera_name: string;
  lat: number;
  lng: number;
  image_url: string;
  label: "fire" | "smoke" | "clear";
  confidence: number;
  reasoning: string;
  queued: boolean;
  error?: string;
}

const SYSTEM = `You are a wildfire detection analyst examining a wildfire watch camera frame.
Reply ONLY with strict JSON of shape: {"label":"fire"|"smoke"|"clear","confidence":0-100,"reasoning":"one short sentence"}.
- "fire": visible active flames or active fire glow.
- "smoke": visible smoke plume rising from terrain (not clouds, not fog, not haze on horizon).
- "clear": no signs of smoke or fire.
Be conservative: prefer "clear" unless you can point to specific visual evidence. Cloud cover, fog banks, sun glare, and lens artifacts are NOT smoke.`;

export class GatewayBlocked extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function analyzeOne(input: CameraInput, apiKey: string, model: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: `Camera ${input.camera_name} at ${input.lat.toFixed(3)}, ${input.lng.toFixed(3)}. Analyze for smoke or fire.` },
            { type: "image_url", image_url: { url: input.image_url } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 402 || res.status === 403) {
      throw new GatewayBlocked(res.status, res.status === 402 ? "AI credits exhausted" : "AI access blocked by workspace policy");
    }
    throw new Error(`AI ${res.status}: ${text.slice(0, 200)}`);
  }
  const j: any = await res.json();
  const raw = j?.choices?.[0]?.message?.content ?? "{}";
  let parsed: any = {};
  try { parsed = JSON.parse(raw); } catch { parsed = {}; }
  const label = ["fire", "smoke", "clear"].includes(parsed.label) ? parsed.label : "clear";
  const confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 0));
  return { label, confidence, reasoning: String(parsed.reasoning ?? "").slice(0, 240) };
}

export interface RunSweepOptions {
  minConfidence: number;
  model: string;
  autoPromote: boolean;
  autoPromoteConfidence: number;
  trigger: "manual" | "scheduled";
}

/** Analyse a bounded batch of camera frames and queue suggestions. Shared by manual + scheduled sweeps. */
export async function runSweep(
  supabase: SupabaseClient<any, any, any>,
  cameras: CameraInput[],
  apiKey: string,
  opts: RunSweepOptions,
) {
  const started = Date.now();
  const errors: string[] = [];
  const results: SweepResultItem[] = [];
  let created = 0;
  let analyzed = 0;
  let blocked: GatewayBlocked | null = null;

  const BATCH = 5;
  for (let i = 0; i < cameras.length && !blocked; i += BATCH) {
    const chunk = cameras.slice(i, i + BATCH);
    const settled = await Promise.allSettled(
      chunk.map(async (cam) => {
        const result = await analyzeOne(cam, apiKey, opts.model);
        analyzed++;
        let queued = false;
        if (result.label !== "clear" && result.confidence >= opts.minConfidence) {
          const { data: row, error } = await supabase
            .from("net_suggestions")
            .insert({
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
              status: "pending",
            })
            .select("id")
            .single();
          if (error) {
            if (!String(error.message).toLowerCase().includes("duplicate")) errors.push(`${cam.camera_id}: ${error.message}`);
          } else if (row) {
            created++;
            queued = true;
            if (opts.autoPromote && result.confidence >= opts.autoPromoteConfidence) {
              await promoteServerSide(supabase, {
                suggestion_id: row.id,
                label: result.label,
                confidence: result.confidence,
                camera_name: cam.camera_name,
                lat: cam.lat,
                lng: cam.lng,
                state: cam.state ?? null,
                county: cam.county ?? null,
                reasoning: result.reasoning,
              });
            }
          }
        }
        results.push({
          camera_id: cam.camera_id,
          camera_name: cam.camera_name,
          lat: cam.lat,
          lng: cam.lng,
          image_url: cam.image_url,
          label: result.label as SweepResultItem["label"],
          confidence: result.confidence,
          reasoning: result.reasoning,
          queued,
        });
      }),
    );
    settled.forEach((s, idx) => {
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
          error: String(s.reason?.message ?? "failed"),
        });
      }
    });
  }

  await supabase.from("net_sweep_runs").insert({
    trigger: opts.trigger,
    analyzed,
    created_count: created,
    error_count: errors.length,
    first_error: errors[0] ?? null,
    duration_ms: Date.now() - started,
  });

  return { created, analyzed, errors: errors.slice(0, 5), results, blocked: blocked as GatewayBlocked | null };
}

async function promoteServerSide(
  supabase: SupabaseClient<any, any, any>,
  s: {
    suggestion_id: string; label: string; confidence: number; camera_name: string;
    lat: number; lng: number; state: string | null; county: string | null; reasoning: string;
  },
) {
  const priority = s.label === "fire" ? (s.confidence >= 80 ? "p1" : "p2") : "p3";
  const { data: inc } = await supabase
    .from("net_incidents")
    .insert({
      title: `${s.label === "fire" ? "Fire" : "Smoke"} – ${s.camera_name}`,
      source: "alertwest",
      status: "new",
      priority,
      confidence: s.confidence,
      lat: s.lat,
      lng: s.lng,
      state: s.state,
      county: s.county,
      external_id: s.suggestion_id,
      notes: s.reasoning,
    })
    .select("id")
    .single();
  if (!inc) return;
  await supabase
    .from("net_suggestions")
    .update({ status: "promoted", incident_id: inc.id, resolved_at: new Date().toISOString() })
    .eq("id", s.suggestion_id);
  await supabase.from("net_incident_events").insert({
    incident_id: inc.id,
    event_type: "created",
    message: `Auto-promoted from AI camera detection (${s.label}, ${s.confidence}%)`,
  });
}
