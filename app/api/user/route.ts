import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError, z } from "zod";
import { rateLimit } from "@/lib/ratelimit";
import { createSessionToken, getSession, verifySession } from "@/lib/auth";
import {
  getUser,
  saveUser,
  setEmailVerificationToken,
} from "@/lib/kv";
import { sendVerificationEmail } from "@/lib/email";

// ── Schemas ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z.object({
  email:    z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name:     z.string().min(1, "Name is required.").max(100),
});

// ── Password validation ───────────────────────────────────────────────────────

function validatePasswordStrength(password: string): string | null {
  if (password.length < 8)           return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(password))    return "Password must contain at least 1 letter.";
  if (!/[0-9]/.test(password))       return "Password must contain at least 1 number.";
  return null;
}

// ── GET — session check ───────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    let session = await getSession(req);

    if (!session) {
      const cookieHeader = req.headers.get("cookie") ?? "";
      const tokenMatch = cookieHeader.match(/(?:^|;\s*)auth-token=([^;]+)/);
      if (tokenMatch?.[1]) {
        session = await verifySession(tokenMatch[1]);
      }
    }

    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ session: null });
  }
}

// ── POST — signup / login ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit(`auth:${ip}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  try {
    const body = await request.json() as Record<string, unknown>;
    const mode = typeof body.mode === "string" ? body.mode : "login";

    // ── SIGNUP ──────────────────────────────────────────────────────────────
    if (mode === "signup") {
      const parsed = signupSchema.parse(body);
      const email  = parsed.email.toLowerCase();

      const strengthError = validatePasswordStrength(parsed.password);
      if (strengthError) {
        return NextResponse.json({ error: strengthError }, { status: 400 });
      }

      const existing = await getUser(email);
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in." },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(parsed.password, 12);
      const token        = crypto.randomUUID();

      await saveUser({
        email,
        passwordHash,
        name: parsed.name.trim(),
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });

      await setEmailVerificationToken(email, token);

      try {
        await sendVerificationEmail(email, token);
      } catch (emailErr) {
        console.error("[api/user] Failed to send verification email:", emailErr);
        // Don't block signup — user can request resend
      }

      return NextResponse.json({
        success: true,
        message: "Account created! Please check your email to verify your account before logging in.",
      });
    }

    // ── LOGIN ───────────────────────────────────────────────────────────────
    const parsed = loginSchema.parse(body);
    const email  = parsed.email.toLowerCase();

    const user = await getUser(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error:   "email_not_verified",
          message: "Please verify your email before logging in. Check your inbox for the verification link.",
          email,
        },
        { status: 403 }
      );
    }

    const passwordValid = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const sessionToken = await createSessionToken(email);
    const response = NextResponse.json({ success: true, user: { email, name: user.name } });
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

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues.map((i) => i.message).join(", ") },
        { status: 422 }
      );
    }
    console.error("[api/user] POST error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
