import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowUpRight, Boxes, CheckCircle2, CircleDollarSign,
  Cpu, FileCheck2, HeartPulse, Plane, Server, ShieldCheck, TicketCheck, Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { OrgApp } from "@/lib/hq/apps";

type Metric = { label: string; value: number; icon: typeof Activity; to: string; detail: string };
type QueueItem = { id: string; title: string; meta: string; to: string; tone?: "risk" | "good" };
type DashboardData = { metrics: Metric[]; queue: QueueItem[]; secondary: QueueItem[] };

const db = supabase as any;

const APP_COPY: Record<string, { eyebrow: string; title: string; summary: string }> = {
  exec: { eyebrow: "Executive command", title: "Organizational readiness", summary: "Mission, people, fleet, funding, and systems requiring executive attention." },
  product: { eyebrow: "Product & program", title: "Program delivery", summary: "Cross-functional engineering programs, open decisions, and delivery risk." },
  eng: { eyebrow: "Engineering", title: "Build readiness", summary: "Projects, technical issues, design reviews, changes, and test readiness." },
  mfg: { eyebrow: "Manufacturing", title: "Production control", summary: "Work orders, inventory, quality inspections, suppliers, and aircraft availability." },
  ops: { eyebrow: "Mission operations", title: "Operational picture", summary: "Active incidents, deployments, safety exceptions, and response readiness." },
  systems: { eyebrow: "Enterprise systems", title: "Systems control", summary: "Applications, integrations, infrastructure, access, and security health." },
  commercial: { eyebrow: "Funding & partnerships", title: "Revenue for impact", summary: "Funding pipeline, partner activity, proposals, and financial follow-through." },
  admin: { eyebrow: "People & administration", title: "Organization health", summary: "Headcount, hiring, onboarding, attendance, training, and leave coverage." },
};

