import { supabase } from "@/integrations/supabase/client";

export interface NetSettings {
  id: boolean;
  ai_model: string;
  min_confidence: number;
  auto_promote: boolean;
  auto_promote_confidence: number;
  sweep_enabled: boolean;
  sweep_interval_hours: number;
  sweep_batch_size: number;
  sweep_priority_only: boolean;
  last_sweep_at: string | null;
  sweep_lock_until: string | null;
  paused: boolean;
  pause_reason: string | null;
  dispatch_min_battery: number;
  dispatch_max_range_mi: number;
  notify_on_suggestion: boolean;
  notify_on_incident: boolean;
  updated_at: string;
  updated_by: string | null;
}

export const AI_MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash — balanced (default)" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite — cheapest, fastest" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro — highest accuracy" },
];

export async function fetchSettings(): Promise<NetSettings | null> {
  const { data } = await supabase.from("net_settings").select("*").eq("id", true).maybeSingle();
  return (data as unknown as NetSettings) ?? null;
}

export async function saveSettings(patch: Partial<NetSettings>) {
  const { error } = await supabase
    .from("net_settings")
    .update(patch as never)
    .eq("id", true);
  if (error) throw error;
}

export interface CameraPref {
  camera_id: string;
  camera_name: string | null;
  watch: boolean;
  priority: number;
  label: string | null;
  notes: string | null;
}

export async function fetchCameraPrefs(): Promise<Record<string, CameraPref>> {
  const { data } = await supabase.from("net_camera_prefs").select("*");
  const out: Record<string, CameraPref> = {};
  for (const r of (data ?? []) as unknown as CameraPref[]) out[r.camera_id] = r;
  return out;
}

export async function saveCameraPref(pref: Partial<CameraPref> & { camera_id: string }) {
  const { error } = await supabase
    .from("net_camera_prefs")
    .upsert(pref as never, { onConflict: "camera_id" });
  if (error) throw error;
}

export interface SweepRun {
  id: string;
  trigger: string;
  analyzed: number;
  created_count: number;
  error_count: number;
  first_error: string | null;
  duration_ms: number | null;
  created_at: string;
}

export async function fetchSweepRuns(limit = 12): Promise<SweepRun[]> {
  const { data } = await supabase
    .from("net_sweep_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as SweepRun[];
}
