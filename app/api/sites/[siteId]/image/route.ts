import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSite, kv } from "@/lib/kv";

const MAX_SIZE_BYTES = 7_000_000; // ~5 MB base64 encoded

function imageKey(siteId: string) {
  return `site:${siteId}:hero-image`;
}

// ── GET — serve the stored hero image ────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const stored = await kv.get<string>(imageKey(siteId));

  if (!stored) return new NextResponse(null, { status: 404 });

  // Parse data URL: "data:<mime>;base64,<data>"
  const commaIdx = stored.indexOf(",");
  const header   = commaIdx > -1 ? stored.slice(0, commaIdx) : "";
  const b64Part  = commaIdx > -1 ? stored.slice(commaIdx + 1) : "";
  const mimeMatch = header.match(/^data:([^;]+);base64$/);
  if (!mimeMatch || !b64Part) return new NextResponse(null, { status: 400 });
  // Use variable names consistent with the rest of the handler
  const match = [null, mimeMatch[1], b64Part] as [null, string, string];

  const [, mimeType, b64Data] = match;
  const buffer = Buffer.from(b64Data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":  mimeType,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

// ── POST — upload a new hero image ────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId } = await params;
  const site = await getSite(siteId);
  if (!site)                         return NextResponse.json({ error: "Site not found" }, { status: 404 });
  if (site.userId !== session.email) return NextResponse.json({ error: "Forbidden" },    { status: 403 });

  let body: { image?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { image } = body;
  if (!image || typeof image !== "string")
    return NextResponse.json({ error: "image field required" }, { status: 400 });
  if (!image.startsWith("data:image/"))
    return NextResponse.json({ error: "image must be a data URL (data:image/...)" }, { status: 400 });
  if (image.length > MAX_SIZE_BYTES)
    return NextResponse.json({ error: "Image too large (max 5 MB)" }, { status: 413 });

  await kv.set(imageKey(siteId), image, { ex: 60 * 60 * 24 * 365 }); // 1-year TTL

  return NextResponse.json({ url: `/api/sites/${siteId}/image` });
}

// ── DELETE — remove custom hero image ────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId } = await params;
  const site = await getSite(siteId);
  if (!site)                         return NextResponse.json({ error: "Site not found" }, { status: 404 });
  if (site.userId !== session.email) return NextResponse.json({ error: "Forbidden" },    { status: 403 });

  await kv.del(imageKey(siteId));
  return NextResponse.json({ success: true });
}
