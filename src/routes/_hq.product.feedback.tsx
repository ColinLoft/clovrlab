import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageSquareHeart, ThumbsUp, Radio, ArrowUpRight } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Stat, StatRow, Card, Pill, Empty, Loading, Btn, NewButton,
  RecordDialog, titleCase, Toolbar, Select, dt, nameOf, raiseRequest, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/product/feedback")({
  head: () => ({ meta: [{ title: "Field Feedback — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: FeedbackPage,
});

const SOURCES = ["pilot", "analyst", "agency", "internal", "partner"];

function FeedbackPage() {
  const { rows, loading, insert, patch } = useRows("prod_feedback", { order: { column: "created_at" } });
  const features = useRows("prod_features", { order: { column: "created_at" } });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [source, setSource] = useState("all");
  const [creating, setCreating] = useState(false);

  const fields: Field[] = [
    { key: "summary", label: "What did they say?", type: "text", required: true, full: true },
    { key: "detail", label: "Detail", type: "textarea", full: true },
    { key: "source", label: "Who it came from", type: "select", options: SOURCES.map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "sentiment", label: "Sentiment", type: "select", options: ["positive", "neutral", "negative"].map((v) => ({ value: v, label: titleCase(v) })) },
    { key: "submitted_by", label: "Logged by", type: "user" },
  ];

  const filtered = useMemo(() => (rows as any[]).filter((r) =>
    (!q || `${r.summary} ${r.detail ?? ""}`.toLowerCase().includes(q.toLowerCase())) &&
    (source === "all" || r.source === source)
  ), [rows, q, source]);

  const promote = async (r: any) => {
    await features.insert({ title: r.summary, problem: r.detail, horizon: "next", status: "idea" });
    await patch(r.id, { status: "promoted" });
    alert("Added to the roadmap as a candidate feature.");
  };

  const escalate = async (r: any) => {
    const ok = await raiseRequest({
      from_team: "product", to_team: "eng", subject: `Field report — ${r.summary}`,
      details: r.detail || "Operator feedback that may indicate a defect.",
      entity_type: "prod_feedback", entity_id: r.id, priority: "high",
    });
    if (ok) alert("Engineering notified.");
  };

  const negative = (rows as any[]).filter((r) => r.sentiment === "negative").length;

  return (
    <WorkPage
      wide eyebrow="Product · Voice of the field"
      title="Field feedback"
      lede="Everything pilots, analysts and agency partners tell us about the system in real use — triaged into roadmap candidates or engineering defects."
      actions={<NewButton label="Log feedback" onClick={() => setCreating(true)} />}
    >
      <StatRow>
        <Stat label="Total captured" value={rows.length} icon={MessageSquareHeart} />
        <Stat label="Positive" value={(rows as any[]).filter((r) => r.sentiment === "positive").length} icon={ThumbsUp} tone="good" />
        <Stat label="Negative" value={negative} icon={Radio} tone={negative ? "warn" : "good"} />
        <Stat label="Promoted to roadmap" value={(rows as any[]).filter((r) => r.status === "promoted").length} icon={ArrowUpRight} />
      </StatRow>

      <Toolbar q={q} setQ={setQ} placeholder="Search feedback…">
        <Select value={source} onChange={setSource} options={[{ value: "all", label: "All sources" }, ...SOURCES.map((v) => ({ value: v, label: titleCase(v) }))]} />
      </Toolbar>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {filtered.length === 0 && <Card><Empty>No feedback captured yet.</Empty></Card>}
          {filtered.map((r: any) => (
            <article key={r.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{r.summary}</p>
                <Pill tone={r.sentiment === "negative" ? "risk" : r.sentiment === "positive" ? "good" : "muted"}>
                  {titleCase(r.sentiment)}
                </Pill>
              </div>
              {r.detail && <p className="mt-1.5 text-sm text-muted-foreground">{r.detail}</p>}
              <p className="mt-2 text-[11px] text-muted-foreground">
                {titleCase(r.source)} · logged by {nameOf(byId, r.submitted_by)} · {dt(r.created_at)}
              </p>
              <div className="mt-3 flex gap-2">
                <Btn onClick={() => promote(r)}>Add to roadmap</Btn>
                <Btn onClick={() => escalate(r)}>Send to engineering</Btn>
              </div>
            </article>
          ))}
        </div>
      )}

      {creating && (
        <RecordDialog title="Log field feedback" fields={fields} people={people} initial={{ sentiment: "neutral", source: "pilot" }}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { await insert({ ...v, status: "new" }); setCreating(false); }} />
      )}
    </WorkPage>
  );
}
