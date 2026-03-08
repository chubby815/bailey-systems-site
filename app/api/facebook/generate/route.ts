import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 generations/hour per user
  const rl = await rateLimit(`fb-generate:${session.email}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let businessName: string, promotion: string, tone: string;
  try {
    const body = await req.json() as { businessName?: unknown; promotion?: unknown; tone?: unknown };
    if (!body.businessName || typeof body.businessName !== "string") {
      return NextResponse.json({ error: "businessName is required" }, { status: 400 });
    }
    if (!body.promotion || typeof body.promotion !== "string") {
      return NextResponse.json({ error: "promotion is required" }, { status: 400 });
    }
    businessName = body.businessName.trim().slice(0, 200);
    promotion    = body.promotion.trim().slice(0, 500);
    tone         = typeof body.tone === "string" ? body.tone.trim().slice(0, 50) : "Professional";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const systemPrompt =
    "You are a social media marketing expert specializing in Facebook posts for local businesses. " +
    "Write engaging posts that get likes, comments and shares.";

  const userPrompt =
    `Create a Facebook post for:\n` +
    `Business: ${businessName}\n` +
    `Promotion: ${promotion}\n` +
    `Tone: ${tone}\n\n` +
    `Requirements:\n` +
    `- Start with an engaging hook\n` +
    `- Clear call to action\n` +
    `- 3-5 relevant emojis\n` +
    `- 5 relevant hashtags at the end\n` +
    `- Max 3 paragraphs\n` +
    `- Optimized for Facebook engagement\n\n` +
    `Return ONLY the post text, nothing else.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[facebook/generate] Anthropic error:", errText);
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json() as {
      content?: Array<{ type: string; text: string }>;
    };

    const post = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";
    if (!post) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error("[facebook/generate] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
