/**
 * TemplateRenderer
 * Reads site.template and renders the correct layout.
 * Falls back to Dark Premium for legacy sites or unknown template values.
 * Injects CSS variables from ThemeConfig so each template can use
 * var(--heading-color), var(--body-color), var(--accent-color), var(--btn-text-color).
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { getHeroImageUrl, COLOR_MAP } from "@/lib/site-theme";

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

  const sharedProps = { site, content, primaryColor, heroImageUrl };

  // Build CSS variable overrides from ThemeConfig color fields.
  // Only set a var when the user has explicitly chosen a value (non-empty string).
  const cssVars: React.CSSProperties = {};
  if (resolvedTheme.headingColor)    (cssVars as Record<string, string>)["--heading-color"]   = resolvedTheme.headingColor;
  if (resolvedTheme.bodyColor)       (cssVars as Record<string, string>)["--body-color"]      = resolvedTheme.bodyColor;
  if (resolvedTheme.accentColor)     (cssVars as Record<string, string>)["--accent-color"]    = resolvedTheme.accentColor;
  if (resolvedTheme.buttonTextColor) (cssVars as Record<string, string>)["--btn-text-color"]  = resolvedTheme.buttonTextColor;

  const hasCssVars = Object.keys(cssVars).length > 0;

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
      layout = <DarkPremiumLayout {...sharedProps} theme={resolvedTheme} />;
  }

  if (!hasCssVars) return <>{layout}</>;

  return (
    <div style={cssVars}>
      {layout}
    </div>
  );
}
