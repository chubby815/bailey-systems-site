import { NextRequest, NextResponse } from "next/server";

/**
 * Injects the current pathname as a request header so server-component
 * layouts can read it (headers() only sees request headers, not route params).
 * Used by app/layout.tsx to suppress Navbar/Footer on /sites/* pages.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
