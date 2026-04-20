import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { saveSite, getUserSites, kv, type SiteRecord } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";
import { checkAndIncrementUsage, checkAndIncrementRegen } from "@/lib/usage";
import type { StructuredSiteContent } from "@/lib/site-theme";

// Site generation calls Claude + Grok back-to-back and routinely runs
// 30–55 s. Without an explicit maxDuration, Vercel kills the function at
// the default (10s hobby / 15s pro), which drops the client connection
// even though the server might still be writing the site to Redis. That
// surfaces in the dashboard as a `TypeError: Failed to fetch` and was the
// root cause of the "failed fetch on 200 response" bug.
export const maxDuration = 60;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
const VALID_TONES         = new Set([
  "Professional", "Friendly", "Bold", "Luxury", "Minimal",
  "Cyberpunk", "Retro", "Magazine", "Cinematic",
]);
const VALID_COLORS        = new Set([
  "Emerald Green", "Electric Blue", "Sunset Orange", "Royal Purple", "Fire Red",
  "Midnight Black", "Golden Yellow", "Hot Pink", "Cyan", "Slate Gray",
  "Rose Gold", "Deep Navy",
  "Neon Blue", "Neon Green", "Neon Pink", "Neon Yellow", "Neon Purple",
  "Burgundy", "Coral", "Champagne",
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

/** Return a subdomain slug that isn't already registered in Redis. */
async function getUniqueSlug(baseSlug: string): Promise<string> {
  const existing = await kv.get(`slug:${baseSlug}`);
  if (!existing) return baseSlug;

  for (let i = 2; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`;
    const taken = await kv.get(`slug:${candidate}`);
    if (!taken) return candidate;
  }

  return `${baseSlug}-${randomSuffix()}`;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Outer guard: under no circumstances should this route return a
  // non-JSON body. Vercel's default error envelope is a plain-text
  // string ("A server error has occurred...") and the build dashboard
  // crashes when it tries to call res.json() on it. Catching everything
  // here and returning a real JSON object keeps the client recoverable.
  try {
  // Auth
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin bypass — unlimited site generation
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "lilianajs27@gmail.com").toLowerCase();
  const isAdmin = session.email.toLowerCase() === ADMIN_EMAIL;
  if (isAdmin) {
    console.log("[sites/generate] admin bypass for", session.email);
  }

  // Subscription (skipped for admin)
  const plan = await getActivePlan(session.email);
  if (!isAdmin && !plan) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }

  // Rate limit: 10 generations/hr per user (skipped for admin)
  if (!isAdmin) {
    const rl = await rateLimit(`generate:${session.email}`, 10, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Rate limit reached. Try again in ${rl.resetInSeconds}s.` },
        { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
      );
    }
  }

  // Parse body early (needed for regeneration check)
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  // Plan site limit (skip when regenerating or admin)
  const isRegenerate = typeof body.editSiteId === "string" && body.editSiteId.trim() !== "";
  if (!isAdmin && !isRegenerate) {
    const limit = SITE_LIMITS[plan ?? "starter"] ?? 1;
    if (isFinite(limit)) {
      const existing = await getUserSites(session.email);
      if (existing.length >= limit) {
        const planName = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Trial";
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
    enableChat, websiteVibe,
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
  const cleanVibe    = optStr(websiteVibe, 300);

  // Monthly run limit — checked AFTER validation, BEFORE calling Claude (skipped for admin)
  if (!isAdmin) {
    const usageCheck = await checkAndIncrementUsage(session.email, plan ?? "starter");
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error:   "run_limit_reached",
          message: `You've used all ${usageCheck.limit} runs for this month. Upgrade your plan for more.`,
          used:    usageCheck.used,
          limit:   usageCheck.limit,
        },
        { status: 429 }
      );
    }
  }

  // Generate full HTML site with Grok images + Anthropic layout
  let generatedHTML: string;
  try {
    const { generateSiteHTML } = await import("@/lib/generate-site-html");
    generatedHTML = await generateSiteHTML({
      businessName:  cleanName,
      industry:      cleanInd,
      location:      cleanLoc,
      services:      cleanSvc,
      tone:          cleanTone,
      primaryColor:  primaryColor as string,
      fontStyle:     cleanFontStyle,
      heroStyle:     cleanHeroStyle,
      layoutStyle:   cleanLayoutStyle,
      tagline:       cleanTag,
      description:   cleanDesc,
      contactEmail:  cleanEmail,
      contactPhone:  cleanPhone,
      businessHours: cleanHours,
      facebookUrl:   cleanFB,
      instagramUrl:  cleanIG,
      enableChat:    enableChat === true,
      websiteVibe:   cleanVibe,
    });
  } catch (genErr) {
    console.error("[generate] HTML generation failed:", genErr);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }

  // Stub structured content for backward-compatible SiteRecord shape
  const generatedContent: StructuredSiteContent = buildFallback(
    cleanName, cleanInd, cleanLoc, cleanSvc, cleanTag, cleanDesc
  );

  // Determine siteId and subdomainSlug
  const baseSlug = slugify(cleanName).slice(0, 60); // DNS label max 63 chars

  let siteId: string;
  let subdomainSlug: string = baseSlug;

  if (typeof editSiteId === "string" && editSiteId.trim()) {
    const existingSite = await import("@/lib/kv").then((m) => m.getSite(editSiteId));
    if (existingSite && existingSite.userId?.toLowerCase() !== session.email.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Preserve the existing slug on regeneration, or derive from current name
    subdomainSlug = existingSite?.subdomainSlug ?? baseSlug;
    // Regeneration limit (skipped for admin)
    if (!isAdmin) {
      const regenCheck = await checkAndIncrementRegen(session.email, editSiteId.trim(), plan ?? "starter");
      if (!regenCheck.allowed) {
        return NextResponse.json(
          {
            error:   "regen_limit_reached",
            message: `You've reached the maximum of ${regenCheck.max} regenerations for this site.`,
          },
          { status: 429 }
        );
      }
    }
    siteId = editSiteId.trim();
  } else {
    subdomainSlug = await getUniqueSlug(baseSlug);
    siteId        = `${subdomainSlug}-${randomSuffix()}`;
  }

  const siteData: SiteRecord = {
    siteId,
    userId:            session.email.toLowerCase(),
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
    generatedHTML,
    createdAt:         new Date().toISOString(),
    subdomainSlug,
    enableChat:        enableChat === true,
  };

  console.log(`[sites/generate] siteId="${siteId}" enableChat=${siteData.enableChat}`);
  console.log(
    "[generate] saving generatedHTML:",
    generatedHTML
      ? `${generatedHTML.length} chars`
      : "MISSING"
  );

  // Save site record
  await saveSite(siteId, siteData);

  // Save reverse-lookup key: slug:{subdomainSlug} → siteId
  // This allows the middleware subdomain rewrite to resolve the real siteId.
  await kv.set(`slug:${subdomainSlug}`, siteId);
  console.log(`[sites/generate] slug key saved: "slug:${subdomainSlug}" → "${siteId}"`);

  return NextResponse.json({
    siteId,
    url:           `/sites/${siteId}`,
    subdomainSlug,
    subdomainUrl:  `https://${subdomainSlug}.baileyagents.com`,
  });
  } catch (err) {
    console.error("[sites/generate] unhandled error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Site generation failed. Please try again.";
    return NextResponse.json(
      { error: "internal_error", message },
      { status: 500 }
    );
  }
}
