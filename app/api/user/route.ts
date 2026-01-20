import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { authSchema } from "@/utils/validations";
import { createSessionToken, getUserSession } from "@/lib/auth";

export function GET() {
  const session = getUserSession();
  return NextResponse.json({ session });
}

export async function POST(request: NextRequest) {
  try {
    const { action = "login", ...body } = await request.json();
    const payload = authSchema.parse(body);
    const token = createSessionToken(payload.email);
    const response = NextResponse.json({
      success: true,
      action,
      user: {
        email: payload.email,
        plan: action === "signup" ? "Scale" : "Launch",
      },
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
    return NextResponse.json(
      { error: "Unable to update user session." },
      { status: 500 },
    );
  }
}

