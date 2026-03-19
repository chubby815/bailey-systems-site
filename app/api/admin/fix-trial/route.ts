import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (session?.email !== 'lilianajs27@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await kv.set('sub:poshagent88@gmail.com', {
    plan: null,
    status: 'canceled',
    email: 'poshagent88@gmail.com',
    updatedAt: new Date().toISOString(),
  })

  const sub = await kv.get('sub:poshagent88@gmail.com')

  return NextResponse.json({ success: true, sub })
}
