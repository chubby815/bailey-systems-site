"use client";

import { useState } from "react";
import Link from "next/link";

type Result = { subjectLine: string; emailBody: string; followUp: string };

const EMAIL_TYPES = ["Cold Outreach", "Follow Up", "Newsletter", "Re-engagement", "Thank You"] as const;
const TONES       = ["Professional", "Friendly", "Bold", "Urgent"] as const;
const GOALS       = ["Book a Call", "Get a Reply", "Make a Sale", "Drive Traffic", "Build Trust"] as const;

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

export default function EmailMarketerPage() {
  const [businessName, setBusinessName] = useState("");
  const [selling, setSelling]           = useState("");
  const [target, setTarget]             = useState("");
  const [emailType, setEmailType]       = useState<Pill>("Cold Outreach");
  const [tone, setTone]                 = useState<Pill>("Professional");
  const [goal, setGoal]                 = useState<Pill>("Get a Reply");
  const [context, setContext]           = useState("");

  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<Result | null>(null);
  const [error, setError]       = useState("");

  async function handleGenerate() {
    if (!businessName.trim() || !selling.trim() || !target.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, selling, target, emailType, tone, goal, context }),
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
        {/* Hero */}
        <div>
          <div className="text-[#00e5a0] text-xs font-semibold uppercase tracking-widest mb-2">Agent</div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            ✉️ Email Marketer
          </h1>
          <p className="text-[#6b7280] text-sm leading-relaxed">
            Generate cold outreach emails, newsletters, and follow-up sequences that convert prospects into paying customers.
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
              placeholder="e.g. local restaurant owners in Chicago" />
          </div>

          <div>
            <label className={LABEL}>Email Type</label>
            <PillSelector options={EMAIL_TYPES} value={emailType} onChange={setEmailType} />
          </div>

          <div>
            <label className={LABEL}>Tone</label>
            <PillSelector options={TONES} value={tone} onChange={setTone} />
          </div>

          <div>
            <label className={LABEL}>Goal</label>
            <PillSelector options={GOALS} value={goal} onChange={setGoal} />
          </div>

          <div>
            <label className={LABEL}>Extra Context (optional)</label>
            <textarea className={INPUT} rows={3} value={context} onChange={(e) => setContext(e.target.value)}
              placeholder="Any special offer, pain points, or details to include" />
          </div>

          <button
            onClick={() => void handleGenerate()}
            disabled={loading || !businessName.trim() || !selling.trim() || !target.trim()}
            className="w-full bg-[#00e5a0] hover:bg-[#00ffb2] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "Writing your email..." : "Generate Email ✉️"}
          </button>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Subject Line */}
            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">Subject Line</p>
                <CopyButton text={result.subjectLine} label="Copy Subject" />
              </div>
              <p className="text-lg font-bold text-white">{result.subjectLine}</p>
            </div>

            {/* Email Body */}
            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">Your Email</p>
                <CopyButton text={result.emailBody} label="Copy Email" />
              </div>
              <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{result.emailBody}</p>
            </div>

            {/* Follow Up */}
            <div className="bg-[#111214] border border-[#00e5a0]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#00e5a0] uppercase tracking-widest">Follow-up Email (send 3 days later)</p>
                <CopyButton text={result.followUp} label="Copy Follow Up" />
              </div>
              <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap">{result.followUp}</p>
            </div>

            {/* Pro tip */}
            <div className="bg-[#111214] border border-white/[0.05] rounded-2xl px-5 py-4">
              <p className="text-xs text-[#6b7280]">
                💡 <span className="font-semibold text-[#9ca3af]">Pro Tip:</span> Personalize the first line with the prospect&apos;s name for 3x more replies.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
