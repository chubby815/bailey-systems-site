import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingVideoChat } from "@/components/FloatingVideoChat";
import { HackerToggle } from "@/components/HackerToggle";
import { KonamiCode } from "@/components/KonamiCode";

export const metadata: Metadata = {
  title: "Bailey Systems AI",
  description: "Custom AI agents, websites, apps, and automation systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Ads Tag */}
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
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <FloatingVideoChat />
        <HackerToggle />
        <KonamiCode />
      </body>
    </html>
  );
}