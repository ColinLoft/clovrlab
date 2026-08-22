import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BellRing, Check, CircleCheck, Plus, Radio, Siren, Trash2, Users } from "lucide-react";
import {
  WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Select, Modal, usePeople, dt,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";
import {
  ackPage, addRotationMember, deleteRotation, fetchPages, fetchRotationMembers, fetchRotations,
  raisePage, removeRotationMember, resolvePage, saveRotation, PAGE_KINDS,
  type PageAlert, type Rotation, type RotationMember,
} from "@/lib/hq/paging";

export const Route = createFileRoute("/_hq/ops/paging")({
  head: () => ({
    meta: [
      { title: "Paging & On-Call — Clovr Labs" },
      { name: "description", content: "Urgent paging console: live pages, acknowledgement, escalation tiers and the on-call roster for operators and enterprise systems." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagingPage,
});

function PagingPage() {
  const [tab, setTab] = useState<"live" | "history" | "roster">("live");
  const [pages, setPages] = useState<PageAlert[]>([]);
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [members, setMembers] = useState<RotationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [compose, setCompose] = useState(false);
  const [tick, setTick] = useState(0);
  const people = usePeople();

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, r, m] = await Promise.all([
        fetchPages(undefined, 80).catch(() => [] as PageAlert[]),
        fetchRotations().catch(() => [] as Rotation[]),
        fetchRotationMembers().catch(() => [] as RotationMember[]),
      ]);
      if (!alive) return;
      setPages(p); setRotations(r); setMembers(m); setLoading(false);
    })();
    return () => { alive = false; };
  }, [tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const live = useMemo(() => pages.filter((p) => p.status !== "resolved"), [pages]);
  const open = live.filter((p) => p.status === "open");

  return (
    <WorkPage
      wide
      eyebrow="Mission Operations · Alerting"
      title="Paging & on-call"
      lede="The wake-someone-up channel. Detections, fleet failures and system outages page whoever is on call, and keep escalating until a human acknowledges."
      actions={
        <>
          <Btn onClick={reload}>Refresh</Btn>
          <Btn variant="primary" onClick={() => setCompose(true)}><Siren className="h-3.5 w-3.5" /> Send a page</Btn>
        </>
      }
    >
      <StatRow>
        <Stat label="Unacknowledged" value={open.length} icon={BellRing} tone={open.length ? "risk" : "good"} />
        <Stat label="Acknowledged, open" value={live.length - open.length} tone="warn" />
        <Stat label="Rotations" value={rotations.filter((r) => r.active).length} icon={Radio} />
        <Stat label="People on call" value={new Set(members.map((m) => m.user_id)).size} icon={Users} />
      </StatRow>

      <div className="mt-5 flex flex-wrap gap-1.5 border-b border-border pb-2">
        {([["live", "Live pages"], ["history", "History"], ["roster", "On-call roster"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
            {label}{k === "live" && live.length ? ` (${live.length})` : ""}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : (
        <div className="mt-4">
          {tab === "live" && <PageList rows={live} reload={reload} empty="All quiet — nothing is paging right now." />}
          {tab === "history" && <PageList rows={pages.filter((p) => p.status === "resolved")} reload={reload} empty="No resolved pages yet." />}
          {tab === "roster" && (
            <Roster rotations={rotations} members={members} people={people} reload={reload} />
          )}
        </div>
      )}

      {compose && <Compose onClose={() => setCompose(false)} onSent={() => { setCompose(false); reload(); }} />}
    </WorkPage>
  );
}

function PageList({ rows, reload, empty }: { rows: PageAlert[]; reload: () => void; empty: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const act = async (id: string, fn: (id: string) => Promise<void>) => {
    setBusy(id);
    try { await fn(id); reload(); } catch (e) { alert((e as Error).message); } finally { setBusy(null); }
  };

  return (
    <Card pad={false} title={`Pages (${rows.length})`} hint="Newest first">
      <div className="divide-y divide-border">
        {rows.length === 0 && <Empty>{empty}</Empty>}
        {rows.map((p) => (
          <div key={p.id} className="flex flex-wrap items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={p.status === "open" ? "risk" : p.status === "acked" ? "warn" : "good"}>{p.status}</Pill>
                <Pill tone="muted">{p.kind}</Pill>
                <span className="text-xs text-muted-foreground">Level {p.level}</span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">{dt(p.created_at)}</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold">{p.title}</p>
              {p.body && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{p.body}</p>}
              {p.acked_by && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Acknowledged {dt(p.acked_at)} by <UserMention userId={p.acked_by} name="teammate" size="xs" />
                </p>
              )}
            </div>
            <div className="flex flex-none flex-wrap gap-1.5">
              {p.link && <Btn variant="ghost" onClick={() => { window.location.href = p.link!; }}>Open</Btn>}
              {p.status === "open" && (
                <Btn disabled={busy === p.id} onClick={() => act(p.id, ackPage)}><Check className="h-3.5 w-3.5" /> Ack</Btn>
              )}
              {p.status !== "resolved" && (
                <Btn variant="primary" disabled={busy === p.id} onClick={() => act(p.id, resolvePage)}>
                  <CircleCheck className="h-3.5 w-3.5" /> Resolve
                </Btn>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Roster({ rotations, members, people, reload }: {
  rotations: Rotation[]; members: RotationMember[]; people: ReturnType<typeof usePeople>; reload: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const list = Array.isArray(people) ? people : ((people as any)?.people ?? []);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try { await fn(); reload(); } catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Btn variant="primary" disabled={busy}
          onClick={() => run(() => saveRotation({ name: "New rotation", kinds: [], escalation_minutes: 5, max_level: 3, active: true }))}>
          <Plus className="h-3.5 w-3.5" /> Add rotation
        </Btn>
      </div>

      {rotations.length === 0 && <Empty>No rotations yet — add one and assign tiers.</Empty>}

      {rotations.map((r) => {
        const mine = members.filter((m) => m.rotation_id === r.id);
        return (
          <Card key={r.id} title={r.name} hint={`Escalates every ${r.escalation_minutes} min, up to tier ${r.max_level}`}
            action={
              <Btn variant="ghost" disabled={busy} onClick={() => run(() => deleteRotation(r.id))}>
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </Btn>
            }>
            <div className="grid gap-3 sm:grid-cols-4">
              <label className="text-xs">
                <span className="mb-1 block text-muted-foreground">Name</span>
                <input defaultValue={r.name} onBlur={(e) => e.target.value !== r.name && run(() => saveRotation({ id: r.id, name: e.target.value }))}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-sm" />
              </label>
              <label className="text-xs">
                <span className="mb-1 block text-muted-foreground">Escalate after (min)</span>
                <input type="number" min={1} defaultValue={r.escalation_minutes}
                  onBlur={(e) => run(() => saveRotation({ id: r.id, escalation_minutes: Number(e.target.value) || 5 }))}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-sm tabular-nums" />
              </label>
              <label className="text-xs">
                <span className="mb-1 block text-muted-foreground">Max tier</span>
                <input type="number" min={1} max={5} defaultValue={r.max_level}
                  onBlur={(e) => run(() => saveRotation({ id: r.id, max_level: Number(e.target.value) || 3 }))}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-sm tabular-nums" />
              </label>
              <div className="text-xs">
                <span className="mb-1 block text-muted-foreground">Active</span>
                <Btn onClick={() => run(() => saveRotation({ id: r.id, active: !r.active }))}>{r.active ? "On" : "Off"}</Btn>
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t border-border pt-3">
              {[1, 2, 3].filter((t) => t <= r.max_level).map((tier) => {
                const tierMembers = mine.filter((m) => m.tier === tier);
                return (
                  <div key={tier} className="flex flex-wrap items-center gap-2">
                    <span className="w-16 text-xs font-semibold text-muted-foreground">Tier {tier}</span>
                    {tierMembers.length === 0 && <span className="text-xs text-muted-foreground">Nobody assigned</span>}
                    {tierMembers.map((m) => {
                      const person = list.find((p: any) => p.id === m.user_id);
                      return (
                        <span key={m.id} className="flex items-center gap-1">
                          <UserMention userId={m.user_id} name={person?.full_name || person?.email || "Teammate"} size="xs" />
                          <button onClick={() => run(() => removeRotationMember(m.id))}
                            className="text-xs text-muted-foreground hover:text-destructive">×</button>
                        </span>
                      );
                    })}
                    <Select
                      className="ml-auto w-56"
                      value=""
                      onChange={(v) => v && run(() => addRotationMember(r.id, v, tier))}
                      options={[{ value: "", label: `Add to tier ${tier}…` },
                        ...list.map((p: any) => ({ value: p.id, label: p.full_name || p.email || p.id }))]}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Compose({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [kind, setKind] = useState("manual");
  const [severity, setSeverity] = useState("critical");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await raisePage({ kind, title: title.trim(), body: body.trim() || undefined, severity: severity as any, link: "/ops/paging" });
      onSent();
    } catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Modal title="Send a page" onClose={onClose}
      footer={<Btn variant="primary" onClick={send} disabled={busy || !title.trim()}><Siren className="h-3.5 w-3.5" /> {busy ? "Paging…" : "Page on-call"}</Btn>}>
      <div className="space-y-3">
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Kind</span>
          <Select value={kind} onChange={setKind} options={PAGE_KINDS} className="w-full" />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Severity</span>
          <Select value={severity} onChange={setSeverity} className="w-full"
            options={[{ value: "critical", label: "Critical — wake them up" }, { value: "high", label: "High" }, { value: "info", label: "Informational" }]} />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Headline</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ground station offline at Placer base"
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Details</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
        </label>
      </div>
    </Modal>
  );
}
