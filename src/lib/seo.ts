/**
 * Centralised SEO configuration for the Fixlinx site.
 *
 * SITE_ORIGIN is env-configurable so the same codebase works on:
 *   - GitHub Pages project site  (default, safe fallback)
 *   - Custom domain www.fixlinx.com (set NEXT_PUBLIC_SITE_ORIGIN at build)
 *
 * The Pages sub-path is always "/fixlinxcom" while the site is served from
 * the GitHub Pages project URL. When the custom domain is configured on
 * GitHub Pages, the site is served at root ("/"), so NEXT_PUBLIC_PAGES_BASE
 * should be set to "" at that time — the current config keeps "/fixlinxcom"
 * as the default to preserve the working production URL.
 */

// ── Origin & base path (env-overridable) ──────────────────────────────────

export const SITE_ORIGIN: string =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://i5858555255.github.io";

export const PAGES_BASE: string =
  process.env.NEXT_PUBLIC_PAGES_BASE ?? "/fixlinxcom";

/** Full production base URL (e.g. https://i5858555255.github.io/fixlinxcom) */
export const SITE_BASE: string =
  PAGES_BASE ? `${SITE_ORIGIN}${PAGES_BASE}` : SITE_ORIGIN;

/** Build an absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  if (!path || path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return SITE_BASE + p;
}

// ── Brand facts (single source of truth — do NOT invent new claims) ─────

export const BRAND = {
  name: "Fixlinx Industrial Co., Ltd.",
  shortName: "Fixlinx",
  legalName: "Fixlinx Industrial Co., Ltd.",
  description:
    "Fixlinx Industrial Co., Ltd. supplies high-performance industrial fasteners — wood, structural, decking and self-drilling screws — plus retail-ready DIY packaging formats, shipped globally from Wenzhou, China.",
  email: "lucas@fixlinx.com",
  phone: "+86 188 5770 8789",
  phoneHref: "tel:+8618857708789",
  website: "https://www.fixlinx.com", // intended production domain
  headOffice:
    "Rm 703, Bldg A, No. 7 Juguangyuan North Rd, Lucheng District, Wenzhou, Zhejiang, China",
  factory:
    "Bldg 4, Wendu Industrial Zone, Taimu Mountain Town, Fuding City, Ningde, Fujian, China",
  // 1200×630 OG image — use the factory drone shot
  ogImage: "/images/factory/drone-interior-1.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Fixlinx Fuding production facility — aerial view",
};

/** OG / Twitter default image as an absolute URL. */
export function ogImageUrl(): string {
  return absoluteUrl(BRAND.ogImage);
}

// ── Page metadata definitions ────────────────────────────────────────────

export interface PageMeta {
  /** Unique <title>. */
  title: string;
  /** Unique meta description (≤160 chars). */
  description: string;
  /** Self-referencing canonical path (site-relative, no origin). */
  canonicalPath: string;
}

/**
 * Canonical metadata for every indexable page.
 * Paths use the same form Next.js routes use (no trailing slash for the
 * metadata object — Next adds trailingSlash per the config).
 */
export const PAGE_META: Record<string, PageMeta> = {
  home: {
    title: "Fixlinx Industrial — Industrial Fasteners & DIY Packaging Manufacturer",
    description:
      "Fixlinx Industrial supplies high-performance wood, structural, decking and self-drilling fasteners plus retail-ready DIY packaging, manufactured in China and shipped globally.",
    canonicalPath: "/",
  },
  about: {
    title: "About Fixlinx Industrial — Fastener & Packaging Manufacturer",
    description:
      "Learn about Fixlinx Industrial: our Wenzhou HQ, 6,000 m² Fuding facility, monthly 400-ton capacity, AQL-based quality control, and one-stop fastener + packaging supply.",
    canonicalPath: "/about-us-en/",
  },
  quality: {
    title: "Fastener Quality Control & Inspection | Fixlinx Industrial",
    description:
      "From cold heading to OQC: see how Fixlinx controls fastener quality — AQL batch inspection, torque & salt-spray testing, and a dedicated inspection lab.",
    canonicalPath: "/quality-en/",
  },
  products: {
    title: "Industrial Fasteners & DIY Packaging Products | Fixlinx Industrial",
    description:
      "Browse Fixlinx product lines: wood screws, structural & decking screws, self-drilling screws, roofing fasteners, and multi-cavity retail packaging formats.",
    canonicalPath: "/products-en/",
  },
  fasteners: {
    title: "Industrial Fasteners — Wood, Structural, Self-Drilling Screws | Fixlinx",
    description:
      "Five fastener families from Fixlinx: wood, structural timber, self-drilling, concrete & masonry, and roofing screws — manufactured to specification.",
    canonicalPath: "/fasteners-en/",
  },
  diyPack: {
    title: "DIY Fastener Packaging — Boxes, Blister & Hanger Packs | Fixlinx",
    description:
      "Retail-ready DIY fastener packaging from Fixlinx: four to twelve-cavity boxes, blister packs, hanger boxes and multi-cavity formats for hardware retail.",
    canonicalPath: "/diy-pack-en/",
  },
  news: {
    title: "Fastener Industry News & Insights | Fixlinx Industrial",
    description:
      "Product launches, facility updates and fastener industry insights from Fixlinx Industrial.",
    canonicalPath: "/news-en/",
  },
  contact: {
    title: "Contact Fixlinx Industrial — RFQ & Inquiry",
    description:
      "Get in touch with Fixlinx Industrial for fastener and packaging inquiries, quotes and RFQs. Send us your requirements — we reply fast.",
    canonicalPath: "/contact-en/",
  },
  download: {
    title: "Download Product Catalogues & Specifications | Fixlinx Industrial",
    description:
      "Download Fixlinx product catalogues and specification sheets for fasteners and DIY packaging formats.",
    canonicalPath: "/download-en/",
  },
};

/** Metadata helper for news detail pages (built from article data). */
export function newsMeta(article: {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  img?: string;
}): PageMeta {
  return {
    title: `${article.title} | Fixlinx Industrial News`,
    description:
      article.excerpt?.slice(0, 155) ??
      "Read the full article from Fixlinx Industrial news.",
    canonicalPath: `/news-en/${article.slug}/`,
  };
}
