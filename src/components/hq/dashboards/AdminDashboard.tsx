import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Empty, RowLink, Donut, Bar, pct } from "./kit";
import { UserMention } from "@/components/hq/UserMention";

async function load() {
  const [employees, applicants, onboarding, timeOff, training, certs, reviews, depts] = await Promise.all([
    rows("hr_employees", "id,user_id,full_name,title,department,status,start_date", (q: any) => q.order("start_date", { ascending: false }), 200),
    rows("hr_applicants", "id,name,stage,role,created_at", (q: any) => q.not("stage", "in", "(hired,rejected)").order("created_at", { ascending: false }), 6),
    rows("hr_onboarding", "id,task,status,due_date,assignee_id", (q: any) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 6),
    rows("hr_time_off", "id,type,status,start_date,end_date,user_id", (q: any) => q.eq("status", "pending").order("start_date"), 6),
    count("hr_training", (q: any) => q.neq("status", "complete")),
    rows("hr_certifications", "id,name,expires_date,user_id", (q: any) => q.order("expires_date", { nullsFirst: false }), 6),
    count("hr_reviews", (q: any) => q.neq("status", "complete")),
    rows("hr_departments", "id,name", (q: any) => q, 20),
  ]);
  const active = employees.filter((e: any) => e.status === "active");
  const byDept: Record<string, number> = {};
  active.forEach((e: any) => { const d = e.department || "Unassigned"; byDept[d] = (byDept[d] ?? 0) + 1; });
  const recent = employees.slice(0, 5);
  return { employees, active, byDept, recent, applicants, onboarding, timeOff, training, certs, reviews, depts };
}

export function AdminDashboard() {
  const { data, error } = useDash("admin", load);
  return (
    <DashShell
      eyebrow="People & administration"
      title="Organization health"
      summary="Headcount distribution, hiring funnel, onboarding progress, leave coverage and compliance expiry."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="rounded-xl border border-border bg-card p-5 text-center">
              <Donut value={pct(data.active.length, data.employees.length)} label="Active" />
              <p className="mt-4 text-3xl font-semibold tabular-nums">{data.active.length}</p>
              <p className="text-xs text-muted-foreground">people on the team · {data.depts.length} departments</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div><p className="font-semibold tabular-nums">{data.applicants.length}</p><p className="text-muted-foreground">Applicants</p></div>
                <div><p className="font-semibold tabular-nums">{data.training}</p><p className="text-muted-foreground">Training</p></div>
                <div><p className="font-semibold tabular-nums">{data.reviews}</p><p className="text-muted-foreground">Reviews</p></div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Headcount by department</h2>
              <div className="mt-4 space-y-3">
                {Object.keys(data.byDept).length === 0 && <Empty>No employee records.</Empty>}
                {Object.entries(data.byDept)
                  .sort((a, b) => b[1] - a[1])
                  .map(([dept, n]) => (
                    <div key={dept}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate font-medium">{dept}</span>
                        <span className="tabular-nums text-muted-foreground">{n}</span>
                      </div>
                      <div className="mt-1"><Bar value={n} max={Math.max(...Object.values(data.byDept), 1)} /></div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            <Panel title="Newest teammates">
              <ul className="divide-y divide-border">
                {data.recent.length === 0 && <Empty>No records.</Empty>}
                {data.recent.map((e: any) => (
                  <li key={e.id} className="px-4 py-3 text-sm">
                    <UserMention userId={e.user_id} name={e.full_name ?? "Team member"} />
                    <p className="text-xs text-muted-foreground">{e.title ?? "—"} · started {e.start_date ?? "n/a"}</p>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Hiring funnel">
              <div className="divide-y divide-border">
                {data.applicants.length === 0 && <Empty>No open applicants.</Empty>}
                {data.applicants.map((a: any) => (
                  <RowLink key={a.id} to="/hiring" title={a.name} meta={`${a.role ?? "Role TBD"} · ${a.stage ?? "applied"}`} />
                ))}
              </div>
            </Panel>
            <Panel title="Onboarding">
              <div className="divide-y divide-border">
                {data.onboarding.length === 0 && <Empty>All tasks complete.</Empty>}
                {data.onboarding.map((o: any) => (
                  <RowLink key={o.id} to="/onboarding" title={o.task} meta={`${o.status ?? "pending"} · ${o.due_date ?? "no due date"}`} />
                ))}
              </div>
            </Panel>
            <Panel title="Leave & compliance">
              <div className="divide-y divide-border">
                {data.timeOff.map((t: any) => (
                  <RowLink key={t.id} to="/time-off" title={t.type ?? "Time off"} meta={`${t.start_date ?? ""} → ${t.end_date ?? ""}`} badge="pending" />
                ))}
                {data.certs.map((c: any) => (
                  <RowLink key={c.id} to="/certifications" title={c.name} meta={`expires ${c.expires_date ?? "n/a"}`} tone="warn" />
                ))}
                {data.timeOff.length === 0 && data.certs.length === 0 && <Empty>Nothing pending.</Empty>}
              </div>
            </Panel>
          </section>
        </>
      )}
    </DashShell>
  );
}
