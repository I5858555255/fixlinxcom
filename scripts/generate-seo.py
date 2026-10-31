#!/usr/bin/env python3
"""
Generate sitemap.xml and robots.txt for the static-exported Fixlinx site.
Writes to out/ after build.

Usage:  python scripts/generate-seo.py
        python scripts/generate-seo.py --output-dir out

Env overrides (set via GitHub Actions or locally):
  FIXLINX_SITEMAP_BASE_URL   default: https://i5858555255.github.io/fixlinxcom
  FIXLINX_ROBOTS_DISALLOW   extra path to disallow (default: /manage/ /assets-en/ /api/)
"""
import json, os, re, sys, argparse
from pathlib import Path
from datetime import datetime, timezone

def collect_routes(out_dir: Path) -> list[str]:
    """Find all .html files in out/ → derive route paths (no trailing slash, no /404.html)."""
    routes = set()
    for f in out_dir.rglob("*.html"):
        rel = f.relative_to(out_dir).as_posix()
        if rel == "404.html":
            continue
        # /index.html → /
        # /foo/index.html → /foo
        # /foo.html → /foo  (rare, skip)
        if rel.endswith("/index.html"):
            path = "/" + rel[: -len("/index.html")]
            if path == "/":
                path = "/"
            routes.add(path)
        elif not rel.endswith(".html"):
            continue
        else:
            # top-level .html files that are not index.html — treat as routes
            routes.add("/" + rel.removesuffix(".html"))
    return sorted(routes)

def build_sitemap(routes: list[str], base_url: str) -> str:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    entries = []
    # Home first with high priority
    for r in routes:
        prio = 1.0 if r == "/" else (0.8 if len(r.split("/")) == 2 else 0.5)
        entries.append(
            f'  <url>\n'
            f'    <loc>{base_url.rstrip("/")}{r}</loc>\n'
            f'    <lastmod>{today}</lastmod>\n'
            f'    <priority>{prio}</priority>\n'
            f'  </url>'
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )

def build_robots(base_url: str, disallow: list[str]) -> str:
    lines = [
        "# Fixlinx Industrial — robots.txt",
        f"# Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}",
        f"User-agent: *",
    ]
    for d in disallow:
        lines.append(f"Disallow: {d}")
    # Allow AI crawlers explicitly
    lines.append("")
    lines.append("# Allow AI / GEO crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)")
    lines.append("User-agent: GPTBot")
    lines.append("Allow: /")
    lines.append("")
    lines.append("User-agent: ClaudeBot")
    lines.append("Allow: /")
    lines.append("")
    lines.append("User-agent: PerplexityBot")
    lines.append("Allow: /")
    lines.append("")
    lines.append(f"Sitemap: {base_url.rstrip('/')}/sitemap.xml")
    return "\n".join(lines) + "\n"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", default="out")
    ap.add_argument("--base-url", default=None)
    args = ap.parse_args()

    out_dir = Path(args.output_dir).resolve()
    base_url = (
        args.base_url
        or os.environ.get("FIXLINX_SITEMAP_BASE_URL", "").strip()
        or "https://i5858555255.github.io/fixlinxcom"
    )
    # Read disallow list from env or default
    default_disallow = ["/manage/", "/assets-en/", "/api/"]
    env_disallow = os.environ.get("FIXLINX_ROBOTS_DISALLOW", "")
    disallow = [d.strip() for d in env_disallow.split(",") if d.strip()] if env_disallow else default_disallow

    if not out_dir.exists():
        print(f"ERROR: output dir {out_dir} does not exist. Run the build first.", file=sys.stderr)
        sys.exit(1)

    routes = collect_routes(out_dir)
    print(f"Found {len(routes)} routes in {out_dir}")

    sitemap = build_sitemap(routes, base_url)
    robots = build_robots(base_url, disallow)

    (out_dir / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    (out_dir / "robots.txt").write_text(robots, encoding="utf-8")

    print(f"Wrote {out_dir/'sitemap.xml'} ({len(routes)} URLs)")
    print(f"Wrote {out_dir/'robots.txt'} (disallow: {disallow})")

if __name__ == "__main__":
    main()
