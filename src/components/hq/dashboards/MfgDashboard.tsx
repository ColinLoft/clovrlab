import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Bar, Empty, RowLink } from "./kit";

async function load() {
  const [orders, inventory, inspections, suppliers, pos, assets] = await Promise.all([
    rows("mfg_work_orders", "id,order_number,product_name,status,priority,due_date,quantity", (q: any) => q.neq("status", "complete").order("due_date", { nullsFirst: false }), 10),
    rows("mfg_inventory", "id,name,quantity,reorder_point,location", (q: any) => q.order("quantity"), 8),
    rows("mfg_inspections", "id,status,defect_count,inspected_at", (q: any) => q.order("inspected_at", { ascending: false }), 8),
    count("mfg_suppliers"),
    rows("mfg_purchase_orders", "id,po_number,status,total,expected_date", (q: any) => q.neq("status", "received").order("expected_date", { nullsFirst: false }), 6),
    rows("con_equipment", "id,name,status,next_service_date", (q: any) => q.order("next_service_date", { nullsFirst: false }), 8),
  ]);
  return { orders, inventory, inspections, suppliers, pos, assets };
}

export function MfgDashboard() {
  const { data, error } = useDash("mfg", load);
  return (
    <DashShell
      eyebrow="Manufacturing & fleet"
      title="Production floor control"
      summary="Work order queue, stock exposure, quality dispositions, inbound purchasing and airframe availability."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading variant="rows" />}
      {data && (
        <>
          <section className="mt-7 overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em]">Work order queue</h2>
              <Link to="/inventory" className="text-xs text-primary hover:underline">Inventory</Link>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Order</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Priority</th>
                  <th className="px-4 py-2 text-right font-medium">Qty</th>
                  <th className="px-4 py-2 text-right font-medium">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.orders.length === 0 && <tr><td colSpan={5}><Empty>Queue is clear.</Empty></td></tr>}
                {data.orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-muted/50">
                    <td className="px-4 py-2.5 font-medium">{o.product_name ?? o.order_number ?? "Work order"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{o.status ?? "open"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{o.priority ?? "normal"}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{o.quantity ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{o.due_date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-3">
            <Panel title="Stock exposure" hint={`${data.suppliers} suppliers on record`}>
              <div className="space-y-3 p-4">
                {data.inventory.length === 0 && <Empty>No inventory tracked.</Empty>}
                {data.inventory.map((i: any) => {
                  const rp = Number(i.reorder_point ?? 10);
                  const qty = Number(i.quantity ?? 0);
                  return (
                    <div key={i.id}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate font-medium">{i.name}</span>
                        <span className="tabular-nums text-muted-foreground">{qty} / {rp}</span>
                      </div>
                      <div className="mt-1"><Bar value={qty} max={Math.max(rp * 2, qty, 1)} tone={qty <= rp ? "destructive" : "primary"} /></div>
                    </div>
                  );
                })}
              </div>
            </Panel>
            <Panel title="Quality log" hint="Latest inspections">
              <div className="divide-y divide-border">
                {data.inspections.length === 0 && <Empty>No inspections recorded.</Empty>}
                {data.inspections.slice(0, 6).map((x: any) => (
                  <RowLink key={x.id} to="/inspections" title={x.status ?? "Inspection"} meta={`${x.defect_count ?? 0} defects · ${x.inspected_at ? new Date(x.inspected_at).toLocaleDateString() : "undated"}`} tone={Number(x.defect_count ?? 0) > 0 ? "risk" : "good"} />
                ))}
              </div>
            </Panel>
            <Panel title="Inbound & airframes" hint="Purchasing and asset readiness">
              <div className="divide-y divide-border">
                {data.pos.map((p: any) => (
                  <RowLink key={p.id} to="/purchase-orders" title={p.po_number ?? "Purchase order"} meta={`${p.status ?? "open"} · ETA ${p.expected_date ?? "TBD"}`} badge="po" />
                ))}
                {data.assets.slice(0, 5).map((a: any) => (
                  <RowLink key={a.id} to="/equipment" title={a.name} meta={`${a.status ?? "unknown"} · service ${a.next_service_date ?? "n/a"}`} tone={a.status === "available" ? "good" : "warn"} />
                ))}
                {data.pos.length === 0 && data.assets.length === 0 && <Empty>Nothing inbound.</Empty>}
              </div>
            </Panel>
          </section>
        </>
      )}
    </DashShell>
  );
}
