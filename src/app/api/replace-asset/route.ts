import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const PUB_ROOT = path.join(process.cwd(), "public", "sites", "dar-yu");

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart/form-data body" }, { status: 400 });
  }

  const targetRel = form.get("target") as string | null;
  const file = form.get("file");
  if (!targetRel || !(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Missing target or file field" }, { status: 400 });
  }

  const kind = targetRel.startsWith("pdfs/")
    ? "pdf"
    : targetRel.startsWith("videos/")
      ? "video"
      : "image";
  const ext = path.extname(targetRel).toLowerCase();
  const allowed: Record<string, string[]> = {
    image: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    pdf: [".pdf"],
    video: [".mp4", ".webm", ".mov", ".m4v", ".ogv"],
  };
  if (!allowed[kind].includes(ext)) {
    return NextResponse.json(
      { ok: false, error: `Extension ${ext || "(none)"} not allowed for ${kind}` },
      { status: 400 },
    );
  }

  const size = file.size;
  if (size > 50 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "File exceeds 50 MB cap" }, { status: 413 });
  }
  if (size === 0) {
    return NextResponse.json({ ok: false, error: "Uploaded file is empty" }, { status: 400 });
  }

  const norm = path.normalize(targetRel);
  const target = path.join(PUB_ROOT, norm);
  if (!target.startsWith(PUB_ROOT + path.sep)) {
    return NextResponse.json({ ok: false, error: "Path traversal rejected" }, { status: 400 });
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  const hadExisting = fs.existsSync(target);
  let backup = "";
  if (hadExisting) {
    backup = target + ".bak";
    if (fs.existsSync(backup)) fs.unlinkSync(backup);
    fs.renameSync(target, backup);
  }
  fs.writeFileSync(target, bytes);

  return NextResponse.json({
    ok: true,
    path: norm,
    size,
    backup: hadExisting ? norm + ".bak" : null,
  });
}
