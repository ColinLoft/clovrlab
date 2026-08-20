import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Truck, Star } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, money, d,
  RecordDialog, NewButton, useRows, Btn, type Field,
} from "@/components/hq/work/kit";

const supplierFields: Field[] = [
  { key: "name", label: "Supplier", type: "text", required: true },
  { key: "category", label: "Supplies", type: "text", placeholder: "Composites, avionics…" },
  { key: "contact_name", label: "Contact", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "rating", label: "Rating (1-5)", type: "number" },
  { key: "notes", label: "Notes", type: "textarea", full: true },
];

function Supply() {
  const suppliers = useRows<any>("mfg_suppliers", { order: { column: "name", ascending: true } });
  const pos = useRows<any>("mfg_purchase_orders", { order: { column: "order_date" } });
  const [tab, setTab] = useState<"pos" | "suppliers">("pos");
  const [open, setOpen] = useState<null | "po" | "supplier">(null);

  const poFields: Field[] = useMemo(() => [
    { key: "po_number", label: "PO number", type: "text", required: true },
    { key: "supplier_id", label: "Supplier", type: "select", required: true, options: suppliers.rows.map((s) => ({ value: s.id, label: s.name })) },
    { key: "status", label: "Status", type: "select", options: ["draft", "sent", "confirmed", "received", "closed"].map((v) => ({ value: v, label: v })) },
    { key: "total", label: "Total", type: "number" },
    { key: "order_date", label: "Ordered", type: "date" },
    { key: "expected_date", label: "Expected", type: "date" },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ], [suppliers.rows]);

  const supplierName = (id: string) => suppliers.rows.find((s) => s.id === id)?.name ?? "—";
  const openPos = pos.rows.filter((p) => !["received", "closed"].includes(p.status));
  const committed = openPos.reduce((s, p) => s + Number(p.total || 0), 0);

  return (
    <WorkPage
      eyebrow="Manufacturing"
      title="Supply chain"
      lede="Who we buy from, what is on order, and when it lands on the dock."
      actions={<NewButton label={tab === "pos" ? "New PO" : "New supplier"} onClick={() => setOpen(tab === "pos" ? "po" : "supplier")} />}
      wide
    >
      <StatRow>
        <Stat label="Suppliers" value={suppliers.rows.length} icon={Truck} />
        <Stat label="Open POs" value={openPos.length} />
        <Stat label="Committed spend" value={money(committed)} hint="Ordered, not yet received" />
        <Stat label="Late deliveries" value={openPos.filter((p) => p.expected_date && p.expected_date < new Date().toISOString().slice(0, 10)).length} tone="risk" />
      </StatRow>

      <div className="mt-5 flex gap-2">
        <Btn variant={tab === "pos" ? "primary" : "default"} onClick={() => setTab("pos")}>Purchase orders</Btn>
        <Btn variant={tab === "suppliers" ? "primary" : "default"} onClick={() => setTab("suppliers")}>Suppliers</Btn>
      </div>

      {tab === "pos" ? (
        <Card className="mt-4" pad={false}>
          {pos.loading ? <Loading /> : pos.rows.length === 0 ? <Empty>No purchase orders yet.</Empty> : (
            <ul className="divide-y divide-border">
              {pos.rows.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <Pill tone={statusTone(p.status)}>{p.status || "draft"}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{p.po_number} · {supplierName(p.supplier_id)}</p>
                    <p className="text-xs text-muted-foreground">Ordered {d(p.order_date)} · expected {d(p.expected_date)}</p>
                  </div>
                  <span className="tabular-nums text-sm">{money(Number(p.total || 0))}</span>
                  <select
                    value={p.status ?? "draft"} onChange={(e) => pos.patch(p.id, { status: e.target.value })}
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    {["draft", "sent", "confirmed", "received", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {suppliers.loading ? <Loading /> : suppliers.rows.length === 0 ? <Empty>No suppliers on file.</Empty> : suppliers.rows.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.category || "Uncategorised"}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />{s.rating ?? "—"}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{s.contact_name || "No contact"}{s.email ? ` · ${s.email}` : ""}</p>
              <p className="mt-1 text-xs text-muted-foreground">{pos.rows.filter((p) => p.supplier_id === s.id).length} purchase orders</p>
            </Card>
          ))}
        </div>
      )}

      {open === "po" && (
        <RecordDialog title="New purchase order" fields={poFields} initial={{ status: "draft" }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await pos.insert(v); setOpen(null); }} />
      )}
      {open === "supplier" && (
        <RecordDialog title="New supplier" fields={supplierFields}
          onCancel={() => setOpen(null)} onSave={async (v) => { await suppliers.insert(v); setOpen(null); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/mfg/supply")({
  head: () => ({ meta: [{ title: "Supply chain — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Supply,
});
