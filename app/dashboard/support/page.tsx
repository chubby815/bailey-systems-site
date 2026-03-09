"use client";

import { useState } from "react";
import Link from "next/link";

// ── Result types ────────────────────────────────────────────────────────────
type TemplateItem   = { title: string; content: string };
type FaqItem        = { question: string; answer: string };
type ComplaintLevel = { level: string; response: string };

type TemplatesResult  = { type: "templates";   items: TemplateItem[] };
type FaqResult        = { type: "faq";          items: FaqItem[] };
type BrandVoiceResult = { type: "brand_voice";  toneDescription: string; wordsToUse: string[]; wordsToAvoid: string[]; examplePhrases: string[] };
type ComplaintsResult = { type: "complaints";   levels: ComplaintLevel[] };
type ReviewsResult    = { type: "reviews";      fiveStar: string; threeStar: string; oneStar: string };

type Result = TemplatesResult | FaqResult | BrandVoiceResult | ComplaintsResult | ReviewsResult;

// ── Constants ────────────────────────────────────────────────────────────────
const BRAND_TONES    = ["Friendly", "Professional", "Casual", "Luxury", "Bold"] as const;
const CONTENT_TYPES  = ["Reply Templates", "FAQ Generator", "Brand Voice Guide", "Complaint Handler", "Review Responses"] as const;

type Pill = string;

