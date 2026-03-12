import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSite, saveSite, deleteSite } from "@/lib/kv";
import type { StructuredSiteContent, ThemeConfig } from "@/lib/site-theme";
import { isStructuredContent } from "@/lib/site-theme";

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

  if (site.userId?.toLowerCase() !== session.email?.toLowerCase()) {
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

  if (site.userId?.toLowerCase() !== session.email?.toLowerCase()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteSite(siteId);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId } = await params;
  const site = await getSite(siteId);
  if (!site)                         return NextResponse.json({ error: "Site not found" }, { status: 404 });
  if (site.userId?.toLowerCase() !== session.email?.toLowerCase()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let body: { content?: StructuredSiteContent; theme?: ThemeConfig; template?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  // Allowlist template keys
  const VALID_TEMPLATES = new Set(["darkpremium", "neobrutalism", "minimal", "magazine", "classic"]);
  const cleanTemplate = typeof body.template === "string" && VALID_TEMPLATES.has(body.template)
    ? body.template
    : undefined;

  const updated = {
    ...site,
    ...(body.content && isStructuredContent(body.content) ? { generatedContent: body.content } : {}),
    ...(body.theme    ? { editorTheme: body.theme } : {}),
    ...(cleanTemplate !== undefined ? { template: cleanTemplate } : {}),
  };

  await saveSite(siteId, updated);
  return NextResponse.json({ success: true });
}
