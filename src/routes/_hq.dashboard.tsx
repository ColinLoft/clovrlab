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
  if (loading) return <Loading />;
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
