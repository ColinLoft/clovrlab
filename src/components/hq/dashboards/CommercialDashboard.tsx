import { Link } from "@tanstack/react-router";
import { count, rows, useDash, DashShell, Loading, ErrorNote, Panel, Empty, RowLink, Bar, money, today } from "./kit";

const STAGES = ["prospect", "qualified", "proposal", "negotiation", "closed_won"];

async function load() {
  const [deals, contacts, proposals, invoices, expenses, contracts] = await Promise.all([
    rows("sales_deals", "id,name,stage,value,expected_close", (q: any) => q.order("expected_close", { nullsFirst: false }), 60),
    count("sales_contacts"),
    rows("con_estimates", "id,title,status,total,valid_until", (q: any) => q.in("status", ["draft", "sent", "pending"]).order("valid_until", { nullsFirst: false }), 6),
    rows("fin_invoices", "id,invoice_number,total,status,due_date", (q: any) => q.neq("status", "paid").order("due_date", { nullsFirst: false }), 8),
    rows("fin_expenses", "id,description,amount,expense_date", (q: any) => q.order("expense_date", { ascending: false }), 5),
    count("sales_contracts"),
  ]);
  const pipeline = deals.reduce((s: number, d: any) => s + Number(d.value || 0), 0);
  const won = deals.filter((d: any) => d.stage === "closed_won").reduce((s: number, d: any) => s + Number(d.value || 0), 0);
  const outstanding = invoices.reduce((s: number, i: any) => s + Number(i.total || 0), 0);
  const overdue = invoices.filter((i: any) => i.due_date && i.due_date < today());
  return { deals, contacts, proposals, invoices, expenses, contracts, pipeline, won, outstanding, overdue };
}

export function CommercialDashboard() {
  const { data, error } = useDash("commercial", load);
  return (
    <DashShell
      eyebrow="Funding & partnerships"
      title="Revenue for impact"
      summary="Funding funnel by stage, proposals in flight, collections exposure and partner relationship depth."
    >
      {error && <ErrorNote message={error} />}
      {!data && !error && <Loading />}
      {data && (
        <>
          <section className="mt-7 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Total pipeline</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">{money(data.pipeline)}</p>
              </div>
              <div className="flex gap-8 text-sm">
                <div><p className="text-xs uppercase text-muted-foreground">Committed</p><p className="mt-1 text-xl font-semibold tabular-nums">{money(data.won)}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Receivable</p><p className="mt-1 text-xl font-semibold tabular-nums">{money(data.outstanding)}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Partners</p><p className="mt-1 text-xl font-semibold tabular-nums">{data.contacts}</p></div>
                <div><p className="text-xs uppercase text-muted-foreground">Agreements</p><p className="mt-1 text-xl font-semibold tabular-nums">{data.contracts}</p></div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {STAGES.map((stage) => {
                const inStage = data.deals.filter((d: any) => (d.stage ?? "prospect") === stage);
                const value = inStage.reduce((s: number, d: any) => s + Number(d.value || 0), 0);
                return (
                  <Link key={stage} to="/pipeline" className="rounded-lg border border-border p-3 transition hover:border-primary/60">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{stage.replace("_", " ")}</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums">{money(value)}</p>
                    <p className="text-xs text-muted-foreground">{inStage.length} opportunities</p>
                    <div className="mt-2"><Bar value={value} max={Math.max(data.pipeline, 1)} /></div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-3">
            <Panel title="Proposals in flight">
              <div className="divide-y divide-border">
                {data.proposals.length === 0 && <Empty>No open proposals.</Empty>}
                {data.proposals.map((p: any) => (
                  <RowLink key={p.id} to="/proposals" title={p.title} meta={`${p.status ?? "draft"} · ${money(Number(p.total || 0))} · valid to ${p.valid_until ?? "n/a"}`} />
                ))}
              </div>
            </Panel>
            <Panel title="Collections" hint={`${data.overdue.length} overdue`}>
              <div className="divide-y divide-border">
                {data.invoices.length === 0 && <Empty>Nothing outstanding.</Empty>}
                {data.invoices.map((i: any) => (
                  <RowLink key={i.id} to="/invoices" title={i.invoice_number ?? "Invoice"} meta={`${money(Number(i.total || 0))} · due ${i.due_date ?? "n/a"}`} tone={i.due_date && i.due_date < today() ? "risk" : undefined} />
                ))}
              </div>
            </Panel>
            <Panel title="Recent spend">
              <div className="divide-y divide-border">
                {data.expenses.length === 0 && <Empty>No expenses recorded.</Empty>}
                {data.expenses.map((e: any) => (
                  <RowLink key={e.id} to="/expenses" title={e.description ?? "Expense"} meta={`${money(Number(e.amount || 0))} · ${e.expense_date ?? ""}`} />
                ))}
              </div>
            </Panel>
          </section>
        </>
      )}
    </DashShell>
  );
}
