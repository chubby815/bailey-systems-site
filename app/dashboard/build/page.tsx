"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const INDUSTRIES = [
  "Landscaping", "Plumbing", "Electrician", "Beauty & Wellness",
  "Restaurant", "Consulting", "Real Estate", "Fitness",
  "Auto & Mechanic", "Cleaning", "Other",
];

const TONES = ["Professional", "Friendly", "Bold", "Luxury", "Minimal"];

const YEARS_OPTIONS = [
  "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years",
];

const FONT_STYLES = [
  { value: "Modern",           label: "Modern",            desc: "Clean sans-serif" },
  { value: "Classic & Elegant",label: "Classic & Elegant", desc: "Serif, refined" },
  { value: "Bold & Strong",    label: "Bold & Strong",     desc: "Heavy, impactful" },
  { value: "Clean & Minimal",  label: "Clean & Minimal",   desc: "Light, airy" },
];

const HERO_STYLES = [
  { value: "Photo Background",    label: "Photo Background",    desc: "Real industry photo" },
  { value: "Gradient Background", label: "Gradient Background", desc: "Color gradient" },
  { value: "Solid Color",         label: "Solid Color",         desc: "Bold solid color" },
];

const LAYOUT_STYLES = [
  { value: "Standard", label: "Standard", desc: "Classic layout" },
  { value: "Centered",  label: "Centered",  desc: "Narrow, focused" },
  { value: "Full Width", label: "Full Width", desc: "Edge-to-edge" },
];

const COLORS = [
  { label: "Emerald Green",  value: "Emerald Green",  hex: "#10b981" },
  { label: "Electric Blue",  value: "Electric Blue",  hex: "#0066ff" },
  { label: "Sunset Orange",  value: "Sunset Orange",  hex: "#f97316" },
  { label: "Royal Purple",   value: "Royal Purple",   hex: "#7c3aed" },
  { label: "Fire Red",       value: "Fire Red",       hex: "#ef4444" },
  { label: "Midnight Black", value: "Midnight Black", hex: "#0a0a0a" },
  { label: "Golden Yellow",  value: "Golden Yellow",  hex: "#eab308" },
  { label: "Hot Pink",       value: "Hot Pink",       hex: "#ec4899" },
  { label: "Cyan",           value: "Cyan",           hex: "#06b6d4" },
  { label: "Slate Gray",     value: "Slate Gray",     hex: "#64748b" },
  { label: "Rose Gold",      value: "Rose Gold",      hex: "#fb7185" },
  { label: "Deep Navy",      value: "Deep Navy",      hex: "#1e3a5f" },
];

