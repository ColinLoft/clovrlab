import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PackageOpen, Wrench, Undo2 } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, Toolbar, Btn, d, money, statusTone,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

const repairFields = (people: any[]): Field[] => [
  { key: "repair_number", label: "Repair no.", type: "text", required: true },
  { key: "product_name", label: "Assembly", type: "text", required: true },
  { key: "serial_number", label: "Serial", type: "text" },
  { key: "issue", label: "Reported fault", type: "textarea", full: true },
  { key: "status", label: "Status", type: "select", options: ["received", "diagnosing", "repairing", "testing", "shipped"].map((v) => ({ value: v, label: v })) },
  { key: "technician_id", label: "Technician", type: "user" },
  { key: "received_at", label: "Received", type: "date" },
  { key: "cost", label: "Repair cost", type: "number" },
];

function Returns() {
  const rmas = useRows<any>("cs_rmas", { order: { column: "received_at" } });
  const repairs = useRows<any>("cs_repairs", { order: { column: "received_at" } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"repairs" | "rmas">("repairs");
  const [open, setOpen] = useState(false);

  const match = (s: string) => s.toLowerCase().includes(q.toLowerCase());
  const openRepairs = repairs.rows.filter((r: any) => r.status !== "shipped");
  const openRmas = rmas.rows.filter((r: any) => !["resolved", "closed"].includes((r.status ?? "").toLowerCase()));
  const refunded = rmas.rows.reduce((s: number, r: any) => s + Number(r.refund_amount || 0), 0);

  return (
    <WorkPage
      eyebrow="Production"
      title="Returns & repair bench"
      lede="Hardware coming back off the line: what is on the bench, what is being replaced outright, and what it costs the build."
      actions={tab === "repairs" ? <NewButton label="Open repair" onClick={() => setOpen(true)} /> : undefined}
      wide
    >
      <StatRow cols={4}>
        <Stat label="On the bench" value={openRepairs.length} icon={Wrench} tone={openRepairs.length ? "warn" : "good"} />
        <Stat label="Open RMAs" value={openRmas.length} icon={Undo2} />
        <Stat label="Units returned" value={rmas.rows.length} icon={PackageOpen} />
        <Stat label="Refunded" value={money(refunded)} hint="Lifetime RMA credits" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search serial, assembly, number…">
        <Btn variant={tab === "repairs" ? "primary" : "default"} onClick={() => setTab("repairs")}>Repair bench</Btn>
        <Btn variant={tab === "rmas" ? "primary" : "default"} onClick={() => setTab("rmas")}>Returns</Btn>
      </Toolbar>

      {tab === "repairs" ? (
        <Card className="mt-4" pad={false}>
          {repairs.loading ? <Loading /> : (
            <ul className="divide-y divide-border">
              {repairs.rows.filter((r: any) => match(`${r.repair_number} ${r.product_name ?? ""} ${r.serial_number ?? ""}`)).length === 0 && (
                <Empty>Bench is clear.</Empty>
              )}
              {repairs.rows.filter((r: any) => match(`${r.repair_number} ${r.product_name ?? ""} ${r.serial_number ?? ""}`)).map((r: any) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground">{r.repair_number}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{r.product_name} {r.serial_number ? `· ${r.serial_number}` : ""}</span>
                    <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      {r.issue ? String(r.issue).slice(0, 80) : "No fault recorded"} · in {d(r.received_at)}
                      {r.technician_id && <UserMention userId={r.technician_id} name={nameOf(byId, r.technician_id)} size="xs" />}
                    </span>
                  </span>
                  {r.cost ? <span className="text-xs tabular-nums text-muted-foreground">{money(Number(r.cost))}</span> : null}
                  <select
                    value={r.status ?? "received"}
                    onChange={(e) => repairs.patch(r.id, { status: e.target.value })}
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    {["received", "diagnosing", "repairing", "testing", "shipped"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : (
        <Card className="mt-4" pad={false}>
          {rmas.loading ? <Loading /> : (
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">RMA</th>
                  <th className="px-4 py-2">Assembly</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Received</th>
                  <th className="px-4 py-2 text-right">Credit</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rmas.rows.filter((r: any) => match(`${r.rma_number} ${r.product_name ?? ""} ${r.reason ?? ""}`)).map((r: any) => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-2.5 font-mono text-[11px]">{r.rma_number}</td>
                    <td className="px-4 py-2.5">{r.product_name ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.reason ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{d(r.received_at)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{r.refund_amount ? money(Number(r.refund_amount)) : "—"}</td>
                    <td className="px-4 py-2.5"><Pill tone={statusTone(r.status)}>{r.status ?? "open"}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!rmas.loading && rmas.rows.length === 0 && <Empty>No returns recorded.</Empty>}
        </Card>
      )}

      {open && (
        <RecordDialog
          title="Open a repair" fields={repairFields(people)} people={people}
          initial={{ status: "received", received_at: new Date().toISOString().slice(0, 10) }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await repairs.insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/mfg/returns")({
  head: () => ({ meta: [{ title: "Returns & repairs — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Returns,
});
