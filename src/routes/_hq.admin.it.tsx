import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, AppWindow, ArrowUpRight, Bot, Database, LockKeyhole, Server, ShieldCheck, Slack } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRouteAccess } from "@/lib/hq/route-access";

export const Route = createFileRoute("/_hq/admin/it")({
  head: () => ({ meta: [
    { title: "Enterprise Systems — Clovr HQ" },
    { name: "description", content: "Internal applications, integrations, Slack, service health, and security operations." },
    { name: "robots", content: "noindex" },
  ] }),
  component: ITConsole,
});

type Counts = { apps: number; integrations: number; infrastructure: number; security: number };

function ITConsole() {
  const access = useRouteAccess();
  const [counts, setCounts] = useState<Counts>({ apps: 0, integrations: 0, infrastructure: 0, security: 0 });
  const [events, setEvents] = useState<any[]>([]);
  const db = supabase as any;

  useEffect(() => {
    if (!access.isAdmin) return;
    Promise.all([
      db.from("org_apps").select("id", { count: "exact", head: true }).eq("enabled", true),
      db.from("dev_integrations").select("id", { count: "exact", head: true }),
      db.from("dev_infrastructure").select("id", { count: "exact", head: true }),
      db.from("dev_security_logs").select("id", { count: "exact", head: true }).in("severity", ["high", "critical"]),
      db.from("dev_security_logs").select("id,event_type,severity,description,created_at").order("created_at", { ascending: false }).limit(8),
    ]).then(([apps, integrations, infrastructure, security, recent]) => {
      setCounts({ apps: apps.count ?? 0, integrations: integrations.count ?? 0, infrastructure: infrastructure.count ?? 0, security: security.count ?? 0 });
      setEvents(recent.data ?? []);
    });
  }, [access.isAdmin]);

  if (access.loading) return <div className="p-8 text-sm text-muted-foreground">Checking systems access…</div>;
  if (!access.isAdmin) return <div className="p-8 text-sm text-muted-foreground">Enterprise Systems is restricted to administrators.</div>;

  const cards = [
    { label: "Live applications", value: counts.apps, icon: AppWindow, to: "/admin/apps", text: "Workspace identity, navigation, availability, and launch routes." },
    { label: "Integrations", value: counts.integrations, icon: Activity, to: "/admin/apps", text: "External services, ownership, connection state, and configuration." },
    { label: "Infrastructure", value: counts.infrastructure, icon: Server, to: "/admin/company", text: "Internal systems, environments, service ownership, and health." },
    { label: "Security alerts", value: counts.security, icon: ShieldCheck, to: "/admin/org", text: "High-priority access, policy, and system events." },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-7">
      <header className="border-b border-border pb-7">
        <p className="text-xs font-semibold uppercase text-primary">Enterprise Systems</p>
        <h1 className="mt-2 text-3xl font-semibold">IT operations console</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Manage internal products, identity and access, connected services, Slack tooling, and platform health from one control surface.</p>
      </header>

      <section className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <Link key={card.label} to={card.to as never} className="group border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md">
          <div className="flex items-start justify-between"><card.icon className="h-5 w-5 text-primary" /><span className="text-2xl font-semibold">{card.value}</span></div>
          <h2 className="mt-6 text-sm font-semibold">{card.label}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{card.text}</p>
        </Link>)}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="border border-border bg-card">
          <div className="border-b border-border px-5 py-4"><h2 className="text-sm font-semibold">Recent security and systems events</h2></div>
          <div className="divide-y divide-border">
            {events.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No recent events.</p>}
            {events.map((event) => <div key={event.id} className="flex gap-3 px-5 py-3.5"><LockKeyhole className="mt-0.5 h-4 w-4 text-primary" /><div className="min-w-0"><p className="truncate text-sm font-medium">{event.event_type ?? "System event"}</p><p className="line-clamp-2 text-xs text-muted-foreground">{event.severity ?? "info"} · {event.description ?? "No description"}</p></div></div>)}
          </div>
        </div>
        <aside className="space-y-3">
          <Link to="/admin/health" className="block border border-border bg-card p-5 hover:border-primary/50"><Activity className="h-5 w-5 text-primary" /><h2 className="mt-5 text-sm font-semibold">Service health</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Live uptime, database latency, integration status, and recent application errors.</p><span className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">Open board <ArrowUpRight className="h-3.5 w-3.5" /></span></Link>
          <Link to="/admin/slack" className="block border border-border bg-card p-5 hover:border-primary/50"><Slack className="h-5 w-5 text-primary" /><h2 className="mt-5 text-sm font-semibold">Slack administration</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Create channels, invite members, and monitor bot activity.</p><span className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">Configure <ArrowUpRight className="h-3.5 w-3.5" /></span></Link>
          <Link to="/admin/org" className="block border border-border bg-card p-5 hover:border-primary/50"><LockKeyhole className="h-5 w-5 text-primary" /><h2 className="mt-5 text-sm font-semibold">Identity & access</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Teams, roles, page access, exceptions, and administrative oversight.</p></Link>
          <Link to="/admin/company" className="block border border-border bg-card p-5 hover:border-primary/50"><Database className="h-5 w-5 text-primary" /><h2 className="mt-5 text-sm font-semibold">Organization settings</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Shared company configuration and internal service defaults.</p></Link>
        </aside>

      </section>
    </main>
  );
}