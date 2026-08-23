import { supabase } from "@/integrations/supabase/client";

export type PageSeverity = "critical" | "high" | "info";
export type PageStatus = "open" | "acked" | "resolved";
export type PageQueue = "ops" | "systems";
export type TicketStatus = "open" | "investigating" | "mitigated" | "closed";

export interface PageAlert {
  id: string;
  kind: string;
  queue: PageQueue;
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

export interface PageTicket {
  id: string;
  ref: string;
  alert_id: string | null;
  queue: PageQueue;
  title: string;
  summary: string | null;
  kind: string | null;
  severity: PageSeverity;
  status: TicketStatus;
  assignee_id: string | null;
  impact: string | null;
  root_cause: string | null;
  resolution: string | null;
  opened_at: string;
  closed_at: string | null;
  created_by: string | null;
  updated_at: string;
}

export interface TicketNote {
  id: string;
  ticket_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
}

export interface Rotation {
  id: string;
  name: string;
  queue: PageQueue;
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

/** Page kinds, split by which console owns the response. */
export const QUEUE_KINDS: Record<PageQueue, { value: string; label: string }[]> = {
  ops: [
    { value: "detection", label: "Fire / smoke detection" },
    { value: "incident", label: "New incident" },
    { value: "fleet", label: "Aircraft or fleet emergency" },
    { value: "airspace", label: "Airspace conflict" },
    { value: "manual", label: "Manual page" },
  ],
  systems: [
    { value: "system", label: "Service or platform outage" },
    { value: "infrastructure", label: "Infrastructure failure" },
    { value: "security", label: "Security event" },
    { value: "integration", label: "Integration / data feed down" },
    { value: "manual", label: "Manual page" },
  ],
};

export const PAGE_KINDS = [...QUEUE_KINDS.ops, ...QUEUE_KINDS.systems.filter((k) => k.value !== "manual")];

export const TICKET_STATUSES: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "investigating", label: "Investigating" },
  { value: "mitigated", label: "Mitigated" },
  { value: "closed", label: "Closed" },
];

export const QUEUE_LABEL: Record<PageQueue, string> = {
  ops: "Mission Operations",
  systems: "Enterprise Systems",
};

const db = supabase as any;


export async function fetchPages(status?: PageStatus | "active", limit = 60, queue?: PageQueue): Promise<PageAlert[]> {
  let q = db.from("page_alerts").select("*").order("created_at", { ascending: false }).limit(limit);
  if (queue) q = q.eq("queue", queue);
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
  kind: string; title: string; body?: string; link?: string; severity?: PageSeverity; queue?: PageQueue;
}) {
  const { data, error } = await db.rpc("raise_page", {
    _kind: input.kind,
    _title: input.title,
    _body: input.body ?? null,
    _link: input.link ?? null,
    _severity: input.severity ?? "critical",
    _source_table: null,
    _source_id: null,
    _queue: input.queue ?? null,
  });
  if (error) throw error;
  return data as string;
}

// ---------- Tickets ----------

export async function fetchTickets(queue?: PageQueue, limit = 100): Promise<PageTicket[]> {
  let q = db.from("page_tickets").select("*").order("opened_at", { ascending: false }).limit(limit);
  if (queue) q = q.eq("queue", queue);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PageTicket[];
}

export async function fetchTicketNotes(ticketIds: string[]): Promise<TicketNote[]> {
  if (!ticketIds.length) return [];
  const { data, error } = await db
    .from("page_ticket_notes").select("*").in("ticket_id", ticketIds).order("created_at");
  if (error) throw error;
  return (data ?? []) as TicketNote[];
}

export async function saveTicket(patch: Partial<PageTicket> & { id: string }) {
  const body = { ...patch } as any;
  if (patch.status === "closed" && !patch.closed_at) body.closed_at = new Date().toISOString();
  if (patch.status && patch.status !== "closed") body.closed_at = null;
  const { data, error } = await db.from("page_tickets").update(body).eq("id", patch.id).select().maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Nothing saved — you need staff access to edit tickets.");
  return data as PageTicket;
}

export async function createTicket(input: { queue: PageQueue; title: string; summary?: string; kind?: string; severity?: PageSeverity }) {
  const { data: u } = await supabase.auth.getUser();
  const { data, error } = await db.from("page_tickets").insert({
    queue: input.queue,
    title: input.title,
    summary: input.summary ?? null,
    kind: input.kind ?? "manual",
    severity: input.severity ?? "high",
    created_by: u.user?.id ?? null,
  }).select().maybeSingle();
  if (error) throw error;
  return data as PageTicket;
}

export async function addTicketNote(ticket_id: string, body: string) {
  const { data: u } = await supabase.auth.getUser();
  const { error } = await db.from("page_ticket_notes").insert({
    ticket_id, body, author_id: u.user?.id ?? null,
  });
  if (error) throw error;
}

export async function fetchRotations(queue?: PageQueue): Promise<Rotation[]> {
  let q = db.from("oncall_rotations").select("*").order("created_at");
  if (queue) q = q.eq("queue", queue);
  const { data, error } = await q;
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

// ---------- Delivery timeline ----------

export type DeliveryChannel = "ntfy" | "email" | "app";
export type DeliveryStatus = "sent" | "failed" | "skipped" | "acknowledged";

export interface PageDelivery {
  id: string;
  alert_id: string | null;
  target_id: string | null;
  user_id: string | null;
  channel: DeliveryChannel;
  status: DeliveryStatus;
  detail: string | null;
  created_at: string;
}

/** Everything the paging worker attempted, newest first. */
export async function fetchDeliveries(limit = 120, alertId?: string): Promise<PageDelivery[]> {
  let q = db.from("page_deliveries").select("*").order("created_at", { ascending: false }).limit(limit);
  if (alertId) q = q.eq("alert_id", alertId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PageDelivery[];
}

export interface PageTargetRow {
  id: string;
  alert_id: string;
  user_id: string;
  level: number;
  push_sent_at: string | null;
  email_sent_at: string | null;
  seen_at: string | null;
  acked_at: string | null;
}

export async function fetchTargets(alertIds: string[]): Promise<PageTargetRow[]> {
  if (!alertIds.length) return [];
  const { data, error } = await db
    .from("page_targets")
    .select("id, alert_id, user_id, level, push_sent_at, email_sent_at, seen_at, acked_at")
    .in("alert_id", alertIds);
  if (error) throw error;
  return (data ?? []) as PageTargetRow[];
}
