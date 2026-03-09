"use client";

import { useEffect, useRef, useState } from "react";

export type Message = { role: "user" | "assistant"; content: string };

export interface RefineChatProps {
  originalResult: string;
  agentType: string;
  systemPrompt: string;
  onRefined: (newResult: string) => void;
  quickActions?: string[];
  label?: string;
}

export function RefineChat({
  originalResult,
  agentType,
  systemPrompt,
  onRefined,
  quickActions = [],
  label = "✨ Refine with Bailey AI",
}: RefineChatProps) {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const refinementCount = messages.filter((m) => m.role === "assistant").length;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newUserMsg: Message = { role: "user", content: trimmed };
    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/agents/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalResult,
          conversationHistory: messages,
          userRequest: trimmed,
          agentType,
          systemPrompt,
        }),
      });
      const data = await res.json() as { refined?: string; error?: string };
      if (!res.ok || !data.refined) {
        setError(data.error ?? "Refinement failed. Please try again.");
        setMessages(messages);
        return;
      }
      const aiMsg: Message = { role: "assistant", content: data.refined };
      setMessages([...updatedHistory, aiMsg]);
      onRefined(data.refined);
    } catch {
      setError("Network error. Please try again.");
      setMessages(messages);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleQuickAction(action: string) {
    void send(action);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="bg-[#111214] border border-[#00e5a0]/25 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Not perfect? Tell Bailey what to change and it will fix it instantly.
          </p>
        </div>
        {/* Memory indicator */}
        <div className="shrink-0">
          {refinementCount === 0 ? (
            <span className="text-[10px] text-[#4b5563] font-medium">
              🧠 Bailey remembers your full conversation
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0]">
              🧠 {refinementCount} refinement{refinementCount !== 1 ? "s" : ""} made
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div
          className="px-4 py-4 space-y-3 overflow-y-auto"
          style={{ maxHeight: "300px" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#00e5a0] text-black font-medium rounded-br-sm"
                    : "bg-[#1a1a1a] text-white border border-white/[0.06] rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
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
      )}

      {/* Quick actions */}
      {quickActions.length > 0 && (
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              disabled={loading}
              onClick={() => handleQuickAction(action)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/[0.10] text-[#9ca3af] hover:border-[#00e5a0]/40 hover:text-[#00e5a0] hover:bg-[#00e5a0]/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="e.g. Make it shorter, more aggressive, add a discount mention..."
          className="flex-1 bg-[#0d0e10] border border-white/[0.08] text-[#f0f0f0] placeholder-[#4b5563] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00e5a0]/40 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#00e5a0] hover:bg-[#00ffb2] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0 flex items-center gap-1.5"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            "Send"
          )}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 border-t border-red-400/20 px-4 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
