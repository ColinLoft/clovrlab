/**
 * Workbench kit — the shared primitives every team workspace is built from.
 * Pages compose these into their own layout; nothing here forces a single
 * "generic list page" look.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, X, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const db = supabase as any;

/* ------------------------------------------------------------------ data */

export type LoadOpts = {
  select?: string;
  order?: { column: string; ascending?: boolean };
  shape?: (q: any) => any;
  limit?: number;
};

export function useRows<T = any>(table: string, opts: LoadOpts = {}) {
  const { select = "*", order, shape, limit = 500 } = opts;
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    let q = db.from(table).select(select);
    if (order) q = q.order(order.column, { ascending: order.ascending ?? false, nullsFirst: false });
    if (shape) q = shape(q);
    const { data, error } = await q.limit(limit);
    if (error) setError(error.message);
    setRows((data ?? []) as T[]);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, select]);

  useEffect(() => { setLoading(true); reload(); }, [reload]);

  const insert = useCallback(async (values: Record<string, any>) => {
    const { data, error } = await db.from(table).insert(values).select().single();
    if (error) { alert(error.message); return null; }
    await reload();
    return data;
  }, [table, reload]);

  const patch = useCallback(async (id: string, values: Record<string, any>) => {
    setRows((prev: any[]) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)) as T[]);
    const { error } = await db.from(table).update(values).eq("id", id);
    if (error) { alert(error.message); reload(); }
  }, [table, reload]);

  const remove = useCallback(async (id: string) => {
    if (!confirm("Delete this record?")) return;
    setRows((prev: any[]) => prev.filter((r) => r.id !== id) as T[]);
    const { error } = await db.from(table).delete().eq("id", id);
    if (error) { alert(error.message); reload(); }
  }, [table, reload]);

  return { rows, loading, error, reload, insert, patch, remove, setRows };
}

export type Person = { id: string; full_name: string | null; email: string | null; title?: string | null };

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await db.from("profiles").select("id, full_name, email, title").order("full_name");
      setPeople((data ?? []) as Person[]);
    })();
  }, []);
  const byId = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);
  return { people, byId };
}

export function useMe() {
  const [me, setMe] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); }, []);
  return me;
}

/** Raise a cross-team hand-off so the owning team sees the work in their inbox. */
export async function raiseRequest(input: {
  from_team: string; to_team: string; subject: string; details?: string;
  entity_type?: string; entity_id?: string; priority?: string; due_date?: string | null;
}) {
  const { data: u } = await supabase.auth.getUser();
  const { error } = await db.from("team_requests").insert({ ...input, requested_by: u.user?.id ?? null });
  if (error) { alert(error.message); return false; }
  return true;
}

/* ------------------------------------------------------------- formatting */

export const money = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1000).toFixed(1)}K` : `$${Math.round(n || 0)}`;
export const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
export const dt = (v?: string | null) =>
  v ? new Date(v).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";
export const d = (v?: string | null) =>
  v ? new Date(v + (v.length === 10 ? "T00:00:00" : "")).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";
export const nameOf = (byId: Map<string, Person>, id?: string | null) =>
  (id && (byId.get(id)?.full_name || byId.get(id)?.email)) || "Unassigned";
export const titleCase = (s?: string | null) => (s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—");

/* ------------------------------------------------------------------ chrome */

export function WorkPage({
  eyebrow, title, lede, actions, children, wide = false,
}: {
  eyebrow: string; title: string; lede?: string; actions?: React.ReactNode;
  children: React.ReactNode; wide?: boolean;
}) {
  return (
    <main className={`mx-auto w-full ${wide ? "max-w-[1700px]" : "max-w-[1400px]"} px-5 py-6 sm:px-7`}>
      <header className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {lede && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">{lede}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </header>
      {children}
    </main>
  );
}

export function Stat({ label, value, hint, tone = "default", icon: Icon }: {
  label: string; value: string | number; hint?: string;
  tone?: "default" | "good" | "warn" | "risk"; icon?: LucideIcon;
}) {
  const toneCls =
    tone === "risk" ? "text-destructive" : tone === "warn" ? "text-amber-500" : tone === "good" ? "text-emerald-500" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${toneCls}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" };

export function StatRow({ children, cols = 4 }: { children: React.ReactNode; cols?: number }) {
  return <section className={`mt-5 grid gap-3 sm:grid-cols-2 ${COLS[cols] ?? COLS[4]}`}>{children}</section>;
}

export function Card({ title, hint, action, children, className = "", pad = true }: {
  title?: string; hint?: string; action?: React.ReactNode; children: React.ReactNode; className?: string; pad?: boolean;
}) {
  return (
    <section className={`rounded-lg border border-border bg-card ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={pad ? "p-4" : ""}>{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{children}</p>;
}

