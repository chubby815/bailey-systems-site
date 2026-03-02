import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Auth check ──────────────────────────────────────────────────────────────
  const session = await getSession(req);

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── /dashboard — requires active subscription ───────────────────────────────
  // Subscription status is checked in the page itself via requireAuth()
  // to avoid an extra Redis round-trip here. Middleware just gates on auth.
  // If you want middleware-level sub check, import hasActiveSubscription from lib/kv.

  return NextResponse.next();
}
