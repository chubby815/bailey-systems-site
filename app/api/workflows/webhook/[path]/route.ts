import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

export const maxDuration = 60

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string }> },
) {
  const { path } = await params
  const registration = await kv.get(`webhook-path:${path}`)
  if (!registration) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
  }
  return NextResponse.json({ active: true, path })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string }> },
) {
  const { path } = await params

  const registration = await kv.get<{ workflowId: string; email: string }>(
    `webhook-path:${path}`,
  )
  if (!registration) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
  }

  const { workflowId, email } = registration

  // Capture the incoming payload as a string for context injection
  let triggerData = ''
  try {
    const json = await req.json() as unknown
    triggerData = JSON.stringify(json)
  } catch {
    triggerData = await req.text()
  }

  const cronSecret = process.env.CRON_SECRET ?? 'cron'

  const runRes = await fetch(`${BASE_URL}/api/workflows/run`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'x-cron-secret': cronSecret,
    },
    body: JSON.stringify({ workflowId, _cronEmail: email, triggerData }),
  })

  const result = await runRes.json() as { logs?: unknown[] }
  return NextResponse.json({ success: runRes.ok, logs: result.logs ?? [] })
}
