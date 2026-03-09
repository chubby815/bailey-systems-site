import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

type Objection = { objection: string; response: string };

type SalesResult = {
  mainContent: string;
  objections: Objection[];
  powerPhrases: string[];
};

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = await getActivePlan(session.email);
  if (plan !== "pro") {
    return NextResponse.json(
      { error: "upgrade_required", message: "Sales Manager requires Pro plan." },
      { status: 403 }
    );
  }

  const rl = await rateLimit(`sales-gen:${session.email}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let businessName: string, selling: string, target: string, pricePoint: string;
  let channel: string, contentType: string, tone: string;
  try {
    const body = await req.json() as {
      businessName?: unknown; selling?: unknown; target?: unknown;
      pricePoint?: unknown; channel?: unknown; contentType?: unknown; tone?: unknown;
    };
    if (!body.businessName || typeof body.businessName !== "string" || !body.businessName.trim())
      return NextResponse.json({ error: "businessName is required" }, { status: 400 });
    if (!body.selling || typeof body.selling !== "string" || !body.selling.trim())
      return NextResponse.json({ error: "selling is required" }, { status: 400 });
    if (!body.target || typeof body.target !== "string" || !body.target.trim())
      return NextResponse.json({ error: "target is required" }, { status: 400 });
    if (!body.pricePoint || typeof body.pricePoint !== "string" || !body.pricePoint.trim())
      return NextResponse.json({ error: "pricePoint is required" }, { status: 400 });

    businessName = body.businessName.trim().slice(0, 200);
    selling      = body.selling.trim().slice(0, 300);
    target       = body.target.trim().slice(0, 300);
    pricePoint   = body.pricePoint.trim().slice(0, 100);
    channel      = typeof body.channel === "string" ? body.channel.trim().slice(0, 50) : "Phone Call";
    contentType  = typeof body.contentType === "string" ? body.contentType.trim().slice(0, 50) : "Full Sales Script";
    tone         = typeof body.tone === "string" ? body.tone.trim().slice(0, 50) : "Consultative";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const systemPrompt =
    "You are a world-class sales trainer who has coached thousands of salespeople to close millions in deals. " +
    "You write scripts that feel natural and human, never pushy or salesy.";

  const userPrompt =
    `Create ${contentType} for:\n\n` +
    `Business: ${businessName}\n` +
    `Product/Service: ${selling}\n` +
    `Target Customer: ${target}\n` +
    `Price: ${pricePoint}\n` +
    `Sales Channel: ${channel}\n` +
    `Tone: ${tone}\n\n` +
    `Return ONLY a JSON object (no markdown, no backticks):\n` +
    `{\n` +
    `  "mainContent": "full script or content",\n` +
    `  "objections": [\n` +
    `    { "objection": "string", "response": "string" }\n` +
    `  ],\n` +
    `  "powerPhrases": ["string"]\n` +
    `}\n\n` +
    `Rules:\n` +
    `- Sound natural not robotic\n` +
    `- Focus on benefits not features\n` +
    `- Include emotional triggers\n` +
    `- End with a strong close\n` +
    `- Generate exactly 5 objections\n` +
    `- Generate exactly 6 power phrases`;

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
      console.error("[sales/generate] Anthropic error:", await res.text());
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const data = await res.json() as { content?: Array<{ type: string; text: string }> };
    const raw = data.content?.find((b) => b.type === "text")?.text?.trim() ?? "";

    let parsed: Partial<SalesResult>;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? raw) as Partial<SalesResult>;
    } catch {
      console.error("[sales/generate] JSON parse error:", raw);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
    }

    return NextResponse.json({
      mainContent:  parsed.mainContent  ?? "",
      objections:   Array.isArray(parsed.objections) ? parsed.objections : [],
      powerPhrases: Array.isArray(parsed.powerPhrases) ? parsed.powerPhrases : [],
    });
  } catch (err) {
    console.error("[sales/generate] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
