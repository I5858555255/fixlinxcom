import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "diy");

function slugSafe(slug: string) {
  const s = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("full") === "1") {
    const slug = slugSafe(searchParams.get("slug") ?? "");
    const p = path.join(DATA_DIR, `${slug}.json`);
    if (!fs.existsSync(p)) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(JSON.parse(fs.readFileSync(p, "utf-8")));
  }
  if (!fs.existsSync(DATA_DIR)) {
    return NextResponse.json({ pages: [] });
  }
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"));
  const pages: Array<Record<string, unknown>> = [];
  for (const f of files) {
    try {
      const p = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, f), "utf-8"),
      );
      pages.push({
        slug: p.slug ?? f.replace(".json", ""),
        title: p.title ?? "",
        cover: p.cover ?? "",
        cardCount: Array.isArray(p.cards) ? p.cards.length : 0,
      });
    } catch {
      // skip malformed
    }
  }
  pages.sort((a, b) => String(a.slug).localeCompare(String(b.slug)));
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const slug = slugSafe(String(body.slug ?? ""));
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const title = String(body.title ?? "").trim();
  const cover = String(body.cover ?? "");
  const cards = Array.isArray(body.cards)
    ? body.cards.map((c: unknown) => {
        const cc = c as Record<string, unknown>;
        const out: Record<string, string> = {
          img: String(cc.img ?? ""),
          name: String(cc.name ?? ""),
        };
        if (cc.count) out.count = String(cc.count);
        return out;
      })
    : [];
  const rec = { slug, title, cover, cards };
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const p = path.join(DATA_DIR, `${slug}.json`);
  fs.writeFileSync(p, JSON.stringify(rec, null, 2), "utf-8");
  return NextResponse.json({ ok: true, file: `data/diy/${slug}.json` });
}

export async function DELETE(req: NextRequest) {
  const { slug } = await req.json().catch(() => ({}));
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const p = path.join(DATA_DIR, `${slugSafe(slug)}.json`);
  if (!fs.existsSync(p)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  fs.unlinkSync(p);
  return NextResponse.json({ ok: true });
}
