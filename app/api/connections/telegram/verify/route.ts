import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { code?: string }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const code = body.code?.trim()
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const chatId = await kv.get<string>(`telegram-verify:${code}`)
  if (!chatId) {
    return NextResponse.json({ error: 'Invalid or expired code — get a fresh code from the bot' }, { status: 400 })
  }

  const email = session.email.toLowerCase()
  await kv.set(`telegram-chatid:${email}`, chatId)
  await kv.del(`telegram-verify:${code}`)

  return NextResponse.json({ success: true, chatId })
}
