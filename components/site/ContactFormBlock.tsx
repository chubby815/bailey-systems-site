"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type Props = {
  contactEmail?: string;
  fontFamily:    string;
  labelStyle?:   CSSProperties;
  inputStyle:    CSSProperties;
  btnStyle:      CSSProperties;
  successColor?: string;
};

export function ContactFormBlock({
  contactEmail,
  fontFamily,
  labelStyle = {},
  inputStyle,
  btnStyle,
  successColor = "#22c55e",
}: Props) {
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [message,   setMessage]   = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactEmail) return;
    const subject = encodeURIComponent(`Enquiry from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
  }

  if (!contactEmail) {
    return (
      <p style={{ fontFamily, ...labelStyle, marginTop: "1.5rem", opacity: 0.7, fontSize: "0.9rem" }}>
        Please call us to get in touch.
      </p>
    );
  }

  if (submitted) {
    return (
      <p style={{ fontFamily, color: successColor, fontWeight: 600, marginTop: "2rem", fontSize: "0.95rem" }}>
        ✅ Opening your email client…
      </p>
    );
  }

  const labelBase: CSSProperties = {
    display: "block", fontFamily, fontSize: "0.78rem",
    fontWeight: 600, marginBottom: "0.375rem", ...labelStyle,
  };

  const inputBase: CSSProperties = {
    width: "100%", boxSizing: "border-box" as const, fontFamily, ...inputStyle,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left", marginTop: "2rem", width: "100%" }}
    >
      <div>
        <label style={labelBase}>Name</label>
        <input
          type="text" required
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={inputBase}
        />
      </div>
      <div>
        <label style={labelBase}>Email</label>
        <input
          type="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          style={inputBase}
        />
      </div>
      <div>
        <label style={labelBase}>Message</label>
        <textarea
          required rows={4}
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          style={{ ...inputBase, resize: "vertical" }}
        />
      </div>
      <button type="submit" style={{ cursor: "pointer", ...btnStyle }}>
        Send Message
      </button>
    </form>
  );
}
