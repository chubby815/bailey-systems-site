import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — BaileySystemsAI",
  description: "Privacy Policy for BaileySystemsAI",
};

const SECTIONS = [
  {
    heading: "1. Information We Collect",
    body: `We collect only what is necessary to provide the Service:`,
    bullets: [
      "Email address — collected at sign-up and used to identify your account and send important notices.",
      "Payment information — collected by Stripe during checkout. BaileySystemsAI never sees or stores your full card number (see Section 5).",
      "Usage data — aggregated counts of how many AI runs you have used in the current billing period, stored in our database.",
      "Site content — the website copy, lead search inputs, and content packages you generate are stored so you can access them from your dashboard.",
    ],
    footer: "We do not collect your name, phone number, or physical address unless you voluntarily provide them as part of a generated site.",
  },
  {
    heading: "2. How We Use Your Information",
    body: `We use collected information solely to:`,
    bullets: [
      "Authenticate you and maintain your session.",
      "Enforce subscription plan limits and billing cycles.",
      "Deliver the AI-generated outputs you request.",
      "Send transactional emails (receipts, subscription changes, security notices).",
      "Detect and prevent fraud or abuse.",
    ],
    footer: "We do not use your data for advertising profiling or any purpose beyond operating the Service.",
  },
  {
    heading: "3. We Do Not Sell Your Data",
    body: `BaileySystemsAI does not sell, rent, or trade your personal information to any third party — ever. We do not share your data with data brokers or advertising networks.`,
  },
  {
    heading: "4. Data Sharing with Service Providers",
    body: `We share data only with the following trusted third-party providers necessary to operate the Service:`,
    bullets: [
      "Stripe — payment processing. Your payment details go directly to Stripe and are governed by Stripe's Privacy Policy (stripe.com/privacy).",
      "Anthropic (Claude) — AI content generation. Inputs are sent to Anthropic's API to generate website copy, leads scoring, and social content. Anthropic's usage policies apply.",
      "Google Places API — used for the Lead Hunter feature to search for real business listings. Searches are performed server-side.",
      "Upstash (Redis) — our database provider, hosted on AWS infrastructure in the United States.",
      "Vercel — our hosting platform. Your requests are processed on Vercel's infrastructure.",
    ],
    footer: "Each provider is contractually obligated to protect your data and use it only for the purpose of providing their service to us.",
  },
  {
    heading: "5. Payment Security",
    body: `All payment processing is handled by Stripe, a PCI-DSS Level 1 certified payment processor. BaileySystemsAI never has access to your full credit card number, CVV, or bank account details. When you subscribe, your browser communicates directly with Stripe's secure servers. We only store your Stripe Customer ID in our database to manage your subscription.`,
  },
  {
    heading: "6. Cookies",
    body: `We use a single session cookie (auth-token) to keep you logged in. This cookie is:`,
    bullets: [
      "HttpOnly — not accessible to JavaScript (prevents XSS theft).",
      "Secure — transmitted only over HTTPS in production.",
      "Session-scoped — expires after 30 days of inactivity.",
    ],
    footer: "We do not use tracking cookies, analytics cookies, or any third-party advertising cookies.",
  },
  {
    heading: "7. Data Retention",
    body: `We retain your account data for as long as your account is active. If you cancel your subscription and request account deletion, we will delete your data within 30 days. Usage counters (monthly run counts) automatically expire after 35 days via our database TTL settings.`,
  },
  {
    heading: "8. Your Rights",
    body: `You have the right to:`,
    bullets: [
      "Access the personal data we hold about you.",
      "Request correction of inaccurate data.",
      "Request deletion of your account and associated data.",
      "Export your generated site content from your dashboard at any time.",
    ],
    footer: "To exercise any of these rights, email support@baileysystemsai.com.",
  },
  {
    heading: "9. Children's Privacy",
    body: `BaileySystemsAI is not directed at children under 13. We do not knowingly collect personal information from anyone under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it immediately.`,
  },
  {
    heading: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Material changes will be communicated by email or an in-app notice at least 14 days before they take effect. The effective date at the top of this page will always reflect the most recent version.`,
  },
  {
    heading: "11. Contact Us",
    body: `If you have questions about this Privacy Policy or how we handle your data, contact us at support@baileysystemsai.com. We respond within 1–2 business days.`,
  },
];

export default function PrivacyPage() {
  return (
    <main
      style={{ background: "#08090a", minHeight: "100vh" }}
      className="pt-24 pb-24 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold uppercase tracking-widest text-[#6b7280] mb-6">
            Legal
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#f0f0f0] mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#4b5563]">
            Effective date: <span className="text-[#6b7280]">March 3, 2026</span>
          </p>
          <p className="mt-4 text-[#6b7280] leading-relaxed">
            Your privacy matters to us. This policy explains what data we collect, how we use it, and the choices you have. We keep it short and plain — no legal jargon.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] mb-10" />

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className="text-base font-bold text-[#f0f0f0] mb-2">{s.heading}</h2>
              <p className="text-sm text-[#9ca3af] leading-7 mb-2">{s.body}</p>
              {s.bullets && (
                <ul className="mt-2 space-y-1.5 pl-4">
                  {s.bullets.map((b) => (
                    <li key={b} className="text-sm text-[#9ca3af] leading-7 flex gap-2">
                      <span className="text-[#00e5a0] mt-1 flex-shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.footer && (
                <p className="mt-3 text-sm text-[#9ca3af] leading-7">{s.footer}</p>
              )}
            </section>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-[#4b5563]">© 2026 BaileySystemsAI. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-[#6b7280] hover:text-[#f0f0f0] transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="text-xs text-[#6b7280] hover:text-[#f0f0f0] transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
