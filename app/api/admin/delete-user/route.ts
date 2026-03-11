import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { kv } from "@/lib/kv";

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Admin not configured." }, { status: 500 });
  }

  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (session.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Missing or invalid email parameter." }, { status: 400 });
  }

  await kv.del(`user:${email.toLowerCase()}`);

  return NextResponse.json({ success: true, deleted: email.toLowerCase() });
}
