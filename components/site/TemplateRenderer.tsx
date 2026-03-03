/**
 * TemplateRenderer
 * Reads site.template and renders the correct layout.
 * Falls back to Dark Premium for legacy sites or unknown template values.
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
  theme:          ThemeConfig;         // used by Dark Premium
  themeOverride?: Partial<ThemeConfig>;
  heroImageUrl?:  string;
};

export function TemplateRenderer({ site, content, theme, themeOverride, heroImageUrl: heroImageUrlProp }: Props) {
  const resolvedTheme: ThemeConfig = themeOverride ? { ...theme, ...themeOverride } : theme;
  const heroImageUrl = heroImageUrlProp ?? getHeroImageUrl(site.industry);
  const primaryColor = resolvedTheme.primaryColor ?? COLOR_MAP[site.primaryColor] ?? "#10b981";
  const template = site.template ?? "darkpremium";

  const sharedProps = { site, content, primaryColor, heroImageUrl };

  switch (template) {
    case "neobrutalism":
      return <NeoBrutalismLayout {...sharedProps} />;
    case "minimal":
      return <MinimalLayout {...sharedProps} />;
    case "magazine":
      return <MagazineLayout {...sharedProps} />;
    case "classic":
      return <ClassicLayout {...sharedProps} />;
    case "darkpremium":
    default:
      return (
        <DarkPremiumLayout
          {...sharedProps}
          theme={resolvedTheme}
        />
      );
  }
}
