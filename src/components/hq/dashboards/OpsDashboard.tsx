import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Empty, RowLink, Bar, pct } from "./kit";

async function load() {
  const [active, deployments, safety, ready, total, logs, tasks, crews] = await Promise.all([
    rows("con_jobs", "id,name,job_number,status,stage,percent_complete,target_end_date", (q: any) => q.eq("status", "active").order("target_end_date", { nullsFirst: false }), 6),
    rows("con_schedule_blocks", "id,title,scheduled_date,phase,status", (q: any) => q.neq("status", "complete").order("scheduled_date", { nullsFirst: false }), 6),
    rows("con_safety_incidents", "id,incident_type,severity,incident_date,status", (q: any) => q.neq("status", "closed").order("incident_date", { ascending: false }), 5),
    count("con_equipment", (q: any) => q.eq("status", "available")),
    count("con_equipment"),
    rows("con_daily_logs", "id,log_date,status,weather,work_performed", (q: any) => q.order("log_date", { ascending: false }), 5),
    rows("con_tasks", "id,title,status,priority,due_date", (q: any) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 8),
    count("con_crews"),
  ]);
  return { active, deployments, safety, ready, total, logs, tasks, crews };
}

export function OpsDashboard() {
  const { data, error } = useDash("ops", load);
  return (
    <DashShell
      eyebrow="Mission operations"
      title="Live operational picture"
      summary="Incident command, deployment windows, crew coverage, fleet availability and safety exceptions in one console."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.active.slice(0, 4).map((j: any) => (
              <Link key={j.id} to="/jobs" className="rounded-lg border border-primary/30 bg-primary/5 p-4 transition hover:border-primary">
                <p className="font-mono text-[11px] uppercase tracking-widest text-primary">{j.job_number ?? "INCIDENT"}</p>
                <p className="mt-2 truncate text-base font-semibold">{j.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{j.stage ?? "active"} · target {j.target_end_date ?? "TBD"}</p>
                <div className="mt-3"><Bar value={Number(j.percent_complete ?? 0)} max={100} /></div>
              </Link>
            ))}
            {data.active.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground sm:col-span-2 xl:col-span-4">No active incidents. Standing by.</div>
            )}
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_320px]">
            <Panel title="Deployment windows" hint="Scheduled and in-flight blocks">
              <div className="divide-y divide-border">
                {data.deployments.length === 0 && <Empty>No deployments scheduled.</Empty>}
                {data.deployments.map((d: any) => (
                  <RowLink key={d.id} to="/scheduling" title={d.title ?? "Deployment"} meta={`${d.scheduled_date ?? "TBD"} · ${d.phase ?? "field"}`} badge={d.status ?? "planned"} />
                ))}
              </div>
            </Panel>

            <Panel title="Response queue" hint="Next actions across missions">
              <div className="divide-y divide-border">
                {data.tasks.length === 0 && <Empty>Queue is clear.</Empty>}
                {data.tasks.slice(0, 6).map((t: any) => (
                  <RowLink key={t.id} to="/company-tasks" title={t.title} meta={`${t.priority ?? "normal"} · ${t.due_date ?? "no due date"}`} tone={(t.priority ?? "").toLowerCase() === "high" ? "risk" : undefined} />
                ))}
              </div>
            </Panel>

            <aside className="space-y-5">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Fleet availability</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{data.ready}<span className="text-base text-muted-foreground">/{data.total}</span></p>
                <div className="mt-2"><Bar value={data.ready} max={Math.max(data.total, 1)} /></div>
                <p className="mt-2 text-xs text-muted-foreground">{pct(data.ready, data.total)}% mission capable · {data.crews} crews</p>
              </div>
              <Panel title="Safety exceptions">
                <div className="divide-y divide-border">
                  {data.safety.length === 0 && <Empty>No open exceptions.</Empty>}
                  {data.safety.map((s: any) => (
                    <RowLink key={s.id} to="/safety" title={s.incident_type ?? "Safety event"} meta={`${s.severity ?? "review"} · ${s.incident_date ?? "undated"}`} tone="risk" />
                  ))}
                </div>
              </Panel>
              <Panel title="Situation reports">
                <div className="divide-y divide-border">
                  {data.logs.length === 0 && <Empty>No reports filed.</Empty>}
                  {data.logs.map((l: any) => (
                    <RowLink key={l.id} to="/daily-logs" title={l.log_date ?? "Log"} meta={l.work_performed ?? l.weather ?? l.status ?? "Filed"} />
                  ))}
                </div>
              </Panel>
            </aside>
          </section>
        </>
      )}
    </DashShell>
  );
}
