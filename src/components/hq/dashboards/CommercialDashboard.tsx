import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Empty, RowLink, Bar, money } from "./kit";

const STAGES = ["researching", "drafting", "submitted", "awarded", "declined"];

async function load() {
  const [grants, donors, donations, partners] = await Promise.all([
    rows("fund_grants", "id,title,funder,amount,stage,submitted_on,decision_on,program", (q: any) => q.order("decision_on", { nullsFirst: false }), 120),
    rows("fund_donors", "id,name,kind,tier,lifetime_amount,last_gift_on", (q: any) => q.order("lifetime_amount", { ascending: false }), 8),
    rows("fund_donations", "id,amount,received_on,campaign,restriction", (q: any) => q.order("received_on", { ascending: false }), 200),
    count("fund_donors"),
  ]);
  const pipeline = grants.filter((g: any) => !["awarded", "declined"].includes(g.stage)).reduce((s: number, g: any) => s + Number(g.amount || 0), 0);
  const awarded = grants.filter((g: any) => g.stage === "awarded").reduce((s: number, g: any) => s + Number(g.amount || 0), 0);
  const given = donations.reduce((s: number, d: any) => s + Number(d.amount || 0), 0);
  const restricted = donations.filter((d: any) => d.restriction && d.restriction !== "unrestricted").reduce((s: number, d: any) => s + Number(d.amount || 0), 0);
  return { grants, donors, donations, partners, pipeline, awarded, given, restricted };
}

export function CommercialDashboard() {
  const { data, error } = useDash("commercial", load);
  return (
    <DashShell
      eyebrow="Funding & partners"
      title="Fuel for the mission"
      summary="Grant pipeline by stage, top donor relationships and every gift landing in the ledger."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Grant pipeline</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">{money(data.pipeline)}</p>
              </div>
              <div className="flex flex-wrap gap-8 text-sm">
                <div><p className="text-xs uppercase text-muted-foreground">Awarded</p><p className="mt-1 text-xl font-semibold tabular-nums">{money(data.awarded)}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Gifts received</p><p className="mt-1 text-xl font-semibold tabular-nums">{money(data.given)}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Restricted</p><p className="mt-1 text-xl font-semibold tabular-nums">{money(data.restricted)}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Donors</p><p className="mt-1 text-xl font-semibold tabular-nums">{data.partners}</p></div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {STAGES.map((stage) => {
                const inStage = data.grants.filter((g: any) => (g.stage ?? "researching") === stage);
                const value = inStage.reduce((s: number, g: any) => s + Number(g.amount || 0), 0);
                return (
                  <Link key={stage} to="/fund/grants" className="rounded-lg border border-border p-3 transition hover:border-primary/60">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{stage}</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums">{money(value)}</p>
                    <p className="text-xs text-muted-foreground">{inStage.length} applications</p>
                    <div className="mt-2"><Bar value={value} max={Math.max(data.pipeline + data.awarded, 1)} tone={stage === "declined" ? "muted" : "primary"} /></div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-3">
            <Panel title="Awaiting decision">
              <div className="divide-y divide-border">
                {data.grants.filter((g: any) => g.stage === "submitted").length === 0 && <Empty>Nothing submitted.</Empty>}
                {data.grants.filter((g: any) => g.stage === "submitted").slice(0, 6).map((g: any) => (
                  <RowLink key={g.id} to="/fund/grants" title={g.title} meta={`${g.funder ?? "Funder"} · ${money(Number(g.amount || 0))} · decision ${g.decision_on ?? "TBD"}`} />
                ))}
              </div>
            </Panel>
            <Panel title="Top donors" hint="By lifetime giving">
              <div className="divide-y divide-border">
                {data.donors.length === 0 && <Empty>No donors on record.</Empty>}
                {data.donors.map((d: any) => (
                  <RowLink key={d.id} to="/fund/donors" title={d.name} meta={`${money(Number(d.lifetime_amount || 0))} lifetime · last gift ${d.last_gift_on ?? "n/a"}`} badge={d.tier ?? d.kind ?? undefined} />
                ))}
              </div>
            </Panel>
            <Panel title="Recent gifts">
              <div className="divide-y divide-border">
                {data.donations.length === 0 && <Empty>No gifts recorded.</Empty>}
                {data.donations.slice(0, 6).map((g: any) => (
                  <RowLink key={g.id} to="/fund/donations" title={money(Number(g.amount || 0))} meta={`${g.campaign ?? "General"} · ${g.received_on ?? ""}`} tone="good" />
                ))}
              </div>
            </Panel>
          </section>
        </>
      )}
    </DashShell>
  );
}
