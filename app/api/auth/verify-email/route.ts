import { NextRequest, NextResponse } from "next/server";
import {
  getEmailVerificationToken,
  deleteEmailVerificationToken,
  getUser,
  saveUser,
} from "@/lib/kv";
import { createSessionToken } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://baileyagents.com";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/login?error=invalid_link`);
  }

  try {
    const email = await getEmailVerificationToken(token);

    if (!email) {
      return NextResponse.redirect(`${BASE_URL}/login?error=link_expired`);
    }

    const user = await getUser(email);
    if (!user) {
      return NextResponse.redirect(`${BASE_URL}/login?error=invalid_link`);
    }

    // Mark as verified
    await saveUser({ ...user, emailVerified: true });
    await deleteEmailVerificationToken(token);

    // Create session and set cookie
    const sessionToken = await createSessionToken(email);
    const response = NextResponse.redirect(`${BASE_URL}/dashboard`);
    response.cookies.set({
      name:     "auth-token",
      value:    sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure:   process.env.NODE_ENV === "production",
      path:     "/",
      maxAge:   60 * 60 * 24 * 30,
    });
    return response;
  } catch (err) {
    console.error("[verify-email] error:", err);
    return NextResponse.redirect(`${BASE_URL}/login?error=verification_failed`);
  }
}
