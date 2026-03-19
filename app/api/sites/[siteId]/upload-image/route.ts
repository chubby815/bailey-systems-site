import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSite, kv } from "@/lib/kv";
import { put } from "@vercel/blob";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const session = await getSession(req);
  if (!session?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId } = await params;
  const site = await getSite(siteId);

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  if (site.userId.toLowerCase() !== session.email.toLowerCase()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const section = formData.get("section") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
  }

  if (section !== "hero" && section !== "about") {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const html = site.generatedHTML;
  if (!html) {
    return NextResponse.json({ error: "No HTML site found" }, { status: 400 });
  }

  try {
    const ext = file.type.includes("png") ? "png" : "jpg";
    const filename = `site-images/${siteId}-${section}-${Date.now()}.${ext}`;
    const { url } = await put(filename, file, { access: "public" });

    let updatedHtml = html;

    if (section === "hero") {
      // Replace the first background-image url found in the HTML (hero background)
      updatedHtml = updatedHtml.replace(
        /background-image\s*:\s*url\(\s*['"]?https?:\/\/[^'")\s]+['"]?\s*\)/i,
        `background-image: url('${url}')`,
      );
    }

    if (section === "about") {
      // Replace first <img src="..."> that appears after an id="about" or class containing "about"
      updatedHtml = updatedHtml.replace(
        /(id=["']about["'][^>]*>[\s\S]{0,600}?<img[^>]*src=)["'][^"']+["']/i,
        `$1'${url}'`,
      );
    }

    await kv.set(`html:${siteId}`, updatedHtml);

    console.log(`[upload-image] ${section} image updated for site ${siteId} → ${url}`);

    return NextResponse.json({ success: true, url, section });
  } catch (err) {
    console.error("[upload-image]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
