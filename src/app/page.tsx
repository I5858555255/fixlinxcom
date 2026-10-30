import type { Metadata } from "next";
import { Header } from "@/components/sites/dar-yu/Header";
import { Footer } from "@/components/sites/dar-yu/Footer";
import {
  HeroSection,
  FastenersCard,
  DiyCard,
} from "@/components/sites/dar-yu/HomeCards";
import { ContactBlock } from "@/components/sites/dar-yu/ContactBlock";
import "@/components/sites/dar-yu/home.css";

export const metadata: Metadata = {
  title: "Fixlinx Industrial — Fasteners & Retail Packaging",
  description:
    "Fixlinx Industrial Co., Ltd. — high-performance wood, structural, decking and self-drilling fasteners, plus retail-ready packaging formats, supplied globally from Wenzhou, China.",
};

export default function HomePage() {
  return (
    <>
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
