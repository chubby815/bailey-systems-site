/**
 * GET /api/admin/fix-slugs
 *
 * One-time repair: scans every site:* key in Redis and, for any SiteRecord
 * whose slug:{subdomainSlug} reverse-lookup key is missing, writes it.
 *
 * Protected: caller must be authenticated as ADMIN_EMAIL.
 *
 * Response:
 *   { fixed: string[], skipped: string[], total: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { kv } from "@/lib/kv";
import type { SiteRecord } from "@/lib/kv";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session?.email || session.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await kv.keys("site:*");

  // Exclude legacy per-field image keys (site:{id}:hero-image etc.)
  const siteKeys = keys.filter(
    (k) => !k.includes(":hero-image") && !k.includes(":about-image")
  );

  const fixed: string[] = [];
  const skipped: string[] = [];

  for (const key of siteKeys) {
    const site = await kv.get<SiteRecord>(key);

    if (!site?.subdomainSlug || !site?.siteId) {
      skipped.push(key);
      continue;
    }

    const existing = await kv.get<string>(`slug:${site.subdomainSlug}`);

    if (!existing) {
      await kv.set(`slug:${site.subdomainSlug}`, site.siteId);
      console.log(`[fix-slugs] fixed: slug:${site.subdomainSlug} → ${site.siteId}`);
      fixed.push(site.subdomainSlug);
    } else {
      skipped.push(site.subdomainSlug);
    }
  }

  return NextResponse.json({
    fixed,
    skipped,
    total: siteKeys.length,
    message: `Fixed ${fixed.length} missing slug keys out of ${siteKeys.length} sites.`,
  });
}
