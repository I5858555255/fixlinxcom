import type { Metadata } from "next";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { PageCard } from "@/components/sites/fixlinx/HomeCards";
import { HeroStrip } from "@/components/sites/fixlinx/PageHero";
import { assetPath } from "@/lib/assetPath";
import "./about.css";

export const metadata: Metadata = {
  title: "ABOUT US | Fixlinx Industrial",
};

const MAIN_PRODUCTS = [
  "Wood screw, Structural timber screw, Decking screw",
  "Self-drilling screw, Self-tapping screw, Machine screw",
  "Sheet metal screw, Roofing screw, Roofing bolt",
  "DIN screw, DIN washer, DIN nut",
  "Chipboard screw, Drywall screw, Anchors and plugs",
];

const CAROUSEL = [
  {
    img: "/images/factory/drone-exterior-1.jpg",
    caption: "Fuding facility — exterior (Wendu Industrial Zone, Fujian)",
  },
  {
    img: "/images/factory/drone-interior-1.jpg",
    caption: "Production floor, 6,000 m²",
  },
  {
    img: "/images/factory/san_4145.jpg",
    caption: "Thread rolling and screw machining line",
  },
  {
    img: "/images/factory/san_4180.jpg",
    caption: "Heat treatment and plating process",
  },
  {
    img: "/images/factory/san_4220.jpg",
    caption: "Quality inspection lab",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <HeroStrip
          img="/images/factory/drone-exterior-1.jpg"
          alt="Fixlinx facility"
          title="About Us"
          sub="Standards in Every Screw. Craft in Every Pack."
        />
        <PageCard title="About Us">
          {/* Signboard / hero strip */}
          <div className="about-signboard">
            <img src={assetPath("/images/fixlinx-logo-full.png")} alt="Fixlinx Industrial" />
          </div>

          <div className="about-strip">
            <div className="about-strip__hero">
              <p className="about-strip__lead">
                Fixlinx Industrial Co., Ltd. — high-performance fasteners and
                integrated retail packaging, supplied globally.
              </p>
              <p className="about-strip__slogan">
                Standards in Every Screw. Craft in Every Pack.
              </p>
            </div>
            <div className="about-cols">
              <div>
                <p className="about-heading">WHO WE ARE</p>
                <p className="about-body">
                  Fixlinx specializes in high-performance fasteners and
                  integrated supply solutions. Using 10B21, C1022, SS410 and
                  SS304 materials, we produce wood screws, structural timber
                  screws, decking screws and self-drilling screws for
                  construction and DIY applications, supplied globally from our
                  Wenzhou facility.
                </p>
              </div>
              <div>
                <p className="about-heading">RETAIL PACKAGING</p>
                <p className="about-body">
                  Beyond standardized products, we work with customers to
                  develop retail-ready solutions. For the DIY market we offer a
                  full range of packaging formats: tubs, kits, bags, carded
                  packs and boxes.
                </p>
              </div>
              <div>
                <p className="about-heading">ONE-STOP SUPPLY</p>
                <p className="about-body">
                  From manufacturing to final packaging, Fixlinx delivers a
                  reliable one-stop supply system: consistent quality, stable
                  delivery, and packaging designed to make fasteners easier to
                  use and easier to sell.
                </p>
              </div>
              <div>
                <p className="about-heading">FACILITIES</p>
                <p className="about-body">
                  Head office in Wenzhou (Zhejiang), with a production
                  facility of approximately 6,000 m&sup2; in Fuding (Fujian)
                  and a monthly production capacity of up to 400 tons.
                </p>
              </div>
            </div>
          </div>

          {/* Image + text modules */}
          <div className="about-modules">
            <div className="about-module">
              <figure className="about-module__img">
                <img src={assetPath("/images/factory/drone-interior-2.jpg")} alt="Production floor" loading="lazy" />
              </figure>
              <div className="about-module__text">
                <p className="about-heading">MANUFACTURING</p>
                <p className="about-body">
                  Our Fuding facility runs integrated lines covering cold
                  heading, thread rolling, heat treatment, plating and
                  packaging, with a sustained monthly output of up to 400 tons.
                </p>
              </div>
            </div>
            <div className="about-module about-module--rev">
              <figure className="about-module__img">
                <img src={assetPath("/images/factory/san_4145.jpg")} alt="Machine details" loading="lazy" />
              </figure>
              <div className="about-module__text">
                <p className="about-heading">PRECISION COMPONENTS</p>
                <p className="about-body">
                  Every screw is machined to consistent tolerances on
                  purpose-built equipment, then held to strict AQL-based
                  inspection before leaving the plant.
                </p>
              </div>
            </div>
            <div className="about-module">
              <figure className="about-module__img">
                <img src={assetPath("/images/factory/san_4220.jpg")} alt="Quality lab" loading="lazy" />
              </figure>
              <div className="about-module__text">
                <p className="about-heading">QUALITY</p>
                <p className="about-body">
                  A well-equipped laboratory performs batch-by-batch
                  inspection in accordance with AQL standards, so only
                  qualified product is released to customers.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="about-carousel">
            {CAROUSEL.map((c, i) => (
              <figure key={i} className="about-carousel__item">
                <img src={assetPath(c.img)} alt={c.caption} loading="lazy" />
                <figcaption className="about-carousel__cap">{c.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="about-main">
            <p className="about-heading">MAIN PRODUCTS</p>
            <ul className="about-main__list">
              {MAIN_PRODUCTS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="about-body">
              Customized packaging layouts are available. Our team can design a
              complete retail range that fits your store&rsquo;s shelf
              dimensions and your market&rsquo;s demands.
            </p>
          </div>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
