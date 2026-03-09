/**
 * TemplateRenderer
 * Reads site.template and renders the correct layout.
 * Falls back to Dark Premium for legacy sites or unknown template values.
 * Injects CSS variables from ThemeConfig so each template can use
 * var(--heading-color), var(--body-color), var(--accent-color), var(--btn-text-color).
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { getHeroImageUrl, COLOR_MAP, TYPOGRAPHY_SCALES } from "@/lib/site-theme";

import { DarkPremiumLayout } from "./templates/darkpremium";
import { NeoBrutalismLayout } from "./templates/neobrutalism";
import { MinimalLayout }      from "./templates/minimal";
import { MagazineLayout }     from "./templates/magazine";
import { ClassicLayout }      from "./templates/classic";

type Props = {
  site:           SiteRecord;
  content:        StructuredSiteContent;
  theme:          ThemeConfig;
  themeOverride?: Partial<ThemeConfig>;
  heroImageUrl?:  string;
};

export function TemplateRenderer({ site, content, theme, themeOverride, heroImageUrl: heroImageUrlProp }: Props) {
  const resolvedTheme: ThemeConfig = themeOverride ? { ...theme, ...themeOverride } : theme;
  const heroImageUrl = heroImageUrlProp ?? getHeroImageUrl(site.industry);
  const primaryColor = resolvedTheme.primaryColor ?? COLOR_MAP[site.primaryColor] ?? "#10b981";
  const template = site.template ?? "darkpremium";

  const sharedProps = { site, content, primaryColor, heroImageUrl, theme: resolvedTheme };

  // Build CSS variable object — text color overrides + typography scale.
  // These cascade to all template child elements via the wrapper div.
  const cssVars: Record<string, string> = {};

  // User-chosen text color overrides
  if (resolvedTheme.headingColor)    cssVars["--heading-color"]    = resolvedTheme.headingColor;
  if (resolvedTheme.bodyColor)       cssVars["--body-color"]       = resolvedTheme.bodyColor;
  if (resolvedTheme.accentColor)     cssVars["--accent-color"]     = resolvedTheme.accentColor;
  if (resolvedTheme.buttonTextColor) cssVars["--btn-text-color"]   = resolvedTheme.buttonTextColor;
  cssVars["--site-bg"]      = resolvedTheme.background ?? "";
  cssVars["--site-surface"] = resolvedTheme.surface ?? "";

  // Typography scale — derived from fontStyle, applied as CSS vars so templates can
  // consume them via var(--hero-size), var(--h2-size), etc. with their own fallbacks.
  const typo = TYPOGRAPHY_SCALES[resolvedTheme.fontStyle ?? "modern"] ?? TYPOGRAPHY_SCALES.modern;
  cssVars["--hero-size"]        = typo.heroSize;
  cssVars["--h2-size"]          = typo.h2Size;
  cssVars["--h3-size"]          = typo.h3Size;
  cssVars["--letter-spacing"]   = typo.letterSpacing;
  cssVars["--line-height"]      = typo.lineHeight;
  cssVars["--section-spacing"]  = typo.sectionSpacing;
  cssVars["--body-size"]        = typo.bodySize;
  cssVars["--body-line-height"] = typo.bodyLineHeight;

  let layout: React.ReactNode;
  switch (template) {
    case "neobrutalism":
      layout = <NeoBrutalismLayout {...sharedProps} />;
      break;
    case "minimal":
      layout = <MinimalLayout {...sharedProps} />;
      break;
    case "magazine":
      layout = <MagazineLayout {...sharedProps} />;
      break;
    case "classic":
      layout = <ClassicLayout {...sharedProps} />;
      break;
    case "darkpremium":
    default:
      layout = <DarkPremiumLayout {...sharedProps} />;
  }

  // Always wrap so CSS vars cascade to all template children
  return (
    <div style={cssVars as React.CSSProperties}>
      {layout}
    </div>
  );
}
