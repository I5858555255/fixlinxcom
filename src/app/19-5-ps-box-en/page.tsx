import type { Metadata } from "next";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { PageCard } from "@/components/sites/fixlinx/HomeCards";
import { getDiyPage, type DiyPage } from "@/components/sites/fixlinx/DiyLib";
import { assetPath } from "@/lib/assetPath";
import { PAGE_META, absoluteUrl, ogImageUrl } from "@/lib/seo";
import "./diy-sub.css";

export const metadata: Metadata = {
  title: "DIY PACK - PS Box – 19-5 | Fixlinx Industrial",
  description:
    "View the ps box – 19-5 fastener packaging page from Fixlinx Industrial. Product cards, specifications and format details.",
  alternates: {
    canonical: absoluteUrl("/19-5-ps-box-en/"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/19-5-ps-box-en/"),
    siteName: "Fixlinx",
    title: "DIY PACK - PS Box – 19-5 | Fixlinx Industrial",
    description:
      "View the ps box – 19-5 fastener packaging page from Fixlinx Industrial.",
    images: [{ url: ogImageUrl() }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIY PACK - PS Box – 19-5 | Fixlinx Industrial",
    description: "View the ps box – 19-5 fastener packaging page from Fixlinx Industrial.",
    images: [ogImageUrl()],
  },
};

export const dynamic = "force-dynamic";

const SLUG = "19-5-ps-box-en";

export default function DiySubPage() {
  const page: DiyPage | null = getDiyPage(SLUG);
  const cards = page
    ? page.cards.length
      ? page.cards
      : [{ img: assetPath(page.cover), name: page.title }]
    : [];
  return (
    <>
      <Header />
      <main>
        <PageCard
          title="DIY PACK"
          backLinks={[
            { label: "BACK TO PRODUCTS", href: "/products-en" },
            { label: "BACK TO DIY PACK", href: "/diy-pack-en" },
          ]}
        >
          {page && <h2 className="diag-heading">{page.title}</h2>}
          <div className="diag-grid">
            {cards.map((c, i) => (
              <article key={i} className="diag-card diag-card--plain">
                <div className="diag-card__img">
                  <img src={assetPath(c.img)} alt={c.name} loading="lazy" />
                </div>
                <div className="diag-card__info">
                  <h3 className="diag-card__name">{c.name}</h3>
                </div>
              </article>
            ))}
          </div>
          <p className="diy-note">
            Cards on this page are managed from the SITE MANAGE entry.
          </p>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}