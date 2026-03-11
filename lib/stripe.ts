/**
 * lib/stripe.ts
 * Stripe SDK init + price ID lookup.
 *
 * EXISTING: PRICE_LOOKUP (launch/scale/enterprise) — preserved, untouched.
 * ADDED:    SUBSCRIPTION_PRICES for the new Starter/Growth/Pro SaaS tiers.
 */

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

// ── Existing price IDs (legacy — kept for backward compatibility) ─────────────
export const PRICE_LOOKUP = {
  launch: process.env.STRIPE_PRICE_LAUNCH,
  scale: process.env.STRIPE_PRICE_SCALE,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
} as const;

// ── New subscription price IDs ────────────────────────────────────────────────
// Set these in .env.local and Vercel dashboard:
//   STRIPE_PRICE_STARTER_MONTHLY=price_xxx
//   STRIPE_PRICE_GROWTH_MONTHLY=price_xxx
//   STRIPE_PRICE_PRO_MONTHLY=price_xxx
export const SUBSCRIPTION_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  growth: process.env.STRIPE_PRICE_GROWTH_MONTHLY,
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY,
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PRICES;

// ── Plan metadata (display info) ──────────────────────────────────────────────
export const PLAN_DETAILS: Record<
  SubscriptionPlan,
  {
    name: string;
    price: number;
    description: string;
    features: string[];
    limits: { sites: number | "unlimited"; runs: number | "unlimited" };
  }
> = {
  starter: {
    name: "Starter",
    price: 29,
    description: "Perfect for solo operators getting online fast.",
    features: [
      "1 AI Website",
      "Website Builder agent",
      "20 AI runs/month",
      "Basic templates",
      "/sites/[id] hosting",
      "Email support",
    ],
    limits: { sites: 1, runs: 20 },
  },
  growth: {
    name: "Growth",
    price: 79,
    description: "All three AI agents for growing businesses.",
    features: [
      "Up to 3 AI Websites",
      "All 3 AI Agents",
      "150 AI runs/month",
      "All templates",
      "Lead scoring + CRM export",
      "Content calendar dashboard",
      "Priority AI processing",
      "Priority support",
    ],
    limits: { sites: 3, runs: 150 },
  },
  pro: {
    name: "Pro",
    price: 149,
    description: "Unlimited output and custom branding for agencies.",
    features: [
      "Unlimited AI Websites",
      "All 3 AI Agents",
      "Unlimited runs (fair use)",
      "Advanced templates",
      "Custom branding & white-label",
      "Usage analytics dashboard",
      "API access",
      "Premium support",
    ],
    limits: { sites: "unlimited", runs: "unlimited" },
  },
};
