import type { Metadata } from "next";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import {
  HeroSection,
  FastenersCard,
  DiyCard,
} from "@/components/sites/fixlinx/HomeCards";
import { ContactBlock } from "@/components/sites/fixlinx/ContactBlock";
import "@/components/sites/fixlinx/home.css";
import { PAGE_META, BRAND, absoluteUrl, ogImageUrl } from "@/lib/seo";

const m = PAGE_META.home;

export const metadata: Metadata = {
  title: m.title,
  description: m.description,
  alternates: { canonical: absoluteUrl(m.canonicalPath) },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl(m.canonicalPath),
    siteName: BRAND.shortName,
    title: m.title,
    description: m.description,
    images: [
      {
        url: ogImageUrl(),
        width: BRAND.ogImageWidth,
        height: BRAND.ogImageHeight,
        alt: BRAND.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: m.title,
    description: m.description,
    images: [ogImageUrl()],
  },
};

/** WebSite JSON-LD — helps Google Search recognize the site name/URL. */
const webSiteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND.shortName,
  url: absoluteUrl("/"),
  description: BRAND.description,
  publisher: {
    "@type": "Organization",
    name: BRAND.name,
  },
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: webSiteJsonLd }}
      />
      <Header />
      <main>
        <HeroSection />
        <FastenersCard />
        <DiyCard />
        <ContactBlock withForm />
      </main>
      <Footer />
    </>
  );
}
