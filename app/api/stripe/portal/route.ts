import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";
import { kv, getSubscriptionByEmail } from "@/lib/kv";

export async function POST(req: NextRequest) {
  // Guard: Stripe SDK will throw an unhelpful error if the key is missing
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[stripe/portal] STRIPE_SECRET_KEY env var is not set");
    return NextResponse.json(
      { error: "Payment service not configured" },
      { status: 500 }
    );
  }

  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionByEmail(session.email);
  if (!subscription?.customerId) {
    return NextResponse.json(
      { error: "No active subscription found. Please subscribe first." },
      { status: 404 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://baileyagents.com";

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.customerId,
      return_url: `${baseUrl}/dashboard/billing`,
    });
    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[stripe/portal] Failed to create billing portal session:", err);
    const message = err instanceof Error ? err.message : "Unknown Stripe error";

    // Detect corrupted / test-mode customer IDs that don't exist in the current
    // Stripe environment (e.g. a cus_xxx from test mode used in live mode).
    const isStaleCustomer =
      message.includes("No such customer") ||
      message.includes("exists in test mode") ||
      message.includes("exists in live mode");

    if (isStaleCustomer) {
      // Auto-clear the bad customerId so the user can re-subscribe cleanly
      try {
        const updated = { ...subscription, customerId: "" };
        await kv.set(`sub:${session.email}`, updated);
        console.log(`[stripe/portal] Cleared stale customerId for ${session.email}`);
      } catch (kvErr) {
        console.error("[stripe/portal] Failed to clear stale customerId:", kvErr);
      }
      return NextResponse.json(
        {
          error:
            "Your billing account has been reset. Please refresh and re-subscribe.",
          code: "stale_customer",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to open billing portal: ${message}` },
      { status: 500 }
    );
  }
}
