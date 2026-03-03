/**
 * LayoutRenderer
 * Renders all structured site sections in fixed order:
 * Navbar → Hero → Services → About → Testimonials → CTA → Footer
 */
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { getThemeTokens, getHeroImageUrl } from "@/lib/site-theme";

import { SiteNavbar }       from "./SiteNavbar";
import { SiteHero }         from "./SiteHero";
import { SiteServices }     from "./SiteServices";
import { SiteAbout }        from "./SiteAbout";
import { SiteTestimonials } from "./SiteTestimonials";
import { SiteCTA }          from "./SiteCTA";
import { SiteFooter }       from "./SiteFooter";

type Props = {
  site:           SiteRecord;
  content:        StructuredSiteContent;
  theme:          ThemeConfig;
  /** Partial theme override — merged on top of base theme. Used by the visual editor. */
  themeOverride?: Partial<ThemeConfig>;
  /** Custom hero image URL. When set, overrides the default industry photo. */
  heroImageUrl?:  string;
};

export function LayoutRenderer({ site, content, theme, themeOverride, heroImageUrl: heroImageUrlProp }: Props) {
  const resolvedTheme: ThemeConfig = themeOverride
    ? { ...theme, ...themeOverride }
    : theme;

  const heroImageUrl = heroImageUrlProp ?? getHeroImageUrl(site.industry);
  const tokens = getThemeTokens(resolvedTheme, heroImageUrl);

  // Determine the best tagline text for the footer
  const footerTagline =
    content.hero.badge ||
    site.tagline ||
    content.about.title ||
    "";

  const cssVarsFromTheme: Record<string, string> = {};
  if (resolvedTheme.headingColor)    cssVarsFromTheme["--heading-color"]  = resolvedTheme.headingColor;
  if (resolvedTheme.bodyColor)       cssVarsFromTheme["--body-color"]     = resolvedTheme.bodyColor;
  if (resolvedTheme.accentColor)     cssVarsFromTheme["--accent-color"]   = resolvedTheme.accentColor;
  if (resolvedTheme.buttonTextColor) cssVarsFromTheme["--btn-text-color"] = resolvedTheme.buttonTextColor;

  return (
    <div style={{
      fontFamily: tokens.fontFamily,
      color: "#1a1a1a",
      background: "#ffffff",
      "--primary":    tokens.primaryColor,
      "--background": "#ffffff",
      "--surface":    "#f9fafb",
      "--text-color": "#1a1a1a",
      "--accent":     tokens.primaryColor,
      ...cssVarsFromTheme,
    } as React.CSSProperties}>
      <SiteNavbar
        businessName={site.businessName}
        ctaText={content.hero.ctaText}
        tokens={tokens}
      />

      <SiteHero
        content={content.hero}
        theme={resolvedTheme}
        tokens={tokens}
        location={site.location}
        serviceArea={site.serviceArea}
      />

      <SiteServices
        content={content.services}
        tokens={tokens}
        location={site.location}
      />

      <SiteAbout
        content={content.about}
        tokens={tokens}
        site={site}
      />

      <SiteTestimonials
        content={content.testimonials}
        tokens={tokens}
      />

      <SiteCTA
        content={content.cta}
        tokens={tokens}
        contactEmail={site.contactEmail}
        contactPhone={site.contactPhone}
      />

      <SiteFooter
        site={site}
        tokens={tokens}
        tagline={footerTagline}
      />
    </div>
  );
}
