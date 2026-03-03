/**
 * lib/kv.ts
 * Thin wrapper around Upstash Redis using the existing env vars
 * already connected in the project (KV_REST_API_URL / KV_REST_API_TOKEN).
 *
 * If you're using Vercel KV (which surfaces the same Upstash vars),
 * this works identically. No new env vars needed.
 */

import { Redis } from "@upstash/redis";

export const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ── Subscription record shape ─────────────────────────────────────────────────
export type SubscriptionRecord = {
  plan: "starter" | "growth" | "pro" | null;
  customerId: string;
  subscriptionId: string;
  status: "active" | "past_due" | "canceled" | "trialing";
  activatedAt?: string;
  canceledAt?: string;
  updatedAt?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Get subscription record by email */
export async function getSubscriptionByEmail(
  email: string
): Promise<SubscriptionRecord | null> {
  return kv.get<SubscriptionRecord>(`sub:${email}`);
}

/** Check if a user has an active (or trialing) subscription */
export async function hasActiveSubscription(email: string): Promise<boolean> {
  const record = await getSubscriptionByEmail(email);
  if (!record) return false;
  return record.status === "active" || record.status === "trialing";
}

/** Get the plan name for a user */
export async function getUserPlan(
  email: string
): Promise<SubscriptionRecord["plan"]> {
  const record = await getSubscriptionByEmail(email);
  if (!record || record.status === "canceled") return null;
  return record.plan;
}

// ── Site record shape ─────────────────────────────────────────────────────────
// Re-export content types from site-theme so consumers have a single import point.
export type {
  GeneratedContent,
  LegacySiteContent,
  StructuredSiteContent,
} from "./site-theme";

export type SiteRecord = {
  siteId: string;
  userId: string;
  businessName: string;
  industry: string;
  location: string;
  services: string;
  tone: string;
  primaryColor: string;
  contactEmail: string;
  contactPhone: string;
  // Extended info fields (optional for backward compat)
  tagline?: string;
  description?: string;
  yearsInBusiness?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  googleBusinessUrl?: string;
  businessHours?: string;
  serviceArea?: string;
  // Style choices
  fontStyle?: string;
  heroStyle?: string;
  layoutStyle?: string;
  // generatedContent accepts both the legacy flat format and the new structured format
  generatedContent: import("./site-theme").GeneratedContent;
  createdAt: string;
  // Editor overrides — set when the owner edits the site in the visual editor
  editorTheme?: import("./site-theme").ThemeConfig;
};

/** Save a generated site to Redis */
export async function saveSite(siteId: string, data: SiteRecord): Promise<void> {
  await kv.set(`site:${siteId}`, data);
}

/** Get a generated site from Redis */
export async function getSite(siteId: string): Promise<SiteRecord | null> {
  return kv.get<SiteRecord>(`site:${siteId}`);
}

/** Delete a generated site from Redis */
export async function deleteSite(siteId: string): Promise<void> {
  await kv.del(`site:${siteId}`);
}

/** Get all sites belonging to a specific user, sorted newest first */
export async function getUserSites(email: string): Promise<SiteRecord[]> {
  const keys = await kv.keys("site:*");
  if (!keys.length) return [];

  const values = await kv.mget<(SiteRecord | null)[]>(...keys);

  return values
    .filter((s): s is SiteRecord => s !== null && s.userId === email)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
