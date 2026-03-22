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

interface RawNode {
  type?: string
  data?: Record<string, unknown>
}

async function syncSchedule(workflowId: string, email: string, nodes: unknown[]) {
  const scheduleNode = (nodes as RawNode[]).find(n => n.type === 'schedule')
  if (scheduleNode?.data?.cron) {
    const cronExpression = String(scheduleNode.data.cron)
    await kv.set(`schedule:${workflowId}`, {
      email,
      cronExpression,
      workflowId,
      enabled: true,
    })
    await kv.sadd('scheduled-workflows', workflowId)
    console.log(`[save] registered schedule for ${workflowId}: ${cronExpression}`)
  } else {
    // No schedule node — remove from scheduled set
    const existing = await kv.get(`schedule:${workflowId}`)
    if (existing) {
      await kv.del(`schedule:${workflowId}`)
      await kv.srem('scheduled-workflows', workflowId)
      console.log(`[save] removed schedule for ${workflowId}`)
    }
  }
}

async function syncWebhook(workflowId: string, email: string, nodes: unknown[], existingNodes?: unknown[]) {
  const webhookNode = (nodes as RawNode[]).find(n => n.type === 'webhook')
  if (webhookNode?.data?.path) {
    const path = String(webhookNode.data.path)
    await kv.set(`webhook-path:${path}`, { workflowId, email })
    console.log(`[save] registered webhook path "${path}" for ${workflowId}`)
  } else {
    // No webhook node — remove old path if it existed
    const oldNodes = (existingNodes ?? []) as RawNode[]
    const oldPath = oldNodes.find(n => n.type === 'webhook')?.data?.path
    if (oldPath) {
      await kv.del(`webhook-path:${String(oldPath)}`)
      console.log(`[save] removed webhook path for ${workflowId}`)
    }
  }
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

  let body: {
    workflowId?: string | null
    name?: string
    nodes?: unknown[]
    edges?: unknown[]
    duplicateId?: string
  }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const now = new Date().toISOString()

  try {
    // ── Duplicate workflow ────────────────────────────────────────────────
    if (body.duplicateId) {
      const original = await kv.get<WorkflowRecord>(`workflow:${body.duplicateId}`)
      if (!original || original.userId !== email) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      const id = genId()
      const copy: WorkflowRecord = {
        ...original,
        id,
        name: `Copy of ${original.name}`,
        createdAt: now,
        updatedAt: now,
        lastRun: undefined,
      }
      await kv.set(`workflow:${id}`, copy)
      await kv.lpush(`workflows:${email}`, id)
      return NextResponse.json({ id, success: true, workflow: copy })
    }

    const { workflowId, name, nodes = [], edges = [] } = body

    // ── Update existing ───────────────────────────────────────────────────
    if (workflowId) {
      const existing = await kv.get<WorkflowRecord>(`workflow:${workflowId}`)
      if (!existing || existing.userId !== email) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      const updated: WorkflowRecord = { ...existing, name: name ?? existing.name, nodes, edges, updatedAt: now }
      await kv.set(`workflow:${workflowId}`, updated)
      await syncSchedule(workflowId, email, nodes)
      await syncWebhook(workflowId, email, nodes, existing.nodes)
      return NextResponse.json({ id: workflowId, success: true })
    }

    // ── Create new ────────────────────────────────────────────────────────
    const id = genId()
    const record: WorkflowRecord = {
      id, userId: email, name: name ?? 'Untitled Workflow',
      nodes, edges, createdAt: now, updatedAt: now, status: 'active',
    }
    await kv.set(`workflow:${id}`, record)
    await kv.lpush(`workflows:${email}`, id)
    await syncSchedule(id, email, nodes)
    await syncWebhook(id, email, nodes)
    return NextResponse.json({ id, success: true })
  } catch (err) {
    console.error('[workflows/save]', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = session.email.toLowerCase()

  let body: { workflowId?: string }
  try {
    body = await req.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { workflowId } = body
  if (!workflowId) {
    return NextResponse.json({ error: 'Missing workflowId' }, { status: 400 })
  }

  try {
    const existing = await kv.get<WorkflowRecord>(`workflow:${workflowId}`)
    if (!existing || existing.userId !== email) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    // Clean up webhook path before deleting workflow record
    const webhookPath = (existing.nodes as RawNode[]).find(n => n.type === 'webhook')?.data?.path
    if (webhookPath) await kv.del(`webhook-path:${String(webhookPath)}`)

    await kv.del(`workflow:${workflowId}`)
    await kv.lrem(`workflows:${email}`, 0, workflowId)
    await kv.del(`schedule:${workflowId}`)
    await kv.srem('scheduled-workflows', workflowId)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[workflows/delete]', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
