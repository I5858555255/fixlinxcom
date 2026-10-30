import fs from "node:fs";
import path from "node:path";
import { NEWS_ARTICLES } from "@/generated/static-data";

export type NewsArticle = {
  slug: string;
  title: string;
  date: string;
  img: string;
  excerpt: string;
  body: string[];
};

/**
 * Static data layer. Articles are inlined at build time by
 * scripts/embed-static-data.py; the node-server read path is kept only for
 * /manage (which can add/remove news) — those mutations write to
 * data/news/*.json and apply on the node deployment.
 */

function isNode(): boolean {
  return typeof process !== "undefined" && !!process.versions?.node;
}

function readAllLive(): NewsArticle[] {
  const DATA_DIR = path.join(process.cwd(), "data", "news");
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(DATA_DIR, f), "utf-8"),
        ) as NewsArticle;
      } catch {
        return null;
      }
    })
    .filter((a): a is NewsArticle => a !== null)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getNewsArticles(): NewsArticle[] {
  // live node deployment: prefer fresh on-disk data (post /manage edits)
  if (isNode()) {
    const live = readAllLive();
    if (live.length) return live;
  }
  return NEWS_ARTICLES;
}

export function getArticle(slug: string): NewsArticle | undefined {
  if (isNode()) {
    const DATA_DIR = path.join(process.cwd(), "data", "news");
    const p = path.join(DATA_DIR, `${slug}.json`);
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8")) as NewsArticle;
      } catch {
        /* fall through to inlined */
      }
    }
  }
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}
