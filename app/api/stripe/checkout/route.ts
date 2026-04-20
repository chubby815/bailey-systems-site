import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { kv, getUser } from "@/lib/kv";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
  growth: process.env.STRIPE_PRICE_GROWTH_MONTHLY!,
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY!,
};

export async function POST(req: NextRequest) {
  // ── Rate limit: 5 checkout attempts per hour per IP ───────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit(`checkout:${ip}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  try {
    const { plan } = await req.json();

    if (!plan || !PRICE_MAP[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = PRICE_MAP[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for plan: ${plan}` },
        { status: 500 }
      );
    }

    // Require an authenticated, email-verified Bailey account before checkout.
    // No guest checkout — every Stripe subscription must map back to a real user record.
    const session = await getSession(req);
    if (!session?.email) {
      return NextResponse.json(
        { error: "auth_required", message: "Please sign up or log in before choosing a plan." },
        { status: 401 }
      );
    }

    const customerEmail = session.email.toLowerCase();
    const userRecord = await getUser(customerEmail);
    if (!userRecord) {
      return NextResponse.json(
        { error: "account_not_found", message: "No account found. Please sign up first." },
        { status: 401 }
      );
    }
    if (!userRecord.emailVerified) {
      return NextResponse.json(
        {
          error: "email_not_verified",
          message: "Please verify your email before choosing a plan. Check your inbox for the verification link.",
          email: customerEmail,
        },
        { status: 403 }
      );
    }

    // One trial per email address — check if this verified email has already used a trial
    const trialEligible = !(await kv.get(`trial-used:${customerEmail}`));

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "https://baileyagents.com";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      subscription_data: {
        ...(trialEligible ? { trial_period_days: 7 } : {}),
        metadata: { plan, baileyEmail: customerEmail },
      },
      metadata: { plan, baileyEmail: customerEmail },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    console.error("[stripe/checkout] error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
