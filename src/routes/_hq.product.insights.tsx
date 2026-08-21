import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageSquareHeart, TrendingUp } from "lucide-react";
import {
  useRows, WorkPage, Card, Pill, Empty, Loading, Stat, StatRow, Bar, statusTone, titleCase, dt,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/product/insights")({
  head: () => ({ meta: [{ title: "Field Insights — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: InsightsPage,
});

const IMPACTS = ["blocker", "high", "medium", "low"];

function InsightsPage() {
  const { rows, loading, patch } = useRows<any>("prod_feedback", { order: { column: "created_at", ascending: false } });
  const { rows: features } = useRows<any>("prod_features", { select: "id, title, stage" });
  const [team, setTeam] = useState("all");

  const teams = useMemo(() => [...new Set(rows.map((r) => r.source_team).filter(Boolean))], [rows]);
  const shown = useMemo(() => rows.filter((r) => team === "all" || r.source_team === team), [rows, team]);

  const byImpact = IMPACTS.map((i) => ({ impact: i, items: shown.filter((r) => (r.impact || "medium") === i) }));
  const linked = shown.filter((r) => r.feature_id).length;
  const open = shown.filter((r) => r.status !== "closed" && r.status !== "resolved").length;
  const maxTeam = Math.max(1, ...teams.map((t) => rows.filter((r) => r.source_team === t).length));

  return (
    <WorkPage
      wide
      eyebrow="Product & Program"
      title="Field insights"
      lede="What operators, engineers and partners actually told us — sorted by how much it hurts, and whether it turned into a commitment."
    >
      <StatRow cols={4}>
        <Stat label="Signals collected" value={shown.length} icon={MessageSquareHeart} />
        <Stat label="Still open" value={open} tone={open ? "warn" : "good"} />
        <Stat label="Turned into features" value={linked} tone="good" icon={TrendingUp} />
        <Stat label="Conversion" value={`${shown.length ? Math.round((linked / shown.length) * 100) : 0}%`} />
      </StatRow>

      <div className="mt-5 grid gap-4 xl:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <Card title="Where it came from" pad={false}>
            <div className="space-y-3 p-4">
              {teams.length === 0 && <p className="text-xs text-muted-foreground">No sources yet.</p>}
              {teams.map((t) => {
                const n = rows.filter((r) => r.source_team === t).length;
                return (
                  <button key={t} onClick={() => setTeam(team === t ? "all" : t)} className="block w-full text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className={team === t ? "font-semibold text-primary" : ""}>{titleCase(t)}</span>
                      <span className="tabular-nums text-muted-foreground">{n}</span>
                    </div>
                    <div className="mt-1"><Bar value={n} max={maxTeam} /></div>
                  </button>
                );
              })}
            </div>
          </Card>
          {team !== "all" && (
            <button onClick={() => setTeam("all")} className="w-full rounded-md border border-border py-2 text-xs hover:bg-muted">
              Clear filter
            </button>
          )}
        </div>

        {loading ? <Loading /> : (
          <div className="space-y-4">
            {byImpact.map(({ impact, items }) => (
              <Card
                key={impact}
                pad={false}
                title={`${titleCase(impact)} impact`}
                hint={impact === "blocker" ? "Stops the mission — decide this week" : undefined}
                action={<span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>}
              >
                {items.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-muted-foreground">Nothing at this level.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {items.map((r) => {
                      const f = features.find((x) => x.id === r.feature_id);
                      return (
                        <div key={r.id} className="px-4 py-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="min-w-[200px] flex-1 text-sm font-medium">{r.summary}</p>
                            <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                            <select
                              value={r.status ?? "new"}
                              onChange={(e) => patch(r.id, { status: e.target.value })}
                              className="rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                            >
                              {["new", "triaged", "planned", "resolved", "closed"].map((s) => (
                                <option key={s} value={s}>{titleCase(s)}</option>
                              ))}
                            </select>
                          </div>
                          {r.details && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.details}</p>}
                          <p className="mt-1.5 text-[11px] text-muted-foreground">
                            {titleCase(r.source_team)} · {dt(r.created_at)}
                            {f && <> · linked to <span className="text-primary">{f.title}</span></>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            ))}
            {shown.length === 0 && <Card><Empty>No field feedback recorded yet.</Empty></Card>}
          </div>
        )}
      </div>
    </WorkPage>
  );
}
