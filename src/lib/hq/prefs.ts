import { supabase } from "@/integrations/supabase/client";

export type Prefs = {
  density: "comfortable" | "compact";
  accent: "orange" | "blue" | "green" | "violet";
  language: "en" | "es" | "fr" | "de";
  timezone: string;
  timeFormat: "12h" | "24h";
  weekStart: "sunday" | "monday";
  notifyEmail: boolean;
  notifyDesktop: boolean;
  notifyMentions: boolean;
  notifyAnnouncements: boolean;
  notifyDigest: "off" | "daily" | "weekly";
  soundOn: boolean;
  pagerSound: boolean;
  sidebarCollapsed: boolean;
  showKeyboardHints: boolean;
  betaFeatures: boolean;
};

export const DEFAULT_PREFS: Prefs = {
  density: "comfortable",
  accent: "orange",
  language: "en",
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/Los_Angeles",
  timeFormat: "12h",
  weekStart: "sunday",
  notifyEmail: true,
  notifyDesktop: true,
  notifyMentions: true,
  notifyAnnouncements: true,
  notifyDigest: "daily",
  soundOn: true,
  pagerSound: true,
  sidebarCollapsed: false,
  showKeyboardHints: true,
  betaFeatures: false,
};

export const PREF_KEY = "hq-prefs";

const ACCENTS: Record<Prefs["accent"], string> = {
  orange: "18 92% 55%",
  blue: "212 92% 58%",
  green: "152 62% 42%",
  violet: "266 78% 62%",
};

/** Synchronous cached read (localStorage) so the UI never flashes defaults. */
export function cachedPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

/** Applies the visual preferences to the document so they actually do something. */
export function applyPrefs(p: Prefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset["density"] = p.density;
  root.style.setProperty("--primary", ACCENTS[p.accent] ?? ACCENTS.orange);
  root.style.setProperty("--ring", ACCENTS[p.accent] ?? ACCENTS.orange);
  root.style.setProperty("--hq-density-scale", p.density === "compact" ? "0.9" : "1");
}

/** Loads from the account, falling back to the local cache when offline. */
export async function loadPrefs(): Promise<Prefs> {
  const local = cachedPrefs();
  try {
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) return local;
    const { data } = await (supabase as any).from("user_prefs").select("prefs").eq("user_id", uid).maybeSingle();
    const merged = { ...DEFAULT_PREFS, ...local, ...((data?.prefs as Partial<Prefs>) ?? {}) };
    try { window.localStorage.setItem(PREF_KEY, JSON.stringify(merged)); } catch {}
    return merged;
  } catch {
    return local;
  }
}

/** Persists to the account (and the local cache). Throws when the write is rejected. */
export async function savePrefs(p: Prefs) {
  try { window.localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch {}
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) throw new Error("You need to be signed in to save settings.");
  const { data, error } = await (supabase as any)
    .from("user_prefs")
    .upsert({ user_id: uid, prefs: p }, { onConflict: "user_id" })
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Settings were not saved — please try again.");
}
