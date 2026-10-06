import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: any) {
  const { data: roles, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  const ok = (roles ?? []).some((r: any) => r.role === "admin" || r.role === "super_admin");
  if (!ok) throw new Error("Only administrators can view service health");
}

export type ServiceProbe = {
  key: string;
  label: string;
  status: "operational" | "degraded" | "down" | "not_configured";
  latencyMs: number | null;
  detail: string;
};

async function timed(fn: () => Promise<void>): Promise<{ ms: number; error: string | null }> {
  const start = Date.now();
  try {
    await fn();
    return { ms: Date.now() - start, error: null };
  } catch (err: any) {
    return { ms: Date.now() - start, error: err?.message ?? "Unknown error" };
  }
}

function classify(ms: number, error: string | null, slow = 800): ServiceProbe["status"] {
  if (error) return "down";
  return ms > slow ? "degraded" : "operational";
}

async function verifyResend(key: string) {
  const res = await fetch("https://api.resend.com/emails", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (res.status === 401) throw new Error("Invalid Resend API key");
}

async function verifySlack(key: string) {
  const res = await fetch("https://slack.com/api/auth.test", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? "Invalid Slack token");
}

export const getServiceHealth = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const supabaseUrl = process.env["SUPABASE_URL"];
    const probes: ServiceProbe[] = [];

    // Database
    const db = await timed(async () => {
      const { error } = await context.supabase.from("org_apps").select("id", { count: "exact", head: true });
      if (error) throw new Error(error.message);
    });
    probes.push({
      key: "database",
      label: "Database",
      status: classify(db.ms, db.error, 600),
      latencyMs: db.ms,
      detail: db.error ?? "Read query succeeded",
    });

    // Auth service
    const auth = await timed(async () => {
      if (!supabaseUrl) throw new Error("Backend URL not configured");
      const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: { apikey: process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "" },
      });
      if (!res.ok) throw new Error(`Auth health responded ${res.status}`);
    });
    probes.push({
      key: "auth",
      label: "Authentication",
      status: classify(auth.ms, auth.error),
      latencyMs: auth.ms,
      detail: auth.error ?? "Sign-in service reachable",
    });

    // Storage
    const storage = await timed(async () => {
      if (!supabaseUrl) throw new Error("Backend URL not configured");
      const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "";
      const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      if (res.status >= 500) throw new Error(`Storage responded ${res.status}`);
    });
    probes.push({
      key: "storage",
      label: "File storage",
      status: classify(storage.ms, storage.error),
      latencyMs: storage.ms,
      detail: storage.error ?? "Storage endpoint reachable",
    });

    // Email (Resend connector)
    const resendKey = process.env["RESEND_API_KEY"];
    if (!resendKey) {
      probes.push({ key: "email", label: "Email delivery", status: "not_configured", latencyMs: null, detail: "Resend is not linked" });
    } else {
      const email = await timed(() => verifyResend(resendKey));
      probes.push({
        key: "email",
        label: "Email delivery",
        status: classify(email.ms, email.error, 1500),
        latencyMs: email.ms,
        detail: email.error ?? "Resend credentials verified",
      });
    }

    // Slack bot
    const slackKey = process.env["SLACK_API_KEY"];
    if (!slackKey) {
      probes.push({ key: "slack", label: "Slack bot", status: "not_configured", latencyMs: null, detail: "Slack is not connected" });
    } else {
      const slack = await timed(() => verifySlack(slackKey));
      probes.push({
        key: "slack",
        label: "Slack bot",
        status: classify(slack.ms, slack.error, 1500),
        latencyMs: slack.ms,
        detail: slack.error ?? "Bot token verified",
      });
    }

    // AI gateway
    probes.push({
      key: "ai",
      label: "AI provider",
      status: process.env["OPENROUTER_API_KEY"] ? "operational" : "not_configured",
      latencyMs: null,
      detail: process.env["OPENROUTER_API_KEY"] ? "OpenRouter key present" : "No OpenRouter key",
    });

    // Errors
    const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
    const [recent, day, week] = await Promise.all([
      context.supabase
        .from("sys_error_log")
        .select("id, service, path, method, status, message, created_at")
        .order("created_at", { ascending: false })
        .limit(25),
      context.supabase.from("sys_error_log").select("created_at").gte("created_at", dayAgo).limit(2000),
      context.supabase.from("sys_error_log").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    ]);

    const hoursWithErrors = new Set(
      ((day.data ?? []) as any[]).map((r) => new Date(r.created_at).toISOString().slice(0, 13)),
    );
    const uptime24h = Math.round(((24 - Math.min(24, hoursWithErrors.size)) / 24) * 1000) / 10;

    return {
      checkedAt: new Date().toISOString(),
      probes,
      errors24h: (day.data ?? []).length,
      errors7d: week.count ?? 0,
      uptime24h,
      recentErrors: (recent.data ?? []) as any[],
    };
  });
