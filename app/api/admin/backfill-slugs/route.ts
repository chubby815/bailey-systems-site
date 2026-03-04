/**
 * GET /api/admin/backfill-slugs
 *
 * One-time backfill: scans every site:* key in Redis and, for any
 * SiteRecord missing subdomainSlug, generates a slug from the
 * businessName and writes:
 *   1. Updated SiteRecord  →  site:{siteId}
 *   2. Reverse lookup key  →  slug:{slug} = siteId
 *
 * Protected: caller must be authenticated as ADMIN_EMAIL.
 *
 * Response:
 *   { fixed: number, skipped: number, sites: Array<{ siteId, slug }> }
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies }     from "@/lib/auth";
import { kv, getSite, saveSite }     from "@/lib/kv";
import type { SiteRecord }            from "@/lib/kv";

// ── Slug helper (mirrors the one in app/api/sites/generate/route.ts) ──────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60); // DNS label max 63 chars
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // ── Auth: admin only ────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAIL not configured" }, { status: 500 });
  }

  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.email !== adminEmail) {
    return NextResponse.json({ error: "Forbidden — admin only" }, { status: 403 });
  }

  // ── Scan all site:* keys ────────────────────────────────────────────────────
  // We use kv.keys() directly (same pattern used by getUserSites).
  // Exclude any keys that look like "site:*:hero-image" — those are image blobs,
  // not SiteRecord JSON objects.
  const allKeys: string[] = await kv.keys("site:*");
  const siteKeys = allKeys.filter(
    (k) => !k.includes(":hero-image") && !k.includes(":") // only "site:{siteId}" shaped keys
      || k.match(/^site:[^:]+$/) !== null
  ).filter((k) => /^site:[^:]+$/.test(k)); // final clean filter

  if (!siteKeys.length) {
    return NextResponse.json({ fixed: 0, skipped: 0, sites: [] });
  }

  // ── Batch-fetch all site records ────────────────────────────────────────────
  const records = await kv.mget<(SiteRecord | null)[]>(...siteKeys);

  const fixed: { siteId: string; slug: string }[] = [];
  let skipped = 0;

  for (const record of records) {
    if (!record || !record.siteId || !record.businessName) {
      skipped++;
      continue;
    }

    // Already has a slug — skip
    if (record.subdomainSlug) {
      skipped++;
      continue;
    }

    const slug = slugify(record.businessName);
    if (!slug) {
      skipped++;
      continue;
    }

    // Check whether this slug is already claimed by another site
    const existingOwner = await kv.get<string>(`slug:${slug}`);
    let finalSlug = slug;

    if (existingOwner && existingOwner !== record.siteId) {
      // Collision: append the last 4 chars of the siteId to make it unique
      const suffix = record.siteId.slice(-4);
      finalSlug = `${slug}-${suffix}`.slice(0, 60);
    }

    // Write updated SiteRecord
    const updated: SiteRecord = { ...record, subdomainSlug: finalSlug };
    await saveSite(record.siteId, updated);

    // Write reverse-lookup key (no expiry — permanent)
    await kv.set(`slug:${finalSlug}`, record.siteId);

    fixed.push({ siteId: record.siteId, slug: finalSlug });
  }

  return NextResponse.json({
    fixed:   fixed.length,
    skipped,
    total:   siteKeys.length,
    sites:   fixed,
  });
}
