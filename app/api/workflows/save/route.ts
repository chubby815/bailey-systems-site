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

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = session.email.toLowerCase()

  let body: { workflowId?: string; name?: string; nodes?: unknown[]; edges?: unknown[] }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { workflowId, name, nodes = [], edges = [] } = body
  const now = new Date().toISOString()

  try {
    if (workflowId) {
      // Update existing
      const existing = await kv.get<WorkflowRecord>(`workflow:${workflowId}`)
      if (!existing || existing.userId !== email) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      const updated: WorkflowRecord = { ...existing, name: name ?? existing.name, nodes, edges, updatedAt: now }
      await kv.set(`workflow:${workflowId}`, updated)
      return NextResponse.json({ id: workflowId, success: true })
    } else {
      // Create new
      const id = genId()
      const record: WorkflowRecord = {
        id, userId: email, name: name ?? 'Untitled Workflow',
        nodes, edges, createdAt: now, updatedAt: now, status: 'active',
      }
      await kv.set(`workflow:${id}`, record)
      await kv.lpush(`workflows:${email}`, id)
      return NextResponse.json({ id, success: true })
    }
  } catch (err) {
    console.error('[workflows/save]', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
