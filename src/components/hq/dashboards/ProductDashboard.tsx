import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Empty, Bar, pct } from "./kit";

const COLUMNS: { key: string; label: string; match: (s: string) => boolean }[] = [
  { key: "discovery", label: "Discovery", match: (s) => ["planned", "discovery", "backlog", "draft"].includes(s) },
  { key: "design", label: "Design", match: (s) => ["design", "in_review", "review"].includes(s) },
  { key: "build", label: "Build", match: (s) => ["active", "in_progress", "build", "open"].includes(s) },
  { key: "test", label: "Test & validate", match: (s) => ["testing", "validation", "qa", "blocked"].includes(s) },
];

async function load() {
  const [projects, milestones, issues, tasks, reviews, ecos] = await Promise.all([
    rows("eng_projects", "id,name,status,progress,target_date", (q: any) => q.neq("status", "complete"), 40),
    rows("eng_milestones", "id,title,status,due_date", (q: any) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 8),
    count("eng_issues", (q: any) => q.neq("status", "closed")),
    rows("eng_tasks", "id,title,status,due_date,priority", (q: any) => q.neq("status", "done"), 40),
    count("eng_design_reviews", (q: any) => q.neq("status", "approved")),
    count("eng_ecos", (q: any) => q.neq("status", "implemented")),
  ]);
  return { projects, milestones, issues, tasks, reviews, ecos };
}

export function ProductDashboard() {
  const { data, error } = useDash("product", load);
  return (
    <DashShell
      eyebrow="Product & program"
      title="Delivery board"
      summary="Every program on one board — where it sits in the lifecycle, what gates are next, and where delivery risk is building."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {COLUMNS.map((col) => {
              const items = data.projects.filter((p: any) => col.match((p.status ?? "").toLowerCase()));
              return (
                <div key={col.key} className="rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wide">{col.label}</h2>
                    <span className="rounded-full bg-background px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="space-y-2 p-2">
                    {items.length === 0 && <p className="p-4 text-center text-xs text-muted-foreground">Empty</p>}
                    {items.map((p: any) => (
                      <Link key={p.id} to="/product/roadmap" className="block rounded-md border border-border bg-card p-3 transition hover:border-primary/60">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{p.status ?? "—"} · {p.target_date ?? "no target"}</p>
                        <div className="mt-2"><Bar value={Number(p.progress ?? 0)} max={100} /></div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 py-3"><h2 className="text-sm font-semibold">Upcoming gates</h2></div>
              <ul className="divide-y divide-border">
                {data.milestones.length === 0 && <Empty>No milestones scheduled.</Empty>}
                {data.milestones.map((m: any) => (
                  <li key={m.id} className="flex items-center gap-4 px-4 py-3">
                    <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{m.due_date ?? "TBD"}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{m.title}</span>
                    <span className="text-xs text-muted-foreground">{m.status ?? "open"}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="space-y-3">
              {[
                { label: "Open issues", value: data.issues, to: "/eng/issues" },
                { label: "Reviews pending", value: data.reviews, to: "/eng/programs" },
                { label: "Open changes", value: data.ecos, to: "/eng/changes" },

                              ].slice(0, 3).map((s) => (
                <Link key={s.label} to={s.to as never} className="block rounded-lg border border-border bg-card p-4 hover:border-primary/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</p>
                </Link>
              ))}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Open work items</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{data.tasks.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Across all active programs</p>
              </div>
            </aside>
          </section>
        </>
      )}
    </DashShell>
  );
}
