import { useEffect, useState } from "react";
import { Mail, Smartphone, Check, AlertTriangle, MinusCircle, MonitorSmartphone } from "lucide-react";
import { Card, Pill, Empty, Loading, Stat, StatRow, dt } from "@/components/hq/work/kit";
import { UserMention } from "@/components/hq/UserMention";
import { fetchDeliveries, type PageDelivery } from "@/lib/hq/paging";

const ICON = {
  ntfy: Smartphone,
  email: Mail,
  app: MonitorSmartphone,
} as const;

const TONE: Record<string, "good" | "risk" | "warn" | "muted"> = {
  sent: "good",
  acknowledged: "good",
  failed: "risk",
  skipped: "warn",
};

/** Everything the paging worker attempted: what was sent, when, and whether it stuck. */
export function DeliveryTimeline({ alertIds }: { alertIds?: Set<string> }) {
  const [rows, setRows] = useState<PageDelivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchDeliveries(200)
      .then((r) => alive && setRows(r))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const visible = alertIds ? rows.filter((r) => !r.alert_id || alertIds.has(r.alert_id)) : rows;
  const count = (f: (r: PageDelivery) => boolean) => visible.filter(f).length;

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <StatRow>
        <Stat label="Push delivered" value={count((r) => r.channel === "ntfy" && r.status === "sent")} icon={Smartphone} tone="good" />
        <Stat label="Emails delivered" value={count((r) => r.channel === "email" && r.status === "sent")} icon={Mail} />
        <Stat label="Failures" value={count((r) => r.status === "failed")} icon={AlertTriangle} tone={count((r) => r.status === "failed") ? "risk" : "good"} />
        <Stat label="Acknowledgements" value={count((r) => r.status === "acknowledged")} icon={Check} tone="good" />
      </StatRow>

      <Card pad={false} title={`Delivery activity (${visible.length})`} hint="Newest first — one row per attempt">
        <div className="max-h-[62vh] divide-y divide-border overflow-y-auto">
          {visible.length === 0 && <Empty>Nothing has been dispatched yet.</Empty>}
          {visible.map((r) => {
            const Icon = ICON[r.channel] ?? MinusCircle;
            return (
              <div key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-xs">
                <Icon className="h-3.5 w-3.5 flex-none text-muted-foreground" />
                <Pill tone={TONE[r.status] ?? "muted"}>{r.status}</Pill>
                <span className="font-medium uppercase tracking-wider text-muted-foreground">{r.channel}</span>
                {r.user_id && <UserMention userId={r.user_id} name="operator" size="xs" />}
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{r.detail ?? "—"}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{dt(r.created_at)}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
