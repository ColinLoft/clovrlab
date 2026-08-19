import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ request, next }) => {
  if (new URL(request.url).pathname.startsWith("/lovable/")) {
    return next();
  }
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const url = new URL(request.url);
      await supabaseAdmin.from("sys_error_log").insert({
        service: "web",
        path: url.pathname,
        method: request.method,
        status: 500,
        message: (error as any)?.message ? String((error as any).message).slice(0, 500) : String(error).slice(0, 500),
        stack: (error as any)?.stack ? String((error as any).stack).slice(0, 4000) : null,
      });
    } catch (logError) {
      console.error("Failed to record error", logError);
    }
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });

  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
