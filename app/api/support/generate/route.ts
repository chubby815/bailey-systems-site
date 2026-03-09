import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

type TemplateItem   = { title: string; content: string };
type FaqItem        = { question: string; answer: string };
type ComplaintLevel = { level: string; response: string };

type SupportResult =
  | { type: "templates";   items: TemplateItem[] }
  | { type: "faq";         items: FaqItem[] }
  | { type: "brand_voice"; toneDescription: string; wordsToUse: string[]; wordsToAvoid: string[]; examplePhrases: string[] }
  | { type: "complaints";  levels: ComplaintLevel[] }
  | { type: "reviews";     fiveStar: string; threeStar: string; oneStar: string };

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getActivePlan(session.email);
  if (plan === "starter") {
    return NextResponse.json(
      { error: "upgrade_required", message: "Customer Support requires Growth or Pro plan." },
      { status: 403 }
    );
  }

  const rl = await rateLimit(`support-gen:${session.email}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let businessName: string, industry: string, brandTone: string;
  let contentType: string, situation: string, context: string;
  try {
    const body = await req.json() as {
      businessName?: unknown; industry?: unknown; brandTone?: unknown;
      contentType?: unknown; situation?: unknown; context?: unknown;
    };
    if (!body.businessName || typeof body.businessName !== "string" || !body.businessName.trim())
      return NextResponse.json({ error: "businessName is required" }, { status: 400 });
    if (!body.industry || typeof body.industry !== "string" || !body.industry.trim())
      return NextResponse.json({ error: "industry is required" }, { status: 400 });
    if (!body.situation || typeof body.situation !== "string" || !body.situation.trim())
      return NextResponse.json({ error: "situation is required" }, { status: 400 });

    businessName = body.businessName.trim().slice(0, 200);
    industry     = body.industry.trim().slice(0, 200);
    brandTone    = typeof body.brandTone === "string" ? body.brandTone.trim().slice(0, 50) : "Friendly";
    contentType  = typeof body.contentType === "string" ? body.contentType.trim().slice(0, 50) : "Reply Templates";
    situation    = body.situation.trim().slice(0, 500);
    context      = typeof body.context === "string" ? body.context.trim().slice(0, 400) : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const schemaByType: Record<string, string> = {
    "Reply Templates": `{ "type": "templates", "items": [{ "title": "string", "content": "string" }] } — generate 5 items`,
    "FAQ Generator":   `{ "type": "faq", "items": [{ "question": "string", "answer": "string" }] } — generate 10 items`,
    "Brand Voice Guide": `{ "type": "brand_voice", "toneDescription": "string", "wordsToUse": ["string"], "wordsToAvoid": ["string"], "examplePhrases": ["string"] }`,
    "Complaint Handler": `{ "type": "complaints", "levels": [{ "level": "Level 1: Calm response", "response": "string" }, { "level": "Level 2: Escalated response", "response": "string" }, { "level": "Level 3: Final resolution offer", "response": "string" }] }`,
    "Review Responses":  `{ "type": "reviews", "fiveStar": "string", "threeStar": "string", "oneStar": "string" }`,
  };

  const schema = schemaByType[contentType] ?? schemaByType["Reply Templates"];

  const systemPrompt =
    "You are an expert customer support specialist and brand consultant who has helped hundreds of businesses " +
    "create support systems that turn unhappy customers into loyal fans. " +
    "You write responses that are warm, professional, and on-brand.";

  const userPrompt =
    `Generate ${contentType} for:\n\n` +
    `Business: ${businessName}\n` +
    `Industry: ${industry}\n` +
    `Brand Tone: ${brandTone}\n` +
    `Situation: ${situation}\n` +
    (context ? `Extra Context: ${context}\n` : "") +
    `\nReturn ONLY a JSON object (no markdown, no backticks) matching this shape:\n${schema}`;

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
        max_tokens: 2500,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      console.error("[support/generate] Anthropic error:", await res.text());
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json() as { content?: Array<{ type: string; text: string }> };
    const raw = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    let parsed: SupportResult;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? raw) as SupportResult;
    } catch {
      console.error("[support/generate] JSON parse error:", raw);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[support/generate] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
