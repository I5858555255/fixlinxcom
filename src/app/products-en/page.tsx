import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { PageCard } from "@/components/sites/fixlinx/HomeCards";
import { HeroStrip } from "@/components/sites/fixlinx/PageHero";
import { assetPath } from "@/lib/assetPath";
import { PAGE_META } from "@/lib/seo";
import { seoMeta } from "@/lib/seoMeta";
import { breadcrumbJsonLd } from "@/lib/seoJsonLd";
import "./products.css";

export const metadata: Metadata = seoMeta(PAGE_META.products);

const products_breadcrumbLd = breadcrumbJsonLd("products");

const FASTENERS_LIST = [
  "Wood Screws",
  "Structural Timber Screws",
  "Decking Screws",
  "Self-Drilling Screws",
  "Self-Tapping Screws",
  "Machine Screws",
  "Sheet Metal Screws",
  "Roofing Screws",
  "Anchors and Plugs",
  "Nuts and Washers",
  "Blind Rivets",
];

const BOXES = [
  "Six-Cavity Box",
  "Eight-Cavity Box",
  "Nine-Cavity Box",
  "Twelve-Cavity Box",
  "Blister Pack",
  "Hanger Box",
  "Multi-Cavity Box",
];

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: products_breadcrumbLd }} />
      <Header />
      <main>
        <HeroStrip
          img="/images/fasteners-hero.jpg"
          alt="Fixlinx fasteners"
          title="Products"
          sub="Fasteners and retail packaging"
        />
        <PageCard title="Products">
          <div className="products-cols">
            <section className="products-block products-block--fasteners">
              <div className="products-block__head">
                <h2 className="products-block__name">FASTENERS</h2>
                <p className="products-block__list">
                  {FASTENERS_LIST.slice(0, 6).join(" / ")}&nbsp;
                  <span className="products-block__more-inline">…</span>
                </p>
                <Link href="/fasteners-en" className="products-block__more">
                  READ MORE
                </Link>
              </div>
              <div className="products-block__media">
                <img
                  src={assetPath("/images/fasteners/wood-screws-1.jpg")}
                  alt="Fixlinx fasteners range"
                />
              </div>
            </section>
            <section className="products-block products-block--diypack">
              <div className="products-block__head">
                <h2 className="products-block__name">DIY PACK</h2>
                <p className="products-block__list">
                  {BOXES.join(" / ")}
                </p>
                <Link href="/diy-pack-en" className="products-block__more">
                  READ MORE
                </Link>
              </div>
              <div className="products-block__media">
                <img
                  src={assetPath("/images/fasteners-hero.jpg")}
                  alt="DIY pack collection"
                />
              </div>
            </section>
          </div>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
