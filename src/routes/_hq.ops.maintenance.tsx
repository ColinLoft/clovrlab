import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wrench, PlaneTakeoff, TriangleAlert } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, Toolbar, Select, Btn, statusTone, d,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

const STATUSES = ["open", "in_progress", "waiting_parts", "closed"];

function Maintenance() {
  const aircraft = useRows<any>("fleet_aircraft", { order: { column: "tail_number", ascending: true } });
  const { rows, loading, insert, patch } = useRows<any>("fleet_maintenance", { order: { column: "opened_on" } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("open");
  const [open, setOpen] = useState(false);

  const tailOf = useMemo(() => new Map(aircraft.rows.map((a: any) => [a.id, a.tail_number])), [aircraft.rows]);

  const fields: Field[] = [
    { key: "aircraft_id", label: "Aircraft", type: "select", required: true, options: aircraft.rows.map((a: any) => ({ value: a.id, label: `${a.tail_number} · ${a.model ?? ""}` })) },
    { key: "title", label: "Work item", type: "text", required: true, full: true },
    { key: "kind", label: "Type", type: "select", options: ["scheduled", "unscheduled", "inspection", "modification"].map((v) => ({ value: v, label: v })) },
    { key: "severity", label: "Severity", type: "select", options: ["low", "medium", "high", "critical"].map((v) => ({ value: v, label: v })) },
    { key: "status", label: "Status", type: "select", options: STATUSES.map((v) => ({ value: v, label: v })) },
    { key: "assignee_id", label: "Technician", type: "user" },
    { key: "grounding", label: "Grounds the aircraft", type: "bool" },
    { key: "opened_on", label: "Opened", type: "date" },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ];

  const filtered = rows.filter((r: any) =>
    (status === "all" || (r.status ?? "open") === status) &&
    `${r.title} ${tailOf.get(r.aircraft_id) ?? ""} ${r.kind ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  const grounded = rows.filter((r: any) => r.grounding && r.status !== "closed");
  const groundedTails = new Set(grounded.map((r: any) => r.aircraft_id));

  return (
    <WorkPage
      eyebrow="Flight operations"
      title="Maintenance"
      lede="Every open work item against the fleet, who is turning the wrench, and which airframes cannot fly until it clears."
      actions={<NewButton label="Log work item" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow cols={4}>
        <Stat label="Open work items" value={rows.filter((r: any) => r.status !== "closed").length} icon={Wrench} />
        <Stat label="Grounding" value={grounded.length} tone={grounded.length ? "risk" : "good"} icon={TriangleAlert} />
        <Stat label="Airframes affected" value={groundedTails.size} hint={`${aircraft.rows.length} in fleet`} icon={PlaneTakeoff} />
        <Stat label="Closed this list" value={rows.filter((r: any) => r.status === "closed").length} tone="good" />
      </StatRow>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1fr_320px]">
        <div>
          <Toolbar q={q} setQ={setQ} placeholder="Search work items, tail numbers…">
            <Select
              value={status} onChange={setStatus}
              options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s.replace("_", " ") }))]}
            />
          </Toolbar>
          <Card className="mt-3" pad={false}>
            {loading ? <Loading /> : filtered.length === 0 ? <Empty>Nothing in this queue.</Empty> : (
              <ul className="divide-y divide-border">
                {filtered.map((r: any) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">{tailOf.get(r.aircraft_id) ?? "—"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{r.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {r.kind ?? "unscheduled"} · opened {d(r.opened_on)} ·{" "}
                        {r.assignee_id ? <UserMention userId={r.assignee_id} name={nameOf(byId, r.assignee_id)} size="xs" /> : "Unassigned"}
                      </span>
                    </span>
                    {r.grounding && r.status !== "closed" && <Pill tone="risk">grounding</Pill>}
                    <Pill tone={statusTone(r.severity)}>{r.severity ?? "low"}</Pill>
                    <select
                      value={r.status ?? "open"}
                      onChange={(e) => patch(r.id, { status: e.target.value, closed_on: e.target.value === "closed" ? new Date().toISOString().slice(0, 10) : null })}
                      className="rounded border border-border bg-background px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Fleet status" hint="Live airworthiness by tail" pad={false}>
          <ul className="divide-y divide-border">
            {aircraft.rows.length === 0 && <Empty>No aircraft registered.</Empty>}
            {aircraft.rows.map((a: any) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="font-mono text-xs">{a.tail_number}</span>
                <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{a.model ?? "—"}</span>
                <Pill tone={groundedTails.has(a.id) ? "risk" : statusTone(a.status)}>
                  {groundedTails.has(a.id) ? "grounded" : a.status ?? "unknown"}
                </Pill>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-3">
            <Btn onClick={() => setStatus("waiting_parts")} className="w-full justify-center">Show parts holds</Btn>
          </div>
        </Card>
      </section>

      {open && (
        <RecordDialog
          title="Log maintenance work" fields={fields} people={people}
          initial={{ status: "open", severity: "medium", kind: "unscheduled", opened_on: new Date().toISOString().slice(0, 10) }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/ops/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Maintenance,
});
