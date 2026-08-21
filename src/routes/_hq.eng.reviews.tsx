import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ClipboardCheck, CalendarClock } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Card, Pill, Empty, Loading, NewButton, RecordDialog,
  statusTone, titleCase, d, nameOf, Stat, StatRow, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/eng/reviews")({
  head: () => ({ meta: [{ title: "Design Reviews — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: ReviewsPage,
});

/** Hardware gates run in order — the board is the gate ladder, not a generic list. */
const GATES = [
  { key: "concept", label: "Concept", blurb: "Is the idea worth building?" },
  { key: "preliminary", label: "Preliminary", blurb: "Architecture and interfaces agreed." },
  { key: "critical", label: "Critical", blurb: "Design frozen, drawings released." },
  { key: "test_readiness", label: "Test readiness", blurb: "Safe to fly the article." },
  { key: "flight_readiness", label: "Flight readiness", blurb: "Cleared for mission use." },
];

const fields = (projects: any[], gates: string[]): Field[] => [
  { key: "title", label: "Review", type: "text", required: true, full: true, placeholder: "Airframe CDR — rev C" },
  { key: "project_id", label: "Program", type: "select", options: projects.map((p) => ({ value: p.id, label: p.name })) },
  { key: "gate", label: "Gate", type: "select", options: gates.map((g) => ({ value: g, label: titleCase(g) })) },
  { key: "status", label: "Status", type: "select", options: ["scheduled", "in_review", "approved", "rejected"].map((v) => ({ value: v, label: titleCase(v) })) },
  { key: "review_date", label: "Review date", type: "date" },
  { key: "reviewer_id", label: "Chair", type: "user" },
  { key: "notes", label: "Actions & findings", type: "textarea", full: true },
];

function ReviewsPage() {
  const { rows, loading, insert, patch } = useRows<any>("eng_design_reviews", { order: { column: "review_date", ascending: true } });
  const { rows: projects } = useRows<any>("eng_projects", { select: "id, name", order: { column: "name", ascending: true } });
  const { people, byId } = usePeople();
  const [creating, setCreating] = useState(false);

  const byGate = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const g of GATES) m.set(g.key, []);
    for (const r of rows) {
      const key = GATES.some((g) => g.key === r.gate) ? r.gate : "concept";
      m.set(key, [...(m.get(key) ?? []), r]);
    }
    return m;
  }, [rows]);

  const approved = rows.filter((r) => r.status === "approved").length;
  const blocked = rows.filter((r) => r.status === "rejected").length;
  const upcoming = rows.filter((r) => r.review_date && new Date(r.review_date) >= new Date(Date.now() - 864e5)).length;

  return (
    <WorkPage
      wide
      eyebrow="Engineering"
      title="Design gate ladder"
      lede="Every airframe and avionics change climbs the same five gates. A gate only opens when a chair signs it off — nothing skips ahead."
      actions={<NewButton label="Schedule review" onClick={() => setCreating(true)} />}
    >
      <StatRow cols={4}>
        <Stat label="Reviews on the ladder" value={rows.length} icon={ClipboardCheck} />
        <Stat label="Signed off" value={approved} tone="good" />
        <Stat label="Sent back" value={blocked} tone={blocked ? "risk" : "default"} />
        <Stat label="Upcoming" value={upcoming} icon={CalendarClock} tone="warn" />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-5 space-y-3">
          {GATES.map((g, i) => {
            const items = byGate.get(g.key) ?? [];
            return (
              <Card key={g.key} pad={false} className="overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{g.label}</p>
                      <p className="text-[11px] text-muted-foreground">{g.blurb}</p>
                    </div>
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{items.length} review{items.length === 1 ? "" : "s"}</span>
                </div>
                {items.length === 0 ? (
                  <p className="px-4 py-4 text-xs text-muted-foreground">Nothing at this gate.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {items.map((r) => (
                      <div key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                        <div className="min-w-[200px] flex-1">
                          <p className="text-sm font-medium">{r.title}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Chair {nameOf(byId, r.reviewer_id)} · {d(r.review_date)}
                          </p>
                          {r.notes && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.notes}</p>}
                        </div>
                        <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                        <select
                          value={r.status ?? "scheduled"}
                          onChange={(e) => patch(r.id, { status: e.target.value })}
                          className="rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                        >
                          {["scheduled", "in_review", "approved", "rejected"].map((s) => (
                            <option key={s} value={s}>{titleCase(s)}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
          {rows.length === 0 && <Empty>No reviews scheduled yet.</Empty>}
        </div>
      )}

      {creating && (
        <RecordDialog
          title="Schedule design review"
          fields={fields(projects, GATES.map((g) => g.key))}
          initial={{ gate: "concept", status: "scheduled" }}
          people={people}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert(v); setCreating(false); }}
        />
      )}
    </WorkPage>
  );
}
