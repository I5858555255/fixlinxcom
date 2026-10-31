import type { Metadata } from "next";
import "./globals.css";
import { BRAND, SITE_ORIGIN, PAGES_BASE, absoluteUrl } from "@/lib/seo";

const metadataBase = new URL(
  PAGES_BASE ? `${SITE_ORIGIN}${PAGES_BASE}` : SITE_ORIGIN,
);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Fixlinx Industrial — Industrial Fasteners & DIY Packaging Manufacturer",
    template: "%s | Fixlinx Industrial",
  },
  description:
    "Fixlinx Industrial supplies high-performance industrial fasteners — wood, structural, decking and self-drilling screws — plus retail-ready DIY packaging formats, shipped globally from Wenzhou, China.",
  openGraph: {
    type: "website",
    siteName: "Fixlinx Industrial",
    locale: "en_US",
    url: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** JSON-LD Organization — injected into every page <head>. */
function siteJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: absoluteUrl("/"),
    email: BRAND.email,
    telephone: BRAND.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.headOffice,
      addressCountry: "CN",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {siteJsonLd()}
      </head>
      <body>
        {children}
        {/* Unified sub-path fix (runtime): prefixes every absolute public-asset
            reference (<img src>, <a href>, <iframe src>) with the first path
            segment on GitHub Pages deploys. No-op on localhost / node-server.
            Loaded inline at end of body so all markup above already exists. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  if (window.__fxA) return; window.__fxA = 1;
  var seg = (window.location.pathname.split("/").filter(Boolean)[0]) || "";
  if (seg !== "fixlinxcom") return;               // localhost / node-server: no-op
  var P = "/" + seg;
  function fx(p){ return (p && p.charAt(0)==="/" && p.indexOf(P)!==0) ? P + p : p; }
  function walk(root){
    root.querySelectorAll("img[src],source[src]").forEach(function(e){
      var s = e.getAttribute("src"); if (s) e.setAttribute("src", fx(s));
    });
    root.querySelectorAll('a[href^="/"]').forEach(function(e){
      var s = e.getAttribute("href");
      if (s && s.indexOf("/_next") !== 0) e.setAttribute("href", fx(s));
    });
    root.querySelectorAll("iframe[src]").forEach(function(e){
      var s = e.getAttribute("src"); if (s) e.setAttribute("src", fx(s));
    });
  }
  function run(){ walk(document.body || document.documentElement); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else { run(); }
  // re-run after in-place DOM swaps (Next router navigation mounts new nodes)
  var mo = new MutationObserver(function(muts){
    for (var i = 0; i < muts.length; i++) {
      muts[i].addedNodes.forEach(function(n){
        if (n.nodeType === 1) walk(n.parentElement || document.body);
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();`
          }}
        />
      </body>
    </html>
  );
}
