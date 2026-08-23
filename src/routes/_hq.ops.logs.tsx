import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollText, RefreshCw, Sparkles, Flame, CloudFog, AlertTriangle, Timer } from "lucide-react";
import { WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Select, dt } from "@/components/hq/work/kit";
import { fetchSweepRuns, type SweepRun } from "@/lib/net/settings";
import { fetchSuggestionHistory, type SuggestionRow } from "@/lib/net/suggestions";
import { relTime } from "@/lib/net/alertwest";

export const Route = createFileRoute("/_hq/ops/logs")({
  head: () => ({
    meta: [
      { title: "Detection Logs — Clovr Labs" },
      { name: "description", content: "Every AI sweep and every frame verdict: when it ran, what it looked at, what it found and what an operator decided." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LogsPage,
});

const FILTERS = [
  { value: "all", label: "All verdicts" },
  { value: "fire", label: "Fire only" },
  { value: "smoke", label: "Smoke only" },
  { value: "clear", label: "Clear only" },
  { value: "pending", label: "Awaiting review" },
  { value: "promoted", label: "Confirmed" },
  { value: "dismissed", label: "Dismissed" },
];

function LogsPage() {
  const [runs, setRuns] = useState<SweepRun[]>([]);
  const [rows, setRows] = useState<SuggestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([fetchSweepRuns(40).catch(() => []), fetchSuggestionHistory(150).catch(() => [])])
      .then(([r, s]) => { if (!alive) return; setRuns(r); setRows(s); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [tick]);

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    if (["fire", "smoke", "clear"].includes(filter)) return rows.filter((r) => r.label === filter);
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  const last24 = runs.filter((r) => Date.now() - new Date(r.created_at).getTime() < 864e5);
  const analyzed24 = last24.reduce((n, r) => n + r.analyzed, 0);
  const errors24 = last24.reduce((n, r) => n + r.error_count, 0);
  const avgMs = last24.length
    ? Math.round(last24.reduce((n, r) => n + (r.duration_ms ?? 0), 0) / last24.length)
    : 0;

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Detection"
      title="Detection logs"
      lede="An audit trail of the detection network: every sweep that ran, how long it took, how many frames it screened, and what a human decided about each verdict."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      <StatRow>
        <Stat label="Sweeps (24h)" value={last24.length} icon={Sparkles} />
        <Stat label="Frames screened (24h)" value={analyzed24} icon={ScrollText} />
        <Stat label="Sweep errors (24h)" value={errors24} icon={AlertTriangle} tone={errors24 ? "risk" : "good"} />
        <Stat label="Avg sweep time" value={avgMs ? `${(avgMs / 1000).toFixed(1)}s` : "—"} icon={Timer} />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <Card pad={false} title={`Sweep runs (${runs.length})`} hint="Newest first">
            <div className="max-h-[64vh] divide-y divide-border overflow-y-auto">
              {runs.length === 0 && <Empty>No sweeps have run yet.</Empty>}
              {runs.map((r) => (
                <div key={r.id} className="px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Pill tone={r.error_count ? "risk" : r.created_count ? "warn" : "good"}>{r.trigger}</Pill>
                    <span className="text-muted-foreground">{relTime(r.created_at)}</span>
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                      {r.duration_ms != null ? `${(r.duration_ms / 1000).toFixed(1)}s` : "—"}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {r.analyzed} frame{r.analyzed === 1 ? "" : "s"} screened · {r.created_count} flagged · {r.error_count} error{r.error_count === 1 ? "" : "s"}
                  </p>
                  {r.first_error && <p className="mt-0.5 truncate text-destructive">{r.first_error}</p>}
                </div>
              ))}
            </div>
          </Card>

          <Card
            pad={false}
            title={`Frame verdicts (${visible.length})`}
            hint="What the model saw and what an operator decided"
            action={<Select value={filter} onChange={setFilter} options={FILTERS} className="w-44" />}
          >
            <div className="max-h-[64vh] divide-y divide-border overflow-y-auto">
              {visible.length === 0 && <Empty>Nothing logged for this filter.</Empty>}
              {visible.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                  {s.label === "fire" ? <Flame className="h-3.5 w-3.5 flex-none text-destructive" />
                    : s.label === "smoke" ? <CloudFog className="h-3.5 w-3.5 flex-none text-amber-500" />
                    : <ScrollText className="h-3.5 w-3.5 flex-none text-muted-foreground" />}
                  <Pill tone={s.label === "fire" ? "risk" : s.label === "smoke" ? "warn" : "good"}>{s.label}</Pill>
                  <span className="w-12 font-mono text-[11px] text-muted-foreground">{Math.round(s.confidence)}%</span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{s.camera_name ?? "Unknown camera"}</span>
                    <span className="text-muted-foreground"> · {s.reasoning ?? "no reasoning recorded"}</span>
                  </span>
                  <Pill tone={s.status === "promoted" ? "risk" : s.status === "dismissed" ? "muted" : "warn"}>{s.status}</Pill>
                  <span className="font-mono text-[11px] text-muted-foreground">{dt(s.created_at)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </WorkPage>
  );
}
