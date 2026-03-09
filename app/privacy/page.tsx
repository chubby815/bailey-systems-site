import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Bailey Agents",
  description: "Privacy Policy for Bailey Agents — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold tracking-tight text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
            Bailey<span className="text-[#00e5a0]">Agents</span>
          </Link>
          <Link href="/" className="text-sm text-[#6b7280] hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-black tracking-tight mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-sm text-[#4b5563]">Last updated: March 2026</p>
          <p className="mt-4 text-[#6b7280] leading-relaxed text-sm">
            Your privacy matters to us. This policy explains what data we collect, how we use it,
            and the choices you have.
          </p>
        </div>

        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Section 1
            </h2>
            <h3 className="text-base font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Information We Collect
            </h3>
            <p className="text-sm text-[#9ca3af] mb-4 leading-relaxed">
              Bailey Agents may collect the following information when you use our platform:
            </p>
            <ul className="space-y-2">
              {[
                "Name and email address",
                "Payment information (processed securely by Stripe — we never store card details)",
                "Connected social media account data when you authorize integrations like Facebook",
                "Usage data and generated content",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <span className="text-[#00e5a0] shrink-0 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Section 2
            </h2>
            <h3 className="text-base font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              How We Use Information
            </h3>
            <p className="text-sm text-[#9ca3af] mb-4 leading-relaxed">
              Information is used only to provide Bailey Agents platform features including:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "AI website generation",
                "Lead Hunter agent",
                "Content Machine agent",
                "Facebook Social Media agent",
                "Website Roast agent",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <span className="text-[#00e5a0] shrink-0 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              We do not sell or share your data with third parties.
            </p>
          </section>

          {/* Section 3 — Facebook */}
          <section className="bg-[#111214] border border-[#00e5a0]/20 rounded-2xl p-7">
            <h2 className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Section 3
            </h2>
            <h3 className="text-base font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Facebook Data
            </h3>
            <p className="text-sm text-[#9ca3af] mb-4 leading-relaxed">
              If you connect your Facebook account:
            </p>
            <ul className="space-y-2">
              {[
                "Bailey Agents requests access only after you explicitly authorize via Facebook OAuth",
                "We store only your Facebook Page ID, Page name, and Page access token",
                "This data is used solely to publish AI-generated posts on your behalf",
                "You can disconnect at any time from your dashboard",
                "We never access personal Facebook profile data beyond public_profile",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <span className="text-[#00e5a0] shrink-0 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Section 4
            </h2>
            <h3 className="text-base font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Data Security
            </h3>
            <ul className="space-y-2">
              {[
                "All data stored securely in encrypted cloud database",
                "Payments processed by Stripe (PCI DSS compliant)",
                "We never store credit card information",
                "Access tokens stored server-side only",
                "Never exposed to client or third parties",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <span className="text-[#00e5a0] shrink-0 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 — Data Deletion */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Section 5
            </h2>
            <h3 className="text-base font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Data Deletion
            </h3>
            <p className="text-sm text-[#9ca3af] mb-4 leading-relaxed">
              You can request deletion of all your data at any time. Requests are processed within 7 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/data-deletion"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-4 py-2.5 rounded-xl hover:bg-[#00e5a0]/20 transition-colors"
              >
                View Data Deletion Instructions →
              </Link>
              <a
                href="mailto:support@baileyagents.com"
                className="inline-flex items-center gap-2 text-sm text-[#6b7280] border border-white/[0.07] px-4 py-2.5 rounded-xl hover:border-white/20 hover:text-white transition-colors"
              >
                support@baileyagents.com
              </a>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Section 6
            </h2>
            <h3 className="text-base font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Cookies
            </h3>
            <p className="text-sm text-[#9ca3af] mb-3 leading-relaxed">
              Bailey Agents uses cookies only for:
            </p>
            <ul className="space-y-2">
              {[
                "Authentication (keeping you logged in)",
                "Session management",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <span className="text-[#00e5a0] shrink-0 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#6b7280] mt-3">
              We do not use tracking or advertising cookies.
            </p>
          </section>

          {/* Section 7 — Contact */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
              Section 7
            </h2>
            <h3 className="text-base font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Contact
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[#6b7280]">📧 </span>
                <a href="mailto:support@baileyagents.com" className="text-[#00e5a0] hover:underline">
                  support@baileyagents.com
                </a>
              </p>
              <p>
                <span className="text-[#6b7280]">🌐 </span>
                <a href="https://baileyagents.com" className="text-[#00e5a0] hover:underline">
                  baileyagents.com
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-[#4b5563]">© 2026 Bailey Agents. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-[#6b7280] hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/data-deletion" className="text-xs text-[#6b7280] hover:text-white transition-colors">
              Data Deletion
            </Link>
            <Link href="/" className="text-xs text-[#6b7280] hover:text-white transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
