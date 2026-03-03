import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { saveSite, getUserSites, type SiteRecord } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";

const SITE_LIMITS: Record<string, number> = {
  starter: 1,
  growth:  3,
  pro:     Infinity,
};

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
const VALID_FONT_STYLES = new Set(["Modern", "Classic & Elegant", "Bold & Strong", "Clean & Minimal"]);
const VALID_HERO_STYLES = new Set(["Photo Background", "Gradient Background", "Solid Color"]);
const VALID_LAYOUT_STYLES = new Set(["Standard", "Centered", "Full Width"]);
const VALID_YEARS = new Set([
  "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years",
]);

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 6);
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim();
}

function optStr(val: unknown, max = 300): string {
  if (typeof val !== "string") return "";
  return sanitize(val).slice(0, max);
}

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Subscription ─────────────────────────────────────────────────────────
  const plan = await getActivePlan(session.email);
  if (!plan) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }

  // ── Rate limit ───────────────────────────────────────────────────────────
  const rl = await rateLimit(`generate:${session.email}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${rl.resetInSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  // ── Parse body early so we can detect regeneration before the limit check ─
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Plan site limit (skip when regenerating an existing site) ────────────
  const isRegenerate = typeof body.editSiteId === "string" && body.editSiteId.trim() !== "";
  if (!isRegenerate) {
    const limit = SITE_LIMITS[plan] ?? 1;
    if (isFinite(limit)) {
      const existingSites = await getUserSites(session.email);
      if (existingSites.length >= limit) {
        const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
        return NextResponse.json(
          {
            error: `plan_limit`,
            message: `Your ${planName} plan allows up to ${limit} site${limit === 1 ? "" : "s"}. Upgrade to create more.`,
          },
          { status: 403 }
        );
      }
    }
  }

  // ── Destructure body ──────────────────────────────────────────────────────
  const {
    businessName, industry, location, services, tone, primaryColor,
    contactEmail, contactPhone, editSiteId,
    // Extended info
    tagline, description, yearsInBusiness,
    facebookUrl, instagramUrl, googleBusinessUrl,
    businessHours, serviceArea,
    // Style
    fontStyle, heroStyle, layoutStyle,
  } = body;

  // ── Required field checks ─────────────────────────────────────────────────
  const requiredFields: Record<string, unknown> = {
    businessName, industry, location, services, tone, primaryColor,
  };
  for (const [key, val] of Object.entries(requiredFields)) {
    if (typeof val !== "string" || val.trim() === "") {
      return NextResponse.json({ error: `Missing or invalid field: ${key}` }, { status: 400 });
    }
  }

  // ── Enum validation ───────────────────────────────────────────────────────
  if (!VALID_INDUSTRIES.has(industry as string))
    return NextResponse.json({ error: "Invalid industry value" }, { status: 400 });
  if (!VALID_TONES.has(tone as string))
    return NextResponse.json({ error: "Invalid tone value" }, { status: 400 });
  if (!VALID_COLORS.has(primaryColor as string))
    return NextResponse.json({ error: "Invalid color value" }, { status: 400 });

  // Style fields are optional — fall back to defaults if missing/invalid
  const cleanFontStyle =
    typeof fontStyle === "string" && VALID_FONT_STYLES.has(fontStyle) ? fontStyle : "Modern";
  const cleanHeroStyle =
    typeof heroStyle === "string" && VALID_HERO_STYLES.has(heroStyle) ? heroStyle : "Photo Background";
  const cleanLayoutStyle =
    typeof layoutStyle === "string" && VALID_LAYOUT_STYLES.has(layoutStyle) ? layoutStyle : "Standard";
  const cleanYearsInBusiness =
    typeof yearsInBusiness === "string" && VALID_YEARS.has(yearsInBusiness)
      ? yearsInBusiness
      : "1-3 years";

  // ── Length checks ─────────────────────────────────────────────────────────
  if ((businessName as string).length > 100)
    return NextResponse.json({ error: "Business name too long (max 100 chars)" }, { status: 400 });
  if ((location as string).length > 100)
    return NextResponse.json({ error: "Location too long (max 100 chars)" }, { status: 400 });
  if ((services as string).length > 500)
    return NextResponse.json({ error: "Services too long (max 500 chars)" }, { status: 400 });

  // ── Sanitize ──────────────────────────────────────────────────────────────
  const cleanBusinessName  = sanitize(businessName as string);
  const cleanLocation      = sanitize(location as string);
  const cleanServices      = sanitize(services as string);
  const cleanIndustry      = sanitize(industry as string);
  const cleanTone          = sanitize(tone as string);
  const cleanContactEmail  = optStr(contactEmail, 200);
  const cleanContactPhone  = optStr(contactPhone, 30);
  const cleanTagline       = optStr(tagline, 150);
  const cleanDescription   = optStr(description, 600);
  const cleanServiceArea   = optStr(serviceArea, 200);
  const cleanFacebookUrl   = optStr(facebookUrl, 300);
  const cleanInstagramUrl  = optStr(instagramUrl, 300);
  const cleanGoogleUrl     = optStr(googleBusinessUrl, 300);
  const cleanBusinessHours = optStr(businessHours, 200);

  // ── Build Claude prompt ───────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  const extraContext = [
    cleanTagline       && `Tagline hint: ${cleanTagline}`,
    cleanDescription   && `Business description: ${cleanDescription}`,
    cleanYearsInBusiness && `Years in business: ${cleanYearsInBusiness}`,
    cleanServiceArea   && `Service area: ${cleanServiceArea}`,
  ].filter(Boolean).join("\n");

  const userPrompt = `Generate website content for this local business:

Business: ${cleanBusinessName}
Industry: ${cleanIndustry}
Location: ${cleanLocation}
Services: ${cleanServices}
Tone: ${cleanTone}
${extraContext ? `\nAdditional context:\n${extraContext}` : ""}

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
    return NextResponse.json({ error: "Content generation failed" }, { status: 500 });
  }

  const anthropicData = await anthropicRes.json();
  const rawText: string = anthropicData.content?.[0]?.text ?? "";

  // ── Robust JSON extraction ────────────────────────────────────────────────
  function extractJSON(text: string): SiteRecord["generatedContent"] | null {
    let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
    const firstBrace = cleaned.indexOf("{");
    const lastBrace  = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) return null;
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    try { return JSON.parse(cleaned); } catch { return null; }
  }

  function buildFallback(): SiteRecord["generatedContent"] {
    const serviceItems = cleanServices.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
    if (!serviceItems.length) serviceItems.push(cleanIndustry);
    return {
      hero_headline:    `${cleanIndustry} Services in ${cleanLocation}`,
      hero_subheadline: `${cleanBusinessName} provides professional ${cleanIndustry.toLowerCase()} services in ${cleanLocation}. We deliver quality results you can count on.`,
      about_text:       cleanDescription || `${cleanBusinessName} has been proudly serving ${cleanLocation} with top-quality ${cleanIndustry.toLowerCase()} services. Our team is committed to delivering outstanding results and exceptional customer service on every job.`,
      services_list:    serviceItems,
      cta_text:         "Get a Free Quote",
      tagline:          cleanTagline || `Your trusted ${cleanIndustry.toLowerCase()} experts.`,
      seo_title:        `${cleanBusinessName} — ${cleanIndustry} in ${cleanLocation}`,
      seo_description:  `${cleanBusinessName} offers professional ${cleanIndustry.toLowerCase()} services in ${cleanLocation}. Contact us today for a free estimate.`,
    };
  }

  let generatedContent = extractJSON(rawText);
  if (!generatedContent) {
    console.error("[sites/generate] JSON parse failed. Raw output:", rawText.slice(0, 500));
    generatedContent = buildFallback();
  }

  // ── Determine siteId ─────────────────────────────────────────────────────
  let siteId: string;
  if (typeof editSiteId === "string" && editSiteId.trim()) {
    const existing = await import("@/lib/kv").then((m) => m.getSite(editSiteId));
    if (existing && existing.userId !== session.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    siteId = editSiteId.trim();
  } else {
    siteId = `${slugify(cleanBusinessName)}-${randomSuffix()}`;
  }

  // ── Save to Redis ─────────────────────────────────────────────────────────
  const siteData: SiteRecord = {
    siteId,
    userId:           session.email,
    businessName:     cleanBusinessName,
    industry:         cleanIndustry,
    location:         cleanLocation,
    services:         cleanServices,
    tone:             cleanTone,
    primaryColor:     primaryColor as string,
    contactEmail:     cleanContactEmail,
    contactPhone:     cleanContactPhone,
    tagline:          cleanTagline,
    description:      cleanDescription,
    yearsInBusiness:  cleanYearsInBusiness,
    facebookUrl:      cleanFacebookUrl,
    instagramUrl:     cleanInstagramUrl,
    googleBusinessUrl: cleanGoogleUrl,
    businessHours:    cleanBusinessHours,
    serviceArea:      cleanServiceArea,
    fontStyle:        cleanFontStyle,
    heroStyle:        cleanHeroStyle,
    layoutStyle:      cleanLayoutStyle,
    generatedContent,
    createdAt: new Date().toISOString(),
  };

  await saveSite(siteId, siteData);

  return NextResponse.json({ siteId, url: `/sites/${siteId}` });
}
