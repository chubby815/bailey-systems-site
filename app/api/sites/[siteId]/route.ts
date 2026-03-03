import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSite, deleteSite } from "@/lib/kv";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId } = await params;
  const site = await getSite(siteId);

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  if (site.userId !== session.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(site);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId } = await params;
  const site = await getSite(siteId);

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  if (site.userId !== session.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteSite(siteId);
  return NextResponse.json({ success: true });
}
