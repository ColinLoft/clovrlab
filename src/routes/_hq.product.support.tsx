import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeBuoy, Smile, MessageSquare } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, Toolbar, Select, Bar, dt, statusTone, pct,
  useRows, usePeople, nameOf,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

/** Product's read on operator support: what breaks in the field and how it feels. */
function ProductSupport() {
  const { rows, loading } = useRows<any>("cs_tickets", { order: { column: "created_at" } });
  const csat = useRows<any>("cs_csat_responses", { order: { column: "created_at" } });
  const { byId } = usePeople();
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("all");

  const open = rows.filter((r: any) => !["closed", "resolved"].includes((r.status ?? "").toLowerCase()));
  const filtered = rows.filter((r: any) =>
    (priority === "all" || (r.priority ?? "").toLowerCase() === priority) &&
    `${r.subject} ${r.ticket_number ?? ""} ${r.customer_name ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  const scores = csat.rows.map((c: any) => Number(c.score)).filter((n) => !Number.isNaN(n) && n > 0);
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "—";

  const byTheme = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      for (const t of (r.tags ?? ["untagged"]) as string[]) m.set(t, (m.get(t) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [rows]);

  const maxTheme = byTheme[0]?.[1] ?? 1;

  return (
    <WorkPage
      eyebrow="Product & program"
      title="Operator support signal"
      lede="Support traffic read as product evidence — which themes recur, how satisfied operators are, and what should become roadmap work."
      wide
    >
      <StatRow cols={4}>
        <Stat label="Open tickets" value={open.length} icon={LifeBuoy} tone={open.length > 10 ? "warn" : "default"} />
        <Stat label="All time" value={rows.length} icon={MessageSquare} />
        <Stat label="Avg satisfaction" value={avg} hint={`${scores.length} responses`} icon={Smile} tone={Number(avg) >= 4 ? "good" : "warn"} />
        <Stat label="Resolved share" value={`${pct(rows.length - open.length, rows.length || 1)}%`} tone="good" />
      </StatRow>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1fr_320px]">
        <div>
          <Toolbar q={q} setQ={setQ} placeholder="Search tickets, operators…">
            <Select
              value={priority} onChange={setPriority}
              options={[{ value: "all", label: "Any priority" }, ...["low", "medium", "high", "urgent"].map((v) => ({ value: v, label: v }))]}
            />
          </Toolbar>
          <Card className="mt-3" pad={false}>
            {loading ? <Loading /> : filtered.length === 0 ? <Empty>No support traffic yet.</Empty> : (
              <ul className="divide-y divide-border">
                {filtered.map((r: any) => (
                  <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="w-20 shrink-0 font-mono text-[11px] text-muted-foreground">{r.ticket_number ?? "—"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{r.subject}</span>
                      <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        {r.customer_name ?? "Internal"} · {dt(r.created_at)}
                        {r.assignee_id && <UserMention userId={r.assignee_id} name={nameOf(byId, r.assignee_id)} size="xs" />}
                      </span>
                    </span>
                    <Pill tone={statusTone(r.priority)}>{r.priority ?? "medium"}</Pill>
                    <Pill tone={statusTone(r.status)}>{r.status ?? "new"}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Recurring themes" hint="Tag frequency across all tickets">
            {byTheme.length === 0 ? <Empty>No tagged tickets.</Empty> : (
              <ul className="space-y-3">
                {byTheme.map(([tag, n]) => (
                  <li key={tag}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize">{tag}</span>
                      <span className="tabular-nums text-muted-foreground">{n}</span>
                    </div>
                    <div className="mt-1"><Bar value={n} max={maxTheme} /></div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Latest verbatims" pad={false}>
            <ul className="divide-y divide-border">
              {csat.rows.slice(0, 6).filter((c: any) => c.comment).length === 0 && <Empty>No comments yet.</Empty>}
              {csat.rows.filter((c: any) => c.comment).slice(0, 6).map((c: any) => (
                <li key={c.id} className="px-4 py-3">
                  <p className="text-sm leading-snug">“{c.comment}”</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{c.customer_name ?? "Operator"} · score {c.score ?? "—"}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/product/support")({
  head: () => ({ meta: [{ title: "Operator support signal — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: ProductSupport,
});
