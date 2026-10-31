import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

/**
 * GitHub Pages static export mode.
 *
 * The GitHub Actions workflow sets NEXT_OUTPUT=static which:
 *   - enables `output: "export"` so `next build` emits a plain `out/` dir
 *   - basePath: controlled by NEXT_PUBLIC_PAGES_BASE (default "" = root,
 *     i.e. www.fixlinx.com custom-domain build; set to "/fixlinxcom" for
 *     the legacy GitHub Pages project site sub-path)
 *   - switches `trailingSlash` to true (GitHub Pages URL convention)
 *
 * Public assets that bypass the framework are covered by:
 *   - src/lib/assetPath.ts  — runtime helper for JSX <img>/<a>/<iframe> src
 *   - CSS url() source patch in this file (sub-path builds only)
 *
 * API routes can't exist in a static export, so in this mode they are
 * replaced with no-op stubs on disk during the build and restored to the
 * real implementations immediately after. Node-server / Vercel builds
 * (NEXT_OUTPUT unset) skip all of this and keep the real routes, with no
 * basePath — local dev on localhost:3000 keeps working as-is.
 */
const isPages = process.env.NEXT_OUTPUT === "static";
// Build base path (env-overridable).
//
//   NEXT_PUBLIC_PAGES_BASE unset/empty  → "" (root; www.fixlinx.com cutover)
//   NEXT_PUBLIC_PAGES_BASE = "/fixlinxcom" → sub-path build (legacy Pages)
//   NEXT_PUBLIC_PAGES_BASE = "root"    → "" (sentinel, same as unset)
const RAW_BASE = process.env.NEXT_PUBLIC_PAGES_BASE ?? "";
const PAGES_BASE: string =
  RAW_BASE === "root" ? "" : RAW_BASE;
const HAS_BASE = PAGES_BASE !== "";
const EFFECTIVE_BASE = PAGES_BASE;

const API_STUB = `/* AUTO-STUB: API routes are unavailable in the GitHub Pages static export. */
import { NextResponse } from "next/server";
export const dynamic = "force-static";
export async function GET() {
  return NextResponse.json({ ok: false, error: "API routes are disabled on GitHub Pages static hosting" }, { status: 501 });
}
export async function POST() { return GET(); }
export async function DELETE() { return GET(); }
`;

let restoreFns: Array<() => void> = [];

if (isPages) {
  // 1. Replace every src/app/api/**/route.ts with a stub (back up originals)
  const apiDir = path.join(process.cwd(), "src", "app", "api");
  const stubbed: Array<{ file: string; original: string }> = [];
  const walk = (d: string) => {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "route.ts") {
        stubbed.push({ file: full, original: fs.readFileSync(full, "utf-8") });
      }
    }
  };
  walk(apiDir);
  for (const { file, original } of stubbed) {
    fs.writeFileSync(file, API_STUB, "utf-8");
    restoreFns.push(() => fs.writeFileSync(file, original, "utf-8"));
  }
  console.log(`[next.config] Pages static export: stubbed ${stubbed.length} API routes`);

  // 2. Disable `force-dynamic` in page components so they pre-render
  //    from the inlined static-data (restored after build, so the repo
  //    stays clean and node-server mode still gets real-time data)
  const appDir = path.join(process.cwd(), "src", "app");
  const patched: Array<{ file: string; original: string }> = [];
  const patchWalk = (d: string) => {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) patchWalk(full);
      else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        const original = fs.readFileSync(full, "utf-8");
        const patchedText = original.replace(
          /export const dynamic = "force-dynamic";\n?/g,
          "",
        );
        if (patchedText !== original) {
          fs.writeFileSync(full, patchedText);
          patched.push({ file: full, original });
        }
      }
    }
  };
  patchWalk(appDir);
  for (const { file, original } of patched) {
    restoreFns.push(() => fs.writeFileSync(file, original, "utf-8"));
  }
  console.log(
    `[next.config] Pages static export: disabled force-dynamic in ${patched.length} files`,
  );

  // 3. Prefix public-asset CSS url() references (/fonts/, /images/, /sites/)
  //    with the base path (default /fixlinxcom) so @font-face + background
  //    images resolve under the GitHub Pages sub-path. No-op when
  //    NEXT_PUBLIC_PAGES_BASE="" (custom-domain root deployment).
  //    Source files are patched in place and the originals restored on
  //    process exit, so node-server mode is unaffected.
  if (HAS_BASE) {
    const srcCssWalk = (d: string, out: string[]) => {
      if (!fs.existsSync(d)) return;
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) srcCssWalk(full, out);
        else if (entry.name.endsWith(".css")) out.push(full);
      }
    };
    const cssFiles: string[] = [];
    srcCssWalk(path.join(process.cwd(), "src"), cssFiles);
    const cssPatched: Array<{ file: string; original: string }> = [];
    const cssRe = /url\(\s*(["']?)(\/(?:images|fonts|sites)\/[A-Za-z0-9\-_./]+)(["']?)\s*\)/g;
    for (const file of cssFiles) {
      const original = fs.readFileSync(file, "utf-8");
      const patchedText = original.replace(cssRe, (m, q1: string, p: string, q2: string) =>
        p.startsWith(EFFECTIVE_BASE + "/") ? m : `url(${q1}${EFFECTIVE_BASE}${p}${q2})`,
      );
      if (patchedText !== original) {
        fs.writeFileSync(file, patchedText, "utf-8");
        cssPatched.push({ file, original });
      }
    }
    for (const { file, original } of cssPatched) {
      restoreFns.push(() => fs.writeFileSync(file, original, "utf-8"));
    }
    console.log(
      `[next.config] Pages static export: prefixed css url() with ${PAGES_BASE} in ${cssPatched.length} files`,
    );
  } else {
    console.log(
      "[next.config] Pages static export: NEXT_PUBLIC_PAGES_BASE empty — skipping CSS url() prefix",
    );
  }

  // 4. /assets-en redirect() is unsupported by static export; swap it for
  //    a meta-refresh page (restored after build).
  const assetsPage = path.join(appDir, "assets-en", "page.tsx");
  if (fs.existsSync(assetsPage)) {
    const original = fs.readFileSync(assetsPage, "utf-8");
    fs.writeFileSync(
      assetsPage,
      `export default function AssetsRedirect() {\n  return (\n    <div suppressHydrationWarning>\n      <meta httpEquiv="refresh" content="0; url=/manage/" />\n      <p>Redirecting to <a href="/manage/">/manage/</a>...</p>\n    </div>\n  );\n}\n`,
      "utf-8",
    );
    restoreFns.push(() => fs.writeFileSync(assetsPage, original, "utf-8"));
  }

  // 4. Restore everything on process exit (covers both success and failure)
  process.on("exit", () => {
    for (const fn of restoreFns) {
      try {
        fn();
      } catch {
        /* ignore — file may already be back */
      }
    }
  });
}

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  ...(isPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        // GitHub Pages project site lives at /<user>/<repo>/; every
        // framework-issued URL gets this prefix. Do NOT add assetPrefix —
        // it would prefix asset URLs a second time (/fixlinxcom/fixlinxcom/...).
        // With NEXT_PUBLIC_PAGES_BASE="root" the site is served at root —
        // omit basePath so all URLs resolve at "/".
        ...(HAS_BASE ? { basePath: EFFECTIVE_BASE } : {}),
      }
    : {}),
};

export default nextConfig;
