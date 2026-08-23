import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flame, Radio, Plane, Clock, RefreshCw, Download, Printer, Image as ImageIcon, Trash2, AlertTriangle, ClipboardCheck, Send } from "lucide-react";
import {
  WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Toolbar, Select, dt,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

import {
  fetchIncidents, fetchIncidentEvents, updateIncidentStatus,
  fetchIncidentMedia, addIncidentMedia, deleteIncidentMedia, addIncidentNote,
  resolveIncident, closeIncident, reopenIncident, saveIncidentReview, setIncidentHighRisk,
  RESOLUTIONS,
  STATUS_META, PRIORITY_META,
  type IncidentRow, type IncidentEvent, type IncidentStatus, type IncidentMedia,
} from "@/lib/net/incidents";
import { downloadCsv, printReport } from "@/lib/net/export";
import { fetchDrones, type DroneRow } from "@/lib/net/drones";
import { rankCandidates, assignDroneToIncident, releaseDroneFromIncident, markDroneInflight } from "@/lib/net/dispatch";


export const Route = createFileRoute("/_hq/ops/incidents")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s['id'] === "string" ? s['id'] : undefined }),
  head: () => ({
    meta: [
      { title: "Incidents & Dispatch — Clovr Labs" },
      { name: "description", content: "Track live incidents from detection to hand-off and dispatch the right aircraft with range and battery checks." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: IncidentsPage,
});

const STATUSES = Object.keys(STATUS_META) as IncidentStatus[];

function IncidentsPage() {
  const search = Route.useSearch();
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [drones, setDrones] = useState<DroneRow[]>([]);
  const [events, setEvents] = useState<IncidentEvent[]>([]);
  const [media, setMedia] = useState<IncidentMedia[]>([]);

  const [selected, setSelected] = useState<string | null>(search.id ?? null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(search.id ? "all" : "open");
  const [tick, setTick] = useState(0);


  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [inc, dr] = await Promise.all([
        fetchIncidents().catch(() => [] as IncidentRow[]),
        fetchDrones().catch(() => [] as DroneRow[]),
      ]);
      if (!alive) return;
      setIncidents(inc); setDrones(dr); setLoading(false);
    })();
    return () => { alive = false; };
  }, [tick]);

  const filtered = useMemo(() => {
    return incidents.filter((i) => {
      if (status === "open" && ["closed", "false_positive"].includes(i.status)) return false;
      if (status !== "open" && status !== "all" && i.status !== status) return false;
      if (q && !`${i.title} ${i.county ?? ""} ${i.state ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [incidents, q, status]);

  const current = filtered.find((i) => i.id === selected) ?? filtered[0] ?? null;

  useEffect(() => {
    if (!current) { setEvents([]); setMedia([]); return; }
    let alive = true;
    fetchIncidentEvents(current.id).then((e) => alive && setEvents(e)).catch(() => setEvents([]));
    fetchIncidentMedia(current.id).then((m) => alive && setMedia(m)).catch(() => setMedia([]));
    return () => { alive = false; };
  }, [current?.id, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const exportTimeline = (mode: "csv" | "pdf") => {
    if (!current) return;
    const columns = [
      { key: "time", label: "Time (UTC)" },
      { key: "type", label: "Event" },
      { key: "message", label: "Detail" },
    ];
    const rows = [...events].reverse().map((e) => ({
      time: new Date(e.created_at).toISOString(),
      type: e.event_type.replace(/_/g, " "),
      message: e.message ?? "",
    }));
    const slug = current.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    if (mode === "csv") return downloadCsv(`incident-${slug}`, columns, rows);
    printReport({
      title: `Incident report — ${current.title}`,
      subtitle: `${current.source.toUpperCase()} · ${STATUS_META[current.status]?.label} · discovered ${dt(current.discovered_at)}`,
      columns,
      rows,
      summary: [
        { label: "Priority", value: PRIORITY_META[current.priority]?.label ?? current.priority },
        { label: "Coordinates", value: `${Number(current.lat).toFixed(4)}, ${Number(current.lng).toFixed(4)}` },
        { label: "Camera", value: current.camera_name ?? "—" },
        { label: "Resolution", value: current.resolution?.replace(/_/g, " ") ?? "Open" },
      ],
    });
  };


  const candidates = useMemo(() => (current ? rankCandidates(drones, current) : []), [drones, current]);

  const dispatch = async (c: (typeof candidates)[number]) => {
    if (!current) return;
    if (!confirm(`Dispatch ${c.drone.tail_number} to ${current.title}? You are recorded as the dispatching operator.`)) return;
    await assignDroneToIncident(current.id, c.drone.id, Math.round(c.eta_min), Math.round(c.distance_mi));
    setTick((t) => t + 1);
  };

  const counts = {
    open: incidents.filter((i) => !["closed", "false_positive"].includes(i.status)).length,
    dispatched: incidents.filter((i) => i.status === "dispatched").length,
    onscene: incidents.filter((i) => i.status === "onscene").length,
    p1: incidents.filter((i) => i.priority === "p1" && !["closed", "false_positive"].includes(i.status)).length,
  };

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Response"
      title="Incidents & dispatch"
      lede="Every confirmed detection becomes an incident with a timeline. Aircraft are ranked by distance, endurance and battery — a person makes the call."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      <StatRow>
        <Stat label="Open incidents" value={counts.open} icon={Flame} tone={counts.open ? "risk" : "good"} />
        <Stat label="P1 priority" value={counts.p1} icon={Radio} tone={counts.p1 ? "risk" : "good"} />
        <Stat label="Dispatched" value={counts.dispatched} icon={Plane} />
        <Stat label="On scene" value={counts.onscene} icon={Clock} />
      </StatRow>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Toolbar q={q} setQ={setQ} placeholder="Search incidents, counties…">
          <Select
            value={status}
            onChange={setStatus}
            options={[{ value: "open", label: "Open" }, { value: "all", label: "All" },
              ...STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))]}
          />
        </Toolbar>
      </div>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(300px,380px)_1fr]">
          <Card pad={false} title={`Incidents (${filtered.length})`}>
            <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {filtered.length === 0 && <Empty>No incidents match this filter.</Empty>}
              {filtered.map((i) => (
                <button key={i.id} onClick={() => setSelected(i.id)}
                  className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-accent ${current?.id === i.id ? "bg-accent" : ""}`}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {i.county ?? "—"} · {Number(i.lat).toFixed(2)}, {Number(i.lng).toFixed(2)} · {dt(i.discovered_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full px-2 py-0.5 text-[11px]" style={{ color: STATUS_META[i.status]?.color, border: `1px solid ${STATUS_META[i.status]?.color}55` }}>
                      {STATUS_META[i.status]?.label}
                    </span>
                    <span className="text-[11px]" style={{ color: PRIORITY_META[i.priority]?.color }}>{PRIORITY_META[i.priority]?.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {current ? (
            <div className="space-y-4">
              <Card
                title={current.title}
                hint={`${current.source.toUpperCase()} · discovered ${dt(current.discovered_at)}`}
                action={
                  <span className="flex flex-wrap gap-1.5">
                    <Btn onClick={() => exportTimeline("csv")}><Download className="h-3.5 w-3.5" /> CSV</Btn>
                    <Btn onClick={() => exportTimeline("pdf")}><Printer className="h-3.5 w-3.5" /> PDF</Btn>
                    <Btn
                      variant={current.high_risk ? "primary" : "ghost"}
                      onClick={async () => { await setIncidentHighRisk(current.id, !current.high_risk); refresh(); }}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" /> {current.high_risk ? "High risk" : "Flag high risk"}
                    </Btn>
                  </span>
                }
              >
                <div className="grid gap-3 sm:grid-cols-4">
                  <Detail label="Status" value={STATUS_META[current.status]?.label ?? current.status} />
                  <Detail label="Priority" value={PRIORITY_META[current.priority]?.label ?? current.priority} />
                  <Detail label="Coordinates" value={`${Number(current.lat).toFixed(3)}, ${Number(current.lng).toFixed(3)}`} />
                  <Detail label="Confidence" value={current.confidence != null ? `${Math.round(current.confidence)}%` : "—"} />
                  <Detail label="Camera" value={current.camera_name ?? "—"} />
                  <Detail label="FRP" value={current.frp != null ? `${current.frp} MW` : "—"} />
                  <Detail label="County" value={current.county ?? "—"} />
                  <Detail label="Assigned aircraft" value={drones.find((d) => d.id === current.assigned_drone_id)?.tail_number ?? "None"} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-border px-3 py-2 text-xs">
                  <Pill tone={current.acked_at ? "good" : current.alert_id ? "risk" : "muted"}>
                    {current.acked_at ? "Page acknowledged" : current.alert_id ? "Awaiting acknowledgement" : "No page raised"}
                  </Pill>
                  {current.acked_at && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      {dt(current.acked_at)} by{" "}
                      {current.acked_by
                        ? <UserMention userId={current.acked_by} name="teammate" size="xs" />
                        : "an operator"}
                    </span>
                  )}
                  {!current.acked_at && current.alert_id && (
                    <span className="text-muted-foreground">On-call is being paged; escalation continues until someone acknowledges.</span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {STATUSES.map((s) => (
                    <Btn key={s} variant={current.status === s ? "primary" : "ghost"}
                      onClick={async () => { await updateIncidentStatus(current.id, s); refresh(); }}>
                      {STATUS_META[s].label}
                    </Btn>
                  ))}
                  {current.assigned_drone_id && (
                    <>
                      <Btn onClick={async () => { await markDroneInflight(current.assigned_drone_id!, current.id); refresh(); }}>Mark in flight</Btn>
                      <Btn variant="danger" onClick={async () => { await releaseDroneFromIncident(current.id, current.assigned_drone_id); refresh(); }}>Release aircraft</Btn>
                    </>
                  )}
                </div>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <ResolutionCard incident={current} refresh={refresh} />
                <MediaCard incident={current} media={media} refresh={refresh} />
              </div>

              <ReviewCard incident={current} refresh={refresh} />


              <div className="grid gap-4 lg:grid-cols-2">
                <Card pad={false} title="Dispatch candidates" hint="Ranked by ETA, range and battery">
                  <div className="divide-y divide-border">
                    {candidates.length === 0 && <Empty>No aircraft registered in the detection network yet.</Empty>}
                    {candidates.map((c) => (
                      <div key={c.drone.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{c.drone.tail_number}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {Math.round(c.distance_mi)} mi · ETA {Math.round(c.eta_min)} min · {c.drone.battery_pct ?? "—"}% battery
                          </p>
                          {!(c.ready && c.in_range && c.battery_ok) && <p className="text-[11px] text-amber-500">{c.reasons.join(" · ")}</p>}
                        </div>
                        <Btn variant="primary" disabled={!(c.ready && c.in_range && c.battery_ok)} onClick={() => dispatch(c)}>Dispatch</Btn>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card pad={false} title="Timeline">
                  <div className="max-h-[46vh] divide-y divide-border overflow-y-auto">
                    {events.length === 0 && <Empty>No events recorded.</Empty>}
                    {events.map((e) => (
                      <div key={e.id} className="px-4 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <Pill>{e.event_type.replace(/_/g, " ")}</Pill>
                          <span className="text-[11px] text-muted-foreground">{dt(e.created_at)}</span>
                        </div>
                        {e.message && <p className="mt-1 text-sm">{e.message}</p>}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ) : <Card><Empty>Select an incident.</Empty></Card>}
        </div>
      )}
    </WorkPage>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

/* ---------------- resolution workflow ---------------- */

function ResolutionCard({ incident, refresh }: { incident: IncidentRow; refresh: () => void }) {
  const [resolution, setResolution] = useState(incident.resolution ?? "confirmed_fire");
  const [notes, setNotes] = useState(incident.resolution_notes ?? "");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const closed = ["closed", "false_positive"].includes(incident.status);

  useEffect(() => {
    setResolution(incident.resolution ?? "confirmed_fire");
    setNotes(incident.resolution_notes ?? "");
  }, [incident.id]);

  return (
    <Card title="Resolution" hint="Record the outcome before closing — this is what the report shows">
      <div className="space-y-3">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Outcome</p>
          <Select value={resolution} onChange={setResolution} options={RESOLUTIONS} className="w-full" />
        </div>
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Resolution notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="What was found on scene, who responded, what closed it out…"
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn
            variant="primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try { await resolveIncident(incident.id, { resolution, notes }); refresh(); } finally { setBusy(false); }
            }}
          >
            <ClipboardCheck className="h-3.5 w-3.5" /> Save resolution
          </Btn>
          {closed ? (
            <Btn onClick={async () => { await reopenIncident(incident.id); refresh(); }}>Reopen incident</Btn>
          ) : (
            <Btn
              variant="danger"
              onClick={async () => {
                if (!confirm("Close this incident? The camera returns to normal sweeping and can open new incidents again.")) return;
                await closeIncident(incident.id);
                refresh();
              }}
            >
              Close incident
            </Btn>
          )}
        </div>
        {incident.resolved_at && (
          <p className="text-[11px] text-muted-foreground">
            Resolved {dt(incident.resolved_at)}
            {incident.closed_at ? ` · closed ${dt(incident.closed_at)}` : ""}
          </p>
        )}

        <div className="border-t border-border pt-3">
          <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Add a note to the timeline</p>
          <div className="flex gap-1.5">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && note.trim()) {
                  e.preventDefault();
                  await addIncidentNote(incident.id, note.trim());
                  setNote(""); refresh();
                }
              }}
              placeholder="Spotted second column of smoke to the north…"
              className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
            />
            <Btn
              disabled={!note.trim()}
              onClick={async () => { await addIncidentNote(incident.id, note.trim()); setNote(""); refresh(); }}
            >
              <Send className="h-3.5 w-3.5" /> Post
            </Btn>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MediaCard({ incident, media, refresh }: { incident: IncidentRow; media: IncidentMedia[]; refresh: () => void }) {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const frames = incident.snapshot_url && !media.some((m) => m.url === incident.snapshot_url)
    ? [{ id: "snapshot", incident_id: incident.id, kind: "frame", url: incident.snapshot_url, caption: "Detection frame", captured_at: incident.discovered_at, created_by: null, created_at: incident.created_at } as IncidentMedia, ...media]
    : media;

  return (
    <Card title="Camera footage & attachments" hint="Detection frames are captured automatically; add ground photos, maps or documents">
      {frames.length === 0 ? <Empty>Nothing attached yet.</Empty> : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {frames.map((m) => (
            <figure key={m.id} className="group relative overflow-hidden rounded-md border border-border">
              <a href={m.url} target="_blank" rel="noreferrer">
                <img src={m.url} alt={m.caption ?? "Incident attachment"} loading="lazy"
                  className="h-24 w-full bg-muted object-cover transition group-hover:opacity-80" />
              </a>
              <figcaption className="truncate px-2 py-1 text-[10px] text-muted-foreground">
                {m.caption ?? m.kind}{m.captured_at ? ` · ${dt(m.captured_at)}` : ""}
              </figcaption>
              {m.id !== "snapshot" && (
                <button
                  type="button"
                  aria-label="Remove attachment"
                  onClick={async () => { await deleteIncidentMedia(m.id); refresh(); }}
                  className="absolute right-1 top-1 hidden rounded bg-background/90 p-1 text-destructive group-hover:block"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </figure>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… image or document URL"
          className="min-w-[14rem] flex-1 rounded border border-border bg-background px-2 py-1 text-sm" />
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption"
          className="w-40 rounded border border-border bg-background px-2 py-1 text-sm" />
        <Btn
          disabled={!url.trim()}
          onClick={async () => {
            await addIncidentMedia(incident.id, { url: url.trim(), caption: caption.trim() || null });
            setUrl(""); setCaption(""); refresh();
          }}
        >
          <ImageIcon className="h-3.5 w-3.5" /> Attach
        </Btn>
      </div>
    </Card>
  );
}

function ReviewCard({ incident, refresh }: { incident: IncidentRow; refresh: () => void }) {
  const [cause, setCause] = useState(incident.review_cause ?? "");
  const [actions, setActions] = useState(incident.review_actions ?? "");
  const [lessons, setLessons] = useState(incident.review_lessons ?? "");

  useEffect(() => {
    setCause(incident.review_cause ?? "");
    setActions(incident.review_actions ?? "");
    setLessons(incident.review_lessons ?? "");
  }, [incident.id]);

  return (
    <Card
      title="Post-incident review"
      hint={incident.review_completed_at ? `Completed ${dt(incident.review_completed_at)}` : "Complete after the incident is closed"}
    >
      <div className="grid gap-3 lg:grid-cols-3">
        <Field label="Cause / what happened" value={cause} onChange={setCause} />
        <Field label="Actions taken" value={actions} onChange={setActions} />
        <Field label="Lessons & follow-ups" value={lessons} onChange={setLessons} />
      </div>
      <div className="mt-3">
        <Btn
          variant="primary"
          onClick={async () => {
            await saveIncidentReview(incident.id, { review_cause: cause, review_actions: actions, review_lessons: lessons });
            refresh();
          }}
        >
          <ClipboardCheck className="h-3.5 w-3.5" /> Save review
        </Btn>
      </div>
    </Card>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
    </label>
  );
}
