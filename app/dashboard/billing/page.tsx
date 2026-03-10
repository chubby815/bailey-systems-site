import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies, getActivePlan, getSubscriptionStatus } from "@/lib/auth";
import BillingPortalButton from "./BillingPortalButton";

export const dynamic = "force-dynamic";

const PLAN_LABELS = { starter: "Starter", growth: "Growth", pro: "Pro" } as const;
const PLAN_PRICES = { starter: "$29/mo", growth: "$79/mo", pro: "$149/mo" } as const;
const PLAN_COLORS = {
  starter: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  growth:  "text-[#00e5a0] bg-[#00e5a0]/10 border-[#00e5a0]/20",
  pro:     "text-blue-400 bg-blue-400/10 border-blue-400/20",
} as const;

export default async function BillingPage() {
  let session = null;
  try { session = await getSessionFromCookies(); } catch { session = null; }
  if (!session) redirect("/login?redirect=/dashboard/billing");

  const [plan, subscription] = await Promise.all([
    getActivePlan(session.email).catch(() => null),
    getSubscriptionStatus(session.email).catch(() => null),
  ]);
  if (!plan) redirect("/pricing?reason=subscription_required");

  const colors = PLAN_COLORS[plan];

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
                ${i === 4
                  ? "text-[#00e5a0] bg-[#00e5a0]/5 border-r-2 border-[#00e5a0]"
                  : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 p-7 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              Billing
            </h1>
            <p className="text-gray-500 text-sm">Manage your subscription, payment method, and invoices.</p>
          </div>

          {/* Current plan card */}
          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Current Plan</div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${colors}`}>
                {subscription?.status === "trialing" ? "Free Trial" : (subscription?.status ?? "active")}
              </span>
            </div>

            <div className="flex items-end gap-3">
              <div className="text-3xl font-extrabold" style={{ fontFamily: "Syne, sans-serif" }}>
                {PLAN_LABELS[plan]}
              </div>
              <div className="text-gray-500 text-sm pb-1">{PLAN_PRICES[plan]}</div>
            </div>

            {subscription?.status === "trialing" && (
              <p className="text-xs text-yellow-400 mt-3">
                🎉 Your 7-day free trial is active. You won&apos;t be charged until the trial ends.
              </p>
            )}
            {subscription?.status === "past_due" && (
              <p className="text-xs text-red-400 mt-3">
                ⚠️ Your last payment failed. Please update your payment method below.
              </p>
            )}
          </div>

          {/* Manage subscription */}
          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 mb-5">
            <div className="text-sm font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
              Manage Subscription
            </div>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Update your payment method, view invoices, change plan, or cancel your
              subscription through the Stripe secure billing portal.
            </p>
            <BillingPortalButton />
          </div>

          {/* Upgrade nudge */}
          {plan !== "pro" && (
            <div className="bg-[#00e5a0]/5 border border-[#00e5a0]/20 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-[#00e5a0] mb-1">Ready to grow faster?</div>
                <div className="text-xs text-gray-500">Unlock all agents and higher limits.</div>
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
