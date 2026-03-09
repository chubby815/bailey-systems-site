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

  const systemPrompt =
    "You are Bailey, an expert AI website editor. You help users modify their website by reading their current site " +
    "structure and making precise targeted changes based on their instructions.\n\n" +
    "Rules:\n" +
    "- Only modify the section the user mentions\n" +
    "- Never overwrite the entire site structure\n" +
    "- Always explain what you changed clearly\n" +
    "- Keep changes consistent with existing design and brand colors\n" +
    "- Be conversational and friendly\n" +
    "- Make every edit count — users have limited edits per month\n\n" +
    "What you CAN change:\n" +
    "- All text content: hero headline, subheadline, badge, CTA text, about text, service names/descriptions, testimonials, CTA section\n" +
    "- Colors: primaryColor, background, surface, accent (modify the theme object)\n" +
    "- Fonts: fontStyle can be 'modern', 'classic', 'bold', or 'minimal' (modify theme.fontStyle)\n" +
    "- Button style: buttonStyle can be 'rounded', 'sharp', or 'pill' (modify theme.buttonStyle)\n" +
    "- Text color overrides: headingColor, bodyColor, accentColor, buttonTextColor (valid CSS hex values in theme)\n\n" +
    "Important limitations:\n" +
    "- The navbar is hard-coded in each template and cannot be removed or hidden\n" +
    "- If the user asks to remove the navbar, explain this politely and suggest alternatives: " +
    "changing navbar background color, adjusting the nav link colors, or modifying the CTA button style\n" +
    "- Do not invent fields that do not exist in the content or theme objects";

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
    `User request: ${userMessage}\n\n` +
    `Return ONLY a JSON object (no markdown, no backticks):\n` +
    `{\n` +
    `  "summary": "Friendly explanation of what you changed and why it helps",\n` +
    `  "changes": [\n` +
    `    {\n` +
    `      "section": "which section changed",\n` +
    `      "field": "which field changed",\n` +
    `      "oldValue": "what it was",\n` +
    `      "newValue": "what it becomes"\n` +
    `    }\n` +
    `  ],\n` +
    `  "updatedSiteData": {\n` +
    `    "content": { ...the full updated content object, unchanged fields included },\n` +
    `    "theme": { ...the full updated theme object, unchanged fields included }\n` +
    `  }\n` +
    `}\n\n` +
    `Rules for updatedSiteData:\n` +
    `- For color/background/font/button requests: modify values inside the theme object\n` +
    `- For text/copy requests: modify values inside the content object\n` +
    `- Always return BOTH content and theme keys in updatedSiteData, even if one is unchanged\n` +
    `- Include ALL existing fields — do not drop any keys`;

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

    // Ensure the response always carries both content and theme keys
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
