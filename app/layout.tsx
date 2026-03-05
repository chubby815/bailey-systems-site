import type { Metadata } from "next";
import Script from "next/script";
import { Syne, DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BaileyChat } from "@/components/BaileyChat";

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

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        {!isCustomerSite && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=AW-17983960384"
              strategy="afterInteractive"
            />
            <Script id="google-ads-tag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-17983960384');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        {!isCustomerSite && <Navbar />}
        {children}
        {!isCustomerSite && <Footer />}
        {!isCustomerSite && <BaileyChat />}
      </body>
    </html>
  );
}
