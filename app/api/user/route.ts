import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { authSchema } from "@/utils/validations";
import { createSessionToken, getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  // Use getSession(req) — reads directly from NextRequest cookies.
  // getUserSession() uses next/headers cookies() which can silently return null
  // in Route Handlers on Vercel, causing the navbar to show Login when logged in.
  const session = await getSession(req);
  return NextResponse.json({ session });
}

export async function POST(request: NextRequest) {
  // Rate limit: 10 login/signup attempts per hour per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit(`auth:${ip}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  try {
    const { mode = "login", ...body } = await request.json();
    const payload = authSchema.parse(body);
    // Always store and compare emails in lowercase to prevent duplicate accounts
    // (e.g. lilianajs27@gmail.com vs Lilianajs27@gmail.com treated as one account).
    const email = payload.email.toLowerCase();
    const token = await createSessionToken(email);
    const response = NextResponse.json({
      success: true,
      mode,
      user: { email },
    });
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues.map((issue) => issue.message).join(", ") },
        { status: 422 },
      );
    }
    console.error("[api/user] Session error:", error);
    return NextResponse.json(
      { error: "Unable to update user session." },
      { status: 500 },
    );
  }
}

