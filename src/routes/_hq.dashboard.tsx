import { createFileRoute } from "@tanstack/react-router";
import { useCurrentApp } from "@/lib/hq/app-context";
import { WorkspaceDashboard } from "@/components/hq/WorkspaceDashboard";
import { Loading } from "@/components/hq/work/kit";

/**
 * The dashboard is always the current workspace's own dashboard — Operations
 * sees flights, Engineering sees programs, Leadership sees the org briefing.
 */
function DashboardPage() {
  const { app, loading } = useCurrentApp();
  const navigate = useNavigate();

  // The shared hub no longer has its own dashboard — teams own their own.
  useEffect(() => {
    if (!loading && (!app || app.is_hub)) navigate({ to: "/workspaces", replace: true });
  }, [loading, app?.id, app?.is_hub, navigate]);

  if (loading || !app || app.is_hub) return <Loading />;
  return <WorkspaceDashboard app={app as any} />;
}

export const Route = createFileRoute("/_hq/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Clovr Labs HQ" },
      { name: "description", content: "Your workspace at a glance: missions, programs, production and people." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});
