import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layers, Target } from "lucide-react";
import {
  useRows, WorkPage, Card, Pill, Empty, Loading, Stat, StatRow, Bar, NewButton, RecordDialog,
  statusTone, titleCase, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/product/portfolio")({
  head: () => ({ meta: [{ title: "Feature Portfolio — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: PortfolioPage,
});

const PRIORITIES = ["p0", "p1", "p2", "p3"];
const STAGES = ["discovery", "defined", "building", "validating", "shipped"];

const fields = (releases: any[]): Field[] => [
  { key: "title", label: "Feature", type: "text", required: true, full: true },
  { key: "area", label: "Area", type: "text", placeholder: "Detection, Autonomy, Ground station…" },
  { key: "owner_team", label: "Owning team", type: "select", options: ["product", "eng", "ops", "mfg", "systems"].map((v) => ({ value: v, label: titleCase(v) })) },
  { key: "stage", label: "Stage", type: "select", options: STAGES.map((v) => ({ value: v, label: titleCase(v) })) },
  { key: "priority", label: "Priority", type: "select", options: PRIORITIES.map((v) => ({ value: v, label: v.toUpperCase() })) },
  { key: "release_id", label: "Release", type: "select", options: releases.map((r) => ({ value: r.id, label: `${r.version} — ${r.name}` })) },
  { key: "progress", label: "Progress %", type: "number" },
  { key: "problem", label: "Problem it solves", type: "textarea", full: true },
  { key: "success_metric", label: "How we know it worked", type: "textarea", full: true },
];

function PortfolioPage() {
  const { rows, loading, insert, patch } = useRows<any>("prod_features", { order: { column: "updated_at", ascending: false } });
  const { rows: releases } = useRows<any>("prod_releases", { select: "id, version, name" });
  const [creating, setCreating] = useState(false);
  const [focus, setFocus] = useState<any | null>(null);

  const matrix = useMemo(() => {
    const areas = [...new Set(rows.map((r) => r.area || "Unassigned"))].sort();
    return areas.map((area) => ({
      area,
      cells: PRIORITIES.map((p) => rows.filter((r) => (r.area || "Unassigned") === area && (r.priority || "p2") === p)),
    }));
  }, [rows]);

  const shipped = rows.filter((r) => r.stage === "shipped").length;
  const avg = rows.length ? Math.round(rows.reduce((n, r) => n + Number(r.progress || 0), 0) / rows.length) : 0;
  const p0 = rows.filter((r) => (r.priority || "") === "p0" && r.stage !== "shipped").length;

  return (
    <WorkPage
      wide
      eyebrow="Product & Program"
      title="Feature portfolio"
      lede="Every committed feature laid out by product area and priority, so trade-offs are argued with the whole board in view."
      actions={<NewButton label="Add feature" onClick={() => setCreating(true)} />}
    >
      <StatRow cols={4}>
        <Stat label="Features tracked" value={rows.length} icon={Layers} />
        <Stat label="Open P0s" value={p0} tone={p0 ? "risk" : "good"} icon={Target} />
        <Stat label="Shipped" value={shipped} tone="good" />
        <Stat label="Average progress" value={`${avg}%`} />
      </StatRow>

      {loading ? <Loading /> : rows.length === 0 ? (
        <Card className="mt-5"><Empty>No features yet. Add the first commitment to build the board.</Empty></Card>
      ) : (
        <Card className="mt-5" pad={false} title="Area × priority" hint="Click a card to inspect the bet">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-[180px_repeat(4,1fr)] border-b border-border bg-muted/30">
                <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Area</div>
                {PRIORITIES.map((p) => (
                  <div key={p} className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {p.toUpperCase()}
                  </div>
                ))}
              </div>
              {matrix.map((row) => (
                <div key={row.area} className="grid grid-cols-[180px_repeat(4,1fr)] border-b border-border last:border-0">
                  <div className="border-r border-border px-4 py-3 text-sm font-medium">{row.area}</div>
                  {row.cells.map((cell, i) => (
                    <div key={i} className="space-y-2 border-r border-border p-2 last:border-0">
                      {cell.length === 0 && <span className="block px-2 py-3 text-[11px] text-muted-foreground">—</span>}
                      {cell.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFocus(f)}
                          className="w-full rounded-md border border-border bg-card p-2.5 text-left transition hover:border-primary/40 hover:shadow-sm"
                        >
                          <p className="truncate text-[13px] font-medium">{f.title}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <Pill tone={statusTone(f.stage)}>{titleCase(f.stage)}</Pill>
                            <span className="text-[10px] tabular-nums text-muted-foreground">{Number(f.progress || 0)}%</span>
                          </div>
                          <div className="mt-1.5"><Bar value={Number(f.progress || 0)} /></div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {focus && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6" onClick={() => setFocus(null)}>
          <div className="w-full max-w-xl rounded-t-xl border border-border bg-card p-5 shadow-2xl sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {focus.area || "Unassigned"} · {(focus.priority || "p2").toUpperCase()}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{focus.title}</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Problem</p>
                <p className="mt-1 text-muted-foreground">{focus.problem || "Not written down yet."}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Success metric</p>
                <p className="mt-1 text-muted-foreground">{focus.success_metric || "Not defined."}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Stage</span>
                <select
                  value={focus.stage ?? "discovery"}
                  onChange={(e) => { patch(focus.id, { stage: e.target.value }); setFocus({ ...focus, stage: e.target.value }); }}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                >
                  {STAGES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => setFocus(null)} className="mt-5 w-full rounded-md border border-border py-2 text-sm hover:bg-muted">Close</button>
          </div>
        </div>
      )}

      {creating && (
        <RecordDialog
          title="Add feature"
          fields={fields(releases)}
          initial={{ stage: "discovery", priority: "p2", owner_team: "product", progress: 0 }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, progress: Number(v.progress || 0) }); setCreating(false); }}
        />
      )}
    </WorkPage>
  );
}
