import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";
import { kv } from "@/lib/kv";

type PlanKey = "starter" | "growth" | "pro";

const ASK_BAILEY_LIMITS: Record<PlanKey, number> = {
  starter: 3,
  growth:  15,
  pro:     Infinity,
};

function usageKey(email: string): string {
  const now = new Date();
  return `ask-bailey:${email}:${now.getUTCFullYear()}:${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function getUsage(email: string): Promise<number> {
  const count = await kv.get<number>(usageKey(email));
  return count ?? 0;
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = ((await getActivePlan(session.email)) ?? "starter") as PlanKey;
  const limit = ASK_BAILEY_LIMITS[plan] ?? 3;

  if (limit !== Infinity) {
    const used = await getUsage(session.email);
    if (used >= limit) {
      return NextResponse.json(
        { error: "limit_reached", plan, limit, used },
        { status: 403 }
      );
    }
  }

  const rl = await rateLimit(`ask-bailey:${session.email}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let userMessage: string, siteData: object, conversationHistory: { role: string; content: string }[];
  try {
    const body = await req.json() as {
      userMessage?: unknown; siteData?: unknown; conversationHistory?: unknown;
    };
    if (!body.userMessage || typeof body.userMessage !== "string" || !body.userMessage.trim())
      return NextResponse.json({ error: "userMessage is required" }, { status: 400 });
    if (!body.siteData || typeof body.siteData !== "object")
      return NextResponse.json({ error: "siteData is required" }, { status: 400 });

    userMessage         = body.userMessage.trim().slice(0, 800);
    siteData            = body.siteData as object;
    conversationHistory = Array.isArray(body.conversationHistory)
      ? (body.conversationHistory as { role: string; content: string }[])
          .filter((m) => m && (m.role === "user" || m.role === "assistant"))
          .slice(-6)
          .map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
      : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const systemPrompt = `You are Bailey, an expert AI website editor. You help users modify their website using plain English instructions. You ALWAYS apply changes — never say you cannot do something that is in the allowed list below.

EXACT FIELD NAMES YOU CAN MODIFY:

THEME FIELDS (modify these for any color, font, button, or style change):
- theme.primaryColor — main brand color (hex e.g. "#3b82f6") — use this for "change color to X", "make it blue", "primary color"
- theme.background — page background color (hex) — use this for "change background", "make background dark/white/black/blue etc"
- theme.surface — card and navbar background color (hex) — use this for "change card color", "navbar background"
- theme.text — main text color (hex) — use this for "change text color"
- theme.accent — accent/highlight color (hex) — use this for "change accent color"
- theme.fontStyle — must be exactly one of: "modern", "classic", "bold", "minimal"
- theme.buttonStyle — must be exactly one of: "rounded", "sharp", "pill"
- theme.headingColor — heading text color (hex) — use for "change heading color"
- theme.bodyColor — body text color (hex) — use for "change body text color"
- theme.accentColor — accent text color (hex) — use for "change accent color"
- theme.buttonTextColor — button text color (hex) — use for "change button text color"

CONTENT FIELDS (modify these for any text change):
- content.hero.headline — main hero headline
- content.hero.subheadline — hero subtitle text
- content.hero.ctaText — hero button text
- content.hero.badge — location/badge tag below headline
- content.services[N].name — service name (N = index 0,1,2...)
- content.services[N].description — service description
- content.services[N].icon — service emoji icon
- content.about.title — about section title
- content.about.body — about section body text
- content.testimonials[N].name — reviewer name
- content.testimonials[N].role — reviewer role/company
- content.testimonials[N].quote — review text
- content.cta.headline — CTA section headline
- content.cta.subtext — CTA section subtext
- content.cta.buttonText — CTA button text

COLOR REFERENCE (use these hex values when user says a color name):
- blue → "#3b82f6"
- dark blue → "#1e3a5f"  
- navy → "#1e3a5f"
- black → "#000000"
- dark → "#08090a"
- white → "#ffffff"
- red → "#ef4444"
- green → "#10b981"
- emerald → "#00e5a0"
- purple → "#7c3aed"
- orange → "#f97316"
- yellow → "#eab308"
- pink → "#ec4899"
- gold → "#c9a84c"
- gray → "#6b7280"
- teal → "#06b6d4"

CRITICAL RULES:
1. When user says "change background to X" — set theme.background to that color hex
2. When user says "make it blue/red/etc" — set theme.primaryColor AND theme.background if context implies full color change
3. When user says "edit/change/make the hero" — modify content.hero fields
4. When user says "edit/change/make the services" — modify content.services fields
5. ALWAYS return the complete content and theme objects with ALL fields — never drop any keys
6. The navbar is hard-coded and cannot be removed — if asked, suggest changing theme.surface or theme.primaryColor instead
7. Be conversational and friendly
8. Make every edit count`;

  const siteDataObj = siteData as { content?: object; theme?: object };
  const contentStr  = JSON.stringify(siteDataObj.content ?? siteData, null, 2).slice(0, 3000);
  const themeStr    = JSON.stringify(siteDataObj.theme   ?? {}, null, 2).slice(0, 1000);
  const historyStr  = conversationHistory.length
    ? conversationHistory.map((m) => `${m.role === "user" ? "User" : "Bailey"}: ${m.content}`).join("\n")
    : "None";

  const userPrompt =
    `Current website data:\n` +
    `Content: ${contentStr}\n\n` +
    `Theme: ${themeStr}\n\n` +
    `Conversation history:\n${historyStr}\n\n` +
    `User request: "${userMessage}"\n\n` +
    `Return ONLY a valid JSON object (no markdown, no backticks, no explanation outside JSON):\n` +
    `{\n` +
    `  "summary": "Friendly 1-2 sentence explanation of exactly what you changed",\n` +
    `  "changes": [\n` +
    `    {\n` +
    `      "section": "theme or content section name",\n` +
    `      "field": "exact field name that changed",\n` +
    `      "oldValue": "previous value",\n` +
    `      "newValue": "new value"\n` +
    `    }\n` +
    `  ],\n` +
    `  "updatedSiteData": {\n` +
    `    "content": { ...complete content object with ALL fields },\n` +
    `    "theme": { ...complete theme object with ALL fields }\n` +
    `  }\n` +
    `}\n\n` +
    `IMPORTANT: updatedSiteData.theme MUST include ALL existing theme fields plus any new ones you changed. updatedSiteData.content MUST include ALL existing content fields. Never drop any keys.`;

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
        max_tokens: 6000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      console.error("[ask-bailey] Anthropic error:", await res.text());
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json() as { content?: Array<{ type: string; text: string }> };
    const raw  = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    let parsed: { summary?: string; changes?: unknown[]; updatedSiteData?: { content?: object; theme?: object } };
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? raw) as typeof parsed;
    } catch {
      console.error("[ask-bailey] JSON parse error:", raw.slice(0, 300));
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
    }

    const incoming = siteDataObj;
    const updatedSiteData = {
      content: parsed.updatedSiteData?.content ?? incoming.content ?? siteData,
      theme:   parsed.updatedSiteData?.theme   ?? incoming.theme   ?? {},
    };

    return NextResponse.json({
      summary:         parsed.summary ?? "Changes applied.",
      changes:         Array.isArray(parsed.changes) ? parsed.changes : [],
      updatedSiteData,
    });
  } catch (err) {
    console.error("[ask-bailey] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}