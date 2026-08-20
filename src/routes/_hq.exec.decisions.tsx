import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Toolbar, Card, Loading, Empty, Pill, statusTone, d,
  RecordDialog, NewButton, useRows, type Field,
} from "@/components/hq/work/kit";

const TEAMS = ["Leadership", "Operations", "Engineering", "Product", "Manufacturing", "Enterprise Systems", "Funding & Partners", "People & Admin"];

const fields: Field[] = [
  { key: "title", label: "Decision", type: "text", required: true },
  { key: "owner_team", label: "Owning team", type: "select", options: TEAMS.map((t) => ({ value: t, label: t })) },
  { key: "status", label: "Status", type: "select", options: ["proposed", "approved", "rejected", "superseded"].map((v) => ({ value: v, label: v })) },
  { key: "decided_on", label: "Decided", type: "date" },
  { key: "review_on", label: "Revisit on", type: "date" },
  { key: "context", label: "Context — what forced the call", type: "textarea", full: true },
  { key: "decision", label: "What we decided", type: "textarea", full: true },
];

function Decisions() {
  const { rows, loading, insert } = useRows<any>("exec_decisions", { order: { column: "decided_on" } });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => rows.filter((r) =>
    `${r.title} ${r.owner_team ?? ""} ${r.decision ?? ""}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const dueReview = rows.filter((r) => r.review_on && r.review_on <= new Date().toISOString().slice(0, 10));

  return (
    <WorkPage
      eyebrow="Leadership"
      title="Decision log"
      lede="The calls that shaped the program, why they were made, and when to revisit them."
      actions={<NewButton label="Record decision" onClick={() => setOpen(true)} />}
    >
      <StatRow>
        <Stat label="Decisions logged" value={rows.length} icon={ScrollText} />
        <Stat label="Approved" value={rows.filter((r) => r.status === "approved").length} tone="good" />
        <Stat label="Awaiting a call" value={rows.filter((r) => r.status === "proposed").length} tone="warn" />
        <Stat label="Due for review" value={dueReview.length} tone={dueReview.length ? "warn" : "good"} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search decisions…" />

      <div className="mt-4 space-y-3">
        {loading ? <Loading /> : filtered.length === 0 ? <Empty>Nothing logged yet.</Empty> : filtered.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{r.title}</h3>
              <div className="flex items-center gap-2">
                <Pill tone={statusTone(r.status)}>{r.status || "proposed"}</Pill>
                <span className="text-xs text-muted-foreground">{r.owner_team || "Leadership"} · {d(r.decided_on)}</span>
              </div>
            </div>
            {r.context && <p className="mt-2 text-sm text-muted-foreground">{r.context}</p>}
            {r.decision && <p className="mt-2 border-l-2 border-primary pl-3 text-sm">{r.decision}</p>}
            {r.review_on && <p className="mt-2 text-xs text-muted-foreground">Revisit {d(r.review_on)}</p>}
          </Card>
        ))}
      </div>

      {open && (
        <RecordDialog title="Record decision" fields={fields} initial={{ status: "approved", decided_on: new Date().toISOString().slice(0, 10) }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/exec/decisions")({
  head: () => ({ meta: [{ title: "Decision log — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Decisions,
});
