import type { Metadata } from "next";
import { Header } from "@/components/sites/fixlinx/Header";
import { Footer } from "@/components/sites/fixlinx/Footer";
import { ContactForm } from "@/components/sites/fixlinx/ContactForm";
import { PageCard } from "@/components/sites/fixlinx/HomeCards";
import { assetPath } from "@/lib/assetPath";
import "./contact.css";

export const metadata: Metadata = {
  title: "CONTACT | Fixlinx Industrial",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="contact-full">
          <div className="contact-full__img">
            <img src={assetPath("/images/factory/drone-exterior-1.jpg")} alt="Fixlinx facility" />
          </div>
          <div className="contact-full__content">
            <h1 className="contact-full__title">CONTACT US</h1>
            <div className="contact-full__grid">
              <div className="contact-full__rows">
                <p>
                  <span className="contact-full__label">HEAD OFFICE :</span>
                  <br />
                  Rm 703, Bldg A, No. 7 Juguangyuan North Rd, Lucheng District,
                  Wenzhou, Zhejiang, China
                </p>
                <p>
                  <span className="contact-full__label">FACTORY :</span>
                  <br />
                  Bldg 4, Wendu Industrial Zone, Taimu Mountain Town, Fuding City,
                  Ningde, Fujian, China
                </p>
                <p>
                  <span className="contact-full__label">TEL / WHATSAPP :</span>
                  <br />
                  <a href="tel:+8618857708789">+86 188 5770 8789</a>
                </p>
                <p>
                  <span className="contact-full__label">EMAIL :</span>
                  <br />
                  <a href="mailto:lucas@fixlinx.com">lucas@fixlinx.com</a>
                </p>
                <p>
                  <span className="contact-full__label">WEB :</span>
                  <br />
                  <a href="https://www.fixlinx.com" target="_blank" rel="noreferrer">
                    www.fixlinx.com
                  </a>
                </p>
              </div>
              <div className="contact-full__form">
                <p className="contact-full__intro">
                  Thank you for visiting the Fixlinx website.
                </p>
                <p className="contact-full__intro">
                  If you have any questions or requests, please fill in the form
                  below and we will get back to you shortly.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