async function getDashboard(slug: string): Promise<DashboardData> {
  const count = async (table: string, filter?: (q: any) => any) => {
    let q = db.from(table).select("id", { count: "exact", head: true });
    if (filter) q = filter(q);
    const { count: n } = await q;
    return n ?? 0;
  };
  const rows = async (table: string, fields: string, limit = 6) => {
    const { data } = await db.from(table).select(fields).limit(limit);
    return data ?? [];
  };
  const queue = (items: any[], title: (x: any) => string, meta: (x: any) => string, to: string): QueueItem[] =>
    items.map((x) => ({ id: x.id, title: title(x), meta: meta(x), to }));

  if (slug === "eng" || slug === "product") {
    const [projects, issues, reviews, ecos, tasks] = await Promise.all([
      count("eng_projects", (q) => q.neq("status", "complete")), count("eng_issues", (q) => q.neq("status", "closed")),
      count("eng_design_reviews", (q) => q.neq("status", "approved")), count("eng_ecos", (q) => q.neq("status", "implemented")),
      rows("eng_tasks", "id,title,status,priority,due_date", 8),
    ]);
    return {
      metrics: [
        { label: "Active projects", value: projects, icon: Cpu, to: "/eng-projects", detail: "Portfolio in delivery" },
        { label: "Open issues", value: issues, icon: AlertTriangle, to: "/eng-issues", detail: "Technical blockers" },
        { label: "Reviews pending", value: reviews, icon: FileCheck2, to: "/design-reviews", detail: "Awaiting disposition" },
        { label: "Open changes", value: ecos, icon: Activity, to: "/ecos", detail: "Engineering changes" },
      ],
      queue: queue(tasks, (x) => x.title, (x) => `${x.priority ?? "normal"} · ${x.due_date ?? "no due date"}`, "/eng-tasks"),
      secondary: [],
    };
  }

  if (slug === "mfg") {
    const [orders, lowStock, inspections, assets, work] = await Promise.all([
      count("mfg_work_orders", (q) => q.neq("status", "complete")), count("mfg_inventory", (q) => q.lte("quantity", 5)),
      count("mfg_inspections", (q) => q.neq("status", "passed")), count("con_equipment", (q) => q.neq("status", "available")),
      rows("mfg_work_orders", "id,title,status,priority,due_date", 8),
    ]);
    return {
      metrics: [
        { label: "Open work orders", value: orders, icon: Boxes, to: "/work-orders", detail: "Production demand" },
        { label: "Low-stock parts", value: lowStock, icon: AlertTriangle, to: "/inventory", detail: "At replenishment risk" },
        { label: "Quality holds", value: inspections, icon: ShieldCheck, to: "/mfg-inspections", detail: "Needs disposition" },
        { label: "Assets unavailable", value: assets, icon: Plane, to: "/equipment", detail: "Fleet exceptions" },
      ],
      queue: queue(work, (x) => x.title, (x) => `${x.status ?? "open"} · ${x.due_date ?? "unscheduled"}`, "/work-orders"),
      secondary: [],
    };
  }

  if (slug === "ops") {
    const [incidents, deployments, safety, fleet, active] = await Promise.all([
      count("con_jobs", (q) => q.eq("status", "active")), count("con_schedule_blocks", (q) => q.neq("status", "complete")),
      count("con_safety_incidents", (q) => q.neq("status", "closed")), count("con_equipment", (q) => q.eq("status", "available")),
      rows("con_jobs", "id,name,job_number,status,stage,target_end_date", 8),
    ]);
    return {
      metrics: [
        { label: "Active incidents", value: incidents, icon: Activity, to: "/jobs", detail: "Open response missions" },
        { label: "Deployments", value: deployments, icon: Plane, to: "/scheduling", detail: "Scheduled or active" },
        { label: "Safety exceptions", value: safety, icon: AlertTriangle, to: "/safety", detail: "Require closure" },
        { label: "Fleet ready", value: fleet, icon: CheckCircle2, to: "/equipment", detail: "Available assets" },
      ],
      queue: queue(active, (x) => x.name, (x) => `${x.job_number ?? "Incident"} · ${x.stage ?? x.status ?? "active"}`, "/jobs"),
      secondary: [],
    };
  }

  if (slug === "commercial") {
    const [deals, contacts, proposals, invoices, pipeline] = await Promise.all([
      count("sales_deals", (q) => q.neq("stage", "closed_lost")), count("sales_contacts"),
      count("con_estimates", (q) => q.in("status", ["draft", "sent", "pending"])), count("fin_invoices", (q) => q.neq("status", "paid")),
      rows("sales_deals", "id,name,stage,value,expected_close", 8),
    ]);
    return {
      metrics: [
        { label: "Active opportunities", value: deals, icon: CircleDollarSign, to: "/pipeline", detail: "Funding pipeline" },
        { label: "Partner contacts", value: contacts, icon: Users, to: "/clients", detail: "Relationship network" },
        { label: "Proposals open", value: proposals, icon: FileCheck2, to: "/proposals", detail: "In preparation or review" },
        { label: "Invoices open", value: invoices, icon: AlertTriangle, to: "/invoices", detail: "Financial follow-through" },
      ],
      queue: queue(pipeline, (x) => x.name, (x) => `${x.stage ?? "pipeline"} · ${x.expected_close ?? "no close date"}`, "/pipeline"),
      secondary: [],
    };
  }

  if (slug === "admin") {
    const [employees, applicants, onboarding, leave, people] = await Promise.all([
      count("hr_employees", (q) => q.eq("status", "active")), count("hr_applicants", (q) => q.not("stage", "in", "(hired,rejected)")),
      count("hr_onboarding", (q) => q.neq("status", "complete")), count("hr_time_off", (q) => q.eq("status", "pending")),
      rows("hr_onboarding", "id,task,status,due_date,assignee_id", 8),
    ]);
    return {
      metrics: [
        { label: "Active people", value: employees, icon: Users, to: "/employees", detail: "Current headcount" },
        { label: "Applicants", value: applicants, icon: Activity, to: "/hiring", detail: "In active stages" },
        { label: "Onboarding tasks", value: onboarding, icon: CheckCircle2, to: "/onboarding", detail: "Still outstanding" },
        { label: "Leave requests", value: leave, icon: HeartPulse, to: "/time-off", detail: "Awaiting review" },
      ],
      queue: queue(people, (x) => x.task, (x) => `${x.status ?? "pending"} · ${x.due_date ?? "no due date"}`, "/onboarding"),
      secondary: [],
    };
  }

  if (slug === "systems") {
    const [apps, integrations, infrastructure, security, risks] = await Promise.all([
      count("org_apps", (q) => q.eq("enabled", true)), count("dev_integrations", (q) => q.neq("status", "connected")),
      count("dev_infrastructure", (q) => q.neq("status", "healthy")), count("dev_security_logs", (q) => q.in("severity", ["high", "critical"])),
      rows("dev_security_logs", "id,event_type,severity,description,created_at", 8),
    ]);
    return {
      metrics: [
        { label: "Live workspaces", value: apps, icon: Server, to: "/admin/apps", detail: "Published internal products" },
        { label: "Integration issues", value: integrations, icon: Activity, to: "/admin/it", detail: "Needs IT attention" },
        { label: "Systems unhealthy", value: infrastructure, icon: HeartPulse, to: "/admin/it", detail: "Infrastructure exceptions" },
        { label: "Security alerts", value: security, icon: ShieldCheck, to: "/admin/it", detail: "High-priority events" },
      ],
      queue: queue(risks, (x) => x.event_type ?? "Security event", (x) => `${x.severity ?? "info"} · ${x.description ?? "Review event"}`, "/admin/it"),
      secondary: [],
    };
  }

  const [apps, incidents, people, tickets, work] = await Promise.all([
    count("org_apps", (q) => q.eq("enabled", true)), count("con_jobs", (q) => q.eq("status", "active")),
    count("hr_employees", (q) => q.eq("status", "active")), count("cs_tickets", (q) => q.neq("status", "closed")),
    rows("con_tasks", "id,title,status,priority,due_date", 8),
  ]);
  return {
    metrics: [
      { label: "Live workspaces", value: apps, icon: Server, to: "/workspaces", detail: "Across the organization" },
      { label: "Active missions", value: incidents, icon: Activity, to: "/jobs", detail: "Response operations" },
      { label: "Team members", value: people, icon: Users, to: "/employees", detail: "Active headcount" },
      { label: "Open requests", value: tickets, icon: TicketCheck, to: "/tickets", detail: "Partner and internal" },
    ],
    queue: queue(work, (x) => x.title, (x) => `${x.priority ?? "normal"} · ${x.due_date ?? "no due date"}`, "/company-tasks"),
    secondary: [],
  };
}

