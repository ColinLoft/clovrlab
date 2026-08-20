import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bug, Flame, Timer, Send } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Kanban, NewButton,
  RecordDialog, statusTone, titleCase, Toolbar, Select, nameOf, raiseRequest, dt, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/eng/issues")({
  head: () => ({ meta: [{ title: "Issue Triage — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: IssuesPage,
});

const COLUMNS = [
  { key: "open", label: "Reported" },
  { key: "triaged", label: "Triaged" },
  { key: "in_progress", label: "In progress" },
  { key: "verifying", label: "Verifying" },
  { key: "closed", label: "Closed" },
];

function IssuesPage() {
  const { rows, loading, insert, patch } = useRows("eng_issues", { order: { column: "created_at" } });
  const projects = useRows("eng_projects", { order: { column: "name", ascending: true } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [sev, setSev] = useState("all");
  const [creating, setCreating] = useState(false);

  const fields: Field[] = [
    { key: "title", label: "Summary", type: "text", required: true, full: true },
    { key: "severity", label: "Severity", type: "select", options: ["low", "medium", "high", "critical"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "project_id", label: "Program", type: "select", options: projects.rows.map((p: any) => ({ value: p.id, label: p.name })) },
    { key: "assignee_id", label: "Owner", type: "user" },
    { key: "description", label: "What happened", type: "textarea", full: true },
  ];

  const filtered = useMemo(() => (rows as any[]).filter((r) =>
    (!q || `${r.title} ${r.description ?? ""}`.toLowerCase().includes(q.toLowerCase())) &&
    (sev === "all" || String(r.severity).toLowerCase() === sev)
  ), [rows, q, sev]);

  const open = (rows as any[]).filter((r) => r.status !== "closed");
  const critical = open.filter((r) => String(r.severity).toLowerCase() === "critical").length;

  const escalate = async (r: any) => {
    const ok = await raiseRequest({
      from_team: "eng", to_team: "ops", subject: `Field action required — ${r.title}`,
      details: "Engineering needs an operational hold or field check on this issue.",
      entity_type: "eng_issues", entity_id: r.id, priority: "urgent",
    });
    if (ok) alert("Mission Operations notified.");
  };

  return (
    <WorkPage
      wide eyebrow="Engineering · Reliability"
      title="Issue triage"
      lede="Everything the fleet, the test bench and the field report — sorted by severity, owned by a named engineer, closed with verification."
      actions={<NewButton label="Report issue" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="Open issues" value={open.length} icon={Bug} tone={open.length > 15 ? "warn" : "default"} />
        <Stat label="Critical" value={critical} icon={Flame} tone={critical ? "risk" : "good"} />
        <Stat label="Unassigned" value={open.filter((r) => !r.assignee_id).length} icon={Timer} tone={open.some((r) => !r.assignee_id) ? "warn" : "good"} />
        <Stat label="Closed lifetime" value={(rows as any[]).filter((r) => r.status === "closed").length} icon={Send} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search issues…">
        <Select value={sev} onChange={setSev} options={[{ value: "all", label: "All severities" }, ...["critical", "high", "medium", "low"].map((v) => ({ value: v, label: titleCase(v) }))]} />
      </Toolbar>

      {loading ? <Loading /> : filtered.length === 0 ? (
        <Card className="mt-4"><Empty>No issues match.</Empty></Card>
      ) : (
        <div className="overflow-x-auto pb-2">
          <Kanban
            columns={COLUMNS} rows={filtered} statusKey="status"
            onMove={(r: any, status) => patch(r.id, { status })}
            render={(r: any) => (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-tight">{r.title}</span>
                  <Pill tone={String(r.severity).toLowerCase() === "critical" ? "risk" : String(r.severity).toLowerCase() === "high" ? "warn" : "muted"}>
                    {titleCase(r.severity)}
                  </Pill>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{nameOf(byId, r.assignee_id)} · {dt(r.created_at)}</p>
                <span onClick={(e) => { e.stopPropagation(); escalate(r); }}
                  className="mt-1 inline-block cursor-pointer text-[11px] text-primary hover:underline">Notify ops</span>
              </>
            )}
          />
        </div>
      )}

      {creating && (
        <RecordDialog title="Report an issue" fields={fields} people={people} initial={{ severity: "medium" }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, status: "open" }); setCreating(false); }} />
      )}
    </WorkPage>
  );
}
