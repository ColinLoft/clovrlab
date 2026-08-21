import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeartHandshake, Target, TrendingUp } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, Toolbar, money, d, statusTone, Bar,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

const STAGES = ["qualifying", "conversation", "proposal", "committed", "closed"];

const fields: Field[] = [
  { key: "title", label: "Opportunity", type: "text", required: true, full: true },
  { key: "company", label: "Organization", type: "text" },
  { key: "contact_name", label: "Main contact", type: "text" },
  { key: "contact_email", label: "Contact email", type: "text" },
  { key: "stage", label: "Stage", type: "select", options: STAGES.map((v) => ({ value: v, label: v })) },
  { key: "value", label: "Expected amount", type: "number" },
  { key: "probability", label: "Confidence %", type: "number" },
  { key: "expected_close", label: "Expected close", type: "date" },
  { key: "owner_id", label: "Relationship owner", type: "user" },
  { key: "notes", label: "Notes", type: "textarea", full: true },
];

/** Partnerships and institutional funding, staged like a relationship not a sale. */
function Pipeline() {
  const { rows, loading, insert, patch } = useRows<any>("sales_deals", { order: { column: "expected_close", ascending: true } });
  const contacts = useRows<any>("sales_contacts", { order: { column: "created_at" }, limit: 50 });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = rows.filter((r: any) => `${r.title} ${r.company ?? ""} ${r.contact_name ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const total = rows.reduce((s: number, r: any) => s + Number(r.value || 0), 0);
  const weighted = rows.reduce((s: number, r: any) => s + (Number(r.value || 0) * Number(r.probability || 0)) / 100, 0);
  const committed = rows.filter((r: any) => ["committed", "closed"].includes((r.stage ?? "").toLowerCase()));

  return (
    <WorkPage
      eyebrow="Funding & partners"
      title="Partnership pipeline"
      lede="Institutional funders and agency partners by stage — expected value, confidence, and who owns the relationship."
      actions={<NewButton label="Add opportunity" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow cols={4}>
        <Stat label="Open opportunities" value={rows.length} icon={HeartHandshake} />
        <Stat label="Pipeline value" value={money(total)} icon={Target} />
        <Stat label="Confidence-weighted" value={money(weighted)} hint="Value × probability" icon={TrendingUp} tone="good" />
        <Stat label="Committed" value={committed.length} tone="good" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search partners, organizations…" />

      <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(200px, 1fr))` }}>
        {STAGES.map((stage) => {
          const items = filtered.filter((r: any) => (r.stage ?? "qualifying").toLowerCase() === stage);
          const sum = items.reduce((s: number, r: any) => s + Number(r.value || 0), 0);
          return (
            <div key={stage} className="rounded-lg border border-border bg-muted/30">
              <header className="border-b border-border px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stage}</p>
                <p className="text-sm font-semibold tabular-nums">{money(sum)}</p>
              </header>
              <div className="space-y-2 p-2">
                {items.length === 0 && <p className="p-3 text-center text-xs text-muted-foreground">Empty</p>}
                {items.map((r: any) => (
                  <article key={r.id} className="rounded-md border border-border bg-card p-3">
                    <p className="text-sm font-medium leading-snug">{r.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{r.company ?? "—"} · {d(r.expected_close)}</p>
                    <p className="mt-1 text-sm font-semibold tabular-nums">{money(Number(r.value || 0))}</p>
                    <div className="mt-1.5"><Bar value={Number(r.probability || 0)} max={100} /></div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {r.owner_id && <UserMention userId={r.owner_id} name={nameOf(byId, r.owner_id)} size="xs" />}
                      <select
                        value={r.stage ?? "qualifying"}
                        onChange={(e) => patch(r.id, { stage: e.target.value })}
                        className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                      >
                        {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {loading && <Card className="mt-4"><Loading /></Card>}

      <Card className="mt-5" title="Relationship contacts" hint="People behind the pipeline" pad={false}>
        {contacts.rows.length === 0 ? <Empty>No contacts recorded.</Empty> : (
          <ul className="divide-y divide-border">
            {contacts.rows.slice(0, 12).map((c: any) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-sm">
                <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
                <span className="truncate text-xs text-muted-foreground">{c.company ?? c.title ?? "—"}</span>
                <span className="truncate text-xs text-muted-foreground">{c.email ?? ""}</span>
                <Pill tone={statusTone(c.status)}>{c.status ?? "new"}</Pill>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <RecordDialog
          title="New opportunity" fields={fields} people={people} initial={{ stage: "qualifying", probability: 25 }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/fund/pipeline")({
  head: () => ({ meta: [{ title: "Partnership pipeline — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Pipeline,
});
