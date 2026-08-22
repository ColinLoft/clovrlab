import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BellRing, Check, CircleCheck, Plus, Radio, Siren, Ticket as TicketIcon, Trash2, Users, Volume2,
} from "lucide-react";
import {
  WorkPage, Card, Btn, Pill, Empty, Loading, Stat, StatRow, Select, Modal, usePeople, dt,
} from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";
import { PushSettingsCard } from "@/components/hq/PushSettingsCard";
import { playSiren, stopSound } from "@/lib/hq/sounds";
import {
  ackPage, addRotationMember, addTicketNote, createTicket, deleteRotation, fetchPages,
  fetchRotationMembers, fetchRotations, fetchTicketNotes, fetchTickets, raisePage,
  removeRotationMember, resolvePage, saveRotation, saveTicket,
  QUEUE_KINDS, QUEUE_LABEL, TICKET_STATUSES,
  type PageAlert, type PageQueue, type PageTicket, type Rotation, type RotationMember, type TicketNote,
} from "@/lib/hq/paging";

type Tab = "live" | "tickets" | "history" | "roster";

export function PagingConsole({ queue, lede }: { queue: PageQueue; lede: string }) {
  const [tab, setTab] = useState<Tab>("live");
  const [pages, setPages] = useState<PageAlert[]>([]);
  const [tickets, setTickets] = useState<PageTicket[]>([]);
  const [notes, setNotes] = useState<TicketNote[]>([]);
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [members, setMembers] = useState<RotationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [compose, setCompose] = useState(false);
  const [tick, setTick] = useState(0);
  const people = usePeople();

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, t, r, m] = await Promise.all([
        fetchPages(undefined, 80, queue).catch(() => [] as PageAlert[]),
        fetchTickets(queue).catch(() => [] as PageTicket[]),
        fetchRotations(queue).catch(() => [] as Rotation[]),
        fetchRotationMembers().catch(() => [] as RotationMember[]),
      ]);
      if (!alive) return;
      setPages(p); setTickets(t); setRotations(r); setMembers(m); setLoading(false);
      fetchTicketNotes(t.map((x) => x.id)).then((n) => alive && setNotes(n)).catch(() => {});
    })();
    return () => { alive = false; };
  }, [tick, queue]);

  const reload = useCallback(() => setTick((v) => v + 1), []);
  const live = useMemo(() => pages.filter((p) => p.status !== "resolved"), [pages]);
  const open = live.filter((p) => p.status === "open");
  const openTickets = tickets.filter((t) => t.status !== "closed");

  return (
    <WorkPage
      wide
      eyebrow={`${QUEUE_LABEL[queue]} · Alerting`}
      title={queue === "ops" ? "Mission paging & on-call" : "Systems paging & on-call"}
      lede={lede}
      actions={
        <>
          <Btn onClick={reload}>Refresh</Btn>
          <Btn onClick={() => { playSiren(); setTimeout(() => stopSound("siren"), 3200); }}>
            <Volume2 className="h-3.5 w-3.5" /> Test alarm
          </Btn>
          <Btn variant="primary" onClick={() => setCompose(true)}><Siren className="h-3.5 w-3.5" /> Send a page</Btn>
        </>
      }
    >
      <StatRow>
        <Stat label="Unacknowledged" value={open.length} icon={BellRing} tone={open.length ? "risk" : "good"} />
        <Stat label="Acknowledged, open" value={live.length - open.length} tone="warn" />
        <Stat label="Open tickets" value={openTickets.length} icon={TicketIcon} tone={openTickets.length ? "warn" : "good"} />
        <Stat label="Rotations" value={rotations.filter((r) => r.active).length} icon={Radio} />
        <Stat label="People on call" value={new Set(members.filter((m) => rotations.some((r) => r.id === m.rotation_id)).map((m) => m.user_id)).size} icon={Users} />
      </StatRow>

      <div className="mt-5 flex flex-wrap gap-1.5 border-b border-border pb-2">
        {([["live", "Live pages"], ["tickets", "Tickets"], ["history", "History"], ["roster", "On-call roster"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
            {label}
            {k === "live" && live.length ? ` (${live.length})` : ""}
            {k === "tickets" && openTickets.length ? ` (${openTickets.length})` : ""}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : (
        <div className="mt-4">
          {tab === "live" && <PageList rows={live} reload={reload} empty="All quiet — nothing is paging right now." />}
          {tab === "history" && <PageList rows={pages.filter((p) => p.status === "resolved")} reload={reload} empty="No resolved pages yet." />}
          {tab === "tickets" && (
            <Tickets queue={queue} tickets={tickets} notes={notes} people={people.people} reload={reload} />
          )}
          {tab === "roster" && (
            <div className="space-y-4">
              <PushSettingsCard queue={queue} />
              <Roster queue={queue} rotations={rotations} members={members} people={people.people} reload={reload} />
            </div>
          )}
        </div>
      )}

      {compose && <Compose queue={queue} onClose={() => setCompose(false)} onSent={() => { setCompose(false); reload(); }} />}
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

function Tickets({ queue, tickets, notes, people, reload }: {
  queue: PageQueue; tickets: PageTicket[]; notes: TicketNote[];
  people: ReturnType<typeof usePeople>["people"]; reload: () => void;
}) {
  const [filter, setFilter] = useState<string>("active");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const rows = tickets.filter((t) => (filter === "active" ? t.status !== "closed" : filter === "all" ? true : t.status === filter));
  const current = tickets.find((t) => t.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select className="w-52" value={filter} onChange={setFilter}
          options={[{ value: "active", label: "Active tickets" }, { value: "all", label: "All tickets" },
            ...TICKET_STATUSES.map((s) => ({ value: s.value, label: s.label }))]} />
        <Btn className="ml-auto" variant="primary" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> New ticket
        </Btn>
      </div>

      <Card pad={false} title={`Tickets (${rows.length})`} hint="Every page opens one automatically">
        <div className="divide-y divide-border">
          {rows.length === 0 && <Empty>No tickets in this view.</Empty>}
          {rows.map((t) => {
            const owner = people.find((p: any) => p.id === t.assignee_id);
            return (
              <button key={t.id} onClick={() => setOpenId(t.id)}
                className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-accent/40">
                <span className="font-mono text-[11px] text-muted-foreground">{t.ref}</span>
                <Pill tone={t.status === "open" ? "risk" : t.status === "investigating" ? "warn" : t.status === "mitigated" ? "muted" : "good"}>
                  {t.status}
                </Pill>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</span>
                <span className="text-xs text-muted-foreground">
                  {owner ? (owner.full_name || owner.email) : "Unassigned"}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">{dt(t.opened_at)}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {current && (
        <TicketDetail ticket={current} notes={notes.filter((n) => n.ticket_id === current.id)}
          people={people} onClose={() => setOpenId(null)} reload={reload} />
      )}
      {creating && <NewTicket queue={queue} onClose={() => setCreating(false)} onDone={() => { setCreating(false); reload(); }} />}
    </div>
  );
}

function TicketDetail({ ticket, notes, people, onClose, reload }: {
  ticket: PageTicket; notes: TicketNote[]; people: ReturnType<typeof usePeople>["people"];
  onClose: () => void; reload: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const save = async (patch: Partial<PageTicket>) => {
    setBusy(true);
    try { await saveTicket({ id: ticket.id, ...patch }); reload(); }
    catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  const postNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try { await addTicketNote(ticket.id, note.trim()); setNote(""); reload(); }
    catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Modal title={`${ticket.ref} — ${ticket.title}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Status</span>
            <Select className="w-full" value={ticket.status} onChange={(v) => save({ status: v as any })}
              options={TICKET_STATUSES.map((s) => ({ value: s.value, label: s.label }))} />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block text-muted-foreground">Owner</span>
            <Select className="w-full" value={ticket.assignee_id ?? ""} onChange={(v) => save({ assignee_id: v || null })}
              options={[{ value: "", label: "Unassigned" },
                ...people.map((p: any) => ({ value: p.id, label: p.full_name || p.email || p.id }))]} />
          </label>
        </div>

        {ticket.summary && (
          <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">{ticket.summary}</p>
        )}

        {([["impact", "Impact"], ["root_cause", "Root cause"], ["resolution", "Resolution / follow-up"]] as const).map(([field, label]) => (
          <label key={field} className="block text-xs">
            <span className="mb-1 block text-muted-foreground">{label}</span>
            <textarea rows={2} defaultValue={(ticket as any)[field] ?? ""} disabled={busy}
              onBlur={(e) => e.target.value !== ((ticket as any)[field] ?? "") && save({ [field]: e.target.value } as any)}
              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
          </label>
        ))}

        <div className="border-t border-border pt-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Timeline</p>
          <div className="space-y-2">
            {notes.length === 0 && <p className="text-xs text-muted-foreground">No updates yet.</p>}
            {notes.map((n) => (
              <div key={n.id} className="rounded-md border border-border p-2 text-xs">
                <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                  {n.author_id && <UserMention userId={n.author_id} name="teammate" size="xs" />}
                  <span className="ml-auto font-mono">{dt(n.created_at)}</span>
                </div>
                <p>{n.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an update…"
              onKeyDown={(e) => e.key === "Enter" && postNote()}
              className="flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm" />
            <Btn variant="primary" disabled={busy || !note.trim()} onClick={postNote}>Post</Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function NewTicket({ queue, onClose, onDone }: { queue: PageQueue; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [kind, setKind] = useState(QUEUE_KINDS[queue][0]!.value);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try { await createTicket({ queue, title: title.trim(), summary: summary.trim() || undefined, kind }); onDone(); }
    catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Modal title="New ticket" onClose={onClose}
      footer={<Btn variant="primary" disabled={busy || !title.trim()} onClick={submit}>Create ticket</Btn>}>
      <div className="space-y-3">
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Category</span>
          <Select className="w-full" value={kind} onChange={setKind} options={QUEUE_KINDS[queue]} />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Summary</span>
          <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
        </label>
      </div>
    </Modal>
  );
}

function Roster({ queue, rotations, members, people, reload }: {
  queue: PageQueue; rotations: Rotation[]; members: RotationMember[];
  people: ReturnType<typeof usePeople>["people"]; reload: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const list = people;

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try { await fn(); reload(); } catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Btn variant="primary" disabled={busy}
          onClick={() => run(() => saveRotation({ name: `${QUEUE_LABEL[queue]} rotation`, queue, kinds: [], escalation_minutes: 5, max_level: 3, active: true }))}>
          <Plus className="h-3.5 w-3.5" /> Add rotation
        </Btn>
      </div>

      {rotations.length === 0 && <Empty>No rotations for this queue yet — add one and assign tiers.</Empty>}

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

            <div className="mt-3">
              <span className="mb-1 block text-xs text-muted-foreground">Page types this rotation answers</span>
              <div className="flex flex-wrap gap-1.5">
                {QUEUE_KINDS[queue].map((k) => {
                  const on = r.kinds?.includes(k.value);
                  return (
                    <button key={k.value} disabled={busy}
                      onClick={() => run(() => saveRotation({
                        id: r.id,
                        kinds: on ? r.kinds.filter((x) => x !== k.value) : [...(r.kinds ?? []), k.value],
                      }))}
                      className={`rounded-full border px-2.5 py-1 text-[11px] transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"}`}>
                      {k.label}
                    </button>
                  );
                })}
              </div>
              {(!r.kinds || r.kinds.length === 0) && (
                <p className="mt-1 text-[11px] text-muted-foreground">No types selected — this rotation catches everything in {QUEUE_LABEL[queue]}.</p>
              )}
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

function Compose({ queue, onClose, onSent }: { queue: PageQueue; onClose: () => void; onSent: () => void }) {
  const [kind, setKind] = useState(QUEUE_KINDS[queue][0]!.value);
  const [severity, setSeverity] = useState("critical");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      await raisePage({
        kind, queue, title: title.trim(), body: body.trim() || undefined, severity: severity as any,
        link: queue === "systems" ? "/systems/paging" : "/ops/paging",
      });
      onSent();
    } catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Modal title={`Page ${QUEUE_LABEL[queue]} on-call`} onClose={onClose}
      footer={<Btn variant="primary" onClick={send} disabled={busy || !title.trim()}><Siren className="h-3.5 w-3.5" /> {busy ? "Paging…" : "Page on-call"}</Btn>}>
      <div className="space-y-3">
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Kind</span>
          <Select value={kind} onChange={setKind} options={QUEUE_KINDS[queue]} className="w-full" />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Severity</span>
          <Select value={severity} onChange={setSeverity} className="w-full"
            options={[{ value: "critical", label: "Critical — wake them up" }, { value: "high", label: "High" }, { value: "info", label: "Informational" }]} />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Headline</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={queue === "systems" ? "Auth service returning 500s" : "Ground station offline at Placer base"}
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block text-muted-foreground">Details</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm" />
        </label>
        <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
          A tracking ticket is opened automatically for every page.
        </p>
      </div>
    </Modal>
  );
}
