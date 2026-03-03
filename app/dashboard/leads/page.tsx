import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies, getActivePlan } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login?redirect=/dashboard/leads");

  const plan = await getActivePlan(session.email);
  if (!plan) redirect("/pricing?reason=subscription_required");

  const locked = plan === "starter";

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Bailey<span className="text-[#00e5a0]">Systems</span>AI
        </Link>
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-white/[0.07] min-h-[calc(100vh-57px)] py-6 hidden md:block sticky top-[57px]">
          {[
            { icon: "🌐", label: "My Sites", href: "/dashboard" },
            { icon: "🎯", label: "Lead Hunter", href: "/dashboard/leads" },
            { icon: "✍️", label: "Content Machine", href: "/dashboard/content" },
            { icon: "📊", label: "Usage", href: "/dashboard/usage" },
            { icon: "💳", label: "Billing", href: "/dashboard/billing" },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all
                ${i === 1
                  ? "text-[#3b82f6] bg-[#3b82f6]/5 border-r-2 border-[#3b82f6]"
                  : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 p-7">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                Lead Hunter
              </h1>
              <span className="text-xs font-bold bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-3 py-1 rounded-full">
                Coming Soon
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-8">
              Find qualified leads in your area and generate outreach messages automatically.
            </p>

            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-10 text-center">
              <div className="text-5xl mb-5">🚀</div>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                Lead Hunter — Coming Soon
              </h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                We&apos;re building an AI agent that finds local business leads, scores them, and
                writes personalized outreach emails — all in one click.
              </p>

              {locked ? (
                <div className="space-y-3">
                  <p className="text-xs text-yellow-500 font-medium">
                    ⚡ Requires Growth or Pro plan
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block bg-[#00e5a0] text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#00ffb2] transition-all"
                  >
                    Upgrade to Unlock →
                  </Link>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/[0.03] border border-white/[0.07] px-5 py-3 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                  You&apos;ll be notified when this agent launches
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Lead scoring", desc: "AI ranks leads by conversion likelihood" },
                { label: "CRM export", desc: "One-click export to spreadsheet" },
                { label: "Outreach copy", desc: "Personalized emails generated instantly" },
              ].map((f) => (
                <div key={f.label} className="bg-[#111214] border border-white/[0.07] rounded-xl p-4 opacity-50">
                  <div className="text-xs font-bold text-[#3b82f6] mb-1">{f.label}</div>
                  <div className="text-xs text-gray-500">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
