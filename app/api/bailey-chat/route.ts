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

  const body = await req.json() as { messages?: unknown; token?: unknown }
  const { messages: rawMessages, token } = body

  const limit = LIMITS[token as keyof typeof LIMITS]
  if (!limit) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Validate messages array
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
  }
  if (rawMessages.length > 100) {
    return NextResponse.json({ error: 'Too many messages in context' }, { status: 400 })
  }

  // Sanitize each message — strip HTML/control chars, cap each at 8000 chars
  const messages = rawMessages.map((m: unknown) => {
    if (typeof m !== 'object' || m === null) return null
    const msg = m as Record<string, unknown>
    const role    = typeof msg.role    === 'string' ? msg.role.slice(0, 20) : ''
    const content = typeof msg.content === 'string'
      ? msg.content.replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 8000)
      : ''
    if (!role || !content) return null
    return { role, content }
  }).filter(Boolean)

  if (messages.length === 0) {
    return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
  }

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
      system: `You are Bailey, an elite AI assistant created by Bailey Agents (${tier} tier).
You help with anything: coding, writing, business strategy, math, research, creative work, debugging, site building.
You write real working code when asked. You are sharp, direct, and genuinely useful.
You can also generate images — tell the user to use the 🎨 image button below the input.
Bailey Agents: Machesney Park, IL | Lilianajs27@gmail.com | 779-895-6325
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
