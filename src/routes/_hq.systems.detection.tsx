import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Cpu, MapPin, Plane, Camera as CameraIcon, Radio, Save, PlayCircle, PauseCircle, History, Plus, Search } from "lucide-react";
import {
  WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Select, Toolbar,
  NewButton, RecordDialog, useRows, statusTone, dt, type Field,
} from "@/components/hq/work/kit";
import { fetchSettings, saveSettings, fetchSweepRuns, fetchCameraPrefs, saveCameraPref, AI_MODELS, type NetSettings, type SweepRun, type CameraPref } from "@/lib/net/settings";
import { fetchResponseArea, saveResponseArea, inArea, type ResponseArea } from "@/lib/net/area";
import { fetchCameras, getStatus, type Camera } from "@/lib/net/alertwest";
import { geocode } from "@/lib/net/geo";

export const Route = createFileRoute("/_hq/systems/detection")({
  head: () => ({
    meta: [
      { title: "Detection Network Settings — Clovr Labs" },
      { name: "description", content: "Configure the response area, AI triage model, scheduled sweeps, camera watch list, fleet registry and dispatch rules." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DetectionSettings,
});

const TABS = [
  { key: "ai", label: "Response area & AI", icon: Cpu },
  { key: "cameras", label: "Camera network", icon: CameraIcon },
  { key: "fleet", label: "Bases, airframes & drones", icon: Plane },
  { key: "dispatch", label: "Dispatch & alerts", icon: Radio },
] as const;

function DetectionSettings() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("ai");
  const [s, setS] = useState<NetSettings | null>(null);
  const [area, setArea] = useState<ResponseArea | null>(null);
  const [runs, setRuns] = useState<SweepRun[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [a, b, c] = await Promise.all([
        fetchSettings().catch(() => null),
        fetchResponseArea().catch(() => null),
        fetchSweepRuns().catch(() => [] as SweepRun[]),
      ]);
      setS(a); setArea(b); setRuns(c);
    })();
  }, []);

  const persist = async (patch: Partial<NetSettings>, areaPatch?: Partial<ResponseArea>) => {
    setSaving(true);
    try {
      if (Object.keys(patch).length) await saveSettings(patch);
      if (areaPatch && Object.keys(areaPatch).length) await saveResponseArea(areaPatch);
      setMsg("Saved");
      setTimeout(() => setMsg(null), 2000);
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!s) return <WorkPage eyebrow="Enterprise systems" title="Detection network"><Loading /></WorkPage>;

  return (
    <WorkPage
      wide
      eyebrow="Enterprise systems"
      title="Detection network settings"
      lede="The control panel behind the camera network: where we watch, how the AI screens frames, how often it sweeps, and the rules dispatch has to satisfy."
      actions={
        <Btn
          variant={s.paused ? "primary" : "default"}
          onClick={async () => { const next = !s.paused; setS({ ...s, paused: next }); await persist({ paused: next, pause_reason: next ? "Paused by operator" : null }); }}
        >
          {s.paused ? <><PlayCircle className="h-3.5 w-3.5" /> Resume automation</> : <><PauseCircle className="h-3.5 w-3.5" /> Pause automation</>}
        </Btn>
      }
    >
      <StatRow>
        <Stat label="Scheduled sweeps" value={s.sweep_enabled ? `Every ${s.sweep_interval_hours}h` : "Off"} icon={History} tone={s.sweep_enabled ? "good" : "default"} />
        <Stat label="Last sweep" value={s.last_sweep_at ? dt(s.last_sweep_at) : "Never"} />
        <Stat label="Automation" value={s.paused ? "Paused" : "Active"} tone={s.paused ? "risk" : "good"} hint={s.pause_reason ?? undefined} />
        <Stat label="Service area" value={area ? (area.mode === "region" ? `${(area.states ?? []).length + (area.counties ?? []).length} regions` : `${Math.round(Number(area.radius_mi))} mi radius`) : "—"} icon={MapPin} hint={area?.mode === "region" ? [...(area.counties ?? []), ...(area.states ?? [])].join(", ") || undefined : area?.address ?? undefined} />
      </StatRow>

      <div className="mt-5 flex flex-wrap gap-1.5 border-b border-border pb-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
        {msg && <span className="ml-auto self-center text-xs text-muted-foreground">{msg}</span>}
      </div>

      <div className="mt-4">
        {tab === "ai" && <AiTab s={s} setS={setS} area={area} setArea={setArea} persist={persist} saving={saving} runs={runs} />}
        {tab === "cameras" && <CamerasTab area={area} />}
        {tab === "fleet" && <FleetTab />}
        {tab === "dispatch" && <DispatchTab s={s} setS={setS} persist={persist} saving={saving} />}
      </div>
    </WorkPage>
  );
}

/* ---------- shared inputs ---------- */

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-0">
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <span className="flex-none">{children}</span>
    </label>
  );
}

