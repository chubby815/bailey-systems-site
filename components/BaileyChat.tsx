"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

type Message = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Bailey, the friendly AI assistant for BaileyAgents (baileyagents.com). Answer questions about:

PLANS & PRICING:
- Starter: $29/month — 1 site, 20 runs/month
- Growth: $79/month — 3 sites, 150 runs/month
- Pro: $149/month — 25 sites, unlimited runs
- All plans include 7-day free trial
- Card required, cancel anytime

STRIPE & SECURITY:
- Payments powered by Stripe
- Stripe is trusted by: OpenAI, Cursor, Claude/Anthropic, Twitter/X, Amazon, Shopify, Lyft, DoorDash, Instacart, Zoom, Slack, and millions more
- We never store your card details
- All transactions encrypted via Stripe

AI AGENTS WE OFFER:
1. Website Builder — Generate a complete professional business website in 60 seconds. Just answer a few questions about your business and AI builds it instantly.
2. Lead Hunter — Find real local businesses in any city with phone numbers, addresses, and AI-written outreach messages ready to send.
3. Content Machine — Generate 7 social media posts, hashtags, and a full blog post for any business in seconds.

FEATURES:
- 5 premium templates (Dark Premium, Neo Brutalism, Modern Minimal, Bold Magazine, Classic Business)
- Custom subdomains (business.baileyagents.com)
- Visual site editor with themes
- Trust badges, Google rating badge
- Mobile responsive sites

CONTACT:
- Email: support@baileyagents.com
- Website: baileyagents.com

Be friendly, concise, and helpful. Always encourage users to start their free trial at baileyagents.com`;

export function BaileyChat() {
  const pathname                = usePathname();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Bailey 👋 Ask me anything about BaileyAgents — pricing, features, or how our AI tools work." },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  // Never show BaileyAgents support chat on customer site pages — those have
  // their own SiteChat.  The root layout's server-side isCustomerSite check
  // doesn't re-evaluate on client-side navigation, so we guard here too.
  if (pathname?.startsWith("/sites/")) return null;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, systemPrompt: SYSTEM_PROMPT }),
      });
      const data = await res.json();
      setMessages([...next, {
        role: "assistant",
        content: data.reply ?? "Sorry, I couldn't get a response. Please try again.",
      }]);
    } catch {
      setMessages([...next, {
        role: "assistant",
        content: "Something went wrong. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Open chat window ─────────────────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position:     "fixed",
            bottom:       "80px",
            right:        "20px",
            width:        "380px",
            height:       "520px",
            background:   "#111214",
            border:       "1px solid rgba(0,229,160,0.2)",
            borderRadius: "20px",
            boxShadow:    "0 24px 64px rgba(0,0,0,0.6)",
            display:      "flex",
            flexDirection:"column",
            zIndex:       9000,
            overflow:     "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            padding:        "1rem 1.25rem",
            borderBottom:   "1px solid rgba(255,255,255,0.07)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            background:     "#0d0e10",
            flexShrink:     0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#00e5a0", animation: "baileyPulse 2s infinite",
              }} />
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f0f0f0" }}>
                Bailey AI
              </span>
              <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
                · BaileyAgents Support
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "#6b7280", fontSize: "1.1rem", lineHeight: 1, padding: "4px",
              }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "1rem",
            display: "flex", flexDirection: "column", gap: "0.75rem",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth:     "82%",
                  padding:      "0.625rem 0.875rem",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background:   m.role === "user" ? "#00e5a0" : "#1a1c1f",
                  color:        m.role === "user" ? "#000" : "#e5e7eb",
                  fontSize:     "0.82rem",
                  lineHeight:   1.6,
                  whiteSpace:   "pre-wrap",
                  wordBreak:    "break-word",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "0.625rem 0.875rem", borderRadius: "16px 16px 16px 4px",
                  background: "#1a1c1f", display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#6b7280",
                      animation: `baileyDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding:      "0.75rem 1rem",
            borderTop:    "1px solid rgba(255,255,255,0.07)",
            display:      "flex",
            gap:          "0.5rem",
            background:   "#0d0e10",
            flexShrink:   0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about pricing, features..."
              disabled={loading}
              style={{
                flex:          1,
                background:    "#1a1c1f",
                border:        "1px solid rgba(255,255,255,0.08)",
                borderRadius:  "10px",
                padding:       "0.6rem 0.875rem",
                fontSize:      "0.82rem",
                color:         "#f0f0f0",
                outline:       "none",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                background:   "#00e5a0",
                border:       "none",
                borderRadius: "10px",
                padding:      "0 1rem",
                cursor:       "pointer",
                fontWeight:   700,
                fontSize:     "0.82rem",
                color:        "#000",
                opacity:      !input.trim() || loading ? 0.5 : 1,
                transition:   "opacity 0.15s",
                flexShrink:   0,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* ── Floating bubble button ────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close support chat" : "Open support chat"}
        style={{
          position:     "fixed",
          bottom:       "20px",
          right:        "20px",
          width:        "56px",
          height:       "56px",
          borderRadius: "50%",
          background:   "#00e5a0",
          border:       "none",
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          justifyContent:"center",
          boxShadow:    "0 8px 24px rgba(0,229,160,0.4)",
          zIndex:       9001,
          transition:   "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(0,229,160,0.5)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,229,160,0.4)";
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes baileyPulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
        @keyframes baileyDot {
          0%,80%,100% { transform:scale(0.6); opacity:0.4; }
          40%          { transform:scale(1);   opacity:1; }
        }
      `}</style>
    </>
  );
}
