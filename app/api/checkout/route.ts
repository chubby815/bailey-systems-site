import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { rateLimit } from "@/lib/ratelimit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

// Product price mappings — replace with actual Stripe Price IDs before enabling
const PRICE_MAP: Record<string, string> = {
  price_bento_template: "price_1234567890",
  price_ecommerce_pro:  "price_1234567891",
  price_saas_dashboard: "price_1234567892",
  price_portfolio_site: "price_1234567893",
  price_blog_cms:       "price_1234567894",
  price_booking_system: "price_1234567895",
  price_landing_pro:    "price_1234567896",
  price_admin_panel:    "price_1234567897",
};

export async function POST(request: NextRequest) {
  // Rate limit: 5 checkout attempts per hour per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit(`store-checkout:${ip}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  try {
    const body = await request.json() as { priceId?: unknown; productName?: unknown };
    const { priceId, productName } = body;

    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "Missing required field: priceId" }, { status: 400 });
    }
    if (!productName || typeof productName !== "string") {
      return NextResponse.json({ error: "Missing required field: productName" }, { status: 400 });
    }

    // Sanitize — strip HTML tags and control characters, enforce max length
    const cleanProductName = productName
      .replace(/<[^>]*>/g, "")
      .replace(/[\x00-\x1F\x7F]/g, "")
      .trim()
      .slice(0, 200);

    if (!cleanProductName) {
      return NextResponse.json({ error: "Invalid product name" }, { status: 400 });
    }

    const stripePriceId = PRICE_MAP[priceId];
    if (!stripePriceId) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/store?success=true&product=${encodeURIComponent(cleanProductName)}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/store?canceled=true`,
      metadata: {
        productName: cleanProductName,
        priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
