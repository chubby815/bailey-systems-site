import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

interface TwilioConfig {
  provider: 'twilio'
  accountSid: string
  authToken: string
  from: string
}

interface MetaConfig {
  provider: 'meta'
  token: string
  phoneId: string
}

type WhatsAppConfig = TwilioConfig | MetaConfig

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: WhatsAppConfig
  try {
    body = await req.json() as WhatsAppConfig
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.provider || !['twilio', 'meta'].includes(body.provider)) {
    return NextResponse.json({ error: 'provider must be twilio or meta' }, { status: 400 })
  }

  if (body.provider === 'twilio') {
    const cfg = body as TwilioConfig
    if (!cfg.accountSid || !cfg.authToken || !cfg.from) {
      return NextResponse.json({ error: 'Twilio requires accountSid, authToken, and from' }, { status: 400 })
    }
  }

  if (body.provider === 'meta') {
    const cfg = body as MetaConfig
    if (!cfg.token || !cfg.phoneId) {
      return NextResponse.json({ error: 'Meta requires token and phoneId' }, { status: 400 })
    }
  }

  await kv.set(`whatsapp-config:${session.email.toLowerCase()}`, body)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await kv.del(`whatsapp-config:${session.email.toLowerCase()}`)
  return NextResponse.json({ success: true })
}
