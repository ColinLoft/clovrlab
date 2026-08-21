import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plane, BatteryCharging, Droplets, Warehouse, RefreshCw } from "lucide-react";
import { WorkPage, Card, Btn, Empty, Loading, Stat, StatRow, Bar, dt } from "@/components/hq/work/kit";
import { fetchDrones, fetchBases, STATUS_META, type DroneRow, type BaseRow } from "@/lib/net/drones";

export const Route = createFileRoute("/_hq/ops/network-fleet")({
  head: () => ({
    meta: [
      { title: "Response Fleet — Clovr Labs" },
      { name: "description", content: "Aircraft in the detection network: readiness, battery, retardant load and home base." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NetworkFleetPage,
});

function NetworkFleetPage() {
  const [drones, setDrones] = useState<DroneRow[]>([]);
  const [bases, setBases] = useState<BaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const [d, b] = await Promise.all([
        fetchDrones().catch(() => [] as DroneRow[]),
        fetchBases().catch(() => [] as BaseRow[]),
      ]);
      if (!alive) return;
      setDrones(d); setBases(b); setLoading(false);
    })();
    return () => { alive = false; };
  }, [tick]);

  const ready = drones.filter((d) => d.status === "ready").length;
  const inflight = drones.filter((d) => d.status === "inflight" || d.status === "returning").length;
  const loaded = drones.filter((d) => (d.retardant_l ?? 0) > 0).length;

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Fleet"
      title="Response fleet"
      lede="The aircraft the dispatcher can actually launch: readiness state, energy, payload and where each one lives."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      <StatRow>
        <Stat label="Ready to launch" value={`${ready}/${drones.length}`} icon={Plane} tone={ready ? "good" : "risk"} />
        <Stat label="Airborne" value={inflight} icon={Plane} />
        <Stat label="Payload loaded" value={loaded} icon={Droplets} />
        <Stat label="Bases" value={bases.length} icon={Warehouse} />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card pad={false} title={`Aircraft (${drones.length})`}>
            <div className="divide-y divide-border">
              {drones.length === 0 && <Empty>No aircraft registered in the detection network yet.</Empty>}
              {drones.map((d) => {
                const meta = STATUS_META[d.status];
                return (
                  <div key={d.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold">{d.tail_number}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {d.airframe?.model ?? "Airframe unknown"} · {d.base?.name ?? "No home base"}
                        </p>
                      </div>
                      <span className="rounded-full px-2 py-0.5 text-[11px]" style={{ color: meta?.color, border: `1px solid ${meta?.color}55` }}>
                        {meta?.label ?? d.status}
                      </span>
                    </div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><BatteryCharging className="h-3 w-3" /> Battery {d.battery_pct ?? 0}%</p>
                        <Bar value={Number(d.battery_pct ?? 0)} tone={(d.battery_pct ?? 0) >= 40 ? "good" : "risk"} />
                      </div>
                      <div>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Droplets className="h-3 w-3" /> Retardant {d.retardant_l ?? 0} L</p>
                        <Bar value={Number(d.retardant_l ?? 0)} max={Number(d.airframe?.retardant_capacity_l ?? 100)} />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {Number(d.flight_hours ?? 0).toFixed(1)} h flown · next service {d.next_service_at ? dt(d.next_service_at) : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card pad={false} title="Bases">
            <div className="divide-y divide-border">
              {bases.length === 0 && <Empty>No bases configured.</Empty>}
              {bases.map((b) => (
                <div key={b.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {b.code} · {Number(b.lat).toFixed(3)}, {Number(b.lng).toFixed(3)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {drones.filter((d) => d.base?.id === b.id).length} aircraft
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </WorkPage>
  );
}
