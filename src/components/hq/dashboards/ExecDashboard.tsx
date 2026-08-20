import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Donut, Bar, Empty, money, pct, today } from "./kit";

async function load() {
  const [missions, fleetReady, fleetTotal, people, openTickets, risks, invoices, expenses, ecos, incidents] = await Promise.all([
    count("con_jobs", (q: any) => q.eq("status", "active")),
    count("con_equipment", (q: any) => q.eq("status", "available")),
    count("con_equipment"),
    count("hr_employees", (q: any) => q.eq("status", "active")),
    count("cs_tickets", (q: any) => q.neq("status", "closed")),
    rows("con_safety_incidents", "id,incident_type,severity,incident_date,status", (q: any) => q.neq("status", "closed").order("incident_date", { ascending: false }), 5),
    rows("fin_invoices", "id,total,status,due_date", (q: any) => q, 300),
    rows("fin_expenses", "id,amount,spent_at", (q: any) => q, 300),
    count("eng_ecos", (q: any) => q.neq("status", "implemented")),
    rows("con_jobs", "id,name,job_number,stage,status,percent_complete,target_end_date", (q: any) => q.eq("status", "active").order("target_end_date", { nullsFirst: false }), 6),
  ]);
  const billed = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + Number(i.total || 0), 0);
  const outstanding = invoices.filter((i: any) => i.status !== "paid").reduce((s: number, i: any) => s + Number(i.total || 0), 0);
  const spend = expenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
  const overdue = invoices.filter((i: any) => i.status !== "paid" && i.due_date && i.due_date < today()).length;
  return { missions, fleetReady, fleetTotal, people, openTickets, risks, billed, outstanding, spend, overdue, ecos, incidents };
}

export function ExecDashboard() {
  const { data, error } = useDash("exec", load);
  return (
    <DashShell
      eyebrow="Executive command"
      title="Organizational readiness"
      summary="One brief across missions, fleet, people, funding and risk — the decisions that need an executive today."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
            <div className="grid gap-6 lg:grid-cols-[repeat(3,auto)_1fr] lg:items-center">
              <Donut value={pct(data.fleetReady, data.fleetTotal)} label="Fleet ready" />
              <Donut value={pct(data.billed, data.billed + data.outstanding)} label="Collected" />
              <Donut value={data.incidents.length ? Math.round(data.incidents.reduce((s: number, j: any) => s + Number(j.percent_complete || 0), 0) / data.incidents.length) : 0} label="Mission avg" />
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { k: "Active missions", v: data.missions, to: "/jobs" },
                  { k: "Headcount", v: data.people, to: "/employees" },
                  { k: "Open funding", v: money(data.outstanding), to: "/invoices" },
                  { k: "Period spend", v: money(data.spend), to: "/expenses" },
                ].map((s) => (
                  <Link key={s.k} to={s.to as never} className="rounded-lg border border-border/70 bg-background/60 p-3 hover:border-primary/60">
                    <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.k}</dt>
                    <dd className="mt-1 text-xl font-semibold tabular-nums">{s.v}</dd>
                  </Link>
                ))}
              </dl>
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <Panel title="Mission scorecard" hint="Active response operations by completion">
              <div className="divide-y divide-border">
                {data.incidents.length === 0 && <Empty>No active missions.</Empty>}
                {data.incidents.map((j: any) => (
                  <Link key={j.id} to="/jobs" className="block px-4 py-3 hover:bg-muted/60">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium">{j.name}</span>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{Number(j.percent_complete || 0)}%</span>
                    </div>
                    <div className="mt-2"><Bar value={Number(j.percent_complete || 0)} max={100} /></div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{j.job_number ?? "Mission"} · {j.stage ?? j.status ?? "active"} · target {j.target_end_date ?? "TBD"}</p>
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel title="Risk register" hint="Escalations awaiting a decision">
              <ul className="divide-y divide-border text-sm">
                {data.overdue > 0 && (
                  <li className="px-4 py-3"><Link to="/invoices" className="font-medium text-destructive hover:underline">{data.overdue} overdue invoices</Link><p className="text-xs text-muted-foreground">Cash collection at risk</p></li>
                )}
                {data.ecos > 0 && (
                  <li className="px-4 py-3"><Link to="/eng-projects" className="font-medium hover:underline">{data.ecos} open engineering changes</Link><p className="text-xs text-muted-foreground">Design churn on the platform</p></li>
                )}
                {data.openTickets > 0 && (
                  <li className="px-4 py-3"><Link to="/tickets" className="font-medium hover:underline">{data.openTickets} open partner requests</Link><p className="text-xs text-muted-foreground">External commitments outstanding</p></li>
                )}
                {data.risks.map((r: any) => (
                  <li key={r.id} className="px-4 py-3">
                    <Link to="/safety" className="font-medium hover:underline">{r.incident_type ?? "Safety event"}</Link>
                    <p className="text-xs text-muted-foreground">{r.severity ?? "review"} · {r.incident_date ?? "undated"}</p>
                  </li>
                ))}
                {data.risks.length === 0 && data.overdue === 0 && data.ecos === 0 && data.openTickets === 0 && <Empty>No escalations.</Empty>}
              </ul>
            </Panel>
          </section>
        </>
      )}
    </DashShell>
  );
}
