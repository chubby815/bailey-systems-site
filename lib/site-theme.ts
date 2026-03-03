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
export type ButtonStyleKey = "rounded" | "sharp" | "pill";

export type ThemeConfig = {
  primaryColor: string;          // resolved hex value e.g. "#10b981"
  fontStyle:    FontStyleKey;
  heroStyle:    HeroStyleKey;
  layoutStyle:  LayoutStyleKey;
  buttonStyle?: ButtonStyleKey;  // optional — defaults to "rounded"
  // Text color overrides — applied as CSS variables across all templates
  headingColor?:    string;      // --heading-color
  bodyColor?:       string;      // --body-color
  accentColor?:     string;      // --accent-color (overrides primary for text labels)
  buttonTextColor?: string;      // --btn-text-color
};

export type ThemeTokens = {
  fontFamily:   string;
  fontWeight:   number;
  maxWidth:     string;
  primaryColor: string;
  accentLight:  string;    // 8 % tint for icon backgrounds
  accentMid:    string;    // 19 % tint for box shadows
  heroImageUrl: string;    // set after calling getHeroImageUrl(industry)
  buttonRadius: string;    // CSS border-radius for buttons
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

const BUTTON_RADIUS: Record<ButtonStyleKey, string> = {
  rounded: "10px",
  sharp:   "4px",
  pill:    "9999px",
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
    buttonRadius: BUTTON_RADIUS[theme.buttonStyle ?? "rounded"] ?? "10px",
  };
}

/** Picsum URL for a given industry. */
export function getHeroImageUrl(industry: string): string {
  const id = INDUSTRY_PHOTO[industry] ?? 338;
  return `https://picsum.photos/id/${id}/1600/900`;
}

// ── Preset themes ─────────────────────────────────────────────────────────────
export type PresetThemeColors = {
  primary:    string;
  background: string;
  surface:    string;
  text:       string;
  accent:     string;
};

export type PresetTheme = {
  name:    string;
  preview: string;
  theme:   ThemeConfig;
  colors:  PresetThemeColors;
};

export const PRESET_THEMES: Record<string, PresetTheme> = {
  modernDark: {
    name:    "Modern Dark",
    preview: "Dark background, emerald green accent",
    theme:   { primaryColor: "#10b981", fontStyle: "modern",  heroStyle: "gradient", layoutStyle: "standard" },
    colors:  { primary: "#10b981", background: "#08090a", surface: "#111214", text: "#f0f0f0", accent: "#00e5a0" },
  },
  cleanLight: {
    name:    "Clean Light",
    preview: "White background, minimal",
    theme:   { primaryColor: "#0066ff", fontStyle: "minimal", heroStyle: "solid",    layoutStyle: "standard" },
    colors:  { primary: "#0066ff", background: "#ffffff", surface: "#f8f9fa", text: "#111214", accent: "#0066ff" },
  },
  boldBlack: {
    name:    "Bold Black",
    preview: "All black, white text, bold typography",
    theme:   { primaryColor: "#ffffff", fontStyle: "bold",    heroStyle: "solid",    layoutStyle: "fullwidth" },
    colors:  { primary: "#ffffff", background: "#000000", surface: "#111111", text: "#ffffff", accent: "#ff3333" },
  },
  forest: {
    name:    "Forest",
    preview: "Deep green, natural feel",
    theme:   { primaryColor: "#2d6a4f", fontStyle: "classic", heroStyle: "photo",    layoutStyle: "standard" },
    colors:  { primary: "#2d6a4f", background: "#1a2e1a", surface: "#2d3d2d", text: "#e8f5e9", accent: "#52b788" },
  },
  ocean: {
    name:    "Ocean",
    preview: "Navy blue, clean and professional",
    theme:   { primaryColor: "#0077b6", fontStyle: "modern",  heroStyle: "gradient", layoutStyle: "standard" },
    colors:  { primary: "#0077b6", background: "#03045e", surface: "#023e8a", text: "#caf0f8", accent: "#00b4d8" },
  },
  sunset: {
    name:    "Sunset",
    preview: "Warm orange tones, energetic",
    theme:   { primaryColor: "#f97316", fontStyle: "bold",    heroStyle: "gradient", layoutStyle: "standard" },
    colors:  { primary: "#f97316", background: "#1c0a00", surface: "#2d1200", text: "#fff7ed", accent: "#fb923c" },
  },
  luxury: {
    name:    "Luxury",
    preview: "Black and gold, premium feel",
    theme:   { primaryColor: "#d4af37", fontStyle: "classic", heroStyle: "solid",    layoutStyle: "centered" },
    colors:  { primary: "#d4af37", background: "#0a0a0a", surface: "#1a1a1a", text: "#f5f5f0", accent: "#ffd700" },
  },
  fresh: {
    name:    "Fresh",
    preview: "Bright white, coral accent",
    theme:   { primaryColor: "#ff6b6b", fontStyle: "modern",  heroStyle: "photo",    layoutStyle: "standard" },
    colors:  { primary: "#ff6b6b", background: "#ffffff", surface: "#fff5f5", text: "#2d3436", accent: "#ff6b6b" },
  },
  professional: {
    name:    "Professional",
    preview: "Gray and blue, corporate",
    theme:   { primaryColor: "#2563eb", fontStyle: "minimal", heroStyle: "solid",    layoutStyle: "standard" },
    colors:  { primary: "#2563eb", background: "#f8fafc", surface: "#ffffff", text: "#1e293b", accent: "#3b82f6" },
  },
};
