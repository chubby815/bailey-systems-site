import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

interface WorkflowRecord {
  id: string
  userId: string
  name: string
  nodes: unknown[]
  edges: unknown[]
  createdAt: string
  updatedAt: string
  lastRun?: string
  status: 'active' | 'paused'
}

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = session.email.toLowerCase()

  try {
    const ids = await kv.lrange<string>(`workflows:${email}`, 0, 49)
    const workflows = (
      await Promise.all(ids.map(id => kv.get<WorkflowRecord>(`workflow:${id}`)))
    ).filter((w): w is WorkflowRecord => !!w && w.userId === email)

    return NextResponse.json({ workflows })
  } catch (err) {
    console.error('[workflows/list]', err)
    return NextResponse.json({ error: 'Failed to load workflows' }, { status: 500 })
  }
}
