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
