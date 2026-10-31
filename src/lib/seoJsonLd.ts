import { PAGE_META, absoluteUrl } from "./seo";
import type { Metadata } from "next";

/**
 * Build per-page BreadcrumbList JSON-LD for the main site sections.
 * Call inside a page's <head> (via <script type="application/ld+json">)
 * or export alongside the page's metadata.
 */
export function breadcrumbJsonLd(pageKey: keyof typeof PAGE_META): string {
  const m = PAGE_META[pageKey];
  const trail = [
    { name: "Home", url: absoluteUrl("/") },
  ];
  if (m.canonicalPath !== "/") {
    trail.push({ name: m.title.split(" | ")[0], url: absoluteUrl(m.canonicalPath) });
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return JSON.stringify(schema);
}

/** Article JSON-LD for news detail pages. */
export function articleJsonLd(article: {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  img?: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt?.slice(0, 200),
    datePublished: article.date,
    image: article.img ? absoluteUrl(article.img) : undefined,
    author: { "@type": "Organization", name: "Fixlinx Industrial Co., Ltd." },
    publisher: {
      "@type": "Organization",
      name: "Fixlinx Industrial Co., Ltd.",
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: absoluteUrl(`/news-en/${article.slug}/`),
  });
}
