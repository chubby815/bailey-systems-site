import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Generated Site",
};

export default function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
