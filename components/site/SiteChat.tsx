"use client";

import { useState, useRef, useEffect } from "react";
import type { SiteRecord } from "@/lib/kv";

type Message = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(site: SiteRecord): string {
  const lines: string[] = [
    `You are the AI assistant for ${site.businessName}, a ${site.industry} business in ${site.location}.`,
    `Services: ${site.services}`,
  ];

  if (site.businessHours) lines.push(`Hours: ${site.businessHours}`);
  if (site.contactPhone)   lines.push(`Phone: ${site.contactPhone}`);
  if (site.contactEmail)   lines.push(`Email: ${site.contactEmail}`);
  if (site.serviceArea)    lines.push(`Service area: ${site.serviceArea}`);
  if (site.description || site.tagline)
    lines.push(`About: ${site.description || site.tagline}`);

  lines.push(
    "",
    "Answer visitor questions about THIS business only.",
    "Never mention BaileyAgents or any other platform.",
    "If asked about pricing, suggest they contact the business directly.",
    "Encourage visitors to call or contact the business.",
    "Never make up information not listed above.",
  );

  return lines.join("\n");
}

type Props = { site: SiteRecord };

export function SiteChat({ site }: Props) {
  // Derive accent color from site's primaryColor choice
  const COLOR_MAP: Record<string, string> = {
    "Emerald Green":  "#10b981",
    "Electric Blue":  "#0066ff",
    "Sunset Orange":  "#f97316",
    "Royal Purple":   "#7c3aed",
    "Fire Red":       "#ef4444",
    "Midnight Black": "#333333",
    "Golden Yellow":  "#eab308",
    "Hot Pink":       "#ec4899",
    "Cyan":           "#06b6d4",
    "Slate Gray":     "#64748b",
    "Rose Gold":      "#fb7185",
    "Deep Navy":      "#1e3a5f",
  };
  const accent = COLOR_MAP[site.primaryColor] ?? "#10b981";

  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm the AI assistant for ${site.businessName} 👋 How can I help you today?`,
    },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);
  const systemPrompt            = buildSystemPrompt(site);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

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
        body: JSON.stringify({ messages: next, systemPrompt }),
      });
      const data = await res.json();
      setMessages([...next, {
        role: "assistant",
        content: data.reply ?? "Sorry, I couldn't respond. Please try again.",
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
            width:        "360px",
            height:       "480px",
            background:   "#ffffff",
            border:       "1px solid #e5e7eb",
            borderRadius: "20px",
            boxShadow:    "0 20px 60px rgba(0,0,0,0.15)",
            display:      "flex",
            flexDirection:"column",
            zIndex:       9000,
            overflow:     "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            padding:        "1rem 1.25rem",
            background:     accent,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            flexShrink:     0,
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", lineHeight: 1.2 }}>
                {site.businessName}
              </p>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.8)", marginTop: "2px" }}>
                AI Assistant · Usually replies instantly
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.2)", border: "none",
                borderRadius: "50%", cursor: "pointer",
                width: "28px", height: "28px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "0.9rem",
              }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "1rem",
            display: "flex", flexDirection: "column", gap: "0.75rem",
            background: "#fafafa",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth:     "82%",
                  padding:      "0.625rem 0.875rem",
                  borderRadius: m.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background:   m.role === "user" ? accent : "#ffffff",
                  color:        m.role === "user" ? "#fff" : "#1f2937",
                  fontSize:     "0.82rem",
                  lineHeight:   1.6,
                  boxShadow:    "0 1px 4px rgba(0,0,0,0.08)",
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
                  padding: "0.625rem 0.875rem",
                  borderRadius: "16px 16px 16px 4px",
                  background: "#ffffff",
                  display: "flex", gap: "4px", alignItems: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#9ca3af",
                      animation: `sitechatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding:    "0.75rem 1rem",
            borderTop:  "1px solid #e5e7eb",
            display:    "flex",
            gap:        "0.5rem",
            background: "#ffffff",
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Type a message..."
              disabled={loading}
              style={{
                flex:         1,
                background:   "#f3f4f6",
                border:       "1px solid #e5e7eb",
                borderRadius: "10px",
                padding:      "0.6rem 0.875rem",
                fontSize:     "0.82rem",
                color:        "#111827",
                outline:      "none",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                background:   accent,
                border:       "none",
                borderRadius: "10px",
                padding:      "0 1rem",
                cursor:       "pointer",
                fontWeight:   700,
                fontSize:     "0.82rem",
                color:        "#fff",
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

      {/* ── Floating bubble ───────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position:      "fixed",
          bottom:        "20px",
          right:         "20px",
          width:         "56px",
          height:        "56px",
          borderRadius:  "50%",
          background:    "#ffffff",
          border:        `2.5px solid ${accent}`,
          cursor:        "pointer",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          boxShadow:     "0 8px 24px rgba(0,0,0,0.15)",
          zIndex:        9001,
          transition:    "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes sitechatDot {
          0%,80%,100% { transform:scale(0.6); opacity:0.4; }
          40%          { transform:scale(1);   opacity:1; }
        }
      `}</style>
    </>
  );
}
