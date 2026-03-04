/**
 * TrustBadges — horizontal row of trust signal pill badges.
 * RatingBadge — Google-style rating pill (⭐ 5.0 · Verified Reviews · Google).
 * Both are server components — no client JS required.
 */

// ── TrustBadges ────────────────────────────────────────────────────────────────

type TrustBadgesProps = {
  primaryColor: string;
  badges?: string[];
  /** Center-justify the badge row (for centered hero layouts) */
  center?: boolean;
  /** Additional top margin override */
  mt?: string;
};

const DEFAULT_BADGES = [
  "✓ Licensed & Insured",
  "✓ Free Estimates",
  "✓ 5-Star Rated",
  "✓ Locally Owned",
  "✓ Satisfaction Guaranteed",
];

export function TrustBadges({ primaryColor, badges, center = false, mt = "1.75rem" }: TrustBadgesProps) {
  const items = badges?.length ? badges : DEFAULT_BADGES;
  return (
    <div style={{
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
      marginTop: mt,
      justifyContent: center ? "center" : "flex-start",
    }}>
      {items.map((badge, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: `${primaryColor}18`,
            border: `1px solid ${primaryColor}35`,
            borderRadius: "100px",
            padding: "5px 14px",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: primaryColor,
            whiteSpace: "nowrap",
            letterSpacing: "0.01em",
          }}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

// ── RatingBadge ────────────────────────────────────────────────────────────────

type RatingBadgeProps = {
  rating?: string;
  reviews?: string;
  /** "dark" = white text (for dark hero backgrounds), "light" = dark text */
  theme?: "dark" | "light";
  mt?: string;
};

export function RatingBadge({
  rating = "5.0",
  reviews = "Verified Reviews",
  theme = "dark",
  mt = "1rem",
}: RatingBadgeProps) {
  const isDark = theme === "dark";
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)"}`,
      borderRadius: "100px",
      padding: "6px 16px",
      marginTop: mt,
    }}>
      <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>⭐</span>
      <span style={{
        fontSize: "0.78rem",
        fontWeight: 700,
        color: isDark ? "#ffffff" : "#111111",
      }}>{rating}</span>
      <span style={{
        fontSize: "0.7rem",
        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
      }}>· {reviews} · Google</span>
    </div>
  );
}
