import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Megaphone, Eye, CheckCheck } from "lucide-react";
import {
  WorkPage, StatRow, Stat, Card, Loading, Empty, dt, pct, Bar, db,
  RecordDialog, NewButton, useRows, usePeople, nameOf, type Field,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";

const fields: Field[] = [
  { key: "title", label: "Headline", type: "text", required: true, full: true },
  { key: "body", label: "Message", type: "textarea", required: true, full: true },
  { key: "published_at", label: "Publish at", type: "datetime" },
];

/** Leadership's broadcast channel — with read-through so nothing is assumed. */
function Announcements() {
  const { rows, loading, insert, remove } = useRows<any>("announcements", { order: { column: "published_at" } });
  const { byId } = usePeople();
  const [acks, setAcks] = useState<Record<string, { viewed: number; acked: number }>>({});
  const [headcount, setHeadcount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: a }, { count }] = await Promise.all([
        db.from("announcement_acks").select("announcement_id, viewed_at, acknowledged_at").limit(2000),
        db.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      const m: Record<string, { viewed: number; acked: number }> = {};
      for (const r of (a ?? []) as any[]) {
        const e = (m[r.announcement_id] ??= { viewed: 0, acked: 0 });
        if (r.viewed_at) e.viewed++;
        if (r.acknowledged_at) e.acked++;
      }
      setAcks(m);
      setHeadcount(count ?? 0);
    })();
  }, [rows.length]);

  const totalAcked = Object.values(acks).reduce((s, v) => s + v.acked, 0);
  const totalViewed = Object.values(acks).reduce((s, v) => s + v.viewed, 0);

  return (
    <WorkPage
      eyebrow="Leadership"
      title="Company announcements"
      lede="Everything leadership has broadcast org-wide, and how much of the company actually read and acknowledged it."
      actions={<NewButton label="New announcement" onClick={() => setOpen(true)} />}
    >
      <StatRow cols={4}>
        <Stat label="Announcements" value={rows.length} icon={Megaphone} />
        <Stat label="Total reads" value={totalViewed} icon={Eye} />
        <Stat label="Acknowledgements" value={totalAcked} icon={CheckCheck} tone="good" />
        <Stat label="Headcount reached" value={headcount} hint="Profiles in the org" />
      </StatRow>

      <div className="mt-5 space-y-4">
        {loading && <Card><Loading /></Card>}
        {!loading && rows.length === 0 && <Card><Empty>Nothing has been announced yet.</Empty></Card>}
        {rows.map((r: any) => {
          const a = acks[r.id] ?? { viewed: 0, acked: 0 };
          return (
            <article key={r.id} className="rounded-lg border border-border bg-card">
              <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
                <h2 className="min-w-0 flex-1 text-sm font-semibold">{r.title}</h2>
                <span className="text-xs text-muted-foreground">{dt(r.published_at ?? r.created_at)}</span>
                {r.author_id && <UserMention userId={r.author_id} name={nameOf(byId, r.author_id)} size="xs" />}
                <button onClick={() => remove(r.id)} className="text-[11px] text-muted-foreground hover:text-destructive">delete</button>
              </header>
              <div className="px-4 py-3">
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{r.body}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Read</span><span className="tabular-nums">{a.viewed}/{headcount} · {pct(a.viewed, headcount || 1)}%</span>
                    </div>
                    <div className="mt-1"><Bar value={a.viewed} max={headcount || 1} /></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Acknowledged</span><span className="tabular-nums">{a.acked}/{headcount} · {pct(a.acked, headcount || 1)}%</span>
                    </div>
                    <div className="mt-1"><Bar value={a.acked} max={headcount || 1} tone="good" /></div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {open && (
        <RecordDialog
          title="Publish an announcement" fields={fields} initial={{ published_at: new Date().toISOString().slice(0, 16) }}
          onCancel={() => setOpen(false)}
          onSave={async (v) => {
            const { data: u } = await (await import("@/integrations/supabase/client")).supabase.auth.getUser();
            await insert({ ...v, author_id: u.user?.id ?? null });
            setOpen(false);
          }}
        />
      )}
    </WorkPage>
  );
}

export const Route = createFileRoute("/_hq/exec/announcements")({
  head: () => ({ meta: [{ title: "Announcements — Clovr HQ" }, { name: "robots", content: "noindex" }] }),
  component: Announcements,
});
