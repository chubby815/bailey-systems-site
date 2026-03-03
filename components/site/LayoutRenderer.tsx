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
  site:    SiteRecord;
  content: StructuredSiteContent;
  theme:   ThemeConfig;
};

export function LayoutRenderer({ site, content, theme }: Props) {
  const heroImageUrl = getHeroImageUrl(site.industry);
  const tokens = getThemeTokens(theme, heroImageUrl);

  // Determine the best tagline text for the footer
  const footerTagline =
    content.hero.badge ||
    site.tagline ||
    content.about.title ||
    "";

  return (
    <div style={{ fontFamily: tokens.fontFamily, color: "#1a1a1a", background: "#ffffff" }}>
      <SiteNavbar
        businessName={site.businessName}
        ctaText={content.hero.ctaText}
        tokens={tokens}
      />

      <SiteHero
        content={content.hero}
        theme={theme}
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
