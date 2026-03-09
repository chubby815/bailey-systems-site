import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getActivePlan(session.email);
  if (plan !== "pro") {
    return NextResponse.json(
      { error: "upgrade_required", message: "AI Copywriter requires Pro plan." },
      { status: 403 }
    );
  }

  const rl = await rateLimit(`copy-gen:${session.email}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let businessName: string, contentType: string, topic: string;
  let audience: string, tone: string, wordCount: string, keywords: string;
  try {
    const body = await req.json() as {
      businessName?: unknown; contentType?: unknown; topic?: unknown;
      audience?: unknown; tone?: unknown; wordCount?: unknown; keywords?: unknown;
    };
    if (!body.businessName || typeof body.businessName !== "string" || !body.businessName.trim())
      return NextResponse.json({ error: "businessName is required" }, { status: 400 });
    if (!body.topic || typeof body.topic !== "string" || !body.topic.trim())
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    if (!body.audience || typeof body.audience !== "string" || !body.audience.trim())
      return NextResponse.json({ error: "audience is required" }, { status: 400 });

    businessName = body.businessName.trim().slice(0, 200);
    contentType  = typeof body.contentType === "string" ? body.contentType.trim().slice(0, 50) : "Blog Post";
    topic        = body.topic.trim().slice(0, 400);
    audience     = body.audience.trim().slice(0, 300);
    tone         = typeof body.tone === "string" ? body.tone.trim().slice(0, 50) : "Professional";
    wordCount    = typeof body.wordCount === "string" ? body.wordCount.trim().slice(0, 30) : "Medium (300w)";
    keywords     = typeof body.keywords === "string" ? body.keywords.trim().slice(0, 300) : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const systemPrompt =
    "You are a world-class copywriter who has written copy for Fortune 500 companies and viral marketing campaigns. " +
    "You write copy that converts readers into customers. " +
    "You understand SEO, psychology, and what makes people take action.";

  const userPrompt =
    `Write ${contentType} copy for:\n\n` +
    `Business: ${businessName}\n` +
    `Topic: ${topic}\n` +
    `Target Audience: ${audience}\n` +
    `Tone: ${tone}\n` +
    `Length: ${wordCount}\n` +
    (keywords ? `Keywords to include: ${keywords}\n` : "") +
    `\nReturn ONLY a JSON object (no markdown, no backticks):\n` +
    `{\n` +
    `  "title": "compelling headline",\n` +
    `  "content": "the full copy",\n` +
    `  "metaDescription": "SEO meta description under 160 characters"\n` +
    `}\n\n` +
    `Rules:\n` +
    `- Start with a hook that grabs attention\n` +
    `- Use the keywords naturally\n` +
    `- Include a clear call to action at the end\n` +
    `- Write for the target audience\n` +
    `- Match the tone exactly\n` +
    `- For blog posts: use headers and structure\n` +
    `- For ads: be punchy and benefit-focused`;

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
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      console.error("[copywriter/generate] Anthropic error:", await res.text());
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json() as { content?: Array<{ type: string; text: string }> };
    const raw = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    let parsed: { title?: string; content?: string; metaDescription?: string };
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? raw) as typeof parsed;
    } catch {
      console.error("[copywriter/generate] JSON parse error:", raw);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
    }

    return NextResponse.json({
      title:           parsed.title           ?? "",
      content:         parsed.content         ?? "",
      metaDescription: parsed.metaDescription ?? "",
    });
  } catch (err) {
    console.error("[copywriter/generate] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
