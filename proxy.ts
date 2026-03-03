import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const config = {
  matcher: [
    // Run on every route except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Inject pathname header so app/layout.tsx can detect /sites/* routes ──
  // (headers() in Server Components only reads request headers, not route info)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  // ── Auth guard for /dashboard routes ────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const session = await getSession(req);
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
