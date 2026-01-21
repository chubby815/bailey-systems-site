import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- FIXED: No curly braces!
import { Footer } from "@/components/Footer";
import { FloatingVideoChat } from "@/components/FloatingVideoChat";

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
      </body>
    </html>
  );
}