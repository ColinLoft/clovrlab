import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera as CameraIcon, Sparkles, CheckCircle2, XCircle, BellOff, RefreshCw, Star, Grid3X3, ListChecks } from "lucide-react";
import {
  WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Toolbar, Modal, Select,
} from "@/components/hq/work/kit";
import { fetchCameras, getStatus, relTime, type Camera } from "@/lib/net/alertwest";
import { sweepCameras } from "@/lib/net/ai-detect.functions";
import {
  fetchPendingSuggestions, fetchSweepStatus, promoteSuggestion, dismissSuggestion,
  markFalsePositive, muteCamera, type SuggestionRow, type SweepStatus,
} from "@/lib/net/suggestions";
import { fetchResponseArea, inArea, type ResponseArea } from "@/lib/net/area";
import { fetchSettings, fetchCameraPrefs, saveCameraPref, type NetSettings, type CameraPref } from "@/lib/net/settings";

export const Route = createFileRoute("/_hq/ops/cameras")({
  head: () => ({
    meta: [
      { title: "Camera Network — Clovr Labs" },
      { name: "description", content: "Watch-camera wall with live frames and AI smoke triage: sweep, inspect, and promote real detections to incidents." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CamerasPage,
});

const REFRESH_OPTIONS = [
  { value: "0", label: "Manual refresh" },
  { value: "60", label: "Auto every 1 min" },
  { value: "300", label: "Auto every 5 min" },
  { value: "900", label: "Auto every 15 min" },
];

function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [area, setArea] = useState<ResponseArea | null>(null);
  const [settings, setSettings] = useState<NetSettings | null>(null);
  const [prefs, setPrefs] = useState<Record<string, CameraPref>>({});
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([]);
  const [sweep, setSweep] = useState<SweepStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [q, setQ] = useState("");
  const [view, setView] = useState<"wall" | "queue">("wall");
  const [onlyPriority, setOnlyPriority] = useState(false);
  const [refreshSec, setRefreshSec] = useState("300");
  const [stamp, setStamp] = useState(Date.now());
  const [tick, setTick] = useState(0);
  const [detail, setDetail] = useState<Camera | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [cams, ar, sugg, st, cfg, pr] = await Promise.all([
        fetchCameras().catch(() => [] as Camera[]),
        fetchResponseArea().catch(() => null),
        fetchPendingSuggestions().catch(() => [] as SuggestionRow[]),
        fetchSweepStatus().catch(() => null),
        fetchSettings().catch(() => null),
        fetchCameraPrefs().catch(() => ({} as Record<string, CameraPref>)),
      ]);
      if (!alive) return;
      setCameras(cams); setArea(ar); setSuggestions(sugg); setSweep(st); setSettings(cfg); setPrefs(pr);
      setStamp(Date.now()); setLoading(false);
    })();
    return () => { alive = false; };
  }, [tick]);

  // Auto-refresh the frame cache-buster (and the queue) on the chosen cadence.
  useEffect(() => {
    const sec = Number(refreshSec);
    if (!sec) return;
    const id = setInterval(() => {
      setStamp(Date.now());
      fetchPendingSuggestions().then(setSuggestions).catch(() => {});
    }, sec * 1000);
    return () => clearInterval(id);
  }, [refreshSec]);

  const inRange = useMemo(
    () => cameras.filter((c) => inArea(area, { lat: Number(c.site.latitude), lng: Number(c.site.longitude), state: c.site.state, county: c.site.county })),
    [cameras, area],
  );

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    let list = s
      ? inRange.filter((c) => `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s))
      : inRange;
    if (onlyPriority) list = list.filter((c) => (prefs[c.site.id]?.priority ?? 0) > 0);
    return list
      .slice()
      .sort((a, b) => (prefs[b.site.id]?.priority ?? 0) - (prefs[a.site.id]?.priority ?? 0));
  }, [inRange, q, onlyPriority, prefs]);

  const wall = useMemo(() => filtered.filter((c) => c.image.url).slice(0, 60), [filtered]);

  const togglePriority = useCallback(async (c: Camera) => {
    const cur = prefs[c.site.id];
    const next: CameraPref = {
      camera_id: c.site.id,
      camera_name: c.name,
      watch: cur?.watch ?? true,
      priority: (cur?.priority ?? 0) > 0 ? 0 : 1,
      label: cur?.label ?? null,
      notes: cur?.notes ?? null,
    };
    setPrefs((p) => ({ ...p, [c.site.id]: next }));
    await saveCameraPref(next);
  }, [prefs]);

  const doSweep = async (batchCams: Camera[], label: string) => {
    const batch = batchCams.filter((c) => c.image.url).slice(0, Math.min(50, Number(settings?.sweep_batch_size ?? 25)));
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
      alert(
        res.paused
          ? "AI sweep halted — automation paused. Check Enterprise Systems → Detection network."
          : `${label}: analysed ${res.analyzed ?? 0} frames · ${res.created ?? 0} new suggestions${res.errors?.length ? `\n${res.errors[0]}` : ""}`,
      );
      setTick((t) => t + 1);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const online = filtered.filter((c) => getStatus(c).status === "online").length;
  const frameUrl = (c: Camera) => (c.image.url ? `${c.image.url}${c.image.url.includes("?") ? "&" : "?"}t=${stamp}` : null);

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Detection"
      title="Camera network"
      lede="A live wall of watch cameras inside the response area, screened by an AI first pass. A person reviews every suggestion before it becomes an incident."
      actions={
        <>
          <Select value={refreshSec} onChange={setRefreshSec} options={REFRESH_OPTIONS} className="w-40" />
          <Btn onClick={() => { setStamp(Date.now()); setTick((t) => t + 1); }}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>
          <Btn variant="primary" onClick={() => doSweep(filtered, "Sweep")} disabled={running || settings?.paused}>
            <Sparkles className="h-3.5 w-3.5" /> {running ? "Sweeping…" : "Run AI sweep"}
          </Btn>
        </>
      }
    >
      {settings?.paused && (
        <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-500">
          AI automation is paused{settings.pause_reason ? ` — ${settings.pause_reason}` : ""}. Resume it in Enterprise Systems → Detection network.
        </div>
      )}

      <StatRow>
        <Stat label="Cameras in area" value={filtered.length} icon={CameraIcon} />
        <Stat label="Reporting" value={online} tone={online ? "good" : "warn"} />
        <Stat label="Pending review" value={suggestions.length} icon={Sparkles} tone={suggestions.length ? "warn" : "good"} />
        <Stat
          label="Sweeps"
          value={settings?.sweep_enabled ? `Every ${settings.sweep_interval_hours}h` : "Manual"}
          hint={sweep?.last_run_at ? `Last suggestion ${relTime(sweep.last_run_at)}` : "No sweeps yet"}
        />
      </StatRow>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          <Btn variant={view === "wall" ? "primary" : "default"} onClick={() => setView("wall")}><Grid3X3 className="h-3.5 w-3.5" /> Camera wall</Btn>
          <Btn variant={view === "queue" ? "primary" : "default"} onClick={() => setView("queue")}>
            <ListChecks className="h-3.5 w-3.5" /> Review queue{suggestions.length ? ` (${suggestions.length})` : ""}
          </Btn>
        </div>
        <Btn variant={onlyPriority ? "primary" : "default"} onClick={() => setOnlyPriority((v) => !v)}>
          <Star className="h-3.5 w-3.5" /> Priority only
        </Btn>
        <div className="min-w-[220px] flex-1"><Toolbar q={q} setQ={setQ} placeholder="Search cameras, counties…" /></div>
      </div>

      {loading ? <Loading /> : view === "wall" ? (
        <Card className="mt-4" pad={false} title={`Live frames (${wall.length})`} hint="Click a tile for the full frame, PTZ and a single-camera sweep">
          {wall.length === 0 ? <Empty>No camera frames inside the response area.</Empty> : (
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {wall.map((c) => {
                const st = getStatus(c);
                const pri = (prefs[c.site.id]?.priority ?? 0) > 0;
                return (
                  <button key={c.site.id} onClick={() => setDetail(c)}
                    className="group relative overflow-hidden rounded-md border border-border text-left transition hover:border-primary">
                    <img src={frameUrl(c) ?? ""} alt={`Latest frame from ${c.name}`} loading="lazy"
                      className="h-32 w-full bg-muted object-cover transition group-hover:scale-[1.02]" />
                    {pri && <Star className="absolute left-2 top-2 h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ background: st.color }} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="truncate text-[11px] font-medium text-white">{c.name}</p>
                      <p className="truncate font-mono text-[10px] text-white/70">
                        {c.site.county ?? "—"} · {relTime(c.image.time) ?? "no frame"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>
      ) : (
        <Card className="mt-4" pad={false} title={`Review queue (${suggestions.length})`} hint="AI first pass — a human decides">
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
                    <span className="ml-auto text-[11px] text-muted-foreground">{relTime(s.created_at)}</span>
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
      )}

      {detail && (
        <Modal wide title={detail.name} onClose={() => setDetail(null)}>
          <img src={frameUrl(detail) ?? ""} alt={`Full frame from ${detail.name}`}
            className="max-h-[55vh] w-full rounded-md border border-border bg-muted object-contain" />
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-4">
            <Meta label="Status" value={getStatus(detail).label} />
            <Meta label="Frame age" value={relTime(detail.image.time) ?? "—"} />
            <Meta label="Coordinates" value={`${Number(detail.site.latitude).toFixed(3)}, ${Number(detail.site.longitude).toFixed(3)}`} />
            <Meta label="County / state" value={`${detail.site.county ?? "—"}, ${detail.site.state ?? "—"}`} />
            <Meta label="Pan" value={detail.position.pan ?? "—"} />
            <Meta label="Tilt" value={detail.position.tilt ?? "—"} />
            <Meta label="Zoom" value={detail.position.zoom ?? "—"} />
            <Meta label="Priority" value={(prefs[detail.site.id]?.priority ?? 0) > 0 ? "Priority" : "Standard"} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            <Btn variant="primary" disabled={running || settings?.paused} onClick={() => doSweep([detail], detail.name)}>
              <Sparkles className="h-3.5 w-3.5" /> Sweep this camera
            </Btn>
            <Btn onClick={() => togglePriority(detail)}>
              <Star className="h-3.5 w-3.5" /> {(prefs[detail.site.id]?.priority ?? 0) > 0 ? "Remove priority" : "Mark priority"}
            </Btn>
            <Btn variant="ghost" onClick={async () => { await muteCamera(detail.site.id, detail.name, 24); setDetail(null); setTick((t) => t + 1); }}>
              <BellOff className="h-3.5 w-3.5" /> Mute 24h
            </Btn>
            <Btn variant="ghost" onClick={() => setStamp(Date.now())}><RefreshCw className="h-3.5 w-3.5" /> Refresh frame</Btn>
          </div>
        </Modal>
      )}
    </WorkPage>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium">{value}</p>
    </div>
  );
}
