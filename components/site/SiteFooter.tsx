import type { ThemeTokens } from "@/lib/site-theme";
import type { SiteRecord } from "@/lib/kv";

type Props = {
  site:    SiteRecord;
  tokens:  ThemeTokens;
  tagline: string;
};

export function SiteFooter({ site, tokens, tagline }: Props) {
  const {
    businessName, location, contactEmail, contactPhone,
    facebookUrl, instagramUrl, googleBusinessUrl, businessHours,
  } = site;
  const { primaryColor, maxWidth, fontFamily, fontWeight } = tokens;

  const hasSocial = facebookUrl || instagramUrl || googleBusinessUrl;

  return (
    <footer
      id="footer"
      style={{ background: "#111", color: "#9ca3af", padding: "3rem 1.5rem" }}
    >
      <div style={{ maxWidth, margin: "0 auto" }}>
        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily,
                fontWeight,
                fontSize: "1.25rem",
                color: "#fff",
                marginBottom: "0.5rem",
                letterSpacing: "-0.03em",
              }}
            >
              {businessName}
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                maxWidth: "260px",
                lineHeight: 1.6,
              }}
            >
              {tagline}
            </div>
          </div>

          {/* Social links */}
          {hasSocial && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#4b5563",
                  marginBottom: "0.5rem",
                }}
              >
                Follow Us
              </div>
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ color: "#3b82f6", fontWeight: 700 }}>f</span> Facebook
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ color: "#ec4899", fontWeight: 700 }}>◎</span> Instagram
                </a>
              )}
              {googleBusinessUrl && (
                <a
                  href={googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ color: "#34d399", fontWeight: 700 }}>G</span> Google Business
                </a>
              )}
            </div>
          )}

          {/* Contact */}
          {(contactEmail || contactPhone || businessHours) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#4b5563",
                  marginBottom: "0.5rem",
                }}
              >
                Contact
              </div>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none" }}
                >
                  ✉ {contactEmail}
                </a>
              )}
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none" }}
                >
                  ✆ {contactPhone}
                </a>
              )}
              {businessHours && (
                <div style={{ fontSize: "0.8125rem", color: "#6b7280", lineHeight: 1.5, maxWidth: "200px" }}>
                  🕐 {businessHours}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: "1px solid #1f2937",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            © {new Date().getFullYear()} {businessName}. All rights reserved. · {location}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#374151" }}>
            Built with{" "}
            <a
              href="https://baileyagents.com"
              style={{ color: primaryColor, textDecoration: "none" }}
            >
              BaileyAgents
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
