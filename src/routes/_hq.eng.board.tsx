import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ListChecks, CalendarClock, Flame } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Toolbar, Select, Kanban, Pill, d,
  RecordDialog, NewButton, useRows, usePeople, nameOf, statusTone, type Field, type KanbanColumn,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

const COLUMNS: KanbanColumn[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "blocked", label: "Blocked" },
  { key: "review", label: "In review" },
  { key: "done", label: "Done" },
];

function EngBoard() {
  const projects = useRows<any>("eng_projects", { select: "id,name,code", order: { column: "name", ascending: true } });
  const { rows, loading, insert, patch } = useRows<any>("eng_tasks", { order: { column: "due_date", ascending: true } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [project, setProject] = useState("all");
  const [mine, setMine] = useState("all");
  const [open, setOpen] = useState(false);

  const projName = useMemo(() => new Map(projects.rows.map((p: any) => [p.id, p.code || p.name])), [projects.rows]);

  const fields: Field[] = [
    { key: "title", label: "Task", type: "text", required: true, full: true },
    { key: "project_id", label: "Program", type: "select", options: projects.rows.map((p: any) => ({ value: p.id, label: p.name })) },
    { key: "status", label: "Status", type: "select", options: COLUMNS.map((c) => ({ value: c.key, label: c.label })) },
    { key: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "critical"].map((v) => ({ value: v, label: v })) },
    { key: "assignee_id", label: "Owner", type: "user" },
    { key: "due_date", label: "Due", type: "date" },
    { key: "description", label: "Detail", type: "textarea", full: true },
  ];

  const filtered = rows.filter((r: any) =>
    (project === "all" || r.project_id === project) &&
    (mine === "all" || r.assignee_id === mine) &&
    `${r.title} ${projName.get(r.project_id) ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  const today = new Date().toISOString().slice(0, 10);
  const overdue = filtered.filter((r: any) => r.due_date && r.due_date < today && r.status !== "done");
  const critical = filtered.filter((r: any) => ["high", "critical"].includes((r.priority ?? "").toLowerCase()) && r.status !== "done");

  return (
    <WorkPage
      eyebrow="Engineering"
      title="Sprint board"
      lede="The week's engineering work in flight — one card per task, moved by the person who owns it."
      actions={<NewButton label="New task" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow cols={3}>
        <Stat label="Active tasks" value={filtered.filter((r: any) => r.status !== "done").length} icon={ListChecks} />
        <Stat label="Overdue" value={overdue.length} tone={overdue.length ? "risk" : "good"} icon={CalendarClock} />
        <Stat label="High priority open" value={critical.length} tone={critical.length ? "warn" : "good"} icon={Flame} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search tasks…">
        <Select
          value={project} onChange={setProject}
          options={[{ value: "all", label: "All programs" }, ...projects.rows.map((p: any) => ({ value: p.id, label: p.name }))]}
        />
        <Select
          value={mine} onChange={setMine}
          options={[{ value: "all", label: "Everyone" }, ...people.map((p) => ({ value: p.id, label: p.full_name || p.email || "—" }))]}
        />
      </Toolbar>

      {loading ? <Card className="mt-4"><Loading /></Card> : (
        <div className="overflow-x-auto pb-2">
          <Kanban
            columns={COLUMNS}
            rows={filtered}
            statusKey="status"
            onMove={(r, status) => patch(r.id, { status })}
            render={(r: any) => (
              <div className="space-y-1.5">
                <p className="text-sm font-medium leading-snug">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {projName.get(r.project_id) ?? "Unassigned program"}{r.due_date ? ` · due ${d(r.due_date)}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Pill tone={statusTone(r.priority)}>{r.priority ?? "medium"}</Pill>
                  {r.assignee_id && <UserMention userId={r.assignee_id} name={nameOf(byId, r.assignee_id)} size="xs" />}
                </div>
              </div>
            )}
          />
        </div>
      )}

      {open && (
        <RecordDialog
          title="New engineering task" fields={fields} people={people} initial={{ status: "todo", priority: "medium" }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/eng/board")({
  head: () => ({ meta: [{ title: "Sprint board — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: EngBoard,
});
