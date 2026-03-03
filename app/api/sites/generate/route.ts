import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { saveSite, getUserSites, type SiteRecord } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";
import type { StructuredSiteContent } from "@/lib/site-theme";

const SITE_LIMITS: Record<string, number> = {
  starter: 1,
  growth:  3,
  pro:     Infinity,
};

// ── Validation sets ───────────────────────────────────────────────────────────
const VALID_INDUSTRIES = new Set([
  "Landscaping", "Plumbing", "Electrician", "Beauty & Wellness",
  "Restaurant", "Consulting", "Real Estate", "Fitness",
  "Auto & Mechanic", "Cleaning", "Other",
]);
const VALID_TONES         = new Set(["Professional", "Friendly", "Bold", "Luxury", "Minimal"]);
const VALID_COLORS        = new Set([
  "Emerald Green", "Electric Blue", "Sunset Orange", "Royal Purple", "Fire Red",
  "Midnight Black", "Golden Yellow", "Hot Pink", "Cyan", "Slate Gray",
  "Rose Gold", "Deep Navy",
]);
const VALID_FONT_STYLES   = new Set(["Modern", "Classic & Elegant", "Bold & Strong", "Clean & Minimal"]);
const VALID_HERO_STYLES   = new Set(["Photo Background", "Gradient Background", "Solid Color"]);
const VALID_LAYOUT_STYLES = new Set(["Standard", "Centered", "Full Width"]);
const VALID_YEARS         = new Set([
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

/** Strip markdown fences and extract the outermost JSON object. */
function extractJSON(text: string): StructuredSiteContent | null {
  let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
  const first = cleaned.indexOf("{");
  const last  = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1) return null;
  cleaned = cleaned.slice(first, last + 1);
  try {
    const parsed = JSON.parse(cleaned) as StructuredSiteContent;
    // Minimal shape check — must have the `hero` object
    if (typeof parsed.hero !== "object" || !parsed.hero) return null;
    return parsed;
  } catch {
    return null;
  }
}

function buildFallback(
  name: string, industry: string, location: string,
  services: string, tagline: string, description: string,
): StructuredSiteContent {
  const serviceItems = services.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
  if (!serviceItems.length) serviceItems.push(industry);

  return {
    hero: {
      headline:    `${industry} Services in ${location}`,
      subheadline: `${name} provides professional ${industry.toLowerCase()} services in ${location}. We deliver quality results you can count on.`,
      ctaText:     "Get a Free Quote",
      badge:       location,
    },
    services: serviceItems.map((s) => ({
      name:        s,
      description: `Professional ${s.toLowerCase()} services delivered with care and expertise.`,
      icon:        "✓",
    })),
    about: {
      title: tagline || `Your trusted ${industry.toLowerCase()} experts.`,
      body:  description || `${name} has been proudly serving ${location} with top-quality ${industry.toLowerCase()} services. Our team is committed to delivering outstanding results and exceptional customer service on every job.`,
      stats: [
        { label: "Happy Clients", value: "100+" },
        { label: "Projects Done",  value: "200+" },
        { label: "Years Active",   value: "5+"   },
      ],
    },
    testimonials: [
      {
        name:   "Sarah M.",
        role:   "Homeowner",
        quote:  `${name} did an amazing job. Professional, on time, and the results exceeded our expectations.`,
        rating: 5,
      },
      {
        name:   "James T.",
        role:   "Property Manager",
        quote:  `Highly recommend ${name}. They are reliable, affordable, and the quality of work is excellent.`,
        rating: 5,
      },
      {
        name:   "Linda K.",
        role:   "Local Business Owner",
        quote:  `We've been using ${name} for years. They always deliver great results and treat you like family.`,
        rating: 5,
      },
    ],
    cta: {
      headline:   `Ready to Get Started?`,
      subtext:    `Contact ${name} today for a free estimate. Serving ${location} and surrounding areas.`,
      buttonText: "Get a Free Quote",
    },
    seo: {
      title:       `${name} — ${industry} in ${location}`,
      description: `${name} offers professional ${industry.toLowerCase()} services in ${location}. Contact us today for a free estimate.`,
    },
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Auth
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Subscription
  const plan = await getActivePlan(session.email);
  if (!plan) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }

  // Rate limit: 10 generations/hr per user
  const rl = await rateLimit(`generate:${session.email}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${rl.resetInSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  // Parse body early (needed for regeneration check)
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  // Plan site limit (skip when regenerating)
  const isRegenerate = typeof body.editSiteId === "string" && body.editSiteId.trim() !== "";
  if (!isRegenerate) {
    const limit = SITE_LIMITS[plan] ?? 1;
    if (isFinite(limit)) {
      const existing = await getUserSites(session.email);
      if (existing.length >= limit) {
        const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
        return NextResponse.json(
          {
            error: "plan_limit",
            message: `Your ${planName} plan allows up to ${limit} site${limit === 1 ? "" : "s"}. Upgrade to create more.`,
          },
          { status: 403 }
        );
      }
    }
  }

  // Destructure
  const {
    businessName, industry, location, services, tone, primaryColor,
    contactEmail, contactPhone, editSiteId,
    tagline, description, yearsInBusiness,
    facebookUrl, instagramUrl, googleBusinessUrl,
    businessHours, serviceArea,
    fontStyle, heroStyle, layoutStyle,
  } = body;

  // Required field checks
  for (const [key, val] of Object.entries({ businessName, industry, location, services, tone, primaryColor })) {
    if (typeof val !== "string" || val.trim() === "") {
      return NextResponse.json({ error: `Missing or invalid field: ${key}` }, { status: 400 });
    }
  }

  // Enum validation
  if (!VALID_INDUSTRIES.has(industry as string))
    return NextResponse.json({ error: "Invalid industry" }, { status: 400 });
  if (!VALID_TONES.has(tone as string))
    return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
  if (!VALID_COLORS.has(primaryColor as string))
    return NextResponse.json({ error: "Invalid color" }, { status: 400 });

  const cleanFontStyle   = typeof fontStyle   === "string" && VALID_FONT_STYLES.has(fontStyle)     ? fontStyle   : "Modern";
  const cleanHeroStyle   = typeof heroStyle   === "string" && VALID_HERO_STYLES.has(heroStyle)     ? heroStyle   : "Photo Background";
  const cleanLayoutStyle = typeof layoutStyle === "string" && VALID_LAYOUT_STYLES.has(layoutStyle) ? layoutStyle : "Standard";
  const cleanYears       = typeof yearsInBusiness === "string" && VALID_YEARS.has(yearsInBusiness) ? yearsInBusiness : "1-3 years";

  // Length checks
  if ((businessName as string).length > 100)
    return NextResponse.json({ error: "Business name too long" }, { status: 400 });
  if ((location as string).length > 100)
    return NextResponse.json({ error: "Location too long" }, { status: 400 });
  if ((services as string).length > 500)
    return NextResponse.json({ error: "Services too long" }, { status: 400 });

  // Sanitize
  const cleanName    = sanitize(businessName as string);
  const cleanLoc     = sanitize(location as string);
  const cleanSvc     = sanitize(services as string);
  const cleanInd     = sanitize(industry as string);
  const cleanTone    = sanitize(tone as string);
  const cleanEmail   = optStr(contactEmail, 200);
  const cleanPhone   = optStr(contactPhone, 30);
  const cleanTag     = optStr(tagline, 150);
  const cleanDesc    = optStr(description, 600);
  const cleanArea    = optStr(serviceArea, 200);
  const cleanFB      = optStr(facebookUrl, 300);
  const cleanIG      = optStr(instagramUrl, 300);
  const cleanGoogle  = optStr(googleBusinessUrl, 300);
  const cleanHours   = optStr(businessHours, 200);

  // Claude API
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  const context = [
    cleanTag    && `Tagline hint: ${cleanTag}`,
    cleanDesc   && `About the business: ${cleanDesc}`,
    cleanYears  && `Years in business: ${cleanYears}`,
    cleanArea   && `Service area: ${cleanArea}`,
  ].filter(Boolean).join("\n");

  const userPrompt = `Generate complete website content for this local business:

Business: ${cleanName}
Industry: ${cleanInd}
Location: ${cleanLoc}
Services: ${cleanSvc}
Tone: ${cleanTone}
${context ? `\nContext:\n${context}` : ""}

IMPORTANT: Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

Required JSON structure:
{
  "hero": {
    "headline": "punchy max-8-word headline",
    "subheadline": "1-2 sentences about what they do and who they serve",
    "ctaText": "button text max 4 words",
    "badge": "location or tagline for the hero badge"
  },
  "services": [
    { "name": "Service Name", "description": "1-sentence description", "icon": "relevant emoji" },
    { "name": "Service Name", "description": "1-sentence description", "icon": "relevant emoji" },
    { "name": "Service Name", "description": "1-sentence description", "icon": "relevant emoji" },
    { "name": "Service Name", "description": "1-sentence description", "icon": "relevant emoji" },
    { "name": "Service Name", "description": "1-sentence description", "icon": "relevant emoji" }
  ],
  "about": {
    "title": "short tagline-style title for the about section",
    "body": "2-3 sentences about the business history and values",
    "stats": [
      { "label": "stat label", "value": "number or short text" },
      { "label": "stat label", "value": "number or short text" },
      { "label": "stat label", "value": "number or short text" }
    ]
  },
  "testimonials": [
    { "name": "Customer Name", "role": "Homeowner", "quote": "2-sentence authentic review", "rating": 5 },
    { "name": "Customer Name", "role": "Business Owner", "quote": "2-sentence authentic review", "rating": 5 },
    { "name": "Customer Name", "role": "Property Manager", "quote": "2-sentence authentic review", "rating": 4 }
  ],
  "cta": {
    "headline": "compelling CTA headline",
    "subtext": "1 sentence reinforcing the call to action",
    "buttonText": "button text max 5 words"
  },
  "seo": {
    "title": "SEO page title",
    "description": "SEO meta description 150-160 characters"
  },
  "theme": {
    "primaryColor": "${primaryColor}",
    "fontStyle": "${cleanFontStyle}",
    "heroStyle": "${cleanHeroStyle}",
    "layoutStyle": "${cleanLayoutStyle}"
  }
}`;

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-5",
      max_tokens: 2048,
      system:
        "You are a professional website copywriter for local businesses. Return ONLY a raw JSON object — no markdown, no backticks, no code fences, no explanation, nothing before or after the JSON.",
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const errBody = await anthropicRes.text().catch(() => "unknown");
    console.error("[sites/generate] Anthropic error:", anthropicRes.status, errBody);
    return NextResponse.json({ error: "Content generation failed" }, { status: 500 });
  }

  const anthropicData = await anthropicRes.json();
  const rawText: string = anthropicData.content?.[0]?.text ?? "";

  let generatedContent: StructuredSiteContent = extractJSON(rawText) ??
    (() => {
      console.error("[sites/generate] JSON parse failed. Raw output:", rawText.slice(0, 500));
      return buildFallback(cleanName, cleanInd, cleanLoc, cleanSvc, cleanTag, cleanDesc);
    })();

  // Determine siteId
  let siteId: string;
  if (typeof editSiteId === "string" && editSiteId.trim()) {
    const existingSite = await import("@/lib/kv").then((m) => m.getSite(editSiteId));
    if (existingSite && existingSite.userId !== session.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    siteId = editSiteId.trim();
  } else {
    siteId = `${slugify(cleanName)}-${randomSuffix()}`;
  }

  const siteData: SiteRecord = {
    siteId,
    userId:            session.email,
    businessName:      cleanName,
    industry:          cleanInd,
    location:          cleanLoc,
    services:          cleanSvc,
    tone:              cleanTone,
    primaryColor:      primaryColor as string,
    contactEmail:      cleanEmail,
    contactPhone:      cleanPhone,
    tagline:           cleanTag,
    description:       cleanDesc,
    yearsInBusiness:   cleanYears,
    facebookUrl:       cleanFB,
    instagramUrl:      cleanIG,
    googleBusinessUrl: cleanGoogle,
    businessHours:     cleanHours,
    serviceArea:       cleanArea,
    fontStyle:         cleanFontStyle,
    heroStyle:         cleanHeroStyle,
    layoutStyle:       cleanLayoutStyle,
    generatedContent,
    createdAt: new Date().toISOString(),
  };

  await saveSite(siteId, siteData);
  return NextResponse.json({ siteId, url: `/sites/${siteId}` });
}
