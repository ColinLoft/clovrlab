import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, dt,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";

const fields: Field[] = [
  { key: "event", label: "Event", type: "text", required: true },
  { key: "severity", label: "Severity", type: "select", options: ["info", "warning", "critical"].map((v) => ({ value: v, label: v })) },
  { key: "source", label: "Source", type: "text", placeholder: "Auth, VPN, Drive…" },
  { key: "actor_id", label: "Person involved", type: "user" },
  { key: "status", label: "Status", type: "select", options: ["open", "in_review", "resolved"].map((v) => ({ value: v, label: v })) },
  { key: "occurred_at", label: "Occurred", type: "datetime" },
  { key: "details", label: "Details", type: "textarea", full: true },
];

function Access() {
  const logs = useRows<any>("dev_security_logs", { order: { column: "occurred_at" } });
  const roles = useRows<any>("user_roles", { select: "id, user_id, role" });
  const { people, byId } = usePeople();
  const [open, setOpen] = useState(false);

  const critical = logs.rows.filter((r) => r.severity === "critical" && r.status !== "resolved");
  const admins = roles.rows.filter((r) => ["admin", "super_admin"].includes(r.role));

  return (
    <WorkPage
      eyebrow="Enterprise systems"
      title="Access & identity"
      lede="Who holds elevated access, and every security event worth a second look."
      actions={<NewButton label="Log event" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow>
        <Stat label="People with accounts" value={people.length} icon={KeyRound} />
        <Stat label="Elevated access" value={admins.length} tone="warn" icon={ShieldCheck} />
        <Stat label="Open security events" value={logs.rows.filter((r) => r.status !== "resolved").length} />
        <Stat label="Critical unresolved" value={critical.length} tone={critical.length ? "risk" : "good"} />
      </StatRow>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Security events" pad={false}>
          {logs.loading ? <Loading /> : logs.rows.length === 0 ? <Empty>Nothing logged. Quiet is good.</Empty> : (
            <ul className="divide-y divide-border">
              {logs.rows.map((r) => (
                <li key={r.id} className="flex items-start gap-3 px-4 py-3">
                  <Pill tone={statusTone(r.severity)}>{r.severity || "info"}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{r.event}</p>
                    <p className="text-xs text-muted-foreground">{r.details || r.source || "—"}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{nameOf(byId, r.actor_id)} · {dt(r.occurred_at ?? r.created_at)}</p>
                  </div>
                  <select
                    value={r.status ?? "open"} onChange={(e) => logs.patch(r.id, { status: e.target.value })}
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    {["open", "in_review", "resolved"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Elevated access" hint="Managed from Organization settings" pad={false}>
          {admins.length === 0 ? <Empty>No elevated accounts.</Empty> : (
            <ul className="divide-y divide-border">
              {admins.map((r) => (
                <li key={r.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm">{nameOf(byId, r.user_id)}</span>
                  <Pill tone="warn">{r.role}</Pill>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {open && (
        <RecordDialog title="Log security event" fields={fields} people={people} initial={{ severity: "info", status: "open" }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await logs.insert(v); setOpen(false); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/systems/access")({
  head: () => ({ meta: [{ title: "Access & identity — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Access,
});
