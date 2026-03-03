import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";
import { getSubscriptionByEmail } from "@/lib/kv";

export async function POST(req: NextRequest) {
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

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.customerId,
    return_url: `${baseUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
