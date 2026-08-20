import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Bar, Empty, RowLink, pct } from "./kit";

async function load() {
  const [projects, milestones, issues, reviews, ecos, bom, tasks, openIssues, closedIssues] = await Promise.all([
    rows("eng_projects", "id,name,status,target_date,progress", (q: any) => q.neq("status", "complete").order("target_date", { nullsFirst: false }), 6),
    rows("eng_milestones", "id,title,due_date,status,project_id", (q: any) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 6),
    rows("eng_issues", "id,title,severity,status,created_at", (q: any) => q.neq("status", "closed").order("created_at", { ascending: false }), 8),
    rows("eng_design_reviews", "id,title,status,review_date", (q: any) => q.neq("status", "approved").order("scheduled_date", { nullsFirst: false }), 5),
    rows("eng_ecos", "id,title,status,created_at", (q: any) => q.neq("status", "implemented").order("created_at", { ascending: false }), 5),
    count("eng_bom_items"),
    rows("eng_tasks", "id,title,status,priority,due_date", (q: any) => q.neq("status", "done").order("due_date", { nullsFirst: false }), 8),
    count("eng_issues", (q: any) => q.neq("status", "closed")),
    count("eng_issues", (q: any) => q.eq("status", "closed")),
  ]);
  return { projects, milestones, issues, reviews, ecos, bom, tasks, openIssues, closedIssues };
}

const SEV = ["critical", "high", "medium", "low"];

export function EngDashboard() {
  const { data, error } = useDash("eng", load);
  return (
    <DashShell
      eyebrow="Engineering"
      title="Build readiness"
      summary="Programs, milestone burn-down, issue triage, design reviews and change control for the aircraft platform."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading variant="rows" />}
      {data && (
        <>
          <section className="mt-7 grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold">Program burn-down</h2>
                <Link to="/eng-projects" className="text-xs text-primary hover:underline">All projects</Link>
              </div>
              <div className="mt-4 space-y-4">
                {data.projects.length === 0 && <Empty>No active projects.</Empty>}
                {data.projects.map((p: any) => (
                  <div key={p.id}>
                    <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      <span className="truncate text-foreground">{p.name}</span>
                      <span>{p.status ?? "active"} · {p.target_date ?? "no target"}</span>
                    </div>
                    <div className="mt-1.5"><Bar value={Number(p.progress ?? 0)} max={100} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">Issue triage</h2>
              <p className="mt-1 text-xs text-muted-foreground">{data.openIssues} open · {pct(data.closedIssues, data.openIssues + data.closedIssues)}% resolved lifetime</p>
              <ul className="mt-4 space-y-2">
                {SEV.map((s) => {
                  const n = data.issues.filter((i: any) => (i.severity ?? "medium").toLowerCase() === s).length;
                  return (
                    <li key={s} className="flex items-center gap-3">
                      <span className="w-16 font-mono text-[11px] uppercase text-muted-foreground">{s}</span>
                      <span className="flex-1"><Bar value={n} max={Math.max(1, data.issues.length)} tone={s === "critical" ? "destructive" : "primary"} /></span>
                      <span className="w-6 text-right text-xs tabular-nums">{n}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">{data.bom} BOM line items tracked</p>
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-3">
            <Panel title="Open issues" hint="Newest first">
              <div className="divide-y divide-border">
                {data.issues.length === 0 && <Empty>Backlog clear.</Empty>}
                {data.issues.slice(0, 6).map((i: any) => (
                  <RowLink key={i.id} to="/eng-projects" title={i.title} meta={`${i.severity ?? "medium"} · ${i.status ?? "open"}`} tone={(i.severity ?? "").toLowerCase() === "critical" ? "risk" : undefined} />
                ))}
              </div>
            </Panel>
            <Panel title="Milestones & reviews" hint="Gate events ahead">
              <div className="divide-y divide-border">
                {[...data.milestones, ...data.reviews].length === 0 && <Empty>Nothing scheduled.</Empty>}
                {data.milestones.map((m: any) => (
                  <RowLink key={m.id} to="/eng-projects" title={m.title} meta={`Milestone · ${m.due_date ?? "unscheduled"}`} badge="gate" />
                ))}
                {data.reviews.map((r: any) => (
                  <RowLink key={r.id} to="/eng-projects" title={r.title} meta={`Review · ${r.review_date ?? "unscheduled"}`} badge="review" />
                ))}
              </div>
            </Panel>
            <Panel title="Change control" hint="ECOs and engineering tasks">
              <div className="divide-y divide-border">
                {data.ecos.map((e: any) => (
                  <RowLink key={e.id} to="/eng-projects" title={e.title} meta={`ECO · ${e.status ?? "open"}`} badge="eco" />
                ))}
                {data.tasks.slice(0, 5).map((t: any) => (
                  <RowLink key={t.id} to="/tasks" title={t.title} meta={`${t.priority ?? "normal"} · ${t.due_date ?? "no due date"}`} />
                ))}
                {data.ecos.length === 0 && data.tasks.length === 0 && <Empty>No open changes.</Empty>}
              </div>
            </Panel>
          </section>
        </>
      )}
    </DashShell>
  );
}
