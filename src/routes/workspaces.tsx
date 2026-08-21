import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchApps, appUrl, type OrgApp } from "@/lib/hq/apps";
import { canEnter } from "@/lib/hq/app-context";
import { useRouteAccess } from "@/lib/hq/route-access";
import { ArrowUpRight, LogOut, Lock, ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/workspaces")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/hq-login" });
  },
  head: () => ({
    meta: [
      { title: "Clovr HQ — Choose a workspace" },
      { name: "description", content: "Pick which Clovr Labs internal workspace to open." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkspacePicker,
});

function WorkspacePicker() {
  const navigate = useNavigate();
  const access = useRouteAccess();
  const [apps, setApps] = useState<OrgApp[]>([]);
  const [unitSlugById, setUnitSlugById] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const [list, units, user] = await Promise.all([
        fetchApps(),
        (supabase as any).from("org_units").select("id, slug"),
        supabase.auth.getUser(),
      ]);
      if (!alive) return;
      setApps(list);
      setUnitSlugById(new Map(((units?.data ?? []) as any[]).map((u) => [u.id, u.slug])));
      setName((user.data.user?.user_metadata as any)?.full_name || user.data.user?.email || "");
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const ready = !loading && !access.loading;
  const opts = { isAdmin: access.isAdmin, units: access.units, unitSlugById };
  const permitted = apps.filter((a) => a.enabled && !a.is_hub && canEnter(a, opts));
  const teamApps = permitted;
  const term = q.trim().toLowerCase();
  const shown = term
    ? permitted.filter((a) => `${a.label} ${a.tagline ?? ""} ${a.subdomain}`.toLowerCase().includes(term))
    : permitted;
  const rest = shown;

  // One workspace, no choice to make — go straight in.
  const soloTarget = ready && !access.isAdmin && teamApps.length === 1 ? teamApps[0] : null;
  useEffect(() => {
    if (!soloTarget) return;
    try { sessionStorage.setItem("hq.app.override", soloTarget.subdomain); } catch {}
    window.location.replace(appUrl(soloTarget));
  }, [soloTarget?.id]);


  const open = (a: OrgApp, newTab: boolean) => {
    const url = appUrl(a);
    if (newTab) { window.open(url, "_blank", "noopener"); return; }
    try { sessionStorage.setItem("hq.app.override", a.subdomain); } catch {}
    window.location.href = url;
  };

  const hour = new Date().getHours();
  const partOfDay = hour < 5 ? "Late night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (soloTarget) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        Opening {soloTarget.label}…
      </div>
    );
  }

  return (

    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.14]"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, var(--color-primary, hsl(0 72% 51%)) 0%, transparent 70%)" }}
      />

      <header className="relative mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-[13px] font-bold text-primary-foreground">
            CL
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Clovr HQ</p>
            <p className="text-[11px] text-muted-foreground">Internal operations</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/hq-login", replace: true });
          }}
          className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </header>

      <main className="relative mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">{partOfDay}</p>
          <h1 className="mt-3 text-[2.25rem] font-semibold leading-[1.1] tracking-tight">
            {name ? `${name.split(" ")[0]}, where are you working today?` : "Where are you working today?"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Each workspace is its own product with its own tools and look. Open as many as you need — they run
            side by side in separate tabs.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              aria-label="Search workspaces"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search workspaces"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3.5 text-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{permitted.length}</span> workspaces available
            {access.isAdmin && (
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Admin
              </span>
            )}
          </div>
        </div>

        {!ready && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        )}

        {ready && permitted.length === 0 && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <p className="font-medium">No workspaces assigned yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask an administrator to add you to a team, then reload this page.
            </p>
          </div>
        )}

        {ready && hub && (
          <button
            onClick={() => open(hub, false)}
            className="group mt-8 flex w-full items-center gap-5 rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
          >
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-bold uppercase"
              style={{
                background: hub.accent ? `color-mix(in oklab, ${hub.accent} 18%, transparent)` : "color-mix(in oklab, var(--primary) 14%, transparent)",
                color: hub.accent ?? "var(--primary)",
              }}
            >
              {(hub.short_code || hub.subdomain).slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Start here</p>
              <p className="mt-1 truncate text-lg font-semibold">{hub.label}</p>
              <p className="truncate text-sm text-muted-foreground">
                {hub.tagline || "Company-wide hub: people, calendar, mail and shared tools."}
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </button>
        )}

        {ready && rest.length > 0 && (
          <>
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Team workspaces
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <div
                  key={a.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 opacity-70"
                    style={{ background: a.accent ?? "var(--primary)" }}
                  />
                  <button onClick={() => open(a, false)} className="flex flex-1 flex-col text-left">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-[12px] font-bold uppercase"
                      style={{
                        background: a.accent ? `color-mix(in oklab, ${a.accent} 18%, transparent)` : "color-mix(in oklab, var(--primary) 14%, transparent)",
                        color: a.accent ?? "var(--primary)",
                      }}
                    >
                      {(a.short_code || a.subdomain).slice(0, 2)}
                    </span>
                    <p className="mt-4 font-semibold">{a.label}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {a.tagline || a.subdomain}
                    </p>
                    <span className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                      Open workspace <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                  <button
                    onClick={() => open(a, true)}
                    className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground transition hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" /> Open in a new tab
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {ready && permitted.length > 0 && shown.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">No workspaces match “{q}”.</p>
        )}
      </main>
    </div>
  );
}
