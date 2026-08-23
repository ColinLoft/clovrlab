import { supabase } from "@/integrations/supabase/client";
import { logDetectionEvent } from "./detection-log";


export interface SuggestionRow {
  id: string;
  source: string;
  camera_id: string | null;
  camera_name: string | null;
  lat: number;
  lng: number;
  state: string | null;
  county: string | null;
  label: "smoke" | "fire" | "clear";
  confidence: number;
  reasoning: string | null;
  image_url: string | null;
  image_time: string | null;
  status: "pending" | "promoted" | "dismissed";
  incident_id: string | null;
  created_at: string;
}

export async function fetchPendingSuggestions(): Promise<SuggestionRow[]> {
  const { data, error } = await supabase
    .from("net_suggestions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as SuggestionRow[];
}

export interface SweepStatus {
  last_run_at: string | null;
  last_window_count: number;     // suggestions created in last 2 min
  pending_in_area: number;
  total_24h: number;
}

export async function fetchSweepStatus(): Promise<SweepStatus> {
  const sinceWindow = new Date(Date.now() - 2 * 60_000).toISOString();
  const since24h = new Date(Date.now() - 24 * 3600_000).toISOString();
  const [{ data: latest }, { count: winCount }, { count: pending }, { count: total24 }] = await Promise.all([
    supabase.from("net_suggestions").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("net_suggestions").select("*", { count: "exact", head: true }).gte("created_at", sinceWindow),
    supabase.from("net_suggestions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("net_suggestions").select("*", { count: "exact", head: true }).gte("created_at", since24h),
  ]);
  return {
    last_run_at: latest?.created_at ?? null,
    last_window_count: winCount ?? 0,
    pending_in_area: pending ?? 0,
    total_24h: total24 ?? 0,
  };
}

export interface CameraHealth {
  total: number;
  confirmed: number;
  false_positives: number;
  score: number;       // 0-100 (higher = better)
  flagged: boolean;    // true if >=3 FPs and FP ratio >= 50%
}

/** Compute a 30-day health score per camera from incident_suggestions verdicts. */
export async function fetchCameraHealth(): Promise<Record<string, CameraHealth>> {
  const since = new Date(Date.now() - 30 * 24 * 3600_000).toISOString();
  const { data, error } = await supabase
    .from("net_suggestions")
    .select("camera_id, status")
    .gte("created_at", since)
    .not("camera_id", "is", null)
    .in("status", ["promoted", "dismissed"]);
  if (error) return {};
  const out: Record<string, CameraHealth> = {};
  for (const row of data ?? []) {
    const id = row.camera_id as string;
    const h = out[id] ?? (out[id] = { total: 0, confirmed: 0, false_positives: 0, score: 100, flagged: false });
    h.total++;
    if (row.status === "promoted") h.confirmed++;
    else h.false_positives++;
  }
  for (const h of Object.values(out)) {
    h.score = h.total === 0 ? 100 : Math.round((h.confirmed / h.total) * 100);
    h.flagged = h.false_positives >= 3 && h.score < 50;
  }
  return out;
}

/** Mark a suggestion as a false positive (improves future sweeps for that camera via health-tracking). */
export async function markFalsePositive(id: string) {
  await dismissSuggestion(id, "Marked a false positive by an operator");
}

export async function dismissSuggestion(id: string, note = "Dismissed by an operator") {
  const { data, error } = await supabase
    .from("net_suggestions")
    .update({ status: "dismissed", resolved_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  const s = data as SuggestionRow | null;
  await logDetectionEvent({
    kind: "dismissed",
    suggestion_id: id,
    camera_id: s?.camera_id ?? null,
    camera_name: s?.camera_name ?? null,
    label: s?.label ?? null,
    confidence: s?.confidence ?? null,
    message: note,
  });
}

export async function muteCamera(camera_id: string, camera_name: string | null, hours = 24, reason = "False positive") {
  const muted_until = new Date(Date.now() + hours * 3600_000).toISOString();
  const { error } = await supabase
    .from("net_muted_cameras")
    .upsert({ camera_id, camera_name, reason, muted_until }, { onConflict: "camera_id" });
  if (error) throw error;
  // also dismiss any pending suggestions for this camera
  await supabase
    .from("net_suggestions")
    .update({ status: "dismissed", resolved_at: new Date().toISOString() })
    .eq("camera_id", camera_id)
    .eq("status", "pending");
  await logDetectionEvent({
    kind: "muted",
    camera_id,
    camera_name,
    message: `Camera muted for ${hours}h — ${reason}`,
  });
}

export async function promoteSuggestion(s: SuggestionRow): Promise<string> {
  const priority = s.label === "fire" ? (s.confidence >= 80 ? "p1" : "p2") : "p3";
  const { data: inc, error: e1 } = await supabase
    .from("net_incidents")
    .insert({
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
      notes: s.reasoning ?? null,
    })
    .select("id")
    .single();
  if (e1) throw e1;
  await supabase
    .from("net_suggestions")
    .update({ status: "promoted", incident_id: inc!.id, resolved_at: new Date().toISOString() })
    .eq("id", s.id);
  await supabase.from("net_incident_events").insert({
    incident_id: inc!.id,
    event_type: "created",
    message: `Confirmed by an operator from AI camera detection (${s.label}, ${s.confidence}%)`,
  });
  await logDetectionEvent({
    kind: "confirmed",
    suggestion_id: s.id,
    incident_id: inc!.id,
    camera_id: s.camera_id,
    camera_name: s.camera_name,
    label: s.label,
    confidence: s.confidence,
    message: "Operator confirmed the detection and opened an incident",
  });
  return inc!.id;
}


/** Full detection history (any status) for the logs view. */
export async function fetchSuggestionHistory(limit = 100): Promise<SuggestionRow[]> {
  const { data, error } = await supabase
    .from("net_suggestions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as SuggestionRow[];
}
