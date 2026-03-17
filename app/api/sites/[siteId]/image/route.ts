import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSite, saveSite } from "@/lib/kv";

const MAX_BYTES = 2.8 * 1024 * 1024; // ~2 MB after base64 overhead

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId } = await params;

  let body: { section?: unknown; image?: unknown };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const rawSection = typeof body.section === "string" ? body.section : "hero";
  const image      = body.image === null ? null : typeof body.image === "string" ? body.image : undefined;

  if (image === undefined) {
    return NextResponse.json({ error: "image must be a string or null" }, { status: 400 });
  }

  if (image !== null) {
    if (!image.startsWith("data:image/")) {
      return NextResponse.json({ error: "image must be a data:image/ URL" }, { status: 400 });
    }
    if (image.length > MAX_BYTES) {
      return NextResponse.json({ error: "Image exceeds 2 MB limit" }, { status: 400 });
    }
  }

  const site = await getSite(siteId);
  if (!site)                         return NextResponse.json({ error: "Not found" },   { status: 404 });
  if (site.userId !== session.email) return NextResponse.json({ error: "Forbidden" },  { status: 403 });

  const updated = { ...site };

  // Handle service-N sections (service-0 … service-7)
  const serviceMatch = rawSection.match(/^service-(\d+)$/);
  if (serviceMatch) {
    const idx = parseInt(serviceMatch[1], 10);
    if (idx < 0 || idx > 7) {
      return NextResponse.json({ error: "Service index out of range (0-7)" }, { status: 400 });
    }
    if (!updated.serviceImages) updated.serviceImages = {};
    if (image === null) {
      delete updated.serviceImages[idx];
    } else {
      updated.serviceImages[idx] = image;
    }
  } else if (rawSection === "about") {
    if (image === null) delete updated.aboutImage;
    else updated.aboutImage = image;
  } else {
    if (image === null) delete updated.heroImage;
    else updated.heroImage = image;
  }

  await saveSite(siteId, updated);
  return NextResponse.json({ success: true });
}

// Backward-compat DELETE — removes heroImage
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId } = await params;
  const site = await getSite(siteId);
  if (!site)                         return NextResponse.json({ error: "Not found" },  { status: 404 });
  if (site.userId !== session.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = { ...site };
  delete updated.heroImage;
  await saveSite(siteId, updated);
  return NextResponse.json({ success: true });
}
