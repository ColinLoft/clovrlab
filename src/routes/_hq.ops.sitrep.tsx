import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Radar, Plane, ShieldCheck, Wrench, RefreshCw, Clock } from "lucide-react";
import {
  db, WorkPage, Card, Pill, Empty, Loading, Btn, Stat, StatRow, statusTone, dt, titleCase,
  usePeople, nameOf,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/ops/sitrep")({
  head: () => ({ meta: [{ title: "Situation Report — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: SitrepPage,
});

type Beat = {
  id: string; at: string; kind: "detection" | "flight" | "airspace" | "maintenance";
  title: string; detail: string; status: string;
};

const KIND = {
  detection: { icon: Radar, label: "Detection", cls: "text-primary bg-primary/10 border-primary/25" },
  flight: { icon: Plane, label: "Sortie", cls: "text-sky-500 bg-sky-500/10 border-sky-500/25" },
  airspace: { icon: ShieldCheck, label: "Airspace", cls: "text-amber-500 bg-amber-500/10 border-amber-500/25" },
  maintenance: { icon: Wrench, label: "Maintenance", cls: "text-muted-foreground bg-muted border-border" },
} as const;

function SitrepPage() {
  const [beats, setBeats] = useState<Beat[] | null>(null);
  const [filter, setFilter] = useState<"all" | keyof typeof KIND>("all");
  const [tick, setTick] = useState(0);
  const { byId } = usePeople();

  useEffect(() => {
    let alive = true;
    (async () => {
      const [det, fl, auth, mx] = await Promise.all([
        db.from("ops_detections").select("*").order("detected_at", { ascending: false }).limit(40),
        db.from("ops_flights").select("*").order("created_at", { ascending: false }).limit(40),
        db.from("ops_authorizations").select("*").order("starts_at", { ascending: false }).limit(30),
        db.from("fleet_maintenance").select("*").order("opened_on", { ascending: false }).limit(30),
      ]);
      if (!alive) return;
      const all: Beat[] = [
        ...(det.data ?? []).map((x: any) => ({
          id: `d${x.id}`, at: x.detected_at || x.created_at, kind: "detection" as const,
          title: x.name, status: x.status,
          detail: `${x.region || "unmapped"} · ${titleCase(x.source)} · confidence ${x.confidence ? Math.round(Number(x.confidence)) + "%" : "—"}`,
        })),
        ...(fl.data ?? []).map((x: any) => ({
          id: `f${x.id}`, at: x.departs_at || x.created_at, kind: "flight" as const,
          title: `${x.callsign} — ${x.objective || "sortie"}`, status: x.status,
          detail: `PIC ${nameOf(byId, x.pilot_id)}${x.payload_released ? " · payload released" : ""}`,
        })),
        ...(auth.data ?? []).map((x: any) => ({
          id: `a${x.id}`, at: x.starts_at || x.created_at, kind: "airspace" as const,
          title: `${x.reference} — ${x.authority}`, status: x.status,
          detail: `${titleCase(x.kind)} · ${x.region || "—"}${x.ceiling_ft ? ` · ceiling ${x.ceiling_ft} ft` : ""}`,
        })),
        ...(mx.data ?? []).map((x: any) => ({
          id: `m${x.id}`, at: x.opened_on || x.created_at, kind: "maintenance" as const,
          title: x.title, status: x.status,
          detail: `${titleCase(x.kind)}${x.grounding ? " · grounding" : ""} · ${nameOf(byId, x.assignee_id)}`,
        })),
      ].filter((b) => b.at);
      all.sort((a, b) => +new Date(b.at) - +new Date(a.at));
      setBeats(all.slice(0, 60));
    })();
    return () => { alive = false; };
  }, [tick, byId]);

  const shown = useMemo(() => (beats ?? []).filter((b) => filter === "all" || b.kind === filter), [beats, filter]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { detection: 0, flight: 0, airspace: 0, maintenance: 0 };
    for (const b of beats ?? []) c[b.kind]++;
    return c;
  }, [beats]);

  return (
    <WorkPage
      eyebrow="Mission Operations"
      title="Situation report"
      lede="One chronological record of everything the operation did today — what was seen, what flew, who cleared the airspace and what came off the line for maintenance."
      actions={<Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>}
    >
      <StatRow cols={4}>
        <Stat label="Detection events" value={counts.detection} icon={Radar} />
        <Stat label="Sorties logged" value={counts.flight} icon={Plane} />
        <Stat label="Airspace actions" value={counts.airspace} icon={ShieldCheck} />
        <Stat label="Maintenance events" value={counts.maintenance} icon={Wrench} />
      </StatRow>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {(["all", "detection", "flight", "airspace", "maintenance"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === k ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {k === "all" ? "Everything" : KIND[k].label}
          </button>
        ))}
      </div>

      <Card className="mt-4" pad={false}>
        {!beats ? <Loading /> : shown.length === 0 ? (
          <Empty>Nothing on the timeline yet. Events appear here as the operation runs.</Empty>
        ) : (
          <ol className="relative px-5 py-4">
            <span aria-hidden className="absolute bottom-4 left-[30px] top-4 w-px bg-border" />
            {shown.map((b) => {
              const K = KIND[b.kind];
              return (
                <li key={b.id} className="relative flex gap-4 py-3 pl-0">
                  <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${K.cls}`}>
                    <K.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{b.title}</p>
                      <Pill tone={statusTone(b.status)}>{titleCase(b.status)}</Pill>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{b.detail}</p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 text-[11px] tabular-nums text-muted-foreground sm:flex">
                    <Clock className="h-3 w-3" /> {dt(b.at)}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </WorkPage>
  );
}
