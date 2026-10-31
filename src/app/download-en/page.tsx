import type { Metadata } from "next";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { PageCard } from "@/components/sites/fixlinx/HomeCards";
import { HeroStrip } from "@/components/sites/fixlinx/PageHero";
import { assetPath } from "@/lib/assetPath";
import "./download.css";

export const metadata: Metadata = {
  title: "DOWNLOAD | Fixlinx Industrial",
};

const FILES = [
  {
    num: "01",
    name: "Fixlinx Fasteners & Retail Packaging Catalog",
    pdf: "fixlinx-catalog.pdf",
    cover: "/images/fixlinx-catalog-cover.jpg",
    note: "10 pages · Full catalog in PDF format",
  },
];

export default function DownloadPage() {
  return (
    <>
      <Header />
      <main>
        <HeroStrip
          img="/images/fixlinx-catalog-cover.jpg"
          alt="Fixlinx catalog cover"
          title="Download"
          sub="Product catalogs and references"
        />
        <PageCard title="Download">
          <div className="download-list">
            {FILES.map((f) => (
              <div key={f.num} className="download-row">
                <span className="download-row__num">{f.num}</span>
                <div className="download-row__cover">
                  <img src={assetPath(f.cover)} alt={f.name} />
                </div>
                <div className="download-row__meta">
                  <p className="download-row__name">{f.name}</p>
                  <p className="download-row__note">{f.note}</p>
                </div>
                <div className="download-row__actions">
                  <a
                    className="download-row__action"
                    href={assetPath(`/sites/fixlinx/pdfs/${f.pdf}`)}
                    download
                  >
                    DOWNLOAD PDF &darr;
                  </a>
                  <a
                    className="download-row__action download-row__action--down"
                    href={assetPath(`/sites/fixlinx/pdfs/${f.pdf}`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    OPEN IN BROWSER &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
