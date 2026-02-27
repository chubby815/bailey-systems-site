import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const LIMITS = {
  bailey_pro_2026:   { imgs: 2 },
  bailey_elite_2026: { imgs: 3 },
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}:${new Date().getMinutes()}`
  const count = (await kv.get<number>(key)) || 0
  if (count >= 30) return false
  await kv.set(key, count + 1, { ex: 60 })
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const allowed = await checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Slow down.' }, { status: 429 })
  }

  const { prompt, token } = await req.json()

  const limit = LIMITS[token as keyof typeof LIMITS]
  if (!limit) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]
  const imgKey = `usage:${token}:img:${today}`
  const used = (await kv.get<number>(imgKey)) || 0

  if (used >= limit.imgs) {
    return NextResponse.json({
      error: 'limit_reached',
      message: `You've used all ${limit.imgs} images for today. Resets at midnight! 🌙`
    }, { status: 429 })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) return NextResponse.json({ error: 'Image API not configured' }, { status: 500 })

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    }),
  })

  const data = await response.json()
  if (!response.ok) return NextResponse.json({ error: 'Image generation error' }, { status: 500 })

  await kv.set(imgKey, used + 1, { ex: 86400 })

  return NextResponse.json({ url: data.data[0].url, used: used + 1, limit: limit.imgs })
}
