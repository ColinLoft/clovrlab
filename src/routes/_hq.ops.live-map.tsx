import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Map as MapIcon, RefreshCw, Flame, Camera as CameraIcon, Plane, Crosshair, Navigation } from "lucide-react";
import { WorkPage, Card, Btn, Pill, Loading, Select, Stat, StatRow, Toolbar, Empty } from "@/components/hq/work/kit";
import { fetchCameras, getStatus, relTime, type Camera } from "@/lib/net/alertwest";
import { fetchIncidents, createIncidentFromHotspot, STATUS_META, type IncidentRow } from "@/lib/net/incidents";
import { fetchResponseArea, haversineMi, inArea, type ResponseArea } from "@/lib/net/area";
import { getFirmsHotspots } from "@/lib/net/firms.functions";
import { usePlanes } from "@/lib/net/planes";
import { ScanPanel } from "@/components/net/ScanPanel";
import { BASEMAP_OPTIONS, type BasemapId, type Hotspot, type MapLayers } from "@/components/net/LiveMap";

const LiveMap = lazy(() => import("@/components/net/LiveMap"));

export const Route = createFileRoute("/_hq/ops/live-map")({
  head: () => ({
    meta: [
      { title: "Live Map — Clovr Labs" },
      { name: "description", content: "Live detection map: watch cameras, satellite hotspots, open incidents and nearby air traffic inside the response area." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LiveMapPage,
});

function LiveMapPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [area, setArea] = useState<ResponseArea | null>(null);
  const [basemap, setBasemap] = useState<BasemapId>("dark");
  const [layers, setLayers] = useState<MapLayers>({ cameras: true, incidents: true, hotspots: true, aircraft: false, area: true });
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [selected, setSelected] = useState<Camera | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [cams, incs, ar, firms] = await Promise.all([
        fetchCameras().catch(() => [] as Camera[]),
        fetchIncidents().catch(() => [] as IncidentRow[]),
        fetchResponseArea().catch(() => null),
        getFirmsHotspots().catch(() => ({ hotspots: [] as Hotspot[] })),
      ]);
      if (!alive) return;
      setCameras(cams);
      setIncidents(incs);
      setArea(ar);
      setHotspots(((firms as any).hotspots ?? []) as Hotspot[]);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [tick]);

  const center = useMemo<[number, number]>(
    () => (area ? [Number(area.center_lat), Number(area.center_lng)] : [37.5, -120]),
    [area],
  );
  const origin = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);

  // The response area is the whole world model here: everything on the canvas
  // is filtered to it, and camera lists are ordered nearest-first.
  const areaCameras = useMemo(
    () => cameras.filter((c) => inArea(area, {
      lat: Number(c.site.latitude), lng: Number(c.site.longitude), state: c.site.state, county: c.site.county,
    })),
    [cameras, area],
  );

  const nearest = useMemo(() => {
    const s = q.toLowerCase();
    return areaCameras
      .filter((c) => !s || `${c.name} ${c.site.county ?? ""} ${c.site.state ?? ""}`.toLowerCase().includes(s))
      .map((c) => ({ c, mi: haversineMi(origin, { lat: Number(c.site.latitude), lng: Number(c.site.longitude) }) }))
      .sort((a, b) => a.mi - b.mi);
  }, [areaCameras, origin, q]);

  const areaIncidents = useMemo(
    () => incidents.filter((i) => inArea(area, { lat: Number(i.lat), lng: Number(i.lng) })),
    [incidents, area],
  );
  const areaHotspots = useMemo(
    () => hotspots.filter((h) => inArea(area, { lat: h.lat, lng: h.lng })),
    [hotspots, area],
  );

  const bbox = useMemo(() => {
    const deg = area ? Math.max(1, Number(area.radius_mi) / 60) : 4;
    return { lamin: center[0] - deg, lamax: center[0] + deg, lomin: center[1] - deg, lomax: center[1] + deg };
  }, [center, area]);

  const planes = usePlanes(bbox, layers.aircraft);
  const openIncidents = areaIncidents.filter((i) => !["closed", "false_positive"].includes(i.status));

  const addIncidentAt = async (p: { lat: number; lng: number }) => {
    if (busy) return;
    if (!confirm(`Open a manual incident at ${p.lat.toFixed(3)}, ${p.lng.toFixed(3)}?`)) return;
    setBusy(true);
    try {
      await createIncidentFromHotspot({ lat: p.lat, lng: p.lng, source: "manual", title: `Manual report ${p.lat.toFixed(3)}, ${p.lng.toFixed(3)}` });
      setTick((t) => t + 1);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const toggle = (k: keyof MapLayers) => setLayers((l) => ({ ...l, [k]: !l[k] }));

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Common picture"
      title="Live map"
      lede={
        area?.address
          ? `Everything inside the service area around ${area.address}: cameras, satellite hotspots, open incidents and nearby air traffic. Click anywhere on the map to open a manual incident.`
          : "Cameras, satellite hotspots, open incidents and nearby air traffic on one canvas. Click anywhere on the map to open a manual incident."
      }
      actions={
        <>
          <Btn onClick={() => setFocus({ lat: origin.lat, lng: origin.lng, zoom: 9 })}><Crosshair className="h-3.5 w-3.5" /> Recentre</Btn>
          <Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>
        </>
      }
    >
      <StatRow>
        <Stat label="Cameras in area" value={areaCameras.length} icon={CameraIcon} hint={`${cameras.length} on the network`} />
        <Stat label="Satellite hotspots" value={areaHotspots.length} icon={Flame} tone={areaHotspots.length ? "warn" : "good"} />
        <Stat label="Open incidents" value={openIncidents.length} icon={MapIcon} tone={openIncidents.length ? "risk" : "good"} />
        <Stat label="Air traffic" value={planes.length} icon={Plane} hint={layers.aircraft ? "Live ADS-B" : "Layer off"} />
      </StatRow>

      <div className="mt-4">
        <ScanPanel
          cameras={nearest.map((n) => n.c)}
          scope={area?.address ? `nearest first from ${area.address}` : "response area"}
          onChanged={() => setTick((t) => t + 1)}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card pad={false}
          title="Common operating picture"
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              {(["cameras", "incidents", "hotspots", "aircraft", "area"] as (keyof MapLayers)[]).map((k) => (
                <button key={k} onClick={() => toggle(k)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] capitalize transition ${layers[k] ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>
                  {k}
                </button>
              ))}
              <Select value={basemap} onChange={(v) => setBasemap(v as BasemapId)} options={BASEMAP_OPTIONS} className="ml-1" />
            </div>
          }
        >
          <div className="p-3">
            {loading ? <Loading /> : (
              <Suspense fallback={<div className="h-[70vh] rounded-lg border border-border bg-muted/30" />}>
                <LiveMap
                  center={center}
                  zoom={area ? 9 : 6}
                  basemap={basemap}
                  layers={layers}
                  cameras={areaCameras}
                  incidents={areaIncidents}
                  hotspots={areaHotspots}
                  planes={planes}
                  area={area}
                  focus={focus}
                  onSelectCamera={(c) => setSelected(c)}
                  onPickPoint={addIncidentAt}
                />
              </Suspense>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card pad={false} title={`Nearest cameras (${nearest.length})`} hint="Distance from the service-area centre"
            action={<div className="w-40"><Toolbar q={q} setQ={setQ} placeholder="Search…" /></div>}>
            <div className="max-h-[38vh] divide-y divide-border overflow-y-auto">
              {nearest.length === 0 && <Empty>No cameras inside the service area.</Empty>}
              {nearest.slice(0, 60).map(({ c, mi }) => {
                const st = getStatus(c);
                return (
                  <button key={c.site.id}
                    onClick={() => { setSelected(c); setFocus({ lat: Number(c.site.latitude), lng: Number(c.site.longitude), zoom: 12 }); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-accent">
                    <span className="h-2 w-2 flex-none rounded-full" style={{ background: st.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{c.name}</span>
                      <span className="block truncate text-muted-foreground">{c.site.county ? `${c.site.county}, ` : ""}{c.site.state ?? ""} · {relTime(c.image.time) ?? "no frame"}</span>
                    </span>
                    <span className="flex-none font-mono text-[11px] text-muted-foreground">{mi.toFixed(1)} mi</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {selected && (
            <Card title={selected.name} hint={`${selected.site.county ?? ""} ${selected.site.state ?? ""}`.trim()}
              action={<Btn variant="ghost" onClick={() => setSelected(null)}>Close</Btn>}>
              {selected.image.url && (
                <img src={selected.image.url} alt={`Latest frame from ${selected.name}`} loading="lazy"
                  className="mb-2 aspect-video w-full rounded border border-border object-cover" />
              )}
              <p className="text-xs text-muted-foreground">
                {getStatus(selected).label} · {relTime(selected.image.time) ?? "no frame"}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {Number(selected.site.latitude).toFixed(4)}, {Number(selected.site.longitude).toFixed(4)}
              </p>
            </Card>
          )}

          <Card pad={false} title={`Open incidents (${openIncidents.length})`}>
            <div className="max-h-[30vh] divide-y divide-border overflow-y-auto">
              {openIncidents.length === 0 && <Empty>Nothing open in the service area.</Empty>}
              {openIncidents.map((i) => (
                <button key={i.id} onClick={() => setFocus({ lat: Number(i.lat), lng: Number(i.lng), zoom: 12 })}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-accent">
                  <Navigation className="h-3.5 w-3.5 flex-none text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate font-medium">{i.title}</span>
                  <Pill tone={i.priority === "p1" ? "risk" : "warn"}>{STATUS_META[i.status]?.label ?? i.status}</Pill>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Pill tone="warn">Orange</Pill> satellite hotspot (NASA FIRMS)
        <Pill tone="good">Green</Pill> camera reporting
        <Pill tone="risk">Red</Pill> open incident
      </div>
    </WorkPage>
  );
}
