import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { kv } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";

// ── Public Lead shape (also consumed by the client component) ─────────────────
export type Lead = {
  businessName:    string;
  industry:        string;
  location:        string;        // real formatted address from Google
  phone:           string;        // real phone number or "Not listed"
  website:         string | null; // real URL or null
  hasWebsite:      boolean;
  rating:          number;        // Google rating (0 = no rating)
  reviewCount:     number;
  score:           number;        // 1-10 from Claude
  scoreReason:     string;
  outreachMessage: string;
  googleMapsUrl:   string;
};

// ── Internal types ────────────────────────────────────────────────────────────
type TextSearchPlace = {
  place_id:            string;
  name:                string;
  formatted_address:   string;
  rating?:             number;
  user_ratings_total?: number;
  business_status?:    string;
};

type DetailsResult = {
  name?:                   string;
  formatted_phone_number?: string;
  website?:                string;
  formatted_address?:      string;
  rating?:                 number;
  user_ratings_total?:     number;
  business_status?:        string;
};

type InternalBusiness = {
  placeId:     string;
  name:        string;
  address:     string;
  phone:       string;
  website:     string | null;
  hasWebsite:  boolean;
  rating:      number;
  reviewCount: number;
};

type ClaudeScore = {
  score:           number;
  scoreReason:     string;
  outreachMessage: string;
};

// ── Validation sets ───────────────────────────────────────────────────────────
const VALID_INDUSTRIES = new Set([
  "Landscaping", "Plumbing", "Electrician", "Beauty & Wellness",
  "Restaurant", "Consulting", "Real Estate", "Fitness",
  "Auto & Mechanic", "Cleaning", "Other",
]);
const VALID_SIZES   = new Set(["Any", "Solo/1-person", "Small 2-10", "Medium 11-50"]);
const VALID_WEBSITE = new Set(["Any", "No website only", "Has website"]);
const VALID_URGENCY = new Set(["Show all", "High potential only"]);

// Maps our industry labels to richer Google Places search terms
const INDUSTRY_KEYWORDS: Record<string, string> = {
  "Landscaping":       "landscaping lawn care",
  "Plumbing":          "plumber plumbing service",
  "Electrician":       "electrician electrical contractor",
  "Beauty & Wellness": "beauty salon spa",
  "Restaurant":        "restaurant",
  "Consulting":        "business consulting",
  "Real Estate":       "real estate agent",
  "Fitness":           "gym fitness center",
  "Auto & Mechanic":   "auto repair mechanic",
  "Cleaning":          "cleaning service",
  "Other":             "local business",
};

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim();
}

// ── Google Places helpers (server-only — API key never leaves here) ───────────
async function googleTextSearch(
  keyword: string,
  location: string,
  apiKey: string,
): Promise<TextSearchPlace[] | null> {
  const query = encodeURIComponent(`${keyword} in ${location}`);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as { status: string; results?: TextSearchPlace[]; error_message?: string };
    if (data.status === "ZERO_RESULTS") return [];
    if (data.status !== "OK") {
      console.error("[leads] Places Text Search error:", data.status, data.error_message ?? "");
      return null;
    }
    return data.results ?? [];
  } catch (err) {
    console.error("[leads] Places Text Search fetch error:", err);
    return null;
  }
}

async function googlePlaceDetails(placeId: string, apiKey: string): Promise<DetailsResult | null> {
  const fields = "name,formatted_phone_number,website,formatted_address,rating,user_ratings_total,business_status";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${fields}&key=${apiKey}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json() as { status: string; result?: DetailsResult };
    if (data.status !== "OK") return null;
    return data.result ?? null;
  } catch {
    return null;
  }
}

// ── Claude batch scoring (one API call for all businesses) ────────────────────
function fallbackScore(b: InternalBusiness, industry: string): ClaudeScore {
  const score = !b.hasWebsite ? 8 : b.reviewCount < 20 ? 6 : b.reviewCount < 100 ? 5 : 4;
  return {
    score,
    scoreReason: b.hasWebsite
      ? `${b.name} has an online presence with ${b.reviewCount} reviews but could benefit from a modern, AI-powered website to convert more visitors into customers.`
      : `${b.name} has no website yet, making them a high-priority prospect for BaileySystemsAI.`,
    outreachMessage: `Hi, I came across ${b.name} while researching ${industry.toLowerCase()} businesses in the area. With BaileySystemsAI, you can launch a professional website in minutes and start attracting more customers online. I'd love to show you how — can we connect this week?`,
  };
}

