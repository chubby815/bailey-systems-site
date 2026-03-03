"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const INDUSTRIES = [
  "Landscaping",
  "Plumbing",
  "Electrician",
  "Beauty & Wellness",
  "Restaurant",
  "Consulting",
  "Real Estate",
  "Fitness",
  "Auto & Mechanic",
  "Cleaning",
  "Other",
];

const TONES = ["Professional", "Friendly", "Bold", "Luxury", "Minimal"];

const COLORS = [
  { label: "Emerald Green", value: "Emerald Green", hex: "#10b981" },
  { label: "Electric Blue", value: "Electric Blue", hex: "#3b82f6" },
  { label: "Sunset Orange", value: "Sunset Orange", hex: "#f97316" },
  { label: "Royal Purple", value: "Royal Purple", hex: "#8b5cf6" },
  { label: "Fire Red", value: "Fire Red", hex: "#ef4444" },
];

type FormData = {
  businessName: string;
  industry: string;
  location: string;
  services: string;
  tone: string;
  primaryColor: string;
  contactEmail: string;
  contactPhone: string;
};

const INITIAL: FormData = {
  businessName: "",
  industry: "Landscaping",
  location: "",
  services: "",
  tone: "Professional",
  primaryColor: "Emerald Green",
  contactEmail: "",
  contactPhone: "",
};

export default function BuildPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "generating">("form");

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName.trim() || !form.location.trim() || !form.services.trim()) {
      setError("Please fill in Business Name, Location, and Services.");
      return;
    }

    setError(null);
    setLoading(true);
    setStep("generating");

    try {
      const res = await fetch("/api/sites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=/dashboard/build");
          return;
        }
        if (res.status === 403) {
          router.push("/pricing?reason=subscription_required");
          return;
        }
        throw new Error(data.error ?? "Generation failed");
      }

      router.push(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
      setLoading(false);
    }
  }

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-[#08090a] flex flex-col items-center justify-center text-center px-6">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#00e5a0]/10 flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-2 border-[#00e5a0] border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="font-syne text-2xl font-black text-white mb-3">
            Building your site...
          </h2>
          <p className="text-[#6b7280] text-sm max-w-xs mx-auto leading-relaxed">
            Our AI is writing your headlines, crafting your copy, and structuring your pages.
            This takes about 10–15 seconds.
          </p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#00e5a0]"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f0f0f0]">
      {/* Top bar */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-syne font-black text-lg">
          Bailey<span className="text-[#00e5a0]">Systems</span>AI
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-[#6b7280] hover:text-[#f0f0f0] transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-14">
        {/* Heading */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
            AI Website Builder
          </div>
          <h1 className="font-syne text-3xl md:text-4xl font-black tracking-tight mb-3">
            Tell us about your business
          </h1>
          <p className="text-[#6b7280] leading-relaxed">
            Answer 8 quick questions and our AI will generate a complete, professional website for you in seconds.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Q1 Business Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              1. Business Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              placeholder="e.g. Green Leaf Landscaping"
              required
              className="bg-[#111214] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e5a0]/50 transition-colors"
            />
          </div>

          {/* Q2 Industry */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              2. Industry
            </label>
            <select
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
              className="bg-[#111214] border border-white/[0.07] text-[#f0f0f0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e5a0]/50 transition-colors appearance-none cursor-pointer"
            >
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          {/* Q3 Location */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              3. Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Chicago, IL"
              required
              className="bg-[#111214] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e5a0]/50 transition-colors"
            />
          </div>

          {/* Q4 Services */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              4. Services Offered <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.services}
              onChange={(e) => set("services", e.target.value)}
              placeholder="e.g. Lawn mowing, Hedge trimming, Seasonal cleanup, Irrigation installation"
              rows={3}
              required
              className="bg-[#111214] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e5a0]/50 transition-colors resize-none leading-relaxed"
            />
            <p className="text-xs text-[#4b5563]">Separate services with commas</p>
          </div>

          {/* Q5 Brand Tone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              5. Brand Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("tone", t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.tone === t
                      ? "bg-[#00e5a0] text-black border-[#00e5a0]"
                      : "bg-[#111214] text-[#6b7280] border-white/[0.07] hover:border-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Q6 Primary Color */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              6. Primary Color
            </label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set("primaryColor", c.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.primaryColor === c.value
                      ? "border-white/40 bg-white/5 text-[#f0f0f0]"
                      : "border-white/[0.07] text-[#6b7280] bg-[#111214] hover:border-white/20"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q7 Contact Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              7. Contact Email
            </label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              placeholder="e.g. hello@greenleaf.com"
              className="bg-[#111214] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e5a0]/50 transition-colors"
            />
          </div>

          {/* Q8 Contact Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              8. Contact Phone
            </label>
            <input
              type="tel"
              value={form.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              placeholder="e.g. (312) 555-0192"
              className="bg-[#111214] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e5a0]/50 transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/[0.07]">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00e5a0] hover:bg-[#00ffb2] text-black font-bold py-4 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate My Site →"}
            </button>
            <p className="text-center text-xs text-[#4b5563] mt-3">
              Takes about 10–15 seconds · Powered by AI
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
