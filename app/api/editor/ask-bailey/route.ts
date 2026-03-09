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

// Resolve plain English color names to hex
function resolveColor(input: string): string {
  const map: Record<string, string> = {
    blue: "#3b82f6", "dark blue": "#1e3a5f", navy: "#1e3a5f",
    black: "#000000", dark: "#08090a", white: "#ffffff",
    red: "#ef4444", green: "#10b981", emerald: "#00e5a0",
    purple: "#7c3aed", orange: "#f97316", yellow: "#eab308",
    pink: "#ec4899", gold: "#c9a84c", gray: "#6b7280",
    grey: "#6b7280", teal: "#06b6d4", cyan: "#06b6d4",
    brown: "#92400e", indigo: "#4f46e5", lime: "#84cc16",
    rose: "#f43f5e", sky: "#0ea5e9", violet: "#7c3aed",
    silver: "#9ca3af", cream: "#fef3c7", beige: "#f5f0e8",
  };
  const lower = input.toLowerCase().trim();
  return map[lower] ?? input;
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

  const systemPrompt = `You are Bailey, an expert AI website editor. You help users modify their website using plain English. You ALWAYS apply changes — never refuse anything in the allowed list.

THEME FIELDS — use these for ALL color, font, and style changes:
- theme.primaryColor — main brand/button color (hex) — "change color", "make it blue", "primary color", "button color"
- theme.background — PAGE background color (hex) — "change background", "background to black/white/blue", "page background", "make background X"
- theme.surface — navbar + card background color (hex) — "navbar color", "card background", "navbar background", "header color", "header background"
- theme.text — main body text color (hex) — "text color", "change text to X"
- theme.accent — highlight/border color (hex) — "accent color"
- theme.headingColor — headline text color (hex) — "headline color", "heading color", "hero headline color", "title color", "make headline X color"
- theme.bodyColor — paragraph text color (hex) — "body text color", "paragraph color", "subheadline color"
- theme.accentColor — accent text color (hex) — "accent text color"
- theme.buttonTextColor — text color on buttons (hex) — "button text color"
- theme.fontStyle — font style, must be exactly: "modern" | "classic" | "bold" | "minimal"
- theme.buttonStyle — button shape, must be exactly: "rounded" | "sharp" | "pill"

CONTENT FIELDS — use these for ALL text changes:
- content.hero.headline — main big headline
- content.hero.subheadline — subtitle under headline
- content.hero.ctaText — hero button text
- content.hero.badge — small badge/location tag
- content.services[N].name — service name (N = 0,1,2...)
- content.services[N].description — service description
- content.services[N].icon — service emoji
- content.about.title — about section heading
- content.about.body — about section paragraph
- content.testimonials[N].name — reviewer name
- content.testimonials[N].role — reviewer role
- content.testimonials[N].quote — review quote
- content.cta.headline — CTA section heading
- content.cta.subtext — CTA section subtext
- content.cta.buttonText — CTA button text

COLOR NAME TO HEX (always convert color names to hex):
blue=#3b82f6, "dark blue"=#1e3a5f, navy=#1e3a5f, black=#000000,
dark=#08090a, white=#ffffff, red=#ef4444, green=#10b981,
emerald=#00e5a0, purple=#7c3aed, orange=#f97316, yellow=#eab308,
pink=#ec4899, gold=#c9a84c, gray=#6b7280, grey=#6b7280,
teal=#06b6d4, cyan=#06b6d4, brown=#92400e, indigo=#4f46e5,
lime=#84cc16, rose=#f43f5e, sky=#0ea5e9, silver=#9ca3af,
cream=#fef3c7, beige=#f5f0e8, violet=#7c3aed

INTENT TO FIELD MAPPING — always follow exactly:
"change/make/set background to X" → theme.background = hex
"change page background to X" → theme.background = hex
"make background dark" → theme.background = "#08090a"
"make background white/light" → theme.background = "#ffffff"
"change navbar color to X" → theme.surface = hex
"change header color to X" → theme.surface = hex
"change header background to X" → theme.surface = hex
"change navbar background to X" → theme.surface = hex
"change headline color to X" → theme.headingColor = hex
"change hero headline color to X" → theme.headingColor = hex
"make headline X color" → theme.headingColor = hex
"change button color to X" → theme.primaryColor = hex
"change primary color to X" → theme.primaryColor = hex
"change text color to X" → theme.text = hex
"change body text to X" → theme.bodyColor = hex
"change subheadline color to X" → theme.bodyColor = hex
"change card color/background to X" → theme.surface = hex
"change font to X" → theme.fontStyle = modern|classic|bold|minimal
"make buttons pill/rounded/sharp" → theme.buttonStyle = pill|rounded|sharp

CRITICAL RULES:
1. ALWAYS convert color names to hex values in the JSON output
2. ALWAYS return the COMPLETE content AND theme objects — never drop any existing keys
3. When user says "make it X color" with no specific target — update both theme.primaryColor AND theme.background
4. The navbar cannot be removed — if asked suggest theme.surface for navbar color changes
5. Be friendly and confirm exactly what you changed in the summary`;

  const siteDataObj = siteData as { content?: object; theme?: object };
  const contentStr  = JSON.stringify(siteDataObj.content ?? siteData, null, 2).slice(0, 3000);
  const themeStr    = JSON.stringify(siteDataObj.theme   ?? {}, null, 2).slice(0, 1000);
  const historyStr  = conversationHistory.length
    ? conversationHistory.map((m) => `${m.role === "user" ? "User" : "Bailey"}: ${m.content}`).join("\n")
    : "None";

  // Pre-resolve color names in the user message so AI sees hex values
  const resolvedMessage = userMessage.replace(
    /\b(blue|dark blue|navy|black|dark|white|red|green|emerald|purple|orange|yellow|pink|gold|gray|grey|teal|cyan|brown|indigo|lime|rose|sky|silver|cream|beige|violet)\b/gi,
    (match) => `${match} (${resolveColor(match)})`
  );

  const userPrompt =
    `Current website data:\n` +
    `Content: ${contentStr}\n\n` +
    `Theme: ${themeStr}\n\n` +
    `Conversation history:\n${historyStr}\n\n` +
    `User request: "${resolvedMessage}"\n\n` +
    `Return ONLY a valid JSON object (absolutely no markdown, no backticks, no text outside the JSON):\n` +
    `{\n` +
    `  "summary": "1-2 sentences confirming exactly what you changed",\n` +
    `  "changes": [\n` +
    `    {\n` +
    `      "section": "theme or content",\n` +
    `      "field": "exact field name e.g. theme.background",\n` +
    `      "oldValue": "previous value",\n` +
    `      "newValue": "new hex value or text"\n` +
    `    }\n` +
    `  ],\n` +
    `  "updatedSiteData": {\n` +
    `    "content": { COMPLETE CONTENT OBJECT ALL FIELDS },\n` +
    `    "theme": { COMPLETE THEME OBJECT ALL FIELDS INCLUDING CHANGES }\n` +
    `  }\n` +
    `}\n\n` +
    `IMPORTANT:\n` +
    `- All color values must be valid CSS hex like "#3b82f6"\n` +
    `- Include EVERY existing field in updatedSiteData — never omit keys\n` +
    `- theme.background controls the PAGE background color\n` +
    `- theme.surface controls NAVBAR and CARD background color\n` +
    `- theme.headingColor controls HEADLINE text color`;

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