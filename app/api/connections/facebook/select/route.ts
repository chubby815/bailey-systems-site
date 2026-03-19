import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv, saveFacebookPage } from '@/lib/kv'

interface PendingPages {
  email: string
  pages: Array<{ id: string; name: string; access_token: string; fan_count?: number }>
}

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let token: string, pageId: string
  try {
    const body = await req.json() as { token?: unknown; pageId?: unknown }
    if (!body.token || typeof body.token !== 'string') {
      return NextResponse.json({ error: 'token is required' }, { status: 400 })
    }
    if (!body.pageId || typeof body.pageId !== 'string') {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 })
    }
    token  = body.token
    pageId = body.pageId
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const pending = await kv.get<PendingPages>(`fb-pages-pending:${token}`)
  if (!pending) {
    return NextResponse.json({ error: 'Session expired. Please reconnect Facebook.' }, { status: 404 })
  }

  // Verify the token belongs to this session
  if (pending.email !== session.email.toLowerCase()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const page = pending.pages.find(p => p.id === pageId)
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }

  await saveFacebookPage(session.email.toLowerCase(), {
    pageId:          page.id,
    pageName:        page.name,
    pageAccessToken: page.access_token,
    connectedAt:     new Date().toISOString(),
  })

  // Clean up the temporary pending key
  await kv.del(`fb-pages-pending:${token}`)

  console.log(`[facebook/select] connected page "${page.name}" for ${session.email}`)
  return NextResponse.json({ success: true, pageName: page.name })
}
