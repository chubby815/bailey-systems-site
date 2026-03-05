import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

function extractTag(html: string, tag: string): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, "i"));
  return m ? m[1].trim() : "";
}

function extractMeta(html: string, name: string): string {
  const m = html.match(
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i")
  ) ?? html.match(
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, "i")
  );
  return m ? m[1].trim() : "";
}

function extractHeadings(html: string): string {
  const headings: string[] = [];
  const hTags = html.matchAll(/<h[1-3][^>]*>([^<]*)<\/h[1-3]>/gi);
  for (const m of hTags) {
    const text = m[1].trim();
    if (text) headings.push(text);
    if (headings.length >= 10) break;
  }
  return headings.join(" | ");
}

function extractBodyText(html: string, maxChars = 2000): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);
}

function countImages(html: string): number {
  return (html.match(/<img\b/gi) ?? []).length;
}

function hasPhone(text: string): boolean {
  return /(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})/.test(text);
}

function hasContactForm(html: string): boolean {
  return /<form\b/i.test(html) || /contact/i.test(html);
}

export async function POST(req: NextRequest) {
  // Auth
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 5 roasts/hour per user
  const rl = await rateLimit(`roast:${session.email}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in ${rl.resetInSeconds}s.` },
      { status: 429 }
    );
  }

  let body: { url?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
  if (!rawUrl || (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://"))) {
    return NextResponse.json(
      { error: "A valid URL starting with http:// or https:// is required." },
      { status: 400 }
    );
  }

  // Fetch the target website
  let html = "";
  try {
    const siteRes = await fetch(rawUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BaileyAgents/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!siteRes.ok) {
      return NextResponse.json(
        { error: `Could not fetch the website (status ${siteRes.status}). Make sure the URL is public and reachable.` },
        { status: 422 }
      );
    }
    html = await siteRes.text();
  } catch {
    return NextResponse.json(
      { error: "Could not reach that website. Check the URL and make sure the site is live." },
      { status: 422 }
    );
  }

  // Extract page data
  const title          = extractTag(html, "title");
  const metaDesc       = extractMeta(html, "description");
  const headings       = extractHeadings(html);
  const bodyText       = extractBodyText(html);
  const imageCount     = countImages(html);
  const phoneDetected  = hasPhone(html);
  const formDetected   = hasContactForm(html);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 500 });
  }

  const userPrompt = `Analyze this website data and provide a roast report:

URL: ${rawUrl}
Title: ${title || "(none)"}
Meta Description: ${metaDesc || "(none)"}
Headings: ${headings || "(none found)"}
Page Content: ${bodyText || "(none)"}
Has Phone Number: ${phoneDetected ? "Yes" : "No"}
Has Contact Form: ${formDetected ? "Yes" : "No"}
Image Count: ${imageCount}

Respond in this EXACT format:

SCORE: X/10

DESIGN 🎨
[2-3 sentences about visual design]

SEO 🔍
[2-3 sentences about SEO issues]

TRUST SIGNALS ⭐
[2-3 sentences about trust/credibility]

CONVERSION 💰
[2-3 sentences about conversion issues]

TOP 5 FIXES 🔧
1. [specific fix]
2. [specific fix]
3. [specific fix]
4. [specific fix]
5. [specific fix]

VERDICT
[1 punchy sentence summary]`;

  let report = "";
  try {
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
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
          "You are a world-class web design and conversion rate optimization expert. Analyze websites and provide brutally honest, actionable feedback.",
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("[roast] Claude error:", errText);
      return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 });
    }

    const aiData = await aiRes.json() as {
      content?: Array<{ type: string; text?: string }>;
    };
    report = aiData.content?.[0]?.text ?? "";
  } catch (err) {
    console.error("[roast] fetch error:", err);
    return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 });
  }

  // Parse score from "SCORE: X/10"
  const scoreMatch = report.match(/SCORE:\s*(\d+)\s*\/\s*10/i);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

  return NextResponse.json({ report, url: rawUrl, score });
}
