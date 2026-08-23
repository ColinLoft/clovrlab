import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollText, RefreshCw, Sparkles, Flame, CloudFog, AlertTriangle, Timer, PlayCircle,
  CheckCircle2, XCircle, BellRing, BellOff, ArrowUpRight, VolumeX, Radio,
} from "lucide-react";
import { WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Select, dt } from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";
import { fetchSweepRuns, type SweepRun } from "@/lib/net/settings";
import { fetchDetectionEvents, type DetectionEvent } from "@/lib/net/detection-log";
import { relTime } from "@/lib/net/alertwest";

export const Route = createFileRoute("/_hq/ops/logs")({
  head: () => ({
    meta: [
      { title: "Detection Logs — Clovr Labs" },
      { name: "description", content: "A minute-by-minute timeline of the detection network: sweeps starting and finishing, frame verdicts, incidents opened, pages sent and operator decisions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LogsPage,
});

const FILTERS = [
  { value: "all", label: "Everything" },
  { value: "sweeps", label: "Sweep start / end" },
  { value: "verdicts", label: "Frame verdicts" },
  { value: "flagged", label: "Fire & smoke only" },
  { value: "incidents", label: "Incidents opened" },
  { value: "paging", label: "Paging & acks" },
  { value: "operator", label: "Operator decisions" },
];

const META: Record<string, { label: string; icon: any; tone: "risk" | "warn" | "good" | "muted" }> = {
  sweep_start:      { label: "Sweep started",   icon: PlayCircle,   tone: "muted" },
  sweep_end:        { label: "Sweep finished",  icon: CheckCircle2, tone: "good" },
  sweep_blocked:    { label: "Sweep halted",    icon: AlertTriangle, tone: "risk" },
  verdict:          { label: "Frame verdict",   icon: ScrollText,   tone: "muted" },
  incident_opened:  { label: "Incident opened", icon: Flame,        tone: "risk" },
  confirmed:        { label: "Operator confirmed", icon: CheckCircle2, tone: "risk" },
  dismissed:        { label: "Operator dismissed", icon: XCircle,   tone: "muted" },
  muted:            { label: "Camera muted",    icon: VolumeX,      tone: "muted" },
  paged:            { label: "On-call paged",   icon: BellRing,     tone: "warn" },
  acked:            { label: "Page acknowledged", icon: BellOff,    tone: "good" },
  escalated:        { label: "Page escalated",  icon: ArrowUpRight, tone: "risk" },
};

function matches(filter: string, e: DetectionEvent) {
  switch (filter) {
    case "sweeps": return e.kind.startsWith("sweep_");
    case "verdicts": return e.kind === "verdict";
    case "flagged": return (e.label === "fire" || e.label === "smoke");
    case "incidents": return e.kind === "incident_opened";
    case "paging": return ["paged", "acked", "escalated"].includes(e.kind);
    case "operator": return ["confirmed", "dismissed", "muted"].includes(e.kind);
    default: return true;
  }
}

function LogsPage() {
  const [runs, setRuns] = useState<SweepRun[]>([]);
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([fetchSweepRuns(40).catch(() => []), fetchDetectionEvents(300).catch(() => [])])
      .then(([r, e]) => { if (!alive) return; setRuns(r); setEvents(e); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [tick]);

  // Live-ish refresh so an operator watching a sweep sees it progress.
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const visible = useMemo(() => events.filter((e) => matches(filter, e)), [events, filter]);

  const last24 = runs.filter((r) => Date.now() - new Date(r.created_at).getTime() < 864e5);
  const analyzed24 = last24.reduce((n, r) => n + r.analyzed, 0);
  const errors24 = last24.reduce((n, r) => n + r.error_count, 0);
  const incidents24 = events.filter(
    (e) => e.kind === "incident_opened" && Date.now() - new Date(e.created_at).getTime() < 864e5,
  ).length;
  const avgMs = last24.filter((r) => r.duration_ms).length
    ? Math.round(last24.reduce((n, r) => n + (r.duration_ms ?? 0), 0) / last24.filter((r) => r.duration_ms).length)
    : 0;

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Detection"
      title="Detection logs"
      lede="One timeline for the whole detection loop: when a sweep starts and ends, what the model said about each frame, which detections became incidents, who was paged and what a human decided."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      <StatRow>
        <Stat label="Sweeps (24h)" value={last24.length} icon={Sparkles} />
        <Stat label="Frames screened (24h)" value={analyzed24} icon={ScrollText} />
        <Stat label="Incidents opened (24h)" value={incidents24} icon={Flame} tone={incidents24 ? "risk" : "good"} />
        <Stat label="Sweep errors (24h)" value={errors24} icon={AlertTriangle} tone={errors24 ? "risk" : "good"} />
        <Stat label="Avg sweep time" value={avgMs ? `${(avgMs / 1000).toFixed(1)}s` : "—"} icon={Timer} />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <Card pad={false} title={`Sweep runs (${runs.length})`} hint="Newest first">
            <div className="max-h-[68vh] divide-y divide-border overflow-y-auto">
              {runs.length === 0 && <Empty>No sweeps have run yet.</Empty>}
              {runs.map((r) => (
                <div key={r.id} className="px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Pill tone={r.error_count ? "risk" : r.created_count ? "warn" : "good"}>{r.trigger}</Pill>
                    <span className="text-muted-foreground">{relTime(r.created_at)}</span>
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                      {r.duration_ms != null ? `${(r.duration_ms / 1000).toFixed(1)}s` : "running…"}
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
            title={`Timeline (${visible.length})`}
            hint="Sweeps, verdicts, incidents, pages and human decisions"
            action={<Select value={filter} onChange={setFilter} options={FILTERS} className="w-48" />}
          >
            <div className="max-h-[68vh] overflow-y-auto">
              {visible.length === 0 && <Empty>Nothing logged for this filter yet.</Empty>}
              <ol className="relative ml-5 border-l border-border">
                {visible.map((e) => {
                  const m = META[e.kind] ?? { label: e.kind.replace(/_/g, " "), icon: Radio, tone: "muted" as const };
                  const Icon = e.label === "fire" ? Flame : e.label === "smoke" ? CloudFog : m.icon;
                  return (
                    <li key={e.id} className="relative py-2.5 pl-5 pr-4 text-xs">
                      <span className="absolute -left-[9px] top-3.5 grid h-4 w-4 place-items-center rounded-full border border-border bg-background">
                        <Icon className={`h-2.5 w-2.5 ${
                          m.tone === "risk" ? "text-destructive"
                          : m.tone === "warn" ? "text-amber-500"
                          : m.tone === "good" ? "text-emerald-500" : "text-muted-foreground"}`} />
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone={m.tone}>{m.label}</Pill>
                        {e.label && <Pill tone={e.label === "fire" ? "risk" : e.label === "smoke" ? "warn" : "good"}>{e.label}</Pill>}
                        {e.confidence != null && <span className="font-mono text-[11px] text-muted-foreground">{Math.round(e.confidence)}%</span>}
                        {e.camera_name && <span className="font-medium">{e.camera_name}</span>}
                        {e.trigger && <span className="text-[11px] text-muted-foreground">{e.trigger}</span>}
                        {e.actor && <UserMention userId={e.actor} name="teammate" size="xs" />}
                        <span className="ml-auto font-mono text-[11px] text-muted-foreground">{dt(e.created_at)}</span>
                      </div>
                      {e.message && <p className="mt-1 text-muted-foreground">{e.message}</p>}
                      {e.incident_id && (
                        <Link to="/ops/incidents" search={{ id: e.incident_id } as never}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                          Open incident <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </Card>
        </div>
      )}
    </WorkPage>
  );
}
