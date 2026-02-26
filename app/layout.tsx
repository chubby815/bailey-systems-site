import type { Metadata } from "next";
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