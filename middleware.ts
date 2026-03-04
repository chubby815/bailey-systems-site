/**
 * middleware.ts
 *
 * Two responsibilities:
 *
 * 1. SUBDOMAIN ROUTING
 *    *.baileyagents.com  →  internally rewrite to /sites/{subdomain}
 *    e.g. elninostacos.baileyagents.com  →  /sites/elninostacos
 *    The SitePage then does a slug→siteId lookup in Redis.
 *
 * 2. x-pathname HEADER
 *    Forward the pathname on every request so layout.tsx (a Server Component
 *    that reads headers()) can decide whether to suppress the main navbar/footer
 *    for customer-generated sites.
 */

import { NextRequest, NextResponse } from "next/server";

const BASE_DOMAIN = "baileyagents.com";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const hostname = request.headers.get("host") ?? "";

  // Strip port for comparison (handles localhost:3000, etc.)
  const host = hostname.split(":")[0];

  // ── Subdomain detection ───────────────────────────────────────────────────
  // Match *.baileyagents.com, but NOT:
  //   baileyagents.com itself
  //   www.baileyagents.com
  const isSubdomain =
    host.endsWith(`.${BASE_DOMAIN}`) &&
    host !== BASE_DOMAIN &&
    host !== `www.${BASE_DOMAIN}`;

  if (isSubdomain) {
    // Extract the leftmost label: "elninostacos.baileyagents.com" → "elninostacos"
    const subdomain = host.slice(0, host.length - BASE_DOMAIN.length - 1);

    // Safety: skip empty, dot-containing, or underscore-containing labels
    // (Vercel uses _vercel, etc.)
    if (!subdomain || subdomain.includes(".") || subdomain.startsWith("_")) {
      return forwardWithPathname(request, nextUrl.pathname);
    }

    // Never rewrite API routes — they must always resolve on the main domain.
    // Without this guard, a request to elninostacos.baileyagents.com/api/admin/...
    // would get rewritten to /sites/elninostacos/api/admin/... → 404.
    if (nextUrl.pathname.startsWith("/api/")) {
      return forwardWithPathname(request, nextUrl.pathname);
    }

    // Preserve the request path so deep links work:
    //   elninostacos.baileyagents.com/         → /sites/elninostacos
    //   elninostacos.baileyagents.com?edit=true → /sites/elninostacos?edit=true
    const rewrittenPath =
      nextUrl.pathname === "/"
        ? `/sites/${subdomain}`
        : `/sites/${subdomain}${nextUrl.pathname}`;

    const url = nextUrl.clone();
    url.pathname = rewrittenPath;

    // Tell layout.tsx this is a customer site (suppresses BaileyAgents navbar/footer)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", `/sites/${subdomain}`);

    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  // ── Non-subdomain: just forward x-pathname ────────────────────────────────
  return forwardWithPathname(request, nextUrl.pathname);
}

function forwardWithPathname(request: NextRequest, pathname: string): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Run on all routes except Next.js internals and static assets.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
