"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type NewsMeta = {
  slug: string;
  title: string;
  date: string;
  img: string;
  file: string;
};

/**
 * On GitHub Pages (static export) there is no node server, so the
 * /api/manage/* endpoints are unavailable. This flag is detected at
 * runtime so the admin UI degrades gracefully: data comes from the
 * build-time inlined snapshot, and mutations are disabled with a
 * clear notice.
 */
const IS_STATIC =
  typeof window !== "undefined" &&
  /github\.io|\.pages\./i.test(window.location.hostname);

/** Safe JSON fetcher: returns null when the response is not JSON
 *  (e.g. GitHub Pages serves 404 HTML instead of an API error). */
async function safeJson(url: string, init?: RequestInit): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(url, init);
    const ct = r.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) return null;
    return (await r.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

type Asset = {
  path: string;
  kind: string;
  size: number;
  modified: string;
};

type NewsDraft = {
  slug: string;
  title: string;
  date: string;
  img: string;
  excerpt: string;
  body: string;
};

type DiyPageMeta = {
  slug: string;
  title: string;
  cover: string;
  cardCount: number;
};

type DiyCard = { img: string; name: string; count?: string };
type DiyFull = { slug: string; title: string; cover: string; cards: DiyCard[] };
type DiyDraft = {
  slug: string;
  title: string;
  cover: string;
  cards: string; // JSON string, one {img,name} per line
};

const EMPTY_NEWS: NewsDraft = {
  slug: "",
  title: "",
  date: "",
  img: "",
  excerpt: "",
  body: "",
};

function fmtSize(n: number) {
  if (n >= 1048576) return (n / 1048576).toFixed(2) + " MB";
  return Math.max(1, Math.round(n / 1024)) + " KB";
}

export function ManageClient() {
  const [tab, setTab] = useState<"news" | "diy" | "assets">("news");

  /* ---- news state ---- */
  const [articles, setArticles] = useState<NewsMeta[]>([]);
  const [draft, setDraft] = useState<NewsDraft>(EMPTY_NEWS);
  const [note, setNote] = useState("");

  /* ---- assets state ---- */
  const [assets, setAssets] = useState<Asset[]>([]);
  const [scannedAt, setScannedAt] = useState("");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  /* ---- diy state ---- */
  const [diyPages, setDiyPages] = useState<DiyPageMeta[]>([]);
  const [diyFull, setDiyFull] = useState<DiyFull | null>(null);
  const [diySel, setDiySel] = useState("");
  const [diyDraft, setDiyDraft] = useState<DiyDraft>({
    slug: "",
    title: "",
    cover: "",
    cards: "",
  });
  const [diyNote, setDiyNote] = useState("");

  const loadNews = useCallback(async () => {
    setNote("");
    if (IS_STATIC) {
      setArticles([]);
      return;
    }
    const j = await safeJson("/api/manage/news");
    setArticles((j?.articles as NewsMeta[]) ?? []);
  }, []);

  const loadAssets = useCallback(async () => {
    if (IS_STATIC) {
      setAssets([]);
      setScannedAt("(static build — live registry unavailable)");
      return;
    }
    const j = await safeJson("/api/manage/assets");
    setAssets((j?.entries as Asset[]) ?? []);
    setScannedAt((j?.scannedAt as string) ?? "");
  }, []);

  const loadDiy = useCallback(async () => {
    if (IS_STATIC) {
      setDiyPages([]);
      return;
    }
    const j = await safeJson("/api/manage/diy");
    setDiyPages((j?.pages as DiyPageMeta[]) ?? []);
  }, []);

  useEffect(() => {
    loadNews();
    loadAssets();
    loadDiy();
  }, [loadNews, loadAssets, loadDiy]);

  async function submitArticle(e: React.FormEvent) {
    e.preventDefault();
    if (IS_STATIC) {
      setNote("Static hosting (GitHub Pages) has no server — news edits are disabled here.");
      return;
    }
    if (!draft.slug.trim() || !draft.title.trim()) {
      setNote("slug and title are required");
      return;
    }
    const payload = {
      slug: draft.slug,
      title: draft.title,
      date: draft.date || new Date().toISOString().slice(0, 10),
      img: draft.img,
      excerpt: draft.excerpt,
      body: draft.body
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
    };
    const j = await safeJson("/api/manage/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (j?.ok) {
      setNote(`Saved data/news/${payload.slug}.json`);
      setDraft(EMPTY_NEWS);
      loadNews();
    } else {
      setNote((j?.error as string) || "save failed");
    }
  }

  async function removeArticle(slug: string) {
    if (IS_STATIC) {
      setNote("Static hosting (GitHub Pages) has no server — news deletion is disabled here.");
      return;
    }
    if (!confirm(`Delete ${slug}?`)) return;
    const j = await safeJson("/api/manage/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setNote((j?.ok ? `Deleted ${slug}` : (j?.error as string) || "delete failed") ?? "");
    loadNews();
  }

  /* ---- diy helpers ---- */
  async function openDiy(slug: string) {
    setDiySel(slug);
    setDiyNote("");
    if (IS_STATIC) {
      // static build: load from inlined snapshot via the same API shape is
      // unavailable; fall back to empty draft so the form is visible but
      // clearly read-only.
      setDiyFull(null);
      setDiyDraft({ slug, title: "", cover: "", cards: "" });
      return;
    }
    const j = await safeJson(
      `/api/manage/diy?full=1&slug=${encodeURIComponent(slug)}`,
    );
    if (j?.cards) {
      setDiyFull(j as unknown as DiyFull);
      setDiyDraft({
        slug: (j.slug as string) ?? slug,
        title: (j.title as string) ?? "",
        cover: (j.cover as string) ?? "",
        cards: (j.cards as DiyCard[])
          .map((c: DiyCard) => JSON.stringify({ img: c.img, name: c.name }))
          .join("\n"),
      });
    } else {
      setDiyFull(null);
      setDiyDraft({ slug, title: "", cover: "", cards: "" });
    }
  }

  async function submitDiy(e: React.FormEvent) {
    e.preventDefault();
    if (IS_STATIC) {
      setDiyNote("Static hosting (GitHub Pages) has no server — DIY page edits are disabled here.");
      return;
    }
    if (!diyDraft.slug.trim() || !diyDraft.title.trim()) {
      setDiyNote("slug and title are required");
      return;
    }
    const cards: DiyCard[] = diyDraft.cards
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        try {
          const o = JSON.parse(l);
          return { img: o.img ?? "", name: o.name ?? "" };
        } catch {
          return null;
        }
      })
      .filter((c): c is DiyCard => c !== null);
    const j = await safeJson("/api/manage/diy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: diyDraft.slug,
        title: diyDraft.title,
        cover: diyDraft.cover,
        cards,
      }),
    });
    if (j?.ok) {
      setDiyNote(`Saved data/diy/${diyDraft.slug}.json — page now shows only these cards.`);
      setDiyDraft({ slug: "", title: "", cover: "", cards: "" });
      setDiyFull(null);
      loadDiy();
    } else {
      setDiyNote((j?.error as string) || "save failed");
    }
  }

  async function removeDiyPage(slug: string) {
    if (IS_STATIC) {
      setDiyNote("Static hosting (GitHub Pages) has no server — DIY page deletion is disabled here.");
      return;
    }
    if (!confirm(`Delete data/diy/${slug}.json?`)) return;
    const j = await safeJson("/api/manage/diy", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setDiyNote((j?.ok ? `Deleted ${slug}` : (j?.error as string) || "delete failed") ?? "");
    loadDiy();
  }

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (filter !== "all" && a.kind !== filter) return false;
      if (q && !a.path.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [assets, filter, q]);

  const byKind = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of assets) m[a.kind] = (m[a.kind] ?? 0) + 1;
    return m;
  }, [assets]);

  return (
    <div className="mg-body">
      <div className="mg-tabs">
        <button
          className={"mg-tab" + (tab === "news" ? " mg-tab--on" : "")}
          onClick={() => setTab("news")}
        >
          NEWS ARTICLES ({articles.length})
        </button>
        <button
          className={"mg-tab" + (tab === "diy" ? " mg-tab--on" : "")}
          onClick={() => setTab("diy")}
        >
          DIY PACK PAGES ({diyPages.length})
        </button>
        <button
          className={"mg-tab" + (tab === "assets" ? " mg-tab--on" : "")}
          onClick={() => setTab("assets")}
        >
          MEDIA REGISTRY ({assets.length})
        </button>
      </div>

      {tab === "news" && (
        <section className="mg-panel">
          <h2 className="mg-h2">ARTICLES</h2>
          <p className="mg-hint">
            Articles live in <code>data/news/&lt;slug&gt;.json</code>; the NEWS
            section reads them at request time. Save a draft below to add or
            update an article.
          </p>
          <div className="mg-news-list">
            {articles.length === 0 && (
              <p className="mg-empty">No articles yet.</p>
            )}
            {articles.map((a) => (
              <div key={a.slug} className="mg-news-row">
                {a.img && (
                  <img
                    className="mg-news-thumb"
                    src={a.img}
                    alt={a.title}
                  />
                )}
                <div className="mg-news-meta">
                  <p className="mg-news-title">{a.title}</p>
                  <p className="mg-news-date">
                    {a.date} · {a.file} ·{" "}
                    <Link href={`/news-en/${a.slug}`} target="_blank">
                      view
                    </Link>
                  </p>
                </div>
                <button
                  className="mg-btn mg-btn--danger"
                  onClick={() => removeArticle(a.slug)}
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>

          <h2 className="mg-h2">SAVE ARTICLE</h2>
          <form className="mg-form" onSubmit={submitArticle}>
            <div className="mg-row">
              <label>
                SLUG
                <input
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft({ ...draft, slug: e.target.value })
                  }
                  placeholder="catalog-launch"
                  required
                />
              </label>
              <label>
                DATE
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </label>
            </div>
            <label>
              TITLE
              <input
                value={draft.title}
                onChange={(e) =>
                  setDraft({ ...draft, title: e.target.value })
                }
                placeholder="Fixlinx launches global fastener catalog"
                required
              />
            </label>
            <div className="mg-row">
              <label>
                IMAGE (site-absolute path, e.g. /images/...)
                <input
                  value={draft.img}
                  onChange={(e) => setDraft({ ...draft, img: e.target.value })}
                  placeholder="/images/factory/drone-interior-1.jpg"
                />
              </label>
              <label>
                EXCERPT
                <input
                  value={draft.excerpt}
                  onChange={(e) =>
                    setDraft({ ...draft, excerpt: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              BODY (one paragraph per line)
              <textarea
                rows={5}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </label>
            <div className="mg-form__foot">
              <button type="submit" className="mg-btn">
                SAVE
              </button>
              {note && <span className="mg-note">{note}</span>}
            </div>
          </form>
        </section>
      )}

      {tab === "diy" && (
        <section className="mg-panel">
          <h2 className="mg-h2">DIY PACK PAGES</h2>
          <p className="mg-hint">
            Each DIY PACK sub-page reads <code>data/diy/&lt;slug&gt;.json</code>{" "}
            at request time. The unrelated legacy Wix product cards have been
            cleared — pages now show only the managed cards below. Pick a page,
            edit its cards, and save.
          </p>

          <div className="mg-diy-layout">
            <div className="mg-diy-list">
              {diyPages.map((p) => (
                <div
                  key={p.slug}
                  className={
                    "mg-diy-row" + (diySel === p.slug ? " mg-diy-row--on" : "")
                  }
                >
                  <button className="mg-diy-pick" onClick={() => openDiy(p.slug)}>
                    <span className="mg-diy-slug">{p.slug}</span>
                    <span className="mg-diy-count">{p.cardCount} cards</span>
                  </button>
                  <Link
                    className="mg-diy-view"
                    href={`/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    view
                  </Link>
                  <button
                    className="mg-btn mg-btn--danger mg-btn--sm"
                    onClick={() => removeDiyPage(p.slug)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <form className="mg-form mg-diy-form" onSubmit={submitDiy}>
              <h2 className="mg-h2">
                {diySel ? `EDIT · ${diySel}` : "NEW / SELECT A PAGE"}
              </h2>
              <div className="mg-row">
                <label>
                  SLUG
                  <input
                    value={diyDraft.slug}
                    onChange={(e) =>
                      setDiyDraft({ ...diyDraft, slug: e.target.value })
                    }
                    placeholder="05-1-blow-case-en"
                    required
                  />
                </label>
                <label>
                  TITLE
                  <input
                    value={diyDraft.title}
                    onChange={(e) =>
                      setDiyDraft({ ...diyDraft, title: e.target.value })
                    }
                    placeholder="05 Blister"
                    required
                  />
                </label>
              </div>
              <label>
                COVER (site-absolute image path)
                <input
                  value={diyDraft.cover}
                  onChange={(e) =>
                    setDiyDraft({ ...diyDraft, cover: e.target.value })
                  }
                  placeholder="/sites/dar-yu/images/diy-boxes/box-12-hex-nut-nylon-locknut.png"
                />
              </label>
              <label>
                CARDS — one JSON per line: {"{"} "img", "name" {"}"}
                <textarea
                  rows={7}
                  value={diyDraft.cards}
                  onChange={(e) =>
                    setDiyDraft({ ...diyDraft, cards: e.target.value })
                  }
                  placeholder={'{"img":"/images/fasteners/wood-screws-1.jpg","name":"WOOD SCREWS"}'}
                />
              </label>
              <div className="mg-form__foot">
                <button type="submit" className="mg-btn">
                  SAVE PAGE
                </button>
                {diyNote && <span className="mg-note">{diyNote}</span>}
              </div>
            </form>
          </div>
        </section>
      )}

      {tab === "assets" && (
        <section className="mg-panel">
          <h2 className="mg-h2">LIVE MEDIA REGISTRY</h2>
          <p className="mg-hint">
            Scanned from disk on every request — uploads, replacements and
            deletions under <code>public/</code> appear here without a
            rebuild.
            {scannedAt && ` Last scan ${new Date(scannedAt).toLocaleString()}.`}
          </p>
          <div className="mg-stats">
            <span className="mg-stat">
              {byKind.image ?? 0} images · {byKind.pdf ?? 0} pdf ·{" "}
              {byKind.video ?? 0} video
            </span>
            <button className="mg-btn mg-btn--ghost" onClick={loadAssets}>
              RESCAN
            </button>
          </div>
          <div className="mg-row mg-filters">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mg-select"
            >
              <option value="all">all</option>
              <option value="image">image</option>
              <option value="pdf">pdf</option>
              <option value="video">video</option>
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="filter by path..."
              className="mg-search"
            />
          </div>
          <div className="mg-asset-table">
            {filteredAssets.map((a) => (
              <div key={a.path} className="mg-asset">
                <span className="mg-asset__kind">{a.kind}</span>
                <span className="mg-asset__path">{a.path}</span>
                <span className="mg-asset__size">{fmtSize(a.size)}</span>
                <Link
                  className="mg-asset__open"
                  href={a.path}
                  target="_blank"
                  rel="noreferrer"
                >
                  open
                </Link>
              </div>
            ))}
            {filteredAssets.length === 0 && (
              <p className="mg-empty">No media files match.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
