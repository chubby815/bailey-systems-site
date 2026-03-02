"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRICING_PLANS, TRUST_ITEMS } from "@/utils/constants";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePlanClick(planId: string) {
    setLoading(planId);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If user not authenticated, redirect to login
        if (res.status === 401) {
          router.push(`/login?redirect=/pricing`);
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
          Monthly subscriptions. Cancel anytime. Start with a 7-day free trial — no
          credit card required.
        </p>
      </section>

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
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <span className="text-[#00e5a0] font-bold flex-shrink-0">✓</span>
                    {feature}
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
