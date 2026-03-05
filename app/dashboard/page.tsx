import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies, getActivePlan, getSubscriptionStatus } from "@/lib/auth";
import { getUserSites } from "@/lib/kv";
import { getMonthlyUsage, PLAN_LIMITS, type PlanKey } from "@/lib/usage";
import { SiteCard } from "@/components/SiteCard";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const session = await getSessionFromCookies();
  if (!session) redirect("/login?redirect=/dashboard");

  const [plan, subscription, sites, monthlyUsage] = await Promise.all([
    getActivePlan(session.email),
    getSubscriptionStatus(session.email),
    getUserSites(session.email),
    getMonthlyUsage(session.email),
  ]);

  // No active subscription → send to pricing
  if (!plan || subscription?.status === "canceled") {
    redirect("/pricing?reason=subscription_required");
  }

  const planLabels = { starter: "Starter", growth: "Growth", pro: "Pro" };
  const planColors = {
    starter: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    growth: "text-[#00e5a0] bg-[#00e5a0]/10 border-[#00e5a0]/20",
    pro: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };

  // Real limits from the plan
  const limits        = PLAN_LIMITS[(plan ?? "starter") as PlanKey];
  const runsLimit     = limits.runsPerMonth   === Infinity ? "∞" : limits.runsPerMonth;
  const sitesLimit    = limits.sitesTotal      === Infinity ? "∞" : limits.sitesTotal;
  const runsRemaining = limits.runsPerMonth    === Infinity
    ? "∞"
    : String(Math.max(0, limits.runsPerMonth - monthlyUsage));


  const firstName = session.name?.split(" ")[0] ?? "there";

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* ── Top bar ── */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Bailey<span className="text-[#00e5a0]">Agents</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${planColors[plan]}`}>
            {planLabels[plan]} Plan
          </span>
          <div className="w-8 h-8 rounded-full bg-[#00e5a0]/20 flex items-center justify-center text-[#00e5a0] text-sm font-bold">
            {(session.name ?? session.email).charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── Sidebar ── */}
        <aside className="w-52 border-r border-white/[0.07] min-h-[calc(100vh-57px)] py-6 hidden md:flex flex-col sticky top-[57px]">
          <div className="flex-1">
            {[
              { icon: "🌐", label: "My Sites", href: "/dashboard" },
              { icon: "🎯", label: "Lead Hunter", href: "/dashboard/leads" },
              { icon: "✍️", label: "Content Machine", href: "/dashboard/content" },
              { icon: "🔥", label: "Website Roast", href: "/dashboard/roast" },
              { icon: "📊", label: "Usage", href: "/dashboard/usage" },
              { icon: "💳", label: "Billing", href: "/dashboard/billing" },
            ].map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all
                  ${i === 0
                    ? "text-[#00e5a0] bg-[#00e5a0]/5 border-r-2 border-[#00e5a0]"
                    : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
          <div className="px-5 pb-2 border-t border-white/[0.07] pt-4">
            <LogoutButton className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 transition-colors w-full text-left py-1.5">
              <span>↪</span> Log Out
            </LogoutButton>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 p-7">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              Welcome, {firstName} 👋
            </h1>
            <p className="text-gray-500 text-sm">
              {subscription?.status === "trialing"
                ? `Free trial active · ${planLabels[plan]} plan · ${sites.length} site${sites.length !== 1 ? "s" : ""} · ${runsRemaining} runs remaining`
                : `You're on the ${planLabels[plan]} plan · ${sites.length} site${sites.length !== 1 ? "s" : ""} · ${runsRemaining} runs remaining`}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Sites",    value: String(sites.length), color: "text-[#00e5a0]" },
              { label: "Runs Used",       value: String(monthlyUsage), color: "" },
              { label: "Runs Remaining",  value: runsRemaining,        color: "" },
              { label: "Site Limit",      value: String(sitesLimit),   color: "" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#111214] border border-white/[0.07] rounded-xl p-5">
                <div className="text-xs text-gray-500 mb-2">{stat.label}</div>
                <div className={`text-3xl font-extrabold ${stat.color}`} style={{ fontFamily: "Syne, sans-serif" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* My Sites */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base" style={{ fontFamily: "Syne, sans-serif" }}>
                My Sites
                {sites.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-[#6b7280]">({sites.length})</span>
                )}
              </h2>
              <Link
                href="/dashboard/build"
                className="bg-[#00e5a0] text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#00ffb2] transition-colors"
              >
                + New Site
              </Link>
            </div>

            {sites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sites.map((site) => (
                  <SiteCard
                    key={site.siteId}
                    siteId={site.siteId}
                    businessName={site.businessName}
                    industry={site.industry}
                    createdAt={site.createdAt}
                    subdomainSlug={site.subdomainSlug}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#111214] border border-white/[0.07] rounded-xl p-12 text-center">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                  No sites yet
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                  Build your first AI-powered website in under 3 minutes. Just answer 8 questions.
                </p>
                <Link
                  href="/dashboard/build"
                  className="inline-block bg-[#00e5a0] text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)] transition-all"
                >
                  Build My First Site →
                </Link>
              </div>
            )}
          </div>

          {/* Agent cards */}
          <div>
            <h2 className="font-bold text-base mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              AI Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "🎯",
                  name: "Lead Hunter",
                  desc: "Find qualified leads with outreach copy.",
                  href: "/dashboard/leads",
                  available: plan === "growth" || plan === "pro",
                  color: "blue",
                },
                {
                  icon: "✍️",
                  name: "Content Machine",
                  desc: "7 posts, hashtags, and a blog draft.",
                  href: "/dashboard/content",
                  available: plan === "growth" || plan === "pro",
                  color: "purple",
                },
                {
                  icon: "🔥",
                  name: "Website Roast",
                  desc: "Get a brutally honest AI critique of any website.",
                  href: "/dashboard/roast",
                  available: true,
                  color: "orange",
                },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className={`bg-[#111214] border rounded-xl p-5 transition-all
                    ${agent.available
                      ? "border-white/[0.07] hover:border-white/20 hover:-translate-y-0.5"
                      : "border-white/[0.04] opacity-50"
                    }`}
                >
                  <div className="text-2xl mb-3">{agent.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{agent.name}</h3>
                  <p className="text-gray-500 text-xs mb-4">{agent.desc}</p>
                  {agent.available ? (
                    <Link
                      href={agent.href}
                      className="text-xs font-bold text-[#00e5a0] hover:underline"
                    >
                      Open Agent →
                    </Link>
                  ) : (
                    <Link
                      href="/pricing"
                      className="text-xs text-gray-600 hover:text-gray-400"
                    >
                      Upgrade to unlock →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
