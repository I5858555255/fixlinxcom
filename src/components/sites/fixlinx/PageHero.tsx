import "./page-hero.css";
import { assetPath } from "@/lib/assetPath";

type Props = {
  img: string;
  alt?: string;
  title?: string;
  sub?: string;
};

/** Full-bleed image strip with graphite overlay — restores the original
 *  Wix site's "expanded" full-width feel under the fixed header. */
export function HeroStrip({ img, alt, title, sub }: Props) {
  return (
    <div className="page-hero" aria-hidden={!title ? undefined : false}>
      <img src={assetPath(img)} alt={alt ?? ""} className="page-hero__img" />
      <div className="page-hero__overlay" />
      {(title || sub) && (
        <div className="page-hero__text">
          {title && <h2 className="page-hero__title">{title}</h2>}
          {sub && <p className="page-hero__sub">{sub}</p>}
        </div>
      )}
    </div>
  );
}
