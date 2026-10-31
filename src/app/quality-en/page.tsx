import type { Metadata } from "next";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { PageCard } from "@/components/sites/fixlinx/HomeCards";
import { HeroStrip } from "@/components/sites/fixlinx/PageHero";
import { assetPath } from "@/lib/assetPath";
import "./quality.css";

export const metadata: Metadata = {
  title: "QUALITY | Fixlinx Industrial",
};

// Two modules: (1) production process, (2) certification & inspection
const PROCESS = [
  { img: "/images/factory/san_4145.jpg", caption: "Cold heading & thread rolling" },
  { img: "/images/factory/san_4180.jpg", caption: "Heat treatment" },
  { img: "/images/factory/san_4190.jpg", caption: "Plating line" },
  { img: "/images/factory/san_4207.jpg", caption: "Torque & salt-spray testing" },
];

const CERTS = [
  { img: "/images/factory/drone-interior-1.jpg", caption: "6,000 m² plant — Fuding, Fujian" },
  { img: "/images/factory/san_4220.jpg", caption: "In-house inspection lab (AQL batch control)" },
  { img: "/images/factory/drone-interior-2.jpg", caption: "Packaging & dispatch area" },
];

export default function QualityPage() {
  return (
    <>
      <Header />
      <main>
        <HeroStrip
          img="/images/factory/san_4190.jpg"
          alt="Plating line"
          title="Quality"
          sub="From raw material to finished pack"
        />
        <PageCard title="Quality">
          <section className="quality-module">
            <p className="quality-module__title">OPERATION FLOW</p>
            <div className="quality-flow">
              <iframe
                src={assetPath("/images/process-flow.html")}
                title="Fixlinx production operation flow — from purchase order to OQC"
                loading="lazy"
              />
            </div>
          </section>

          <section className="quality-module">
            <p className="quality-module__title">PRODUCTION PROCESS</p>
            <div className="quality-grid">
              {PROCESS.map((p, i) => (
                <figure key={i} className="quality-photo">
                  <img src={assetPath(p.img)} alt={p.caption} loading="lazy" />
                  <figcaption className="quality-photo__cap">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="quality-module">
            <p className="quality-module__title">CERTIFICATION &amp; INSPECTION</p>
            <div className="quality-grid quality-grid--3">
              {CERTS.map((c, i) => (
                <figure key={i} className="quality-photo">
                  <img src={assetPath(c.img)} alt={c.caption} loading="lazy" />
                  <figcaption className="quality-photo__cap">{c.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
