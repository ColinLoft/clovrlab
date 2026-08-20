import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wrench, Boxes } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, money, Select,
  RecordDialog, NewButton, useRows, usePeople, nameOf, raiseRequest, Btn, type Field,
} from "@/components/hq/work/kit";

function Hardware() {
  const projects = useRows<any>("eng_projects", { order: { column: "name", ascending: true } });
  const parts = useRows<any>("eng_cad_parts", { order: { column: "part_number", ascending: true } });
  const bom = useRows<any>("eng_bom_items", { order: { column: "part_number", ascending: true } });
  const { people, byId } = usePeople();
  const [project, setProject] = useState("all");
  const [open, setOpen] = useState<null | "part" | "bom">(null);

  const projectOptions = useMemo(
    () => [{ value: "all", label: "All programs" }, ...projects.rows.map((p) => ({ value: p.id, label: p.name }))],
    [projects.rows],
  );
  const inScope = <T extends { project_id?: string }>(rows: T[]) => project === "all" ? rows : rows.filter((r) => r.project_id === project);

  const partFields: Field[] = useMemo(() => [
    { key: "part_number", label: "Part number", type: "text", required: true },
    { key: "name", label: "Name", type: "text", required: true },
    { key: "project_id", label: "Program", type: "select", options: projects.rows.map((p) => ({ value: p.id, label: p.name })) },
    { key: "revision", label: "Revision", type: "text", placeholder: "A" },
    { key: "assembly", label: "Assembly", type: "text" },
    { key: "status", label: "Status", type: "select", options: ["draft", "in_review", "released", "obsolete"].map((v) => ({ value: v, label: v })) },
    { key: "owner_id", label: "Owner", type: "user" },
    { key: "file_url", label: "CAD file link", type: "text", full: true },
    { key: "description", label: "Description", type: "textarea", full: true },
  ], [projects.rows]);

  const bomFields: Field[] = useMemo(() => [
    { key: "part_number", label: "Part number", type: "text", required: true },
    { key: "name", label: "Name", type: "text", required: true },
    { key: "project_id", label: "Program", type: "select", options: projects.rows.map((p) => ({ value: p.id, label: p.name })) },
    { key: "quantity", label: "Qty per unit", type: "number" },
    { key: "unit_cost", label: "Unit cost", type: "number" },
    { key: "supplier", label: "Supplier", type: "text" },
    { key: "risk_level", label: "Supply risk", type: "select", options: ["low", "medium", "high"].map((v) => ({ value: v, label: v })) },
    { key: "notes", label: "Notes", type: "textarea", full: true },
  ], [projects.rows]);

  const scopedBom = inScope(bom.rows);
  const unitCost = scopedBom.reduce((s, r) => s + Number(r.quantity || 1) * Number(r.unit_cost || 0), 0);
  const risky = scopedBom.filter((r) => r.risk_level === "high");

  return (
    <WorkPage
      eyebrow="Engineering"
      title="Hardware & BOM"
      lede="Released CAD, revision state, and the bill of materials behind each airframe — including where supply is fragile."
      actions={<>
        <NewButton label="New part" onClick={() => setOpen("part")} />
        <NewButton label="BOM line" onClick={() => setOpen("bom")} />
      </>}
      wide
    >
      <StatRow>
        <Stat label="CAD parts" value={inScope(parts.rows).length} icon={Wrench} />
        <Stat label="Released" value={inScope(parts.rows).filter((p) => p.status === "released").length} tone="good" />
        <Stat label="Cost per unit" value={money(unitCost)} icon={Boxes} />
        <Stat label="High supply risk" value={risky.length} tone={risky.length ? "risk" : "good"} />
      </StatRow>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Select value={project} onChange={setProject} options={projectOptions} />
        <Btn onClick={async () => {
          const subject = prompt("What should Manufacturing be told about this BOM?");
          if (subject && await raiseRequest({ from_team: "Engineering", to_team: "Manufacturing", subject, priority: "normal", entity_type: "bom" })) {
            alert("Manufacturing notified.");
          }
        }}>Hand off to Manufacturing</Btn>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="CAD parts" hint="Revision-controlled geometry" pad={false}>
          {parts.loading ? <Loading /> : inScope(parts.rows).length === 0 ? <Empty>No parts released yet.</Empty> : (
            <ul className="divide-y divide-border">
              {inScope(parts.rows).map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <Pill tone={statusTone(p.status)}>{p.status || "draft"}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{p.part_number} rev {p.revision || "—"}</p>
                    <p className="text-xs text-muted-foreground">{p.name}{p.assembly ? ` · ${p.assembly}` : ""}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{nameOf(byId, p.owner_id)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Bill of materials" hint="Cost and supply risk per line" pad={false}>
          {bom.loading ? <Loading /> : scopedBom.length === 0 ? <Empty>No BOM lines yet.</Empty> : (
            <ul className="divide-y divide-border">
              {scopedBom.map((b) => (
                <li key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{b.part_number} — {b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.supplier || "No supplier"} · qty {b.quantity ?? 1}</p>
                  </div>
                  {b.risk_level && <Pill tone={b.risk_level === "high" ? "risk" : b.risk_level === "medium" ? "warn" : "good"}>{b.risk_level} risk</Pill>}
                  <span className="tabular-nums text-sm">{money(Number(b.quantity || 1) * Number(b.unit_cost || 0))}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {open === "part" && (
        <RecordDialog title="New CAD part" fields={partFields} people={people} initial={{ status: "draft", revision: "A" }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await parts.insert(v); setOpen(null); }} />
      )}
      {open === "bom" && (
        <RecordDialog title="New BOM line" fields={bomFields} initial={{ quantity: 1, risk_level: "low" }}
          onCancel={() => setOpen(null)} onSave={async (v) => { await bom.insert(v); setOpen(null); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/eng/hardware")({
  head: () => ({ meta: [{ title: "Hardware & BOM — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Hardware,
});
