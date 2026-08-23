import { createFileRoute } from "@tanstack/react-router";

/**
 * One-tap acknowledgement endpoint for ntfy action buttons and email links.
 * The token is a per-recipient secret minted with the page target, so no
 * session is required — tapping "Acknowledge" on a phone stops escalation.
 */
export const Route = createFileRoute("/api/public/net/page-ack")({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
      GET: ({ request }) => handle(request),
    },
  },
});

async function handle(request: Request) {
  const token = new URL(request.url).searchParams.get("t") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(token)) return page("Invalid acknowledgement link.", 400);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("ack_page_by_token" as never, { _token: token } as never);
  const res = data as { ok?: boolean; error?: string } | null;

  if (error || !res?.ok) return page(res?.error ?? error?.message ?? "Could not acknowledge this page.", 400);
  return page("Page acknowledged. Escalation stopped.", 200);
}

function page(message: string, status: number) {
  const ok = status === 200;
  return new Response(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
     <title>Page acknowledgement</title>
     <div style="font-family:system-ui,sans-serif;background:#0b1220;color:#e2e8f0;min-height:100vh;display:grid;place-items:center;margin:0">
       <div style="text-align:center;padding:32px">
         <div style="font-size:44px">${ok ? "&#10003;" : "&#9888;"}</div>
         <h1 style="font-size:19px;margin:12px 0 6px">${message}</h1>
         <p style="color:#94a3b8;font-size:13px;margin:0">Clovr Labs paging</p>
       </div>
     </div>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );
}
