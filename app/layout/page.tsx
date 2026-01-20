import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Bailey Systems AI",
  description: "AI Agents, Websites, Apps & Automations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* NAVBAR AT TOP */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="min-h-screen">{children}</main>

        {/* FOOTER AT BOTTOM */}
        <Footer />
      </body>
    </html>
  );
}
