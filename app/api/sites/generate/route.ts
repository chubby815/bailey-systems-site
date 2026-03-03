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
  "Midnight Black", "Golden Yellow", "Hot Pink", "Cyan", "Slate Gray",
  "Rose Gold", "Deep Navy",
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
    editSiteId,
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

  const userPrompt = `Generate website content for this local business:

Business: ${cleanBusinessName}
Industry: ${cleanIndustry}
Location: ${cleanLocation}
Services: ${cleanServices}
Tone: ${cleanTone}

IMPORTANT: Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

Required JSON structure:
{
  "hero_headline": "punchy headline max 8 words",
  "hero_subheadline": "1-2 sentence description of what they do and who they serve",
  "about_text": "2-3 sentences about the business, their experience, and commitment to customers",
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
        "You are a professional website copywriter. Generate website content for a local business. Return ONLY a raw JSON object — no markdown, no backticks, no code fences, no explanation, nothing before or after the JSON.",
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const errBody = await anthropicRes.text().catch(() => "unknown");
    console.error("[sites/generate] Anthropic API error:", anthropicRes.status, errBody);
    return NextResponse.json(
      { error: "Content generation failed" },
      { status: 500 }
    );
  }

  const anthropicData = await anthropicRes.json();
  const rawText: string = anthropicData.content?.[0]?.text ?? "";

  // ── Robust JSON extraction ────────────────────────────────────────────────
  function extractJSON(text: string): SiteRecord["generatedContent"] | null {
    // Strip markdown code fences (```json ... ``` or ``` ... ```)
    let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
    // Trim any text before the first { and after the last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) return null;
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }

  // ── Fallback content if Claude returns unparseable output ─────────────────
  function buildFallback(): SiteRecord["generatedContent"] {
    const serviceItems = cleanServices.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
    if (serviceItems.length < 1) serviceItems.push(cleanIndustry);
    return {
      hero_headline: `${cleanIndustry} Services in ${cleanLocation}`,
      hero_subheadline: `${cleanBusinessName} provides professional ${cleanIndustry.toLowerCase()} services in ${cleanLocation}. We deliver quality results you can count on.`,
      about_text: `${cleanBusinessName} has been proudly serving ${cleanLocation} with top-quality ${cleanIndustry.toLowerCase()} services. Our team is committed to delivering outstanding results and exceptional customer service on every job.`,
      services_list: serviceItems.length > 0 ? serviceItems : ["Consultation", "Installation", "Maintenance", "Repair", "Inspection"],
      cta_text: "Get a Free Quote",
      tagline: `Your trusted ${cleanIndustry.toLowerCase()} experts.`,
      seo_title: `${cleanBusinessName} — ${cleanIndustry} in ${cleanLocation}`,
      seo_description: `${cleanBusinessName} offers professional ${cleanIndustry.toLowerCase()} services in ${cleanLocation}. Contact us today for a free estimate.`,
    };
  }

  let generatedContent = extractJSON(rawText);

  if (!generatedContent) {
    console.error(
      "[sites/generate] JSON parse failed. Raw Claude output:",
      rawText.slice(0, 500)
    );
    // Use fallback so generation still succeeds instead of erroring
    generatedContent = buildFallback();
  }

  // ── Determine siteId (new or overwrite existing) ──────────────────────────
  let siteId: string;
  if (typeof editSiteId === "string" && editSiteId.trim()) {
    // Verify the existing site belongs to this user before overwriting
    const existing = await import("@/lib/kv").then((m) => m.getSite(editSiteId));
    if (existing && existing.userId !== session.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    siteId = editSiteId.trim();
  } else {
    siteId = `${slugify(cleanBusinessName)}-${randomSuffix()}`;
  }

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
