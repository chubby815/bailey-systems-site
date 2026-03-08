"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Status = {
  connected: boolean;
  pageName: string | null;
  pageId: string | null;
};

const TONES = ["Professional", "Fun", "Promotional"] as const;
type Tone = (typeof TONES)[number];

export default function FacebookPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [promotion, setPromotion] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");

  // Generation state
  const [generatedPost, setGeneratedPost] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  // Post state
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState("");
  const [postError, setPostError] = useState("");

  // Copy state
  const [copied, setCopied] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/facebook/status");
      if (res.ok) {
        const data = await res.json() as Status;
        setStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();

    // Read query params for success/error feedback
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      void fetchStatus();
    }
  }, [fetchStatus]);

  async function handleGenerate() {
    if (!businessName.trim() || !promotion.trim()) return;
    setGenerating(true);
    setGenerateError("");
    setGeneratedPost("");
    setPostSuccess("");
    setPostError("");

    try {
      const res = await fetch("/api/facebook/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, promotion, tone }),
      });
      const data = await res.json() as { post?: string; error?: string };
      if (!res.ok) {
        setGenerateError(data.error ?? "Generation failed. Please try again.");
      } else {
        setGeneratedPost(data.post ?? "");
      }
    } catch {
      setGenerateError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePost() {
    if (!generatedPost.trim()) return;
    setPosting(true);
    setPostError("");
    setPostSuccess("");

    try {
      const res = await fetch("/api/facebook/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: generatedPost }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setPostError(data.error ?? "Failed to post. Please try again.");
      } else {
        setPostSuccess(`✅ Posted to ${status?.pageName ?? "your page"}!`);
      }
    } catch {
      setPostError("Network error. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  function handleCopy() {
    if (!generatedPost) return;
    void navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loadingStatus) {
    return (
      <main className="min-h-screen bg-[#08090a] text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Bailey<span className="text-[#00e5a0]">Agents</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-[#6b7280] hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* ── NOT CONNECTED ── */}
        {!status?.connected ? (
          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-10 text-center">
            <div className="text-6xl mb-6">📘</div>
            <h1 className="text-2xl font-black mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Facebook Social Agent
            </h1>
            <p className="text-[#6b7280] mb-8 max-w-sm mx-auto leading-relaxed">
              Connect your Facebook Business Page and let Bailey generate and publish posts automatically.
            </p>

            <a
              href="/api/facebook/connect"
              className="inline-block bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold px-8 py-3 rounded-xl transition-colors text-sm mb-8"
            >
              Connect Facebook →
            </a>

            <ul className="text-left space-y-2 max-w-xs mx-auto text-sm text-[#9ca3af]">
              {[
                "AI-generated Facebook posts",
                "One-click publishing",
                "Professional tone options",
                "Emojis and hashtags included",
                "Available on Growth and Pro plans",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-[#00e5a0]">✓</span> {f}
                </li>
              ))}
            </ul>

            {/* OAuth error feedback */}
            {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("error") && (
              <p className="mt-6 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                Connection failed. Please try again or make sure you have a Facebook Business Page.
              </p>
            )}
          </div>

        ) : (
          /* ── CONNECTED ── */
          <div className="space-y-6">
            {/* Page info banner */}
            <div className="bg-[#111214] border border-[#1877f2]/30 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📘</span>
                <div>
                  <p className="text-xs text-[#6b7280]">Connected page</p>
                  <p className="font-bold text-sm text-white">{status.pageName}</p>
                </div>
              </div>
              <span className="text-xs text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-3 py-1 rounded-full font-medium">
                ✅ Connected
              </span>
            </div>

            {/* Post generator form */}
            <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 space-y-5">
              <h2 className="font-black text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                Generate a Post
              </h2>

              {/* Business name */}
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] mb-2 uppercase tracking-widest">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Plumbing Services"
                  className="w-full bg-[#08090a] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#1877f2]/50 transition-colors"
                />
              </div>

              {/* Promotion */}
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] mb-2 uppercase tracking-widest">
                  What are you promoting?
                </label>
                <textarea
                  value={promotion}
                  onChange={(e) => setPromotion(e.target.value)}
                  placeholder="e.g. Summer sale 20% off this weekend"
                  rows={3}
                  className="w-full bg-[#08090a] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#1877f2]/50 transition-colors resize-none"
                />
              </div>

              {/* Tone selector */}
              <div>
                <label className="block text-xs font-semibold text-[#9ca3af] mb-2 uppercase tracking-widest">
                  Tone
                </label>
                <div className="flex gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                        tone === t
                          ? "bg-[#1877f2] border-[#1877f2] text-white"
                          : "bg-transparent border-white/[0.07] text-[#6b7280] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={() => void handleGenerate()}
                disabled={generating || !businessName.trim() || !promotion.trim()}
                className="w-full bg-[#1877f2] hover:bg-[#166fe5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                {generating ? "Generating..." : "Generate Post 🤖"}
              </button>

              {generateError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {generateError}
                </p>
              )}
            </div>

            {/* Generated post preview */}
            {generatedPost && (
              <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">Generated Post</h3>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-[#6b7280] hover:text-white border border-white/[0.07] hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copied ? "Copied! ✓" : "Copy 📋"}
                  </button>
                </div>

                <div className="bg-[#08090a] border border-white/[0.07] rounded-xl p-4">
                  <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap">
                    {generatedPost}
                  </p>
                </div>

                {/* Post to Facebook */}
                <button
                  onClick={() => void handlePost()}
                  disabled={posting}
                  className="w-full bg-[#1877f2] hover:bg-[#166fe5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {posting ? "Posting..." : "Post to Facebook 📘"}
                </button>

                {postSuccess && (
                  <p className="text-sm text-[#00e5a0] bg-[#00e5a0]/10 border border-[#00e5a0]/20 rounded-xl px-4 py-3 text-center font-semibold">
                    {postSuccess}
                  </p>
                )}
                {postError && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                    {postError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
