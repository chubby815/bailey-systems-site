"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type Props = {
  businessEmail?: string;
  businessName?:  string;
  siteId?:        string;
  fontFamily:     string;
  labelStyle?:    CSSProperties;
  inputStyle:     CSSProperties;
  btnStyle:       CSSProperties;
  successColor?:  string;
};

export function ContactFormBlock({
  businessEmail,
  businessName = "",
  siteId = "",
  fontFamily,
  labelStyle = {},
  inputStyle,
  btnStyle,
  successColor = "#22c55e",
}: Props) {
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [message,   setMessage]   = useState("");
  const [sending,   setSending]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessEmail) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, businessEmail, businessName, siteId }),
      });
      if (res.ok) {
        setName("");
        setEmail("");
        setMessage("");
        setSubmitted(true);
      } else {
        setError("❌ Failed to send. Please try again.");
      }
    } catch {
      setError("❌ Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (!businessEmail) {
    return (
      <p style={{ fontFamily, ...labelStyle, marginTop: "1.5rem", opacity: 0.7, fontSize: "0.9rem" }}>
        Please call us to get in touch.
      </p>
    );
  }

  if (submitted) {
    return (
      <p style={{ fontFamily, color: successColor, fontWeight: 600, marginTop: "2rem", fontSize: "0.95rem" }}>
        ✅ Message sent! We&apos;ll be in touch soon.
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
          disabled={sending}
        />
      </div>
      <div>
        <label style={labelBase}>Email</label>
        <input
          type="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          style={inputBase}
          disabled={sending}
        />
      </div>
      <div>
        <label style={labelBase}>Message</label>
        <textarea
          required rows={4}
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          style={{ ...inputBase, resize: "vertical" }}
          disabled={sending}
        />
      </div>
      {error && (
        <p style={{ fontFamily, fontSize: "0.85rem", color: "#ef4444", margin: 0 }}>{error}</p>
      )}
      <button type="submit" disabled={sending} style={{ cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, ...btnStyle }}>
        {sending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
