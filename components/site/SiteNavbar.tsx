import type { ThemeTokens } from "@/lib/site-theme";

type Props = {
  businessName: string;
  ctaText:      string;
  tokens:       ThemeTokens;
};

export function SiteNavbar({ businessName, ctaText, tokens }: Props) {
  const { primaryColor, maxWidth, fontFamily, fontWeight } = tokens;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        <a
          href="#home"
          style={{
            fontWeight,
            fontFamily,
            fontSize: "1.25rem",
            color: "#1a1a1a",
            textDecoration: "none",
            letterSpacing: "-0.03em",
          }}
        >
          {businessName}
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {["Home", "Services", "About", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#6b7280",
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            style={{
              background: primaryColor,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </nav>
  );
}
