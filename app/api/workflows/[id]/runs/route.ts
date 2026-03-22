import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

interface WorkflowRecord {
  userId: string
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const wf = await kv.get<WorkflowRecord>(`workflow:${id}`)
    if (!wf || wf.userId !== session.email.toLowerCase()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const runs = await kv.lrange(`run-history:${id}`, 0, 19)

    return NextResponse.json({ runs: runs ?? [] })
  } catch (err) {
    console.error('[workflows/runs]', err)
    return NextResponse.json({ error: 'Server error', runs: [] }, { status: 500 })
  }
}
