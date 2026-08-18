import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchApps, appUrl, type OrgApp } from "@/lib/hq/apps";
import { canEnter } from "@/lib/hq/app-context";
import { useRouteAccess } from "@/lib/hq/route-access";
import { ArrowUpRight, LogOut, Lock, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/workspaces")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/hq-login" });
  },
  head: () => ({
    meta: [
      { title: "Clovr HQ — Choose a workspace" },
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
      setName(
        (user.data.user?.user_metadata as any)?.full_name ||
          user.data.user?.email ||
          "",
      );
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const ready = !loading && !access.loading;
  const opts = { isAdmin: access.isAdmin, units: access.units, unitSlugById };
  const permitted = apps.filter((a) => a.enabled && canEnter(a, opts));

  const open = (a: OrgApp, newTab: boolean) => {
    const url = appUrl(a);
    if (newTab) {
      window.open(url, "_blank", "noopener");
      return;
    }
    try { sessionStorage.setItem("hq.app.override", a.subdomain); } catch {}
    window.location.href = url;
  };

  return (
    <div className="min-h-dvh bg-surface px-6 py-14 text-foreground">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Clovr HQ</p>
            <h1 className="mt-2 text-2xl font-semibold">
              {name ? `Welcome back, ${name.split(" ")[0]}` : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You have access to the following internal systems. Pick one to open it.
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/hq-login", replace: true });
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        {!ready && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        )}

        {ready && permitted.length === 0 && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <p className="font-medium">No workspaces assigned yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask an administrator to add you to a team, then reload this page.
            </p>
          </div>
        )}

        {ready && permitted.length > 0 && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {permitted.map((a) => (
              <div
                key={a.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                style={a.accent ? ({ ["--tile" as any]: a.accent } as any) : undefined}
              >
                <button onClick={() => open(a, false)} className="block w-full text-left">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-[12px] font-bold uppercase"
                      style={{
                        background: a.accent ? `color-mix(in oklab, ${a.accent} 18%, transparent)` : undefined,
                        color: a.accent ?? undefined,
                      }}
                    >
                      {(a.short_code || a.subdomain).slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{a.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.tagline || a.subdomain}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                  </div>
                </button>
                <button
                  onClick={() => open(a, true)}
                  className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground transition hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" /> Open in a new tab
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Each workspace opens in its own tab, so you can keep several running side by side.
        </p>
      </div>
    </div>
  );
}
