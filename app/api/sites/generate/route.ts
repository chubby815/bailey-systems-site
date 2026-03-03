import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { saveSite, type SiteRecord } from "@/lib/kv";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 6);
}

export async function POST(req: NextRequest) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Subscription check ───────────────────────────────────────────────────────
  const plan = await getActivePlan(session.email);
  if (!plan) {
    return NextResponse.json(
      { error: "Active subscription required" },
      { status: 403 }
    );
  }

  // ── Parse body ───────────────────────────────────────────────────────────────
  const body = await req.json();
  const {
    businessName,
    industry,
    location,
    services,
    tone,
    primaryColor,
    contactEmail,
    contactPhone,
  } = body as Record<string, string>;

  if (!businessName || !industry || !location || !services) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // ── Call Anthropic ───────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 500 }
    );
  }

  const userPrompt = `Generate a complete website for:
Business: ${businessName}
Industry: ${industry}
Location: ${location}
Services: ${services}
Tone: ${tone}

Return this exact JSON structure with no markdown, no backticks, just raw JSON:
{
  "hero_headline": "punchy headline max 8 words",
  "hero_subheadline": "1-2 sentence description of what they do and who they serve",
  "about_text": "2-3 sentences about the business, their experience, and their commitment to customers",
  "services_list": ["Service 1", "Service 2", "Service 3", "Service 4", "Service 5"],
  "cta_text": "Call to action max 4 words",
  "tagline": "short memorable brand phrase",
  "seo_title": "SEO optimized page title",
  "seo_description": "SEO meta description 150-160 characters"
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
      max_tokens: 1024,
      system:
        "You are a professional website copywriter. Generate website content for a local business. Return ONLY valid JSON, no markdown, no backticks, no explanation.",
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    return NextResponse.json(
      { error: "Content generation failed" },
      { status: 500 }
    );
  }

  const anthropicData = await anthropicRes.json();
  const rawText: string = anthropicData.content?.[0]?.text ?? "{}";

  let generatedContent: SiteRecord["generatedContent"];
  try {
    generatedContent = JSON.parse(rawText.trim());
  } catch {
    return NextResponse.json(
      { error: "Failed to parse generated content" },
      { status: 500 }
    );
  }

  // ── Save to Redis ────────────────────────────────────────────────────────────
  const siteId = `${slugify(businessName)}-${randomSuffix()}`;

  const siteData: SiteRecord = {
    siteId,
    userId: session.email,
    businessName,
    industry,
    location,
    services,
    tone,
    primaryColor,
    contactEmail,
    contactPhone,
    generatedContent,
    createdAt: new Date().toISOString(),
  };

  await saveSite(siteId, siteData);

  return NextResponse.json({ siteId, url: `/sites/${siteId}` });
}
