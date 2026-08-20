import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, pct, dt,
  RecordDialog, NewButton, useRows, usePeople, nameOf, raiseRequest, Btn, type Field,
} from "@/components/hq/work/kit";

function Quality() {
  const { rows, loading, insert } = useRows<any>("mfg_inspections", { order: { column: "inspected_at" } });
  const wos = useRows<any>("mfg_work_orders", { order: { column: "order_number", ascending: true } });
  const { people, byId } = usePeople();
  const [open, setOpen] = useState(false);

  const fields: Field[] = useMemo(() => [
    { key: "work_order_id", label: "Work order", type: "select", required: true, options: wos.rows.map((w) => ({ value: w.id, label: `${w.order_number} — ${w.product_name}` })) },
    { key: "status", label: "Result", type: "select", options: ["pass", "rework", "failed"].map((v) => ({ value: v, label: v })) },
    { key: "defect_count", label: "Defects found", type: "number" },
    { key: "inspector_id", label: "Inspector", type: "user" },
    { key: "inspected_at", label: "Inspected", type: "datetime" },
    { key: "notes", label: "Findings", type: "textarea", full: true },
  ], [wos.rows]);

  const passed = rows.filter((r) => r.status === "pass").length;
  const defects = rows.reduce((s, r) => s + Number(r.defect_count || 0), 0);
  const woLabel = (id: string) => wos.rows.find((w) => w.id === id)?.order_number ?? "—";

  return (
    <WorkPage
      eyebrow="Manufacturing"
      title="Quality"
      lede="First-pass yield, defect trends, and the findings behind every rework call."
      actions={<NewButton label="Log inspection" onClick={() => setOpen(true)} />}
    >
      <StatRow>
        <Stat label="Inspections" value={rows.length} icon={ClipboardCheck} />
        <Stat label="First-pass yield" value={`${pct(passed, rows.length)}%`} tone={pct(passed, rows.length) >= 90 ? "good" : "warn"} />
        <Stat label="Defects logged" value={defects} tone={defects ? "warn" : "good"} />
        <Stat label="Rework open" value={rows.filter((r) => r.status === "rework").length} tone="warn" />
      </StatRow>

      <Card
        className="mt-5" pad={false} title="Inspection log" hint="Newest first"
        action={<Btn onClick={async () => {
          const subject = prompt("Describe the defect for Engineering:");
          if (subject && await raiseRequest({ from_team: "Manufacturing", to_team: "Engineering", subject, priority: "high", entity_type: "quality" })) {
            alert("Raised with Engineering.");
          }
        }}>Raise defect</Btn>}
      >
        {loading ? <Loading /> : rows.length === 0 ? <Empty>No inspections recorded yet.</Empty> : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-4 py-3">
                <Pill tone={statusTone(r.status)}>{r.status || "logged"}</Pill>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{woLabel(r.work_order_id)}</p>
                  <p className="text-xs text-muted-foreground">{r.notes || "No findings recorded."}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{nameOf(byId, r.inspector_id)} · {dt(r.inspected_at ?? r.created_at)}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{r.defect_count ?? 0} defects</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <RecordDialog
          title="Log inspection" fields={fields} people={people} initial={{ status: "pass", defect_count: 0 }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/mfg/quality")({
  head: () => ({ meta: [{ title: "Quality — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Quality,
});
