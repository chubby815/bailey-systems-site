import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  // Rate limit by IP — 20 requests per hour, no auth required
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = await rateLimit(`chat:${ip}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: { messages?: unknown; systemPrompt?: unknown; message?: unknown; context?: unknown; businessName?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── Simple widget format: { message, context, businessName } ─────────────
  // Used by the embedded AI chat widget on generated customer sites.
  if (typeof body.message === "string") {
    const message      = body.message.trim().slice(0, 500);
    const context      = typeof body.context      === "string" ? body.context.slice(0, 1000)      : "";
    const businessName = typeof body.businessName === "string" ? body.businessName.slice(0, 100) : "this business";

    if (!message) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ reply: "Sorry, try again in a moment." });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model:      "claude-haiku-4-5",
          max_tokens: 300,
          system:     `You are a helpful AI assistant for ${businessName}. Answer questions based on: ${context}. Rules: Keep replies under 3 sentences. Be friendly. If unsure say "Contact us directly for that." Never make up info.`,
          messages:   [{ role: "user", content: message }],
        }),
      });
      const data = await res.json() as { content?: Array<{ type: string; text?: string }> };
      const reply = data.content?.[0]?.text ?? "Sorry, try again in a moment.";
      return NextResponse.json({ reply });
    } catch (err) {
      console.error("[chat] widget error:", err);
      return NextResponse.json({ reply: "Sorry, try again in a moment." });
    }
  }
  // ── End simple widget format ──────────────────────────────────────────────

  const { messages, systemPrompt } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }
  if (typeof systemPrompt !== "string" || !systemPrompt.trim()) {
    return NextResponse.json({ error: "systemPrompt required" }, { status: 400 });
  }

  // Validate and sanitise message array
  type CleanMsg = { role: "user" | "assistant"; content: string };
  const cleaned: CleanMsg[] = [];
  for (const m of messages) {
    if (
      typeof m !== "object" || m === null ||
      !("role" in m) || !("content" in m) ||
      ((m as { role: unknown }).role !== "user" && (m as { role: unknown }).role !== "assistant") ||
      typeof (m as { content: unknown }).content !== "string"
    ) continue;
    cleaned.push({
      role: (m as CleanMsg).role,
      content: ((m as CleanMsg).content).slice(0, 2000),
    });
    if (cleaned.length >= 20) break;
  }

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "No valid messages" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":   "application/json",
        "x-api-key":      apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-haiku-4-5",
        max_tokens: 500,
        system:     systemPrompt.slice(0, 4000),
        messages:   cleaned,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[chat/route] Anthropic error:", errText);
      return NextResponse.json(
        { error: "AI unavailable. Please try again." },
        { status: 500 }
      );
    }

    const data = await res.json() as {
      content?: Array<{ type: string; text?: string }>;
    };
    const reply = data.content?.[0]?.text ?? "";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat/route] fetch error:", err);
    return NextResponse.json(
      { error: "AI unavailable. Please try again." },
      { status: 500 }
    );
  }
}
