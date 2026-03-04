/**
 * GET /api/admin/sync-subscription?email=user@example.com
 *
 * Looks up the user's active Stripe subscription by email, maps the
 * price ID to a plan name, and writes the canonical SubscriptionRecord
 * to Redis (sub:{email}).
 *
 * Use this when a user has paid in Stripe but their Redis record is
 * missing, stale, or has the wrong plan / customerId.
 *
 * Protected: caller must be authenticated as ADMIN_EMAIL.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { kv, getSubscriptionByEmail } from "@/lib/kv";
import type { SubscriptionRecord } from "@/lib/kv";
import { stripe } from "@/lib/stripe";

// ── Price ID → plan name map ───────────────────────────────────────────────────
function priceIdToPlan(
  priceId: string
): "starter" | "growth" | "pro" | null {
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY)     return "pro";
  if (priceId === process.env.STRIPE_PRICE_GROWTH_MONTHLY)  return "growth";
  if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY) return "starter";
  return null;
}

export async function GET(req: NextRequest) {
  // ── Auth: admin only ─────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAIL not configured" }, { status: 500 });
  }

  const session = await getSession(req);
  console.log("[sync-subscription] session email:", session?.email ?? "(no session)");

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.email !== adminEmail) {
    return NextResponse.json(
      { error: "Forbidden — admin only", sessionEmail: session.email },
      { status: 403 }
    );
  }

  // ── Read + validate target email ─────────────────────────────────────────────
  const targetEmail = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!targetEmail) {
    return NextResponse.json(
      { error: "Missing required query param: ?email=user@example.com" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not configured" }, { status: 500 });
  }

  // ── Find Stripe customer by email ────────────────────────────────────────────
  const customers = await stripe.customers.list({ email: targetEmail, limit: 1 });
  if (!customers.data.length) {
    return NextResponse.json(
      { error: `No Stripe customer found for ${targetEmail}` },
      { status: 404 }
    );
  }
  const customer = customers.data[0];

  // ── Get their active subscription ────────────────────────────────────────────
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: "active",
    limit: 1,
  });

  // Also try trialing if no active found
  let sub = subscriptions.data[0];
  if (!sub) {
    const trialing = await stripe.subscriptions.list({
      customer: customer.id,
      status: "trialing",
      limit: 1,
    });
    sub = trialing.data[0];
  }

  if (!sub) {
    return NextResponse.json(
      {
        error: `No active or trialing subscription found for ${targetEmail} (customer: ${customer.id})`,
        customerId: customer.id,
      },
      { status: 404 }
    );
  }

  // ── Map price ID to plan name ─────────────────────────────────────────────────
  const priceId = sub.items.data[0]?.price?.id ?? "";
  const plan = priceIdToPlan(priceId);

  if (!plan) {
    return NextResponse.json(
      {
        error: `Unknown price ID: ${priceId}. Check STRIPE_PRICE_*_MONTHLY env vars.`,
        customerId: customer.id,
        subscriptionId: sub.id,
        priceId,
      },
      { status: 422 }
    );
  }

  // ── Build and save canonical SubscriptionRecord ───────────────────────────────
  const existing = await getSubscriptionByEmail(targetEmail);
  const record: SubscriptionRecord = {
    ...(existing ?? {}),
    plan,
    customerId:     customer.id,
    subscriptionId: sub.id,
    status:         sub.status === "trialing" ? "trialing" : "active",
    activatedAt:    existing?.activatedAt ?? new Date().toISOString(),
    updatedAt:      new Date().toISOString(),
  };

  await kv.set(`sub:${targetEmail}`, record);

  console.log(
    `[sync-subscription] Synced ${targetEmail} → plan=${plan} customer=${customer.id} sub=${sub.id}`
  );

  return NextResponse.json({
    success:        true,
    email:          targetEmail,
    plan,
    customerId:     customer.id,
    subscriptionId: sub.id,
    status:         record.status,
    priceId,
  });
}
