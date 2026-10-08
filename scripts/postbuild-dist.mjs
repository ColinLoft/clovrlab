// Copies the Vercel build output's static assets into dist/ so the
// Lovable deploy (which serves dist/) has a build to publish.
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const src = join(root, ".vercel", "output", "static");
const dest = join(root, "dist");

if (!existsSync(src)) {
  console.error(`postbuild-dist: ${src} not found — did the build run?`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log("postbuild-dist: copied .vercel/output/static -> dist/");
