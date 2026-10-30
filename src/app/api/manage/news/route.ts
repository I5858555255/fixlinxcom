import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "news");

function slugSafe(slug: string) {
  const s = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || `note-${Date.now().toString(36)}`;
}

export function GET() {
  if (!fs.existsSync(DATA_DIR)) {
    return NextResponse.json({ articles: [] });
  }
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"));
  const list = files.map((f) => {
    try {
      const a = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, f), "utf-8"),
      );
      return {
        slug: a.slug ?? f.replace(".json", ""),
        title: a.title ?? "",
        date: a.date ?? "",
        img: a.img ?? "",
        file: f,
      };
    } catch {
      return null;
    }
  });
  const articles = list.filter((a): a is NonNullable<typeof a> => a !== null);
  articles.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const slug = slugSafe(String(body.slug ?? "") || "");
  const title = String(body.title ?? "").trim();
  if (!slug || !title) {
    return NextResponse.json(
      { error: "slug and title are required" },
      { status: 400 },
    );
  }
  const article = {
    slug,
    title,
    date: String(body.date ?? new Date().toISOString().slice(0, 10)),
    img: String(body.img ?? ""),
    excerpt: String(body.excerpt ?? ""),
    body: Array.isArray(body.body) ? body.body.map(String) : [],
  };
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const p = path.join(DATA_DIR, `${slug}.json`);
  fs.writeFileSync(p, JSON.stringify(article, null, 2), "utf-8");
  return NextResponse.json({ ok: true, file: `data/news/${slug}.json` });
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
