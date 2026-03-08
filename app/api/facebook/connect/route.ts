import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json(
      { error: "Facebook OAuth not configured" },
      { status: 500 }
    );
  }

  const scope = [
    "pages_show_list",
    "pages_manage_posts",
    "pages_read_engagement",
  ].join(",");

  const oauthUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  oauthUrl.searchParams.set("client_id", appId);
  oauthUrl.searchParams.set("redirect_uri", redirectUri);
  oauthUrl.searchParams.set("scope", scope);
  oauthUrl.searchParams.set("state", session.email);

  return NextResponse.redirect(oauthUrl.toString());
}
