import type { Metadata } from "next";
import { BRAND, ogImageUrl, absoluteUrl, type PageMeta } from "./seo";

/**
 * Build a complete Metadata object (title, description, canonical, OG,
 * Twitter) from a PageMeta definition. Use on every indexable page.
 */
export function seoMeta(m: PageMeta, type: "website" | "article" = "website"): Metadata {
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: absoluteUrl(m.canonicalPath) },
    openGraph: {
      type,
      locale: "en_US",
      url: absoluteUrl(m.canonicalPath),
      siteName: BRAND.shortName,
      title: m.title,
      description: m.description,
      images: [
        {
          url: ogImageUrl(),
          width: BRAND.ogImageWidth,
          height: BRAND.ogImageHeight,
          alt: BRAND.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [ogImageUrl()],
    },
  };
}
