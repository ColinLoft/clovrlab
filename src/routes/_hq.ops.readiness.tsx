import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plane, Wrench, AlertTriangle, Gauge } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, statusTone, titleCase, Bar, nameOf, raiseRequest, d, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/ops/readiness")({
  head: () => ({ meta: [{ title: "Fleet Readiness — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: ReadinessPage,
});

const AC_STATUS = ["available", "reserved", "flying", "maintenance", "grounded", "retired"];

function ReadinessPage() {
  const aircraft = useRows("fleet_aircraft", { order: { column: "tail_number", ascending: true } });
  const maint = useRows("fleet_maintenance", { order: { column: "opened_on" } });
  const { people, byId } = usePeople();
  const [addAircraft, setAddAircraft] = useState(false);
  const [addJob, setAddJob] = useState<string | null>(null);

  const acFields: Field[] = [
    { key: "tail_number", label: "Tail number", type: "text", required: true, placeholder: "N412CL" },
    { key: "model", label: "Model", type: "text", placeholder: "Athera VTOL" },
    { key: "base", label: "Home base", type: "text" },
    { key: "status", label: "Status", type: "select", options: AC_STATUS.map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "flight_hours", label: "Flight hours", type: "number" },
    { key: "cycles", label: "Cycles", type: "number" },
    { key: "next_service_hours", label: "Next service at (hours)", type: "number" },
    { key: "next_service_date", label: "Next service date", type: "date" },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ];

  const jobFields: Field[] = [
    { key: "title", label: "Work item", type: "text", required: true },
    { key: "kind", label: "Type", type: "select", options: ["scheduled", "unscheduled", "inspection", "modification", "software"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "severity", label: "Severity", type: "select", options: ["normal", "high", "critical"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "grounding", label: "Grounds the aircraft", type: "bool" },
    { key: "assignee_id", label: "Assigned to", type: "user" },
    { key: "notes", label: "Details", type: "textarea", full: true },
  ];

  const ready = aircraft.rows.filter((a: any) => a.status === "available").length;
  const down = aircraft.rows.filter((a: any) => ["maintenance", "grounded"].includes(a.status)).length;
  const openJobs = maint.rows.filter((m: any) => m.status !== "closed");
  const hours = aircraft.rows.reduce((s: number, a: any) => s + Number(a.flight_hours || 0), 0);

  const requestParts = async (a: any) => {
    const item = prompt(`Which part does ${a.tail_number} need from manufacturing?`);
    if (!item) return;
    const ok = await raiseRequest({
      from_team: "ops", to_team: "mfg", subject: `Part request — ${a.tail_number}`,
      details: `${item} required to return ${a.tail_number} to service.`, entity_type: "fleet_aircraft",
      entity_id: a.id, priority: "high",
    });
    if (ok) alert("Request sent to Manufacturing.");
  };

  return (
    <WorkPage
      wide eyebrow="Mission Operations · Fleet"
      title="Fleet readiness"
      lede="Which aircraft can launch right now, what is holding the rest on the ground, and who is fixing it."
      actions={<NewButton label="Add aircraft" onClick={() => setAddAircraft(true)} />}
    >
      <StatRow>
        <Stat label="Mission ready" value={`${ready}/${aircraft.rows.length}`} icon={Plane} tone={ready ? "good" : "risk"} />
        <Stat label="Down for maintenance" value={down} icon={Wrench} tone={down ? "warn" : "good"} />
        <Stat label="Open work items" value={openJobs.length} icon={AlertTriangle} tone={openJobs.some((m: any) => m.grounding) ? "risk" : "default"} />
        <Stat label="Fleet hours" value={hours.toFixed(1)} icon={Gauge} />
      </StatRow>

      {aircraft.loading ? <Loading /> : (
        <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {aircraft.rows.length === 0 && <Card className="sm:col-span-2"><Empty>No aircraft registered yet.</Empty></Card>}
            {aircraft.rows.map((a: any) => {
              const jobs = maint.rows.filter((m: any) => m.aircraft_id === a.id && m.status !== "closed");
              const service = Number(a.next_service_hours || 0);
              return (
                <article key={a.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-lg font-semibold">{a.tail_number}</p>
                      <p className="text-xs text-muted-foreground">{a.model || "UAV"} · {a.base || "no base"}</p>
                    </div>
                    <select value={a.status} onChange={(e) => aircraft.patch(a.id, { status: e.target.value })}
                      className="rounded border border-border bg-background px-2 py-1 text-xs capitalize">
                      {AC_STATUS.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                    </select>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{Number(a.flight_hours || 0).toFixed(1)} h flown</span>
                      <span>{service ? `service at ${service} h` : "no service target"}</span>
                    </div>
                    <div className="mt-1"><Bar value={Number(a.flight_hours || 0)} max={service || Math.max(1, Number(a.flight_hours || 1))}
                      tone={service && Number(a.flight_hours || 0) >= service ? "risk" : "primary"} /></div>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {a.cycles || 0} cycles · next service {a.next_service_date ? d(a.next_service_date) : "unscheduled"}
                  </p>
                  {jobs.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-border pt-2">
                      {jobs.map((m: any) => (
                        <li key={m.id} className="flex items-center justify-between text-xs">
                          <span className="truncate">{m.title}</span>
                          <Pill tone={m.grounding ? "risk" : statusTone(m.status)}>{m.grounding ? "grounding" : titleCase(m.status)}</Pill>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Btn onClick={() => setAddJob(a.id)}><Wrench className="h-3.5 w-3.5" /> Log maintenance</Btn>
                    <Btn variant="ghost" onClick={() => requestParts(a)}>Request part</Btn>
                  </div>
                </article>
              );
            })}
          </div>

          <Card title="Maintenance queue" hint="Shared with Manufacturing" pad={false}>
            <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {maint.rows.length === 0 && <Empty>No maintenance logged.</Empty>}
              {maint.rows.map((m: any) => {
                const a: any = aircraft.rows.find((x: any) => x.id === m.aircraft_id);
                return (
                  <div key={m.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{m.title}</span>
                      <select value={m.status} onChange={(e) => maint.patch(m.id, { status: e.target.value, closed_on: e.target.value === "closed" ? new Date().toISOString().slice(0, 10) : null })}
                        className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] capitalize">
                        {["open", "in_progress", "waiting_parts", "closed"].map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                      </select>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {a?.tail_number ?? "unassigned"} · {titleCase(m.kind)} · {titleCase(m.severity)} · {nameOf(byId, m.assignee_id)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {addAircraft && (
        <RecordDialog title="Register aircraft" fields={acFields} people={people}
          initial={{ status: "available", flight_hours: 0, cycles: 0 }}
          onCancel={() => setAddAircraft(false)}
          onSave={async (v) => { await aircraft.insert(v); setAddAircraft(false); }} />
      )}
      {addJob && (
        <RecordDialog title="Log maintenance" fields={jobFields} people={people}
          initial={{ kind: "unscheduled", severity: "normal" }}
          onCancel={() => setAddJob(null)}
          onSave={async (v) => {
            await maint.insert({ ...v, aircraft_id: addJob, status: "open" });
            if (v.grounding) await aircraft.patch(addJob, { status: "grounded" });
            setAddJob(null);
          }} />
      )}
    </WorkPage>
  );
}
