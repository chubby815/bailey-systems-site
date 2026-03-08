import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFacebookPage } from "@/lib/kv";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 20 posts/hour per user
  const rl = await rateLimit(`fb-post:${session.email}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many posts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  const page = await getFacebookPage(session.email);
  if (!page) {
    return NextResponse.json(
      { error: "No Facebook page connected. Please connect your page first." },
      { status: 400 }
    );
  }

  let message: string;
  try {
    const body = await req.json() as { message?: unknown };
    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    message = body.message.trim().slice(0, 63206); // Facebook max post length
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const postUrl = `https://graph.facebook.com/v18.0/${page.pageId}/feed`;
    const postRes = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: page.pageAccessToken,
      }),
    });

    if (!postRes.ok) {
      const errData = await postRes.json() as { error?: { message: string } };
      console.error("[facebook/post] Graph API error:", errData.error?.message);
      return NextResponse.json(
        { error: errData.error?.message ?? "Failed to post to Facebook" },
        { status: 502 }
      );
    }

    const result = await postRes.json() as { id?: string };
    console.log(`[facebook/post] posted to "${page.pageName}" for ${session.email}`);

    return NextResponse.json({ success: true, postId: result.id });
  } catch (err) {
    console.error("[facebook/post] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
