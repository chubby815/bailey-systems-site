import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

const VALID_TOKENS = new Set(['bailey_pro_2026', 'bailey_elite_2026'])
const VALID_TYPES = new Set(['msg', 'img'])

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token || !VALID_TOKENS.has(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]
  const msgKey = `usage:${token}:msg:${today}`
  const imgKey = `usage:${token}:img:${today}`

  const msgs = (await kv.get<number>(msgKey)) || 0
  const imgs = (await kv.get<number>(imgKey)) || 0

  return NextResponse.json({ msgs, imgs })
}

export async function POST(req: NextRequest) {
  const { token, type } = await req.json()

  if (!token || !VALID_TOKENS.has(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!type || !VALID_TYPES.has(type)) {
    return NextResponse.json({ error: 'Invalid usage type' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]
  const key = `usage:${token}:${type}:${today}`

  const current = (await kv.get<number>(key)) || 0
  await kv.set(key, current + 1, { ex: 86400 })

  return NextResponse.json({ count: current + 1 })
}
