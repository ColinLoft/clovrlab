import { supabase } from "@/integrations/supabase/client";

export type DetectionEventKind =
  | "sweep_start" | "sweep_end" | "sweep_blocked"
  | "verdict" | "incident_opened" | "confirmed" | "dismissed" | "muted"
  | "paged" | "acked" | "escalated" | "incident_status";

export interface DetectionEvent {
  id: string;
  kind: DetectionEventKind | string;
  trigger: string | null;
  sweep_run_id: string | null;
  camera_id: string | null;
  camera_name: string | null;
  suggestion_id: string | null;
  incident_id: string | null;
  label: string | null;
  confidence: number | null;
  message: string | null;
  actor: string | null;
  detail: Record<string, any>;
  created_at: string;
}

const db = supabase as any;

export async function fetchDetectionEvents(limit = 200): Promise<DetectionEvent[]> {
  const { data, error } = await db
    .from("net_detection_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as DetectionEvent[];
}

/** Record an operator decision (confirm / dismiss / mute) on the detection timeline. */
export async function logDetectionEvent(row: Partial<DetectionEvent> & { kind: string }) {
  const { data: u } = await supabase.auth.getUser();
  await db.from("net_detection_events").insert({ ...row, actor: u.user?.id ?? null });
}
