import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";
import { getUser, setPasswordResetToken } from "@/lib/kv";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = await rateLimit(`forgot:${ip}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json() as { email?: string };
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    // Always return success — never reveal whether email exists
    const user = await getUser(email);

    if (user && user.emailVerified) {
      const token = crypto.randomUUID();
      await setPasswordResetToken(email, token);
      try {
        await sendPasswordResetEmail(email, token);
      } catch (err) {
        console.error("[forgot-password] Failed to send reset email:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If that email is registered, you'll receive a reset link shortly.",
    });
  } catch (err) {
    console.error("[forgot-password] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
