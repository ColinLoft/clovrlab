import { createFileRoute } from "@tanstack/react-router";
import { PagingConsole } from "@/components/hq/PagingConsole";

export const Route = createFileRoute("/_hq/ops/paging")({
  head: () => ({
    meta: [
      { title: "Mission Paging & On-Call — Clovr Labs" },
      { name: "description", content: "Mission Operations paging: live fire, incident and fleet pages, acknowledgement, escalation tiers, tracking tickets and the flight-ops on-call roster." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <PagingConsole
      queue="ops"
      lede="Field and flight emergencies page the mission on-call rotation. Every page opens a tracking ticket so nothing gets lost after the alarm stops."
    />
  ),
});
