import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Empty, RowLink } from "./kit";

async function load() {
  const [apps, integrations, infra, software, repos, security, errors] = await Promise.all([
    rows("org_apps", "id,label,slug,enabled,subdomain", (q: any) => q.order("sort_order"), 12),
    rows("dev_integrations", "id,name,status,vendor", (q: any) => q, 8),
    rows("dev_infrastructure", "id,name,status,environment,provider", (q: any) => q, 8),
    count("dev_software"),
    count("dev_repos"),
    rows("dev_security_logs", "id,event,severity,details,created_at", (q: any) => q.order("created_at", { ascending: false }), 6),
    rows("sys_error_log", "id,message,created_at,path", (q: any) => q.order("created_at", { ascending: false }), 6),
  ]);
  return { apps, integrations, infra, software, repos, security, errors };
}

const dot = (ok: boolean) => (ok ? "bg-primary" : "bg-destructive");

export function SystemsDashboard() {
  const { data, error } = useDash("systems", load);
  return (
    <DashShell
      eyebrow="Enterprise systems"
      title="Systems control"
      summary="Workspace registry, integration and infrastructure state, security events and recent application errors."
      actions={<Link to="/admin/health" className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary">Service health</Link>}
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading variant="rows" />}
      {data && (
        <>
          <section className="mt-7 rounded-lg border border-border bg-card font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="uppercase tracking-[0.2em] text-muted-foreground">workspace_registry</span>
              <Link to="/admin/apps" className="text-primary hover:underline">manage</Link>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {data.apps.map((a: any) => (
                <div key={a.id} className="flex items-center gap-2 bg-card px-4 py-2.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${dot(!!a.enabled)}`} />
                  <span className="truncate text-foreground">{a.slug}</span>
                  <span className="ml-auto truncate text-muted-foreground">{a.enabled ? "live" : "disabled"}</span>
                </div>
              ))}
              {data.apps.length === 0 && <div className="bg-card p-6 text-muted-foreground">no workspaces registered</div>}
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Panel title="Integrations" hint={`${data.software} software records · ${data.repos} repositories`}>
              <div className="divide-y divide-border font-mono text-xs">
                {data.integrations.length === 0 && <Empty>No integrations registered.</Empty>}
                {data.integrations.map((i: any) => (
                  <div key={i.id} className="flex items-center gap-2 px-4 py-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${dot(i.status === "connected")}`} />
                    <span className="truncate">{i.name}</span>
                    <span className="ml-auto text-muted-foreground">{i.status ?? "unknown"}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Infrastructure">
              <div className="divide-y divide-border font-mono text-xs">
                {data.infra.length === 0 && <Empty>No services registered.</Empty>}
                {data.infra.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-2 px-4 py-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${dot(s.status === "healthy")}`} />
                    <span className="truncate">{s.name}</span>
                    <span className="ml-auto text-muted-foreground">{s.environment ?? s.provider ?? ""} {s.status ?? ""}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Panel title="Security events" hint="Newest first">
              <div className="divide-y divide-border">
                {data.security.length === 0 && <Empty>No security events.</Empty>}
                {data.security.map((s: any) => (
                  <RowLink key={s.id} to="/admin/it" title={s.event ?? "Event"} meta={`${s.severity ?? "info"} · ${typeof s.details === "string" ? s.details : ""}`} tone={["high", "critical"].includes((s.severity ?? "").toLowerCase()) ? "risk" : undefined} />
                ))}
              </div>
            </Panel>
            <Panel title="Application errors" hint="Captured from the running app">
              <div className="divide-y divide-border">
                {data.errors.length === 0 && <Empty>No errors logged.</Empty>}
                {data.errors.map((e: any) => (
                  <RowLink key={e.id} to="/admin/health" title={e.message ?? "Error"} meta={`${e.path ?? ""} ${new Date(e.created_at).toLocaleString()}`} tone="risk" />
                ))}
              </div>
            </Panel>
          </section>
        </>
      )}
    </DashShell>
  );
}
