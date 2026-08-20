import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Coins } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, money, d,
  RecordDialog, NewButton, useRows, type Field,
} from "@/components/hq/work/kit";

function Donations() {
  const { rows, loading, insert } = useRows<any>("fund_donations", { order: { column: "received_on" } });
  const donors = useRows<any>("fund_donors", { order: { column: "name", ascending: true } });
  const [open, setOpen] = useState(false);

  const fields: Field[] = useMemo(() => [
    { key: "donor_id", label: "Donor", type: "select", required: true, options: donors.rows.map((dn) => ({ value: dn.id, label: dn.name })) },
    { key: "amount", label: "Amount", type: "number", required: true },
    { key: "received_on", label: "Received", type: "date", required: true },
    { key: "campaign", label: "Campaign", type: "text" },
    { key: "restriction", label: "Restriction", type: "select", options: ["unrestricted", "restricted", "endowment"].map((v) => ({ value: v, label: v })) },
    { key: "method", label: "Method", type: "select", options: ["card", "ach", "check", "wire", "stock", "in_kind"].map((v) => ({ value: v, label: v })) },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ], [donors.rows]);

  const donorName = (id: string) => donors.rows.find((dn) => dn.id === id)?.name ?? "Anonymous";
  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const ytd = rows
    .filter((r) => r.received_on && new Date(r.received_on).getFullYear() === new Date().getFullYear())
    .reduce((s, r) => s + Number(r.amount || 0), 0);
  const unrestricted = rows.filter((r) => r.restriction === "unrestricted").reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <WorkPage
      eyebrow="Funding & partners"
      title="Gift ledger"
      lede="Every gift received, what it is restricted to, and how the year is tracking."
      actions={<NewButton label="Record gift" onClick={() => setOpen(true)} />}
    >
      <StatRow>
        <Stat label="Gifts recorded" value={rows.length} icon={Coins} />
        <Stat label="Received this year" value={money(ytd)} tone="good" />
        <Stat label="All time" value={money(total)} />
        <Stat label="Unrestricted" value={money(unrestricted)} hint="Free to deploy where needed" />
      </StatRow>

      <Card className="mt-5" pad={false}>
        {loading ? <Loading /> : rows.length === 0 ? <Empty>No gifts recorded yet.</Empty> : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{donorName(r.donor_id)}</p>
                  <p className="text-xs text-muted-foreground">{[r.campaign, r.method].filter(Boolean).join(" · ") || "—"} · {d(r.received_on)}</p>
                </div>
                {r.restriction && <Pill tone={r.restriction === "unrestricted" ? "good" : "muted"}>{r.restriction}</Pill>}
                <span className="tabular-nums text-sm font-medium">{money(Number(r.amount || 0))}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <RecordDialog title="Record gift" fields={fields} initial={{ restriction: "unrestricted", received_on: new Date().toISOString().slice(0, 10) }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/fund/donations")({
  head: () => ({ meta: [{ title: "Gift ledger — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Donations,
});
