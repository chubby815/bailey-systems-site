import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

interface PendingPages {
  email: string
  pages: Array<{ id: string; name: string; access_token: string; fan_count?: number }>
}

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const pending = await kv.get<PendingPages>(`fb-pages-pending:${token}`)
  if (!pending) {
    return NextResponse.json({ error: 'Session expired. Please reconnect Facebook.' }, { status: 404 })
  }

  // Verify the token belongs to this session
  if (pending.email !== session.email.toLowerCase()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Return page names + IDs only — never expose access_tokens to the client
  const pages = pending.pages.map(p => ({
    id:        p.id,
    name:      p.name,
    fanCount:  p.fan_count,
  }))

  return NextResponse.json({ pages })
}
