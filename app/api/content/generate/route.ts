import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan } from "@/lib/auth";
import { kv } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";

// ── Public types (consumed by the client component) ───────────────────────────
export type Post = {
  id:              number;
  platform:        string;
  content:         string;
  hashtags:        string[];
  bestTimeToPost:  string;
  contentType:     string;
};

export type BlogPost = {
  title:       string;
  intro:       string;
  sections:    Array<{ heading: string; body: string }>;
  conclusion:  string;
  seoKeywords: string[];
};

export type CalendarEntry = {
  day:         string;
  postId:      number;
  platform:    string;
  contentType: string;
};

export type ContentPackage = {
  posts:           Post[];
  blogPost:        BlogPost;
  contentCalendar: CalendarEntry[];
};

// ── Validation sets ───────────────────────────────────────────────────────────
const VALID_PLATFORMS = new Set([
  "Instagram", "Facebook", "TikTok", "LinkedIn", "All Platforms",
]);
const VALID_TONES = new Set([
  "Professional", "Friendly", "Funny", "Inspirational", "Bold",
]);
const VALID_GOALS = new Set([
  "Get more customers",
  "Build brand awareness",
  "Promote a special offer",
  "Share tips and education",
  "Show behind the scenes",
]);

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim();
}

// ── JSON extractor ────────────────────────────────────────────────────────────
function extractJSON(text: string): ContentPackage | null {
  let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
  const first = cleaned.indexOf("{");
  const last  = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1) return null;
  cleaned = cleaned.slice(first, last + 1);
  try {
    const parsed = JSON.parse(cleaned) as ContentPackage;
    if (!Array.isArray(parsed.posts) || typeof parsed.blogPost !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

// ── Fallback content package ──────────────────────────────────────────────────
function buildFallback(
  businessType: string,
  platform: string,
  tone: string,
): ContentPackage {
  const platforms = platform === "All Platforms"
    ? ["Instagram", "Facebook", "TikTok", "LinkedIn", "Instagram", "Facebook", "Instagram"]
    : Array(7).fill(platform);

  return {
    posts: Array.from({ length: 7 }, (_, i) => ({
      id:             i + 1,
      platform:       platforms[i],
      content:        `✨ Check out our latest work at ${businessType}!\n\nWe're passionate about delivering the best results for our clients. Whether you're looking for quality service or expert advice — we've got you covered.\n\nReach out today to get started! 💪`,
      hashtags:       ["#localbusiness", `#${businessType.toLowerCase().replace(/\s+/g, "")}`, "#smallbusiness", "#community", "#quality", "#professional", "#local", "#services", "#customers", "#growth"],
      bestTimeToPost: ["Monday 9am", "Tuesday 7pm", "Wednesday 12pm", "Thursday 6pm", "Friday 10am", "Saturday 11am", "Sunday 3pm"][i],
      contentType:    ["Tip", "Promo", "Story", "Behind the scenes", "Testimonial", "Tip", "Promo"][i],
    })),
    blogPost: {
      title:      `Why ${businessType} Businesses Are Thriving in 2025`,
      intro:      `The ${businessType.toLowerCase()} industry is evolving fast. Learn what separates the top performers from the rest, and how you can position your business for growth.`,
      sections:   [
        { heading: "The Changing Landscape", body: `${businessType} businesses face new opportunities and challenges. Staying ahead means embracing the latest tools and strategies.` },
        { heading: "What Customers Want Today", body: `Modern customers expect transparency, speed, and quality. Delivering on these expectations builds loyalty and drives referrals.` },
        { heading: "How to Stand Out", body: `Focus on your unique strengths, invest in your online presence, and consistently show up for your community.` },
      ],
      conclusion:  `The path forward for ${businessType.toLowerCase()} businesses is clear: invest in your brand, serve your customers exceptionally well, and leverage modern tools to grow faster.`,
      seoKeywords: [businessType.toLowerCase(), "local business", "small business tips", "business growth", "professional services"],
    },
    contentCalendar: Array.from({ length: 7 }, (_, i) => ({
      day:         ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i],
      postId:      i + 1,
      platform:    platforms[i],
      contentType: ["Tip", "Promo", "Story", "Behind the scenes", "Testimonial", "Tip", "Promo"][i],
    })),
  };
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
      { error: "plan_required", message: "Content Machine requires a Growth or Pro plan." },
      { status: 403 }
    );
  }

  // Rate limit: 10 per hour per user
  const rl = await rateLimit(`content:${session.email}`, 10, 3600);
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

  const { businessType, targetAudience, platform, tone, contentGoal, specialOffer } = body;

  if (typeof businessType !== "string" || !businessType.trim())
    return NextResponse.json({ error: "Business type is required" }, { status: 400 });
  if (typeof targetAudience !== "string" || !targetAudience.trim())
    return NextResponse.json({ error: "Target audience is required" }, { status: 400 });
  if (typeof platform !== "string" || !VALID_PLATFORMS.has(platform))
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  if (typeof tone !== "string" || !VALID_TONES.has(tone))
    return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
  if (typeof contentGoal !== "string" || !VALID_GOALS.has(contentGoal))
    return NextResponse.json({ error: "Invalid content goal" }, { status: 400 });

  const cleanBusiness  = sanitize(businessType  as string).slice(0, 100);
  const cleanAudience  = sanitize(targetAudience as string).slice(0, 200);
  const cleanOffer     = typeof specialOffer === "string" ? sanitize(specialOffer).slice(0, 300) : "none";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI service not configured" }, { status: 500 });

  // ── Build the Claude prompt ───────────────────────────────────────────────
  const platformInstruction = platform === "All Platforms"
    ? "Create posts for a mix of Instagram (3), Facebook (2), LinkedIn (1), and TikTok (1). Set the platform field for each post."
    : `Create all 7 posts for ${platform}. Set platform: "${platform}" for every post.`;

  const userPrompt = `Create a complete social media content package for:

Business Type: ${cleanBusiness}
Target Audience: ${cleanAudience}
Platform: ${platform}
Tone: ${tone}
Goal: ${contentGoal}
Special Topic/Offer: ${cleanOffer}

${platformInstruction}

IMPORTANT: Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just the JSON.

Required JSON structure:
{
  "posts": [
    {
      "id": 1,
      "platform": "Instagram",
      "content": "Full post text ready to copy. Use line breaks, emojis, and a call to action. 150-300 characters for Instagram/TikTok, 300-500 for Facebook/LinkedIn.",
      "hashtags": ["hashtag1", "hashtag2"],
      "bestTimeToPost": "Tuesday 7pm",
      "contentType": "Tip"
    }
  ],
  "blogPost": {
    "title": "SEO-friendly blog title",
    "intro": "2-3 sentence introduction paragraph",
    "sections": [
      { "heading": "Section Heading", "body": "2-4 sentence body paragraph with actionable content" }
    ],
    "conclusion": "Wrap-up paragraph with call to action",
    "seoKeywords": ["keyword1", "keyword2"]
  },
  "contentCalendar": [
    {
      "day": "Monday",
      "postId": 1,
      "platform": "Instagram",
      "contentType": "Tip"
    }
  ]
}

Rules:
- Exactly 7 posts total (id 1-7)
- Exactly 7 contentCalendar entries (Monday-Sunday)
- blogPost must have 3-5 sections
- Each post needs 10-15 hashtags (no # symbol in the array — just the word)
- bestTimeToPost should be a specific day + time like "Tuesday 7pm"
- contentType options: Tip, Promo, Story, Behind the scenes, Testimonial, Question, Announcement
- Content must feel authentic and human — not robotic or generic
- Reference the business type and target audience specifically`;

  // ── Call Claude ───────────────────────────────────────────────────────────
  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-5",
      max_tokens: 4096,
      system:
        "You are an expert social media content creator for local businesses. Create engaging, platform-optimized content. Return ONLY a raw JSON object — no markdown, no backticks, no code fences, no explanation.",
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text().catch(() => "unknown");
    console.error("[content/generate] Anthropic error:", anthropicRes.status, err);
    return NextResponse.json({ error: "Content generation failed" }, { status: 500 });
  }

  const anthropicData = await anthropicRes.json();
  const rawText: string = anthropicData.content?.[0]?.text ?? "";

  let content: ContentPackage = extractJSON(rawText) ??
    (() => {
      console.error("[content/generate] JSON parse failed:", rawText.slice(0, 400));
      return buildFallback(cleanBusiness, platform, tone);
    })();

  // Clamp to exactly 7 posts / 7 calendar entries
  content = {
    ...content,
    posts:           content.posts.slice(0, 7),
    contentCalendar: content.contentCalendar.slice(0, 7),
  };

  // Cache in Redis for 24 hours
  const key = `content:${session.email}:${Date.now()}`;
  await kv.set(key, { content, createdAt: new Date().toISOString() }, { ex: 86400 });

  return NextResponse.json({ content });
}
