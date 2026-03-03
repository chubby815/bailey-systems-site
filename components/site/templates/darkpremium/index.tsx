/**
 * Dark Premium template — the original BaileySystemsAI design.
 * Delegates entirely to the existing LayoutRenderer + section components.
 */
import { LayoutRenderer } from "@/components/site/LayoutRenderer";
import type { SiteRecord } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";

export type TemplateProps = {
  site:          SiteRecord;
  content:       StructuredSiteContent;
  primaryColor:  string;
  theme:         ThemeConfig;
  heroImageUrl?: string;
};

export function DarkPremiumLayout({ site, content, theme, heroImageUrl }: TemplateProps) {
  return (
    <LayoutRenderer
      site={site}
      content={content}
      theme={theme}
      heroImageUrl={heroImageUrl}
    />
  );
}
