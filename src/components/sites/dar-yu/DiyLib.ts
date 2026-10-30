import fs from "node:fs";
import path from "node:path";

export type DiyCard = { img: string; name: string; count?: string };
export type DiyPage = {
  slug: string;
  title: string;
  cover: string;
  cards: DiyCard[];
};

const DATA_DIR = path.join(process.cwd(), "data", "diy");

export function getDiyPage(slug: string): DiyPage | null {
  const f = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, "utf-8")) as DiyPage;
  } catch {
    return null;
  }
}

export function listDiyPages(): DiyPage[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(DATA_DIR, f), "utf-8"),
        ) as DiyPage;
      } catch {
        return null;
      }
    })
    .filter((p): p is DiyPage => p !== null);
}
