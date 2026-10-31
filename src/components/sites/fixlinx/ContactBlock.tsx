import { ContactForm } from "./ContactForm";
import "./contacts.css";

export function ContactBlock({ withForm = false }: { withForm?: boolean }) {
  return (
    <section className="dy-contact" id="contact">
      <div className="dy-contact__grid">
        <div className="dy-contact__info">
          <h2 className="dy-contact__title">CONTACT US</h2>
          <div className="dy-contact__rows">
            <p>
              <span className="dy-contact__label">HEAD OFFICE :</span>
              <br />
              Rm 703, Bldg A, No. 7 Juguangyuan North Rd, Lucheng District,
              Wenzhou, Zhejiang, China
            </p>
            <p>
              <span className="dy-contact__label">FACTORY :</span>
              <br />
              Bldg 4, Wendu Industrial Zone, Taimu Mountain Town, Fuding City,
              Ningde, Fujian, China
            </p>
            <p>
              <span className="dy-contact__label">TEL / WHATSAPP :</span>
              <br />
              <a href="tel:+8618857708789">+86 188 5770 8789</a>
            </p>
            <p>
              <span className="dy-contact__label">EMAIL :</span>
              <br />
              <a href="mailto:lucas@fixlinx.com">lucas@fixlinx.com</a>
            </p>
            <p>
              <span className="dy-contact__label">WEB :</span>
              <br />
              <a href="https://www.fixlinx.com" target="_blank" rel="noreferrer">
                www.fixlinx.com
              </a>
            </p>
          </div>
        </div>

        <div className="dy-contact__formwrap">
          <p className="dy-contact__intro">
            Thank you for visiting the Fixlinx website.
          </p>
          <p className="dy-contact__intro">
            If you have any questions or requests, please fill in the form
            below and we will get back to you shortly.
          </p>
          {withForm ? (
            <ContactForm />
          ) : (
            <p className="dy-contact__thanks">
              We will reply to your inquiry as soon as possible.&nbsp;
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
