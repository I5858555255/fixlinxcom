// Unified asset-path resolver (works on both node-server and GitHub Pages deploys).
//
// Static data (DIY pages, news articles) and component-level constants
// (hero images, catalog covers, PDF links) all store PUBLIC asset paths
// like "/images/fasteners-hero.jpg" — the form that is valid on a plain
// node/Vercel deploy. On GitHub Pages the site lives under "/fixlinxcom/",
// so those paths must be prefixed at render time.
//
// How it works:
//  - Next.js "basePath" (set in next.config.ts for Pages builds) makes the
//    framework-issued URLs (chunks, css, next/link hrefs, the inlined
//    buildManifest) correct automatically.
//  - This helper covers the remaining "public asset" URLs that bypass the
//    framework: raw <img src>, <a href>, <iframe src>, and CSS @font-face
//    / url() references (compiled at build time, so PostCSS emits them
//    as-is and the browser resolves them against the page URL — under the
//    /fixlinxcom/ prefix they hit a non-existent /fixlinxcom/fonts/...).
//  - The prefix is detected from window.location.pathname at runtime:
//    Pages → first path segment "fixlinxcom" → prefix "/fixlinxcom";
//    localhost / any other host → no prefix → original path unchanged.
//
// Idempotent: paths that already carry the prefix are returned as-is, so
// calling assetPath() twice never produces "/fixlinxcom/fixlinxcom/...".

let cached: string | null = null;

function detectPrefix(): string {
  if (typeof window === "undefined") return ""; // SSR / build-time
  if (cached !== null) return cached;
  // Pages deploys have basePath=/fixlinxcom: page URLs always start with it,
  // so the FIRST path segment identifies the deployment root.
  const seg = window.location.pathname.split("/").filter(Boolean)[0] ?? "";
  cached = seg === "fixlinxcom" ? "/fixlinxcom" : "";
  return cached;
}

/**
 * Resolve a public-asset path for the current host.
 * Safe to call on already-prefixed paths (returns them unchanged).
 */
export function assetPath(p: string): string {
  const prefix = detectPrefix();
  if (!prefix) return p;
  if (p.startsWith(prefix)) return p; // double-prefix guard
  return p.startsWith("/") ? prefix + p : p;
}