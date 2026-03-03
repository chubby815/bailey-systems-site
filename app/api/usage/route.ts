import { NextRequest, NextResponse } from "next/server";
import { getSession, getActivePlan, getSubscriptionStatus } from "@/lib/auth";
import { getUserSites } from "@/lib/kv";
import { getMonthlyUsage, PLAN_LIMITS, type PlanKey } from "@/lib/usage";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [monthlyUsage, plan, subscription, userSites] = await Promise.all([
    getMonthlyUsage(session.email),
    getActivePlan(session.email),
    getSubscriptionStatus(session.email),
    getUserSites(session.email),
  ]);

  const resolvedPlan = plan ?? "starter";
  const limits       = PLAN_LIMITS[resolvedPlan as PlanKey] ?? PLAN_LIMITS.starter;
  const runsLimit    = limits.runsPerMonth;
  const sitesLimit   = limits.sitesTotal;

  return NextResponse.json({
    plan:               resolvedPlan,
    runsUsed:           monthlyUsage,
    runsLimit:          runsLimit   === Infinity ? "unlimited" : runsLimit,
    runsRemaining:      runsLimit   === Infinity ? "unlimited" : Math.max(0, runsLimit - monthlyUsage),
    sitesUsed:          userSites.length,
    sitesLimit:         sitesLimit  === Infinity ? "unlimited" : sitesLimit,
    subscriptionStatus: subscription?.status ?? null,
  });
}
