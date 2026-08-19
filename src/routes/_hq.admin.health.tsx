import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Activity, AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouteAccess } from "@/lib/hq/route-access";
import { getServiceHealth } from "@/lib/hq/service-health.functions";

export const Route = createFileRoute("/_hq/admin/health")({
  head: () => ({
    meta: [
      { title: "Service health — Clovr HQ" },
      { name: "description", content: "Live uptime, database latency, and recent application errors across Clovr internal services." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HealthBoard,
});

const STATUS: Record<string, { label: string; dot: string; text: string }> = {
  operational: { label: "Operational", dot: "bg-emerald-500", text: "text-emerald-600" },
  degraded: { label: "Degraded", dot: "bg-amber-500", text: "text-amber-600" },
  down: { label: "Down", dot: "bg-destructive", text: "text-destructive" },
  not_configured: { label: "Not configured", dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

function HealthBoard() {
  const access = useRouteAccess();
  const probe = useServerFn(getServiceHealth);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await probe({ data: undefined as never }));
    } catch (err: any) {
      setError(err?.message ?? "Could not run health checks.");
    } finally {
      setLoading(false);
    }
  }, [probe]);

  useEffect(() => {
    if (!access.isAdmin) return;
    void refresh();
    const id = setInterval(() => void refresh(), 60_000);
    return () => clearInterval(id);
  }, [access.isAdmin, refresh]);

  if (access.loading) return <div className="p-8 text-sm text-muted-foreground">Checking systems access…</div>;
  if (!access.isAdmin) return <div className="p-8 text-sm text-muted-foreground">Service health is restricted to administrators.</div>;

  const worst = (data?.probes ?? []).some((p: any) => p.status === "down")
    ? "Incident in progress"
    : (data?.probes ?? []).some((p: any) => p.status === "degraded")
      ? "Partially degraded"
      : "All systems operational";

  return (
    <main className="mx-auto max-w-7xl px-6 py-7">
      <Link to="/admin/it" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Enterprise Systems
      </Link>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Service health</p>
          <h1 className="mt-2 text-3xl font-semibold">{loading && !data ? "Running checks…" : worst}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {data ? `Last checked ${new Date(data.checkedAt).toLocaleTimeString()} · auto-refreshes every minute` : "Live probes against database, auth, storage, email, Slack, and AI."}
          </p>
        </div>
        <button onClick={() => void refresh()} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium hover:border-primary/50">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Run checks
        </button>
      </header>

      {error && <p className="mt-4 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      {data && (
        <>
          <section className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="border border-border bg-card p-5">
              <Activity className="h-5 w-5 text-primary" />
              <p className="mt-5 text-2xl font-semibold">{data.uptime24h}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Error-free hours in the last 24h</p>
            </div>
            <div className="border border-border bg-card p-5">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <p className="mt-5 text-2xl font-semibold">{data.errors24h}</p>
              <p className="mt-1 text-xs text-muted-foreground">Errors captured in the last 24 hours</p>
            </div>
            <div className="border border-border bg-card p-5">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <p className="mt-5 text-2xl font-semibold">{data.errors7d}</p>
              <p className="mt-1 text-xs text-muted-foreground">Errors captured in the last 7 days</p>
            </div>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_400px]">
            <div className="border border-border bg-card">
              <div className="border-b border-border px-5 py-4"><h2 className="text-sm font-semibold">Services</h2></div>
              <div className="divide-y divide-border">
                {data.probes.map((p: any) => {
                  const s = STATUS[p.status] ?? STATUS.not_configured;
                  return (
                    <div key={p.key} className="flex items-center gap-3 px-5 py-4">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{p.label}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.detail}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-medium ${s.text}`}>{s.label}</p>
                        <p className="text-[11px] text-muted-foreground">{p.latencyMs === null ? "—" : `${p.latencyMs} ms`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-border bg-card">
              <div className="border-b border-border px-5 py-4"><h2 className="text-sm font-semibold">Recent errors</h2></div>
              <div className="max-h-[520px] divide-y divide-border overflow-y-auto">
                {data.recentErrors.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No errors recorded. </p>}
                {data.recentErrors.map((e: any) => (
                  <div key={e.id} className="px-5 py-3.5">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {e.service} · {e.status ?? "500"} · {new Date(e.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm font-medium">{e.message}</p>
                    {e.path && <p className="truncate text-xs text-muted-foreground">{e.method ?? "GET"} {e.path}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
