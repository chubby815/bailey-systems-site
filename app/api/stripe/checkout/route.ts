import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
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

    // Get user email from session if authenticated (optional — Stripe allows guest checkout)
    const session = await getSession(req);
    const customerEmail = session?.email ?? undefined;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "https://baileysystemsai.com";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      subscription_data: {
        metadata: { plan },
      },
      metadata: { plan },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    console.error("[stripe/checkout] error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
