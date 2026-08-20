import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Binary, GitBranch } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, Pill, statusTone, dt,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";

function Firmware() {
  const projects = useRows<any>("eng_projects", { order: { column: "name", ascending: true } });
  const repos = useRows<any>("eng_firmware_repos", { order: { column: "name", ascending: true } });
  const { people, byId } = usePeople();
  const [open, setOpen] = useState(false);

  const fields: Field[] = useMemo(() => [
    { key: "name", label: "Repository", type: "text", required: true },
    { key: "project_id", label: "Program", type: "select", options: projects.rows.map((p) => ({ value: p.id, label: p.name })) },
    { key: "language", label: "Language", type: "text", placeholder: "C++, Rust, Python" },
    { key: "status", label: "Status", type: "select", options: ["active", "in_review", "frozen", "archived"].map((v) => ({ value: v, label: v })) },
    { key: "latest_version", label: "Latest version", type: "text", placeholder: "v1.4.2" },
    { key: "owner_id", label: "Maintainer", type: "user" },
    { key: "repo_url", label: "Repository URL", type: "text", full: true },
    { key: "description", label: "What it does", type: "textarea", full: true },
  ], [projects.rows]);

  const frozen = repos.rows.filter((r) => r.status === "frozen");

  return (
    <WorkPage
      eyebrow="Engineering"
      title="Firmware & autonomy"
      lede="Flight software, detection models, and ground tooling — what version is flying and who maintains it."
      actions={<NewButton label="Register repo" onClick={() => setOpen(true)} />}
      wide
    >
      <StatRow>
        <Stat label="Repositories" value={repos.rows.length} icon={Binary} />
        <Stat label="Active" value={repos.rows.filter((r) => r.status === "active").length} tone="good" icon={GitBranch} />
        <Stat label="Frozen for flight" value={frozen.length} tone="warn" hint="No changes without an ECO" />
        <Stat label="Unmaintained" value={repos.rows.filter((r) => !r.owner_id).length} tone={repos.rows.some((r) => !r.owner_id) ? "risk" : "good"} />
      </StatRow>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {repos.loading ? <Loading /> : repos.rows.length === 0 ? <Empty>No repositories registered.</Empty> : repos.rows.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.language || "—"} · {r.latest_version || "unversioned"}</p>
              </div>
              <Pill tone={statusTone(r.status)}>{r.status || "active"}</Pill>
            </div>
            {r.description && <p className="mt-3 text-sm text-muted-foreground">{r.description}</p>}
            <p className="mt-3 text-xs text-muted-foreground">Maintainer: {nameOf(byId, r.owner_id)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Updated {dt(r.updated_at ?? r.created_at)}</p>
            {r.repo_url && (
              <a href={r.repo_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
                Open repository
              </a>
            )}
          </Card>
        ))}
      </div>

      {open && (
        <RecordDialog title="Register repository" fields={fields} people={people} initial={{ status: "active" }}
          onCancel={() => setOpen(false)} onSave={async (v) => { await repos.insert(v); setOpen(false); }} />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/eng/firmware")({
  head: () => ({ meta: [{ title: "Firmware & autonomy — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Firmware,
});
