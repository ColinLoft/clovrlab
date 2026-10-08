import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Clovr Operations" },
      { name: "description", content: "Clovr Labs internal operations panel." },
      { property: "og:title", content: "Clovr Operations" },
      { property: "og:description", content: "Clovr Labs internal operations panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/hq-login" });
  },
  component: () => null,
});
