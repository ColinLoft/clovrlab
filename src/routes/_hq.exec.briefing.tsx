import { createFileRoute, Link } from "@tanstack/react-router";
import { Gauge, Target, Radar, Plane, Coins, Bug } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, money, pct, Bar, d,
  useRows,
} from "@/components/hq/work/kit";

function Briefing() {
  const objectives = useRows<any>("exec_objectives", { order: { column: "created_at" } });
  const detections = useRows<any>("ops_detections", { order: { column: "created_at" }, limit: 100 });
  const flights = useRows<any>("ops_flights", { order: { column: "created_at" }, limit: 100 });
  const aircraft = useRows<any>("fleet_aircraft", { limit: 100 });
  const grants = useRows<any>("fund_grants", { limit: 200 });
  const issues = useRows<any>("eng_issues", { limit: 200 });
  const requests = useRows<any>("team_requests", { order: { column: "created_at" }, limit: 50 });

  const ready = aircraft.rows.filter((a) => ["available", "ready"].includes(String(a.status).toLowerCase())).length;
  const awarded = grants.rows.filter((g) => g.stage === "awarded").reduce((s, g) => s + Number(g.amount || 0), 0);
  const blockers = issues.rows.filter((i) => ["critical", "high"].includes(String(i.severity ?? i.priority).toLowerCase()) && i.status !== "closed");

  return (
    <WorkPage
      eyebrow="Leadership"
      title="Org briefing"
      lede="One read of the whole organization: what flew, what is funded, what is blocked, and who needs a decision."
      wide
    >
      <StatRow cols={5}>
        <Stat label="Detections logged" value={detections.rows.length} icon={Radar} />
        <Stat label="Flights flown" value={flights.rows.length} icon={Plane} />
        <Stat label="Aircraft ready" value={`${ready}/${aircraft.rows.length}`} tone={ready ? "good" : "warn"} icon={Gauge} />
        <Stat label="Funding awarded" value={money(awarded)} icon={Coins} />
        <Stat label="High-severity issues" value={blockers.length} tone={blockers.length ? "risk" : "good"} icon={Bug} />
      </StatRow>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card title="Objectives this quarter" hint="Progress rolled up from every team" pad={false}
          action={<Link to="/exec/okrs" className="text-xs font-medium text-primary hover:underline">Open OKRs</Link>}>
          {objectives.loading ? <Loading /> : objectives.rows.length === 0 ? <Empty>No objectives set for this quarter.</Empty> : (
            <ul className="divide-y divide-border">
              {objectives.rows.map((o) => (
                <li key={o.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{o.title}</p>
                    <Pill tone={statusTone(o.status)}>{o.status || "planned"}</Pill>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{o.owner_team || "Unowned"} · {o.quarter || "—"}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <Bar value={Number(o.progress || 0)} />
                    <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{o.progress ?? 0}%</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-4">
          <Card title="Waiting on leadership" hint="Cross-team requests escalated here" pad={false}>
            {requests.loading ? <Loading /> : requests.rows.filter((r) => r.to_team === "Leadership" && r.status !== "closed").length === 0 ? (
              <Empty>Nothing waiting on you.</Empty>
            ) : (
              <ul className="divide-y divide-border">
                {requests.rows.filter((r) => r.to_team === "Leadership" && r.status !== "closed").map((r) => (
                  <li key={r.id} className="px-4 py-3">
                    <p className="text-sm font-medium">{r.subject}</p>
                    <p className="text-xs text-muted-foreground">From {r.from_team} · due {d(r.due_date)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Where the risk is">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Fleet availability</span>
                <span className="tabular-nums">{pct(ready, aircraft.rows.length || 1)}%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Open high-severity issues</span>
                <span className="tabular-nums">{blockers.length}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Grants awaiting decision</span>
                <span className="tabular-nums">{grants.rows.filter((g) => g.stage === "submitted").length}</span>
              </li>
            </ul>
            <Link to="/exec/decisions" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
              <Target className="h-3.5 w-3.5" /> Record a decision
            </Link>
          </Card>
        </div>
      </div>
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/exec/briefing")({
  head: () => ({ meta: [{ title: "Org briefing — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Briefing,
});
