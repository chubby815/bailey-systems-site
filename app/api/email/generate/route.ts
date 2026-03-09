import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`email-gen:${session.email}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let businessName: string, selling: string, target: string;
  let emailType: string, tone: string, goal: string, context: string;
  try {
    const body = await req.json() as {
      businessName?: unknown; selling?: unknown; target?: unknown;
      emailType?: unknown; tone?: unknown; goal?: unknown; context?: unknown;
    };
    if (!body.businessName || typeof body.businessName !== "string" || !body.businessName.trim())
      return NextResponse.json({ error: "businessName is required" }, { status: 400 });
    if (!body.selling || typeof body.selling !== "string" || !body.selling.trim())
      return NextResponse.json({ error: "selling is required" }, { status: 400 });
    if (!body.target || typeof body.target !== "string" || !body.target.trim())
      return NextResponse.json({ error: "target is required" }, { status: 400 });

    businessName = body.businessName.trim().slice(0, 200);
    selling      = body.selling.trim().slice(0, 300);
    target       = body.target.trim().slice(0, 300);
    emailType    = typeof body.emailType === "string" ? body.emailType.trim().slice(0, 50) : "Cold Outreach";
    tone         = typeof body.tone === "string" ? body.tone.trim().slice(0, 50) : "Professional";
    goal         = typeof body.goal === "string" ? body.goal.trim().slice(0, 50) : "Get a Reply";
    context      = typeof body.context === "string" ? body.context.trim().slice(0, 500) : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const systemPrompt =
    "You are an expert email copywriter who has written cold emails that generate millions in revenue. " +
    "You write emails that feel personal, get opened, and get replies. " +
    "You never write salesy or spammy emails. You always write like a human.";

  const userPrompt =
    `Write a ${emailType} email for:\n\n` +
    `Business: ${businessName}\n` +
    `Selling: ${selling}\n` +
    `Target Customer: ${target}\n` +
    `Tone: ${tone}\n` +
    `Goal: ${goal}\n` +
    (context ? `Extra Context: ${context}\n` : "") +
    `\nReturn ONLY a JSON object (no markdown, no backticks):\n` +
    `{\n` +
    `  "subjectLine": "the subject line",\n` +
    `  "emailBody": "the full email body",\n` +
    `  "followUp": "a short 3-day follow up email"\n` +
    `}\n\n` +
    `Rules:\n` +
    `- Subject line under 50 characters\n` +
    `- Email body under 200 words\n` +
    `- Start with a hook not 'I hope this email...'\n` +
    `- End with ONE clear call to action\n` +
    `- Sound human not robotic\n` +
    `- No buzzwords like 'synergy' or 'leverage'`;

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
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      console.error("[email/generate] Anthropic error:", await res.text());
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json() as { content?: Array<{ type: string; text: string }> };
    const raw = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    let parsed: { subjectLine?: string; emailBody?: string; followUp?: string };
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? raw) as typeof parsed;
    } catch {
      console.error("[email/generate] JSON parse error:", raw);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
    }

    return NextResponse.json({
      subjectLine: parsed.subjectLine ?? "",
      emailBody:   parsed.emailBody   ?? "",
      followUp:    parsed.followUp    ?? "",
    });
  } catch (err) {
    console.error("[email/generate] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
