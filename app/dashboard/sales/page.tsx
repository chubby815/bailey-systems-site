"use client";

import { useState } from "react";
import Link from "next/link";
import { RefineChat } from "@/components/agents/RefineChat";

const SALES_SYSTEM_PROMPT =
  "You are a world-class sales trainer who has coached thousands of salespeople to close millions in deals. " +
  "You write scripts that feel natural and human, never pushy or salesy.";

type Objection = { objection: string; response: string };
type Result    = { mainContent: string; objections: Objection[]; powerPhrases: string[] };

const CHANNELS      = ["Phone Call", "In Person", "Video Call", "DM/Message", "Door to Door"] as const;
const CONTENT_TYPES = ["Full Sales Script", "Elevator Pitch", "Objection Handler", "Closing Lines", "Discovery Questions"] as const;
const TONES         = ["Confident", "Consultative", "Friendly", "Direct"] as const;

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

export default function SalesManagerPage() {
  const [businessName, setBusinessName] = useState("");
  const [selling, setSelling]           = useState("");
  const [target, setTarget]             = useState("");
  const [pricePoint, setPricePoint]     = useState("");
  const [channel, setChannel]           = useState<Pill>("Phone Call");
  const [contentType, setContentType]   = useState<Pill>("Full Sales Script");
  const [tone, setTone]                 = useState<Pill>("Consultative");

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Result | null>(null);
  const [error, setError]     = useState("");

  async function handleGenerate() {
    if (!businessName.trim() || !selling.trim() || !target.trim() || !pricePoint.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/sales/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, selling, target, pricePoint, channel, contentType, tone }),
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
            💰 Sales Manager
          </h1>
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Generate sales scripts, pitch frameworks, and objection handlers that close more deals.
          </p>
        </div>

        {/* Form */}
        <div className={SECTION}>
          <h2 className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Your Details</h2>

          <div>
            <label className={LABEL}>Your Business Name *</label>
            <input className={INPUT} value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Bailey Agents" />
          </div>

          <div>
            <label className={LABEL}>What You&apos;re Selling *</label>
            <input className={INPUT} value={selling} onChange={(e) => setSelling(e.target.value)}
              placeholder="e.g. AI website builder for small businesses" />
          </div>

          <div>
            <label className={LABEL}>Target Customer *</label>
            <input className={INPUT} value={target} onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. local restaurant owners who need a website" />
          </div>

          <div>
            <label className={LABEL}>Price Point *</label>
            <input className={INPUT} value={pricePoint} onChange={(e) => setPricePoint(e.target.value)}
              placeholder="e.g. $29/month or $500 one-time" />
          </div>

          <div>
            <label className={LABEL}>Sales Channel</label>
            <PillSelector options={CHANNELS} value={channel} onChange={setChannel} />
          </div>

          <div>
            <label className={LABEL}>Content Type</label>
            <PillSelector options={CONTENT_TYPES} value={contentType} onChange={setContentType} />
          </div>

          <div>
            <label className={LABEL}>Tone</label>
            <PillSelector options={TONES} value={tone} onChange={setTone} />
          </div>

          <button
            onClick={() => void handleGenerate()}
            disabled={loading || !businessName.trim() || !selling.trim() || !target.trim() || !pricePoint.trim()}
            className="w-full bg-[#00e5a0] hover:bg-[#00ffb2] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "Building your sales arsenal..." : "Generate Sales Content 💰"}
          </button>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Card 1 — Main Content */}
            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">{contentType}</p>
                <CopyButton text={result.mainContent} />
              </div>
              <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{result.mainContent}</p>
            </div>

            {/* Card 2 — Objections */}
            {result.objections.length > 0 && (
              <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">
                  Top {result.objections.length} Objections + Responses
                </p>
                <p className="text-xs text-[#4b5563] mb-4">How to handle common objections:</p>
                <div className="space-y-4">
                  {result.objections.map((o, i) => (
                    <div key={i} className="border border-white/[0.05] rounded-xl overflow-hidden">
                      <div className="bg-red-500/[0.06] border-b border-red-500/[0.12] px-4 py-3">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-1">Objection</span>
                        <p className="text-sm text-red-300">{o.objection}</p>
                      </div>
                      <div className="bg-[#00e5a0]/[0.04] px-4 py-3">
                        <span className="text-[10px] font-bold text-[#00e5a0] uppercase tracking-widest block mb-1">Response</span>
                        <p className="text-sm text-[#d1d5db]">{o.response}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 3 — Power Phrases */}
            {result.powerPhrases.length > 0 && (
              <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">
                    Power Phrases
                  </p>
                  <CopyButton text={result.powerPhrases.join("\n")} label="Copy All" />
                </div>
                <p className="text-xs text-[#4b5563] mb-4">High-converting phrases to use:</p>
                <div className="flex flex-wrap gap-2">
                  {result.powerPhrases.map((phrase, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#00e5a0]/20 text-[#00e5a0] bg-[#00e5a0]/[0.06]"
                    >
                      &ldquo;{phrase}&rdquo;
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Refine chat */}
            <RefineChat
              originalResult={result.mainContent}
              agentType="sales"
              systemPrompt={SALES_SYSTEM_PROMPT}
              quickActions={["More confident", "Add price justification", "Shorter pitch", "Add social proof", "Stronger close"]}
              onRefined={(text) => setResult({ ...result, mainContent: text })}
            />
          </div>
        )}
      </div>
    </main>
  );
}
