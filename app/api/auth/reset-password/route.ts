import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/ratelimit";
import {
  getPasswordResetToken,
  deletePasswordResetToken,
  getUser,
  saveUser,
} from "@/lib/kv";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://baileyagents.com";

function validatePasswordStrength(password: string): string | null {
  if (password.length < 8)        return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password)) return "Password must contain at least 1 letter.";
  if (!/[0-9]/.test(password))    return "Password must contain at least 1 number.";
  return null;
}

/** GET — verify token exists, redirect to reset UI */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/login?error=invalid_reset_link`);
  }

  const email = await getPasswordResetToken(token);
  if (!email) {
    return NextResponse.redirect(`${BASE_URL}/login?error=invalid_reset_link`);
  }

  return NextResponse.redirect(`${BASE_URL}/reset-password?token=${token}`);
}

/** POST — save new password */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit(`reset:${ip}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json() as { token?: string; newPassword?: string };
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required." }, { status: 400 });
    }

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      return NextResponse.json({ error: strengthError }, { status: 400 });
    }

    const email = await getPasswordResetToken(token);
    if (!email) {
      return NextResponse.json({ error: "This reset link has expired or is invalid." }, { status: 400 });
    }

    const user = await getUser(email);
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await saveUser({ ...user, passwordHash });
    await deletePasswordResetToken(token);

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("[reset-password] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
