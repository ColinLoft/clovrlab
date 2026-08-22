import { createFileRoute } from "@tanstack/react-router";
import { PagingConsole } from "@/components/hq/PagingConsole";

export const Route = createFileRoute("/_hq/systems/paging")({
  head: () => ({
    meta: [
      { title: "Systems Paging & On-Call — Clovr Labs" },
      { name: "description", content: "Enterprise Systems paging: service outages, infrastructure failures and security events with escalation tiers, tracking tickets and the platform on-call roster." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <PagingConsole
      queue="systems"
      lede="Platform, infrastructure and security incidents page the systems on-call rotation, separately from mission operations. Every page opens a tracking ticket."
    />
  ),
});
