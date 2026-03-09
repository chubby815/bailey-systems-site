import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`agents-refine:${session.email}`, 30, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many refinement requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let originalResult: string, conversationHistory: Message[], userRequest: string;
  let agentType: string, systemPrompt: string;
  try {
    const body = await req.json() as {
      originalResult?: unknown;
      conversationHistory?: unknown;
      userRequest?: unknown;
      agentType?: unknown;
      systemPrompt?: unknown;
    };
    if (!body.originalResult || typeof body.originalResult !== "string")
      return NextResponse.json({ error: "originalResult is required" }, { status: 400 });
    if (!body.userRequest || typeof body.userRequest !== "string" || !body.userRequest.trim())
      return NextResponse.json({ error: "userRequest is required" }, { status: 400 });

    originalResult      = body.originalResult.slice(0, 8000);
    userRequest         = body.userRequest.trim().slice(0, 500);
    agentType           = typeof body.agentType === "string" ? body.agentType.slice(0, 50) : "general";
    systemPrompt        = typeof body.systemPrompt === "string" ? body.systemPrompt.slice(0, 2000) : "";
    conversationHistory = Array.isArray(body.conversationHistory)
      ? (body.conversationHistory as Message[])
          .filter((m) => m && (m.role === "user" || m.role === "assistant"))
          .slice(-10)
          .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
      : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const refinedSystemPrompt =
    (systemPrompt ? systemPrompt + "\n\n" : "") +
    "The user wants to refine the content you generated. " +
    "Keep the same format and style unless asked to change it. " +
    "Return ONLY the refined content, nothing else. No preamble, no explanation.";

  // Build messages: seed with original result, then full history, then new request
  const messages: Message[] = [
    {
      role: "user",
      content: `Here is the content I generated:\n\n${originalResult}\n\nNow the user wants changes.`,
    },
    {
      role: "assistant",
      content: "I have your generated content. What would you like me to change?",
    },
    ...conversationHistory,
    { role: "user", content: userRequest },
  ];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system: refinedSystemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      console.error("[agents/refine] Anthropic error:", await res.text());
      return NextResponse.json({ error: "AI refinement failed" }, { status: 502 });
    }

    const data = await res.json() as { content?: Array<{ type: string; text: string }> };
    const refined = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    if (!refined) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 502 });
    }

    return NextResponse.json({ refined });
  } catch (err) {
    console.error("[agents/refine] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
