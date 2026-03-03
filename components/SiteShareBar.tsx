"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  siteId: string;
};

export function SiteShareBar({ siteId }: Props) {
  const [copied, setCopied] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/sites/${siteId}`
      : `https://baileysystemsai.com/sites/${siteId}`;

  function copyLink() {
    const url = `${window.location.origin}/sites/${siteId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#111214",
        borderBottom: "1px solid rgba(0,229,160,0.2)",
        padding: "0 1.25rem",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        boxShadow: "0 2px 20px rgba(0,229,160,0.05)",
      }}
    >
      {/* Left: live indicator + URL */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#00e5a0",
            flexShrink: 0,
            animation: "pulse 2s infinite",
          }}
        />
        <span style={{ fontSize: "0.75rem", color: "#9ca3af", flexShrink: 0 }}>
          Your site is live →
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "#f0f0f0",
            fontFamily: "monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "280px",
          }}
        >
          {siteUrl}
        </span>
      </div>

      {/* Right: action buttons + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={copyLink}
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "0.375rem 0.875rem",
            borderRadius: "8px",
            border: `1px solid ${copied ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.1)"}`,
            background: copied ? "rgba(0,229,160,0.08)" : "transparent",
            color: copied ? "#00e5a0" : "#9ca3af",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {copied ? "✓ Copied!" : "Copy Link"}
        </button>

        <Link
          href={`/dashboard/build?edit=${siteId}`}
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "0.375rem 0.875rem",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "#9ca3af",
            textDecoration: "none",
            transition: "all 0.15s",
          }}
        >
          Edit Site
        </Link>

        <a
          href="https://baileysystemsai.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "0.3rem 0.75rem",
            borderRadius: "8px",
            background: "rgba(0,229,160,0.1)",
            border: "1px solid rgba(0,229,160,0.2)",
            color: "#00e5a0",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          Built with BaileySystemsAI
        </a>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
