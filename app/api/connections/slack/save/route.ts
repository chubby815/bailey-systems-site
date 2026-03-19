import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { webhookUrl?: string }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const webhookUrl = body.webhookUrl?.trim()
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Missing webhookUrl' }, { status: 400 })
  }
  if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
    return NextResponse.json({ error: 'URL must start with https://hooks.slack.com/' }, { status: 400 })
  }

  await kv.set(`slack-webhook:${session.email.toLowerCase()}`, webhookUrl)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await kv.del(`slack-webhook:${session.email.toLowerCase()}`)
  return NextResponse.json({ success: true })
}
