import type { Metadata } from "next";
import { Header } from "@/components/sites/dar-yu/Header";
import { Footer } from "@/components/sites/dar-yu/Footer";
import { PageCard } from "@/components/sites/dar-yu/HomeCards";
import { HeroStrip } from "@/components/sites/dar-yu/PageHero";
import "./fasteners.css";

export const metadata: Metadata = {
  title: "FASTENERS | Fixlinx Industrial",
};

// 5 fastener families, each with our own (compressed) photos.
const GROUPS = [
  {
    num: "01",
    name: "Wood Screws",
    desc: "General-purpose wood and decking screws. Coarse thread, large pilot, corrosion-resistant finishes for outdoor timber work.",
    imgs: [
      "/images/fasteners/wood-screws-1.jpg",
      "/images/fasteners/wood-screws-2.jpg",
      "/images/fasteners/wood-screws-3.jpg",
    ],
  },
  {
    num: "02",
    name: "Structural Timber Screws",
    desc: "Heavy-duty screws engineered for structural timber connections: deck, joist, stud and framing applications with long, thick-walled threads.",
    imgs: [
      "/images/fasteners/structural-timber-screws-1.jpg",
      "/images/fasteners/structural-timber-screws-2.jpg",
      "/images/fasteners/structural-timber-screws-3.jpg",
      "/images/fasteners/structural-timber-screws-4.jpg",
    ],
  },
  {
    num: "03",
    name: "Self-Drilling Screws",
    desc: "Drill-tipped machine screws that cut their own thread in metal — for steel frames, roof and cladding systems, and general construction.",
    imgs: [
      "/images/fasteners/self-drilling-screws-1.jpg",
      "/images/fasteners/self-drilling-screws-2.jpg",
    ],
  },
  {
    num: "04",
    name: "Concrete & Masonry Screws",
    desc: "Drive-in anchors for concrete and masonry substrates. No plug required; high pull-out strength, reusable.",
    imgs: [
      "/images/fasteners/concrete-masonry-screws-1.jpg",
      "/images/fasteners/concrete-masonry-screws-2.jpg",
      "/images/fasteners/concrete-masonry-screws-3.jpg",
    ],
  },
  {
    num: "05",
    name: "Roofing & Cladding Screws",
    desc: "Hex-head self-drilling screws with EPDM or neoprene washers, rated for metal roof and cladding attachment in wind-loaded zones.",
    imgs: ["/images/fasteners/roofing-cladding-screws-1.jpg"],
  },
];

export default function FastenersPage() {
  return (
    <>
      <Header />
      <main>
        <HeroStrip
          img="/images/fasteners/wood-screws-1.jpg"
          alt="Wood screws"
          title="Fasteners"
          sub="Five product families, one standard"
        />
        <PageCard
          title="Fasteners"
          backLinks={[{ label: "BACK TO PRODUCTS", href: "/products-en" }]}
        >
          <div className="fasteners-groups">
            {GROUPS.map((g) => (
              <section key={g.num} className="fasteners-group">
                <div className="fasteners-group__head">
                  <span className="fasteners-group__num">{g.num}</span>
                  <div>
                    <h2 className="fasteners-group__name">{g.name}</h2>
                    <p className="fasteners-group__desc">{g.desc}</p>
                  </div>
                </div>
                <div className="fasteners-group__imgs">
                  {g.imgs.map((src, i) => (
                    <figure key={i} className="fasteners-photo">
                      <img src={src} alt={`${g.name} — photo ${i + 1}`} loading="lazy" />
                    </figure>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
