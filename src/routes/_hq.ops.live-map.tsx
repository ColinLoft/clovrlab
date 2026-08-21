import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Map as MapIcon, RefreshCw, Flame, Camera as CameraIcon, Plane } from "lucide-react";
import { WorkPage, Card, Btn, Pill, Loading, Select, Stat, StatRow } from "@/components/hq/work/kit";
import { fetchCameras, type Camera } from "@/lib/net/alertwest";
import { fetchIncidents, createIncidentFromHotspot, type IncidentRow } from "@/lib/net/incidents";
import { fetchResponseArea, type ResponseArea } from "@/lib/net/area";
import { getFirmsHotspots } from "@/lib/net/firms.functions";
import { usePlanes } from "@/lib/net/planes";
import { BASEMAP_OPTIONS, type BasemapId, type Hotspot, type MapLayers } from "@/components/net/LiveMap";

const LiveMap = lazy(() => import("@/components/net/LiveMap"));

export const Route = createFileRoute("/_hq/ops/live-map")({
  head: () => ({
    meta: [
      { title: "Live Map — Clovr Labs" },
      { name: "description", content: "Live detection map: watch cameras, satellite hotspots, open incidents and nearby air traffic." },
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

  const bbox = useMemo(() => {
    const deg = area ? Math.max(1, Number(area.radius_mi) / 60) : 4;
    return { lamin: center[0] - deg, lamax: center[0] + deg, lomin: center[1] - deg, lomax: center[1] + deg };
  }, [center, area]);

  const planes = usePlanes(bbox, layers.aircraft);

  const openIncidents = incidents.filter((i) => !["closed", "false_positive"].includes(i.status));

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
      lede="Watch cameras, satellite hotspots, open incidents and nearby air traffic on one canvas. Click anywhere on the map to open a manual incident."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      <StatRow>
        <Stat label="Cameras online" value={cameras.length} icon={CameraIcon} />
        <Stat label="Satellite hotspots" value={hotspots.length} icon={Flame} tone={hotspots.length ? "warn" : "good"} />
        <Stat label="Open incidents" value={openIncidents.length} icon={MapIcon} tone={openIncidents.length ? "risk" : "good"} />
        <Stat label="Air traffic" value={planes.length} icon={Plane} hint={layers.aircraft ? "Live ADS-B" : "Layer off"} />
      </StatRow>

      <Card className="mt-4" pad={false}
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
                zoom={6}
                basemap={basemap}
                layers={layers}
                cameras={cameras}
                incidents={incidents}
                hotspots={hotspots}
                planes={planes}
                area={area}
                onPickPoint={addIncidentAt}
              />
            </Suspense>
          )}
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Pill tone="warn">Orange</Pill> satellite hotspot (NASA FIRMS)
        <Pill tone="good">Green</Pill> camera reporting
        <Pill tone="risk">Red</Pill> open incident
      </div>
    </WorkPage>
  );
}
