import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Kanban, NewButton,
  RecordDialog, statusTone, dt, titleCase, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/ops/airspace")({
  head: () => ({ meta: [{ title: "Airspace & Approvals — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: AirspacePage,
});

const COLUMNS = [
  { key: "requested", label: "Requested" },
  { key: "pending", label: "Under review" },
  { key: "approved", label: "Approved" },
  { key: "active", label: "Active window" },
  { key: "expired", label: "Expired" },
  { key: "denied", label: "Denied" },
];

function AirspacePage() {
  const { rows, loading, insert, patch } = useRows("ops_authorizations", { order: { column: "starts_at" } });
  const { rows: flights } = useRows("ops_flights", { order: { column: "created_at" } });
  const { people } = usePeople();
  const [creating, setCreating] = useState(false);

  const fields: Field[] = [
    { key: "reference", label: "Reference", type: "text", required: true, placeholder: "LAANC-2026-0142" },
    { key: "authority", label: "Authority", type: "select", options: ["FAA LAANC", "FAA Part 107 Waiver", "State Fire Agency", "Local TFR Coordinator", "Landowner"].map((v) => ({ value: v, label: v })) },
    { key: "kind", label: "Type", type: "select", options: ["laanc", "waiver", "tfr_entry", "bvlos", "night_ops"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "region", label: "Region / airspace", type: "text" },
    { key: "ceiling_ft", label: "Ceiling (ft AGL)", type: "number" },
    { key: "starts_at", label: "Window opens", type: "datetime" },
    { key: "ends_at", label: "Window closes", type: "datetime" },
    { key: "flight_id", label: "Linked sortie", type: "select", options: flights.map((f: any) => ({ value: f.id, label: f.callsign })) },
    { key: "notes", label: "Conditions & restrictions", type: "textarea", full: true },
  ];

  const approved = rows.filter((r: any) => ["approved", "active"].includes(r.status)).length;
  const waiting = rows.filter((r: any) => ["requested", "pending"].includes(r.status)).length;
  const denied = rows.filter((r: any) => r.status === "denied").length;

  return (
    <WorkPage
      wide eyebrow="Mission Operations · Compliance"
      title="Airspace & approvals"
      lede="Nothing launches into controlled airspace without a live clearance. Track every LAANC request, waiver and TFR entry from request to expiry."
      actions={<NewButton label="New authorization" onClick={() => setCreating(true)} />}
    >
      <StatRow cols={3}>
        <Stat label="Cleared to fly" value={approved} icon={ShieldCheck} tone={approved ? "good" : "warn"} />
        <Stat label="Awaiting decision" value={waiting} icon={Clock} tone={waiting ? "warn" : "default"} />
        <Stat label="Denied" value={denied} icon={AlertTriangle} tone={denied ? "risk" : "default"} />
      </StatRow>

      {loading ? <Loading /> : rows.length === 0 ? (
        <Card className="mt-5"><Empty>No airspace authorizations on file yet.</Empty></Card>
      ) : (
        <div className="overflow-x-auto pb-2">
          <Kanban
            columns={COLUMNS} rows={rows as any[]} statusKey="status"
            onMove={(r: any, status) => patch(r.id, { status })}
            render={(r: any) => (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold">{r.reference}</span>
                  <Pill tone={statusTone(r.status)}>{titleCase(r.kind)}</Pill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.authority}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {r.region || "—"} · {r.ceiling_ft ? `${r.ceiling_ft} ft AGL` : "no ceiling set"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{dt(r.starts_at)} → {dt(r.ends_at)}</p>
              </>
            )}
          />
        </div>
      )}

      {creating && (
        <RecordDialog
          title="Request airspace authorization" fields={fields} people={people}
          initial={{ authority: "FAA LAANC", kind: "laanc" }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, status: "requested" }); setCreating(false); }}
        />
      )}
    </WorkPage>
  );
}
