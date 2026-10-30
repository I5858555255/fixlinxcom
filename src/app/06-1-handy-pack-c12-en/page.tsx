import type { Metadata } from "next";
import { Header } from "@/components/sites/dar-yu/Header";
import { Footer } from "@/components/sites/dar-yu/Footer";
import { PageCard } from "@/components/sites/dar-yu/HomeCards";
import { getDiyPage, type DiyPage } from "@/components/sites/dar-yu/DiyLib";
import "./diy-sub.css";

export const metadata: Metadata = {
  title: "DIY PACK - 06-1 Handy Pack C12 | Fixlinx Industrial",
};

export const dynamic = "force-dynamic";

const SLUG = "06-1-handy-pack-c12-en";

export default function DiySubPage() {
  const page: DiyPage | null = getDiyPage(SLUG);
  const cards = page
    ? page.cards.length
      ? page.cards
      : [{ img: page.cover, name: page.title }]
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
                  <img src={c.img} alt={c.name} loading="lazy" />
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
