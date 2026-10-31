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
import "./diy-pack.css";

export const metadata: Metadata = seoMeta(PAGE_META.diyPack);

const diy_breadcrumbLd = breadcrumbJsonLd("diyPack");

type DiyItem = {
  num: string;
  name: string;
  href: string;
  img: string;
};

// 20 numbered box-format cards. Each shows a packaging shape (no product
// names) — the original site's approach. Images come from the new
// diy-boxes/ folder; sub-page hrefs are kept so the catalog stays browsable.
const DIY_ITEMS: DiyItem[] = [
  { num: "01", name: "Four-Cavity Box",     href: "/01-1-buckets-square-en",     img: "diy-boxes/box-4-phillip-cement-screw-kit.png" },
  { num: "02", name: "Six-Cavity Box",      href: "/02-buckets-round-en",        img: "diy-boxes/box-6-hex-nut.png" },
  { num: "03", name: "Eight-Cavity Box",    href: "/03-handy-pack-051-en",      img: "diy-boxes/box-8-tv-mount-screw.png" },
  { num: "04", name: "Nine-Cavity Box",     href: "/04-1-handy-pack-052-053-en",img: "diy-boxes/box-9-blind-rivet.png" },
  { num: "05", name: "Twelve-Cavity Box",   href: "/05-1-blow-case-en",         img: "diy-boxes/box-12-hex-nut-nylon-locknut.png" },
  { num: "06", name: "Large Six-Cavity Box",href: "/06-1-handy-pack-c12-en",    img: "diy-boxes/box-lg6-blind-rivet.png" },
  { num: "07", name: "Large Six-Cavity Box",href: "/07-handy-pack-c14-en",      img: "diy-boxes/box-lg6-dome-cap-nut.png" },
  { num: "08", name: "Six-Cavity Box",      href: "/08-handy-pack-067-en",      img: "diy-boxes/box-6-nylon-locknut.png" },
  { num: "09", name: "Six-Cavity Box",      href: "/09-handy-pack-022-en",      img: "diy-boxes/box-6-plain-washer.png" },
  { num: "10", name: "Six-Cavity Box",      href: "/10-metal-case-en",          img: "diy-boxes/box-6-spring-washer.png" },
  { num: "11", name: "Twelve-Cavity Box",   href: "/11-1-tower-en",             img: "diy-boxes/box-12-plain-spring-washer.png" },
  { num: "12", name: "Six-Cavity Box",      href: "/12-1-small-box-054-en",     img: "diy-boxes/box-6-stainless-set-screw.png" },
  { num: "13", name: "Six-Cavity Box",      href: "/13-1-small-box-240-en",     img: "diy-boxes/box-6-metric-socket-head-screw.png" },
  { num: "14", name: "Six-Cavity Box",      href: "/14-1-small-box-239-en",     img: "diy-boxes/box-6-truss-head-drill-screw.png" },
  { num: "15", name: "Six-Cavity Box",      href: "/15-1-small-box-020-en",     img: "diy-boxes/box-6-flush-head-self-tapping-screw.png" },
  { num: "16", name: "Six-Cavity Box",      href: "/16-1-mini-box-002-421-en",  img: "diy-boxes/box-6-dome-cap-nut.png" },
  { num: "17", name: "Six-Cavity Box",      href: "/17-1-mini-box-003-en",      img: "diy-boxes/box-6-flat-head-self-tapping-screw.png" },
  { num: "18", name: "Six-Cavity Box",      href: "/18-1-mini-box-030-en",      img: "diy-boxes/box-6-flat-head-drill-screw.png" },
  { num: "19", name: "Six-Cavity Box",      href: "/19-1-ps-box-en",            img: "diy-boxes/box-6-us-flat-head-screw.png" },
  { num: "20", name: "Blister & Hanger Packs", href: "/20-more-selections-en",  img: "diy-boxes/blister-pom-drywall-self-tapping-kit.png" },
];

export default function DiyPackPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: diy_breadcrumbLd }} />
      <Header />
      <main>
        <HeroStrip
          img="/images/fasteners-hero.jpg"
          alt="DIY pack collection"
          title="DIY Pack"
          sub="Retail-ready packaging formats"
        />
        <PageCard
          title="DIY PACK"
          backLinks={[{ label: "BACK TO PRODUCTS", href: "/products-en" }]}
        >
          <p className="diy-sub">
            Four-Cavity Box / Six-Cavity Box / Eight-Cavity Box / Nine-Cavity
            Box / Twelve-Cavity Box / Large Box / Blister &amp; Hanger Pack
          </p>
          <div className="dy-pack-grid">
            {DIY_ITEMS.map((it) => (
              <Link key={it.num} href={it.href} className="dy-pack-card">
                <div className="dy-pack-card__img">
                  <img
                    src={assetPath(`/sites/fixlinx/images/${it.img}`)}
                    alt={it.name}
                    loading="lazy"
                  />
                </div>
                <span className="dy-pack-card__num">{it.num}</span>
                <span className="dy-pack-card__name">{it.name}</span>
                <span className="dy-pack-card__more">READ MORE &rarr;</span>
              </Link>
            ))}
          </div>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
