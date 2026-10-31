import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fixlinx Industrial Co., Ltd. - Fasteners & Retail Packaging",
  description:
    "Fixlinx Industrial Co., Ltd. supplies high-performance fasteners and retail-ready packaging formats, from Wenzhou, China to markets worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
