import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GitPullRequestArrow, CheckCircle2, Clock, Factory } from "lucide-react";
import {
  useRows, usePeople, useMe, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, statusTone, titleCase, dt, nameOf, raiseRequest, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/eng/changes")({
  head: () => ({ meta: [{ title: "Change Control — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: ChangesPage,
});

const STAGES = ["draft", "in_review", "approved", "implemented", "rejected"];

function ChangesPage() {
  const { rows, loading, insert, patch } = useRows("eng_ecos", { order: { column: "created_at" } });
  const reviews = useRows("eng_design_reviews", { order: { column: "created_at" } });
  const projects = useRows("eng_projects", { order: { column: "name", ascending: true } });
  const { people, byId } = usePeople();
  const me = useMe();
  const [creating, setCreating] = useState(false);

  const fields: Field[] = [
    { key: "title", label: "Change title", type: "text", required: true, full: true },
    { key: "project_id", label: "Program", type: "select", options: projects.rows.map((p: any) => ({ value: p.id, label: p.name })) },
    { key: "reason", label: "Reason for change", type: "textarea", full: true },
    { key: "impact", label: "Impact (cost, weight, schedule)", type: "textarea", full: true },
    { key: "requested_by", label: "Requested by", type: "user" },
  ];

  const byStage = (s: string) => (rows as any[]).filter((r) => (r.status ?? "draft") === s);

  const approveAndBuild = async (r: any) => {
    await patch(r.id, { status: "approved", approved_by: me, approved_at: new Date().toISOString() });
    await raiseRequest({
      from_team: "eng", to_team: "mfg", subject: `Implement change — ${r.title}`,
      details: r.impact || "Approved engineering change ready for production implementation.",
      entity_type: "eng_ecos", entity_id: r.id, priority: "high",
    });
    alert("Approved and routed to Manufacturing.");
  };

  return (
    <WorkPage
      wide eyebrow="Engineering · Configuration"
      title="Change control"
      lede="Nothing on a flying aircraft changes silently. Every engineering change is reviewed, approved by a named engineer, and handed to production."
      actions={<NewButton label="Raise change" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="In review" value={byStage("in_review").length} icon={Clock} tone={byStage("in_review").length ? "warn" : "good"} />
        <Stat label="Approved" value={byStage("approved").length} icon={CheckCircle2} tone="good" />
        <Stat label="Implemented" value={byStage("implemented").length} icon={Factory} />
        <Stat label="Design reviews" value={reviews.rows.length} icon={GitPullRequestArrow} />
      </StatRow>

      {loading ? <Loading /> : (
        <div className="mt-5 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Card title="Change orders" pad={false}>
            <div className="divide-y divide-border">
              {rows.length === 0 && <Empty>No changes raised.</Empty>}
              {(rows as any[]).map((r) => (
                <div key={r.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Raised {dt(r.created_at)} by {nameOf(byId, r.requested_by)}
                        {r.approved_by ? ` · approved by ${nameOf(byId, r.approved_by)}` : ""}
                      </p>
                      {r.reason && <p className="mt-1.5 text-xs text-muted-foreground">{r.reason}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={r.status ?? "draft"} onChange={(e) => patch(r.id, { status: e.target.value })}
                        className="rounded border border-border bg-background px-2 py-1 text-xs capitalize">
                        {STAGES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                      </select>
                      {r.status !== "approved" && r.status !== "implemented" && (
                        <Btn variant="primary" onClick={() => approveAndBuild(r)}>Approve</Btn>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Design reviews" hint="Gate events" pad={false}>
            <div className="divide-y divide-border">
              {reviews.rows.length === 0 && <Empty>No reviews scheduled.</Empty>}
              {(reviews.rows as any[]).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{r.title}</p>
                    <p className="text-[11px] text-muted-foreground">{dt(r.scheduled_date ?? r.review_date)}</p>
                  </div>
                  <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {creating && (
        <RecordDialog title="Raise an engineering change" fields={fields} people={people} initial={{ requested_by: me }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, status: "draft" }); setCreating(false); }} />
      )}
    </WorkPage>
  );
}
