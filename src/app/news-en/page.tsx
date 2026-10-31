import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { PageCard } from "@/components/sites/fixlinx/HomeCards";
import { HeroStrip } from "@/components/sites/fixlinx/PageHero";
import { getNewsArticles } from "./lib";
import { assetPath } from "@/lib/assetPath";
import "./news.css";

export const metadata: Metadata = {
  title: "NEWS | Fixlinx Industrial",
};

export const dynamic = "force-dynamic";

export default function NewsPage() {
  const articles = getNewsArticles();
  return (
    <>
      <Header />
      <main>
        <HeroStrip
          img="/images/factory/drone-interior-2.jpg"
          alt="Fixlinx production floor"
          title="News"
          sub="Product and facility updates"
        />
        <PageCard title="News">
          {articles.length === 0 ? (
            <p className="news-empty">No news items yet.</p>
          ) : (
            <div className="news-list">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/news-en/${a.slug}`}
                  className="news-item"
                >
                  {a.img && (
                    <div className="news-item__img">
                      <img src={assetPath(a.img)} alt={a.title} loading="lazy" />
                    </div>
                  )}
                  <div className="news-item__body">
                    <p className="news-item__date">{a.date}</p>
                    <p className="news-item__title">{a.title}</p>
                    <p className="news-item__excerpt">{a.excerpt}</p>
                    <span className="news-item__read">READ MORE &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
