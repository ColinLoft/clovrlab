import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Boxes, TriangleAlert } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Toolbar, Card, Loading, Empty, Pill, Bar, money,
  RecordDialog, NewButton, useRows, Btn, type Field,
} from "@/components/hq/work/kit";

const fields: Field[] = [
  { key: "sku", label: "SKU", type: "text", required: true },
  { key: "name", label: "Part name", type: "text", required: true },
  { key: "category", label: "Category", type: "text" },
  { key: "quantity", label: "On hand", type: "number" },
  { key: "reorder_point", label: "Reorder at", type: "number" },
  { key: "unit_cost", label: "Unit cost", type: "number" },
  { key: "location", label: "Bin / location", type: "text" },
  { key: "description", label: "Notes", type: "textarea", full: true },
];

function Stockroom() {
  const { rows, loading, insert, patch, remove } = useRows<any>("mfg_inventory", { order: { column: "name", ascending: true } });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [lowOnly, setLowOnly] = useState(false);

  const isLow = (r: any) => Number(r.quantity || 0) <= Number(r.reorder_point || 0);
  const filtered = useMemo(() => rows.filter((r) =>
    `${r.sku} ${r.name} ${r.category ?? ""} ${r.location ?? ""}`.toLowerCase().includes(q.toLowerCase()) && (!lowOnly || isLow(r))
  ), [rows, q, lowOnly]);

  const value = rows.reduce((s, r) => s + Number(r.quantity || 0) * Number(r.unit_cost || 0), 0);
  const low = rows.filter(isLow);

  return (
    <WorkPage
      eyebrow="Manufacturing"
      title="Stockroom"
      lede="Parts on hand, what is about to run out, and what it is all worth. Adjust counts inline as parts are pulled."
      actions={<NewButton label="Add part" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow cols={3}>
        <Stat label="Distinct parts" value={rows.length} icon={Boxes} />
        <Stat label="Below reorder point" value={low.length} tone={low.length ? "warn" : "good"} icon={TriangleAlert} />
        <Stat label="Inventory value" value={money(value)} hint="On-hand quantity × unit cost" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search SKU, part, bin…">
        <Btn variant={lowOnly ? "primary" : "default"} onClick={() => setLowOnly((v) => !v)}>Needs reordering</Btn>
      </Toolbar>

      <Card className="mt-4" pad={false}>
        {loading ? <Loading /> : filtered.length === 0 ? <Empty>No parts match.</Empty> : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Part</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2 w-56">Stock level</th>
                <th className="px-4 py-2 text-right">On hand</th>
                <th className="px-4 py-2 text-right">Value</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.sku}{r.category ? ` · ${r.category}` : ""}</div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.location || "—"}</td>
                  <td className="px-4 py-2.5">
                    <Bar value={Number(r.quantity || 0)} max={Math.max(Number(r.reorder_point || 0) * 3, Number(r.quantity || 1))} tone={isLow(r) ? "risk" : "good"} />
                    {isLow(r) && <span className="mt-1 inline-block"><Pill tone="risk">reorder</Pill></span>}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <input
                      type="number" defaultValue={r.quantity ?? 0}
                      onBlur={(e) => Number(e.target.value) !== Number(r.quantity) && patch(r.id, { quantity: Number(e.target.value) })}
                      className="w-20 rounded border border-border bg-background px-2 py-1 text-right text-sm"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{money(Number(r.quantity || 0) * Number(r.unit_cost || 0))}</td>
                  <td className="px-4 py-2.5 text-right"><Btn variant="ghost" onClick={() => remove(r.id)}>Remove</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {open && (
        <RecordDialog
          title="Add part" fields={fields} initial={{ quantity: 0, reorder_point: 0 }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/mfg/stock")({
  head: () => ({ meta: [{ title: "Stockroom — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Stockroom,
});
