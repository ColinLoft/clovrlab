import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Factory, AlertTriangle } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Toolbar, Select, Kanban, Loading, Pill, statusTone,
  RecordDialog, NewButton, useRows, usePeople, nameOf, d, raiseRequest, Btn, type Field,
} from "@/components/hq/work/kit";

const COLUMNS = [
  { key: "queued", label: "Queued" },
  { key: "building", label: "On the line" },
  { key: "in_review", label: "Inspection" },
  { key: "complete", label: "Complete" },
];

const fields = (people: any[]): Field[] => [
  { key: "order_number", label: "Work order", type: "text", required: true, placeholder: "WO-0142" },
  { key: "product_name", label: "Assembly", type: "text", required: true },
  { key: "quantity", label: "Units", type: "number" },
  { key: "priority", label: "Priority", type: "select", options: ["low", "normal", "high", "critical"].map((v) => ({ value: v, label: v })) },
  { key: "status", label: "Stage", type: "select", options: COLUMNS.map((c) => ({ value: c.key, label: c.label })) },
  { key: "assignee_id", label: "Build lead", type: "user" },
  { key: "due_date", label: "Need by", type: "date" },
  { key: "notes", label: "Build notes", type: "textarea", full: true },
  ...(people.length ? [] : []),
];

function BuildLine() {
  const { rows, loading, insert, patch } = useRows<any>("mfg_work_orders", { order: { column: "due_date", ascending: true } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => rows.filter((r) => {
    const hit = `${r.order_number} ${r.product_name}`.toLowerCase().includes(q.toLowerCase());
    return hit && (priority === "all" || r.priority === priority);
  }), [rows, q, priority]);

  const late = rows.filter((r) => r.due_date && r.due_date < new Date().toISOString().slice(0, 10) && r.status !== "complete");
  const units = rows.filter((r) => r.status !== "complete").reduce((s, r) => s + Number(r.quantity || 0), 0);

  return (
    <WorkPage
      eyebrow="Manufacturing"
      title="Build line"
      lede="Every airframe and sensor pod in production, stage by stage. Move a card as the work moves down the line."
      actions={<NewButton label="New work order" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow>
        <Stat label="Open orders" value={rows.filter((r) => r.status !== "complete").length} icon={Factory} />
        <Stat label="Units in build" value={units} hint="Across all open orders" />
        <Stat label="Past need-by" value={late.length} tone={late.length ? "risk" : "good"} icon={AlertTriangle} />
        <Stat label="Completed" value={rows.filter((r) => r.status === "complete").length} tone="good" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search order or assembly…">
        <Select
          value={priority} onChange={setPriority}
          options={[{ value: "all", label: "All priorities" }, ...["critical", "high", "normal", "low"].map((v) => ({ value: v, label: v }))]}
        />
        <Btn onClick={async () => {
          const subject = prompt("What do you need from Engineering?");
          if (subject && await raiseRequest({ from_team: "Manufacturing", to_team: "Engineering", subject, priority: "high" })) {
            alert("Sent to Engineering.");
          }
        }}>Escalate to Engineering</Btn>
      </Toolbar>

      {loading ? <Loading /> : (
        <Kanban
          columns={COLUMNS}
          rows={filtered}
          statusKey="status"
          onMove={(r, status) => patch(r.id, { status })}
          render={(r: any) => (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{r.order_number}</span>
                <Pill tone={statusTone(r.priority)}>{r.priority || "normal"}</Pill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.product_name} · {r.quantity ?? 1} units</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{nameOf(byId, r.assignee_id)} · due {d(r.due_date)}</p>
            </>
          )}
        />
      )}

      {open && (
        <RecordDialog
          title="New work order" fields={fields(people)} people={people}
          initial={{ status: "queued", priority: "normal", quantity: 1 }}
          onCancel={() => setOpen(false)}
          onSave={async (v) => { await insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/mfg/line")({
  head: () => ({ meta: [{ title: "Build line — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: BuildLine,
});
