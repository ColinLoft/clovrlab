import { supabase } from "@/integrations/supabase/client";

/**
 * ntfy.sh push notifications for on-call paging.
 *
 * Every operator gets a private, hard-to-guess topic. They subscribe to it in
 * the ntfy app (iOS / Android) or the ntfy web app, and the paging worker
 * publishes urgent pages straight to that topic.
 */
export const NTFY_SERVER = "https://ntfy.sh";

export function topicUrl(topic: string) {
  return `${NTFY_SERVER}/${topic}`;
}

/** Deep link that opens the ntfy mobile app straight on the subscribe screen. */
export function topicAppLink(topic: string) {
  return `ntfy://ntfy.sh/${topic}`;
}

function randomTopic() {
  const bytes = new Uint8Array(12);
  (globalThis.crypto ?? window.crypto).getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `clovr-oncall-${suffix}`;
}

/** Read this operator's topic, if they already have one. */
export async function getMyTopic(): Promise<string | null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return null;
  const { data } = await (supabase as any)
    .from("push_topics")
    .select("topic")
    .eq("user_id", uid)
    .maybeSingle();
  return (data?.topic as string) ?? null;
}

/** Read or create this operator's topic. */
export async function ensureMyTopic(): Promise<string | null> {
  const existing = await getMyTopic();
  if (existing) return existing;

  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return null;

  const topic = randomTopic();
  const { data, error } = await (supabase as any)
    .from("push_topics")
    .upsert({ user_id: uid, topic }, { onConflict: "user_id" })
    .select("topic")
    .maybeSingle();
  if (error) throw error;
  return (data?.topic as string) ?? topic;
}

/** Issue a brand new topic (old subscriptions stop receiving pages). */
export async function rotateMyTopic(): Promise<string | null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return null;
  const topic = randomTopic();
  const { error } = await (supabase as any)
    .from("push_topics")
    .upsert({ user_id: uid, topic }, { onConflict: "user_id" });
  if (error) throw error;
  return topic;
}

/** Stop receiving pushes: delete the topic mapping. */
export async function clearMyTopic() {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return;
  await (supabase as any).from("push_topics").delete().eq("user_id", uid);
}

/** Publish a test page to the operator's own topic. */
export async function sendTestPush(topic: string) {
  const res = await fetch(topicUrl(topic), {
    method: "POST",
    headers: {
      Title: "Test page - Clovr Labs",
      Priority: "5",
      Tags: "rotating_light",
    },
    body: "If you can see this, on-call push is working on this device.",
  });
  if (!res.ok) throw new Error(`ntfy ${res.status}`);
}

export function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);
}
