import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileSignature } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Kanban, Loading, Pill, statusTone, money, d,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";

const COLUMNS = [
  { key: "researching", label: "Researching" },
  { key: "drafting", label: "Drafting" },
  { key: "submitted", label: "Submitted" },
  { key: "awarded", label: "Awarded" },
  { key: "declined", label: "Declined" },
];

const fields: Field[] = [
  { key: "title", label: "Grant", type: "text", required: true },
  { key: "funder", label: "Funder", type: "text", required: true },
  { key: "amount", label: "Amount requested", type: "number" },
  { key: "stage", label: "Stage", type: "select", options: COLUMNS.map((c) => ({ value: c.key, label: c.label })) },
  { key: "program", label: "Program", type: "text", placeholder: "Fleet expansion, sensor R&D…" },
  { key: "owner_id", label: "Owner", type: "user" },
  { key: "submitted_on", label: "Submitted", type: "date" },
  { key: "decision_on", label: "Decision expected", type: "date" },
  { key: "notes", label: "Notes", type: "textarea", full: true },
];

function Grants() {
  const { rows, loading, insert, patch } = useRows<any>("fund_grants", { order: { column: "decision_on", ascending: true } });
  const { people, byId } = usePeople();
  const [open, setOpen] = useState(false);

  const pipeline = rows.filter((r) => !["awarded", "declined"].includes(r.stage)).reduce((s, r) => s + Number(r.amount || 0), 0);
  const won = rows.filter((r) => r.stage === "awarded").reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <WorkPage
      eyebrow="Funding & partners"
      title="Grant pipeline"
      lede="Every application from first read of the RFP through the award letter."
      actions={<NewButton label="Track grant" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow>
        <Stat label="Live applications" value={rows.filter((r) => !["awarded", "declined"].includes(r.stage)).length} icon={FileSignature} />
        <Stat label="In pipeline" value={money(pipeline)} />
        <Stat label="Awarded" value={money(won)} tone="good" />
        <Stat label="Declined" value={rows.filter((r) => r.stage === "declined").length} tone="muted" as any />
      </StatRow>

      {loading ? <Loading /> : (
        <Kanban
          columns={COLUMNS} rows={rows} statusKey="stage"
          onMove={(r, stage) => patch(r.id, { stage })}
          render={(r: any) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{r.title}</span>
                <Pill tone={statusTone(r.stage)}>{money(Number(r.amount || 0))}</Pill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.funder}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{nameOf(byId, r.owner_id)} · decision {d(r.decision_on)}</p>
            </>
          )}
        />
      )}

      {open && (
        <RecordDialog title="Track grant" fields={fields} people={people} initial={{ stage: "researching" }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/fund/grants")({
  head: () => ({ meta: [{ title: "Grant pipeline — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Grants,
});
