/**
 * lib/auth.ts
 * Cookie-based session auth.
 * ADDITIONS (saas-subscriptions branch):
 *   - getSession() now also reads subscription status from Redis
 *   - getSubscriptionStatus() is a standalone helper for server components
 *
 * EXISTING behavior preserved:
 *   - set/getSession, clearSession all work identically
 *   - plan field in cookie is kept for backward compat but is now also
 *     cross-checked against the live Redis subscription record
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSubscriptionByEmail, getUserPlan, type SubscriptionRecord } from "./kv";

const AUTH_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);
const COOKIE_NAME = "auth-token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

// ── Session payload ───────────────────────────────────────────────────────────
export type SessionPayload = {
  email: string;
  name?: string;
  /** Legacy: plan stored in cookie. Use getSubscriptionStatus() for live data. */
  plan?: string;
};

// ── Sign / verify ─────────────────────────────────────────────────────────────
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(AUTH_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────
/** Read session from Next.js server component (uses next/headers) */
export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Read session from a NextRequest (middleware / route handlers) */
export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Set session cookie on a NextResponse */
export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

/** Clear session cookie */
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

// ── NEW: Subscription status helpers ─────────────────────────────────────────

/**
 * Get the live subscription record for a user from Redis.
 * Use this in server components and API routes.
 */
export async function getSubscriptionStatus(
  email: string
): Promise<SubscriptionRecord | null> {
  return getSubscriptionByEmail(email);
}

/**
 * Returns the active plan tier ("starter" | "growth" | "pro" | null).
 * null means no active subscription.
 */
export async function getActivePlan(
  email: string
): Promise<"starter" | "growth" | "pro" | null> {
  return getUserPlan(email);
}

/**
 * Full auth check for protected pages.
 * Returns { session, plan } — use in server components or layout.tsx.
 *
 * Example usage in a server component:
 *   const { session, plan } = await requireAuth();
 *   if (!plan) redirect("/pricing");
 */
export async function requireAuth(): Promise<{
  session: SessionPayload;
  plan: "starter" | "growth" | "pro" | null;
  subscription: SubscriptionRecord | null;
}> {
  const session = await getSessionFromCookies();

  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
    throw new Error("Unreachable");
  }

  const [plan, subscription] = await Promise.all([
    getActivePlan(session.email),
    getSubscriptionStatus(session.email),
  ]);

  return { session, plan, subscription };
}

// ── Backward-compat wrappers (existing routes import these names) ─────────────
/** Old signature: getUserSession() — reads from cookies, no req arg */
export const getUserSession = () => getSessionFromCookies();
/** Old signature: createSessionToken(email) — wraps signSession with email string */
export const createSessionToken = (email: string) => signSession({ email });
