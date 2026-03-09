import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies, getActivePlan, getSubscriptionStatus } from "@/lib/auth";

export const dynamic = "force-dynamic";

const RUN_LIMITS = { starter: 20, growth: 150, pro: "Unlimited" } as const;
const SITE_LIMITS = { starter: 1, growth: 3, pro: "Unlimited" } as const;
const PLAN_LABELS = { starter: "Starter", growth: "Growth", pro: "Pro" } as const;
const PLAN_COLORS = {
  starter: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", bar: "bg-emerald-400" },
  growth:  { text: "text-[#00e5a0]",   bg: "bg-[#00e5a0]/10",   border: "border-[#00e5a0]/20",   bar: "bg-[#00e5a0]"   },
  pro:     { text: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/20",    bar: "bg-blue-400"    },
} as const;

export default async function UsagePage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login?redirect=/dashboard/usage");

  const [plan, subscription] = await Promise.all([
    getActivePlan(session.email),
    getSubscriptionStatus(session.email),
  ]);
  if (!plan) redirect("/pricing?reason=subscription_required");

  const runLimit = RUN_LIMITS[plan];
  const siteLimit = SITE_LIMITS[plan];
  const colors = PLAN_COLORS[plan];
  const isUnlimited = plan === "pro";

  const renewalDate = subscription?.updatedAt
    ? new Date(new Date(subscription.updatedAt).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Bailey<span className="text-[#00e5a0]">Agents</span>
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
                ${i === 3
                  ? "text-[#00e5a0] bg-[#00e5a0]/5 border-r-2 border-[#00e5a0]"
                  : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 p-7 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              Usage
            </h1>
            <p className="text-gray-500 text-sm">Your plan limits and current usage this billing cycle.</p>
          </div>

          {/* Plan badge */}
          <div className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border mb-8 ${colors.text} ${colors.bg} ${colors.border}`}>
            {PLAN_LABELS[plan]} Plan
            {subscription?.status === "trialing" && (
              <span className="text-xs font-normal text-yellow-400 ml-1">· Free Trial Active</span>
            )}
          </div>

          {/* Usage cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {/* AI Runs */}
            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">AI Runs / Month</div>
                  <div className="text-3xl font-extrabold" style={{ fontFamily: "Syne, sans-serif" }}>
                    {isUnlimited ? "∞" : (
                      <>0 <span className="text-lg text-gray-500 font-normal">/ {runLimit}</span></>
                    )}
                  </div>
                </div>
                <div className="text-3xl">⚡</div>
              </div>
              {!isUnlimited && typeof runLimit === "number" && (
                <div className="w-full bg-white/[0.05] rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${colors.bar} transition-all`}
                    style={{ width: "0%" }}
                  />
                </div>
              )}
              {isUnlimited && (
                <div className="text-xs text-gray-500">No limit on AI runs (fair use policy applies)</div>
              )}
            </div>

            {/* Sites */}
            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Sites</div>
                  <div className="text-3xl font-extrabold" style={{ fontFamily: "Syne, sans-serif" }}>
                    {isUnlimited ? "∞" : (
                      <>0 <span className="text-lg text-gray-500 font-normal">/ {siteLimit}</span></>
                    )}
                  </div>
                </div>
                <div className="text-3xl">🌐</div>
              </div>
              {!isUnlimited && typeof siteLimit === "number" && (
                <div className="w-full bg-white/[0.05] rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${colors.bar} transition-all`}
                    style={{ width: "0%" }}
                  />
                </div>
              )}
              {isUnlimited && (
                <div className="text-xs text-gray-500">Unlimited sites with Pro plan</div>
              )}
            </div>
          </div>

          {/* Billing info */}
          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Billing Cycle</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <div className="capitalize font-medium text-[#00e5a0]">
                  {subscription?.status ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Next renewal</div>
                <div className="font-medium">{renewalDate}</div>
              </div>
            </div>
          </div>

          {plan !== "pro" && (
            <div className="bg-[#00e5a0]/5 border border-[#00e5a0]/20 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-[#00e5a0] mb-1">Need more runs or sites?</div>
                <div className="text-xs text-gray-500">Upgrade your plan to unlock more capacity.</div>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 bg-[#00e5a0] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00ffb2] transition-all"
              >
                Upgrade Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
