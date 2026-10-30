import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "contact");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 250);
  const phone = String(body.phone ?? "").trim().slice(0, 50);
  const company = String(body.company ?? "").trim().slice(0, 250);
  const message = String(body.message ?? "").trim().slice(0, 2000);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Name, email and message are required" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address" }, { status: 400 });
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name,
    email,
    phone,
    company,
    message,
    createdAt: new Date().toISOString(),
  };
  const file = path.join(DATA_DIR, `${entry.id}.json`);
  fs.writeFileSync(file, JSON.stringify(entry, null, 2), "utf8");

  return NextResponse.json({ ok: true, id: entry.id, file: "data/contact/" + entry.id + ".json" });
}
