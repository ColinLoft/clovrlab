import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Radar, Plane, ShieldCheck, Gauge, RefreshCw, CircleDot } from "lucide-react";
import {
  db, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, statusTone, dt, titleCase,
  usePeople, nameOf,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/ops/control")({
  head: () => ({ meta: [{ title: "Mission Control — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: MissionControl,
});

type State = {
  detections: any[]; flights: any[]; aircraft: any[]; auths: any[]; requests: any[];
};

function MissionControl() {
  const [s, setS] = useState<State | null>(null);
  const [tick, setTick] = useState(0);
  const { byId } = usePeople();

  useEffect(() => {
    let alive = true;
    (async () => {
      const [detections, flights, aircraft, auths, requests] = await Promise.all([
        db.from("ops_detections").select("*").order("detected_at", { ascending: false }).limit(25),
        db.from("ops_flights").select("*").order("created_at", { ascending: false }).limit(25),
        db.from("fleet_aircraft").select("*").order("tail_number"),
        db.from("ops_authorizations").select("*").order("starts_at", { ascending: false }).limit(15),
        db.from("team_requests").select("*").eq("to_team", "ops").neq("status", "closed").limit(10),
      ]);
      if (!alive) return;
      setS({
        detections: detections.data ?? [], flights: flights.data ?? [], aircraft: aircraft.data ?? [],
        auths: auths.data ?? [], requests: requests.data ?? [],
      });
    })();
    return () => { alive = false; };
  }, [tick]);

  const live = useMemo(() => {
    if (!s) return null;
    const airborne = s.flights.filter((f) => ["launched", "flying", "returning"].includes(String(f.status)));
    const openDet = s.detections.filter((x) => x.status === "unconfirmed" || x.status === "confirmed");
    const ready = s.aircraft.filter((a) => a.status === "available");
    const grounded = s.aircraft.filter((a) => a.status === "grounded" || a.status === "maintenance");
    const pendingAuth = s.auths.filter((a) => a.status === "requested" || a.status === "pending");
    return { airborne, openDet, ready, grounded, pendingAuth };
  }, [s]);

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations"
      title="Mission control"
      lede="The live picture: what the sensor network sees, what is airborne, who authorized it, and which aircraft can launch next."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      {!s || !live ? <Loading /> : (
        <>
          <StatRow cols={5}>
            <Stat label="Open detections" value={live.openDet.length} icon={Radar} tone={live.openDet.length ? "warn" : "good"} />
            <Stat label="Airborne" value={live.airborne.length} icon={Plane} tone={live.airborne.length ? "info" as any : "default"} />
            <Stat label="Aircraft ready" value={`${live.ready.length}/${s.aircraft.length}`} icon={Gauge} tone={live.ready.length ? "good" : "risk"} />
            <Stat label="Awaiting airspace" value={live.pendingAuth.length} icon={ShieldCheck} tone={live.pendingAuth.length ? "warn" : "good"} />
            <Stat label="Inbound requests" value={s.requests.length} icon={CircleDot} hint="From other teams" />
          </StatRow>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_1fr_0.9fr]">
            <Card title="Detection feed" hint="Newest sensor and satellite hits" pad={false}
              action={<Link to="/ops/detections" className="text-xs text-primary hover:underline">Triage</Link>}>
              <div className="divide-y divide-border">
                {s.detections.length === 0 && <Empty>No detections yet. The feed fills as sensors report.</Empty>}
                {s.detections.slice(0, 8).map((x) => (
                  <div key={x.id} className="flex items-start justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{x.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {x.region || "unmapped"} · {x.latitude ?? "—"}, {x.longitude ?? "—"} · {dt(x.detected_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Pill tone={statusTone(x.status)}>{titleCase(x.status)}</Pill>
                      <span className="font-mono text-[11px] text-muted-foreground">{x.confidence ? `${Math.round(Number(x.confidence))}%` : "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Active sorties" hint="Human-authorized flights" pad={false}
              action={<Link to="/ops/flights" className="text-xs text-primary hover:underline">Flight log</Link>}>
              <div className="divide-y divide-border">
                {s.flights.filter((f) => f.status !== "complete" && f.status !== "cancelled").length === 0 && (
                  <Empty>Nothing airborne or queued.</Empty>
                )}
                {s.flights.filter((f) => f.status !== "complete" && f.status !== "cancelled").slice(0, 8).map((f) => (
                  <div key={f.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-semibold">{f.callsign}</span>
                      <Pill tone={statusTone(f.status)}>{titleCase(f.status)}</Pill>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{f.objective || "No objective set"}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      PIC {nameOf(byId, f.pilot_id)} · {f.authorized_at ? `authorized ${dt(f.authorized_at)}` : "awaiting authorization"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card title="Fleet at a glance" pad={false} action={<Link to="/ops/readiness" className="text-xs text-primary hover:underline">Readiness</Link>}>
                <div className="divide-y divide-border">
                  {s.aircraft.length === 0 && <Empty>No aircraft registered.</Empty>}
                  {s.aircraft.slice(0, 8).map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-4 py-2.5">
                      <span className="font-mono text-sm">{a.tail_number}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] tabular-nums text-muted-foreground">{Number(a.flight_hours || 0).toFixed(1)} h</span>
                        <Pill tone={statusTone(a.status)}>{titleCase(a.status)}</Pill>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Airspace" pad={false} action={<Link to="/ops/airspace" className="text-xs text-primary hover:underline">Approvals</Link>}>
                <div className="divide-y divide-border">
                  {s.auths.length === 0 && <Empty>No authorizations on file.</Empty>}
                  {s.auths.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-xs">{a.reference}</p>
                        <p className="text-[11px] text-muted-foreground">{a.authority} · {a.region || "—"}</p>
                      </div>
                      <Pill tone={statusTone(a.status)}>{titleCase(a.status)}</Pill>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </WorkPage>
  );
}
