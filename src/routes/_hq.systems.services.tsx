import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Plug, ServerCog } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, d,
  RecordDialog, NewButton, useRows, type Field,
} from "@/components/hq/work/kit";

const infraFields: Field[] = [
  { key: "name", label: "Service", type: "text", required: true },
  { key: "kind", label: "Kind", type: "select", options: ["api", "database", "worker", "storage", "network", "device"].map((v) => ({ value: v, label: v })) },
  { key: "environment", label: "Environment", type: "select", options: ["production", "staging", "development"].map((v) => ({ value: v, label: v })) },
  { key: "provider", label: "Provider", type: "text" },
  { key: "region", label: "Region", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["operational", "degraded", "maintenance", "down"].map((v) => ({ value: v, label: v })) },
  { key: "url", label: "URL", type: "text" },
  { key: "notes", label: "Runbook notes", type: "textarea", full: true },
];

const integrationFields: Field[] = [
  { key: "name", label: "Integration", type: "text", required: true },
  { key: "vendor", label: "Vendor", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["connected", "degraded", "disconnected"].map((v) => ({ value: v, label: v })) },
  { key: "connected_at", label: "Connected", type: "date" },
  { key: "notes", label: "Notes", type: "textarea", full: true },
];

function Services() {
  const infra = useRows<any>("dev_infrastructure", { order: { column: "name", ascending: true } });
  const integrations = useRows<any>("dev_integrations", { order: { column: "name", ascending: true } });
  const [open, setOpen] = useState<null | "infra" | "integration">(null);

  const down = infra.rows.filter((r) => ["down", "degraded"].includes(r.status));

  return (
    <WorkPage
      eyebrow="Enterprise systems"
      title="Service health"
      lede="Everything IT keeps running — the platform services behind flight ops and the third-party tools bolted onto them."
      actions={<>
        <NewButton label="Add service" onClick={() => setOpen("infra")} />
        <NewButton label="Add integration" onClick={() => setOpen("integration")} />
      </>}
      wide
    >
      <StatRow>
        <Stat label="Services tracked" value={infra.rows.length} icon={ServerCog} />
        <Stat label="Operational" value={infra.rows.filter((r) => r.status === "operational").length} tone="good" icon={Activity} />
        <Stat label="Degraded or down" value={down.length} tone={down.length ? "risk" : "good"} />
        <Stat label="Integrations" value={integrations.rows.length} icon={Plug} />
      </StatRow>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card title="Platform services" hint="Change status inline during an incident" pad={false}>
          {infra.loading ? <Loading /> : infra.rows.length === 0 ? <Empty>Nothing registered yet.</Empty> : (
            <ul className="divide-y divide-border">
              {infra.rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <Pill tone={statusTone(r.status)}>{r.status || "unknown"}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{[r.kind, r.environment, r.provider, r.region].filter(Boolean).join(" · ") || "—"}</p>
                  </div>
                  <select
                    value={r.status ?? "operational"} onChange={(e) => infra.patch(r.id, { status: e.target.value })}
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    {["operational", "degraded", "maintenance", "down"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Third-party integrations" pad={false}>
          {integrations.loading ? <Loading /> : integrations.rows.length === 0 ? <Empty>No integrations connected.</Empty> : (
            <ul className="divide-y divide-border">
              {integrations.rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <Pill tone={statusTone(r.status)}>{r.status || "unknown"}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{[r.vendor, r.category].filter(Boolean).join(" · ") || "—"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{d(r.connected_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {open === "infra" && (
        <RecordDialog title="Register service" fields={infraFields} initial={{ status: "operational", environment: "production" }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await infra.insert(v); setOpen(null); }} />
      )}
      {open === "integration" && (
        <RecordDialog title="Add integration" fields={integrationFields} initial={{ status: "connected" }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await integrations.insert(v); setOpen(null); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/systems/services")({
  head: () => ({ meta: [{ title: "Service health — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Services,
});