// ── Shared sub-components ────────────────────────────────────────────────────
function PillSelector({ options, value, onChange }: { options: readonly Pill[]; value: Pill; onChange: (v: Pill) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            value === o
              ? "bg-[#00e5a0] border-[#00e5a0] text-black"
              : "bg-transparent border-white/[0.10] text-[#9ca3af] hover:border-white/25 hover:text-white"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="text-xs font-semibold border border-white/[0.10] hover:border-white/25 text-[#9ca3af] hover:text-white px-3 py-1.5 rounded-lg transition-all shrink-0"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

// ── Result renderers ────────────────────────────────────────────────────────
function TemplatesView({ data }: { data: TemplatesResult }) {
  return (
    <div className="space-y-3">
      {data.items.map((item, i) => (
        <div key={i} className="bg-[#111214] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">{item.title}</p>
            <CopyButton text={item.content} />
          </div>
          <p className="text-sm text-[#9ca3af] leading-relaxed whitespace-pre-wrap">{item.content}</p>
        </div>
      ))}
    </div>
  );
}

function FaqView({ data }: { data: FaqResult }) {
  const allText = data.items.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
  return (
    <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">Frequently Asked Questions</p>
        <CopyButton text={allText} label="Copy All FAQs" />
      </div>
      <div className="space-y-4 divide-y divide-white/[0.05]">
        {data.items.map((faq, i) => (
          <div key={i} className="pt-4 first:pt-0">
            <p className="text-sm font-bold mb-1">{faq.question}</p>
            <p className="text-sm text-[#9ca3af] leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandVoiceView({ data }: { data: BrandVoiceResult }) {
  const guideText =
    `BRAND VOICE GUIDE\n\n` +
    `Tone: ${data.toneDescription}\n\n` +
    `Words to Use:\n${data.wordsToUse.join(", ")}\n\n` +
    `Words to Avoid:\n${data.wordsToAvoid.join(", ")}\n\n` +
    `Example Phrases:\n${data.examplePhrases.join("\n")}`;

  return (
    <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">Brand Voice Guide</p>
        <CopyButton text={guideText} label="Copy Guide" />
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Tone Description</p>
        <p className="text-sm text-[#d1d5db] leading-relaxed">{data.toneDescription}</p>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#00e5a0] uppercase tracking-widest mb-2">Words to Use</p>
        <div className="flex flex-wrap gap-2">
          {data.wordsToUse.map((w, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[#00e5a0]/[0.08] border border-[#00e5a0]/20 text-[#00e5a0]">{w}</span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Words to Avoid</p>
        <div className="flex flex-wrap gap-2">
          {data.wordsToAvoid.map((w, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-red-500/[0.06] border border-red-500/20 text-red-400">{w}</span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest mb-2">Example Phrases</p>
        <div className="space-y-2">
          {data.examplePhrases.map((p, i) => (
            <p key={i} className="text-sm text-[#9ca3af] italic">&ldquo;{p}&rdquo;</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplaintsView({ data }: { data: ComplaintsResult }) {
  const levelColors = ["border-yellow-500/30 bg-yellow-500/[0.04]", "border-orange-500/30 bg-orange-500/[0.04]", "border-[#00e5a0]/30 bg-[#00e5a0]/[0.04]"];
  const levelTextColors = ["text-yellow-400", "text-orange-400", "text-[#00e5a0]"];
  return (
    <div className="space-y-4">
      {data.levels.map((lvl, i) => (
        <div key={i} className={`border rounded-2xl p-5 ${levelColors[i] ?? "border-white/[0.07] bg-transparent"}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold uppercase tracking-widest ${levelTextColors[i] ?? "text-white"}`}>{lvl.level}</p>
            <CopyButton text={lvl.response} />
          </div>
          <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{lvl.response}</p>
        </div>
      ))}
    </div>
  );
}

function ReviewsView({ data }: { data: ReviewsResult }) {
  const reviews = [
    { label: "5 Star Review Response", stars: "⭐⭐⭐⭐⭐", text: data.fiveStar, color: "border-[#00e5a0]/25" },
    { label: "3 Star Review Response", stars: "⭐⭐⭐", text: data.threeStar, color: "border-yellow-500/25" },
    { label: "1 Star Review Response", stars: "⭐", text: data.oneStar, color: "border-red-500/25" },
  ];
  return (
    <div className="space-y-4">
      {reviews.map((r, i) => (
        <div key={i} className={`bg-[#111214] border ${r.color} rounded-2xl p-5`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">{r.label}</p>
              <p className="text-sm mt-0.5">{r.stars}</p>
            </div>
            <CopyButton text={r.text} />
          </div>
          <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap mt-3">{r.text}</p>
        </div>
      ))}
    </div>
  );
}

function ResultRenderer({ result }: { result: Result }) {
  switch (result.type) {
    case "templates":   return <TemplatesView data={result} />;
    case "faq":         return <FaqView data={result} />;
    case "brand_voice": return <BrandVoiceView data={result} />;
    case "complaints":  return <ComplaintsView data={result} />;
    case "reviews":     return <ReviewsView data={result} />;
  }
}

// ── Situation placeholders per content type ───────────────────────────────
const SITUATION_PLACEHOLDERS: Record<string, string> = {
  "Reply Templates":   "e.g. Customer asking about pricing",
  "FAQ Generator":     "e.g. Lawn care business in Chicago",
  "Brand Voice Guide": "e.g. Friendly and professional landscaping company serving suburban families",
  "Complaint Handler": "e.g. Customer unhappy with service quality",
  "Review Responses":  "e.g. Mix of 5 star and 1 star reviews on Google",
};

// ── Main page ────────────────────────────────────────────────────────────────
export default function CustomerSupportPage() {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry]         = useState("");
  const [brandTone, setBrandTone]       = useState<Pill>("Friendly");
  const [contentType, setContentType]   = useState<Pill>("Reply Templates");
  const [situation, setSituation]       = useState("");
  const [context, setContext]           = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Result | null>(null);
  const [error, setError]     = useState("");

  async function handleGenerate() {
    if (!businessName.trim() || !industry.trim() || !situation.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/support/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, industry, brandTone, contentType, situation, context }),
      });
      const data = await res.json() as Result & { error?: string };
      if (!res.ok) { setError((data as unknown as { error: string }).error ?? "Generation failed."); return; }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const INPUT   = "w-full bg-[#0d0e10] border border-white/[0.08] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors";
  const LABEL   = "block text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-2";
  const SECTION = "bg-[#111214] border border-white/[0.07] rounded-2xl p-6 space-y-4";

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Bailey<span className="text-[#00e5a0]">Agents</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-[#6b7280] hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        {/* Hero */}
        <div>
          <div className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-2">Agent</div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            🎧 Customer Support Agent
          </h1>
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Generate reply templates, FAQ pages, and brand voice guides that keep customers happy and save you hours.
          </p>
        </div>

        {/* Form */}
        <div className={SECTION}>
          <h2 className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Your Details</h2>

          <div>
            <label className={LABEL}>Business Name *</label>
            <input className={INPUT} value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Green Leaf Landscaping" />
          </div>

          <div>
            <label className={LABEL}>Industry *</label>
            <input className={INPUT} value={industry} onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Landscaping" />
          </div>

          <div>
            <label className={LABEL}>Brand Tone</label>
            <PillSelector options={BRAND_TONES} value={brandTone} onChange={setBrandTone} />
          </div>

          <div>
            <label className={LABEL}>Content Type</label>
            <PillSelector options={CONTENT_TYPES} value={contentType} onChange={setContentType} />
          </div>

          <div>
            <label className={LABEL}>Specific Situation *</label>
            <textarea
              className={INPUT}
              rows={3}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder={SITUATION_PLACEHOLDERS[contentType] ?? "Describe the situation..."}
            />
          </div>

          <div>
            <label className={LABEL}>Extra Context (optional)</label>
            <textarea className={INPUT} rows={2} value={context} onChange={(e) => setContext(e.target.value)}
              placeholder="Any specific policies, prices, or details to include" />
          </div>

          <button
            onClick={() => void handleGenerate()}
            disabled={loading || !businessName.trim() || !industry.trim() || !situation.trim()}
            className="w-full bg-[#00e5a0] hover:bg-[#00ffb2] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "Creating your support content..." : "Generate Support Content 🎧"}
          </button>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && <ResultRenderer result={result} />}
      </div>
    </main>
  );
}
