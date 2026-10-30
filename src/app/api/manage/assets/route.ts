import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Unified live media registry.
// Scans public/ on every request so the admin page always reflects the
// current on-disk state (uploads / replacements / deletions show up live).

export const dynamic = "force-dynamic";

const PUB = path.join(process.cwd(), "public");

const EXT_MAP: Record<string, string> = {
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
  ".webp": "image",
  ".gif": "image",
  ".svg": "image",
  ".pdf": "pdf",
  ".mp4": "video",
  ".webm": "video",
};

type Entry = {
  path: string; // /images/...  (as served)
  kind: string;
  size: number;
  modified: string;
};

export function GET() {
  const entries: Entry[] = [];
  const walk = (dir: string) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        walk(p);
      } else {
        const ext = path.extname(name).toLowerCase();
        const kind = EXT_MAP[ext] ?? "other";
        if (kind === "other") continue; // only count media
        const rel = path.relative(PUB, p).split(path.sep).join("/");
        entries.push({
          path: "/" + rel,
          kind,
          size: st.size,
          modified: st.mtime.toISOString(),
        });
      }
    }
  };
  walk(PUB);
  entries.sort((a, b) => a.path.localeCompare(b.path));
  return NextResponse.json({
    count: entries.length,
    byKind: entries.reduce<Record<string, number>>((acc, e) => {
      acc[e.kind] = (acc[e.kind] ?? 0) + 1;
      return acc;
    }, {}),
    totalBytes: entries.reduce((s, e) => s + e.size, 0),
    entries,
    scannedAt: new Date().toISOString(),
  });
}
