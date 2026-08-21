import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Factory, CalendarRange, AlertTriangle } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Card, Pill, Empty, Loading, Stat, StatRow, NewButton, RecordDialog,
  statusTone, titleCase, d, nameOf, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/mfg/orders")({
  head: () => ({ meta: [{ title: "Build Schedule — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

const STATUSES = ["queued", "in_progress", "inspection", "complete", "blocked"];

const fields: Field[] = [
  { key: "order_number", label: "Order number", type: "text", required: true, placeholder: "WO-0142" },
  { key: "product_name", label: "Product", type: "text", required: true, placeholder: "Athera VTOL airframe" },
  { key: "quantity", label: "Quantity", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES.map((v) => ({ value: v, label: titleCase(v) })) },
  { key: "priority", label: "Priority", type: "select", options: ["low", "normal", "high", "urgent"].map((v) => ({ value: v, label: titleCase(v) })) },
  { key: "assignee_id", label: "Build lead", type: "user" },
  { key: "due_date", label: "Due", type: "date" },
  { key: "notes", label: "Notes", type: "textarea", full: true },
];

/** Fourteen-day build horizon — the line plans in days, not in lists. */
function OrdersPage() {
  const { rows, loading, insert, patch } = useRows<any>("mfg_work_orders", { order: { column: "due_date", ascending: true } });
  const { people, byId } = usePeople();
  const [creating, setCreating] = useState(false);

  const days = useMemo(() => {
    const out: { key: string; date: Date }[] = [];
    const start = new Date(); start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const dt2 = new Date(start.getTime() + i * 864e5);
      out.push({ key: dt2.toISOString().slice(0, 10), date: dt2 });
    }
    return out;
  }, []);

  const scheduled = rows.filter((r) => r.due_date && days.some((x) => x.key === String(r.due_date).slice(0, 10)));
  const overdue = rows.filter((r) => r.due_date && new Date(String(r.due_date)) < new Date(days[0].key) && r.status !== "complete");
  const unscheduled = rows.filter((r) => !r.due_date);
  const blocked = rows.filter((r) => r.status === "blocked");

  return (
    <WorkPage
      wide
      eyebrow="Production"
      title="Build schedule"
      lede="A fourteen-day horizon for the line: what has to leave each station, what slipped, and what still has no date."
      actions={<NewButton label="New work order" onClick={() => setCreating(true)} />}
    >
      <StatRow cols={4}>
        <Stat label="Open orders" value={rows.filter((r) => r.status !== "complete").length} icon={Factory} />
        <Stat label="In the next 14 days" value={scheduled.length} icon={CalendarRange} />
        <Stat label="Past due" value={overdue.length} tone={overdue.length ? "risk" : "good"} icon={AlertTriangle} />
        <Stat label="Blocked" value={blocked.length} tone={blocked.length ? "warn" : "good"} />
      </StatRow>

      {loading ? <Loading /> : (
        <>
          {overdue.length > 0 && (
            <Card className="mt-5 border-destructive/40" title="Past due" hint="These missed their date and are still open" pad={false}>
              <div className="divide-y divide-border">
                {overdue.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className="min-w-0 truncate text-sm">
                      <span className="font-mono text-xs text-muted-foreground">{r.order_number}</span> · {r.product_name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] text-destructive">due {d(r.due_date)}</span>
                      <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="mt-5 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {days.map(({ key, date }) => {
                const items = rows.filter((r) => String(r.due_date ?? "").slice(0, 10) === key);
                const weekend = [0, 6].includes(date.getDay());
                return (
                  <div key={key} className={`w-[220px] shrink-0 rounded-lg border border-border ${weekend ? "bg-muted/40" : "bg-card"}`}>
                    <header className="flex items-center justify-between border-b border-border px-3 py-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {date.toLocaleDateString(undefined, { weekday: "short" })}
                        </p>
                        <p className="text-sm font-semibold">{date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                      </div>
                      <span className="rounded bg-muted px-1.5 text-[11px] tabular-nums text-muted-foreground">{items.length}</span>
                    </header>
                    <div className="space-y-2 p-2">
                      {items.length === 0 && <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">Clear</p>}
                      {items.map((r) => (
                        <article key={r.id} className="rounded-md border border-border bg-background p-2.5">
                          <p className="font-mono text-[10px] text-muted-foreground">{r.order_number}</p>
                          <p className="mt-0.5 truncate text-[13px] font-medium">{r.product_name}</p>
                          <p className="text-[11px] text-muted-foreground">×{r.quantity ?? 1} · {nameOf(byId, r.assignee_id)}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                            {r.priority === "urgent" && <Pill tone="risk">Urgent</Pill>}
                          </div>
                          <select
                            value={r.status ?? "queued"}
                            onChange={(e) => patch(r.id, { status: e.target.value })}
                            className="mt-2 w-full rounded border border-border bg-card px-1.5 py-1 text-[11px]"
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                          </select>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="mt-5" title="Needs a date" hint="Orders on the books with nowhere to sit" pad={false}>
            {unscheduled.length === 0 ? <Empty>Every order is scheduled.</Empty> : (
              <div className="divide-y divide-border">
                {unscheduled.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                    <span className="text-sm"><span className="font-mono text-xs text-muted-foreground">{r.order_number}</span> · {r.product_name}</span>
                    <input
                      type="date"
                      onChange={(e) => patch(r.id, { due_date: e.target.value })}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {creating && (
        <RecordDialog
          title="New work order"
          fields={fields}
          initial={{ status: "queued", priority: "normal", quantity: 1 }}
          people={people}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, quantity: Number(v.quantity || 1) }); setCreating(false); }}
        />
      )}
    </WorkPage>
  );
}
