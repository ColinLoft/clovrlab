import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cpu, Flag, CheckSquare, AlertTriangle } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, statusTone, titleCase, Bar, d, nameOf, raiseRequest, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/eng/programs")({
  head: () => ({ meta: [{ title: "Engineering Programs — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const projects = useRows("eng_projects", { order: { column: "created_at" } });
  const milestones = useRows("eng_milestones", { order: { column: "due_date", ascending: true } });
  const tasks = useRows("eng_tasks", { order: { column: "due_date", ascending: true } });
  const issues = useRows("eng_issues", { order: { column: "created_at" } });
  const { people, byId } = usePeople();
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newMilestone, setNewMilestone] = useState(false);

  const current: any = projects.rows.find((p: any) => p.id === selected) ?? projects.rows[0] ?? null;

  const projFields: Field[] = [
    { key: "name", label: "Program name", type: "text", required: true },
    { key: "code", label: "Code", type: "text", placeholder: "ATH-2" },
    { key: "status", label: "Status", type: "select", options: ["planning", "active", "at_risk", "paused", "complete"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "lead_id", label: "Program lead", type: "user" },
    { key: "target_date", label: "Target date", type: "date" },
    { key: "progress", label: "Progress (%)", type: "number" },
    { key: "description", label: "Scope", type: "textarea", full: true },
  ];

  const msFields: Field[] = [
    { key: "title", label: "Milestone", type: "text", required: true },
    { key: "due_date", label: "Due", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["planned", "in_progress", "at_risk", "complete"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "description", label: "Exit criteria", type: "textarea", full: true },
  ];

  const active = projects.rows.filter((p: any) => p.status !== "complete");
  const atRisk = projects.rows.filter((p: any) => p.status === "at_risk").length;
  const openIssues = issues.rows.filter((i: any) => i.status !== "closed").length;

  const projMilestones = milestones.rows.filter((m: any) => m.project_id === current?.id);
  const projTasks = tasks.rows.filter((t: any) => t.project_id === current?.id && t.status !== "done");
  const projIssues = issues.rows.filter((i: any) => i.project_id === current?.id && i.status !== "closed");

  const handoffToMfg = async () => {
    if (!current) return;
    const ok = await raiseRequest({
      from_team: "eng", to_team: "mfg", subject: `Build release — ${current.name}`,
      details: "Design package is ready for production. Please confirm tooling and stock.",
      entity_type: "eng_projects", entity_id: current.id, priority: "high",
    });
    if (ok) alert("Handed off to Manufacturing.");
  };

  return (
    <WorkPage
      wide eyebrow="Engineering · Programs"
      title="Program board"
      lede="Aircraft, autonomy and sensor programs with milestone burn-down, live task load and the open issues blocking each gate."
      actions={<NewButton label="New program" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="Active programs" value={active.length} icon={Cpu} />
        <Stat label="At risk" value={atRisk} icon={AlertTriangle} tone={atRisk ? "risk" : "good"} />
        <Stat label="Open milestones" value={milestones.rows.filter((m: any) => m.status !== "complete").length} icon={Flag} />
        <Stat label="Open issues" value={openIssues} icon={CheckSquare} tone={openIssues > 10 ? "warn" : "default"} />
      </StatRow>

      {projects.loading ? <Loading /> : (
        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(280px,360px)_1fr]">
          <Card pad={false} title="Programs">
            <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {projects.rows.length === 0 && <Empty>No programs yet.</Empty>}
              {projects.rows.map((p: any) => (
                <button key={p.id} onClick={() => setSelected(p.id)}
                  className={`w-full px-4 py-3 text-left transition hover:bg-accent ${current?.id === p.id ? "bg-accent" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{p.name}</span>
                    <Pill tone={statusTone(p.status)}>{titleCase(p.status)}</Pill>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{p.code || "—"} · target {d(p.target_date)}</p>
                  <div className="mt-2"><Bar value={Number(p.progress ?? 0)} /></div>
                </button>
              ))}
            </div>
          </Card>

          {current ? (
            <div className="space-y-4">
              <Card title={current.name} hint={`${titleCase(current.status)} · lead ${nameOf(byId, current.lead_id)} · target ${d(current.target_date)}`}
                action={<div className="flex gap-2">
                  <Btn onClick={() => setNewMilestone(true)}>Add milestone</Btn>
                  <Btn variant="primary" onClick={handoffToMfg}>Release to manufacturing</Btn>
                </div>}>
                {current.description && <p className="text-sm text-muted-foreground">{current.description}</p>}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Program progress</span><span>{Number(current.progress ?? 0)}%</span></div>
                  <div className="mt-1"><Bar value={Number(current.progress ?? 0)} /></div>
                </div>
              </Card>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card title="Milestones" pad={false}>
                  <div className="divide-y divide-border">
                    {projMilestones.length === 0 && <Empty>No milestones.</Empty>}
                    {projMilestones.map((m: any) => (
                      <div key={m.id} className="px-4 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm">{m.title}</span>
                          <select value={m.status ?? "planned"} onChange={(e) => milestones.patch(m.id, { status: e.target.value })}
                            className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] capitalize">
                            {["planned", "in_progress", "at_risk", "complete"].map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                          </select>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Due {d(m.due_date)}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Task load" pad={false}>
                  <div className="divide-y divide-border">
                    {projTasks.length === 0 && <Empty>No open tasks.</Empty>}
                    {projTasks.slice(0, 10).map((t: any) => (
                      <div key={t.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm">{t.title}</p>
                          <p className="text-[11px] text-muted-foreground">{nameOf(byId, t.assignee_id)} · due {d(t.due_date)}</p>
                        </div>
                        <Pill tone={statusTone(t.status)}>{titleCase(t.status)}</Pill>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Blocking issues" pad={false}>
                  <div className="divide-y divide-border">
                    {projIssues.length === 0 && <Empty>Nothing blocking.</Empty>}
                    {projIssues.slice(0, 10).map((i: any) => (
                      <div key={i.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                        <span className="truncate text-sm">{i.title}</span>
                        <Pill tone={String(i.severity).toLowerCase() === "critical" ? "risk" : "warn"}>{titleCase(i.severity)}</Pill>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ) : <Card><Empty>Create a program to get started.</Empty></Card>}
        </div>
      )}

      {creating && (
        <RecordDialog title="New program" fields={projFields} people={people} initial={{ status: "planning", progress: 0 }}
          onCancel={() => setCreating(false)} onSave={async (v) => { await projects.insert(v); setCreating(false); }} />
      )}
      {newMilestone && current && (
        <RecordDialog title={`Milestone — ${current.name}`} fields={msFields} people={people} initial={{ status: "planned" }}
          onCancel={() => setNewMilestone(false)}
          onSave={async (v) => { await milestones.insert({ ...v, project_id: current.id }); setNewMilestone(false); }} />
      )}
    </WorkPage>
  );
}
