import { DIY_PAGES, SLUG_INDEX } from "@/generated/static-data";

export type DiyCard = { img: string; name: string; count?: string };
export type DiyPage = {
  slug: string;
  title: string;
  cover: string;
  cards: DiyCard[];
};

/**
 * Static data layer.
 *
 * All data is inlined at build time by scripts/embed-static-data.py, so the
 * same module runs on a plain node server (npm start / dev) AND on GitHub
 * Pages static export — with zero node built-ins and no runtime fs reads.
 *
 * /manage edits are persisted to data/*.json for node deployments; on Pages
 * the published content is the build-time snapshot.
 */

export function getDiyPage(slug: string): DiyPage | null {
  const idx = SLUG_INDEX[slug];
  if (idx === undefined) return null;
  return DIY_PAGES[idx] ?? null;
}

export function listDiyPages(): DiyPage[] {
  return [...DIY_PAGES].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getDiySlugs(): string[] {
  return Object.keys(SLUG_INDEX).sort();
}
