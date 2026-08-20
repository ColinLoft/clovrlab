import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Map as MapIcon, Sparkles, Layers, Users } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Kanban, NewButton,
  RecordDialog, statusTone, titleCase, Toolbar, Select, nameOf, raiseRequest, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/product/roadmap")({
  head: () => ({ meta: [{ title: "Product Roadmap — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: RoadmapPage,
});

const COLUMNS = [
  { key: "idea", label: "Considering" },
  { key: "scoped", label: "Scoped" },
  { key: "building", label: "Building" },
  { key: "testing", label: "In test" },
  { key: "shipped", label: "Shipped" },
];

function RoadmapPage() {
  const { rows, loading, insert, patch } = useRows("prod_features", { order: { column: "created_at" } });
  const releases = useRows("prod_releases", { order: { column: "target_date", ascending: true } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [horizon, setHorizon] = useState("all");
  const [creating, setCreating] = useState(false);

  const fields: Field[] = [
    { key: "title", label: "Feature", type: "text", required: true, full: true },
    { key: "problem", label: "Problem it solves", type: "textarea", full: true },
    { key: "horizon", label: "Horizon", type: "select", options: ["now", "next", "later"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "release_id", label: "Target release", type: "select", options: releases.rows.map((r: any) => ({ value: r.id, label: r.name })) },
    { key: "owner_id", label: "Product owner", type: "user" },
    { key: "impact", label: "Expected impact", type: "text" },
  ];

  const filtered = useMemo(() => (rows as any[]).filter((r) =>
    (!q || `${r.title} ${r.problem ?? ""}`.toLowerCase().includes(q.toLowerCase())) &&
    (horizon === "all" || r.horizon === horizon)
  ), [rows, q, horizon]);

  const shipped = (rows as any[]).filter((r) => r.status === "shipped").length;

  const sendToEng = async (r: any) => {
    const ok = await raiseRequest({
      from_team: "product", to_team: "eng", subject: `Scope for build — ${r.title}`,
      details: r.problem || "Product has scoped this feature and needs an engineering estimate.",
      entity_type: "prod_features", entity_id: r.id, priority: "normal",
    });
    if (ok) alert("Engineering notified.");
  };

  return (
    <WorkPage
      wide eyebrow="Product · Planning"
      title="Roadmap"
      lede="What we are building for the crews who fly, the analysts who read the imagery, and the agencies who act on it."
      actions={<NewButton label="Add feature" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="On the board" value={rows.length} icon={MapIcon} />
        <Stat label="Now" value={(rows as any[]).filter((r) => r.horizon === "now").length} icon={Sparkles} />
        <Stat label="In build or test" value={(rows as any[]).filter((r) => ["building", "testing"].includes(r.status)).length} icon={Layers} />
        <Stat label="Shipped" value={shipped} icon={Users} tone="good" />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search the roadmap…">
        <Select value={horizon} onChange={setHorizon} options={[{ value: "all", label: "All horizons" }, ...["now", "next", "later"].map((v) => ({ value: v, label: titleCase(v) }))]} />
      </Toolbar>

      {loading ? <Loading /> : filtered.length === 0 ? (
        <Card className="mt-4"><Empty>Nothing on the roadmap yet.</Empty></Card>
      ) : (
        <div className="overflow-x-auto pb-2">
          <Kanban
            columns={COLUMNS} rows={filtered} statusKey="status"
            onMove={(r: any, status) => patch(r.id, { status })}
            render={(r: any) => (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-tight">{r.title}</span>
                  <Pill tone={r.horizon === "now" ? "good" : "muted"}>{titleCase(r.horizon)}</Pill>
                </div>
                {r.problem && <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{r.problem}</p>}
                <p className="mt-1.5 text-[11px] text-muted-foreground">{nameOf(byId, r.owner_id)}</p>
                <span onClick={(e) => { e.stopPropagation(); sendToEng(r); }}
                  className="mt-1 inline-block cursor-pointer text-[11px] text-primary hover:underline">Send to engineering</span>
              </>
            )}
          />
        </div>
      )}

      <Card className="mt-5" title="Upcoming releases" pad={false}>
        <div className="divide-y divide-border">
          {releases.rows.length === 0 && <Empty>No releases planned.</Empty>}
          {(releases.rows as any[]).slice(0, 6).map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">{r.version} · target {r.target_date ?? "—"}</p>
              </div>
              <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
            </div>
          ))}
        </div>
      </Card>

      {creating && (
        <RecordDialog title="Add a feature" fields={fields} people={people} initial={{ horizon: "next" }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, status: "idea" }); setCreating(false); }} />
      )}
    </WorkPage>
  );
}