function Num({ value, onChange, suffix, width = "w-24" }: { value: number; onChange: (n: number) => void; suffix?: string; width?: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className={`${width} rounded border border-border bg-background px-2 py-1 text-sm tabular-nums`} />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </span>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)} aria-pressed={on}
      className={`h-6 w-11 rounded-full border transition ${on ? "border-primary bg-primary/80" : "border-border bg-muted"}`}>
      <span className={`block h-5 w-5 rounded-full bg-background transition ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function Chips({ items, onRemove }: { items: string[]; onRemove: (v: string) => void }) {
  if (!items.length) return <p className="text-xs text-muted-foreground">None yet — the whole network stays out of scope until you add one.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((v) => (
        <button key={v} type="button" onClick={() => onRemove(v)}
          className="rounded-full border border-border px-2.5 py-1 text-xs hover:border-destructive hover:text-destructive">
          {v} ×
        </button>
      ))}
    </div>
  );
}

function ChipInput({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  const [v, setV] = useState("");
  const commit = () => { const t = v.trim(); if (t) { onAdd(t); setV(""); } };
  return (
    <div className="mt-2 flex gap-1.5">
      <input value={v} onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
        placeholder={placeholder}
        className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm" />
      <Btn onClick={commit}><Plus className="h-3.5 w-3.5" /> Add</Btn>
    </div>
  );
}

function AreaCard({ area, setArea, persist, saving }: {
  area: ResponseArea | null; setArea: (v: ResponseArea | null) => void;
  persist: (p: Partial<NetSettings>, a?: Partial<ResponseArea>) => Promise<void>;
  saving: boolean;
}) {
  const [geo, setGeo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cams, setCams] = useState<Camera[] | null>(null);

  useEffect(() => { fetchCameras().then(setCams).catch(() => setCams([])); }, []);

  if (!area) return <Card title="Response area"><Loading /></Card>;

  const mode = area.mode === "region" ? "region" : "address";
  const states = area.states ?? [];
  const counties = area.counties ?? [];
  const inScope = (cams ?? []).filter((c) =>
    inArea(area, { lat: Number(c.site.latitude), lng: Number(c.site.longitude), state: c.site.state, county: c.site.county })
  ).length;

  const lookup = async () => {
    if (!area.address?.trim()) return;
    setBusy(true); setGeo(null);
    try {
      const r = await geocode(area.address);
      if (!r) { setGeo("No match found — try a fuller address."); return; }
      setArea({ ...area, address: r.display_name, center_lat: r.lat, center_lng: r.lng });
      setGeo(`Matched: ${r.display_name}`);
    } finally { setBusy(false); }
  };

  return (
    <Card title="Service area" hint="The only ground we monitor. Cameras, hazards and sweeps outside it are ignored.">
      <Row label="Area type" hint="Address radius for a single customer site, or named regions for county/state contracts">
        <Select
          value={mode}
          onChange={(v) => setArea({ ...area, mode: v as ResponseArea["mode"] })}
          options={[
            { value: "address", label: "Address + radius" },
            { value: "region", label: "Specific counties / states" },
          ]}
          className="w-56"
        />
      </Row>

      {mode === "address" ? (
        <>
          <Row label="Address or place" hint="Search to set the centre point automatically">
            <span className="flex gap-1.5">
              <input value={area.address ?? ""} onChange={(e) => setArea({ ...area, address: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void lookup(); } }}
                className="w-60 rounded border border-border bg-background px-2 py-1 text-sm" placeholder="1200 K St, Sacramento, CA" />
              <Btn onClick={lookup} disabled={busy}><Search className="h-3.5 w-3.5" /> {busy ? "Finding…" : "Find"}</Btn>
            </span>
          </Row>
          {geo && <p className="pb-2 text-xs text-muted-foreground">{geo}</p>}
          <Row label="Centre latitude"><Num value={Number(area.center_lat ?? 0)} onChange={(v) => setArea({ ...area, center_lat: v })} width="w-32" /></Row>
          <Row label="Centre longitude"><Num value={Number(area.center_lng ?? 0)} onChange={(v) => setArea({ ...area, center_lng: v })} width="w-32" /></Row>
          <Row label="Radius" hint="0 means the whole camera network is in scope">
            <Num value={Number(area.radius_mi ?? 0)} onChange={(v) => setArea({ ...area, radius_mi: v })} suffix="mi" />
          </Row>
        </>
      ) : (
        <div className="space-y-4 py-3">
          <div>
            <p className="text-sm font-medium">States</p>
            <p className="mb-2 text-xs text-muted-foreground">Two-letter codes as the camera network reports them, e.g. CA.</p>
            <Chips items={states} onRemove={(v) => setArea({ ...area, states: states.filter((x) => x !== v) })} />
            <ChipInput placeholder="CA" onAdd={(v) => setArea({ ...area, states: Array.from(new Set([...states, v.toUpperCase()])) })} />
          </div>
          <div>
            <p className="text-sm font-medium">Counties</p>
            <p className="mb-2 text-xs text-muted-foreground">Leave empty to cover every county in the listed states.</p>
            <Chips items={counties} onRemove={(v) => setArea({ ...area, counties: counties.filter((x) => x !== v) })} />
            <ChipInput placeholder="El Dorado" onAdd={(v) => setArea({ ...area, counties: Array.from(new Set([...counties, v])) })} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-3">
        <Btn variant="primary" disabled={saving}
          onClick={() => persist({}, {
            mode: area.mode, address: area.address,
            center_lat: area.center_lat, center_lng: area.center_lng, radius_mi: area.radius_mi,
            states, counties,
          })}>
          <Save className="h-3.5 w-3.5" /> Save service area
        </Btn>
        <span className="text-xs text-muted-foreground">
          {cams === null ? "Counting cameras…" : `${inScope} of ${cams.length} cameras in scope`}
        </span>
      </div>
    </Card>
  );
}

/* ---------- tabs ---------- */


function AiTab({ s, setS, area, setArea, persist, saving, runs }: {
  s: NetSettings; setS: (v: NetSettings) => void;
  area: ResponseArea | null; setArea: (v: ResponseArea | null) => void;
  persist: (p: Partial<NetSettings>, a?: Partial<ResponseArea>) => Promise<void>;
  saving: boolean; runs: SweepRun[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <AreaCard area={area} setArea={setArea} persist={persist} saving={saving} />


        <Card title="AI triage" hint="How camera frames are screened before a human sees them">
          <Row label="Vision model">
            <Select value={s.ai_model} onChange={(v) => setS({ ...s, ai_model: v })} options={AI_MODELS} className="w-72" />
          </Row>
          <Row label="Minimum confidence to open an incident" hint="At or above this, a smoke/fire call opens an incident and pages on-call. Below it, the frame is logged only.">
            <Num value={s.min_confidence} onChange={(v) => setS({ ...s, min_confidence: v })} suffix="%" />
          </Row>
          <div className="pt-3">
            <Btn variant="primary" disabled={saving}
              onClick={() => persist({ ai_model: s.ai_model, min_confidence: s.min_confidence })}>
              <Save className="h-3.5 w-3.5" /> Save AI settings
            </Btn>
          </div>

          </div>
        </Card>

        <Card title="Scheduled sweeps" hint="Operators can always sweep manually from the camera console">
          <Row label="Run sweeps automatically">
            <Toggle on={s.sweep_enabled} onChange={(v) => setS({ ...s, sweep_enabled: v })} />
          </Row>
          <Row label="Interval" hint="Checked hourly; a sweep runs once this much time has passed">
            <Num value={s.sweep_interval_hours} onChange={(v) => setS({ ...s, sweep_interval_hours: v })} suffix="hours" />
          </Row>
          <Row label="Cameras per run" hint="Keeps AI spend and run time bounded (max 50)">
            <Num value={s.sweep_batch_size} onChange={(v) => setS({ ...s, sweep_batch_size: v })} />
          </Row>
          <Row label="Priority cameras only" hint="Restrict scheduled sweeps to cameras flagged as priority">
            <Toggle on={s.sweep_priority_only} onChange={(v) => setS({ ...s, sweep_priority_only: v })} />
          </Row>
          <div className="pt-3">
            <Btn variant="primary" disabled={saving}
              onClick={() => persist({ sweep_enabled: s.sweep_enabled, sweep_interval_hours: s.sweep_interval_hours, sweep_batch_size: s.sweep_batch_size, sweep_priority_only: s.sweep_priority_only })}>
              <Save className="h-3.5 w-3.5" /> Save schedule
            </Btn>
          </div>
        </Card>
      </div>

      <Card pad={false} title="Sweep history" hint="Manual and scheduled runs">
        <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
          {runs.length === 0 && <Empty>No sweeps recorded yet.</Empty>}
          {runs.map((r) => (
            <div key={r.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <Pill tone={r.error_count ? "warn" : "good"}>{r.trigger}</Pill>
                <span className="font-mono text-[11px] text-muted-foreground">{dt(r.created_at)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {r.analyzed} frames · {r.created_count} queued · {r.error_count} errors
                {r.duration_ms ? ` · ${(r.duration_ms / 1000).toFixed(1)}s` : ""}
              </p>
              {r.first_error && <p className="mt-0.5 line-clamp-2 text-[11px] text-amber-500">{r.first_error}</p>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CamerasTab({ area }: { area: ResponseArea | null }) {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [prefs, setPrefs] = useState<Record<string, CameraPref>>({});
  const [muted, setMuted] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([fetchCameras().catch(() => [] as Camera[]), fetchCameraPrefs().catch(() => ({}))]);
      setCameras(c); setPrefs(p); setLoading(false);
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.from("net_muted_cameras").select("*");
      setMuted(data ?? []);
    })();
  }, []);

  const list = useMemo(() => {
    const inside = cameras.filter((c) => inArea(area, { lat: Number(c.site.latitude), lng: Number(c.site.longitude), state: c.site.state, county: c.site.county }));
    const s = q.toLowerCase();
    const filtered = s ? inside.filter((c) => `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s)) : inside;
    return filtered
      .slice()
      .sort((a, b) => (prefs[b.site.id]?.priority ?? 0) - (prefs[a.site.id]?.priority ?? 0))
      .slice(0, 300);
  }, [cameras, area, q, prefs]);

  const update = async (id: string, name: string, patch: Partial<CameraPref>) => {
    const base: CameraPref = prefs[id] ?? { camera_id: id, camera_name: name, watch: true, priority: 0, label: null, notes: null };
    const next: CameraPref = { ...base, camera_id: id, camera_name: name, ...patch };
    setPrefs({ ...prefs, [id]: next });
    await saveCameraPref(next);
  };

  const watching = list.filter((c) => prefs[c.site.id]?.watch !== false).length;

  return (
    <div className="space-y-4">
      <StatRow>
        <Stat label="Cameras in area" value={list.length} icon={CameraIcon} />
        <Stat label="On watch list" value={watching} tone="good" />
        <Stat label="Priority flagged" value={Object.values(prefs).filter((p) => p.priority > 0).length} />
        <Stat label="Muted" value={muted.length} tone={muted.length ? "warn" : "default"} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search cameras, counties…" />

      {loading ? <Loading /> : (
        <Card pad={false} title="Watch list" hint="Priority cameras are swept first, and exclusively when priority-only is on">
          <div className="max-h-[62vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 border-b border-border bg-muted/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Camera</th><th className="px-4 py-2.5">Location</th>
                  <th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5">Label</th>
                  <th className="px-4 py-2.5">Priority</th><th className="px-4 py-2.5 text-right">Watch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.length === 0 && <tr><td colSpan={6}><Empty>No cameras match.</Empty></td></tr>}
                {list.map((c) => {
                  const p = prefs[c.site.id];
                  const st = getStatus(c);
                  return (
                    <tr key={c.site.id} className="hover:bg-accent/40">
                      <td className="max-w-[240px] truncate px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{c.site.county ?? "—"}, {c.site.state ?? "—"}</td>
                      <td className="px-4 py-2 text-xs" style={{ color: st.color }}>{st.label}</td>
                      <td className="px-4 py-2">
                        <input defaultValue={p?.label ?? ""} placeholder="—"
                          onBlur={(e) => e.target.value !== (p?.label ?? "") && update(c.site.id, c.name, { label: e.target.value || null })}
                          className="w-32 rounded border border-border bg-background px-2 py-1 text-xs" />
                      </td>
                      <td className="px-4 py-2">
                        <Select value={String(p?.priority ?? 0)} className="w-28"
                          onChange={(v) => update(c.site.id, c.name, { priority: Number(v) })}
                          options={[{ value: "0", label: "Standard" }, { value: "1", label: "Priority" }, { value: "2", label: "Critical" }]} />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Toggle on={p?.watch !== false} onChange={(v) => update(c.site.id, c.name, { watch: v })} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card pad={false} title="Muted cameras" hint="Muted cameras are skipped by every sweep until the mute expires">
        <div className="divide-y divide-border">
          {muted.length === 0 && <Empty>Nothing muted.</Empty>}
          {muted.map((m) => (
            <div key={m.camera_id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate">{m.camera_name ?? m.camera_id}</p>
                <p className="text-[11px] text-muted-foreground">{m.reason ?? "—"} · until {dt(m.muted_until)}</p>
              </div>
              <Btn onClick={async () => {
                const { supabase } = await import("@/integrations/supabase/client");
                await supabase.from("net_muted_cameras").delete().eq("camera_id", m.camera_id);
                setMuted(muted.filter((x) => x.camera_id !== m.camera_id));
              }}>Unmute</Btn>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const baseFields: Field[] = [
  { key: "code", label: "Code", type: "text", required: true, placeholder: "BASE-01" },
  { key: "name", label: "Base name", type: "text", required: true },
  { key: "lat", label: "Latitude", type: "number", required: true },
  { key: "lng", label: "Longitude", type: "number", required: true },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "hangar_capacity", label: "Hangar capacity", type: "number" },
];

const airframeFields: Field[] = [
  { key: "model", label: "Model", type: "text", required: true },
  { key: "manufacturer", label: "Manufacturer", type: "text" },
  { key: "range_mi", label: "Range (mi)", type: "number" },
  { key: "cruise_speed_mph", label: "Cruise speed (mph)", type: "number" },
  { key: "retardant_capacity_l", label: "Retardant capacity (L)", type: "number" },
  { key: "endurance_min", label: "Endurance (min)", type: "number" },
];

function FleetTab() {
  const bases = useRows<any>("net_bases", { order: { column: "name", ascending: true } });
  const airframes = useRows<any>("net_airframes", { order: { column: "model", ascending: true } });
  const drones = useRows<any>("net_drones", { order: { column: "tail_number", ascending: true } });
  const [open, setOpen] = useState<null | "base" | "airframe" | "drone">(null);

  const droneFields: Field[] = [
    { key: "tail_number", label: "Tail number", type: "text", required: true, placeholder: "N204CL" },
    { key: "airframe_id", label: "Airframe", type: "select", options: airframes.rows.map((a) => ({ value: a.id, label: a.model })) },
    { key: "base_id", label: "Home base", type: "select", options: bases.rows.map((b) => ({ value: b.id, label: `${b.code} — ${b.name}` })) },
    { key: "status", label: "Status", type: "select", options: ["ready", "preflight", "inflight", "returning", "charging", "maintenance", "offline"].map((v) => ({ value: v, label: v })) },
    { key: "battery_pct", label: "Battery (%)", type: "number" },
    { key: "retardant_l", label: "Retardant on board (L)", type: "number" },
    { key: "next_service_at", label: "Next service", type: "date" },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ];

  return (
    <div className="space-y-4">
      <StatRow cols={3}>
        <Stat label="Bases" value={bases.rows.length} icon={MapPin} />
        <Stat label="Airframe types" value={airframes.rows.length} />
        <Stat label="Registered aircraft" value={drones.rows.length} icon={Plane} />
      </StatRow>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card pad={false} title="Launch bases" action={<NewButton label="Add base" onClick={() => setOpen("base")} />}>
          <div className="divide-y divide-border">
            {bases.rows.length === 0 && <Empty>No bases registered.</Empty>}
            {bases.rows.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{b.code} — {b.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{Number(b.lat).toFixed(3)}, {Number(b.lng).toFixed(3)} · {b.city ?? "—"}, {b.state ?? "—"}</p>
                </div>
                <Btn variant="ghost" onClick={() => bases.remove?.(b.id)}>Remove</Btn>
              </div>
            ))}
          </div>
        </Card>

        <Card pad={false} title="Airframes" action={<NewButton label="Add airframe" onClick={() => setOpen("airframe")} />}>
          <div className="divide-y divide-border">
            {airframes.rows.length === 0 && <Empty>No airframe types.</Empty>}
            {airframes.rows.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <div>
                  <p className="font-medium">{a.model}</p>
                  <p className="text-[11px] text-muted-foreground">{a.range_mi ?? "—"} mi · {a.cruise_speed_mph ?? "—"} mph · {a.retardant_capacity_l ?? "—"} L</p>
                </div>
                <Btn variant="ghost" onClick={() => airframes.remove?.(a.id)}>Remove</Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card pad={false} title="Registered aircraft" action={<NewButton label="Add aircraft" onClick={() => setOpen("drone")} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-2.5">Tail</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5">Battery</th><th className="px-4 py-2.5">Retardant</th><th className="px-4 py-2.5">Next service</th><th className="px-4 py-2.5 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {drones.rows.length === 0 && <tr><td colSpan={6}><Empty>No aircraft registered.</Empty></td></tr>}
              {drones.rows.map((d) => (
                <tr key={d.id} className="hover:bg-accent/40">
                  <td className="px-4 py-2 font-mono font-semibold">{d.tail_number}</td>
                  <td className="px-4 py-2"><Pill tone={statusTone(d.status)}>{d.status}</Pill></td>
                  <td className="px-4 py-2 tabular-nums">{d.battery_pct ?? "—"}%</td>
                  <td className="px-4 py-2 tabular-nums">{d.retardant_l ?? "—"} L</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{d.next_service_at ?? "—"}</td>
                  <td className="px-4 py-2 text-right"><Btn variant="ghost" onClick={() => drones.remove?.(d.id)}>Remove</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {open === "base" && (
        <RecordDialog title="Add launch base" fields={baseFields} people={[]} initial={{}}
          onCancel={() => setOpen(null)} onSave={async (v) => { await bases.insert(v); setOpen(null); }} />
      )}
      {open === "airframe" && (
        <RecordDialog title="Add airframe" fields={airframeFields} people={[]} initial={{}}
          onCancel={() => setOpen(null)} onSave={async (v) => { await airframes.insert(v); setOpen(null); }} />
      )}
      {open === "drone" && (
        <RecordDialog title="Register aircraft" fields={droneFields} people={[]} initial={{ status: "ready", battery_pct: 100 }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await drones.insert(v); setOpen(null); }} />
      )}
    </div>
  );
}

function DispatchTab({ s, setS, persist, saving }: {
  s: NetSettings; setS: (v: NetSettings) => void;
  persist: (p: Partial<NetSettings>) => Promise<void>; saving: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Dispatch rules" hint="Applied when ranking aircraft for an incident">
        <Row label="Minimum battery to launch">
          <Num value={s.dispatch_min_battery} onChange={(v) => setS({ ...s, dispatch_min_battery: v })} suffix="%" />
        </Row>
        <Row label="Maximum response distance" hint="Aircraft farther than this are shown but not launchable">
          <Num value={Number(s.dispatch_max_range_mi)} onChange={(v) => setS({ ...s, dispatch_max_range_mi: v })} suffix="mi" />
        </Row>
        <div className="pt-3">
          <Btn variant="primary" disabled={saving}
            onClick={() => persist({ dispatch_min_battery: s.dispatch_min_battery, dispatch_max_range_mi: s.dispatch_max_range_mi })}>
            <Save className="h-3.5 w-3.5" /> Save dispatch rules
          </Btn>
        </div>
      </Card>

      <Card title="Alerting" hint="Who hears about what, and when">
        <Row label="Notify managers on new AI suggestion" hint="Noisy on busy days — off by default">
          <Toggle on={s.notify_on_suggestion} onChange={(v) => setS({ ...s, notify_on_suggestion: v })} />
        </Row>
        <Row label="Notify managers on new incident">
          <Toggle on={s.notify_on_incident} onChange={(v) => setS({ ...s, notify_on_incident: v })} />
        </Row>
        <div className="pt-3">
          <Btn variant="primary" disabled={saving}
            onClick={() => persist({ notify_on_suggestion: s.notify_on_suggestion, notify_on_incident: s.notify_on_incident })}>
            <Save className="h-3.5 w-3.5" /> Save alerting
          </Btn>
        </div>
      </Card>
    </div>
  );
}
