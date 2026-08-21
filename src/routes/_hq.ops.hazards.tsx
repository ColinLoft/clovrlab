import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Wind, Activity, RefreshCw, PlusCircle } from "lucide-react";
import { WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, dt } from "@/components/hq/work/kit";
import { getFirmsHotspots } from "@/lib/net/firms.functions";
import { getRedFlagAlerts, type NwsAlert } from "@/lib/net/nws.functions";
import { getRecentQuakes, type Quake } from "@/lib/net/usgs.functions";
import { createIncidentFromHotspot } from "@/lib/net/incidents";
import { fetchResponseArea, inArea, type ResponseArea } from "@/lib/net/area";
import type { Hotspot } from "@/components/net/LiveMap";

export const Route = createFileRoute("/_hq/ops/hazards")({
  head: () => ({
    meta: [
      { title: "Hazard Feeds — Clovr Labs" },
      { name: "description", content: "Satellite hotspots, red flag warnings and seismic activity in one operational feed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HazardsPage,
});

function HazardsPage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [alerts, setAlerts] = useState<NwsAlert[]>([]);
  const [quakes, setQuakes] = useState<Quake[]>([]);
  const [area, setArea] = useState<ResponseArea | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [firms, nws, usgs, ar] = await Promise.all([
        getFirmsHotspots().catch(() => ({ hotspots: [] })),
        getRedFlagAlerts().catch(() => ({ alerts: [] })),
        getRecentQuakes().catch(() => ({ quakes: [] })),
        fetchResponseArea().catch(() => null),
      ]);
      if (!alive) return;
      setHotspots(((firms as any).hotspots ?? []) as Hotspot[]);
      setAlerts(((nws as any).alerts ?? []) as NwsAlert[]);
      setQuakes(((usgs as any).quakes ?? []) as Quake[]);
      setArea(ar);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [tick]);

  const open = async (h: Hotspot) => {
    if (!confirm(`Open an incident for this hotspot (${h.frp} MW)?`)) return;
    try {
      await createIncidentFromHotspot({ lat: h.lat, lng: h.lng, frp: h.frp, confidence: h.confidence, source: "firms" });
      alert("Incident opened. Continue in Incidents & dispatch.");
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const inside = hotspots.filter((h) => inArea(area, { lat: h.lat, lng: h.lng }));

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Environment"
      title="Hazard feeds"
      lede="Satellite thermal hotspots, red flag fire-weather warnings and recent seismic activity — the outside signals that shape today's posture."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      <StatRow cols={3}>
        <Stat label="Hotspots in area" value={inside.length} icon={Flame} tone={inside.length ? "warn" : "good"} hint={`${hotspots.length} total returned`} />
        <Stat label="Red flag warnings" value={alerts.length} icon={Wind} tone={alerts.length ? "risk" : "good"} />
        <Stat label="Recent quakes" value={quakes.length} icon={Activity} />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <Card pad={false} title="Satellite hotspots" hint="NASA FIRMS">
            <div className="max-h-[60vh] divide-y divide-border overflow-y-auto">
              {inside.length === 0 && <Empty>No thermal anomalies in the response area.</Empty>}
              {inside.map((h, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{h.frp} MW · {h.confidence || "—"} confidence</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {h.lat.toFixed(3)}, {h.lng.toFixed(3)} · {h.satellite} · {dt(h.acq_datetime)}
                    </p>
                  </div>
                  <Btn onClick={() => open(h)}><PlusCircle className="h-3.5 w-3.5" /> Incident</Btn>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={false} title="Fire weather" hint="NWS red flag warnings">
            <div className="max-h-[60vh] divide-y divide-border overflow-y-auto">
              {alerts.length === 0 && <Empty>No active red flag warnings.</Empty>}
              {alerts.map((a: any) => (
                <div key={a.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{a.event ?? "Fire weather alert"}</p>
                    <Pill tone="risk">{a.severity ?? "—"}</Pill>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.areaDesc ?? a.area_desc ?? ""}</p>
                  {a.headline && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.headline}</p>}
                </div>
              ))}
            </div>
          </Card>

          <Card pad={false} title="Seismic" hint="USGS, last 24h">
            <div className="max-h-[60vh] divide-y divide-border overflow-y-auto">
              {quakes.length === 0 && <Empty>No notable seismic activity.</Empty>}
              {quakes.map((q: any) => (
                <div key={q.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{q.place}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{dt(q.time)}</p>
                  </div>
                  <Pill tone={Number(q.mag) >= 4 ? "risk" : "warn"}>M{Number(q.mag).toFixed(1)}</Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </WorkPage>
  );
}
