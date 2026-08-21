import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppWindow, ShieldCheck, Layers } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, Toolbar, Select, statusTone, titleCase,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

const fields: Field[] = [
  { key: "name", label: "Application", type: "text", required: true },
  { key: "kind", label: "Kind", type: "select", options: ["saas", "internal", "library", "device"].map((v) => ({ value: v, label: v })) },
  { key: "environment", label: "Environment", type: "select", options: ["production", "staging", "internal"].map((v) => ({ value: v, label: v })) },
  { key: "version", label: "Version", type: "text" },
  { key: "status", label: "Status", type: "select", options: ["active", "review", "deprecated"].map((v) => ({ value: v, label: v })) },
  { key: "owner_id", label: "Owner", type: "user" },
  { key: "url", label: "URL", type: "text", full: true },
  { key: "description", label: "What it is used for", type: "textarea", full: true },
];

/** Everything IT is on the hook for keeping patched, licensed and owned. */
function SystemsAssets() {
  const { rows, loading, insert, patch, remove } = useRows<any>("dev_software", { order: { column: "name", ascending: true } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [env, setEnv] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = rows.filter((r: any) =>
    (env === "all" || (r.environment ?? "") === env) &&
    `${r.name} ${r.kind ?? ""} ${r.description ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  const groups = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const r of filtered) {
      const k = r.kind || "other";
      m.set(k, [...(m.get(k) ?? []), r]);
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const unowned = rows.filter((r: any) => !r.owner_id);
  const deprecated = rows.filter((r: any) => (r.status ?? "").toLowerCase() === "deprecated");

  return (
    <WorkPage
      eyebrow="Enterprise systems"
      title="Application register"
      lede="Every system the company runs on, who owns it, which environment it serves, and what should be retired."
      actions={<NewButton label="Register system" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow cols={4}>
        <Stat label="Registered systems" value={rows.length} icon={AppWindow} />
        <Stat label="Without an owner" value={unowned.length} tone={unowned.length ? "risk" : "good"} icon={ShieldCheck} />
        <Stat label="Marked deprecated" value={deprecated.length} tone={deprecated.length ? "warn" : "good"} />
        <Stat label="Categories" value={groups.length} icon={Layers} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search systems…">
        <Select
          value={env} onChange={setEnv}
          options={[{ value: "all", label: "All environments" }, ...["production", "staging", "internal"].map((v) => ({ value: v, label: v }))]}
        />
      </Toolbar>

      {loading ? <Card className="mt-4"><Loading /></Card> : groups.length === 0 ? (
        <Card className="mt-4"><Empty>Nothing registered yet.</Empty></Card>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {groups.map(([kind, items]) => (
            <Card key={kind} title={titleCase(kind)} hint={`${items.length} system${items.length === 1 ? "" : "s"}`} pad={false}>
              <ul className="divide-y divide-border">
                {items.map((r: any) => (
                  <li key={r.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.name}</span>
                      {r.version && <span className="font-mono text-[11px] text-muted-foreground">v{r.version}</span>}
                      <Pill tone={statusTone(r.status)}>{r.status ?? "active"}</Pill>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{r.environment ?? "internal"}</span>
                      {r.owner_id
                        ? <UserMention userId={r.owner_id} name={nameOf(byId, r.owner_id)} size="xs" />
                        : <span className="text-destructive">No owner</span>}
                      {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">open</a>}
                      <select
                        value={r.status ?? "active"}
                        onChange={(e) => patch(r.id, { status: e.target.value })}
                        className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                      >
                        {["active", "review", "deprecated"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => remove(r.id)} className="text-[11px] text-muted-foreground hover:text-destructive">remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <RecordDialog
          title="Register a system" fields={fields} people={people} initial={{ status: "active", kind: "saas", environment: "production" }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await insert(v); setOpen(false); }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/systems/assets")({
  head: () => ({ meta: [{ title: "Application register — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: SystemsAssets,
});
