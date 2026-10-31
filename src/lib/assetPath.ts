// Unified asset-path resolver (works on both node-server and GitHub Pages deploys).
//
// Static data (DIY pages, news articles) and component-level constants
// (hero images, catalog covers, PDF links) all store PUBLIC asset paths
// like "/images/fasteners-hero.jpg" — the form that is valid on a plain
// node/Vercel deploy. On GitHub Pages the site lives under "/fixlinxcom/",
// so those paths must be prefixed.
//
// Two mechanisms cover the full surface:
//
//  1. BUILD-TIME (Pages only, NEXT_OUTPUT=static):
//       next.config.ts sets basePath (default "/fixlinxcom"; empty when
//       NEXT_PUBLIC_PAGES_BASE="" for custom-domain root deploys), which
//       makes Next prefix every framework-issued URL (<link>, <script src>,
//       next/link hrefs, the inlined buildManifest chunk refs, next/image).
//     The same config also patches source .css files in place before
//     compilation — url("/fonts/...") → url("/fixlinxcom/fonts/...") —
//     and restores them on process exit.
//
//  2. RUNTIME (all deploys, self-guards on location):
//     This helper prefixes raw <img src>, <a href>, <iframe src> values
//     that come from data files / component constants (not covered by
//     basePath). Detection uses the FIRST path segment of
//     window.location.pathname: when it equals the build-time base path
//     (injected via NEXT_PUBLIC_PAGES_BASE), the prefix is applied.
//     On node-server / localhost the first segment is never the base,
//     so the original root-relative paths pass through unchanged.
//
// SSG caveat: during static pre-render there is no window, so
// assetPath() returns the raw path. The static HTML therefore ships the
// unprefixed src; the runtime script in src/app/layout.tsx (inline,
// MutationObserver-aware) re-writes those attributes on load, which is
// the same code path that fixes post-navigation DOM swaps. The visual
// flash on initial paint is bounded by the layout script running before
// the first paint of any routed content.
//
// Idempotent: paths that already carry the prefix are returned as-is, so
// calling assetPath() twice never produces "/fixlinxcom/fixlinxcom/...".

/**
 * Build-time injected: the Pages base path.
 *   - unset / ""      → "" (root deployment, default since www cutover)
 *   - "root"          → "" (explicit sentinel, same as default)
 *   - "/fixlinxcom"   → legacy sub-path build
 * NEXT_PUBLIC_PAGES_BASE is read by next.config.ts (build-time basePath)
 * and here (runtime assetPath detection).
 */
const RAW_BASE: string =
  process.env.NEXT_PUBLIC_PAGES_BASE?.trim() ?? "";
const BUILD_BASE: string =
  RAW_BASE === "root" ? "" : RAW_BASE;

let cached: string | null = null;

function detectPrefix(): string {
  if (typeof window === "undefined") return ""; // SSR / build-time
  if (cached !== null) return cached;
  // Root deployment (BUILD_BASE = "") → no prefix needed; assets served at /.
  if (BUILD_BASE === "") { cached = ""; return ""; }
  const seg = window.location.pathname.split("/").filter(Boolean)[0] ?? "";
  const baseSeg = BUILD_BASE.replace(/^\//, "");
  cached = seg === baseSeg ? BUILD_BASE : "";
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
