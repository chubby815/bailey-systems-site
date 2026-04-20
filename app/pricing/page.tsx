"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRICING_PLANS, TRUST_ITEMS } from "@/utils/constants";

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePlanClick(planId: string) {
    setLoading(planId);
    setError(null);

    try {
      // Pre-flight: confirm user has a Bailey session before hitting Stripe checkout.
      // Unauthenticated users go straight to signup — no guest checkout allowed.
      const sessionRes = await fetch("/api/user", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const sessionData = (await sessionRes.json().catch(() => ({}))) as {
        session?: { email?: string } | null;
      };
      if (!sessionRes.ok || !sessionData.session?.email) {
        router.push(`/login?mode=signup&redirect=/pricing`);
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Server-side guard: session was lost between pre-flight and POST.
        if (res.status === 401) {
          router.push(`/login?mode=signup&redirect=/pricing`);
          return;
        }
        // Email not verified yet — bounce them to login so they can resend verification.
        if (res.status === 403 && data?.error === "email_not_verified") {
          router.push(`/login?redirect=/pricing&error=verify_email`);
          return;
        }
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* ── Header ── */}
      <section className="pt-28 pb-16 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Monthly subscriptions. Cancel anytime. Start with a 7-day free trial —
          card required, you won&apos;t be charged until day 7.
        </p>
      </section>

      {/* ── Trial / subscription banners ── */}
      {reason === "trial_expired" && (
        <div className="max-w-2xl mx-auto mb-8 px-4">
          <div className="bg-orange-500/10 border border-orange-500/40 rounded-xl px-6 py-4 text-center text-orange-400 font-semibold">
            ⏳ Your free trial has ended. Choose a plan to continue using BaileyAgents.
          </div>
        </div>
      )}
      {reason === "subscription_required" && (
        <div className="max-w-2xl mx-auto mb-8 px-4">
          <div className="bg-orange-500/10 border border-orange-500/40 rounded-xl px-6 py-4 text-center text-orange-400 font-semibold">
            🔒 You need an active plan to access BaileyAgents. Choose a plan below.
          </div>
        </div>
      )}
      {reason === "past_due" && (
        <div className="max-w-2xl mx-auto mb-8 px-4">
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-6 py-4 text-center text-red-400 font-semibold">
            ⚠️ Your payment failed. Update your payment method to restore access.
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="max-w-md mx-auto mb-8 px-4">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-3 text-sm text-center">
            {error}
          </div>
        </div>
      )}

      {/* ── Pricing cards ── */}
      <section className="px-4 pb-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col
                ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-[#00e5a0]/7 to-[#0066ff]/5 border-[#00e5a0]/30 shadow-[0_0_40px_rgba(0,229,160,0.08)]"
                    : plan.id === "pro"
                    ? "bg-gradient-to-br from-[#0066ff]/7 to-[#7c3aed]/5 border-[#4444ff]/20"
                    : "bg-white/[0.02] border-white/[0.07]"
                }
                hover:border-white/20 hover:-translate-y-1`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00e5a0] text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div className="text-sm text-gray-500 mb-2">{plan.name}</div>

              {/* Price */}
              <div className="font-extrabold tracking-tight mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                <span className="text-lg align-super">$</span>
                <span className="text-5xl">{plan.price}</span>
                <span className="text-base text-gray-500 font-normal">{plan.billingPeriod}</span>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mt-3 mb-7 leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span className="text-[#00e5a0] font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span className="whitespace-pre-line">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded?.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className="flex-shrink-0">—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanClick(plan.id)}
                disabled={!!loading}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                  ${
                    plan.highlighted
                      ? "bg-[#00e5a0] text-black hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)] hover:-translate-y-0.5"
                      : plan.id === "pro"
                      ? "bg-gradient-to-r from-[#0066ff] to-[#7c3aed] text-white hover:brightness-110 hover:shadow-[0_8px_30px_rgba(0,102,255,0.3)] hover:-translate-y-0.5"
                      : "bg-transparent border border-white/10 text-white hover:border-[#00e5a0] hover:text-[#00e5a0]"
                  }`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Redirecting...
                  </span>
                ) : (
                  <>
                    {plan.cta}
                    {plan.id !== "pro" && (
                      <span className="ml-2 text-[10px] font-semibold bg-black/15 border border-current/20 px-2 py-0.5 rounded-full">
                        7 days free
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed px-2">
          * AgentXBook Agent requires free account at agentsxbook.com. Pro features require AgentXBook Pro
          $4.99/month
        </p>
      </section>

      {/* ── Ask Bailey callout ── */}
      <section className="px-4 pb-12 max-w-3xl mx-auto">
        <div className="bg-[#111214] border border-[#00e5a0]/20 rounded-2xl p-8 text-center">
          <p className="text-2xl mb-3">💬</p>
          <h2
            className="font-extrabold text-xl md:text-2xl tracking-tight mb-3 text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Ask Bailey – Edit Your Website by Just Talking to It
          </h2>
          <p className="text-[#6b7280] text-sm leading-relaxed max-w-xl mx-auto mb-5">
            Tell Bailey what to change in plain English and watch your website update instantly.
            The only AI website builder where you can say &ldquo;make my hero more premium&rdquo; and it just happens.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <span className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Starter</span>
              <span className="font-bold text-white">3 edits/month</span>
              <span className="text-[11px] text-[#4b5563]">Get a taste</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-[#00e5a0]/[0.05] border border-[#00e5a0]/20">
              <span className="text-xs font-bold text-[#00e5a0] uppercase tracking-widest">Growth</span>
              <span className="font-bold text-white">15 edits/month</span>
              <span className="text-[11px] text-[#6b7280]">Get more</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Pro</span>
              <span className="font-bold text-white">Unlimited</span>
              <span className="text-[11px] text-[#4b5563]">Get everything</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="px-4 pb-20 max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 pt-10 border-t border-white/[0.07]">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-base">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
