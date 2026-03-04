/**
 * GET /api/admin/reset-customer?email=user@example.com
 *
 * Clears the stripeCustomerId (customerId) from a user's sub:{email} Redis
 * record so they can re-subscribe with a clean Stripe customer object.
 *
 * Useful when a test-mode customer ID ends up in a production record
 * (or vice-versa), causing "No such customer" errors in the billing portal.
 *
 * Protected: caller must be authenticated as ADMIN_EMAIL.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { kv, getSubscriptionByEmail } from "@/lib/kv";

export async function GET(req: NextRequest) {
  // ── Auth: admin only ─────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAIL not configured" }, { status: 500 });
  }

  const session = await getSession(req);
  console.log("[reset-customer] session email:", session?.email ?? "(no session)");

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.email !== adminEmail) {
    return NextResponse.json(
      { error: "Forbidden — admin only", sessionEmail: session.email },
      { status: 403 }
    );
  }

  // ── Read target email from query param ───────────────────────────────────────
  const targetEmail = req.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!targetEmail) {
    return NextResponse.json(
      { error: "Missing required query param: ?email=user@example.com" },
      { status: 400 }
    );
  }

  // ── Fetch the existing subscription record ───────────────────────────────────
  const existing = await getSubscriptionByEmail(targetEmail);
  if (!existing) {
    return NextResponse.json(
      { error: `No subscription record found for ${targetEmail}` },
      { status: 404 }
    );
  }

  const previousCustomerId = existing.customerId ?? "(none)";

  // ── Clear the customerId ─────────────────────────────────────────────────────
  const updated = { ...existing, customerId: "" };
  await kv.set(`sub:${targetEmail}`, updated);

  console.log(
    `[reset-customer] Cleared customerId for ${targetEmail} (was: ${previousCustomerId})`
  );

  return NextResponse.json({
    success: true,
    email: targetEmail,
    previousCustomerId,
    message: `Billing account reset for ${targetEmail}. User can now re-subscribe.`,
  });
}
