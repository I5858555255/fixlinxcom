import type { Metadata } from "next";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { ManageClient } from "./ManageClient";
import "./manage.css";

export const metadata: Metadata = {
  title: "MANAGE | Fixlinx Industrial",
  robots: { index: false, follow: false },
};

export default function ManagePage() {
  return (
    <>
      <Header />
      <main>
        <div className="mg-wrap">
          <div className="mg-head">
            <h1 className="mg-title">SITE MANAGE</h1>
            <p className="mg-sub">
              Unified admin entry for news articles, DIY pack pages and the
              live media registry. This page is intentionally not linked from
              the public navigation.
            </p>
          </div>
          <ManageClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
