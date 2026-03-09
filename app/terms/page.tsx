import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Bailey Agents",
  description: "Terms of Service for Bailey Agents platform.",
};

const SECTIONS: {
  num: string;
  title: string;
  body?: string;
  bullets?: string[];
  footer?: string;
}[] = [
  {
    num: "Section 1",
    title: "Acceptance of Terms",
    body: "By using Bailey Agents you agree to these terms. If you do not agree, do not use the platform.",
  },
  {
    num: "Section 2",
    title: "Description of Service",
    body: "Bailey Agents provides AI-powered tools for:",
    bullets: [
      "Website generation",
      "Lead finding",
      "Content creation",
      "Social media posting",
      "Website analysis",
    ],
  },
  {
    num: "Section 3",
    title: "Subscription and Billing",
    bullets: [
      "Plans billed monthly via Stripe",
      "Starter: $29/month",
      "Growth: $79/month",
      "Pro: $149/month",
      "7-day free trial on all plans",
      "Cancel anytime — no questions asked",
      "No refunds on partial months",
    ],
  },
  {
    num: "Section 4",
    title: "Acceptable Use",
    body: "You agree NOT to:",
    bullets: [
      "Use Bailey Agents for illegal purposes",
      "Abuse the AI generation system",
      "Attempt to bypass plan limits",
      "Resell or redistribute generated content as your own SaaS product",
      "Use automated scripts to abuse the API",
    ],
  },
  {
    num: "Section 5",
    title: "Facebook Integration",
    bullets: [
      "You are responsible for content posted to your Facebook pages",
      "Bailey Agents posts only with your explicit authorization",
      "We are not responsible for Facebook policy violations caused by your content",
      "You can disconnect Facebook at any time",
    ],
  },
  {
    num: "Section 6",
    title: "Intellectual Property",
    bullets: [
      "AI generated content belongs to you",
      "Bailey Agents platform code and design remains property of Bailey Agents",
      "You may not clone or resell this platform",
    ],
  },
  {
    num: "Section 7",
    title: "Limitation of Liability",
    body: "Bailey Agents is provided as-is. We are not liable for:",
    bullets: [
      "Loss of business or revenue",
      "Facebook account restrictions",
      "AI generated content accuracy",
      "Third party service outages",
    ],
  },
  {
    num: "Section 8",
    title: "Termination",
    body: "We reserve the right to terminate accounts that violate these terms without refund.",
  },
  {
    num: "Section 9",
    title: "Changes to Terms",
    body: "We may update these terms at any time. Continued use means acceptance of changes.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-extrabold tracking-tight text-lg"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Bailey<span className="text-[#00e5a0]">Agents</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#6b7280] hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1
            className="text-4xl font-black tracking-tight mb-2"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm text-[#4b5563]">Last updated: March 2026</p>
          <p className="mt-4 text-[#6b7280] leading-relaxed text-sm">
            Please read these terms carefully before using the Bailey Agents platform.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section
              key={s.num}
              className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7"
            >
              <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-2">
                {s.num}
              </p>
              <h2
                className="text-base font-bold mb-3"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {s.title}
              </h2>
              {s.body && (
                <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">{s.body}</p>
              )}
              {s.bullets && (
                <ul className="space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                      <span className="text-[#00e5a0] shrink-0 mt-0.5">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {s.footer && (
                <p className="text-sm text-[#6b7280] mt-3 leading-relaxed">{s.footer}</p>
              )}
            </section>
          ))}

          {/* Section 10 — Contact */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-2">
              Section 10
            </p>
            <h2
              className="text-base font-bold mb-4"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Contact
            </h2>
            <p className="text-sm text-[#9ca3af] mb-4">
              For questions about these terms:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[#6b7280]">📧 </span>
                <a
                  href="mailto:support@baileyagents.com"
                  className="text-[#00e5a0] hover:underline"
                >
                  support@baileyagents.com
                </a>
              </p>
              <p>
                <span className="text-[#6b7280]">🌐 </span>
                <a
                  href="https://baileyagents.com"
                  className="text-[#00e5a0] hover:underline"
                >
                  baileyagents.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-[#4b5563]">
            © 2026 Bailey Agents. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-[#6b7280] hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/data-deletion"
              className="text-xs text-[#6b7280] hover:text-white transition-colors"
            >
              Data Deletion
            </Link>
            <Link
              href="/"
              className="text-xs text-[#6b7280] hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
