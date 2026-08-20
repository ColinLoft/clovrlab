import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Radar, Flame, CheckCircle2, XCircle, Send } from "lucide-react";
import {
  useRows, usePeople, useMe, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, statusTone, dt, titleCase, Toolbar, raiseRequest, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/ops/detections")({
  head: () => ({ meta: [{ title: "Detections — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: DetectionsPage,
});

const SEVERITY = ["low", "moderate", "high", "extreme"];

const fields: Field[] = [
  { key: "name", label: "Detection name", type: "text", required: true, placeholder: "Ridge smoke column — sector 4" },
  { key: "source", label: "Source", type: "select", options: ["sensor", "satellite", "camera", "public_report", "partner"].map((v) => ({ value: v, label: titleCase(v) })) },
  { key: "severity", label: "Severity", type: "select", options: SEVERITY.map((v) => ({ value: v, label: titleCase(v) })) },
  { key: "confidence", label: "Model confidence (%)", type: "number" },
  { key: "region", label: "Region", type: "text" },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "notes", label: "Analyst notes", type: "textarea", full: true },
];

function DetectionsPage() {
  const { rows, loading, insert, patch } = useRows("ops_detections", { order: { column: "detected_at" } });
  const { people, byId } = usePeople();
  const me = useMe();
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () => rows.filter((r: any) => !q || `${r.name} ${r.region} ${r.source}`.toLowerCase().includes(q.toLowerCase())),
    [rows, q],
  );
  const current: any = filtered.find((r: any) => r.id === selected) ?? filtered[0] ?? null;

  const confirm = (row: any) => patch(row.id, { status: "confirmed", confirmed_at: new Date().toISOString(), confirmed_by: me });
  const dismiss = (row: any) => patch(row.id, { status: "dismissed" });

  const escalate = async (row: any) => {
    const ok = await raiseRequest({
      from_team: "ops", to_team: "exec", subject: `Authorize response — ${row.name}`,
      details: `Confirmed detection in ${row.region || "unmapped region"} at ${row.latitude ?? "?"}, ${row.longitude ?? "?"}. Requesting mission authorization.`,
      entity_type: "ops_detections", entity_id: row.id, priority: row.severity === "extreme" ? "urgent" : "high",
    });
    if (ok) { await patch(row.id, { status: "escalated" }); alert("Escalated to leadership for mission authorization."); }
  };

  const counts = {
    unconfirmed: rows.filter((r: any) => r.status === "unconfirmed").length,
    confirmed: rows.filter((r: any) => r.status === "confirmed").length,
    escalated: rows.filter((r: any) => r.status === "escalated").length,
    dismissed: rows.filter((r: any) => r.status === "dismissed").length,
  };

  return (
    <WorkPage
      wide eyebrow="Mission Operations · Triage"
      title="Detection triage"
      lede="Every sensor hit is reviewed by a human before anything flies. Confirm, dismiss, or escalate for mission authorization."
      actions={<NewButton label="Log detection" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="Awaiting review" value={counts.unconfirmed} icon={Radar} tone={counts.unconfirmed ? "warn" : "good"} />
        <Stat label="Confirmed" value={counts.confirmed} icon={Flame} tone={counts.confirmed ? "risk" : "default"} />
        <Stat label="Escalated" value={counts.escalated} icon={Send} />
        <Stat label="Dismissed" value={counts.dismissed} icon={XCircle} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search detections, regions, sources…" />

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(320px,420px)_1fr]">
          <Card pad={false} title={`Queue (${filtered.length})`}>
            <div className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {filtered.length === 0 && <Empty>Nothing in the queue.</Empty>}
              {filtered.map((r: any) => (
                <button key={r.id} onClick={() => setSelected(r.id)}
                  className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-accent ${current?.id === r.id ? "bg-accent" : ""}`}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{r.region || "unmapped"} · {dt(r.detected_at)}</p>
                  </div>
                  <Pill tone={statusTone(r.status)}>{titleCase(r.status)}</Pill>
                </button>
              ))}
            </div>
          </Card>

          {current ? (
            <Card title={current.name} hint={`${titleCase(current.source)} · ${titleCase(current.severity)} severity`}>
              <div className="grid gap-3 sm:grid-cols-3">
                <Detail label="Confidence" value={current.confidence ? `${Math.round(Number(current.confidence))}%` : "—"} />
                <Detail label="Coordinates" value={`${current.latitude ?? "—"}, ${current.longitude ?? "—"}`} />
                <Detail label="Detected" value={dt(current.detected_at)} />
                <Detail label="Region" value={current.region || "—"} />
                <Detail label="Status" value={titleCase(current.status)} />
                <Detail label="Confirmed by" value={current.confirmed_by ? (byId.get(current.confirmed_by)?.full_name ?? "Team member") : "—"} />
              </div>
              {current.notes && <p className="mt-4 whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm">{current.notes}</p>}

              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                <Btn variant="primary" onClick={() => confirm(current)}><CheckCircle2 className="h-3.5 w-3.5" /> Confirm fire</Btn>
                <Btn onClick={() => escalate(current)}><Send className="h-3.5 w-3.5" /> Escalate for authorization</Btn>
                <Btn variant="danger" onClick={() => dismiss(current)}><XCircle className="h-3.5 w-3.5" /> Dismiss</Btn>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Escalation opens a request to leadership. No aircraft launches until a named person authorizes the sortie in the flight log.
              </p>
            </Card>
          ) : <Card><Empty>Select a detection.</Empty></Card>}
        </div>
      )}

      {creating && (
        <RecordDialog
          title="Log a detection" fields={fields} people={people}
          initial={{ source: "sensor", severity: "moderate" }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, status: "unconfirmed" }); setCreating(false); }}
        />
      )}
    </WorkPage>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
