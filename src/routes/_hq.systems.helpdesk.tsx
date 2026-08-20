import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeBuoy } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Toolbar, Select, Kanban, Loading, Pill, statusTone, dt,
  RecordDialog, NewButton, useRows, usePeople, nameOf, useMe, type Field,
} from "@/components/hq/work/kit";

const COLUMNS = [
  { key: "open", label: "New" },
  { key: "in_progress", label: "Working" },
  { key: "waiting", label: "Waiting on requester" },
  { key: "resolved", label: "Resolved" },
];

const TEAMS = ["Operations", "Engineering", "Product", "Manufacturing", "Leadership", "Funding & Partners", "People & Admin"];

function Helpdesk() {
  const { rows, loading, insert, patch } = useRows<any>("it_requests", { order: { column: "created_at" } });
  const { people, byId } = usePeople();
  const me = useMe();
  const [q, setQ] = useState("");
  const [urgency, setUrgency] = useState("all");
  const [open, setOpen] = useState(false);

  const fields: Field[] = useMemo(() => [
    { key: "title", label: "What is broken?", type: "text", required: true },
    { key: "category", label: "Category", type: "select", options: ["access", "hardware", "software", "network", "security", "other"].map((v) => ({ value: v, label: v })) },
    { key: "system", label: "System", type: "text", placeholder: "Mission console, Drive, Slack…" },
    { key: "urgency", label: "Urgency", type: "select", options: ["low", "normal", "high", "critical"].map((v) => ({ value: v, label: v })) },
    { key: "requester_team", label: "Requesting team", type: "select", options: TEAMS.map((t) => ({ value: t, label: t })) },
    { key: "assignee_id", label: "Owner", type: "user" },
    { key: "details", label: "Details", type: "textarea", full: true },
  ], []);

  const filtered = useMemo(() => rows.filter((r) =>
    `${r.title} ${r.system ?? ""} ${r.requester_team ?? ""}`.toLowerCase().includes(q.toLowerCase()) &&
    (urgency === "all" || r.urgency === urgency)
  ), [rows, q, urgency]);

  const critical = rows.filter((r) => r.urgency === "critical" && r.status !== "resolved");

  return (
    <WorkPage
      eyebrow="Enterprise systems"
      title="Support desk"
      lede="Requests from every team, triaged by urgency. Anything critical here is blocking someone's day."
      actions={<NewButton label="Log request" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow>
        <Stat label="Open" value={rows.filter((r) => r.status !== "resolved").length} icon={LifeBuoy} />
        <Stat label="Critical" value={critical.length} tone={critical.length ? "risk" : "good"} />
        <Stat label="Unassigned" value={rows.filter((r) => !r.assignee_id && r.status !== "resolved").length} tone="warn" />
        <Stat label="Resolved" value={rows.filter((r) => r.status === "resolved").length} tone="good" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search requests…">
        <Select value={urgency} onChange={setUrgency}
          options={[{ value: "all", label: "All urgencies" }, ...["critical", "high", "normal", "low"].map((v) => ({ value: v, label: v }))]} />
      </Toolbar>

      {loading ? <Loading /> : (
        <Kanban
          columns={COLUMNS} rows={filtered} statusKey="status"
          onMove={(r, status) => patch(r.id, { status })}
          render={(r: any) => (
            <>
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{r.title}</span>
                <Pill tone={statusTone(r.urgency)}>{r.urgency || "normal"}</Pill>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.requester_team || "Unknown team"}{r.system ? ` · ${r.system}` : ""}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{nameOf(byId, r.assignee_id)} · {dt(r.created_at)}</p>
            </>
          )}
        />
      )}

      {open && (
        <RecordDialog title="Log support request" fields={fields} people={people}
          initial={{ status: "open", urgency: "normal", requester_id: me }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/systems/helpdesk")({
  head: () => ({ meta: [{ title: "Support desk — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Helpdesk,
});
