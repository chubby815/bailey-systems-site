import { kv } from "./kv";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Fixed-window rate limiter backed by Upstash Redis.
 * Uses atomic INCR to eliminate the read-then-write race condition.
 * @param identifier  Unique key (e.g. user email or IP address)
 * @param limit       Max requests allowed in the window
 * @param windowSecs  Window duration in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSecs: number
): Promise<RateLimitResult> {
  try {
    const window = Math.floor(Date.now() / 1000 / windowSecs);
    const key = `rl:${identifier}:${window}`;

    // INCR is atomic — no race condition between read and write
    const count = await kv.incr(key);

    // Set expiry only on the first increment so the key auto-expires
    if (count === 1) {
      await kv.expire(key, windowSecs);
    }

    const resetInSeconds = windowSecs - (Math.floor(Date.now() / 1000) % windowSecs);
    const allowed = count <= limit;

    return {
      allowed,
      remaining: Math.max(0, limit - count),
      resetInSeconds,
    };
  } catch {
    // If Redis is unavailable, fail open so requests aren't blocked
    console.error("[rateLimit] Redis error — failing open");
    return { allowed: true, remaining: 0, resetInSeconds: 0 };
  }
}
