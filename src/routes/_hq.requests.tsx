import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeftRight, Inbox, Send, CheckCircle2 } from "lucide-react";
import {
  useRows, usePeople, useMe, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, statusTone, titleCase, d, nameOf, Select, type Field,
} from "@/components/hq/work/kit";
import { useCurrentApp } from "@/lib/hq/app-context";

export const Route = createFileRoute("/_hq/requests")({
  head: () => ({ meta: [{ title: "Team Requests — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: RequestsPage,
});

export const TEAMS = [
  { value: "exec", label: "Executive" },
  { value: "product", label: "Product & Program" },
  { value: "eng", label: "Engineering" },
  { value: "mfg", label: "Manufacturing" },
  { value: "ops", label: "Mission Operations" },
  { value: "systems", label: "Enterprise Systems" },
  { value: "commercial", label: "Commercial" },
  { value: "admin", label: "Operations & Admin" },
];

const teamLabel = (v: string) => TEAMS.find((t) => t.value === v)?.label ?? titleCase(v);

function RequestsPage() {
  const { app } = useCurrentApp();
  const team = app?.slug ?? "hq";
  const { rows, loading, insert, patch } = useRows("team_requests", { order: { column: "created_at" } });
  const { people, byId } = usePeople();
  const me = useMe();
  const [tab, setTab] = useState<"inbox" | "sent" | "all">("inbox");
  const [status, setStatus] = useState("open");
  const [creating, setCreating] = useState(false);

  const fields: Field[] = [
    { key: "to_team", label: "Send to team", type: "select", required: true, options: TEAMS },
    { key: "subject", label: "Subject", type: "text", required: true, full: true },
    { key: "details", label: "What do you need?", type: "textarea", full: true },
    { key: "priority", label: "Priority", type: "select", options: ["low", "normal", "high", "urgent"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "due_date", label: "Needed by", type: "date" },
    { key: "assignee_id", label: "Suggested owner", type: "user" },
  ];

  const scoped = useMemo(() => {
    let list = rows as any[];
    if (tab === "inbox") list = list.filter((r) => r.to_team === team);
    if (tab === "sent") list = list.filter((r) => r.from_team === team);
    if (status !== "all") list = list.filter((r) => (status === "open" ? r.status !== "closed" && r.status !== "declined" : r.status === status));
    return list;
  }, [rows, tab, team, status]);

  const inboxOpen = (rows as any[]).filter((r) => r.to_team === team && r.status !== "closed").length;
  const sentOpen = (rows as any[]).filter((r) => r.from_team === team && r.status !== "closed").length;
  const overdue = (rows as any[]).filter((r) => r.to_team === team && r.due_date && r.due_date < new Date().toISOString().slice(0, 10) && r.status !== "closed").length;

  return (
    <WorkPage
      wide eyebrow="Between teams"
      title="Team requests"
      lede="The chain of command between workspaces. Ops asks Engineering for a fix, Engineering asks Manufacturing for parts, everyone keeps leadership in the loop."
      actions={<NewButton label="New request" onClick={() => setCreating(true)} />}
    >
      <StatRow cols={3}>
        <Stat label="In your inbox" value={inboxOpen} icon={Inbox} tone={inboxOpen ? "warn" : "good"} />
        <Stat label="Waiting on others" value={sentOpen} icon={Send} />
        <Stat label="Past due" value={overdue} icon={CheckCircle2} tone={overdue ? "risk" : "good"} />
      </StatRow>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-border bg-card p-0.5">
          {(["inbox", "sent", "all"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded px-3 py-1.5 text-sm capitalize ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <Select value={status} onChange={setStatus} options={[
          { value: "open", label: "Open" }, { value: "in_progress", label: "In progress" },
          { value: "closed", label: "Closed" }, { value: "declined", label: "Declined" }, { value: "all", label: "Everything" },
        ]} />
      </div>

      {loading ? <Loading /> : (
        <div className="mt-4 space-y-2">
          {scoped.length === 0 && <Card><Empty>Nothing here. Requests you raise or receive show up in this list.</Empty></Card>}
          {scoped.map((r: any) => (
            <article key={r.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{teamLabel(r.from_team)} → {teamLabel(r.to_team)}</span>
                    <Pill tone={r.priority === "urgent" ? "risk" : r.priority === "high" ? "warn" : "muted"}>{titleCase(r.priority)}</Pill>
                    <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold">{r.subject}</h3>
                  {r.details && <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{r.details}</p>}
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Raised by {nameOf(byId, r.requested_by)} · owner {nameOf(byId, r.assignee_id)}
                    {r.due_date ? ` · needed by ${d(r.due_date)}` : ""}
                  </p>
                  {r.resolution && <p className="mt-2 rounded bg-muted/50 p-2 text-xs">Resolution: {r.resolution}</p>}
                </div>
                <div className="flex flex-shrink-0 flex-wrap gap-1.5">
                  {r.to_team === team && r.status === "open" && (
                    <Btn onClick={() => patch(r.id, { status: "in_progress", assignee_id: r.assignee_id ?? me })}>Accept</Btn>
                  )}
                  {r.to_team === team && r.status !== "closed" && (
                    <Btn variant="primary" onClick={async () => {
                      const resolution = prompt("How was this resolved?");
                      if (resolution === null) return;
                      patch(r.id, { status: "closed", resolution });
                    }}>Close out</Btn>
                  )}
                  {r.to_team === team && r.status !== "declined" && r.status !== "closed" && (
                    <Btn variant="danger" onClick={() => patch(r.id, { status: "declined" })}>Decline</Btn>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {creating && (
        <RecordDialog
          title="Raise a request with another team" fields={fields} people={people}
          initial={{ priority: "normal" }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, from_team: team, status: "open", requested_by: me }); setCreating(false); }}
        />
      )}
    </WorkPage>
  );
}
