# GitHub Pages sub-path resource fix — implementation notes

## Root cause
GitHub Pages project sites are served under `/<user>/<repo>/` (here
`/fixlinxcom/`), but the Next.js static export emitted **root-relative**
URLs for every asset:

- Chunk CSS/JS: `/_next/static/css/*.css`, `/_next/static/chunks/*.js`
- Public assets: `/images/...`, `/fonts/...`, `/sites/dar-yu/...`

The browser resolved these against the origin root
(`i5858555255.github.io/_next/...`, `/images/...`) → all 404.
The actual files live under `i5858555255.github.io/fixlinxcom/...`.

## Fix — three layers, all gated on NEXT_OUTPUT=static

### 1. basePath (next.config.ts)
`basePath: "/fixlinxcom"` is set **only in the Pages static-export branch**
(`isPages`), so:
- Node-server / Vercel / localhost builds are completely untouched
  (no basePath, no CSS rewrite) — `npm run dev` and `npm start` work as before.
- Next.js automatically prefixes every **framework-issued** URL:
  `<link rel="stylesheet">`, `<script src>`, `next/link` hrefs, the
  inlined `buildManifest` chunk refs, and `next/image` srcs.
- `assetPrefix` is intentionally NOT set (would double-prefix).

### 2. CSS url() rewrite (next.config.ts source patch)
PostCSS emits `url("/fonts/IBMPlexSans-Bold.ttf")` and
`url("/images/factory/drone-interior-1.jpg")` **verbatim** into the
compiled CSS — basePath does NOT rewrite these.
`next.config.ts` (Pages branch only) patches every `.css` file under
`src/` **before compilation** — `url("/fonts/...")` → `url("/fixlinxcom/fonts/...")` —
and restores the originals on process exit (same pattern as the API-stub
and force-dynamic steps). Node-server mode: the patch never runs → CSS
source files stay clean.

### 3. Runtime asset prefix for raw JSX refs (src/lib/assetPath.ts)
`basePath` does NOT prefix raw string-literal `<img src>`, `<a href>`,
or `<iframe src>` written directly in JSX (they come from data files /
component constants). The `assetPath()` helper resolves these at
**runtime** using `window.location.pathname` first path segment:

```
// on i5858555255.github.io/fixlinxcom/...  →  prefix "/fixlinxcom"
// on localhost:3000/...                     →  prefix "" (no-op)
assetPath("/images/fasteners-hero.jpg")
// → "/fixlinxcom/images/fasteners-hero.jpg" (Pages)
// → "/images/fasteners-hero.jpg"            (localhost)
```

All `<img>`, `<a>`, and `<iframe>` refs in:
- `Header.tsx`, `PageHero.tsx`, `HomeCards.tsx`, `Footer.tsx`
- `about-us-en`, `contact-en`, `diy-pack-en`, `download-en`,
  `fasteners-en`, `products-en`, `quality-en`
- All 47 `01-1` … `20-more-selections-en` DIY sub-pages
- `news-en/page.tsx` + `[slug]/page.tsx`
- `manage/ManageClient.tsx`

…are wrapped with `assetPath(...)`. Idempotent: double-prefix guard
(`if p.startsWith(prefix) return p`).

An inline script in `src/app/layout.tsx` additionally walks the DOM on
load (and re-walks on client-side router navigation via MutationObserver)
to prefix any remaining raw absolute URLs that slipped through SSG.

## Verification checklist
- [x] `npm run build` (Pages mode, NEXT_OUTPUT=static) exits 0
- [x] `out/` contains no `/fixlinxcom/fixlinxcom` double-prefix anywhere
- [x] All framework CSS/JS refs in `out/index.html` carry `/fixlinxcom/`
- [x] All compiled CSS `url()` refs carry `/fixlinxcom/`
- [x] Raw `<img src>` in SSG HTML are corrected at runtime by the layout script
- [x] `next start` on port 3200 (node-server mode): no `/fixlinxcom` in HTML,
  CSS 200, source `.css` files restored after Pages build
- [ ] Push to GitHub main → CI builds → Pages deploy → verify live
