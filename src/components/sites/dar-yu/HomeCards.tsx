import Link from "next/link";
import "./home.css";

const FASTENERS_LIST = [
  "Wood Screws",
  "Structural Timber Screws",
  "Decking Screws",
  "Self-Drilling Screws",
  "Self-Tapping Screws",
  "Machine Screws",
  "Sheet Metal Screws",
  "Roofing Screws",
  "Anchors and Plugs",
  "Nuts and Washers",
  "Blind Rivets",
];

const DIY_LIST = [
  "Six-Cavity Box",
  "Eight-Cavity Box",
  "Nine-Cavity Box",
  "Twelve-Cavity Box",
  "Blister Pack",
  "Hanger Box",
  "Multi-Cavity Box",
];

export function HeroSection() {
  return (
    <section className="dy-hero">
      <div className="dy-hero__inner">
        <h1 className="dy-hero__title">
          Standards in Every Screw. Craft in Every Pack.
        </h1>
        <p className="dy-hero__company">Fixlinx Industrial Co., Ltd.</p>
      </div>
    </section>
  );
}
export function FastenersCard() {
  return (
    <section className="dy-card">
      <div className="dy-card__content">
        <h2 className="dy-card__title">
          <span className="dy-card__name">FASTENERS</span>
        </h2>
        <p className="dy-card__list">
          {FASTENERS_LIST.slice(0, 7).join(" / ")} ...
        </p>
        <Link href="/fasteners-en" className="dy-card__more">
          READ MORE
        </Link>
      </div>
      <Link href="/fasteners-en" className="dy-card__media" aria-label="Fasteners">
        <img
          src="/images/fasteners/wood-screws-1.jpg"
          alt="Fixlinx fasteners range"
          loading="lazy"
        />
      </Link>
    </section>
  );
}

export function DiyCard() {
  return (
    <section className="dy-card dy-card--alt">
      <div className="dy-card__media">
        <Link href="/diy-pack-en" aria-label="DIY Pack">
          <img
            src="/images/fasteners-hero.jpg"
            alt="DIY pack collection"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="dy-card__content">
        <h2 className="dy-card__title">
          <span className="dy-card__name">DIY PACK</span>
        </h2>
        <p className="dy-card__list">
          {DIY_LIST.join(" / ")} ...
        </p>
        <Link href="/diy-pack-en" className="dy-card__more">
          READ MORE
        </Link>
      </div>
    </section>
  );
}

export function PageCard({
  title,
  backLinks,
  children,
}: {
  title: string;
  backLinks?: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  return (
    <section className="dy-page">
      <div className="dy-page__head">
        <h1 className="dy-page__title">{title}</h1>
        <div className="dy-page__backs">
          {backLinks?.map((l) => (
            <Link key={l.href} href={l.href} className="dy-back">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}

export function NumberedList({ items }: { items: { num: string; name: string; href?: string }[] }) {
  return (
    <div className="dy-numlist">
      {items.map((it) =>
        it.href ? (
          <Link key={it.num} href={it.href} className="dy-numlist__row">
            <span className="dy-numlist__num">{it.num}</span>
            <span className="dy-numlist__name">{it.name}</span>
          </Link>
        ) : (
          <div key={it.num} className="dy-numlist__row">
            <span className="dy-numlist__num">{it.num}</span>
            <span className="dy-numlist__name">{it.name}</span>
          </div>
        ),
      )}
    </div>
  );
}
