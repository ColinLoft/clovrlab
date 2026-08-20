import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HeartHandshake } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Toolbar, Card, Loading, Empty, Pill, money, d,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";

const fields: Field[] = [
  { key: "name", label: "Donor", type: "text", required: true },
  { key: "kind", label: "Type", type: "select", options: ["individual", "foundation", "corporate", "government"].map((v) => ({ value: v, label: v })) },
  { key: "tier", label: "Tier", type: "select", options: ["principal", "major", "sustaining", "community"].map((v) => ({ value: v, label: v })) },
  { key: "steward_id", label: "Relationship owner", type: "user" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "notes", label: "Notes", type: "textarea", full: true },
];

function Donors() {
  const { rows, loading, insert } = useRows<any>("fund_donors", { order: { column: "lifetime_amount" } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => rows.filter((r) => `${r.name} ${r.tier ?? ""} ${r.kind ?? ""}`.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const lifetime = rows.reduce((s, r) => s + Number(r.lifetime_amount || 0), 0);
  const stale = rows.filter((r) => !r.last_gift_on || new Date(r.last_gift_on).getTime() < Date.now() - 365 * 864e5);

  return (
    <WorkPage
      eyebrow="Funding & partners"
      title="Donors"
      lede="The people and institutions funding the fleet, and who owns each relationship."
      actions={<NewButton label="Add donor" onClick={() => setOpen(true)} />}
    >
      <StatRow>
        <Stat label="Donors" value={rows.length} icon={HeartHandshake} />
        <Stat label="Lifetime giving" value={money(lifetime)} />
        <Stat label="Principal & major" value={rows.filter((r) => ["principal", "major"].includes(r.tier)).length} tone="good" />
        <Stat label="No gift in a year" value={stale.length} tone={stale.length ? "warn" : "good"} hint="Worth a check-in" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search donors…" />

      <Card className="mt-4" pad={false}>
        {loading ? <Loading /> : filtered.length === 0 ? <Empty>No donors on file.</Empty> : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.kind || "individual"} · stewarded by {nameOf(byId, r.steward_id)} · last gift {d(r.last_gift_on)}
                  </p>
                </div>
                {r.tier && <Pill tone={["principal", "major"].includes(r.tier) ? "good" : "muted"}>{r.tier}</Pill>}
                <span className="tabular-nums text-sm">{money(Number(r.lifetime_amount || 0))}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <RecordDialog title="Add donor" fields={fields} people={people} initial={{ kind: "individual", tier: "community" }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/fund/donors")({
  head: () => ({ meta: [{ title: "Donors — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Donors,
});
