import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { rateLimit } from '@/lib/ratelimit'

const LIMITS = {
  bailey_pro_2026:   { msgs: 20, imgs: 2 },
  bailey_elite_2026: { msgs: 100, imgs: 3 },
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  // Per-IP burst guard: max 30 requests per minute
  const burstRl = await rateLimit(`chat-burst:${ip}`, 30, 60)
  if (!burstRl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Slow down.' }, { status: 429 })
  }

  const { messages, token } = await req.json()

  const limit = LIMITS[token as keyof typeof LIMITS]
  if (!limit) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Per-token hourly rate limit: max 50 requests per hour
  const hourlyRl = await rateLimit(`chat-hourly:${token}`, 50, 3600)
  if (!hourlyRl.allowed) {
    return NextResponse.json(
      { error: 'Hourly limit reached. Try again later.', resetInSeconds: hourlyRl.resetInSeconds },
      { status: 429 }
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const msgKey = `usage:${token}:msg:${today}`
  const used = (await kv.get<number>(msgKey)) || 0

  if (used >= limit.msgs) {
    const isElite = token === 'bailey_elite_2026'
    return NextResponse.json({
      error: 'limit_reached',
      message: isElite
        ? "Bailey is resting! You've hit your daily limit of 100 messages. Resets at midnight. 🌙"
        : "You've hit your daily limit of 20 messages! Upgrade to Bailey Elite for 100 messages/day and more power. 👑",
      showUpgrade: !isElite
    }, { status: 429 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API not configured' }, { status: 500 })

  const tier = token === 'bailey_elite_2026' ? 'Elite' : 'Pro'

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: `You are Bailey, an elite AI assistant created by Bailey Systems AI (${tier} tier).
You help with anything: coding, writing, business strategy, math, research, creative work, debugging, site building.
You write real working code when asked. You are sharp, direct, and genuinely useful.
You can also generate images — tell the user to use the 🎨 image button below the input.
Bailey Systems AI: Machesney Park, IL | Lilianajs27@gmail.com | 779-895-6325
Founder: Javier Sandoval, Lead Engineer & Amazon Software Engineer.
You are fully bilingual — English and Spanish. If the user writes in Spanish, respond entirely in Spanish. If they write in English, respond in English. Never mix languages in the same response unless the user does first.`,
      messages,
    }),
  })

  const data = await response.json()
  if (!response.ok) return NextResponse.json({ error: 'Chat service error' }, { status: 500 })

  await kv.set(msgKey, used + 1, { ex: 86400 })

  const reply = data.content?.[0]?.text || ''
  return NextResponse.json({ reply, used: used + 1, limit: limit.msgs })
}
