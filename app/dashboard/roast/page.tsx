"use client";

import { useState } from "react";
import Link from "next/link";

type RoastResult = {
  report: string;
  url: string;
  score: number | null;
};

// Parse the structured report into sections
function parseReport(report: string) {
  const section = (key: string) => {
    const re = new RegExp(`${key}[^\\n]*\\n([\\s\\S]*?)(?=\\n[A-Z ]+[🎨🔍⭐💰🔧]|\\nVERDICT|$)`, "i");
    return report.match(re)?.[1]?.trim() ?? "";
  };

  const fixes: string[] = [];
  const fixBlock = report.match(/TOP 5 FIXES[^\n]*\n([\s\S]*?)(?=\nVERDICT|$)/i)?.[1] ?? "";
  for (const line of fixBlock.split("\n")) {
    const trimmed = line.replace(/^\d+\.\s*/, "").trim();
    if (trimmed) fixes.push(trimmed);
  }

  const verdictMatch = report.match(/VERDICT\s*\n([\s\S]*?)$/i);
  const verdict = verdictMatch?.[1]?.trim() ?? "";

  return {
    design:     section("DESIGN"),
    seo:        section("SEO"),
    trust:      section("TRUST SIGNALS"),
    conversion: section("CONVERSION"),
    fixes,
    verdict,
  };
}

function ScoreDisplay({ score }: { score: number | null }) {
  if (score === null) return null;
  const color =
    score >= 8 ? "#00e5a0" :
    score >= 5 ? "#f59e0b" :
    "#ef4444";
  return (
    <div className="flex flex-col items-center justify-center bg-[#111214] border border-white/[0.07] rounded-2xl p-8 mb-6">
      <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
        Overall Score
      </div>
      <div className="text-7xl font-extrabold" style={{ color, fontFamily: "Syne, sans-serif" }}>
        {score}
      </div>
      <div className="text-xl text-gray-400 font-bold">/10</div>
      <div className="mt-3 text-sm font-semibold" style={{ color }}>
        {score >= 8 ? "Great website!" : score >= 5 ? "Needs work" : "Serious issues found"}
      </div>
    </div>
  );
}

function ReportSection({ icon, title, content }: { icon: string; title: string; content: string }) {
  if (!content) return null;
  return (
    <div className="bg-[#111214] border border-white/[0.07] rounded-xl p-5 mb-4">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function FixesList({ fixes }: { fixes: string[] }) {
  if (!fixes.length) return null;
  return (
    <div className="bg-[#0d1f1a] border border-[#00e5a0]/20 rounded-xl p-5 mb-4">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-[#00e5a0]">
        🔧 Top 5 Fixes
      </h3>
      <ol className="space-y-3">
        {fixes.map((fix, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00e5a0]/20 text-[#00e5a0] flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <span className="text-gray-300 leading-relaxed">{fix}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RoastPage() {
  const [url, setUrl]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [result, setResult]   = useState<RoastResult | null>(null);

  async function handleRoast(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login?redirect=/dashboard/roast";
          return;
        }
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult(data as RoastResult);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const parsed = result ? parseReport(result.report) : null;

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Dashboard
        </Link>
        <span className="text-white/20">/</span>
        <span className="font-bold text-sm">🔥 Website Roast</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔥</div>
          <h1
            className="text-3xl font-extrabold tracking-tight mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Website Roast
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-md mx-auto">
            Paste any website URL and Bailey will analyze it and tell you exactly what needs to be fixed.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleRoast} className="mb-8">
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              required
              disabled={loading}
              className="flex-1 bg-[#111214] border border-white/[0.07] text-white placeholder-gray-600
                         rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00e5a0]/50
                         transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3.5 rounded-xl
                         text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         whitespace-nowrap"
            >
              {loading ? "Roasting..." : "Roast My Website 🔥"}
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-bounce">🔥</div>
            <p className="text-gray-400 text-sm font-medium">
              Roasting your site…
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Fetching and analyzing — usually takes 10–15 seconds
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {result && parsed && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-xs text-gray-500 truncate">{result.url}</div>
            </div>

            <ScoreDisplay score={result.score} />

            <ReportSection icon="🎨" title="Design"         content={parsed.design} />
            <ReportSection icon="🔍" title="SEO"            content={parsed.seo} />
            <ReportSection icon="⭐" title="Trust Signals"  content={parsed.trust} />
            <ReportSection icon="💰" title="Conversion"     content={parsed.conversion} />

            <FixesList fixes={parsed.fixes} />

            {parsed.verdict && (
              <div className="bg-[#111214] border border-white/[0.07] rounded-xl p-6 mb-8 text-center">
                <p className="text-base italic text-gray-300 leading-relaxed">
                  &ldquo;{parsed.verdict}&rdquo;
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#00e5a0]/5 to-[#0066ff]/5 border border-[#00e5a0]/20 rounded-2xl p-8 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3
                className="font-extrabold text-lg mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Ready for a better website?
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                Generate a professional AI website in 60 seconds with BaileyAgents.
              </p>
              <Link
                href="/dashboard/build"
                className="inline-block bg-[#00e5a0] text-black font-bold px-7 py-3.5 rounded-xl
                           text-sm hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)]
                           transition-all"
              >
                Generate a Better Website →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
