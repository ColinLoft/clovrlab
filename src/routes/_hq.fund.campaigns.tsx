import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Coins, HeartHandshake, Repeat } from "lucide-react";
import {
  useRows, WorkPage, Card, Empty, Loading, Stat, StatRow, Bar, money, titleCase, d,
} from "@/components/hq/work/kit";

export const Route = createFileRoute("/_hq/fund/campaigns")({
  head: () => ({ meta: [{ title: "Campaign Performance — Clovr Labs" }, { name: "robots", content: "noindex" }] }),
  component: CampaignsPage,
});

/** Giving rolled up the way fundraisers actually think: by campaign, by month, by who gave twice. */
function CampaignsPage() {
  const { rows, loading } = useRows<any>("fund_donations", { order: { column: "received_on", ascending: false } });
  const { rows: donors } = useRows<any>("fund_donors", { select: "id, name, tier" });

  const total = rows.reduce((n, r) => n + Number(r.amount || 0), 0);

  const campaigns = useMemo(() => {
    const map = new Map<string, { name: string; amount: number; gifts: number; donors: Set<string> }>();
    for (const r of rows) {
      const key = r.campaign || "Unattributed";
      const c = map.get(key) ?? { name: key, amount: 0, gifts: 0, donors: new Set<string>() };
      c.amount += Number(r.amount || 0);
      c.gifts += 1;
      if (r.donor_id) c.donors.add(r.donor_id);
      map.set(key, c);
    }
    return [...map.values()].sort((a, b) => b.amount - a.amount);
  }, [rows]);

  const months = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      if (!r.received_on) continue;
      const key = String(r.received_on).slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + Number(r.amount || 0));
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
  }, [rows]);

  const repeat = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) if (r.donor_id) counts.set(r.donor_id, (counts.get(r.donor_id) ?? 0) + 1);
    return [...counts.values()].filter((n) => n > 1).length;
  }, [rows]);

  const restricted = rows.filter((r) => r.restriction && r.restriction !== "unrestricted");
  const restrictedTotal = restricted.reduce((n, r) => n + Number(r.amount || 0), 0);
  const maxMonth = Math.max(1, ...months.map(([, v]) => v));
  const donorName = (id?: string | null) => donors.find((x) => x.id === id)?.name ?? "Anonymous";

  return (
    <WorkPage
      wide
      eyebrow="Funding & Partners"
      title="Campaign performance"
      lede="Where the money came from, which appeals earned it, and how much of it is already spoken for."
    >
      <StatRow cols={4}>
        <Stat label="Total raised" value={money(total)} icon={Coins} tone="good" />
        <Stat label="Gifts recorded" value={rows.length} icon={HeartHandshake} />
        <Stat label="Repeat donors" value={repeat} icon={Repeat} />
        <Stat label="Restricted" value={money(restrictedTotal)} hint={`${rows.length ? Math.round((restrictedTotal / (total || 1)) * 100) : 0}% of giving`} tone={restrictedTotal > total * 0.6 ? "warn" : "default"} />
      </StatRow>

      {loading ? <Loading /> : rows.length === 0 ? (
        <Card className="mt-5"><Empty>No gifts logged yet. Record giving in the Gift Ledger and it rolls up here.</Empty></Card>
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <Card title="By campaign" hint="Sorted by dollars raised">
            <div className="space-y-4">
              {campaigns.map((c) => (
                <div key={c.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{titleCase(c.name)}</span>
                    <span className="tabular-nums">{money(c.amount)}</span>
                  </div>
                  <div className="mt-1"><Bar value={c.amount} max={campaigns[0].amount} /></div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {c.gifts} gift{c.gifts === 1 ? "" : "s"} · {c.donors.size} donor{c.donors.size === 1 ? "" : "s"} ·
                    {" "}avg {money(Math.round(c.amount / c.gifts))}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Last twelve months" hint="Monthly totals">
            {months.length === 0 ? <Empty>No dated gifts.</Empty> : (
              <div className="flex h-52 items-end gap-2">
                {months.map(([m, v]) => (
                  <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-[10px] tabular-nums text-muted-foreground">{Math.round(v / 1000)}k</span>
                    <div
                      className="w-full rounded-t bg-primary/70 transition-all"
                      style={{ height: `${Math.max(4, (v / maxMonth) * 100)}%` }}
                      title={`${m}: ${money(v)}`}
                    />
                    <span className="text-[10px] text-muted-foreground">{m.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="xl:col-span-2" pad={false} title="Recent gifts">
            <div className="max-h-80 divide-y divide-border overflow-y-auto">
              {rows.slice(0, 40).map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
                  <span className="min-w-[180px] flex-1 truncate font-medium">{donorName(r.donor_id)}</span>
                  <span className="text-xs text-muted-foreground">{titleCase(r.campaign) } · {titleCase(r.method)}</span>
                  <span className="text-xs text-muted-foreground">{d(r.received_on)}</span>
                  <span className="tabular-nums font-semibold">{money(Number(r.amount || 0))}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </WorkPage>
  );
}
