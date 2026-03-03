import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { authSchema } from "@/utils/validations";
import { createSessionToken, getUserSession } from "@/lib/auth";

export async function GET() {
  const session = await getUserSession();
  return NextResponse.json({ session });
}

export async function POST(request: NextRequest) {
  try {
    const { mode = "login", ...body } = await request.json();
    const payload = authSchema.parse(body);
    const token = await createSessionToken(payload.email);
    const response = NextResponse.json({
      success: true,
      mode,
      user: { email: payload.email },
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

