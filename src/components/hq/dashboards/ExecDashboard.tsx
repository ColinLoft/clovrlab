import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Donut, Bar, Empty, money, pct } from "./kit";

async function load() {
  const [objectives, detections, flights, fleetReady, fleetTotal, people, ecos, grants, donations, decisions] = await Promise.all([
    rows("exec_objectives", "id,title,owner_team,status,progress,quarter", (q: any) => q.order("created_at", { ascending: false }), 6),
    count("ops_detections"),
    count("ops_flights"),
    count("fleet_aircraft", (q: any) => q.eq("status", "available")),
    count("fleet_aircraft"),
    count("hr_employees", (q: any) => q.eq("status", "active")),
    count("eng_ecos", (q: any) => q.neq("status", "implemented")),
    rows("fund_grants", "id,title,funder,amount,stage,decision_on", (q: any) => q, 200),
    rows("fund_donations", "id,amount,received_on", (q: any) => q, 300),
    rows("exec_decisions", "id,title,owner_team,status,decided_on", (q: any) => q.order("decided_on", { ascending: false }), 5),
  ]);
  const awarded = grants.filter((g: any) => g.stage === "awarded").reduce((s: number, g: any) => s + Number(g.amount || 0), 0);
  const pipeline = grants.filter((g: any) => !["awarded", "declined"].includes(g.stage)).reduce((s: number, g: any) => s + Number(g.amount || 0), 0);
  const given = donations.reduce((s: number, dn: any) => s + Number(dn.amount || 0), 0);
  return { objectives, detections, flights, fleetReady, fleetTotal, people, ecos, awarded, pipeline, given, decisions, submitted: grants.filter((g: any) => g.stage === "submitted") };
}

export function ExecDashboard() {
  const { data, error } = useDash("exec", load);
  return (
    <DashShell
      eyebrow="Leadership"
      title="Organizational readiness"
      summary="One brief across missions, fleet, people and funding — and the calls that need to be made this week."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
            <div className="grid gap-6 lg:grid-cols-[repeat(3,auto)_1fr] lg:items-center">
              <Donut value={pct(data.fleetReady, data.fleetTotal)} label="Fleet ready" />
              <Donut value={pct(data.awarded, data.awarded + data.pipeline)} label="Funding won" />
              <Donut
                value={data.objectives.length ? Math.round(data.objectives.reduce((s: number, o: any) => s + Number(o.progress || 0), 0) / data.objectives.length) : 0}
                label="Objectives"
              />
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { k: "Detections", v: data.detections, to: "/ops/detections" },
                  { k: "Flights", v: data.flights, to: "/ops/flights" },
                  { k: "Headcount", v: data.people, to: "/employees" },
                  { k: "Given to date", v: money(data.given), to: "/fund/donations" },
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
            <Panel title="Objectives" hint="Progress across the organization">
              <div className="divide-y divide-border">
                {data.objectives.length === 0 && <Empty>No objectives set.</Empty>}
                {data.objectives.map((o: any) => (
                  <Link key={o.id} to="/exec/okrs" className="block px-4 py-3 hover:bg-muted/60">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium">{o.title}</span>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{o.progress ?? 0}%</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.owner_team ?? "Unowned"} · {o.quarter ?? "—"}</p>
                    <div className="mt-2"><Bar value={Number(o.progress ?? 0)} max={100} tone={o.status === "at_risk" ? "destructive" : "primary"} /></div>
                  </Link>
                ))}
              </div>
            </Panel>

            <div className="space-y-5">
              <Panel title="Needs a decision">
                <ul className="divide-y divide-border">
                  <li className="px-4 py-3">
                    <Link to="/eng/changes" className="font-medium hover:underline">{data.ecos} open engineering changes</Link>
                    <p className="text-xs text-muted-foreground">Design churn on the platform</p>
                  </li>
                  <li className="px-4 py-3">
                    <Link to="/fund/grants" className="font-medium hover:underline">{data.submitted.length} grants awaiting decision</Link>
                    <p className="text-xs text-muted-foreground">{money(data.pipeline)} in the pipeline</p>
                  </li>
                  <li className="px-4 py-3">
                    <Link to="/requests" className="font-medium hover:underline">Cross-team hand-offs</Link>
                    <p className="text-xs text-muted-foreground">Escalations routed to leadership</p>
                  </li>
                </ul>
              </Panel>
              <Panel title="Recent decisions">
                <ul className="divide-y divide-border">
                  {data.decisions.length === 0 && <Empty>Nothing logged yet.</Empty>}
                  {data.decisions.map((dc: any) => (
                    <li key={dc.id} className="px-4 py-3">
                      <Link to="/exec/decisions" className="text-sm font-medium hover:underline">{dc.title}</Link>
                      <p className="text-xs text-muted-foreground">{dc.owner_team ?? "Leadership"} · {dc.decided_on ?? "undated"}</p>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </section>
        </>
      )}
    </DashShell>
  );
}
