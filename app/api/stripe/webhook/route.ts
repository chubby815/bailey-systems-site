import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { kv, getUser } from "@/lib/kv";
import Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// ── Price ID → plan name ───────────────────────────────────────────────────────
// Reading from the actual price ID (not subscription metadata) ensures portal
// upgrades/downgrades are reflected correctly — metadata is only set during our
// checkout flow and won't be updated if the user changes plan via Stripe portal.
// Resolve email from Redis index, falling back to Stripe customer lookup.
// Saves the result to Redis so future lookups succeed.
async function resolveEmail(customerId: string): Promise<string | null> {
  let email = await kv.get<string>(`sub:cust:${customerId}`);
  if (!email) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.email) {
        email = customer.email.toLowerCase();
        await kv.set(`sub:cust:${customerId}`, email);
        console.log(`[webhook] resolved + cached email for ${customerId}: ${email}`);
      }
    } catch {
      // Non-fatal — customer lookup failed
    }
  }
  return email ?? null;
}

function planFromPriceId(priceId: string | undefined | null): "starter" | "growth" | "pro" {
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO_MONTHLY)    return "pro";
  if (priceId && priceId === process.env.STRIPE_PRICE_GROWTH_MONTHLY) return "growth";
  if (priceId && priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY) return "starter";
  // Fall back to metadata if price ID doesn't match known IDs (e.g. legacy price)
  return "starter";
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook signature failed";
    console.error("[webhook] signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(`[webhook] received: ${event.type}`);

  try {
    switch (event.type) {
      // ── Subscription created or renewed ──────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        // Prefer the email captured at checkout creation (our verified Bailey user).
        // Fall back to Stripe-collected email only if metadata is somehow missing.
        const rawEmail =
          session.metadata?.baileyEmail ??
          session.customer_email ??
          session.customer_details?.email;
        const email = rawEmail ? rawEmail.toLowerCase() : null;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Resolve plan and actual status from the Stripe subscription object.
        // Fall back to session metadata if retrieval fails.
        let plan: string = session.metadata?.plan ?? "starter";
        let actualStatus: string = "active";
        let trialEnd: string | null = null;
        if (subscriptionId) {
          try {
            const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = stripeSub.items.data[0]?.price?.id;
            plan = planFromPriceId(priceId);
            actualStatus = stripeSub.status; // trialing | active | past_due | canceled
            trialEnd = stripeSub.trial_end
              ? new Date(stripeSub.trial_end * 1000).toISOString()
              : null;
          } catch {
            // Non-fatal — keep defaults
          }
        }

        if (!email) {
          console.warn(`[webhook] checkout.session.completed without email — skipping. session=${session.id}`);
          break;
        }

        // Safety net: only activate the subscription on a known, verified Bailey user.
        // The checkout API already enforces this, but if a session somehow reaches us
        // for an unknown / unverified email (typo, manual Stripe-dashboard checkout,
        // etc.), we refuse to write a sub:{email} record.
        const userRecord = await getUser(email);
        if (!userRecord) {
          console.warn(`[webhook] no Bailey user for ${email} — skipping subscription activation. session=${session.id}`);
          break;
        }
        if (!userRecord.emailVerified) {
          console.warn(`[webhook] user ${email} is not email-verified — skipping subscription activation. session=${session.id}`);
          break;
        }

        await kv.set(`sub:${email}`, {
          plan,
          customerId,
          subscriptionId,
          status: actualStatus,
          trialEnd,
          updatedAt: new Date().toISOString(),
        });
        // Also index by Stripe customer ID for webhook lookups
        await kv.set(`sub:cust:${customerId}`, email);
        // Permanently mark this email as having used their free trial.
        // No expiry — one trial per email address, regardless of cancellations.
        await kv.set(`trial-used:${email}`, true);

        console.log(`[webhook] activated ${plan} for ${email}`);
        break;
      }

      // ── Subscription updated (upgrade/downgrade) ──────────────────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const email = await resolveEmail(customerId);
        if (!email) break;

        // Read plan from the actual price ID — NOT metadata.
        // When a user upgrades/downgrades via the Stripe billing portal,
        // our checkout metadata isn't updated, but the price ID always reflects
        // the current plan correctly.
        const priceId = sub.items.data[0]?.price?.id;
        const plan = planFromPriceId(priceId);
        const status = sub.status; // active | past_due | canceled | trialing | etc.

        await kv.set(`sub:${email}`, {
          plan,
          customerId,
          subscriptionId: sub.id,
          status,
          updatedAt: new Date().toISOString(),
        });

        console.log(`[webhook] updated ${email} → ${plan} (${status}) priceId=${priceId}`);
        break;
      }

      // ── Subscription canceled ─────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const email = await resolveEmail(customerId);
        if (!email) break;

        await kv.set(`sub:${email}`, {
          plan: null,
          customerId,
          subscriptionId: sub.id,
          status: "canceled",
          canceledAt: new Date().toISOString(),
        });

        console.log(`[webhook] canceled subscription for ${email}`);
        break;
      }

      // ── Payment succeeded (re-activates past_due accounts) ───────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const email = await resolveEmail(customerId);
        if (!email) break;

        const current = await kv.get<Record<string, unknown>>(`sub:${email}`);
        if (!current) break;

        // Only update if currently past_due — don't overwrite active subscriptions
        if (current.status === "past_due") {
          await kv.set(`sub:${email}`, {
            ...current,
            status: "active",
            updatedAt: new Date().toISOString(),
          });
          console.log(`[webhook] payment_succeeded — reactivated account for ${email}`);
        }
        break;
      }

      // ── Payment failed ────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const email = await resolveEmail(customerId);
        if (!email) break;

        const existing = await kv.get<Record<string, unknown>>(`sub:${email}`);
        if (existing) {
          await kv.set(`sub:${email}`, { ...existing, status: "past_due" });
        }

        console.log(`[webhook] payment failed for ${email}`);
        break;
      }

      default:
        console.log(`[webhook] unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[webhook] handler error:", err);
    // Return 200 anyway so Stripe doesn't retry — log and investigate separately
  }

  return NextResponse.json({ received: true });
}
