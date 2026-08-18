import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export type OrgApp = {
  id: string;
  slug: string;
  subdomain: string;
  label: string;
  tagline: string | null;
  icon: string | null;
  org_unit_id: string | null;
  landing_route: string;
  nav_groups: string[];
  enabled: boolean;
  is_hub: boolean;
  sort_order: number;
  accent: string | null;
  accent_dark: string | null;
  layout: string;
  short_code: string | null;
};

export const APP_LAYOUTS = [
  { value: "classic", label: "Classic", hint: "Balanced HQ shell" },
  { value: "executive", label: "Executive", hint: "Graphite, wide, calm" },
  { value: "board", label: "Board", hint: "Airy, rounded, light rail" },
  { value: "rail", label: "Rail", hint: "Slim sidebar, dense lists" },
  { value: "industrial", label: "Industrial", hint: "Square, uppercase labels" },
  { value: "ops", label: "Ops", hint: "Dark chrome, mono, tight" },
  { value: "console", label: "Console", hint: "Flat terminal styling" },
];


export const APP_OVERRIDE_KEY = "hq.app.override";

/** Hostnames that never carry a team subdomain (previews, local dev, apex). */
const NEUTRAL_HOSTS = [/\.lovable\.app$/, /\.lovableproject\.com$/, /^localhost$/, /^127\./];

/**
 * Every workspace lives on the single HQ host. `?app=<slug>` selects it and is
 * remembered per browser tab, so several workspaces can be open at once.
 * A legacy team subdomain (eng.clovrlab.com) still resolves for compatibility.
 */
export function resolveAppSlug(): string {
  if (typeof window === "undefined") return "hq";
  const { hostname, search } = window.location;

  const param = new URLSearchParams(search).get("app");
  if (param) {
    try { sessionStorage.setItem(APP_OVERRIDE_KEY, param); } catch {}
    return param;
  }

  let stored: string | null = null;
  try { stored = sessionStorage.getItem(APP_OVERRIDE_KEY); } catch {}
  if (stored) return stored;

  const neutral = NEUTRAL_HOSTS.some((re) => re.test(hostname));
  if (!neutral) {
    const parts = hostname.split(".");
    if (parts.length >= 3) {
      const label = parts[0].toLowerCase();
      if (label !== "www" && label !== "hq") return label;
    }
  }
  return "hq";
}

/** Root domain used to build cross-app links (clovrlab.com). */
export function rootDomain(): string | null {
  if (typeof window === "undefined") return null;
  const { hostname } = window.location;
  if (NEUTRAL_HOSTS.some((re) => re.test(hostname))) return null;
  const parts = hostname.split(".");
  return parts.length >= 2 ? parts.slice(-2).join(".") : null;
}

/** Same-origin URL for a workspace — one host, `?app=` selects the workspace. */
export function appUrl(app: Pick<OrgApp, "subdomain" | "landing_route">): string {
  return `${app.landing_route}?app=${encodeURIComponent(app.subdomain)}`;
}


export async function fetchApps(): Promise<OrgApp[]> {
  const { data } = await db.from("org_apps").select("*").order("sort_order");
  return (data ?? []) as OrgApp[];
}

export async function saveApp(app: Partial<OrgApp> & { id?: string }) {
  if (app.id) {
    const { id, ...rest } = app;
    return db.from("org_apps").update(rest).eq("id", id);
  }
  return db.from("org_apps").insert(app);
}

export async function deleteApp(id: string) {
  return db.from("org_apps").delete().eq("id", id);
}
