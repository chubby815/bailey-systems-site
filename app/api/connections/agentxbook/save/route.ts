import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { apiKey?: string }
  try {
    body = await req.json() as { apiKey?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const apiKey = String(body.apiKey ?? '').trim()
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 400 })
  }

  const email = session.email.toLowerCase()
  await kv.set(`agentxbook_key:${email}`, apiKey)

  return NextResponse.json({ success: true })
}

