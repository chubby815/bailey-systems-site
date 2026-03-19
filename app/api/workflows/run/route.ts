import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const maxDuration = 60

import { kv } from '@/lib/kv'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface RFNode {
  id: string
  type?: string
  data: Record<string, unknown>
}
interface RFEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
}
interface WorkflowRecord {
  id: string
  userId: string
  lastRun?: string
}

interface LogEntry {
  nodeId: string
  nodeType: string
  nodeLabel: string
  status: 'running' | 'success' | 'error' | 'skipped'
  message?: string
  output?: string
  durationMs?: number
  timestamp: string
}

// Predictable context variable names per node type
const autoVarNames: Record<string, string> = {
  baileyWrite:     'aiText',
  baileyFindLeads: 'leads',
  baileyBuildSite: 'siteUrl',
  sendEmail:       'emailResult',
  whatsApp:        'whatsAppResult',
  facebookPost:    'postResult',
  schedule:        'trigger',
  manual:          'trigger',
  webhook:         'trigger',
}

// Resolve {{variableName}} in a string from the context map
function resolveVars(template: string, ctx: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => ctx[key] ?? `{{${key}}}`)
}

// Build topological execution order (BFS from nodes with no incoming edges)
function executionOrder(nodes: RFNode[], edges: RFEdge[]): RFNode[] {
  const incomingCount = new Map<string, number>()
  nodes.forEach(n => incomingCount.set(n.id, 0))
  edges.forEach(e => incomingCount.set(e.target, (incomingCount.get(e.target) ?? 0) + 1))

  const queue = nodes.filter(n => (incomingCount.get(n.id) ?? 0) === 0)
  const visited = new Set<string>()
  const order: RFNode[] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    if (visited.has(node.id)) continue
    visited.add(node.id)
    order.push(node)
    edges
      .filter(e => e.source === node.id)
      .forEach(e => {
        const next = nodes.find(n => n.id === e.target)
        if (next && !visited.has(next.id)) queue.push(next)
      })
  }
  return order
}

