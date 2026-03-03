import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Bailey Agents",
  description: "Terms of Service for Bailey Agents",
};

const SECTIONS = [
  {
    heading: "1. Service Description",
    body: `Bailey Agents provides a subscription-based SaaS platform that enables users to generate AI-powered websites, run lead-generation searches, and produce social media content ("the Service"). Access to specific features depends on the subscription plan you select.`,
  },
  {
    heading: "2. Subscription and Billing",
    body: `By subscribing, you authorize Bailey Agents to charge your payment method on a recurring monthly basis at the rate disclosed at checkout. All subscriptions begin with a 7-day free trial (one trial per email address). After the trial period your card is charged automatically. Prices may change with 30 days' notice to the email on file.`,
  },
  {
    heading: "3. Cancellation Policy",
    body: `You may cancel your subscription at any time from your billing dashboard or by emailing support@baileyagents.com. Cancellations take effect at the end of the current billing period — you retain access to paid features until that date. Cancelling before the trial ends means you will not be charged.`,
  },
  {
    heading: "4. No Refunds After Trial",
    body: `All payments made after the 7-day free trial are non-refundable. We do not offer pro-rated refunds for unused time within a billing period. If you believe a charge was made in error, contact us within 7 days of the charge and we will review it promptly.`,
  },
  {
    heading: "5. Acceptable Use",
    body: `You agree not to use the Service to generate spam, harass individuals, violate any applicable law, attempt to reverse-engineer or scrape the platform, or create content that infringes third-party intellectual property rights. Bailey Agents reserves the right to suspend accounts that violate this policy without refund.`,
  },
  {
    heading: "6. Service Availability",
    body: `We strive for high availability but do not guarantee uninterrupted access. Scheduled maintenance, third-party outages (AI providers, payment processors, hosting), or unforeseen technical issues may cause temporary downtime. Bailey Agents is not liable for losses resulting from service interruptions.`,
  },
  {
    heading: "7. Intellectual Property",
    body: `Content you generate using the Service (website copy, social media posts, etc.) belongs to you. Bailey Agents retains ownership of the platform, codebase, prompts, and all underlying technology. You may not resell or sublicense access to the Service itself.`,
  },
  {
    heading: "8. Limitation of Liability",
    body: `To the maximum extent permitted by law, Bailey Agents' total liability to you for any claim arising under these Terms shall not exceed the amount you paid in the 30 days preceding the claim. We are not liable for indirect, incidental, special, or consequential damages of any kind, including lost profits or data.`,
  },
  {
    heading: "9. Changes to These Terms",
    body: `We may update these Terms at any time. Material changes will be communicated via email or an in-app notice at least 14 days before taking effect. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.`,
  },
  {
    heading: "10. Governing Law",
    body: `These Terms are governed by the laws of the State of Illinois, United States, without regard to conflict-of-law principles. Any disputes shall be resolved in the courts of Winnebago County, Illinois.`,
  },
  {
    heading: "11. Contact Us",
    body: `Questions about these Terms? Reach us at support@baileyagents.com. We typically respond within 1–2 business days.`,
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-[#4b5563]">
            Effective date: <span className="text-[#6b7280]">March 3, 2026</span>
          </p>
          <p className="mt-4 text-[#6b7280] leading-relaxed">
            Please read these Terms of Service carefully before using Bailey Agents. By accessing or using our platform you agree to be bound by these Terms.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] mb-10" />

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className="text-base font-bold text-[#f0f0f0] mb-2">{s.heading}</h2>
              <p className="text-sm text-[#9ca3af] leading-7">{s.body}</p>
            </section>
          ))}
        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-[#4b5563]">© 2026 Bailey Agents. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-[#6b7280] hover:text-[#f0f0f0] transition-colors">
              Privacy Policy
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