export function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
    </div>
  );
}

const TONE: Record<string, string> = {
  good: "bg-emerald-500/12 text-emerald-500 border-emerald-500/25",
  warn: "bg-amber-500/12 text-amber-500 border-amber-500/25",
  risk: "bg-destructive/12 text-destructive border-destructive/25",
  info: "bg-primary/12 text-primary border-primary/25",
  muted: "bg-muted text-muted-foreground border-border",
};

export function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: keyof typeof TONE }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${TONE[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(status?: string | null): keyof typeof TONE {
  const s = (status ?? "").toLowerCase();
  if (/(critical|grounded|blocked|overdue|failed|rejected|denied|escalated|confirmed)/.test(s)) return "risk";
  if (/(warn|at_risk|pending|review|waiting|requested|in_review|maintenance|unconfirmed|new)/.test(s)) return "warn";
  if (/(done|complete|closed|approved|resolved|on_track|available|active|released|authorized|paid|won)/.test(s)) return "good";
  if (/(in_progress|flying|planned|building|open|discovery)/.test(s)) return "info";
  return "muted";
}

export function Bar({ value, max = 100, tone = "primary" }: { value: number; max?: number; tone?: "primary" | "risk" | "good" }) {
  const w = Math.min(100, Math.max(2, pct(value, max || 1)));
  const bg = tone === "risk" ? "bg-destructive" : tone === "good" ? "bg-emerald-500" : "bg-primary";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${bg} transition-all`} style={{ width: `${w}%` }} />
    </div>
  );
}

export function Toolbar({ q, setQ, placeholder = "Search…", children }: {
  q: string; setQ: (v: string) => void; placeholder?: string; children?: React.ReactNode;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {children}
    </div>
  );
}

export function Select({ value, onChange, options, className = "" }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string;
}) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className={`rounded-md border border-border bg-card px-2.5 py-2 text-sm outline-none focus:border-primary ${className}`}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Btn({ children, onClick, variant = "default", type = "button", disabled, className = "" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "default" | "primary" | "ghost" | "danger";
  type?: "button" | "submit"; disabled?: boolean; className?: string;
}) {
  const v =
    variant === "primary" ? "bg-primary text-primary-foreground hover:opacity-90"
    : variant === "danger" ? "border border-destructive/40 text-destructive hover:bg-destructive/10"
    : variant === "ghost" ? "text-muted-foreground hover:text-foreground"
    : "border border-border bg-card hover:bg-accent";
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${v} ${className}`}>
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- kanban */

export type KanbanColumn = { key: string; label: string; tone?: keyof typeof TONE };

export function Kanban<T extends { id: string }>({
  columns, rows, statusKey, onMove, render, onOpen,
}: {
  columns: KanbanColumn[]; rows: T[]; statusKey: keyof T & string;
  onMove: (row: T, status: string) => void;
  render: (row: T) => React.ReactNode;
  onOpen?: (row: T) => void;
}) {
  return (
    <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(220px, 1fr))` }}>
      {columns.map((c) => {
        const items = rows.filter((r) => String(r[statusKey] ?? "").toLowerCase() === c.key);
        return (
          <div key={c.key} className="rounded-lg border border-border bg-muted/30">
            <header className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <span className="rounded bg-card px-1.5 text-[11px] tabular-nums text-muted-foreground">{items.length}</span>
            </header>
            <div className="space-y-2 p-2">
              {items.length === 0 && <p className="px-1 py-4 text-center text-xs text-muted-foreground">Empty</p>}
              {items.map((r) => (
                <article key={r.id} className="group rounded-md border border-border bg-card p-3 text-sm shadow-sm">
                  <button className="w-full text-left" onClick={() => onOpen?.(r)}>{render(r)}</button>
                  <div className="mt-2 hidden gap-1 group-hover:flex">
                    <select
                      value={String(r[statusKey] ?? "")}
                      onChange={(e) => onMove(r, e.target.value)}
                      className="w-full rounded border border-border bg-background px-1.5 py-1 text-[11px]"
                    >
                      {columns.map((o) => <option key={o.key} value={o.key}>Move to {o.label}</option>)}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- forms */

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "datetime" | "select" | "user" | "bool";
  options?: { value: string; label: string }[];
  required?: boolean;
  full?: boolean;
  placeholder?: string;
};

export function RecordForm({
  fields, value, people, onChange,
}: {
  fields: Field[]; value: Record<string, any>; people?: Person[];
  onChange: (v: Record<string, any>) => void;
}) {
  const set = (k: string, v: any) => onChange({ ...value, [k]: v });
  const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((f) => (
        <label key={f.key} className={`block text-sm ${f.full ? "sm:col-span-2" : ""}`}>
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            {f.label}{f.required && <span className="text-destructive"> *</span>}
          </span>
          {f.type === "textarea" ? (
            <textarea rows={3} className={input} placeholder={f.placeholder}
              value={value[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
          ) : f.type === "select" ? (
            <select className={input} value={value[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
              <option value="">Select…</option>
              {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : f.type === "user" ? (
            <select className={input} value={value[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value || null)}>
              <option value="">Unassigned</option>
              {(people ?? []).map((p) => <option key={p.id} value={p.id}>{p.full_name || p.email}</option>)}
            </select>
          ) : f.type === "bool" ? (
            <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]"
              checked={!!value[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
          ) : (
            <input
              type={f.type === "datetime" ? "datetime-local" : f.type}
              className={input} placeholder={f.placeholder}
              value={value[f.key] ?? ""}
              onChange={(e) => set(f.key, f.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)}
            />
          )}
        </label>
      ))}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`mt-12 w-full ${wide ? "max-w-3xl" : "max-w-xl"} rounded-lg border border-border bg-card shadow-xl`} onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </header>
        <div className="p-4">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-border px-4 py-3">{footer}</footer>}
      </div>
    </div>
  );
}

/** Create/edit dialog driven by a field list. */
export function RecordDialog({
  title, fields, initial = {}, people, onCancel, onSave,
}: {
  title: string; fields: Field[]; initial?: Record<string, any>; people?: Person[];
  onCancel: () => void; onSave: (values: Record<string, any>) => Promise<void> | void;
}) {
  const [value, setValue] = useState<Record<string, any>>(initial);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    for (const f of fields) if (f.required && !value[f.key]) return alert(`${f.label} is required`);
    setBusy(true);
    await onSave(value);
    setBusy(false);
  };
  return (
    <Modal
      title={title} onClose={onCancel} wide
      footer={<>
        <Btn onClick={onCancel}>Cancel</Btn>
        <Btn variant="primary" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Btn>
      </>}
    >
      <RecordForm fields={fields} value={value} people={people} onChange={setValue} />
    </Modal>
  );
}

export function NewButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <Btn variant="primary" onClick={onClick}><Plus className="h-3.5 w-3.5" />{label}</Btn>;
}

/* ------------------------------------------------- cross-team hand-offs */

export type TeamRequest = {
  from_team: string;
  to_team: string;
  subject: string;
  details?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  entity_type?: string;
  entity_id?: string;
  assignee_id?: string | null;
  due_date?: string | null;
};

/** Raise a request against another workspace. Returns true when it lands. */
export async function raiseRequest(req: TeamRequest) {
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await db.from("team_requests").insert({
    priority: "normal",
    ...req,
    status: "open",
    requested_by: auth.user?.id ?? null,
  });
  if (error) {
    alert(error.message);
    return false;
  }
  return true;
}

