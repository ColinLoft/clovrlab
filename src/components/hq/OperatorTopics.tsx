import { useEffect, useState } from "react";
import { KeyRound, RefreshCw, Trash2, BellOff, BellRing } from "lucide-react";
import { Card, Btn, Pill, Empty, Select, dt, usePeople } from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";
import {
  adminDeleteTopic, adminIssueTopic, adminSetRevoked, listOperatorTopics, type OperatorTopic,
} from "@/lib/hq/push";

/**
 * Admin control of every operator's ntfy topic: issue, rotate, revoke and see
 * when a page was last pushed to them and last acknowledged.
 */
export function OperatorTopics() {
  const { people } = usePeople();
  const [rows, setRows] = useState<OperatorTopic[]>([]);
  const [pick, setPick] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(true);

  const load = () =>
    listOperatorTopics()
      .then((r) => { setRows(r); setAllowed(true); })
      .catch(() => setAllowed(false));

  useEffect(() => { load(); }, []);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true); setErr(null);
    try { await fn(); await load(); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  if (!allowed) return null;

  const named = (id: string) => people.find((p: any) => p.id === id);
  const candidates = people.filter((p: any) => !rows.some((r) => r.user_id === p.id));

  return (
    <Card
      title="Operator push topics"
      hint="Admin — issue, rotate or revoke the private ntfy topic each operator subscribes to"
      action={<Pill tone={rows.filter((r) => !r.revoked).length ? "good" : "warn"}>{rows.filter((r) => !r.revoked).length} active</Pill>}
    >
      {err && <p className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}

      <div className="mb-3 flex flex-wrap items-end gap-2">
        <label className="min-w-[220px] flex-1 text-xs">
          <span className="mb-1 block text-muted-foreground">Issue a topic for</span>
          <Select className="w-full" value={pick} onChange={setPick}
            options={[{ value: "", label: "Select an operator…" },
              ...candidates.map((p: any) => ({ value: p.id, label: p.full_name || p.email || p.id }))]} />
        </label>
        <Btn variant="primary" disabled={!pick || busy} onClick={() => run(async () => { await adminIssueTopic(pick); setPick(""); })}>
          <KeyRound className="h-3.5 w-3.5" /> Issue topic
        </Btn>
      </div>

      <div className="divide-y divide-border rounded-md border border-border">
        {rows.length === 0 && <Empty>No operator has push set up yet.</Empty>}
        {rows.map((r) => {
          const p = named(r.user_id);
          return (
            <div key={r.user_id} className="flex flex-wrap items-center gap-3 px-3 py-2.5 text-xs">
              <div className="min-w-[160px]">
                <UserMention userId={r.user_id} name={(p as any)?.full_name || (p as any)?.email || "operator"} size="xs" />
              </div>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">{r.topic}</code>
              <Pill tone={r.revoked ? "risk" : "good"}>{r.revoked ? "revoked" : "active"}</Pill>
              <span className="text-muted-foreground">Last sent {r.last_sent_at ? dt(r.last_sent_at) : "—"}</span>
              <span className="text-muted-foreground">Last ack {r.last_ack_at ? dt(r.last_ack_at) : "—"}</span>
              <div className="ml-auto flex gap-1.5">
                <Btn disabled={busy} onClick={() => run(() => adminIssueTopic(r.user_id))}>
                  <RefreshCw className="h-3.5 w-3.5" /> Rotate
                </Btn>
                <Btn disabled={busy} onClick={() => run(() => adminSetRevoked(r.user_id, !r.revoked))}>
                  {r.revoked ? <><BellRing className="h-3.5 w-3.5" /> Restore</> : <><BellOff className="h-3.5 w-3.5" /> Revoke</>}
                </Btn>
                <Btn variant="ghost" disabled={busy} onClick={() => run(() => adminDeleteTopic(r.user_id))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
