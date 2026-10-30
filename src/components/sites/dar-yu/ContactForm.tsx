"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

// Formspree endpoint (cloud-collected, works on static hosting too).
const FORM_ENDPOINT = "https://formspree.io/f/xeaazynb";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setErr("");
    let ok = false;
    // 1) primary: Formspree (data lands in their cloud inbox)
    try {
      const resp = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...data, _subject: "New Fixlinx website inquiry" }),
      });
      ok = resp.ok;
    } catch {
      ok = false;
    }
    // 2) fallback: local /api/contact when served by our own node server
    if (!ok) {
      try {
        const resp = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        ok = resp.ok;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      setStatus("error");
      setErr("Could not send your message — please email us directly or try again later");
      return;
    }
    setStatus("sent");
    form.reset();
  }

  return (
    <form className="dy-form" onSubmit={onSubmit}>
      <input type="text" name="name" placeholder="Name *" required maxLength={100} />
      <input type="email" name="email" placeholder="Email *" required maxLength={250} />
      <input type="tel" name="phone" placeholder="Phone" maxLength={50} />
      <input type="text" name="company" placeholder="Company" maxLength={250} />
      <textarea name="message" placeholder="Message *" required maxLength={2000} rows={4} />
      <button
        type="submit"
        className="dy-form__submit"
        disabled={status === "sending" || status === "sent"}
      >
        {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send"}
      </button>
      {status === "sent" && (
        <p className="dy-form__note dy-form__note--ok">
          Thank you — your message has been recorded. We will reply shortly.&nbsp;
        </p>
      )}
      {status === "error" && <p className="dy-form__note dy-form__note--err">{err}</p>}
      {status === "idle" && (
        <p className="dy-form__note">
          Your inquiry will be replied as soon as possible.&nbsp;
        </p>
      )}
    </form>
  );
}
