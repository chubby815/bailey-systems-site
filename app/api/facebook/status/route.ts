import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getFacebookPage } from "@/lib/kv";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await getFacebookPage(session.email);

  return NextResponse.json({
    connected: page !== null,
    pageName: page?.pageName ?? null,
    pageId: page?.pageId ?? null,
  });
}
