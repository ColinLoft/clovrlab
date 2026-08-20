import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Rocket, ShieldCheck, CalendarClock, PackageCheck } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, statusTone, titleCase, Bar, d, nameOf, raiseRequest, pct, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/product/releases")({
  head: () => ({ meta: [{ title: "Release Trains — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: ReleasesPage,
});

function ReleasesPage() {
  const releases = useRows("prod_releases", { order: { column: "target_date", ascending: true } });
  const features = useRows("prod_features", { order: { column: "created_at" } });
  const { people, byId } = usePeople();
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const current: any = releases.rows.find((r: any) => r.id === selected) ?? releases.rows[0] ?? null;

  const fields: Field[] = [
    { key: "name", label: "Release name", type: "text", required: true },
    { key: "version", label: "Version", type: "text", placeholder: "v2.4.0" },
    { key: "target_date", label: "Target date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["planned", "in_progress", "in_test", "released", "held"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "owner_id", label: "Release manager", type: "user" },
    { key: "notes", label: "Release notes", type: "textarea", full: true },
  ];

  const inRelease = (features.rows as any[]).filter((f) => f.release_id === current?.id);
  const done = inRelease.filter((f) => f.status === "shipped").length;

  const requestFieldValidation = async () => {
    if (!current) return;
    const ok = await raiseRequest({
      from_team: "product", to_team: "ops", subject: `Field validation — ${current.name}`,
      details: "Please fly this build in a controlled sortie and report anything unexpected before general release.",
      entity_type: "prod_releases", entity_id: current.id, priority: "high",
    });
    if (ok) alert("Mission Operations asked to validate in the field.");
  };

  return (
    <WorkPage
      wide eyebrow="Product · Delivery"
      title="Release trains"
      lede="Every build that reaches an aircraft or an operator console leaves from here, with a named release manager and a field validation flight behind it."
      actions={<NewButton label="Plan release" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="Planned" value={(releases.rows as any[]).filter((r) => r.status === "planned").length} icon={CalendarClock} />
        <Stat label="In test" value={(releases.rows as any[]).filter((r) => r.status === "in_test").length} icon={ShieldCheck} tone="warn" />
        <Stat label="Released" value={(releases.rows as any[]).filter((r) => r.status === "released").length} icon={PackageCheck} tone="good" />
        <Stat label="Held" value={(releases.rows as any[]).filter((r) => r.status === "held").length} icon={Rocket} tone="risk" />
      </StatRow>

      {releases.loading ? <Loading /> : (
        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(260px,340px)_1fr]">
          <Card pad={false} title="Releases">
            <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {releases.rows.length === 0 && <Empty>No releases planned.</Empty>}
              {(releases.rows as any[]).map((r) => (
                <button key={r.id} onClick={() => setSelected(r.id)}
                  className={`w-full px-4 py-3 text-left transition hover:bg-accent ${current?.id === r.id ? "bg-accent" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{r.name}</span>
                    <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{r.version || "—"} · {d(r.target_date)}</p>
                </button>
              ))}
            </div>
          </Card>

          {current ? (
            <div className="space-y-4">
              <Card title={current.name}
                hint={`${current.version || "unversioned"} · manager ${nameOf(byId, current.owner_id)} · target ${d(current.target_date)}`}
                action={<div className="flex gap-2">
                  <Btn onClick={requestFieldValidation}>Request field validation</Btn>
                  <Btn variant="primary" onClick={() => releases.patch(current.id, { status: "released" })}>Mark released</Btn>
                </div>}>
                {current.notes && <p className="whitespace-pre-wrap text-sm text-muted-foreground">{current.notes}</p>}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Scope complete</span><span>{done}/{inRelease.length}</span>
                  </div>
                  <div className="mt-1"><Bar value={pct(done, inRelease.length)} tone="good" /></div>
                </div>
              </Card>

              <Card title="Scope in this release" pad={false}>
                <div className="divide-y divide-border">
                  {inRelease.length === 0 && <Empty>No features assigned to this release yet.</Empty>}
                  {inRelease.map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm">{f.title}</p>
                        <p className="text-[11px] text-muted-foreground">{nameOf(byId, f.owner_id)}</p>
                      </div>
                      <Pill tone={statusTone(f.status)}>{titleCase(f.status)}</Pill>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : <Card><Empty>Plan a release to begin.</Empty></Card>}
        </div>
      )}

      {creating && (
        <RecordDialog title="Plan a release" fields={fields} people={people} initial={{ status: "planned" }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await releases.insert(v); setCreating(false); }} />
      )}
    </WorkPage>
  );
}