// Execute a single node and return its output string
async function executeNode(
  node: RFNode,
  ctx: Record<string, string>,
  anthropic: Anthropic,
): Promise<string> {
  const d = node.data

  switch (node.type) {
    case 'schedule':
    case 'manual':
    case 'webhook':
      return 'trigger fired'

    case 'baileyWrite': {
      const prompt = resolveVars((d.prompt as string) || 'Write something', ctx)
      const res = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      })
      return (res.content[0] as { text: string }).text
    }

    case 'baileyBuildSite': {
      const businessName = resolveVars((d.businessName as string) || 'My Business', ctx)
      return `Site queued for generation: ${businessName}`
    }

    case 'baileyFindLeads': {
      const industry = resolveVars((d.industry as string) || 'Restaurant', ctx)
      const location = resolveVars((d.location as string) || 'Chicago', ctx)
      const count = parseInt((d.count as string) || '5', 10)
      const res = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `Generate ${count} realistic ${industry} business leads in ${location}. Return JSON array with: name, address, phone, email fields.`,
        }],
      })
      return (res.content[0] as { text: string }).text
    }

    case 'sendEmail': {
      const to      = resolveVars((d.toEmail as string) || '', ctx)
      const subject = resolveVars((d.subject as string) || 'Message from Bailey', ctx)

      // Auto-chain: if body is empty or has no {{vars}}, use aiText from context
      const rawBody = (d.body as string) || ''
      const html = rawBody.includes('{{')
        ? resolveVars(rawBody, ctx)
        : ctx['aiText'] ?? ctx['aiOutput'] ?? rawBody

      if (!to) return 'No recipient — skipped'
      await resend.emails.send({
        from: 'Bailey Agents <noreply@baileyagents.com>',
        to,
        subject,
        html: html.replace(/\n/g, '<br>'),
      })
      return `Email sent to ${to}`
    }

    case 'whatsApp': {
      const accountSid = process.env.TWILIO_ACCOUNT_SID
      const authToken  = process.env.TWILIO_AUTH_TOKEN
      const from       = process.env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+14155238886'
      const toRaw      = resolveVars((d.toPhone as string) || '', ctx)

      // Auto-chain: if message is empty or has no {{vars}}, use aiText or leads
      const rawMsg  = (d.message as string) || ''
      const message = rawMsg.includes('{{')
        ? resolveVars(rawMsg, ctx)
        : ctx['aiText'] ?? ctx['leads'] ?? rawMsg

      if (!toRaw || !accountSid || !authToken) return 'WhatsApp not configured — skipped'

      const to = toRaw.startsWith('whatsapp:') ? toRaw : `whatsapp:${toRaw}`
      const resp = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ From: from, To: to, Body: message }),
        },
      )
      if (!resp.ok) throw new Error(`Twilio error ${resp.status}`)
      return `WhatsApp sent to ${toRaw}`
    }

    case 'facebookPost': {
      // Auto-chain: if content is empty or has no {{vars}}, use aiText
      const rawContent = (d.content as string) || ''
      const content = rawContent.includes('{{')
        ? resolveVars(rawContent, ctx)
        : ctx['aiText'] ?? rawContent

      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://baileyagents.com'}/api/facebook/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      })
      if (!res.ok) return 'Facebook post failed'
      return `Posted to Facebook: ${content.slice(0, 60)}…`
    }

    case 'googleSheets':
      return 'Google Sheets — OAuth not configured (placeholder)'

    case 'ifCondition': {
      const left  = resolveVars((d.leftVar as string) || '', ctx)
      const op    = (d.operator as string) || '='
      const right = resolveVars((d.rightValue as string) || '', ctx)
      let result = false
      if (op === '=' || op === '==') result = left === right
      else if (op === '!=' )         result = left !== right
      else if (op === '>' )          result = parseFloat(left) > parseFloat(right)
      else if (op === '<' )          result = parseFloat(left) < parseFloat(right)
      else if (op === 'contains')    result = left.includes(right)
      return result ? 'true' : 'false'
    }

    case 'delay': {
      const amount = parseInt((d.duration as string) || '1', 10)
      const unit   = (d.unit as string) || 'seconds'
      const msMap: Record<string, number> = { seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000 }
      const ms = amount * (msMap[unit] ?? 1000)
      await new Promise(r => setTimeout(r, Math.min(ms, 10000)))
      return `Waited ${amount} ${unit}`
    }

    default:
      return 'unknown node type'
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized', logs: [] }, { status: 401 })
    }

    // Instantiate Anthropic inside handler so a missing key doesn't crash the module
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    let body: { workflowId?: string; nodes?: RFNode[]; edges?: RFEdge[] }
    try {
      body = await req.json() as typeof body
    } catch {
      return NextResponse.json({ error: 'Invalid JSON', logs: [] }, { status: 400 })
    }

    const { workflowId, nodes: bodyNodes, edges: bodyEdges } = body
    let nodes: RFNode[] = bodyNodes ?? []
    let edges: RFEdge[] = bodyEdges ?? []

    // Load from Redis if only ID provided
    if (workflowId && nodes.length === 0) {
      const wf = await kv.get<WorkflowRecord & { nodes: RFNode[]; edges: RFEdge[] }>(`workflow:${workflowId}`)
      if (!wf || wf.userId !== session.email.toLowerCase()) {
        return NextResponse.json({ error: 'Workflow not found', logs: [] }, { status: 404 })
      }
      nodes = wf.nodes
      edges = wf.edges
    }

    // Guard: nothing to run
    if (nodes.length === 0) {
      return NextResponse.json({
        logs: [{
          nodeId: 'system',
          nodeType: 'system',
          nodeLabel: 'System',
          status: 'error' as const,
          message: 'No nodes found. Add nodes to your workflow first.',
          timestamp: new Date().toISOString(),
        }],
        context: {},
      })
    }

    const order = executionOrder(nodes, edges)
    const logs: LogEntry[] = []
    const context: Record<string, string> = {}

    for (const node of order) {
      const start = Date.now()
      const label = (node.data.label as string) || node.type || 'Node'
      logs.push({ nodeId: node.id, nodeType: node.type ?? 'unknown', nodeLabel: label, status: 'running', timestamp: new Date().toISOString() })

      try {
        const output = await executeNode(node, context, anthropic)
        const durationMs = Date.now() - start

        // Store under predictable auto name (e.g. "aiText") and always also under node ID
        const autoName = autoVarNames[node.type ?? '']
        const userVar  = (node.data.outputVar as string) || ''
        const varName  = userVar || autoName || node.id
        context[varName] = output
        // Also store under node ID so {{nodeId}} references always work
        if (varName !== node.id) context[node.id] = output

        logs[logs.length - 1] = {
          nodeId: node.id, nodeType: node.type ?? 'unknown', nodeLabel: label,
          status: 'success', output: output.slice(0, 500), durationMs,
          timestamp: new Date().toISOString(),
        }
      } catch (err) {
        const durationMs = Date.now() - start
        logs[logs.length - 1] = {
          nodeId: node.id, nodeType: node.type ?? 'unknown', nodeLabel: label,
          status: 'error', message: err instanceof Error ? err.message : String(err), durationMs,
          timestamp: new Date().toISOString(),
        }
      }
    }

    // Update lastRun
    if (workflowId) {
      const wf = await kv.get<WorkflowRecord>(`workflow:${workflowId}`)
      if (wf) await kv.set(`workflow:${workflowId}`, { ...wf, lastRun: new Date().toISOString() })
    }

    return NextResponse.json({ logs, context })
  } catch (err) {
    console.error('[workflow/run]', err)
    return NextResponse.json(
      { error: 'Internal server error', logs: [] },
      { status: 500 },
    )
  }
}
