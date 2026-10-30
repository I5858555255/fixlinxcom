"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./header.css";

const NAV = [
  { label: "ABOUT", href: "/about-us-en" },
  { label: "QUALITY", href: "/quality-en" },
  { label: "PRODUCTS", href: "/products-en" },
  { label: "DOWNLOAD", href: "/download-en" },
  { label: "NEWS", href: "/news-en" },
  { label: "CONTACT", href: "/contact-en" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Pinned left: logo */}
      <div
        className={
          "dy-pinned dy-pinned--left" + (scrolled ? " dy-pinned--scrolled" : "")
        }
      >
        <Link href="/" className="dy-logo" aria-label="Fixlinx Industrial">
          <img
            src="/images/fixlinx-logo.png"
            alt="Fixlinx"
            width={345}
            height={120}
          />
        </Link>
      </div>

      {/* Pinned right: nav */}
      <div
        className={
          "dy-pinned dy-pinned--right" +
          (scrolled ? " dy-pinned--scrolled" : "")
        }
      >
        <nav className="dy-nav">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className="dy-nav__item">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Header background strip */}
      <header
        className={"dy-header" + (scrolled ? " dy-header--scrolled" : "")}
        aria-hidden="true"
      />
    </>
  );
}
