"use client";

import { useState } from "react";
import Link from "next/link";
import { RefineChat } from "@/components/agents/RefineChat";

const COPY_SYSTEM_PROMPT =
  "You are a world-class copywriter who has written copy for Fortune 500 companies and viral marketing campaigns. " +
  "You write copy that converts readers into customers. " +
  "You understand SEO, psychology, and what makes people take action.";

type Result = { title: string; content: string; metaDescription: string };

const CONTENT_TYPES = ["Blog Post", "Facebook Ad", "Google Ad", "Landing Page", "About Us", "Product Description"] as const;
const TONES         = ["Professional", "Friendly", "Bold", "Luxury", "Conversational"] as const;
const WORD_COUNTS   = ["Short (100w)", "Medium (300w)", "Long (600w)"] as const;

type Pill = string;

function PillSelector({
  options, value, onChange,
}: { options: readonly Pill[]; value: Pill; onChange: (v: Pill) => void }) {
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

function wordCountEstimate(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function CopywriterClient() {
  const [businessName, setBusinessName] = useState("");
  const [contentType, setContentType]   = useState<Pill>("Blog Post");
  const [topic, setTopic]               = useState("");
  const [audience, setAudience]         = useState("");
  const [tone, setTone]                 = useState<Pill>("Professional");
  const [wordCount, setWordCount]       = useState<Pill>("Medium (300w)");
  const [keywords, setKeywords]         = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Result | null>(null);
  const [error, setError]     = useState("");

  async function handleGenerate() {
    if (!businessName.trim() || !topic.trim() || !audience.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/copywriter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, contentType, topic, audience, tone, wordCount, keywords }),
      });
      const data = await res.json() as Result & { error?: string };
      if (!res.ok) { setError(data.error ?? "Generation failed. Please try again."); return; }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const INPUT = "w-full bg-[#0d0e10] border border-white/[0.08] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors";
  const LABEL = "block text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-2";
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
        <div>
          <div className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-2">Agent</div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            ✍️ AI Copywriter
          </h1>
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Generate high-converting blog posts, ad copy, landing page copy, and website content in seconds.
          </p>
        </div>

        <div className={SECTION}>
          <h2 className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Your Details</h2>

          <div>
            <label className={LABEL}>Business Name *</label>
            <input className={INPUT} value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Green Leaf Landscaping" />
          </div>

          <div>
            <label className={LABEL}>Content Type</label>
            <PillSelector options={CONTENT_TYPES} value={contentType} onChange={setContentType} />
          </div>

          <div>
            <label className={LABEL}>Topic / Product *</label>
            <input className={INPUT} value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. benefits of professional lawn care in summer" />
          </div>

          <div>
            <label className={LABEL}>Target Audience *</label>
            <input className={INPUT} value={audience} onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. homeowners aged 30-55 in suburban areas" />
          </div>

          <div>
            <label className={LABEL}>Tone</label>
            <PillSelector options={TONES} value={tone} onChange={setTone} />
          </div>

          <div>
            <label className={LABEL}>Word Count</label>
            <PillSelector options={WORD_COUNTS} value={wordCount} onChange={setWordCount} />
          </div>

          <div>
            <label className={LABEL}>Keywords (optional)</label>
            <input className={INPUT} value={keywords} onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. lawn care, landscaping, yard maintenance" />
          </div>

          <button
            onClick={() => void handleGenerate()}
            disabled={loading || !businessName.trim() || !topic.trim() || !audience.trim()}
            className="w-full bg-[#00e5a0] hover:bg-[#00ffb2] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "Writing your copy..." : "Generate Copy ✍️"}
          </button>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
          )}
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                    {result.title}
                  </h2>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-[#6b7280] bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full">
                    ~{wordCountEstimate(result.content)} words
                  </span>
                </div>
                <CopyButton text={`${result.title}\n\n${result.content}`} label="Copy All" />
              </div>
              <div className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap border-t border-white/[0.06] pt-4">
                {result.content}
              </div>
            </div>

            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">Meta Description</p>
                <CopyButton text={result.metaDescription} label="Copy Meta" />
              </div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">{result.metaDescription}</p>
              <p className="text-[10px] text-[#4b5563] mt-2">{result.metaDescription.length}/160 characters</p>
            </div>

            <div className="bg-[#111214] border border-white/[0.05] rounded-2xl px-5 py-4">
              <p className="text-xs text-[#6b7280]">
                💡 <span className="font-semibold text-[#9ca3af]">Pro Tip:</span> Use this copy on your BaileyAgents website by clicking{" "}
                <Link href="/dashboard" className="text-[#00e5a0] hover:underline">Edit Site</Link>.
              </p>
            </div>

            <RefineChat
              originalResult={`${result.title}\n\n${result.content}`}
              agentType="copywriter"
              systemPrompt={COPY_SYSTEM_PROMPT}
              quickActions={["Make it shorter", "More persuasive", "Add statistics", "Change headline", "More casual tone"]}
              onRefined={(text) => {
                const lines     = text.split("\n");
                const newTitle  = lines[0]?.trim() ?? result.title;
                const newBody   = lines.slice(1).join("\n").trim();
                setResult({ ...result, title: newTitle, content: newBody || text });
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
