import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScrollText, ShieldCheck, HeartPulse } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, Toolbar, Btn, d, money, titleCase,
  RecordDialog, NewButton, useRows, type Field,
} from "@/components/hq/work/kit";

const policyFields: Field[] = [
  { key: "title", label: "Policy", type: "text", required: true, full: true },
  { key: "category", label: "Category", type: "select", options: ["conduct", "safety", "security", "leave", "travel", "finance"].map((v) => ({ value: v, label: v })) },
  { key: "version", label: "Version", type: "text" },
  { key: "effective_date", label: "Effective", type: "date" },
  { key: "active", label: "In force", type: "bool" },
  { key: "content", label: "Policy text", type: "textarea", full: true },
];

const benefitFields: Field[] = [
  { key: "name", label: "Benefit", type: "text", required: true },
  { key: "provider", label: "Provider", type: "text" },
  { key: "type", label: "Type", type: "select", options: ["health", "dental", "vision", "retirement", "wellness", "other"].map((v) => ({ value: v, label: v })) },
  { key: "monthly_cost", label: "Monthly cost", type: "number" },
  { key: "employer_contribution", label: "Employer share", type: "number" },
  { key: "enrollment_deadline", label: "Enrollment closes", type: "date" },
  { key: "active", label: "Offered", type: "bool" },
  { key: "description", label: "Summary", type: "textarea", full: true },
];

/** The HR handbook: policies in force and the benefits package behind them. */
function Policies() {
  const policies = useRows<any>("hr_policies", { order: { column: "effective_date" } });
  const benefits = useRows<any>("hr_benefits", { order: { column: "name", ascending: true } });
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"policies" | "benefits">("policies");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const activePolicies = policies.rows.filter((p: any) => p.active !== false);
  const monthly = benefits.rows.filter((b: any) => b.active !== false)
    .reduce((s: number, b: any) => s + Number(b.employer_contribution || 0), 0);

  const filteredPolicies = policies.rows.filter((p: any) =>
    `${p.title} ${p.category ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <WorkPage
      eyebrow="People & administration"
      title="Handbook"
      lede="Policies in force across the company and the benefits package they sit alongside — one source everyone can point at."
      actions={<NewButton label={tab === "policies" ? "Add policy" : "Add benefit"} onClick={() => setOpen(true)} />}
    >
      <StatRow cols={3}>
        <Stat label="Policies in force" value={activePolicies.length} hint={`${policies.rows.length} total`} icon={ScrollText} />
        <Stat label="Benefits offered" value={benefits.rows.filter((b: any) => b.active !== false).length} icon={HeartPulse} />
        <Stat label="Employer contribution" value={money(monthly)} hint="Per month, all plans" icon={ShieldCheck} tone="good" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search the handbook…">
        <Btn variant={tab === "policies" ? "primary" : "default"} onClick={() => setTab("policies")}>Policies</Btn>
        <Btn variant={tab === "benefits" ? "primary" : "default"} onClick={() => setTab("benefits")}>Benefits</Btn>
      </Toolbar>

      {tab === "policies" ? (
        <Card className="mt-4" pad={false}>
          {policies.loading ? <Loading /> : filteredPolicies.length === 0 ? <Empty>No policies published.</Empty> : (
            <ul className="divide-y divide-border">
              {filteredPolicies.map((p: any) => (
                <li key={p.id}>
                  <button
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-muted/40"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {titleCase(p.category)} · v{p.version ?? "1"} · effective {d(p.effective_date)}
                      </span>
                    </span>
                    <Pill tone={p.active === false ? "muted" : "good"}>{p.active === false ? "retired" : "in force"}</Pill>
                  </button>
                  {expanded === p.id && (
                    <div className="border-t border-border bg-muted/20 px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{p.content || "No text recorded."}</p>
                      <div className="mt-3 flex gap-2">
                        <Btn onClick={() => policies.patch(p.id, { active: p.active === false })}>
                          {p.active === false ? "Reinstate" : "Retire"}
                        </Btn>
                        <Btn variant="danger" onClick={() => policies.remove(p.id)}>Delete</Btn>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {benefits.loading && <Card><Loading /></Card>}
          {!benefits.loading && benefits.rows.length === 0 && <Card><Empty>No benefits recorded.</Empty></Card>}
          {benefits.rows
            .filter((b: any) => `${b.name} ${b.provider ?? ""}`.toLowerCase().includes(q.toLowerCase()))
            .map((b: any) => (
              <Card key={b.id} title={b.name} hint={b.provider ?? undefined}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{titleCase(b.type)}</span>
                  <Pill tone={b.active === false ? "muted" : "good"}>{b.active === false ? "closed" : "offered"}</Pill>
                </div>
                <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between"><dt>Monthly cost</dt><dd className="tabular-nums">{money(Number(b.monthly_cost || 0))}</dd></div>
                  <div className="flex justify-between"><dt>Employer share</dt><dd className="tabular-nums">{money(Number(b.employer_contribution || 0))}</dd></div>
                  <div className="flex justify-between"><dt>Enrollment closes</dt><dd>{d(b.enrollment_deadline)}</dd></div>
                </dl>
                {b.description && <p className="mt-3 text-xs leading-5 text-muted-foreground">{b.description}</p>}
              </Card>
            ))}
        </div>
      )}

      {open && (
        <RecordDialog
          title={tab === "policies" ? "Publish a policy" : "Add a benefit"}
          fields={tab === "policies" ? policyFields : benefitFields}
          initial={{ active: true }}
          onCancel={() => setOpen(false)}
          onSave={async (v) => {
            await (tab === "policies" ? policies.insert(v) : benefits.insert(v));
            setOpen(false);
          }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/admin/policies")({
  head: () => ({ meta: [{ title: "Handbook — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Policies,
});
