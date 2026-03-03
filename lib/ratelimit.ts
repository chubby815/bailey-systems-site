import { kv } from "./kv";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Fixed-window rate limiter backed by Upstash Redis.
 * @param identifier  Unique key (e.g. user email or IP address)
 * @param limit       Max requests allowed in the window
 * @param windowSecs  Window duration in seconds
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowSecs: number
): Promise<RateLimitResult> {
  const window = Math.floor(Date.now() / 1000 / windowSecs);
  const key = `rl:${identifier}:${window}`;

  const current = (await kv.get<number>(key)) ?? 0;

  if (current >= limit) {
    const resetInSeconds = windowSecs - (Math.floor(Date.now() / 1000) % windowSecs);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  await kv.set(key, current + 1, { ex: windowSecs });

  return {
    allowed: true,
    remaining: limit - current - 1,
    resetInSeconds: windowSecs - (Math.floor(Date.now() / 1000) % windowSecs),
  };
}
