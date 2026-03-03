"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lead } from "@/app/api/leads/generate/route";

// ── Constants ─────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  "Landscaping", "Plumbing", "Electrician", "Beauty & Wellness",
  "Restaurant", "Consulting", "Real Estate", "Fitness",
  "Auto & Mechanic", "Cleaning", "Other",
];

const INPUT_CLS =
  "bg-[#0d0e10] border border-white/[0.07] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b82f6]/50 transition-colors w-full";

// ── Score badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  if (score >= 9)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/25 px-2.5 py-1 rounded-full">
        🔥 Hot · {score}/10
      </span>
    );
  if (score >= 7)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 px-2.5 py-1 rounded-full">
        ⚡ Warm · {score}/10
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/[0.04] text-gray-500 border border-white/[0.07] px-2.5 py-1 rounded-full">
      ❄ Cold · {score}/10
    </span>
  );
}

// ── Lead card ─────────────────────────────────────────────────────────────────
function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  const [expanded, setExpanded]  = useState(false);
  const [copied, setCopied]      = useState<string | null>(null);
  const [saved, setSaved]        = useState(false);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function handleSave() {
    const existing: Lead[] = JSON.parse(localStorage.getItem("savedLeads") || "[]");
    const alreadySaved = existing.some(
      (s) => s.businessName === lead.businessName && s.location === lead.location
    );
    if (!alreadySaved) {
      existing.push(lead);
      localStorage.setItem("savedLeads", JSON.stringify(existing));
    }
    setSaved(true);
  }

  const phoneKey = `phone-${index}`;
  const msgKey   = `msg-${index}`;

  return (
    <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.14] transition-all flex flex-col gap-3">

      {/* ── Header row: name + score ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-bold text-[#f0f0f0] text-sm leading-tight">{lead.businessName}</h3>
            <span className="text-[10px] text-[#6b7280] bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full shrink-0">
              {lead.industry}
            </span>
          </div>
          <p className="text-xs text-[#6b7280] leading-snug">{lead.location}</p>
        </div>
        <ScoreBadge score={lead.score} />
      </div>

      {/* ── Google rating ─────────────────────────────────────────────────── */}
      {lead.rating > 0 ? (
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
          <span className="text-yellow-400">⭐</span>
          <span className="font-medium">{lead.rating.toFixed(1)}</span>
          <span className="text-[#4b5563]">·</span>
          <span>{lead.reviewCount.toLocaleString()} review{lead.reviewCount !== 1 ? "s" : ""}</span>
        </div>
      ) : (
        <div className="text-xs text-[#4b5563]">No Google rating yet</div>
      )}

      {/* ── Website badge ─────────────────────────────────────────────────── */}
      <div>
        {lead.hasWebsite ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
            🌐 Has website
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline opacity-70 hover:opacity-100 ml-0.5"
              >
                ↗
              </a>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            ⚡ No website — high opportunity
          </span>
        )}
      </div>

      {/* ── Phone contact ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {lead.phone !== "Not listed" ? (
          <>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border text-[#9ca3af] border-white/[0.07] bg-white/[0.02] hover:text-[#00e5a0] hover:border-[#00e5a0]/30 transition-all"
            >
              📞 {lead.phone}
            </a>
            <button
              onClick={() => copyText(lead.phone, phoneKey)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                copied === phoneKey
                  ? "text-[#00e5a0] border-[#00e5a0]/30 bg-[#00e5a0]/5"
                  : "text-[#4b5563] border-white/[0.06] hover:text-[#9ca3af] hover:border-white/20"
              }`}
            >
              {copied === phoneKey ? "✓" : "Copy"}
            </button>
          </>
        ) : (
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border text-[#4b5563] border-white/[0.05]">
            📞 Not listed
          </span>
        )}
      </div>

      {/* ── Score reason ──────────────────────────────────────────────────── */}
      <p className="text-[11px] text-[#4b5563] leading-relaxed italic">
        {lead.scoreReason}
      </p>

      {/* ── Outreach message (expandable) ─────────────────────────────────── */}
      <div className="border border-white/[0.06] rounded-xl overflow-hidden">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#6b7280] hover:text-white hover:bg-white/[0.03] transition-all"
        >
          <span>💬 Outreach Message</span>
          <span className="text-[10px] opacity-60">{expanded ? "▲ Hide" : "▼ Show"}</span>
        </button>
        {expanded && (
          <div className="px-4 pb-4 border-t border-white/[0.06]">
            <p className="text-xs text-[#9ca3af] leading-relaxed mt-3 mb-3">
              {lead.outreachMessage}
            </p>
            <button
              onClick={() => copyText(lead.outreachMessage, msgKey)}
              className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${
                copied === msgKey
                  ? "text-[#00e5a0] border-[#00e5a0]/30 bg-[#00e5a0]/5"
                  : "text-[#3b82f6] border-[#3b82f6]/30 bg-[#3b82f6]/5 hover:bg-[#3b82f6]/10"
              }`}
            >
              {copied === msgKey ? "✓ Copied!" : "Copy Message"}
            </button>
          </div>
        )}
      </div>

      {/* ── Footer: Google Maps link + Save ───────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
        <a
          href={lead.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[#4b5563] hover:text-[#9ca3af] transition-colors"
        >
          📍 View on Google Maps ↗
        </a>
        <button
          onClick={handleSave}
          disabled={saved}
          className={`text-xs font-medium transition-colors ${
            saved ? "text-[#00e5a0] cursor-default" : "text-[#4b5563] hover:text-[#9ca3af]"
          }`}
        >
          {saved ? "✓ Saved" : "＋ Save Lead"}
        </button>
      </div>
    </div>
  );
}

// ── Locked state ──────────────────────────────────────────────────────────────
function LockedState() {
  return (
    <div className="flex-1 p-7">
      <div className="max-w-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎯</span>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Lead Hunter
          </h1>
        </div>
        <p className="text-gray-400 text-sm mb-8">
          Find real local businesses and generate personalized outreach messages.
        </p>

        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-10 text-center">
          <div className="text-5xl mb-5">🔒</div>
          <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            Lead Hunter — Growth &amp; Pro Only
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Upgrade to Growth or Pro to unlock the Lead Hunter agent. Find real local
            businesses from Google and generate personalized outreach in one click.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-[#00e5a0] text-black font-bold px-7 py-3 rounded-xl text-sm hover:bg-[#00ffb2] transition-all"
          >
            Upgrade to Growth →
          </Link>
          <p className="text-xs text-gray-600 mt-4">Growth plan starts at $79/mo · 7-day free trial</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function LeadsAgent({ locked }: { locked: boolean }) {
  const [form, setForm] = useState({
    industry:     "Landscaping",
    location:     "",
    businessSize: "Any",
    hasWebsite:   "Any",
  });
  const [leads, setLeads]     = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [noResults, setNoResults] = useState<string | null>(null);

  if (locked) return <LockedState />;

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!form.location.trim()) {
      setError("Please enter a target location.");
      return;
    }
    setError(null);
    setNoResults(null);
    setLoading(true);

    try {
      const res  = await fetch("/api/leads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? data.error ?? "Search failed");

      const returned: Lead[] = data.leads ?? [];
      setLeads(returned);
      setSearched(true);
      if (returned.length === 0) setNoResults(data.message ?? "No businesses found in that area. Try a different location or industry.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const avgScore = leads.length > 0
    ? (leads.reduce((sum, l) => sum + l.score, 0) / leads.length).toFixed(1)
    : "—";
  const hotLeads = leads.filter((l) => l.score >= 7).length;

  return (
    <div className="flex-1 p-7 max-w-5xl">
      {/* Page heading */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🎯</span>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Lead Hunter
        </h1>
        <span className="text-xs font-bold bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-3 py-1 rounded-full">
          Powered by Google
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-7">
        Search for real local businesses and get AI-generated scores and personalized outreach messages.
      </p>

      {/* ── Search form ────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 mb-8"
      >
        <h2 className="text-sm font-bold text-[#f0f0f0] mb-5" style={{ fontFamily: "Syne, sans-serif" }}>
          Search Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Industry */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Target Industry
            </label>
            <select
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
              className={`${INPUT_CLS} appearance-none cursor-pointer`}
            >
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Target Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Rockford, IL"
              required
              className={INPUT_CLS}
            />
          </div>

          {/* Business size */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Business Size
            </label>
            <select
              value={form.businessSize}
              onChange={(e) => set("businessSize", e.target.value)}
              className={`${INPUT_CLS} appearance-none cursor-pointer`}
            >
              {["Any", "Solo/1-person", "Small 2-10", "Medium 11-50"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Has website */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Has Website Already?
            </label>
            <select
              value={form.hasWebsite}
              onChange={(e) => set("hasWebsite", e.target.value)}
              className={`${INPUT_CLS} appearance-none cursor-pointer`}
            >
              {["Any", "No website only", "Has website"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching Google Places &amp; scoring leads…
            </>
          ) : (
            "Hunt Leads →"
          )}
        </button>
      </form>

      {/* ── No results message ──────────────────────────────────────────────── */}
      {searched && leads.length === 0 && !loading && (
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-10 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400 text-sm">
            {noResults ?? "No businesses found. Try a different location or industry."}
          </p>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {searched && leads.length > 0 && (
        <>
          {/* Summary bar */}
          <div className="flex items-center gap-6 mb-5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-[#f0f0f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                {leads.length}
              </span>
              <span className="text-sm text-[#6b7280]">real businesses found</span>
            </div>
            <div className="w-px h-6 bg-white/[0.07]" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-[#f0f0f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                {avgScore}
              </span>
              <span className="text-sm text-[#6b7280]">avg score /10</span>
            </div>
            <div className="w-px h-6 bg-white/[0.07]" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-yellow-400" style={{ fontFamily: "Syne, sans-serif" }}>
                {hotLeads}
              </span>
              <span className="text-sm text-[#6b7280]">warm/hot leads</span>
            </div>
          </div>

          {/* Lead grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {leads.map((lead, i) => (
              <LeadCard key={i} lead={lead} index={i} />
            ))}
          </div>

          <p className="text-xs text-[#4b5563] mt-6 text-center">
            Business data sourced from Google Places · AI scoring &amp; outreach generated automatically · Always verify information before contacting.
          </p>
        </>
      )}
    </div>
  );
}
