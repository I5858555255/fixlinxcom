import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/sites/dar-yu/Header";
import { Footer } from "@/components/sites/dar-yu/Footer";
import { PageCard } from "@/components/sites/dar-yu/HomeCards";
import { HeroStrip } from "@/components/sites/dar-yu/PageHero";
import { getArticle } from "../lib";
import "../news.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "NEWS | Fixlinx Industrial" };
  return { title: `${article.title} | Fixlinx Industrial` };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Header />
      <main>
        <HeroStrip
          img={article.img || "/images/factory/drone-interior-2.jpg"}
          alt={article.title}
        />
        <PageCard
          title="News"
          backLinks={[{ label: "BACK TO NEWS", href: "/news-en" }]}
        >
          <article className="news-detail">
            <header className="news-detail__head">
              <p className="news-detail__date">DATE : {article.date}</p>
              <h1 className="news-detail__title">{article.title}</h1>
            </header>
            <div className="news-detail__body">
              {article.body.map((p, i) => (
                <p key={i} className="news-detail__para">
                  {p}
                </p>
              ))}
            </div>
          </article>
        </PageCard>
      </main>
      <Footer />
    </>
  );
}
