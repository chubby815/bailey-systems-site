/**
 * lib/site-theme.ts
 * Centralised theme config, token resolution, and shared maps
 * used across all /sites/* section components.
 */
import type { SiteRecord } from "./kv";

// ── Theme config types ────────────────────────────────────────────────────────
export type FontStyleKey   = "modern" | "classic" | "bold" | "minimal";
export type HeroStyleKey   = "photo" | "gradient" | "solid";
export type LayoutStyleKey = "standard" | "centered" | "fullwidth";

export type ThemeConfig = {
  primaryColor: string;    // resolved hex value e.g. "#10b981"
  fontStyle:    FontStyleKey;
  heroStyle:    HeroStyleKey;
  layoutStyle:  LayoutStyleKey;
};

export type ThemeTokens = {
  fontFamily:   string;
  fontWeight:   number;
  maxWidth:     string;
  primaryColor: string;
  accentLight:  string;   // 8 % tint for icon backgrounds
  accentMid:    string;   // 19 % tint for box shadows
  heroImageUrl: string;   // set after calling getHeroImageUrl(industry)
};

// ── Structured content types (new v2 format) ──────────────────────────────────
export type StructuredSiteContent = {
  hero: {
    headline:    string;
    subheadline: string;
    ctaText:     string;
    badge:       string;
  };
  services: Array<{
    name:        string;
    description: string;
    icon:        string;
  }>;
  about: {
    title: string;
    body:  string;
    stats: Array<{ label: string; value: string }>;
  };
  testimonials: Array<{
    name:   string;
    role:   string;
    quote:  string;
    rating: number;
  }>;
  cta: {
    headline:   string;
    subtext:    string;
    buttonText: string;
  };
  seo: {
    title:       string;
    description: string;
  };
};

// ── Legacy content type (v1 format — existing sites) ─────────────────────────
export type LegacySiteContent = {
  hero_headline:    string;
  hero_subheadline: string;
  about_text:       string;
  services_list:    string[];
  cta_text:         string;
  tagline:          string;
  seo_title:        string;
  seo_description:  string;
};

export type GeneratedContent = LegacySiteContent | StructuredSiteContent;

/** Returns true for the new structured format, false for legacy. */
export function isStructuredContent(c: GeneratedContent): c is StructuredSiteContent {
  return (
    typeof (c as StructuredSiteContent).hero === "object" &&
    (c as StructuredSiteContent).hero !== null
  );
}

// ── Maps ──────────────────────────────────────────────────────────────────────
export const COLOR_MAP: Record<string, string> = {
  "Emerald Green":  "#10b981",
  "Electric Blue":  "#0066ff",
  "Sunset Orange":  "#f97316",
  "Royal Purple":   "#7c3aed",
  "Fire Red":       "#ef4444",
  "Midnight Black": "#0a0a0a",
  "Golden Yellow":  "#eab308",
  "Hot Pink":       "#ec4899",
  "Cyan":           "#06b6d4",
  "Slate Gray":     "#64748b",
  "Rose Gold":      "#fb7185",
  "Deep Navy":      "#1e3a5f",
};

export const INDUSTRY_PHOTO: Record<string, number> = {
  "Landscaping":       28,
  "Plumbing":          164,
  "Electrician":       160,
  "Beauty & Wellness": 64,
  "Restaurant":        292,
  "Consulting":        375,
  "Real Estate":       450,
  "Fitness":           1,
  "Auto & Mechanic":   111,
  "Cleaning":          219,
  "Other":             338,
};

const FONT_CONFIG: Record<FontStyleKey, { family: string; weight: number }> = {
  modern:  { family: "'Inter', system-ui, sans-serif",                  weight: 900 },
  classic: { family: "'Georgia', 'Times New Roman', serif",             weight: 700 },
  bold:    { family: "'Trebuchet MS', 'Arial Black', sans-serif",       weight: 900 },
  minimal: { family: "'Helvetica Neue', 'Arial', sans-serif",           weight: 700 },
};

const LAYOUT_CONFIG: Record<LayoutStyleKey, string> = {
  standard:   "1200px",
  centered:   "800px",
  fullwidth:  "100%",
};

// Input strings from the builder form → canonical keys
const FONT_KEY_MAP: Record<string, FontStyleKey> = {
  "Modern":             "modern",
  "Classic & Elegant":  "classic",
  "Bold & Strong":      "bold",
  "Clean & Minimal":    "minimal",
};

const HERO_KEY_MAP: Record<string, HeroStyleKey> = {
  "Photo Background":    "photo",
  "Gradient Background": "gradient",
  "Solid Color":         "solid",
};

const LAYOUT_KEY_MAP: Record<string, LayoutStyleKey> = {
  "Standard":   "standard",
  "Centered":   "centered",
  "Full Width": "fullwidth",
};

// ── Public helpers ────────────────────────────────────────────────────────────

/** Build a ThemeConfig from a SiteRecord (user-selected values take precedence). */
export function buildThemeConfig(site: SiteRecord): ThemeConfig {
  return {
    primaryColor: COLOR_MAP[site.primaryColor] ?? "#10b981",
    fontStyle:    FONT_KEY_MAP[site.fontStyle   ?? "Modern"]           ?? "modern",
    heroStyle:    HERO_KEY_MAP[site.heroStyle   ?? "Photo Background"] ?? "photo",
    layoutStyle:  LAYOUT_KEY_MAP[site.layoutStyle ?? "Standard"]       ?? "standard",
  };
}

/** Resolve ThemeConfig to concrete CSS token values. */
export function getThemeTokens(theme: ThemeConfig, heroImageUrl = ""): ThemeTokens {
  const fontCfg = FONT_CONFIG[theme.fontStyle] ?? FONT_CONFIG.modern;
  return {
    fontFamily:   fontCfg.family,
    fontWeight:   fontCfg.weight,
    maxWidth:     LAYOUT_CONFIG[theme.layoutStyle] ?? "1200px",
    primaryColor: theme.primaryColor,
    accentLight:  `${theme.primaryColor}18`,
    accentMid:    `${theme.primaryColor}30`,
    heroImageUrl,
  };
}

/** Picsum URL for a given industry. */
export function getHeroImageUrl(industry: string): string {
  const id = INDUSTRY_PHOTO[industry] ?? 338;
  return `https://picsum.photos/id/${id}/1600/900`;
}
