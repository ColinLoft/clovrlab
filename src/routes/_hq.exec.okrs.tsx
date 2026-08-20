import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Target } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, Bar, pct,
  RecordDialog, NewButton, useRows, Btn, type Field,
} from "@/components/hq/work/kit";

const TEAMS = ["Leadership", "Operations", "Engineering", "Product", "Manufacturing", "Enterprise Systems", "Funding & Partners", "People & Admin"];

const objectiveFields: Field[] = [
  { key: "title", label: "Objective", type: "text", required: true },
  { key: "quarter", label: "Quarter", type: "text", placeholder: "Q1 2026" },
  { key: "owner_team", label: "Owning team", type: "select", options: TEAMS.map((t) => ({ value: t, label: t })) },
  { key: "status", label: "Status", type: "select", options: ["planned", "on_track", "at_risk", "complete"].map((v) => ({ value: v, label: v })) },
  { key: "progress", label: "Progress %", type: "number" },
  { key: "narrative", label: "Why this matters", type: "textarea", full: true },
];

function Okrs() {
  const objectives = useRows<any>("exec_objectives", { order: { column: "created_at" } });
  const krs = useRows<any>("exec_key_results", { order: { column: "created_at", ascending: true } });
  const [open, setOpen] = useState<null | "objective" | string>(null);

  const krFields: Field[] = useMemo(() => [
    { key: "title", label: "Key result", type: "text", required: true },
    { key: "metric", label: "Metric", type: "text", placeholder: "Detections confirmed per week" },
    { key: "current_value", label: "Current", type: "number" },
    { key: "target_value", label: "Target", type: "number" },
    { key: "status", label: "Status", type: "select", options: ["on_track", "at_risk", "off_track", "complete"].map((v) => ({ value: v, label: v })) },
  ], []);

  const avg = objectives.rows.length
    ? Math.round(objectives.rows.reduce((s, o) => s + Number(o.progress || 0), 0) / objectives.rows.length) : 0;

  return (
    <WorkPage
      eyebrow="Leadership"
      title="Objectives"
      lede="What the organization committed to this quarter, and the measures that prove it."
      actions={<NewButton label="New objective" onClick={() => setOpen("objective")} />}
    >
      <StatRow>
        <Stat label="Objectives" value={objectives.rows.length} icon={Target} />
        <Stat label="Average progress" value={`${avg}%`} tone={avg >= 60 ? "good" : "warn"} />
        <Stat label="At risk" value={objectives.rows.filter((o) => o.status === "at_risk").length} tone="risk" />
        <Stat label="Key results" value={krs.rows.length} />
      </StatRow>

      <div className="mt-5 space-y-4">
        {objectives.loading ? <Loading /> : objectives.rows.length === 0 ? <Empty>No objectives yet.</Empty> : objectives.rows.map((o) => {
          const mine = krs.rows.filter((k) => k.objective_id === o.id);
          return (
            <Card
              key={o.id}
              title={o.title}
              hint={`${o.owner_team || "Unowned"} · ${o.quarter || "no quarter set"}`}
              action={<div className="flex items-center gap-2">
                <Pill tone={statusTone(o.status)}>{o.status || "planned"}</Pill>
                <Btn onClick={() => setOpen(o.id)}>Add key result</Btn>
              </div>}
            >
              {o.narrative && <p className="mb-3 text-sm text-muted-foreground">{o.narrative}</p>}
              <div className="flex items-center gap-3">
                <Bar value={Number(o.progress || 0)} tone={o.status === "at_risk" ? "risk" : "primary"} />
                <input
                  type="number" defaultValue={o.progress ?? 0}
                  onBlur={(e) => objectives.patch(o.id, { progress: Number(e.target.value) })}
                  className="w-16 rounded border border-border bg-background px-2 py-1 text-right text-xs"
                />
              </div>
              <ul className="mt-3 divide-y divide-border border-t border-border">
                {mine.length === 0 && <li className="py-3 text-xs text-muted-foreground">No key results yet.</li>}
                {mine.map((k) => (
                  <li key={k.id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{k.title}</p>
                      <p className="text-xs text-muted-foreground">{k.metric || "—"}</p>
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {k.current_value ?? 0} / {k.target_value ?? 0} ({pct(Number(k.current_value || 0), Number(k.target_value || 1))}%)
                    </span>
                    <Pill tone={statusTone(k.status)}>{k.status || "on_track"}</Pill>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {open === "objective" && (
        <RecordDialog title="New objective" fields={objectiveFields} initial={{ status: "planned", progress: 0 }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await objectives.insert(v); setOpen(null); }} />
      )}
      {open && open !== "objective" && (
        <RecordDialog title="New key result" fields={krFields} initial={{ status: "on_track", current_value: 0 }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await krs.insert({ ...v, objective_id: open }); setOpen(null); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/exec/okrs")({
  head: () => ({ meta: [{ title: "Objectives — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Okrs,
});
