import fs from "fs";
import path from "path";

export type NewsArticle = {
  slug: string;
  title: string;
  date: string;
  img: string;
  excerpt: string;
  body: string[];
};

const DATA_DIR = path.join(process.cwd(), "data", "news");

function readAll(): NewsArticle[] {
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
  return readAll();
}

export function getArticle(slug: string): NewsArticle | undefined {
  const p = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(p)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")) as NewsArticle;
  } catch {
    return undefined;
  }
}