type FormData = {
  // Core
  businessName: string;
  industry: string;
  location: string;
  services: string;
  tone: string;
  primaryColor: string;
  contactEmail: string;
  contactPhone: string;
  // Extended info
  tagline: string;
  description: string;
  yearsInBusiness: string;
  facebookUrl: string;
  instagramUrl: string;
  googleBusinessUrl: string;
  businessHours: string;
  serviceArea: string;
  // Style
  fontStyle: string;
  heroStyle: string;
  layoutStyle: string;
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
  tagline: "",
  description: "",
  yearsInBusiness: "1-3 years",
  facebookUrl: "",
  instagramUrl: "",
  googleBusinessUrl: "",
  businessHours: "",
  serviceArea: "",
  fontStyle: "Modern",
  heroStyle: "Photo Background",
  layoutStyle: "Standard",
};

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4b5563]">{label}</span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      {children}
    </div>
  );
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({ num, label, required, hint, children }: {
  num?: number | string; label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
        {num && <span className="text-[#4b5563] mr-1">{num}.</span>}
        {label}{required && <span className="text-red-400 ml-1">*</span>}
        {hint && <span className="ml-1 text-[#4b5563] normal-case tracking-normal lowercase font-normal">&nbsp;— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS = "bg-[#111214] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00e5a0]/50 transition-colors";

function BuildForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSiteId = searchParams.get("edit");
  const isEditMode = !!editSiteId;

  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planLimitMsg, setPlanLimitMsg] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "generating">("form");

  useEffect(() => {
    if (!editSiteId) return;
    setPrefilling(true);
    fetch(`/api/sites/${editSiteId}`)
      .then((r) => r.json())
      .then((site) => {
        if (site && !site.error) {
          setForm({
            businessName:     site.businessName    ?? "",
            industry:         site.industry        ?? "Landscaping",
            location:         site.location        ?? "",
            services:         site.services        ?? "",
            tone:             site.tone            ?? "Professional",
            primaryColor:     site.primaryColor    ?? "Emerald Green",
            contactEmail:     site.contactEmail    ?? "",
            contactPhone:     site.contactPhone    ?? "",
            tagline:          site.tagline         ?? "",
            description:      site.description     ?? "",
            yearsInBusiness:  site.yearsInBusiness ?? "1-3 years",
            facebookUrl:      site.facebookUrl     ?? "",
            instagramUrl:     site.instagramUrl    ?? "",
            googleBusinessUrl:site.googleBusinessUrl ?? "",
            businessHours:    site.businessHours   ?? "",
            serviceArea:      site.serviceArea     ?? "",
            fontStyle:        site.fontStyle       ?? "Modern",
            heroStyle:        site.heroStyle       ?? "Photo Background",
            layoutStyle:      site.layoutStyle     ?? "Standard",
          });
        }
      })
      .catch(() => setError("Failed to load site data."))
      .finally(() => setPrefilling(false));
  }, [editSiteId]);

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
      const payload = isEditMode ? { ...form, editSiteId } : form;
      const res = await fetch("/api/sites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push("/login?redirect=/dashboard/build"); return; }
        if (res.status === 403 && data.error === "plan_limit") {
          setPlanLimitMsg(data.message ?? "You've reached your plan's site limit.");
          setStep("form");
          setLoading(false);
          return;
        }
        if (res.status === 403) { router.push("/pricing?reason=subscription_required"); return; }
        throw new Error(data.error ?? "Generation failed");
      }
      router.push(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
      setLoading(false);
    }
  }

  if (prefilling) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="text-[#6b7280] text-sm animate-pulse">Loading site data...</div>
      </div>
    );
  }

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-[#08090a] flex flex-col items-center justify-center text-center px-6">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#00e5a0]/10 flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-2 border-[#00e5a0] border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="font-syne text-2xl font-black text-white mb-3">
            {isEditMode ? "Regenerating your site..." : "Building your site..."}
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
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="font-syne font-black text-lg">
          Bailey<span className="text-[#00e5a0]">Systems</span>AI
        </Link>
        <Link href="/dashboard" className="text-sm text-[#6b7280] hover:text-[#f0f0f0] transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-14">
        {/* Heading */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
            {isEditMode ? "Regenerate Site" : "AI Website Builder"}
          </div>
          <h1 className="font-syne text-3xl md:text-4xl font-black tracking-tight mb-3">
            {isEditMode ? "Update your site" : "Tell us about your business"}
          </h1>
          <p className="text-[#6b7280] leading-relaxed">
            {isEditMode
              ? "Edit any details below and click Regenerate to create an updated version."
              : "Fill out the form below and our AI will generate a complete, professional website for you in seconds."}
          </p>
        </div>

        {planLimitMsg && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 mb-6">
            <p className="text-amber-400 text-sm font-semibold mb-2">🔒 Site limit reached</p>
            <p className="text-amber-300/80 text-sm mb-3">{planLimitMsg}</p>
            <Link href="/pricing"
              className="inline-block text-sm font-bold bg-[#00e5a0] text-black px-4 py-2 rounded-lg hover:bg-[#00ffb2] transition-colors">
              Upgrade Plan →
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* ── BUSINESS INFO ─────────────────────────────────────────── */}
          <Section label="Business Info">

            <Field num={1} label="Business Name" required>
              <input type="text" value={form.businessName} onChange={(e) => set("businessName", e.target.value)}
                placeholder="e.g. Green Leaf Landscaping" required className={INPUT_CLS} />
            </Field>

            <Field num={2} label="Industry">
              <select value={form.industry} onChange={(e) => set("industry", e.target.value)}
                className={`${INPUT_CLS} appearance-none cursor-pointer`}>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>

            <Field num={3} label="Location" required>
              <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Chicago, IL" required className={INPUT_CLS} />
            </Field>

            <Field num={4} label="Services Offered" required hint="comma separated">
              <textarea value={form.services} onChange={(e) => set("services", e.target.value)}
                placeholder="e.g. Lawn mowing, Hedge trimming, Seasonal cleanup, Irrigation installation"
                rows={3} required
                className={`${INPUT_CLS} resize-none leading-relaxed`} />
            </Field>

            <Field num={9} label="Business Tagline" hint="optional">
              <input type="text" value={form.tagline} onChange={(e) => set("tagline", e.target.value)}
                placeholder="e.g. Rockford's most trusted lawn care" className={INPUT_CLS} />
            </Field>

            <Field num={10} label="Business Description" hint="optional">
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Tell us more about your business, your experience, and why customers choose you"
                rows={3} className={`${INPUT_CLS} resize-none leading-relaxed`} />
            </Field>

            <Field num={11} label="Years in Business">
              <select value={form.yearsInBusiness} onChange={(e) => set("yearsInBusiness", e.target.value)}
                className={`${INPUT_CLS} appearance-none cursor-pointer`}>
                {YEARS_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>

            <Field num={14} label="Service Area" hint="optional">
              <input type="text" value={form.serviceArea} onChange={(e) => set("serviceArea", e.target.value)}
                placeholder="e.g. Serving Rockford, Machesney Park, Loves Park and surrounding areas"
                className={INPUT_CLS} />
            </Field>

          </Section>

          {/* ── CONTACT ───────────────────────────────────────────────── */}
          <Section label="Contact Details">

            <Field num={7} label="Contact Email">
              <input type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="e.g. hello@greenleaf.com" className={INPUT_CLS} />
            </Field>

            <Field num={8} label="Contact Phone">
              <input type="tel" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)}
                placeholder="e.g. (312) 555-0192" className={INPUT_CLS} />
            </Field>

            <Field num={13} label="Business Hours" hint="optional">
              <textarea value={form.businessHours} onChange={(e) => set("businessHours", e.target.value)}
                placeholder="Mon-Fri 8am-6pm, Sat 9am-3pm" rows={2}
                className={`${INPUT_CLS} resize-none leading-relaxed`} />
            </Field>

          </Section>

          {/* ── SOCIAL MEDIA ──────────────────────────────────────────── */}
          <Section label="Social Media (optional)">

            <Field num="12a" label="Facebook URL">
              <input type="url" value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/yourbusiness" className={INPUT_CLS} />
            </Field>

            <Field num="12b" label="Instagram URL">
              <input type="url" value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/yourbusiness" className={INPUT_CLS} />
            </Field>

            <Field num="12c" label="Google Business URL">
              <input type="url" value={form.googleBusinessUrl} onChange={(e) => set("googleBusinessUrl", e.target.value)}
                placeholder="https://g.page/yourbusiness" className={INPUT_CLS} />
            </Field>

          </Section>

          {/* ── BRAND STYLE ───────────────────────────────────────────── */}
          <Section label="Brand Style">

            <Field num={5} label="Brand Tone">
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button key={t} type="button" onClick={() => set("tone", t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.tone === t
                        ? "bg-[#00e5a0] text-black border-[#00e5a0]"
                        : "bg-[#111214] text-[#6b7280] border-white/[0.07] hover:border-white/20"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field num={6} label="Primary Color">
              <div className="flex items-center justify-end mb-1">
                {form.primaryColor && (
                  <span className="flex items-center gap-1.5 text-xs text-[#f0f0f0]">
                    <span className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: COLORS.find((c) => c.value === form.primaryColor)?.hex }} />
                    {form.primaryColor}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-6 gap-3">
                {COLORS.map((c) => {
                  const selected = form.primaryColor === c.value;
                  const isDark = c.value === "Midnight Black" || c.value === "Deep Navy";
                  return (
                    <button key={c.value} type="button" title={c.label} onClick={() => set("primaryColor", c.value)}
                      className="group flex flex-col items-center gap-1.5">
                      <span className="w-10 h-10 rounded-full border-2 transition-all duration-150 group-hover:scale-110"
                        style={{
                          backgroundColor: c.hex,
                          borderColor: selected ? "#ffffff" : "transparent",
                          boxShadow: selected
                            ? `0 0 0 3px #08090a, 0 0 0 5px ${c.hex}`
                            : isDark ? "0 0 0 1px rgba(255,255,255,0.12)" : "none",
                        }} />
                      <span className={`text-[10px] leading-tight text-center transition-colors ${
                        selected ? "text-[#f0f0f0]" : "text-[#4b5563] group-hover:text-[#9ca3af]"
                      }`} style={{ maxWidth: "56px" }}>
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

          </Section>

          {/* ── SITE STYLE ────────────────────────────────────────────── */}
          <Section label="Site Style">

            <Field label="Font Style">
              <div className="grid grid-cols-2 gap-2">
                {FONT_STYLES.map((f) => (
                  <button key={f.value} type="button" onClick={() => set("fontStyle", f.value)}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all ${
                      form.fontStyle === f.value
                        ? "border-[#00e5a0] bg-[#00e5a0]/5"
                        : "border-white/[0.07] bg-[#111214] hover:border-white/20"
                    }`}>
                    <span className={`text-sm font-semibold ${form.fontStyle === f.value ? "text-[#00e5a0]" : "text-[#f0f0f0]"}`}>
                      {f.label}
                    </span>
                    <span className="text-xs text-[#4b5563] mt-0.5">{f.desc}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Hero Style">
              <div className="grid grid-cols-3 gap-2">
                {HERO_STYLES.map((h) => (
                  <button key={h.value} type="button" onClick={() => set("heroStyle", h.value)}
                    className={`flex flex-col items-start px-3 py-3 rounded-xl border text-left transition-all ${
                      form.heroStyle === h.value
                        ? "border-[#00e5a0] bg-[#00e5a0]/5"
                        : "border-white/[0.07] bg-[#111214] hover:border-white/20"
                    }`}>
                    <span className={`text-sm font-semibold ${form.heroStyle === h.value ? "text-[#00e5a0]" : "text-[#f0f0f0]"}`}>
                      {h.label}
                    </span>
                    <span className="text-xs text-[#4b5563] mt-0.5">{h.desc}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Layout Style">
              <div className="grid grid-cols-3 gap-2">
                {LAYOUT_STYLES.map((l) => (
                  <button key={l.value} type="button" onClick={() => set("layoutStyle", l.value)}
                    className={`flex flex-col items-start px-3 py-3 rounded-xl border text-left transition-all ${
                      form.layoutStyle === l.value
                        ? "border-[#00e5a0] bg-[#00e5a0]/5"
                        : "border-white/[0.07] bg-[#111214] hover:border-white/20"
                    }`}>
                    <span className={`text-sm font-semibold ${form.layoutStyle === l.value ? "text-[#00e5a0]" : "text-[#f0f0f0]"}`}>
                      {l.label}
                    </span>
                    <span className="text-xs text-[#4b5563] mt-0.5">{l.desc}</span>
                  </button>
                ))}
              </div>
            </Field>

          </Section>

          {/* ── SUBMIT ────────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-white/[0.07]">
            <button type="submit" disabled={loading}
              className="w-full bg-[#00e5a0] hover:bg-[#00ffb2] text-black font-bold py-4 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? (isEditMode ? "Regenerating..." : "Generating...")
                : (isEditMode ? "Regenerate Site →" : "Generate My Site →")}
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

export default function BuildPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="text-[#6b7280] text-sm animate-pulse">Loading...</div>
      </div>
    }>
      <BuildForm />
    </Suspense>
  );
}
