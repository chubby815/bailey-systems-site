import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";
import { getUser, setEmailVerificationToken } from "@/lib/kv";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  try {
    const body = await request.json() as { email?: string };
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    // Rate limit per email (3 resends per hour)
    const rl = await rateLimit(`resend-verify:${email}:${ip}`, 3, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many resend attempts. Please wait before requesting another email." },
        { status: 429 }
      );
    }

    const user = await getUser(email);

    // Always return success to avoid revealing account existence
    if (user && !user.emailVerified) {
      const token = crypto.randomUUID();
      await setEmailVerificationToken(email, token);
      try {
        await sendVerificationEmail(email, token);
      } catch (err) {
        console.error("[resend-verification] Failed to send email:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (err) {
    console.error("[resend-verification] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
