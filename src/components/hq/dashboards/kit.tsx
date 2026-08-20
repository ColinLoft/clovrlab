import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const db = supabase as any;

/** Count rows matching an optional filter. */
export async function count(table: string, filter?: (q: any) => any): Promise<number> {
  let q = db.from(table).select("id", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: n } = await q;
  return n ?? 0;
}

/** Read rows with an optional filter/order. */
export async function rows(table: string, fields: string, shape?: (q: any) => any, limit = 8): Promise<any[]> {
  let q = db.from(table).select(fields);
  if (shape) q = shape(q);
  const { data } = await q.limit(limit);
  return data ?? [];
}

export function useDash<T>(key: string, load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    setData(null);
    setError("");
    load()
      .then((d) => alive && setData(d))
      .catch(() => alive && setError("Live data is temporarily unavailable."));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { data, error };
}

export const today = () => new Date().toISOString().slice(0, 10);
export const inDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
export const money = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${Math.round(n / 1000)}K` : `$${Math.round(n || 0)}`;
export const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

export function DashShell({
  eyebrow, title, summary, actions, children, className = "",
}: {
  eyebrow: string; title: string; summary: string; actions?: React.ReactNode;
  children: React.ReactNode; className?: string;
}) {
  return (
    <main className={`mx-auto w-full max-w-[1400px] px-5 py-7 sm:px-8 ${className}`}>
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          <Link to="/workspaces" className="text-sm font-medium text-primary hover:underline">Switch workspace</Link>
        </div>
      </header>
      {children}
    </main>
  );
}

export function Loading({ variant = "grid" }: { variant?: "grid" | "rows" }) {
  const n = variant === "grid" ? 4 : 6;
  return (
    <div className={variant === "grid" ? "mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" : "mt-7 space-y-2"}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded-md bg-muted ${variant === "grid" ? "h-32" : "h-14"}`} />
      ))}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{message}</div>;
}

/** Horizontal capacity/progress bar built from semantic tokens. */
export function Bar({ value, max, tone = "primary" }: { value: number; max: number; tone?: "primary" | "destructive" | "muted" }) {
  const w = Math.min(100, Math.max(2, pct(value, max || 1)));
  const bg = tone === "destructive" ? "bg-destructive" : tone === "muted" ? "bg-muted-foreground/50" : "bg-primary";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${bg} transition-all`} style={{ width: `${w}%` }} />
    </div>
  );
}

/** Compact sparkline from a numeric series. */
export function Spark({ points, className = "" }: { points: number[]; className?: string }) {
  if (points.length < 2) return null;
  const max = Math.max(...points, 1);
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${28 - (p / max) * 26}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className={`h-8 w-full text-primary ${className}`}>
      <polyline points={d} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Donut({ value, label }: { value: number; label: string }) {
  const c = 2 * Math.PI * 26;
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg viewBox="0 0 64 64" className="h-24 w-24 -rotate-90">
        <circle cx="32" cy="32" r="26" className="fill-none stroke-muted" strokeWidth="7" />
        <circle
          cx="32" cy="32" r="26" strokeWidth="7" strokeLinecap="round"
          className="fill-none stroke-primary transition-all"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-lg font-semibold leading-none">{value}%</p>
        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function StatLink({
  to, label, value, hint, tone,
}: { to: string; label: string; value: string | number; hint?: string; tone?: "risk" | "good" }) {
  return (
    <Link
      to={to as never}
      className="group rounded-lg border border-border bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${tone === "risk" ? "text-destructive" : ""}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Link>
  );
}

export function Panel({
  title, hint, children, right, className = "",
}: { title: string; hint?: string; children: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-border bg-card ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="p-8 text-center text-sm text-muted-foreground">{children}</p>;
}

export function RowLink({
  to, title, meta, badge, tone,
}: { to: string; title: string; meta: string; badge?: string; tone?: "risk" | "good" | "warn" }) {
  const dot = tone === "risk" ? "bg-destructive" : tone === "good" ? "bg-primary" : tone === "warn" ? "bg-muted-foreground" : "bg-primary/60";
  return (
    <Link to={to as never} className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/60">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{meta}</span>
      </span>
      {badge && (
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}
