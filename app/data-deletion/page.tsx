import Link from "next/link";

export const metadata = {
  title: "Data Deletion Instructions — Bailey Agents",
  description: "How to request deletion of your Bailey Agents account and associated data including Facebook tokens.",
};

export default function DataDeletionPage() {
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
          <p className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-3">
            Privacy
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Data Deletion Instructions
          </h1>
          <p className="text-[#6b7280] text-sm">
            Last updated: March 2026
          </p>
        </div>

        <div className="space-y-8">

          {/* Section 1 — Overview */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Overview
            </h2>
            <p className="text-[#9ca3af] leading-relaxed text-sm">
              Bailey Agents is committed to protecting your privacy. This page explains how to request
              deletion of your data including any connected Facebook account data.
            </p>
          </section>

          {/* Section 2 — What We Store */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              What Data We Store
            </h2>
            <ul className="space-y-3">
              {[
                "Your email and account information",
                "Facebook Page ID and access tokens (if you connected Facebook)",
                "AI generated content and website data",
                "Subscription and billing information (managed securely by Stripe)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <span className="text-[#00e5a0] mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 — How to Request */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              How to Request Deletion
            </h2>
            <p className="text-[#9ca3af] text-sm mb-5 leading-relaxed">
              To request deletion of your account and all associated data:
            </p>
            <ol className="space-y-3">
              {[
                <>Email us at: <a href="mailto:support@baileyagents.com" className="text-[#00e5a0] hover:underline">support@baileyagents.com</a></>,
                <>Subject line: <span className="text-white font-medium">&ldquo;Data Deletion Request&rdquo;</span></>,
                "Include your registered email address",
                "We will process your request within 7 days",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <span className="text-[#00e5a0] font-bold shrink-0 w-5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Section 4 — What Gets Deleted */}
          <section className="bg-[#111214] border border-[#00e5a0]/20 rounded-2xl p-7">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              What Gets Deleted
            </h2>
            <ul className="space-y-3 mb-5">
              {[
                "Your Bailey Agents account",
                "All connected Facebook tokens",
                "All generated websites and content",
                "All usage data and history",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#d1d5db]">
                  <span className="text-[#00e5a0] font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#6b7280] border-t border-white/[0.07] pt-4">
              <span className="font-semibold text-[#9ca3af]">Note:</span> Billing records may be
              retained by Stripe per their privacy policy.
            </p>
          </section>

          {/* Section 5 — Contact */}
          <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-7">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Contact
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[#6b7280]">Email: </span>
                <a
                  href="mailto:support@baileyagents.com"
                  className="text-[#00e5a0] hover:underline"
                >
                  support@baileyagents.com
                </a>
              </p>
              <p>
                <span className="text-[#6b7280]">Website: </span>
                <a
                  href="https://baileyagents.com"
                  className="text-[#00e5a0] hover:underline"
                >
                  baileyagents.com
                </a>
              </p>
            </div>
          </section>

          {/* Meta policy footer note */}
          <p className="text-xs text-[#4b5563] text-center pt-4 border-t border-white/[0.05]">
            This page satisfies Meta Platform Policy requirements for user data deletion.
          </p>

        </div>
      </div>
    </main>
  );
}
