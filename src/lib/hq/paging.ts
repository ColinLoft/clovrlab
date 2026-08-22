import { supabase } from "@/integrations/supabase/client";

export type PageSeverity = "critical" | "high" | "info";
export type PageStatus = "open" | "acked" | "resolved";

export interface PageAlert {
  id: string;
  kind: string;
  severity: PageSeverity;
  title: string;
  body: string | null;
  link: string | null;
  source_table: string | null;
  source_id: string | null;
  rotation_id: string | null;
  status: PageStatus;
  level: number;
  next_escalation_at: string | null;
  acked_by: string | null;
  acked_at: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Rotation {
  id: string;
  name: string;
  workspace: string | null;
  kinds: string[];
  escalation_minutes: number;
  max_level: number;
  active: boolean;
  created_at: string;
}

export interface RotationMember {
  id: string;
  rotation_id: string;
  user_id: string;
  tier: number;
}

export const PAGE_KINDS = [
  { value: "detection", label: "Fire / smoke detection" },
  { value: "incident", label: "New incident" },
  { value: "fleet", label: "Aircraft or fleet emergency" },
  { value: "system", label: "System or service failure" },
  { value: "manual", label: "Manual page" },
];

const db = supabase as any;

export async function fetchPages(status?: PageStatus | "active", limit = 60): Promise<PageAlert[]> {
  let q = db.from("page_alerts").select("*").order("created_at", { ascending: false }).limit(limit);
  if (status === "active") q = q.in("status", ["open", "acked"]);
  else if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PageAlert[];
}

/** Pages currently targeted at me that still need a human response. */
export async function fetchMyLivePages(): Promise<PageAlert[]> {
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) return [];
  const { data: targets } = await db.from("page_targets").select("alert_id").eq("user_id", uid);
  const ids = (targets ?? []).map((t: any) => t.alert_id);
  if (!ids.length) return [];
  const { data } = await db
    .from("page_alerts").select("*").in("id", ids).eq("status", "open")
    .order("created_at", { ascending: false }).limit(10);
  return (data ?? []) as PageAlert[];
}

export async function ackPage(id: string) {
  const { error } = await db.rpc("ack_page", { _alert_id: id });
  if (error) throw error;
}

export async function resolvePage(id: string) {
  const { error } = await db.rpc("resolve_page", { _alert_id: id });
  if (error) throw error;
}

export async function raisePage(input: {
  kind: string; title: string; body?: string; link?: string; severity?: PageSeverity;
}) {
  const { data, error } = await db.rpc("raise_page", {
    _kind: input.kind,
    _title: input.title,
    _body: input.body ?? null,
    _link: input.link ?? null,
    _severity: input.severity ?? "critical",
    _source_table: null,
    _source_id: null,
  });
  if (error) throw error;
  return data as string;
}

export async function fetchRotations(): Promise<Rotation[]> {
  const { data, error } = await db.from("oncall_rotations").select("*").order("created_at");
  if (error) throw error;
  return (data ?? []) as Rotation[];
}

export async function fetchRotationMembers(): Promise<RotationMember[]> {
  const { data, error } = await db.from("oncall_members").select("*").order("tier");
  if (error) throw error;
  return (data ?? []) as RotationMember[];
}

export async function saveRotation(patch: Partial<Rotation> & { id?: string }) {
  const { data, error } = await db.from("oncall_rotations").upsert(patch).select().maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Nothing saved — you need admin access to change rotations.");
  return data as Rotation;
}

export async function deleteRotation(id: string) {
  const { error } = await db.from("oncall_rotations").delete().eq("id", id);
  if (error) throw error;
}

export async function addRotationMember(rotation_id: string, user_id: string, tier: number) {
  const { data, error } = await db
    .from("oncall_members").upsert({ rotation_id, user_id, tier }).select().maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Nothing saved — admin access is required to edit the roster.");
  return data as RotationMember;
}

export async function removeRotationMember(id: string) {
  const { error } = await db.from("oncall_members").delete().eq("id", id);
  if (error) throw error;
}
