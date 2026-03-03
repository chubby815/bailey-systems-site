import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { saveSite, type SiteRecord } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";

// ── Allowed enum values ───────────────────────────────────────────────────────
const VALID_INDUSTRIES = new Set([
  "Landscaping", "Plumbing", "Electrician", "Beauty & Wellness",
  "Restaurant", "Consulting", "Real Estate", "Fitness",
  "Auto & Mechanic", "Cleaning", "Other",
]);
const VALID_TONES = new Set(["Professional", "Friendly", "Bold", "Luxury", "Minimal"]);
const VALID_COLORS = new Set([
  "Emerald Green", "Electric Blue", "Sunset Orange", "Royal Purple", "Fire Red",
]);

// ── Helpers ───────────────────────────────────────────────────────────────────
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

/** Strip HTML tags and control characters */
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim();
}

export async function POST(req: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Subscription check ───────────────────────────────────────────────────
  const plan = await getActivePlan(session.email);
  if (!plan) {
    return NextResponse.json(
      { error: "Active subscription required" },
      { status: 403 }
    );
  }

  // ── Rate limit: 10 site generations per hour per user ────────────────────
  const rl = await rateLimit(`generate:${session.email}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${rl.resetInSeconds}s.` },
      {
        status: 429,
        headers: { "Retry-After": String(rl.resetInSeconds) },
      }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    businessName,
    industry,
    location,
    services,
    tone,
    primaryColor,
    contactEmail,
    contactPhone,
  } = body;

  // ── Type checks ───────────────────────────────────────────────────────────
  const stringFields: Record<string, unknown> = {
    businessName, industry, location, services, tone, primaryColor,
  };
  for (const [key, val] of Object.entries(stringFields)) {
    if (typeof val !== "string" || val.trim() === "") {
      return NextResponse.json(
        { error: `Missing or invalid field: ${key}` },
        { status: 400 }
      );
    }
  }

  // ── Enum validation ───────────────────────────────────────────────────────
  if (!VALID_INDUSTRIES.has(industry as string)) {
    return NextResponse.json({ error: "Invalid industry value" }, { status: 400 });
  }
  if (!VALID_TONES.has(tone as string)) {
    return NextResponse.json({ error: "Invalid tone value" }, { status: 400 });
  }
  if (!VALID_COLORS.has(primaryColor as string)) {
    return NextResponse.json({ error: "Invalid color value" }, { status: 400 });
  }

  // ── Length checks ─────────────────────────────────────────────────────────
  if ((businessName as string).length > 100) {
    return NextResponse.json(
      { error: "Business name too long (max 100 characters)" },
      { status: 400 }
    );
  }
  if ((location as string).length > 100) {
    return NextResponse.json(
      { error: "Location too long (max 100 characters)" },
      { status: 400 }
    );
  }
  if ((services as string).length > 500) {
    return NextResponse.json(
      { error: "Services too long (max 500 characters)" },
      { status: 400 }
    );
  }

  // ── Sanitize before sending to Claude ────────────────────────────────────
  const cleanBusinessName = sanitize(businessName as string);
  const cleanLocation = sanitize(location as string);
  const cleanServices = sanitize(services as string);
  const cleanIndustry = sanitize(industry as string);
  const cleanTone = sanitize(tone as string);
  const cleanContactEmail =
    typeof contactEmail === "string" ? sanitize(contactEmail).slice(0, 200) : "";
  const cleanContactPhone =
    typeof contactPhone === "string" ? sanitize(contactPhone).slice(0, 30) : "";

  // ── Call Anthropic ────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 500 }
    );
  }

  const userPrompt = `Generate a complete website for:
Business: ${cleanBusinessName}
Industry: ${cleanIndustry}
Location: ${cleanLocation}
Services: ${cleanServices}
Tone: ${cleanTone}

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

  // ── Save to Redis ─────────────────────────────────────────────────────────
  const siteId = `${slugify(cleanBusinessName)}-${randomSuffix()}`;

  const siteData: SiteRecord = {
    siteId,
    userId: session.email,
    businessName: cleanBusinessName,
    industry: cleanIndustry,
    location: cleanLocation,
    services: cleanServices,
    tone: cleanTone,
    primaryColor: primaryColor as string,
    contactEmail: cleanContactEmail,
    contactPhone: cleanContactPhone,
    generatedContent,
    createdAt: new Date().toISOString(),
  };

  await saveSite(siteId, siteData);

  return NextResponse.json({ siteId, url: `/sites/${siteId}` });
}
