import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Flame, Plane, Timer } from "lucide-react";
import {
  db, WorkPage, Card, Pill, Empty, Loading, Stat, StatRow, Bar, statusTone, titleCase, dt,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/ops/coverage")({
  head: () => ({ meta: [{ title: "Regional Coverage — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: CoveragePage,
});

type Region = {
  name: string; detections: number; confirmed: number; sorties: number;
  worst: string; lastAt: string | null; responseMins: number | null;
};

function CoveragePage() {
  const [state, setState] = useState<{ det: any[]; fl: any[] } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [det, fl] = await Promise.all([
        db.from("ops_detections").select("*").order("detected_at", { ascending: false }).limit(500),
        db.from("ops_flights").select("*").limit(500),
      ]);
      if (!alive) return;
      setState({ det: det.data ?? [], fl: fl.data ?? [] });
    })();
    return () => { alive = false; };
  }, []);

  const regions = useMemo<Region[]>(() => {
    if (!state) return [];
    const rank = ["low", "moderate", "high", "extreme"];
    const byRegion = new Map<string, Region>();
    const flightsByDetection = new Map<string, any[]>();
    for (const f of state.fl) {
      if (!f.detection_id) continue;
      flightsByDetection.set(f.detection_id, [...(flightsByDetection.get(f.detection_id) ?? []), f]);
    }
    for (const dRow of state.det) {
      const key = dRow.region || "Unmapped";
      const cur = byRegion.get(key) ?? { name: key, detections: 0, confirmed: 0, sorties: 0, worst: "low", lastAt: null, responseMins: null };
      cur.detections++;
      if (dRow.status === "confirmed") cur.confirmed++;
      if (rank.indexOf(String(dRow.severity)) > rank.indexOf(cur.worst)) cur.worst = String(dRow.severity);
      if (!cur.lastAt || +new Date(dRow.detected_at) > +new Date(cur.lastAt)) cur.lastAt = dRow.detected_at;
      const fls = flightsByDetection.get(dRow.id) ?? [];
      cur.sorties += fls.length;
      const first = fls.map((f) => f.departs_at).filter(Boolean).sort()[0];
      if (first && dRow.detected_at) {
        const mins = Math.max(0, Math.round((+new Date(first) - +new Date(dRow.detected_at)) / 60000));
        cur.responseMins = cur.responseMins === null ? mins : Math.round((cur.responseMins + mins) / 2);
      }
      byRegion.set(key, cur);
    }
    return [...byRegion.values()].sort((a, b) => b.detections - a.detections);
  }, [state]);

  const maxDet = Math.max(1, ...regions.map((r) => r.detections));
  const active = regions.find((r) => r.name === selected) ?? null;
  const activeDetections = (state?.det ?? []).filter((x) => (x.region || "Unmapped") === active?.name).slice(0, 12);

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations"
      title="Regional coverage"
      lede="Where the network is watching, how hot each region runs and how quickly a sortie reaches a confirmed detection there."
    >
      {!state ? <Loading /> : (
        <>
          <StatRow cols={4}>
            <Stat label="Regions watched" value={regions.length} icon={MapPin} />
            <Stat label="Detections" value={regions.reduce((n, r) => n + r.detections, 0)} icon={Flame} />
            <Stat label="Confirmed" value={regions.reduce((n, r) => n + r.confirmed, 0)} icon={Flame} tone="warn" />
            <Stat label="Sorties launched" value={regions.reduce((n, r) => n + r.sorties, 0)} icon={Plane} />
          </StatRow>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Card title="Coverage grid" hint="Click a region to inspect its recent activity" pad={false}>
              {regions.length === 0 ? <Empty>No regions on record yet.</Empty> : (
                <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {regions.map((r) => (
                    <button
                      key={r.name}
                      onClick={() => setSelected(r.name)}
                      className={`bg-card p-4 text-left transition hover:bg-muted ${selected === r.name ? "ring-1 ring-inset ring-primary" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{r.name}</p>
                        <Pill tone={r.worst === "extreme" || r.worst === "high" ? "risk" : r.worst === "moderate" ? "warn" : "muted"}>
                          {titleCase(r.worst)}
                        </Pill>
                      </div>
                      <p className="mt-3 text-2xl font-semibold tabular-nums">{r.detections}</p>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">detections</p>
                      <div className="mt-3"><Bar value={r.detections} max={maxDet} tone={r.confirmed ? "risk" : "primary"} /></div>
                      <p className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{r.confirmed} confirmed · {r.sorties} sorties</span>
                        <span className="tabular-nums">{r.responseMins === null ? "—" : `${r.responseMins}m`}</span>
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <Card title={active ? active.name : "Region detail"} hint={active ? "Most recent detections in this region" : "Pick a region from the grid"} pad={false}>
              {!active ? <Empty>Select a region to see its detection history.</Empty> : (
                <>
                  <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
                    <div className="bg-card p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last hit</p>
                      <p className="mt-1 text-xs font-medium">{dt(active.lastAt)}</p>
                    </div>
                    <div className="bg-card p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Confirm rate</p>
                      <p className="mt-1 text-xs font-medium tabular-nums">
                        {active.detections ? Math.round((active.confirmed / active.detections) * 100) : 0}%
                      </p>
                    </div>
                    <div className="bg-card p-3">
                      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground"><Timer className="h-3 w-3" /> Response</p>
                      <p className="mt-1 text-xs font-medium tabular-nums">{active.responseMins === null ? "—" : `${active.responseMins} min`}</p>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {activeDetections.length === 0 && <Empty>No detections recorded here.</Empty>}
                    {activeDetections.map((x) => (
                      <div key={x.id} className="flex items-start justify-between gap-3 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{x.name}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                            {x.latitude ?? "—"}, {x.longitude ?? "—"} · {dt(x.detected_at)}
                          </p>
                        </div>
                        <Pill tone={statusTone(x.status)}>{titleCase(x.status)}</Pill>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </WorkPage>
  );
}