export function WorkspaceDashboard({ app }: { app: OrgApp }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const copy = APP_COPY[app.slug] ?? { eyebrow: app.label, title: "Today’s workspace", summary: app.tagline ?? "Your team’s operational picture." };

  useEffect(() => {
    let alive = true;
    setData(null); setError("");
    getDashboard(app.slug).then((d) => alive && setData(d)).catch(() => alive && setError("Dashboard data is temporarily unavailable."));
    return () => { alive = false; };
  }, [app.slug]);

  const quickLinks = useMemo(() => app.nav_groups.slice(1, 5), [app.nav_groups]);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-7">
      <header className="flex flex-col justify-between gap-5 border-b border-border pb-7 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">{copy.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{copy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.summary}</p>
        </div>
        <Link to="/workspaces" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          Switch workspace <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      {error && <div className="mt-6 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      {!data && !error && <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[0,1,2,3].map((x) => <div key={x} className="h-32 animate-pulse border border-border bg-card" />)}</div>}
      {data && (
        <>
          <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.metrics.map((metric) => (
              <Link key={metric.label} to={metric.to as never} className="group border border-border bg-card p-5 transition hover:border-primary/50 hover:shadow-md">
                <div className="flex items-start justify-between"><metric.icon className="h-5 w-5 text-primary" /><ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" /></div>
                <p className="mt-7 text-3xl font-semibold">{metric.value}</p>
                <p className="mt-1 text-sm font-medium">{metric.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
              </Link>
            ))}
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
            <div className="border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div><h2 className="text-sm font-semibold">Priority queue</h2><p className="mt-0.5 text-xs text-muted-foreground">Work requiring the next decision or action</p></div>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="divide-y divide-border">
                {data.queue.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No open work in this queue.</p>}
                {data.queue.map((item) => (
                  <Link key={item.id} to={item.to as never} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/50">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{item.title}</span><span className="block truncate text-xs text-muted-foreground">{item.meta}</span></span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
            <aside className="border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Workspace areas</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Your role controls the exact pages available within these areas.</p>
              <div className="mt-4 space-y-2">
                {quickLinks.map((label) => <div key={label} className="flex items-center gap-2 border-b border-border py-2 text-sm last:border-0"><CheckCircle2 className="h-4 w-4 text-primary" />{label}</div>)}
              </div>
            </aside>
          </section>
        </>
      )}
    </main>
  );
}