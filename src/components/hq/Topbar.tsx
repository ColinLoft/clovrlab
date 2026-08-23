import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Menu, Phone, ChevronsUpDown, Check, ArrowUpRight, Sun, Moon, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RecordTabs } from "./RecordTabs";
import { usePhone } from "@/lib/hq/phone";
import { useHQTheme, resolveTheme } from "@/lib/hq/theme";
import { useCurrentApp } from "@/lib/hq/app-context";
import { appUrl } from "@/lib/hq/apps";
import { playSound } from "@/lib/hq/sounds";
import { toast } from "@/lib/hq/notify";

type Notification = {
  id: string;
  title: string | null;
  body: string | null;
  created_at: string;
  read_at: string | null;
  link?: string | null;
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState<null | "notif" | "apps">(null);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const { theme, setTheme } = useHQTheme();
  const { permitted: allPermitted, app: current } = useCurrentApp();
  const permitted = allPermitted.filter((a) => !a.is_hub);
  const { incoming, acceptIncoming, declineIncoming } = usePhone();
  const navigate = useNavigate();

  const loadNotifs = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, link, created_at, read_at")
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) setNotifs(data as Notification[]);
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .is("read_at", null);
    if (count !== null) setUnread(count);
  };

  // Live pages and mentions land here: badge, sound and a toast the operator can act on.
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid || cancelled) return;
      channel = supabase
        .channel("topbar-notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
          (payload) => {
            const n = payload.new as Notification;
            setNotifs((cur) => [n, ...cur].slice(0, 12));
            setUnread((c) => c + 1);
            playSound("notification");
            toast.info(n.title ?? "New notification");
          },
        )
        .subscribe();
    })();
    return () => { cancelled = true; if (channel) supabase.removeChannel(channel); };
  }, []);

  const openNotif = async (n: Notification) => {
    if (!n.read_at) {
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", n.id);
      setNotifs((cur) => cur.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
      setUnread((c) => Math.max(0, c - 1));
    }
    setOpen(null);
    if (n.link) navigate({ to: n.link as never });
  };

  const markAllRead = async () => {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).is("read_at", null);
    setNotifs((cur) => cur.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
    setUnread(0);
  };

  useEffect(() => { void loadNotifs(); }, []);

  useEffect(() => { if (open === "notif") void loadNotifs(); }, [open]);

  // Outside click closes all
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-topbar-menu]")) setOpen(null);
    };
    const id = setTimeout(() => document.addEventListener("mousedown", onDoc), 0);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", onDoc); };
  }, [open]);

  const toggle = (which: "notif" | "apps") => setOpen((cur) => (cur === which ? null : which));

  const iconBtn = "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition hover:bg-muted hover:border-primary/40";
  const iconBtnActive = "border-primary/60 bg-primary/10 text-primary";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
      {/* Incoming call banner */}
      {incoming && (
        <div className="flex items-center gap-3 border-b border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Phone className="h-3.5 w-3.5 animate-pulse" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{incoming.fromName}</p>
            <p className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Incoming call…</p>
          </div>
          <button onClick={acceptIncoming} className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600">Accept</button>
          <button onClick={declineIncoming} className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Decline</button>
        </div>
      )}

      <div className="flex h-12 items-center gap-2 px-4">
        <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={onMenuClick} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1" />

        {/* Workspace switcher */}
        <div className="relative" data-topbar-menu>
          <button
            onClick={() => toggle("apps")}
            className={`flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-foreground shadow-sm transition hover:bg-muted hover:border-primary/40 ${open === "apps" ? iconBtnActive : ""}`}
            aria-label="Switch workspace"
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold uppercase"
              style={{
                background: current?.accent ? `color-mix(in oklab, ${current.accent} 20%, transparent)` : "color-mix(in oklab, var(--primary) 16%, transparent)",
                color: current?.accent ?? "var(--primary)",
              }}
            >
              {(current?.short_code || current?.subdomain || "hq").slice(0, 2)}
            </span>
            <span className="hidden max-w-[160px] truncate text-[13px] font-medium sm:block">
              {current?.label ?? "Workspace"}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {open === "apps" && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card p-2 shadow-xl">
              <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Switch workspace
              </p>
              <div className="max-h-[360px] space-y-0.5 overflow-y-auto">
                {permitted.length === 0 && (
                  <p className="px-2 py-4 text-center text-xs text-muted-foreground">No workspaces assigned.</p>
                )}
                {permitted.map((a) => (
                  <a
                    key={a.id}
                    href={appUrl(a)}
                    onClick={() => { try { sessionStorage.setItem("hq.app.override", a.subdomain); } catch { /* ignore */ } setOpen(null); }}
                    className={`flex items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-muted ${
                      current?.id === a.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold uppercase"
                      style={{
                        background: a.accent ? `color-mix(in oklab, ${a.accent} 18%, transparent)` : "color-mix(in oklab, var(--primary) 14%, transparent)",
                        color: a.accent ?? "var(--primary)",
                      }}
                    >
                      {(a.short_code || a.subdomain).slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium">{a.label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{a.tagline || a.subdomain}</span>
                    </span>
                    {current?.id === a.id && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                  </a>
                ))}
              </div>
              <a
                href="/workspaces"
                onClick={() => setOpen(null)}
                className="mt-1 flex items-center gap-1.5 border-t border-border px-2 pt-2 text-[12px] font-medium text-primary hover:underline"
              >
                All workspaces <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolveTheme(theme) === "dark" ? "light" : "dark")}
          className={iconBtn}
          aria-label="Toggle light or dark mode"
        >
          {resolveTheme(theme) === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" data-topbar-menu>
          <button
            onClick={() => toggle("notif")}
            className={`${iconBtn} ${open === "notif" ? iconBtnActive : ""}`}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground shadow">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          {open === "notif" && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card p-1 shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <p className="text-sm font-semibold">Notifications</p>
                {unread > 0 ? (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">All caught up</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 && (
                  <p className="px-3 py-6 text-center text-xs text-muted-foreground">No notifications</p>
                )}
                {notifs.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => void openNotif(n)}
                    className={`block w-full border-b border-border/50 px-3 py-2 text-left text-sm transition last:border-0 hover:bg-muted ${!n.read_at ? "bg-primary/5" : ""}`}
                  >
                    <p className="flex items-center gap-1.5 truncate font-medium">
                      {!n.read_at && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                      {n.title ?? "Notification"}
                    </p>
                    {n.body && <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>}
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {new Date(n.created_at).toLocaleString()}{n.link ? " · tap to open" : ""}
                    </p>
                  </button>
                ))}
              </div>
              <Link
                to="/notifications"
                onClick={() => setOpen(null)}
                className="block border-t border-border px-3 py-2 text-center text-xs font-medium text-primary hover:bg-muted"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      </div>

      <RecordTabs />
    </header>
  );
}
