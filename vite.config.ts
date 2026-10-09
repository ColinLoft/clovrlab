// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target, with zero-config auto-detection
//     for Vercel/Netlify/Cloudflare Pages), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    importProtection: {
      behavior: "error",
      client: {
        files: ["**/server/**"],
        specifiers: ["server-only"],
      },
    },
  },
  vite: {
    css: { transformer: "lightningcss" as const },
    ssr: {
      // Bundle the Supabase packages into the server build — the deploy
      // runtime has no runtime module resolution (fixes missing tslib errors).
      noExternal: [
        "@supabase/supabase-js",
        "@supabase/functions-js",
        "@supabase/auth-js",
        "@supabase/postgrest-js",
        "@supabase/storage-js",
        "@supabase/realtime-js",
        "tslib",
      ],
    },
  },
});
