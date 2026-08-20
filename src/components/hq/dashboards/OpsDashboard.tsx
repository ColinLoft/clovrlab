import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Empty, RowLink, Bar, pct } from "./kit";

async function load() {
  const [detections, flights, authorizations, ready, fleet, grounded, handoffs] = await Promise.all([
    rows("ops_detections", "id,name,region,severity,status,confidence,detected_at", (q: any) => q.neq("status", "closed").order("detected_at", { ascending: false }), 8),
    rows("ops_flights", "id,callsign,objective,status,departs_at,outcome", (q: any) => q.order("departs_at", { ascending: false }), 8),
    rows("ops_authorizations", "id,reference,authority,region,status,ends_at", (q: any) => q.order("ends_at", { nullsFirst: false }), 6),
    count("fleet_aircraft", (q: any) => q.eq("status", "available")),
    count("fleet_aircraft"),
    rows("fleet_maintenance", "id,title,severity,grounding,status", (q: any) => q.eq("grounding", true).neq("status", "closed"), 5),
    rows("team_requests", "id,subject,from_team,priority,status,due_date", (q: any) => q.eq("to_team", "Operations").neq("status", "closed").order("created_at", { ascending: false }), 5),
  ]);
  return { detections, flights, authorizations, ready, fleet, grounded, handoffs };
}

export function OpsDashboard() {
  const { data, error } = useDash("ops", load);
  return (
    <DashShell
      eyebrow="Mission operations"
      title="Live operational picture"
      summary="Active detections, aircraft in the air, airspace approvals and anything grounding the fleet."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.detections.slice(0, 4).map((dtn: any) => (
              <Link key={dtn.id} to="/ops/detections" className="rounded-lg border border-primary/30 bg-primary/5 p-4 transition hover:border-primary">
                <p className="font-mono text-[11px] uppercase tracking-widest text-primary">{dtn.region ?? "UNKNOWN SECTOR"}</p>
                <p className="mt-2 truncate text-base font-semibold">{dtn.name ?? "Unnamed detection"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{dtn.severity ?? "review"} · {dtn.status ?? "new"}</p>
                <div className="mt-3"><Bar value={Math.round(Number(dtn.confidence ?? 0) * (Number(dtn.confidence ?? 0) <= 1 ? 100 : 1))} max={100} /></div>
              </Link>
            ))}
            {data.detections.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground sm:col-span-2 xl:col-span-4">
                No open detections. Sensors are quiet.
              </div>
            )}
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_320px]">
            <Panel title="Flight log" hint="Most recent sorties">
              <div className="divide-y divide-border">
                {data.flights.length === 0 && <Empty>No flights recorded.</Empty>}
                {data.flights.map((f: any) => (
                  <RowLink key={f.id} to="/ops/flights" title={f.callsign ?? "Sortie"} meta={`${f.objective ?? "Patrol"} · ${f.departs_at?.slice(0, 16).replace("T", " ") ?? "unscheduled"}`} badge={f.status ?? "planned"} />
                ))}
              </div>
            </Panel>

            <Panel title="Airspace approvals" hint="Authorizations in force">
              <div className="divide-y divide-border">
                {data.authorizations.length === 0 && <Empty>Nothing on file.</Empty>}
                {data.authorizations.map((a: any) => (
                  <RowLink key={a.id} to="/ops/airspace" title={a.reference ?? "Authorization"} meta={`${a.authority ?? "authority"} · ${a.region ?? "region"}`} badge={a.status ?? "pending"} />
                ))}
              </div>
            </Panel>

            <aside className="space-y-5">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Fleet availability</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{data.ready}<span className="text-base text-muted-foreground">/{data.fleet}</span></p>
                <div className="mt-2"><Bar value={data.ready} max={Math.max(data.fleet, 1)} /></div>
                <p className="mt-2 text-xs text-muted-foreground">{pct(data.ready, data.fleet)}% mission capable</p>
              </div>
              <Panel title="Grounding faults">
                <div className="divide-y divide-border">
                  {data.grounded.length === 0 && <Empty>Nothing grounded.</Empty>}
                  {data.grounded.map((m: any) => (
                    <RowLink key={m.id} to="/ops/readiness" title={m.title} meta={`${m.severity ?? "review"} · ${m.status ?? "open"}`} tone="risk" />
                  ))}
                </div>
              </Panel>
              <Panel title="Asks from other teams">
                <div className="divide-y divide-border">
                  {data.handoffs.length === 0 && <Empty>Nothing waiting on Operations.</Empty>}
                  {data.handoffs.map((r: any) => (
                    <RowLink key={r.id} to="/requests" title={r.subject} meta={`${r.from_team} · ${r.priority ?? "normal"}`} />
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
