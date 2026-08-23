import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3, RefreshCw, Timer, BellRing, ArrowUpRight, Flame, Gauge, Download, Printer, CheckCircle2,
} from "lucide-react";
import { WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Select, dt } from "@/components/hq/work/kit";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv, printReport } from "@/lib/net/export";

export const Route = createFileRoute("/_hq/systems/analytics")({
  head: () => ({
    meta: [
      { title: "Detection & Paging Analytics — Clovr Labs" },
      { name: "description", content: "Response performance across the detection network: mean time to acknowledge, mean time to resolve, acknowledgement rates and escalation counts by camera, zone and incident type." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalyticsPage,
});

const RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
];

type Row = Record<string, any>;

const mins = (a?: string | null, b?: string | null) =>
  a && b ? (new Date(b).getTime() - new Date(a).getTime()) / 60000 : null;

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);

function dur(m: number | null) {
  if (m == null) return "—";
  if (m < 1) return `${Math.round(m * 60)}s`;
  if (m < 90) return `${m.toFixed(1)}m`;
  return `${(m / 60).toFixed(1)}h`;
}

function AnalyticsPage() {
  const [range, setRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [alerts, setAlerts] = useState<Row[]>([]);
  const [incidents, setIncidents] = useState<Row[]>([]);
  const [events, setEvents] = useState<Row[]>([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const since = new Date(Date.now() - Number(range) * 864e5).toISOString();
    const db = supabase as any;
    Promise.all([
      db.from("page_alerts").select("*").gte("created_at", since).limit(2000),
      db.from("net_incidents").select("*").gte("discovered_at", since).limit(2000),
      db.from("net_detection_events").select("*").gte("created_at", since).limit(5000),
    ])
      .then(([a, i, e]) => {
        if (!alive) return;
        setAlerts(a.data ?? []); setIncidents(i.data ?? []); setEvents(e.data ?? []);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [range, tick]);

  const m = useMemo(() => {
    const acked = alerts.filter((a) => a.acked_at);
    const mtta = avg(acked.map((a) => mins(a.created_at, a.acked_at)!).filter((x) => x != null));
    const resolvedAlerts = alerts.filter((a) => a.resolved_at);
    const mttrPage = avg(resolvedAlerts.map((a) => mins(a.created_at, a.resolved_at)!).filter((x) => x != null));
    const ackRate = alerts.length ? (acked.length / alerts.length) * 100 : null;
    const escalated = alerts.filter((a) => Number(a.level ?? 0) > 1);
    const incResolved = incidents.filter((i) => i.resolved_at ?? i.closed_at);
    const mttrInc = avg(
      incResolved.map((i) => mins(i.discovered_at, i.resolved_at ?? i.closed_at)!).filter((x) => x != null),
    );
    const mttaInc = avg(incidents.filter((i) => i.acked_at).map((i) => mins(i.discovered_at, i.acked_at)!));

    // per-camera rollup from detection events + incidents
    const byCamera = new Map<string, { name: string; detections: number; incidents: number; escalations: number }>();
    for (const e of events) {
      const key = e.camera_name ?? e.camera_id ?? "Unknown camera";
      const row = byCamera.get(key) ?? { name: key, detections: 0, incidents: 0, escalations: 0 };
      if (e.kind === "verdict" && (e.label === "fire" || e.label === "smoke")) row.detections += 1;
      if (e.kind === "incident_opened") row.incidents += 1;
      if (e.kind === "escalated") row.escalations += 1;
      byCamera.set(key, row);
    }

    const zone = new Map<string, { name: string; count: number; mttr: number[]; escalations: number }>();
    for (const i of incidents) {
      const key = [i.county, i.state].filter(Boolean).join(", ") || "Unzoned";
      const row = zone.get(key) ?? { name: key, count: 0, mttr: [], escalations: 0 };
      row.count += 1;
      const d = mins(i.discovered_at, i.resolved_at ?? i.closed_at);
      if (d != null) row.mttr.push(d);
      zone.set(key, row);
    }
    for (const a of alerts) {
      if (Number(a.level ?? 0) > 1 && a.source_table === "net_incidents") {
        const inc = incidents.find((i) => i.id === a.source_id);
        const key = inc ? [inc.county, inc.state].filter(Boolean).join(", ") || "Unzoned" : "Unzoned";
        const row = zone.get(key);
        if (row) row.escalations += 1;
      }
    }

    const byType = new Map<string, { name: string; count: number; mtta: number[]; mttr: number[] }>();
    for (const i of incidents) {
      const key = String(i.source ?? "other");
      const row = byType.get(key) ?? { name: key, count: 0, mtta: [], mttr: [] };
      row.count += 1;
      const ta = mins(i.discovered_at, i.acked_at);
      const tr = mins(i.discovered_at, i.resolved_at ?? i.closed_at);
      if (ta != null) row.mtta.push(ta);
      if (tr != null) row.mttr.push(tr);
      byType.set(key, row);
    }

    const falsePositives = incidents.filter(
      (i) => i.status === "false_positive" || i.resolution === "false_positive",
    ).length;

    return {
      mtta, mttrPage, ackRate, escalated: escalated.length, mttaInc, mttrInc,
      pages: alerts.length, incidents: incidents.length, falsePositives,
      cameras: [...byCamera.values()].sort((a, b) => b.incidents - a.incidents || b.detections - a.detections),
      zones: [...zone.values()].sort((a, b) => b.count - a.count),
      types: [...byType.values()].sort((a, b) => b.count - a.count),
    };
  }, [alerts, incidents, events]);

  const cameraCols = [
    { key: "name", label: "Camera" },
    { key: "detections", label: "Fire/smoke verdicts" },
    { key: "incidents", label: "Incidents" },
    { key: "escalations", label: "Escalations" },
  ];

  return (
    <WorkPage
      wide
      eyebrow="Enterprise Systems · Detection"
      title="Response analytics"
      lede="How fast the network gets a human on a detection, and how often it takes more than one page to get there. Everything below is measured over the selected window."
      actions={
        <>
          <Select value={range} onChange={setRange} options={RANGES} className="w-40" />
          <Btn onClick={() => downloadCsv("camera-performance", cameraCols, m.cameras)}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Btn>
          <Btn onClick={() => printReport({
            title: "Detection response analytics",
            subtitle: RANGES.find((r) => r.value === range)?.label ?? "",
            columns: cameraCols,
            rows: m.cameras,
            summary: [
              { label: "MTTA (pages)", value: dur(m.mtta) },
              { label: "MTTR (incidents)", value: dur(m.mttrInc) },
              { label: "Ack rate", value: m.ackRate == null ? "—" : `${m.ackRate.toFixed(0)}%` },
              { label: "Escalations", value: String(m.escalated) },
            ],
          })}>
            <Printer className="h-3.5 w-3.5" /> PDF
          </Btn>
          <Btn onClick={() => setTick((t) => t + 1)}><RefreshCw className="h-3.5 w-3.5" /> Refresh</Btn>
        </>
      }
    >
      <StatRow>
        <Stat label="MTTA — page to ack" value={dur(m.mtta)} icon={Timer} tone={m.mtta != null && m.mtta > 10 ? "warn" : "good"} />
        <Stat label="MTTR — incident closed" value={dur(m.mttrInc)} icon={Gauge} />
        <Stat label="Acknowledgement rate" value={m.ackRate == null ? "—" : `${m.ackRate.toFixed(0)}%`} icon={CheckCircle2}
          tone={m.ackRate != null && m.ackRate < 90 ? "warn" : "good"} />
        <Stat label="Escalated pages" value={m.escalated} icon={ArrowUpRight} tone={m.escalated ? "risk" : "good"} />
        <Stat label="Pages sent" value={m.pages} icon={BellRing} />
        <Stat label="Incidents" value={m.incidents} icon={Flame} />
        <Stat label="False positives" value={m.falsePositives} icon={BarChart3} />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <Card pad={false} title={`By camera (${m.cameras.length})`} hint="Ranked by incidents opened">
            <Table
              head={["Camera", "Verdicts", "Incidents", "Escalations"]}
              rows={m.cameras.map((c) => [
                c.name,
                String(c.detections),
                String(c.incidents),
                c.escalations ? <Pill tone="risk">{c.escalations}</Pill> : "0",
              ])}
              empty="No camera activity in this window."
            />
          </Card>

          <Card pad={false} title={`By zone (${m.zones.length})`} hint="County / state of each incident">
            <Table
              head={["Zone", "Incidents", "Avg time to close", "Escalations"]}
              rows={m.zones.map((z) => [
                z.name,
                String(z.count),
                dur(avg(z.mttr)),
                z.escalations ? <Pill tone="risk">{z.escalations}</Pill> : "0",
              ])}
              empty="No incidents in this window."
            />
          </Card>

          <Card pad={false} title="By incident type" hint="Grouped by detection source">
            <Table
              head={["Type", "Incidents", "MTTA", "MTTR"]}
              rows={m.types.map((t) => [
                <span className="capitalize">{t.name}</span>,
                String(t.count),
                dur(avg(t.mtta)),
                dur(avg(t.mttr)),
              ])}
              empty="No incidents in this window."
            />
          </Card>

          <Card pad={false} title="Slowest acknowledgements" hint="Pages that took longest to reach a human">
            <Table
              head={["Page", "Queue", "Sent", "Time to ack"]}
              rows={alerts
                .filter((a) => a.acked_at)
                .map((a) => ({ a, t: mins(a.created_at, a.acked_at) ?? 0 }))
                .sort((x, y) => y.t - x.t)
                .slice(0, 12)
                .map(({ a, t }) => [
                  <span className="line-clamp-1">{a.title}</span>,
                  <Pill tone={a.queue === "ops" ? "warn" : "muted"}>{a.queue ?? "ops"}</Pill>,
                  dt(a.created_at),
                  <span className={t > 15 ? "font-medium text-destructive" : ""}>{dur(t)}</span>,
                ])}
              empty="No acknowledged pages in this window."
            />
          </Card>
        </div>
      )}
    </WorkPage>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;
  return (
    <div className="max-h-[46vh] overflow-y-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
            {head.map((h) => <th key={h} className="px-4 py-2 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-muted/40">
              {r.map((c, j) => <td key={j} className="px-4 py-2 align-middle">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
