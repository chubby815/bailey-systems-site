import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { kv } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";

export type Lead = {
  businessName: string;
  ownerName: string;
  industry: string;
  location: string;
  estimatedSize: string;
  hasWebsite: boolean;
  websiteUrl: string | null;
  phone: string;
  email: string;
  score: number;
  scoreReason: string;
  outreachMessage: string;
};

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim();
}

function extractJSON(text: string): { leads: Lead[] } | null {
  let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
  const first = cleaned.indexOf("{");
  const last  = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1) return null;
  cleaned = cleaned.slice(first, last + 1);
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.leads)) return parsed as { leads: Lead[] };
    return null;
  } catch {
    return null;
  }
}

const VALID_INDUSTRIES = new Set([
  "Landscaping", "Plumbing", "Electrician", "Beauty & Wellness",
  "Restaurant", "Consulting", "Real Estate", "Fitness",
  "Auto & Mechanic", "Cleaning", "Other",
]);
const VALID_SIZES    = new Set(["Any", "Solo/1-person", "Small 2-10", "Medium 11-50"]);
const VALID_WEBSITE  = new Set(["Any", "No website only", "Has website"]);
const VALID_URGENCY  = new Set(["Show all", "High potential only"]);

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Plan check — Growth or Pro only ──────────────────────────────────────
  const plan = await getActivePlan(session.email);
  if (!plan) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }
  if (plan === "starter") {
    return NextResponse.json(
      { error: "plan_required", message: "Lead Hunter requires a Growth or Pro plan." },
      { status: 403 }
    );
  }

  // ── Rate limit: 10 searches per hour per user ─────────────────────────────
  const rl = await rateLimit(`leads:${session.email}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${rl.resetInSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  // ── Parse & validate body ─────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { industry, location, businessSize, hasWebsite, urgency } = body;

  if (typeof industry !== "string" || !VALID_INDUSTRIES.has(industry))
    return NextResponse.json({ error: "Invalid industry" }, { status: 400 });
  if (typeof location !== "string" || !location.trim())
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  if (typeof businessSize !== "string" || !VALID_SIZES.has(businessSize))
    return NextResponse.json({ error: "Invalid business size" }, { status: 400 });
  if (typeof hasWebsite !== "string" || !VALID_WEBSITE.has(hasWebsite))
    return NextResponse.json({ error: "Invalid website filter" }, { status: 400 });
  if (typeof urgency !== "string" || !VALID_URGENCY.has(urgency))
    return NextResponse.json({ error: "Invalid urgency filter" }, { status: 400 });

  const cleanLocation = sanitize(location).slice(0, 100);

  // ── Build Claude prompt ───────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  const websiteInstruction =
    hasWebsite === "No website only"
      ? "All leads should NOT have a website (hasWebsite: false, websiteUrl: null)."
      : hasWebsite === "Has website"
      ? "All leads SHOULD have a website (hasWebsite: true, websiteUrl: a realistic URL)."
      : "Include a realistic mix of businesses with and without websites.";

  const urgencyInstruction =
    urgency === "High potential only"
      ? "Only generate leads with a score of 8 or higher (high-potential prospects)."
      : "Include a variety of lead scores from 5 to 10.";

  const sizeInstruction =
    businessSize === "Any"
      ? "Include a mix of business sizes."
      : `All leads should be: ${businessSize} businesses.`;

  const userPrompt = `Generate 8 potential business leads for a sales outreach campaign:

Industry: ${industry}
Location: ${cleanLocation}
${sizeInstruction}
${websiteInstruction}
${urgencyInstruction}

IMPORTANT: Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

Required JSON structure:
{
  "leads": [
    {
      "businessName": "realistic local business name",
      "ownerName": "realistic full name",
      "industry": "${industry}",
      "location": "${cleanLocation}",
      "estimatedSize": "one of: Solo/1-person, Small 2-10, Medium 11-50",
      "hasWebsite": true or false,
      "websiteUrl": "https://example.com" or null,
      "phone": "realistic 10-digit US phone number like (815) 555-0142",
      "email": "realistic business email like owner@businessname.com",
      "score": 7,
      "scoreReason": "2 sentences explaining why this lead scored this way",
      "outreachMessage": "Personalized 2-3 sentence cold outreach message that mentions their business name, references their industry, and explains how BaileySystemsAI's AI website and automation tools can help grow their specific type of business."
    }
  ]
}`;

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system:
        "You are a B2B lead generation expert. Generate realistic potential business leads. Return ONLY a raw JSON object — no markdown, no backticks, no code fences, no explanation.",
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text().catch(() => "unknown");
    console.error("[leads/generate] Anthropic error:", anthropicRes.status, err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }

  const anthropicData = await anthropicRes.json();
  const rawText: string = anthropicData.content?.[0]?.text ?? "";

  const parsed = extractJSON(rawText);
  if (!parsed) {
    console.error("[leads/generate] JSON parse failed:", rawText.slice(0, 400));
    return NextResponse.json({ error: "Failed to parse lead data" }, { status: 500 });
  }

  // Clamp scores to 1-10
  const leads: Lead[] = parsed.leads.map((l) => ({
    ...l,
    score: Math.max(1, Math.min(10, Number(l.score) || 5)),
  }));

  // ── Persist to Redis (24-hour TTL) ────────────────────────────────────────
  const key = `leads:${session.email}:${Date.now()}`;
  await kv.set(key, { leads, searchedAt: new Date().toISOString() }, { ex: 86400 });

  return NextResponse.json({ leads });
}
