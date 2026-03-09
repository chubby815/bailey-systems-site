import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { kv } from "@/lib/kv";

function usageKey(email: string): string {
  const now = new Date();
  return `ask-bailey:${email}:${now.getUTCFullYear()}:${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only called when user clicks "Apply Changes"
  const key     = usageKey(session.email);
  const current = (await kv.get<number>(key)) ?? 0;
  const next    = current + 1;

  // 35-day TTL so old months auto-expire
  await kv.set(key, next, { ex: 35 * 24 * 3600 });

  return NextResponse.json({ success: true, usageCount: next });
}
