import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Camera as CameraIcon, Sparkles, CheckCircle2, XCircle, BellOff, RefreshCw } from "lucide-react";
import {
  WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Toolbar,
} from "@/components/hq/work/kit";
import { fetchCameras, getStatus, relTime, type Camera } from "@/lib/net/alertwest";
import { sweepCameras } from "@/lib/net/ai-detect.functions";
import {
  fetchPendingSuggestions, fetchSweepStatus, promoteSuggestion, dismissSuggestion,
  markFalsePositive, muteCamera, type SuggestionRow, type SweepStatus,
} from "@/lib/net/suggestions";
import { fetchResponseArea, inArea, type ResponseArea } from "@/lib/net/area";

export const Route = createFileRoute("/_hq/ops/cameras")({
  head: () => ({
    meta: [
      { title: "Camera Network — Clovr Labs" },
      { name: "description", content: "Watch-camera network with AI smoke triage: sweep frames, review suggestions, promote real detections to incidents." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CamerasPage,
});

function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [area, setArea] = useState<ResponseArea | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([]);
  const [sweep, setSweep] = useState<SweepStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [cams, ar, sugg, st] = await Promise.all([
        fetchCameras().catch(() => [] as Camera[]),
        fetchResponseArea().catch(() => null),
        fetchPendingSuggestions().catch(() => [] as SuggestionRow[]),
        fetchSweepStatus().catch(() => null),
      ]);
      if (!alive) return;
      setCameras(cams); setArea(ar); setSuggestions(sugg); setSweep(st); setLoading(false);
    })();
    return () => { alive = false; };
  }, [tick]);

  const inRange = useMemo(
    () => cameras.filter((c) => inArea(area, { lat: Number(c.site.latitude), lng: Number(c.site.longitude) })),
    [cameras, area],
  );

  const filtered = useMemo(() => {
    if (!q) return inRange;
    const s = q.toLowerCase();
    return inRange.filter((c) => `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s));
  }, [inRange, q]);

  const runSweep = async () => {
    const batch = filtered.filter((c) => c.image.url).slice(0, 25);
    if (!batch.length) { alert("No camera frames available to analyse."); return; }
    setRunning(true);
    try {
      const res: any = await sweepCameras({
        data: {
          cameras: batch.map((c) => ({
            camera_id: c.site.id,
            camera_name: c.name,
            lat: Number(c.site.latitude),
            lng: Number(c.site.longitude),
            state: c.site.state,
            county: c.site.county,
            image_url: c.image.url as string,
            image_time: c.image.time ?? new Date().toISOString(),
          })),
        },
      });
      alert(`Analysed ${res.analyzed ?? 0} frames · ${res.created ?? 0} new suggestions${res.errors?.length ? `\n${res.errors[0]}` : ""}`);
      setTick((t) => t + 1);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const online = filtered.filter((c) => getStatus(c).label.toLowerCase() === "online").length;

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Detection"
      title="Camera network"
      lede="Watch cameras inside the response area, screened by an AI first pass. A person reviews every suggestion before it becomes an incident."
      actions={
        <>
          <Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>
          <Btn variant="primary" onClick={runSweep} disabled={running}>
            <Sparkles className="h-3.5 w-3.5" /> {running ? "Sweeping…" : "Run AI sweep"}
          </Btn>
        </>
      }
    >
      <StatRow>
        <Stat label="Cameras in area" value={filtered.length} icon={CameraIcon} />
        <Stat label="Reporting" value={online} tone={online ? "good" : "warn"} />
        <Stat label="Pending review" value={suggestions.length} icon={Sparkles} tone={suggestions.length ? "warn" : "good"} />
        <Stat label="Suggestions 24h" value={sweep?.total_24h ?? 0} hint={sweep?.last_run_at ? `Last ${new Date(sweep.last_run_at).toLocaleTimeString()}` : "No sweeps yet"} />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_minmax(340px,420px)]">
          <Card pad={false} title={`Review queue (${suggestions.length})`} hint="AI first pass — human decides">
            <div className="max-h-[72vh] divide-y divide-border overflow-y-auto">
              {suggestions.length === 0 && <Empty>Nothing waiting. Run a sweep to screen the latest frames.</Empty>}
              {suggestions.map((s) => (
                <div key={s.id} className="flex gap-3 p-3">
                  {s.image_url ? (
                    <img src={s.image_url} alt={`Frame from ${s.camera_name ?? "camera"}`} loading="lazy"
                      className="h-24 w-36 flex-none rounded-md border border-border object-cover" />
                  ) : <div className="h-24 w-36 flex-none rounded-md border border-border bg-muted" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Pill tone={s.label === "fire" ? "risk" : "warn"}>{s.label}</Pill>
                      <span className="text-xs text-muted-foreground">{Math.round(s.confidence)}% confidence</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-medium">{s.camera_name ?? "Unknown camera"}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{s.reasoning ?? "No reasoning recorded."}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Btn variant="primary" onClick={async () => { await promoteSuggestion(s); setTick((t) => t + 1); }}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Open incident
                      </Btn>
                      <Btn onClick={async () => { await markFalsePositive(s.id); setTick((t) => t + 1); }}>False positive</Btn>
                      <Btn variant="ghost" onClick={async () => { await dismissSuggestion(s.id); setTick((t) => t + 1); }}>
                        <XCircle className="h-3.5 w-3.5" /> Dismiss
                      </Btn>
                      {s.camera_id && (
                        <Btn variant="ghost" onClick={async () => { await muteCamera(s.camera_id!, s.camera_name, 24); setTick((t) => t + 1); }}>
                          <BellOff className="h-3.5 w-3.5" /> Mute 24h
                        </Btn>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Toolbar q={q} setQ={setQ} placeholder="Search cameras, counties…" />
            <Card pad={false} title="Cameras">
              <div className="max-h-[60vh] divide-y divide-border overflow-y-auto">
                {filtered.length === 0 && <Empty>No cameras inside the response area.</Empty>}
                {filtered.slice(0, 200).map((c) => {
                  const st = getStatus(c);
                  return (
                    <div key={c.site.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm">{c.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {c.site.county ?? "—"}, {c.site.state ?? "—"} · {relTime(c.image.time) ?? "no frame"}
                        </p>
                      </div>
                      <span className="rounded-full px-2 py-0.5 text-[11px]" style={{ color: st.color, border: `1px solid ${st.color}55` }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </WorkPage>
  );
}
