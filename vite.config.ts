import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { loadEnv } from "vite";

export default defineConfig(async ({ command, mode }) => {
  // Inject VITE_* env vars as compile-time defines (replicates what Lovable did)
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
  ];

  // Nitro build plugin (deploy target) — only active during `vite build`.
  // The "vercel" preset is only used when building on Vercel; Lovable's
  // deploy needs the default TanStack Start output (dist/ with SSR entry).
  const isVercel = process.env.VERCEL === "1";
  if (command === "build") {
    plugins.push(
      nitro({
        preset: isVercel ? "vercel" : "node-server",
        // @ts-expect-error nitro accepts externals at runtime
        externals: {
          inline: [
            "@supabase/supabase-js",
            "@supabase/functions-js",
            "@supabase/auth-js",
            "@supabase/postgrest-js",
            "@supabase/storage-js",
            "@supabase/realtime-js",
            "tslib"
          ]
        }
      }),
    );
  }

  plugins.push(react());

  // On Vercel builds, also mirror the static output into dist/ so a
  // `vite build` run outside `npm run build` still leaves a dist/ folder.
  if (command === "build" && isVercel) {
    plugins.push({
      name: "lovable-dist-mirror",
      apply: "build",
      buildApp: {
        order: "post",
        async handler() {
          const { cpSync, existsSync, rmSync } = await import("node:fs");
          const src = `${process.cwd()}/.vercel/output/static`;
          const dest = `${process.cwd()}/dist`;
          if (!existsSync(src)) return;
          rmSync(dest, { recursive: true, force: true });
          cpSync(src, dest, { recursive: true });
        },
      },
    } as any);
  }

  return {
    define: envDefine,
    css: { transformer: "lightningcss" as const },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    ssr: {
      noExternal: [
        "@supabase/supabase-js", 
        "@supabase/functions-js", 
        "@supabase/auth-js", 
        "@supabase/postgrest-js", 
        "@supabase/storage-js", 
        "@supabase/realtime-js", 
        "tslib"
      ],
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
  };
});
