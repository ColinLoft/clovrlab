import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, Star, FileText } from "lucide-react";
import {
  useRows, usePeople, WorkPage, Card, Empty, Loading, NewButton, RecordDialog, Toolbar,
  titleCase, dt, nameOf, Btn, type Field,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/eng/library")({
  head: () => ({ meta: [{ title: "Engineering Library — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: LibraryPage,
});

const CATEGORIES = ["spec", "analysis", "test_report", "procedure", "decision", "reference"];

const fields = (projects: any[]): Field[] => [
  { key: "title", label: "Title", type: "text", required: true, full: true, placeholder: "Battery thermal runaway test report" },
  { key: "category", label: "Category", type: "select", options: CATEGORIES.map((c) => ({ value: c, label: titleCase(c) })) },
  { key: "project_id", label: "Program", type: "select", options: projects.map((p) => ({ value: p.id, label: p.name })) },
  { key: "author_id", label: "Author", type: "user" },
  { key: "starred", label: "Pin to top", type: "bool" },
  { key: "content", label: "Document", type: "textarea", full: true, placeholder: "Findings, method, conclusions…" },
];

function LibraryPage() {
  const { rows, loading, insert, patch, remove } = useRows<any>("eng_docs", { order: { column: "updated_at", ascending: false } });
  const { rows: projects } = useRows<any>("eng_projects", { select: "id, name" });
  const { people, byId } = usePeople();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const projectName = (id?: string | null) => projects.find((p) => p.id === id)?.name ?? "Unassigned program";

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows
      .filter((r) => cat === "all" || r.category === cat)
      .filter((r) => !term || `${r.title} ${r.content ?? ""}`.toLowerCase().includes(term))
      .sort((a, b) => Number(!!b.starred) - Number(!!a.starred));
  }, [rows, q, cat]);

  const open = shown.find((r) => r.id === openId) ?? shown[0] ?? null;

  return (
    <WorkPage
      wide
      eyebrow="Engineering"
      title="Engineering library"
      lede="Specs, analyses and test reports the team writes as it builds. Pin the documents everyone keeps reaching for."
      actions={<NewButton label="New document" onClick={() => setCreating(true)} />}
    >
      <Toolbar q={q} setQ={setQ} placeholder="Search titles and contents…">
        <div className="flex flex-wrap gap-1.5">
          {["all", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                cat === c ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? "All" : titleCase(c)}
            </button>
          ))}
        </div>
      </Toolbar>

      {loading ? <Loading /> : (
        <div className="mt-4 grid gap-4 lg:grid-cols-[340px_1fr]">
          <Card pad={false} title={`${shown.length} document${shown.length === 1 ? "" : "s"}`}>
            <div className="max-h-[640px] divide-y divide-border overflow-y-auto">
              {shown.length === 0 && <Empty>Nothing matches.</Empty>}
              {shown.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setOpenId(r.id)}
                  className={`flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-muted ${open?.id === r.id ? "bg-primary/5" : ""}`}
                >
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{r.title}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {titleCase(r.category)} · {projectName(r.project_id)}
                    </span>
                  </span>
                  {r.starred && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                </button>
              ))}
            </div>
          </Card>

          <Card pad={false}>
            {!open ? (
              <Empty>Write the first document — it becomes the team&apos;s shared memory.</Empty>
            ) : (
              <article>
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {titleCase(open.category)} · {projectName(open.project_id)}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{open.title}</h2>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {nameOf(byId, open.author_id)} · updated {dt(open.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Btn onClick={() => patch(open.id, { starred: !open.starred })}>
                      <Star className={`h-3.5 w-3.5 ${open.starred ? "fill-amber-400 text-amber-400" : ""}`} />
                      {open.starred ? "Pinned" : "Pin"}
                    </Btn>
                    <Btn variant="danger" onClick={() => { remove(open.id); setOpenId(null); }}>Delete</Btn>
                  </div>
                </header>
                <div className="px-5 py-5">
                  {open.content ? (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">{open.content}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">This document is empty.</p>
                  )}
                </div>
              </article>
            )}
          </Card>
        </div>
      )}

      {creating && (
        <RecordDialog
          title="New engineering document"
          fields={fields(projects)}
          initial={{ category: "spec" }}
          people={people}
          onCancel={() => setCreating(false)}
          onSave={async (v) => { const row = await insert(v); setCreating(false); if (row) setOpenId(row.id); }}
        />
      )}
      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <BookOpen className="h-3 w-3" /> Documents are visible to everyone in the Engineering workspace.
      </p>
    </WorkPage>
  );
}
