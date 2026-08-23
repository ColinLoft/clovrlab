import { useEffect, useState } from "react";
import { Sparkles, Square, Flame, CloudFog, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, Btn, Pill, Empty, Stat, StatRow } from "@/components/hq/work/kit";
import { useAiScan } from "@/lib/net/scan";
import type { Camera } from "@/lib/net/alertwest";
import { relTime } from "@/lib/net/alertwest";
import {
  fetchPendingSuggestions, promoteSuggestion, markFalsePositive, type SuggestionRow,
} from "@/lib/net/suggestions";

/**
 * Manual AI check with live progress. Anything the model flags as fire or
 * smoke surfaces here as an alert the operator must confirm or reject — a
 * confirmation opens an incident, which pages the on-call rotation.
 */
export function ScanPanel({
  cameras,
  scope,
  onChanged,
  disabled,
}: {
  cameras: Camera[];
  scope: string;
  onChanged?: () => void;
  disabled?: boolean;
}) {
  const { stats, results, running, current, start, cancel, reset } = useAiScan();
  const [alerts, setAlerts] = useState<SuggestionRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const scanned = new Set(results.map((r) => r.camera_id));

  const refreshAlerts = () =>
    fetchPendingSuggestions()
      .then((rows) => setAlerts(rows.filter((r) => r.camera_id && scanned.has(r.camera_id))))
      .catch(() => {});

  useEffect(() => {
    if (!running && stats.finishedAt) refreshAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, stats.finishedAt]);

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
  const secs = stats.startedAt ? Math.round(((stats.finishedAt ?? Date.now()) - stats.startedAt) / 1000) : 0;

  const act = async (s: SuggestionRow, confirm: boolean) => {
    setBusy(s.id);
    try {
      if (confirm) await promoteSuggestion(s);
      else await markFalsePositive(s.id);
      setAlerts((a) => a.filter((x) => x.id !== s.id));
      onChanged?.();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card
      title="Manual AI check"
      hint={`${cameras.filter((c) => c.image.url).length} frames available · ${scope}`}
      action={
        running ? (
          <Btn onClick={cancel}><Square className="h-3.5 w-3.5" /> Stop</Btn>
        ) : (
          <div className="flex gap-1.5">
            {stats.finishedAt && <Btn variant="ghost" onClick={reset}>Clear</Btn>}
            <Btn variant="primary" disabled={disabled} onClick={() => start(cameras)}>
              <Sparkles className="h-3.5 w-3.5" /> Run AI check
            </Btn>
          </div>
        )
      }
    >
      {(running || stats.finishedAt) && (
        <>
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{running ? `Scanning ${current ?? "…"}` : `Scan complete in ${secs}s`}</span>
              <span className="font-mono">{stats.done}/{stats.total} · {pct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <StatRow>
            <Stat label="Frames analysed" value={stats.analyzed} />
            <Stat label="Fire signatures" value={stats.fire} icon={Flame} tone={stats.fire ? "risk" : "good"} />
            <Stat label="Smoke signatures" value={stats.smoke} icon={CloudFog} tone={stats.smoke ? "warn" : "good"} />
            <Stat label="Queued for review" value={stats.queued} tone={stats.queued ? "warn" : "good"} />
          </StatRow>

          {stats.paused && (
            <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
              AI automation paused mid-scan. Resume it in Enterprise Systems → Detection network.
            </p>
          )}
          {stats.errors.length > 0 && (
            <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {stats.errors[0]}{stats.errors.length > 1 ? ` (+${stats.errors.length - 1} more)` : ""}
            </p>
          )}
        </>
      )}

      {alerts.length > 0 && (
        <div className="mt-4 space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" /> {alerts.length} possible detection{alerts.length > 1 ? "s" : ""} need a human decision
          </p>
          {alerts.map((s) => (
            <div key={s.id} className="flex gap-3 rounded-md border border-border bg-background p-2">
              {s.image_url && (
                <img src={s.image_url} alt={`Frame from ${s.camera_name ?? "camera"}`} loading="lazy"
                  className="h-20 w-32 flex-none rounded border border-border object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Pill tone={s.label === "fire" ? "risk" : "warn"}>{s.label}</Pill>
                  <span className="text-xs text-muted-foreground">{Math.round(s.confidence)}% confidence</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{relTime(s.created_at)}</span>
                </div>
                <p className="mt-0.5 truncate text-sm font-medium">{s.camera_name ?? "Unknown camera"}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{s.reasoning ?? "No reasoning recorded."}</p>
                <div className="mt-1.5 flex gap-1.5">
                  <Btn variant="primary" disabled={busy === s.id} onClick={() => act(s, true)}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Confirm — open incident
                  </Btn>
                  <Btn disabled={busy === s.id} onClick={() => act(s, false)}>
                    <XCircle className="h-3.5 w-3.5" /> Not a fire
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!running && stats.finishedAt && alerts.length === 0 && (
        <Empty>Nothing suspicious in this sweep — every frame came back clear.</Empty>
      )}
      {!running && !stats.finishedAt && (
        <p className="text-xs leading-5 text-muted-foreground">
          Runs the detection model across the frames in view, in small batches, so you can watch verdicts land.
          Fire and smoke hits are held for your confirmation before an incident is opened.
        </p>
      )}
    </Card>
  );
}
