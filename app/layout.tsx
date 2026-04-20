import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import NavWrapper from "@/components/NavWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { verifySession } from "@/lib/auth";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Prevent Vercel from caching the root layout — it must read headers() fresh
// on every request so the /sites/* pathname check works correctly.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bailey Agents",
  description: "AI builds your complete business website in 60 seconds + finds leads on autopilot. 2,400+ businesses trust BaileyAgents. 7-day free trial.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  // Only trust x-pathname — set exclusively by our own middleware.ts.
  // Do NOT fall back to x-invoke-path: Vercel injects that as an internal
  // routing header and it can contain /sites/* values for non-site pages,
  // which would incorrectly hide the navbar/footer everywhere.
  const pathname = headersList.get("x-pathname") ?? "";
  const isCustomerSite = pathname.startsWith("/sites/");
  const isWorkflowEditor =
    pathname.startsWith("/dashboard/workflows/new") ||
    (pathname.startsWith("/dashboard/workflows/") &&
      pathname !== "/dashboard/workflows");
  const hideNav = isCustomerSite || isWorkflowEditor;

  // Parse auth-token directly from the raw cookie header — more reliable on Vercel
  // than cookies() from next/headers, which can silently return null in root layouts.
  const cookieHeader = headersList.get("cookie") ?? "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth-token=([^;]+)/);
  const session = tokenMatch?.[1] ? await verifySession(tokenMatch[1]) : null;
  const isLoggedIn = !!session;

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <meta name="facebook-domain-verification" content="nhn0bhrrtz0192wpswpma5vpktzl99" />
      </head>
      <body>
        <NavWrapper initialHideNav={hideNav} isLoggedIn={isLoggedIn} />
        {children}
        <FooterWrapper initialHide={hideNav} />
      </body>
    </html>
  );
}
