import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, BellRing, Check, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { playSiren, stopSound } from "@/lib/hq/sounds";
import { ackPage, fetchMyLivePages, resolvePage, type PageAlert } from "@/lib/hq/paging";
import { cachedPrefs } from "@/lib/hq/prefs";

/**
 * Site-wide pager. When an urgent page targets the signed-in operator this
 * takes over the screen, sounds a loud repeating siren and fires a sticky
 * desktop notification until someone acknowledges it.
 */
export function Pager() {
  const [queue, setQueue] = useState<PageAlert[]>([]);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const seen = useRef<Set<string>>(new Set());
  const notifRef = useRef<Notification | null>(null);

  const active = queue[0] ?? null;

  const push = useCallback((rows: PageAlert[]) => {
    setQueue((q) => {
      const fresh = rows.filter((r) => !q.some((x) => x.id === r.id));
      return fresh.length ? [...q, ...fresh] : q;
    });
  }, []);

  useEffect(() => {
    let alive = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid || !alive) return;

      fetchMyLivePages().then((rows) => alive && push(rows)).catch(() => {});

      channel = supabase
        .channel(`pager:${uid}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_targets", filter: `user_id=eq.${uid}` }, async (p: any) => {
          const alertId = p.new?.alert_id;
          if (!alertId || seen.current.has(alertId)) return;
          seen.current.add(alertId);
          const { data: row } = await (supabase as any).from("page_alerts").select("*").eq("id", alertId).maybeSingle();
          if (row && row.status === "open") push([row as PageAlert]);
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "page_alerts" }, (p: any) => {
          const row = p.new;
          if (row && row.status !== "open") setQueue((q) => q.filter((x) => x.id !== row.id));
        })
        .subscribe();
    })();

    return () => { alive = false; if (channel) supabase.removeChannel(channel); };
  }, [push]);

  // Alarm + desktop notification while a page is on screen.
  useEffect(() => {
    if (!active) {
      stopSound("siren");
      notifRef.current?.close();
      notifRef.current = null;
      return;
    }
    if (cachedPrefs().pagerSound) playSiren();
    if (typeof Notification !== "undefined") {
      if (Notification.permission === "default") Notification.requestPermission().catch(() => {});
      if (Notification.permission === "granted") {
        try {
          notifRef.current = new Notification(`🚨 ${active.title}`, {
            body: active.body ?? "Urgent page — acknowledgement required.",
            requireInteraction: true,
            tag: active.id,
          });
          notifRef.current.onclick = () => window.focus();
        } catch {}
      }
    }
    return () => { stopSound("siren"); notifRef.current?.close(); notifRef.current = null; };
  }, [active]);

  if (!active) return null;

  const dismiss = () => setQueue((q) => q.slice(1));

  const onAck = async () => {
    setBusy(true);
    try { await ackPage(active.id); dismiss(); } catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  const onResolve = async () => {
    setBusy(true);
    try { await resolvePage(active.id); dismiss(); } catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  };

  const onOpen = async () => {
    await onAck();
    if (active.link) navigate({ to: active.link }).catch(() => {});
  };

  const tone = active.severity === "critical" ? "bg-destructive" : "bg-amber-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-destructive/60 bg-card shadow-2xl">
        <div className={`flex items-center gap-2 px-5 py-3 text-white ${tone} animate-pulse`}>
          <BellRing className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            {active.severity} page · {active.kind}
          </span>
          <span className="ml-auto font-mono text-[11px] opacity-80">Level {active.level}</span>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-none text-destructive" />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-tight">{active.title}</h2>
              {active.body && <p className="mt-1 text-sm text-muted-foreground">{active.body}</p>}
            </div>
          </div>
          <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            This page escalates to the next on-call tier until someone acknowledges it.
          </p>
          {queue.length > 1 && (
            <p className="text-xs font-medium text-amber-500">{queue.length - 1} more page(s) waiting behind this one.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border p-4">
          <button onClick={onAck} disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            <Check className="h-4 w-4" /> Acknowledge
          </button>
          {active.link && (
            <button onClick={onOpen} disabled={busy}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50">
              Acknowledge & open
            </button>
          )}
          <button onClick={onResolve} disabled={busy}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50">
            Resolve
          </button>
          <button onClick={() => { stopSound("siren"); }} title="Silence the alarm without acknowledging"
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" /> Silence
          </button>
        </div>
      </div>
    </div>
  );
}
