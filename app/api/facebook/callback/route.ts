import { NextRequest, NextResponse } from "next/server";
import { saveFacebookPage } from "@/lib/kv";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://baileyagents.com";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const email = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !email) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?error=oauth_denied`);
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?error=config`);
  }

  try {
    // Exchange code for access token
    const tokenUrl = new URL("https://graph.facebook.com/v18.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenRes = await fetch(tokenUrl.toString());
    if (!tokenRes.ok) {
      console.error("[facebook/callback] token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?error=token_exchange`);
    }
    const tokenData = await tokenRes.json() as { access_token?: string; error?: { message: string } };

    if (!tokenData.access_token) {
      console.error("[facebook/callback] no access token:", tokenData.error?.message);
      return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?error=no_token`);
    }

    const userToken = tokenData.access_token;

    // Fetch the user's pages
    const pagesUrl = new URL("https://graph.facebook.com/v18.0/me/accounts");
    pagesUrl.searchParams.set("access_token", userToken);

    const pagesRes = await fetch(pagesUrl.toString());
    if (!pagesRes.ok) {
      console.error("[facebook/callback] pages fetch failed:", await pagesRes.text());
      return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?error=pages_fetch`);
    }

    const pagesData = await pagesRes.json() as {
      data?: Array<{ id: string; name: string; access_token: string }>;
    };

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?error=no_pages`);
    }

    // Take the first page
    const page = pagesData.data[0];

    await saveFacebookPage(email, {
      pageId: page.id,
      pageName: page.name,
      pageAccessToken: page.access_token,
      connectedAt: new Date().toISOString(),
    });

    console.log(`[facebook/callback] connected page "${page.name}" for ${email}`);

    return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?connected=true`);
  } catch (err) {
    console.error("[facebook/callback] unexpected error:", err);
    return NextResponse.redirect(`${BASE_URL}/dashboard/facebook?error=server`);
  }
}
