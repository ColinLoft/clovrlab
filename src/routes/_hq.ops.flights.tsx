import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plane, ShieldCheck, Droplets, CheckCircle2 } from "lucide-react";
import {
  useRows, usePeople, useMe, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, statusTone, dt, titleCase, Toolbar, nameOf, raiseRequest, type Field, db,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/ops/flights")({
  head: () => ({ meta: [{ title: "Flight Log — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: FlightsPage,
});

const STATUS = ["planned", "authorized", "launched", "flying", "returning", "complete", "cancelled"];

function FlightsPage() {
  const { rows, loading, insert, patch } = useRows("ops_flights", { order: { column: "created_at" } });
  const { rows: aircraft } = useRows("fleet_aircraft", { order: { column: "tail_number", ascending: true } });
  const { rows: detections } = useRows("ops_detections", { order: { column: "detected_at" } });
  const { people, byId } = usePeople();
  const me = useMe();
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);

  const fields: Field[] = [
    { key: "callsign", label: "Callsign", type: "text", required: true, placeholder: "CLVR-114" },
    { key: "aircraft_id", label: "Aircraft", type: "select", options: aircraft.map((a: any) => ({ value: a.id, label: `${a.tail_number} — ${a.model ?? "UAV"}` })) },
    { key: "detection_id", label: "Responding to detection", type: "select", options: detections.map((x: any) => ({ value: x.id, label: x.name })) },
    { key: "pilot_id", label: "Pilot in command", type: "user", required: true },
    { key: "objective", label: "Objective", type: "text", full: true, placeholder: "Confirm ignition and attempt initial suppression" },
    { key: "departs_at", label: "Planned departure", type: "datetime" },
    { key: "notes", label: "Brief", type: "textarea", full: true },
  ];

  const filtered = useMemo(
    () => rows.filter((r: any) => !q || `${r.callsign} ${r.objective ?? ""} ${r.status}`.toLowerCase().includes(q.toLowerCase())),
    [rows, q],
  );

  const authorize = async (row: any) => {
    if (!confirm(`Authorize ${row.callsign}? Your name is recorded as the authorizing officer.`)) return;
    await patch(row.id, { status: "authorized", authorized_by: me, authorized_at: new Date().toISOString() });
  };

  const release = async (row: any) => {
    if (!confirm("Confirm human-approved payload release for this sortie?")) return;
    await patch(row.id, { payload_released: true });
  };

  const closeOut = async (row: any) => {
    const outcome = prompt("Outcome of the sortie (e.g. suppressed, contained, handed to responders):", row.outcome ?? "");
    if (outcome === null) return;
    await patch(row.id, { status: "complete", outcome, returns_at: new Date().toISOString() });
    if (row.aircraft_id) {
      const a: any = aircraft.find((x: any) => x.id === row.aircraft_id);
      if (a) await db.from("fleet_aircraft").update({ flight_hours: Number(a.flight_hours || 0) + 1, cycles: Number(a.cycles || 0) + 1 }).eq("id", a.id);
    }
    await raiseRequest({
      from_team: "ops", to_team: "eng", subject: `Flight data review — ${row.callsign}`,
      details: `Sortie closed with outcome: ${outcome}. Telemetry and imagery ready for engineering review.`,
      entity_type: "ops_flights", entity_id: row.id, priority: "normal",
    });
  };

  const airborne = rows.filter((r: any) => ["launched", "flying", "returning"].includes(r.status)).length;
  const awaiting = rows.filter((r: any) => r.status === "planned").length;
  const releases = rows.filter((r: any) => r.payload_released).length;

  return (
    <WorkPage
      wide eyebrow="Mission Operations · Flight"
      title="Flight log"
      lede="Autonomous, not unsupervised. Each sortie carries a named pilot in command and a named authorizing officer before launch."
      actions={<NewButton label="Plan sortie" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="Airborne now" value={airborne} icon={Plane} tone={airborne ? "info" as any : "default"} />
        <Stat label="Awaiting authorization" value={awaiting} icon={ShieldCheck} tone={awaiting ? "warn" : "good"} />
        <Stat label="Payload releases" value={releases} icon={Droplets} />
        <Stat label="Sorties logged" value={rows.length} icon={CheckCircle2} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search callsign, objective…" />

      {loading ? <Loading /> : (
        <Card className="mt-4" pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Callsign</th><th className="px-4 py-2.5">Objective</th>
                  <th className="px-4 py-2.5">PIC</th><th className="px-4 py-2.5">Authorized by</th>
                  <th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5">Payload</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && <tr><td colSpan={7}><Empty>No sorties planned.</Empty></td></tr>}
                {filtered.map((r: any) => (
                  <tr key={r.id} className="hover:bg-accent/50">
                    <td className="px-4 py-3 font-mono font-semibold">{r.callsign}</td>
                    <td className="max-w-[280px] truncate px-4 py-3 text-muted-foreground">{r.objective || "—"}</td>
                    <td className="px-4 py-3">{nameOf(byId, r.pilot_id)}</td>
                    <td className="px-4 py-3 text-xs">
                      {r.authorized_by ? <>{nameOf(byId, r.authorized_by)}<br /><span className="text-muted-foreground">{dt(r.authorized_at)}</span></> : <span className="text-amber-500">Not authorized</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })}
                        className="rounded border border-border bg-background px-2 py-1 text-xs capitalize">
                        {STATUS.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">{r.payload_released ? <Pill tone="good">Released</Pill> : <Pill>Held</Pill>}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {!r.authorized_by && <Btn onClick={() => authorize(r)}>Authorize</Btn>}
                        {r.authorized_by && !r.payload_released && r.status !== "complete" && <Btn onClick={() => release(r)}>Release payload</Btn>}
                        {r.status !== "complete" && <Btn variant="ghost" onClick={() => closeOut(r)}>Close out</Btn>}
                        {r.status === "complete" && <Pill tone={statusTone(r.outcome)}>{r.outcome || "complete"}</Pill>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {creating && (
        <RecordDialog
          title="Plan a sortie" fields={fields} people={people} initial={{}}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, status: "planned" }); setCreating(false); }}
        />
      )}
    </WorkPage>
  );
}
