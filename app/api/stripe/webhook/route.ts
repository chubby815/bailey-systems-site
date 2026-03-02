import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { kv } from "@/lib/kv";
import Stripe from "stripe";


const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
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

        const email = session.customer_email ?? session.customer_details?.email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const plan = session.metadata?.plan ?? "starter";

        if (email) {
          await kv.set(`sub:${email}`, {
            plan,
            customerId,
            subscriptionId,
            status: "active",
            activatedAt: new Date().toISOString(),
          });
          // Also index by Stripe customer ID for webhook lookups
          await kv.set(`sub:cust:${customerId}`, email);
        }

        console.log(`[webhook] activated ${plan} for ${email}`);
        break;
      }

      // ── Subscription updated (upgrade/downgrade) ──────────────────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const email = await kv.get<string>(`sub:cust:${customerId}`);
        if (!email) break;

        const plan = sub.metadata?.plan ?? "starter";
        const status = sub.status; // active | past_due | canceled | etc.

        await kv.set(`sub:${email}`, {
          plan,
          customerId,
          subscriptionId: sub.id,
          status,
          updatedAt: new Date().toISOString(),
        });

        console.log(`[webhook] updated ${email} → ${plan} (${status})`);
        break;
      }

      // ── Subscription canceled ─────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const email = await kv.get<string>(`sub:cust:${customerId}`);
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

      // ── Payment failed ────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const email = await kv.get<string>(`sub:cust:${customerId}`);
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
