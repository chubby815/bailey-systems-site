"use client";

import { FormEvent, useRef, useState } from "react";
import { Send } from "lucide-react";
import { ChatBubble } from "./ChatBubble";
import { Button } from "./Button";
import { DEFAULT_CHAT_MESSAGES } from "@/utils/constants";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>(DEFAULT_CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const optimistic = [...messages, userMessage];
    setMessages(optimistic);
    setInput("");
    setSubmitting(true);
    scrollToBottom();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: optimistic }),
      });
      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content:
          data?.message ||
          "Here's a preview answer. Connect your OpenAI key to stream real responses.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "We hit a network snag. Try again in a moment.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setSubmitting(false);
      scrollToBottom();
    }
  }

  return (
    <div className="glass-panel flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
        <span>Agent Pilot</span>
        <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-emerald-200">
          Online
        </span>
      </div>
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((message, idx) => (
          <ChatBubble key={`${message.timestamp}-${idx}`} {...message} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
        <textarea
          name="prompt"
          placeholder="Ask about pipelines, onboarding, or fulfillment..."
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/30 focus:outline-none"
          rows={2}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button
          type="submit"
          size="lg"
          className="rounded-2xl px-4"
          disabled={submitting}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}