async function batchScoreLeads(
  businesses: InternalBusiness[],
  industry: string,
  apiKey: string,
): Promise<ClaudeScore[]> {
  const businessList = businesses
    .map((b, i) =>
      `${i + 1}. ${b.name}\n   Address: ${b.address}\n   Has Website: ${b.hasWebsite ? "Yes" : "No"}\n   Google Rating: ${b.rating > 0 ? `${b.rating}/5 (${b.reviewCount} reviews)` : "No rating yet"}`
    )
    .join("\n\n");

  const prompt = `Score these ${businesses.length} local ${industry} businesses as potential clients for BaileySystemsAI (an AI website builder for local businesses).

Scoring guide (higher = better prospect):
- No website at all → score 8-10
- Has website, fewer than 20 reviews → score 6-8
- Has website, 20-100 reviews → score 5-6
- Strong online presence (100+ reviews + website) → score 3-5

Businesses:
${businessList}

For EACH business write a personalized 2-3 sentence outreach message that:
1. Mentions their REAL business name
2. References their specific industry (${industry})
3. Explains how BaileySystemsAI can help them get more customers online

Return ONLY a JSON array with exactly ${businesses.length} objects in the same order:
[{"score": 8, "scoreReason": "1-2 sentence reason", "outreachMessage": "personalized 2-3 sentences"}, ...]`;

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
        max_tokens: 2048,
        system:
          "You are a B2B sales expert. Score leads and write personalized outreach. Return ONLY a raw JSON array — no markdown, no backticks, no explanation.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return businesses.map((b) => fallbackScore(b, industry));

    const data = await res.json();
    const rawText: string = data.content?.[0]?.text ?? "";

    let cleaned = rawText.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
    const first = cleaned.indexOf("[");
    const last  = cleaned.lastIndexOf("]");
    if (first === -1 || last === -1) return businesses.map((b) => fallbackScore(b, industry));
    cleaned = cleaned.slice(first, last + 1);

    const parsed = JSON.parse(cleaned) as ClaudeScore[];
    if (!Array.isArray(parsed) || parsed.length !== businesses.length) {
      return businesses.map((b) => fallbackScore(b, industry));
    }

    return parsed.map((s) => ({
      score:           Math.max(1, Math.min(10, Number(s.score) || 5)),
      scoreReason:     String(s.scoreReason  || ""),
      outreachMessage: String(s.outreachMessage || ""),
    }));
  } catch {
    return businesses.map((b) => fallbackScore(b, industry));
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Auth
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Plan check — Growth or Pro only
  const plan = await getActivePlan(session.email);
  if (!plan) return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  if (plan === "starter") {
    return NextResponse.json(
      { error: "plan_required", message: "Lead Hunter requires a Growth or Pro plan." },
      { status: 403 }
    );
  }

  // Rate limit: 10 searches per hour
  const rl = await rateLimit(`leads:${session.email}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${rl.resetInSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  // Parse & validate body
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
  // urgency is optional — kept for backward compat but unused with real data
  void (typeof urgency === "string" && VALID_URGENCY.has(urgency) ? urgency : "Show all");

  const cleanLocation = sanitize(location).slice(0, 100);

  // Verify required API keys are present (keys never leave this file)
  const googleApiKey    = process.env.GOOGLE_PLACES_API_KEY;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (!googleApiKey) {
    console.error("[leads] GOOGLE_PLACES_API_KEY not configured");
    return NextResponse.json(
      { error: "Lead search unavailable. Please try again later." },
      { status: 500 }
    );
  }
  if (!anthropicApiKey) {
    console.error("[leads] ANTHROPIC_API_KEY not configured");
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  // ── Step 1: Google Places Text Search ─────────────────────────────────────
  const keyword       = INDUSTRY_KEYWORDS[industry] ?? industry.toLowerCase();
  const searchResults = await googleTextSearch(keyword, cleanLocation, googleApiKey);

  if (searchResults === null) {
    return NextResponse.json(
      { error: "Lead search unavailable. Please try again later." },
      { status: 500 }
    );
  }
  if (searchResults.length === 0) {
    return NextResponse.json({
      leads: [],
      message: `No businesses found in that area. Try a different location or industry.`,
    });
  }

  // ── Step 2: Fetch details for top candidates in parallel ──────────────────
  const candidates     = searchResults.slice(0, 15);
  const detailsResults = await Promise.allSettled(
    candidates.map((r) => googlePlaceDetails(r.place_id, googleApiKey))
  );

  // ── Step 3: Build internal business objects ───────────────────────────────
  const businesses: InternalBusiness[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const textResult = candidates[i];
    const dr         = detailsResults[i];
    const detail     = dr.status === "fulfilled" ? dr.value : null;

    // Skip permanently closed businesses
    const status = detail?.business_status ?? textResult.business_status;
    if (status && status !== "OPERATIONAL") continue;

    businesses.push({
      placeId:     textResult.place_id,
      name:        detail?.name        ?? textResult.name,
      address:     detail?.formatted_address ?? textResult.formatted_address,
      phone:       detail?.formatted_phone_number ?? "Not listed",
      website:     detail?.website ?? null,
      hasWebsite:  !!detail?.website,
      rating:      Math.round((detail?.rating ?? textResult.rating ?? 0) * 10) / 10,
      reviewCount: detail?.user_ratings_total ?? textResult.user_ratings_total ?? 0,
    });
  }

  // ── Step 4: Apply hasWebsite filter ───────────────────────────────────────
  const filtered = businesses
    .filter((b) => {
      if (hasWebsite === "No website only") return !b.hasWebsite;
      if (hasWebsite === "Has website")     return  b.hasWebsite;
      return true;
    })
    .slice(0, 8);

  if (filtered.length === 0) {
    return NextResponse.json({
      leads: [],
      message: `No businesses matched that filter. Try changing "Has Website" to Any.`,
    });
  }

  // ── Step 5: Batch score all businesses with Claude (one API call) ─────────
  const scores = await batchScoreLeads(filtered, industry, anthropicApiKey);

  // ── Step 6: Assemble final leads ──────────────────────────────────────────
  const leads: Lead[] = filtered.map((b, i) => ({
    businessName:    b.name,
    industry,
    location:        b.address,
    phone:           b.phone,
    website:         b.website,
    hasWebsite:      b.hasWebsite,
    rating:          b.rating,
    reviewCount:     b.reviewCount,
    score:           scores[i].score,
    scoreReason:     scores[i].scoreReason,
    outreachMessage: scores[i].outreachMessage,
    googleMapsUrl:   `https://maps.google.com/?q=${encodeURIComponent(`${b.name} ${b.address}`)}`,
  }));

  // Sort best prospects first
  leads.sort((a, b) => b.score - a.score);

  // ── Step 7: Cache results in Redis (24-hour TTL) ──────────────────────────
  const key = `leads:${session.email}:${Date.now()}`;
  await kv.set(key, { leads, searchedAt: new Date().toISOString() }, { ex: 86400 });

  return NextResponse.json({ leads });
}
