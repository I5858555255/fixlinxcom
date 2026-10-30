import json, os, re, sys, hashlib, shutil
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = r"D:\projectAGI\offiialsite"
PUB = os.path.join(ROOT, "public", "sites", "dar-yu")

def md5size(p):
    st = os.stat(p)
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest(), st.st_size

# ---------- 1. asset inventory (recursive: images/, pdfs/, videos/ incl. subdirs) ----------
assets = {}
for sub in ("images", "pdfs", "videos"):
    d = os.path.join(PUB, sub)
    if not os.path.isdir(d):
        continue
    for dirpath, _, files in os.walk(d):
        for f in sorted(files):
            if f in ("manifest.json", "asset-catalog.json", ".gitkeep"):
                continue
            p = os.path.join(dirpath, f)
            rel = os.path.relpath(p, PUB).replace("\\", "/")
            h, size = md5size(p)
            ext = os.path.splitext(f)[1].lower()
            kind = "pdf" if ext == ".pdf" else ("video" if sub == "videos" else "image")
            assets[rel] = {"file": rel, "kind": kind, "hash": h, "size": size, "ext": ext}

# ---------- 2. usage refs with line-level location ----------
IMGID = re.compile(r'[A-Za-z0-9]{6,}_[a-f0-9]{16,}(?:~?mv2)?\.(?:jpg|jpeg|png|gif|webp)')
PDFID = re.compile(r'[A-Za-z0-9]{6,}_[a-f0-9]{16,}\.pdf')
LITERAL = re.compile(r'/sites/dar-yu/(?:images|pdfs|videos)/([A-Za-z0-9_~.\-]+(?:/[A-Za-z0-9_.\-]+)?)')

usage = {}  # rel path -> list of {page, line, context}

APPSRC = os.path.join(ROOT, "src", "app")
for dir_ in sorted(os.listdir(APPSRC)):
    p = os.path.join(APPSRC, dir_, "page.tsx")
    if not os.path.isfile(p):
        continue
    lines = open(p, encoding="utf-8", errors="ignore").read().split("\n")
    for i, line in enumerate(lines, 1):
        for m in LITERAL.finditer(line):
            key = m.group(0).replace("/sites/dar-yu/", "", 1)
            usage.setdefault(key, []).append({"page": dir_, "line": i, "context": line.strip()[:70]})
        for m in IMGID.finditer(line):
            key = "images/" + m.group(0)
            usage.setdefault(key, []).append({"page": dir_, "line": i, "context": line.strip()[:70]})
        for m in PDFID.finditer(line):
            key = "pdfs/" + m.group(0)
            usage.setdefault(key, []).append({"page": dir_, "line": i, "context": line.strip()[:70]})

# components (Header logo etc.)
COMP = os.path.join(ROOT, "src", "components")
for dirpath, _, files in os.walk(COMP):
    for f in files:
        if not f.endswith(".tsx"):
            continue
        rel = os.path.relpath(os.path.join(dirpath, f), ROOT).replace("\\", "/")
        lines = open(os.path.join(dirpath, f), encoding="utf-8", errors="ignore").read().split("\n")
        for i, line in enumerate(lines, 1):
            for m in LITERAL.finditer(line):
                key = m.group(0).replace("/sites/dar-yu/", "", 1)
                usage.setdefault(key, []).append({"page": f"component ({rel})", "line": i, "context": line.strip()[:70]})

# ---------- 3. role hints ----------
ROLE_HINTS = {
    "b2099f8b9c974130b21de1d5c6d1b71e": "旧站点 Logo（已停用）",
    "c09add13e517480b87b6a707479fd10a": "旧新闻页页脚照片条（news-en 已改版）",
    "4bb57b7b12244a16a433da3c8d97400c": "DIY PACK 子页 hero 背景",
    "fixlinx-catalog.pdf": "Fixlinx 产品图册（download-en 唯一下载项）",
}
def role_hint(fname):
    for k, v in ROLE_HINTS.items():
        if k in fname:
            return v
    return ""

# ---------- 4. merge ----------
for key, refs in usage.items():
    pages = []
    for r in refs:
        if r["page"] not in pages:
            pages.append(r["page"])
    if key in assets:
        a = assets[key]
        a["refs"] = refs
        a["used_in"] = sorted(pages)
        a["ref_count"] = len(refs)
        a["orphan"] = False
        a["role"] = role_hint(key)
    else:
        a = {"file": key,
             "kind": "image" if key.startswith("images/") else ("pdf" if key.startswith("pdfs/") else "video"),
             "hash": "", "size": 0, "ext": "",
             "refs": refs, "used_in": sorted(pages), "ref_count": len(refs),
             "orphan": False, "role": role_hint(key), "missing_on_disk": True}
        assets[key] = a

for a in assets.values():
    a.setdefault("refs", [])
    a.setdefault("used_in", [])
    a.setdefault("role", "")
    a.setdefault("ref_count", 0)
    a.setdefault("orphan", not a.get("used_in"))
    a.setdefault("missing_on_disk", False)

out = sorted(assets.values(), key=lambda x: (x["kind"], x["file"]))
json.dump(out, open(os.path.join(PUB, "asset-catalog.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)

# ---------- 5. report ----------
from collections import Counter
rep = [
    f"Total assets: {len(out)}",
    f"Kinds: {dict(Counter(a['kind'] for a in out))}",
    f"Orphans (on disk, unused): {sum(1 for a in out if a.get('orphan') and not a.get('missing_on_disk'))}",
    f"Missing on disk (referenced in code): {sum(1 for a in out if a.get('missing_on_disk'))}",
    f"Distinct referenced pages: {len(set(p for a in out for p in a['used_in']))}",
]
open(os.path.join(ROOT, "docs", "research", "dar-yu", "asset-report.txt"), "w", encoding="utf-8").write("\n".join(rep) + "\n")
print("\n".join(rep))
