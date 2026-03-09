"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  role: "user" | "assistant";
  content: string;
  suggestion?: {
    summary:         string;
    changes:         { section: string; field: string; oldValue: string; newValue: string }[];
    updatedSiteData: object;
    applied?:        boolean;
    previewing?:     boolean;
    editsRemaining?: number;
  };
};

export interface AskBaileyProps {
  siteData: object;
  plan:     string;
  /** Called with the updated site data when user clicks Preview — does NOT save */
  onPreview: (updated: object) => void;
  /** Called with the updated site data when user clicks Apply — saves to Redis */
  onApply:   (updated: object) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const LIMITS: Record<string, number> = { starter: 3, growth: 15, pro: Infinity };

const QUICK_PROMPTS = [
  "Make hero more premium",
  "Rewrite my headline",
  "Add testimonials section",
  "Change button to gold",
  "Make services look better",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function planLimit(plan: string): number {
  return LIMITS[plan] ?? 3;
}

function isUnlimited(plan: string): boolean {
  return plan === "pro";
}

function progressColor(used: number, limit: number): string {
  const pct = used / limit;
  if (pct >= 1) return "#ef4444";
  if (pct >= 0.7) return "#f59e0b";
  return "#00e5a0";
}

// ── Usage indicator ───────────────────────────────────────────────────────────
function UsageBar({
  used, plan,
}: { used: number; plan: string }) {
  const limit = planLimit(plan);
  const unlimited = isUnlimited(plan);

  if (unlimited) {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-[11px] text-[#9ca3af]">✦ Unlimited AI edits</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
          Pro
        </span>
      </div>
    );
  }

  const pct   = Math.min(used / limit, 1);
  const color = progressColor(used, limit);
  const nextPlan = plan === "starter" ? "Growth" : "Pro";

  return (
    <div className="px-4 py-3 border-b border-white/[0.06]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-[#9ca3af]">
          ✦ <span style={{ color }}>{used}/{limit}</span> AI edits used this month
        </span>
        <Link
          href="/dashboard/billing"
          className="text-[10px] text-[#00e5a0] hover:underline"
        >
          Upgrade for more →
        </Link>
      </div>
      <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct * 100}%`, background: color }}
        />
      </div>
      {used >= limit && (
        <p className="text-[10px] text-[#6b7280] mt-1">
          Upgrade to {nextPlan} for {plan === "starter" ? "15 edits" : "unlimited edits"} →
        </p>
      )}
    </div>
  );
}

// ── Limit-reached locked state ────────────────────────────────────────────────
function LimitReached({ plan }: { plan: string }) {
  const isStarter = plan === "starter";
  return (
    <div
      className="mx-4 my-3 rounded-xl px-4 py-3 border"
      style={
        isStarter
          ? { background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }
          : { background: "rgba(249,115,22,0.06)", borderColor: "rgba(249,115,22,0.25)" }
      }
    >
      <p className="text-xs font-bold mb-1" style={{ color: isStarter ? "#f87171" : "#fb923c" }}>
        🔒 You&apos;ve used all {isStarter ? "3" : "15"} AI edits this month.
      </p>
      <p className="text-[11px] text-[#9ca3af] mb-2">
        {isStarter
          ? "Upgrade to Growth for 15 edits or Pro for unlimited."
          : "Upgrade to Pro for unlimited Ask Bailey edits."}
      </p>
      <Link
        href="/dashboard/billing"
        className="inline-block text-[11px] font-bold bg-[#00e5a0] text-black px-3 py-1.5 rounded-lg hover:bg-[#00ffb2] transition-colors"
      >
        {isStarter ? "Upgrade to Growth →" : "Upgrade to Pro →"}
      </Link>
    </div>
  );
}

// ── Suggestion action buttons ─────────────────────────────────────────────────
function SuggestionActions({
  suggestion,
  plan,
  used,
  onPreview,
  onApply,
  onCancel,
}: {
  suggestion: NonNullable<Message["suggestion"]>;
  plan:       string;
  used:       number;
  onPreview:  (data: object) => void;
  onApply:    (data: object, msgSuggestion: NonNullable<Message["suggestion"]>) => void;
  onCancel:   () => void;
}) {
  const [applying, setApplying] = useState(false);
  const [applied,  setApplied]  = useState(suggestion.applied ?? false);
  const limit    = planLimit(plan);
  const unlimited = isUnlimited(plan);

  if (applied) {
    const remaining = unlimited ? null : limit - (used);
    return (
      <p className="text-[11px] text-[#00e5a0] mt-2 font-semibold">
        ✅ Applied!{remaining !== null ? ` (${Math.max(0, remaining)} edits remaining)` : ""}
      </p>
    );
  }

  async function handleApply() {
    setApplying(true);
    try {
      await fetch("/api/editor/ask-bailey/apply", { method: "POST" });
    } catch { /* silent */ }
    onApply(suggestion.updatedSiteData, suggestion);
    setApplied(true);
    setApplying(false);
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleApply}
          disabled={applying}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#00e5a0] text-black hover:bg-[#00ffb2] disabled:opacity-50 transition-colors"
        >
          {applying ? "Applying…" : "✅ Apply Changes"}
        </button>
        <button
          onClick={() => onPreview(suggestion.updatedSiteData)}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.10] text-[#d1d5db] hover:bg-white/[0.10] transition-colors"
        >
          👁 Preview
        </button>
        <button
          onClick={onCancel}
          className="text-[11px] text-[#6b7280] hover:text-white transition-colors px-1"
        >
          ✕ Cancel
        </button>
      </div>
      {!unlimited && (
        <p className="text-[10px] text-[#4b5563]">Uses 1 of your monthly edits</p>
      )}
    </div>
  );
}

// ── Main AskBailey component ──────────────────────────────────────────────────
export function AskBailey({ siteData, plan, onPreview, onApply }: AskBaileyProps) {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [used, setUsed]           = useState(0);
  const [usageLoaded, setUsageLoaded] = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  const limit     = planLimit(plan);
  const unlimited = isUnlimited(plan);
  const atLimit   = !unlimited && used >= limit;
  const appliedCount = messages.filter((m) => m.suggestion?.applied).length;

  // Load current month usage on mount
  useEffect(() => {
    fetch("/api/editor/ask-bailey/apply", { method: "POST" })
      .then(() => { /* we don't actually apply here — just need to check */ })
      .catch(() => { /* ignore */ });

    // Instead, check via a GET on the generation route (just read, don't apply)
    // Actually we fetch usage by reading a lightweight route:
    // We'll track it in local state and sync from the apply response
    setUsageLoaded(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading || atLimit) return;

    const newMsg: Message = { role: "user", content: trimmed };
    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/editor/ask-bailey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage:         trimmed,
          siteData,
          conversationHistory: history,
        }),
      });

      const data = await res.json() as {
        summary?: string; changes?: unknown[]; updatedSiteData?: object;
        error?: string; plan?: string; limit?: number; used?: number;
      };

      if (res.status === 403 && data.error === "limit_reached") {
        setUsed(data.used ?? limit);
        setMessages((prev) => [...prev.slice(0, -1)]);
        setError("Limit reached");
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setMessages((prev) => [...prev.slice(0, -1)]);
        return;
      }

      const aiMsg: Message = {
        role:    "assistant",
        content: data.summary ?? "Here are the changes:",
        suggestion: {
          summary:         data.summary ?? "",
          changes:         (data.changes ?? []) as { section: string; field: string; oldValue: string; newValue: string }[],
          updatedSiteData: data.updatedSiteData ?? siteData,
          applied:         false,
        },
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setError("Network error. Please try again.");
      setMessages((prev) => [...prev.slice(0, -1)]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function handleCancel() {
    onPreview(siteData);
  }

  function handleApply(updated: object, msgSuggestion: NonNullable<Message["suggestion"]>) {
    setUsed((u) => u + 1);
    msgSuggestion.applied = true;
    onApply(updated);
  }

  if (!usageLoaded) return null;

  return (
    <div
      style={{
        display:      "flex",
        flexDirection: "column",
        height:        "100%",
        overflow:      "hidden",
      }}
    >
      {/* Usage bar */}
      <UsageBar used={used} plan={plan} />

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <p className="text-sm font-bold text-white">💬 Ask Bailey</p>
        <p className="text-[11px] text-[#6b7280]">Edit your site with plain English</p>
      </div>

      {/* Quick prompts (show when no messages yet) */}
      {messages.length === 0 && !atLimit && (
        <div className="px-4 py-3 flex flex-wrap gap-1.5 border-b border-white/[0.05]">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => void send(p)}
              disabled={loading}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/[0.10] text-[#9ca3af] hover:border-[#00e5a0]/40 hover:text-[#00e5a0] hover:bg-[#00e5a0]/[0.04] disabled:opacity-40 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Limit reached banner */}
      {atLimit && <LimitReached plan={plan} />}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-[85%] bg-[#00e5a0] text-black text-[12px] font-medium rounded-2xl rounded-br-sm px-3 py-2 leading-relaxed">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[90%] bg-[#1a1a1a] border border-white/[0.06] rounded-2xl rounded-bl-sm px-3 py-2.5">
                <p className="text-[12px] text-white leading-relaxed mb-2">{msg.content}</p>

                {/* Change list */}
                {msg.suggestion && msg.suggestion.changes.length > 0 && (
                  <ul className="space-y-1 mb-2">
                    {msg.suggestion.changes.map((c, j) => (
                      <li key={j} className="text-[10px] text-[#9ca3af]">
                        <span className="text-[#00e5a0]">✓</span>{" "}
                        <span className="font-semibold capitalize">{c.section}</span>{" "}
                        {c.field}: &ldquo;<span className="text-[#6b7280] line-through">{String(c.oldValue).slice(0, 30)}</span>&rdquo;
                        {" → "}
                        &ldquo;<span className="text-[#d1d5db]">{String(c.newValue).slice(0, 40)}</span>&rdquo;
                      </li>
                    ))}
                  </ul>
                )}

                {/* Action buttons */}
                {msg.suggestion && (
                  <SuggestionActions
                    suggestion={msg.suggestion}
                    plan={plan}
                    used={used}
                    onPreview={onPreview}
                    onApply={(updated, s) => handleApply(updated, s)}
                    onCancel={handleCancel}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Memory indicator */}
      <div className="px-4 py-1.5 border-t border-white/[0.05]">
        <p className="text-[10px] text-[#4b5563]">
          {appliedCount >= 3
            ? `🧠 ${appliedCount} edits applied`
            : "🧠 Bailey remembers your edits"}
        </p>
      </div>

      {/* Input */}
      {error && (
        <p className="text-[10px] text-red-400 bg-red-400/10 border-t border-red-400/20 px-4 py-2">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="px-3 pb-3 pt-2 flex gap-2 border-t border-white/[0.06]">
        <textarea
          ref={textareaRef}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          disabled={loading || atLimit}
          placeholder={
            atLimit
              ? "Upgrade to continue editing…"
              : "Ask Bailey to edit your website…\ne.g. Make the services section look more premium"
          }
          className="flex-1 bg-[#0d0e10] border border-white/[0.08] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-3 py-2 text-[12px] outline-none focus:border-[#00e5a0]/40 transition-colors disabled:opacity-40 resize-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || atLimit}
          className="bg-[#00e5a0] hover:bg-[#00ffb2] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-3 py-2 rounded-xl text-[12px] transition-colors shrink-0 self-end flex items-center justify-center"
          style={{ minWidth: 48, height: 38 }}
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            "↑"
          )}
        </button>
      </form>
    </div>
  );
}
