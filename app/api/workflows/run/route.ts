import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const maxDuration = 300

import { kv, saveSite } from '@/lib/kv'
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
  baileyImage:     'imageUrl',
  sendEmail:       'emailResult',
  whatsApp:        'whatsAppResult',
  telegram:        'telegramResult',
  slack:           'slackResult',
  facebookPost:    'postResult',
  instagramPost:   'instagramResult',
  linkedinPost:    'linkedinResult',
  schedule:        'trigger',
  manual:          'trigger',
  webhook:         'trigger',
}

// Resolve {{variableName}} in a string from the context map
function resolveVars(template: string, ctx: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => ctx[key] ?? `{{${key}}}`)
}

// Type priority for fallback ordering when edges are missing
const TYPE_PRIORITY: Record<string, number> = {
  manual:          0,
  schedule:        0,
  webhook:         0,
  baileyWrite:     1,
  baileyFindLeads: 1,
  baileyBuildSite: 1,
  baileyImage:     1,
  aiAgent:         1,
  sendEmail:       2,
  whatsApp:        2,
  telegram:        2,
  slack:           2,
  facebookPost:    2,
  instagramPost:   2,
  linkedinPost:    2,
  googleSheets:    2,
  ifCondition:     3,
  delay:           3,
}

// Build topological execution order (BFS from nodes with no incoming edges)
// Falls back to TYPE_PRIORITY sort so Triggers → AI → Actions → Logic
// even when edges are missing or incomplete
function executionOrder(nodes: RFNode[], edges: RFEdge[]): RFNode[] {
  const incomingCount = new Map<string, number>()
  nodes.forEach(n => incomingCount.set(n.id, 0))
  edges.forEach(e => incomingCount.set(e.target, (incomingCount.get(e.target) ?? 0) + 1))

  const queue = nodes
    .filter(n => (incomingCount.get(n.id) ?? 0) === 0)
    .sort((a, b) => (TYPE_PRIORITY[a.type ?? ''] ?? 99) - (TYPE_PRIORITY[b.type ?? ''] ?? 99))

  const visited = new Set<string>()
  const order: RFNode[] = []

  while (queue.length > 0) {
    const node = queue.shift()!
    if (visited.has(node.id)) continue
    visited.add(node.id)
    order.push(node)

    const nextNodes = edges
      .filter(e => e.source === node.id)
      .map(e => nodes.find(n => n.id === e.target))
      .filter((n): n is RFNode => !!n && !visited.has(n.id))
      .sort((a, b) => (TYPE_PRIORITY[a.type ?? ''] ?? 99) - (TYPE_PRIORITY[b.type ?? ''] ?? 99))

    queue.push(...nextNodes)
  }

  return order
}

// Execute a single node and return its output string
async function executeNode(
  node: RFNode,
  ctx: Record<string, string>,
  anthropic: Anthropic,
  email: string,
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
      const industry     = resolveVars((d.industry as string) || 'Consulting', ctx)
      const tone         = resolveVars((d.tone as string) || 'Professional', ctx)
      const location     = resolveVars((d.location as string) || 'United States', ctx)
      const services     = resolveVars((d.services as string) || industry, ctx)
      const primaryColor = (d.primaryColor as string) || 'Emerald Green'

      const { generateSiteHTML } = await import('@/lib/generate-site-html')

      const generatedHTML = await generateSiteHTML({
        businessName,
        industry,
        location,
        services,
        tone,
        primaryColor,
        fontStyle:   'Modern',
        heroStyle:   'Gradient Background',
        layoutStyle: 'Standard',
      })

      // Build slug and siteId
      const baseSlug     = businessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 55)
      const suffix       = Math.random().toString(36).substring(2, 6)
      const existingSlug = await kv.get(`slug:${baseSlug}`)
      const subdomainSlug = existingSlug ? `${baseSlug}-${suffix}` : baseSlug
      const siteId        = `${subdomainSlug}-${suffix}`

      await saveSite(siteId, {
        siteId,
        userId:        email,
        businessName,
        industry,
        location,
        services,
        tone,
        primaryColor,
        contactEmail:  '',
        contactPhone:  '',
        generatedContent: {
          hero:         { headline: `${industry} Services`, subheadline: businessName, ctaText: 'Get Started', badge: location },
          services:     [{ name: services, description: `Professional ${industry} services`, icon: '✓' }],
          about:        { title: businessName, body: `${businessName} provides professional ${industry} services.`, stats: [] },
          testimonials: [],
          cta:          { headline: 'Get Started', subtext: 'Contact us today', buttonText: 'Contact Us' },
          seo:          { title: `${businessName} — ${industry}`, description: `${businessName} provides professional ${industry} services.` },
        },
        generatedHTML,
        createdAt:     new Date().toISOString(),
        subdomainSlug,
      })

      await kv.set(`slug:${subdomainSlug}`, siteId)

      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'
      return `${BASE_URL}/sites/${siteId}`
    }

    case 'baileyImage': {
      const prompt = resolveVars((d.prompt as string) || 'A professional business photo, high quality', ctx)
      const OpenAI = (await import('openai')).default
      const grok = new OpenAI({
        apiKey: process.env.GROK_API_KEY!,
        baseURL: 'https://api.x.ai/v1',
      })
      const response = await grok.images.generate({
        model: 'grok-imagine-image',
        prompt,
        n: 1,
        response_format: 'b64_json',
      } as Parameters<typeof grok.images.generate>[0])
      const b64 = response.data?.[0]
        ? (response.data[0] as { b64_json?: string }).b64_json
        : undefined
      if (!b64) throw new Error('Grok image generation returned no image data')
      const { put } = await import('@vercel/blob')
      const buffer = Buffer.from(b64, 'base64')
      const blob = await put(`workflow-images/${Date.now()}.jpg`, buffer, {
        access: 'public', contentType: 'image/jpeg',
      })
      return blob.url
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
      let to = resolveVars((d.toEmail as string) || '', ctx)

      // Auto extract email from leads context if toEmail is empty
      if (!to && ctx['leads']) {
        try {
          const leads: unknown = JSON.parse(ctx['leads'])
          const first = Array.isArray(leads) ? (leads[0] as Record<string, string>) : (leads as Record<string, string>)
          to = first?.email || first?.Email || ''
        } catch {
          // not JSON — skip
        }
      }

      const subject = resolveVars((d.subject as string) || 'Message from Bailey', ctx)

      // Auto-chain: if body is empty or has no {{vars}}, use aiText from context
      const rawBody = (d.body as string) || ''
      const html = rawBody.includes('{{')
        ? resolveVars(rawBody, ctx)
        : ctx['aiText'] ?? ctx['aiOutput'] ?? rawBody

      if (!to) return 'No email address found — skipped'
      await resend.emails.send({
        from: 'Bailey Agents <noreply@baileyagents.com>',
        to,
        subject,
        html: html.replace(/\n/g, '<br>'),
      })
      return `Email sent to ${to}`
    }

    case 'whatsApp': {
      const nodeProvider = (d.provider as string) || ''
      // Support both old field name (toPhone) and new (to)
      const to = resolveVars((d.to as string) || (d.toPhone as string) || '', ctx)

      // Auto-chain: if message is empty or has no {{vars}}, use aiText or leads
      const rawMsg  = (d.message as string) || ''
      const message = rawMsg.includes('{{')
        ? resolveVars(rawMsg, ctx)
        : ctx['aiText'] ?? ctx['leads'] ?? rawMsg

      if (!to) return 'WhatsApp — no recipient — skipped'

      // Load saved user config from Redis (used when node fields are blank or env vars missing)
      const savedWA = await kv.get<{
        provider: string
        accountSid?: string
        authToken?: string
        from?: string
        token?: string
        phoneId?: string
      }>(`whatsapp-config:${email}`)

      const resolvedProvider = nodeProvider || savedWA?.provider || 'twilio'

      if (resolvedProvider === 'twilio' || savedWA?.provider === 'twilio') {
        const accountSid = process.env.TWILIO_ACCOUNT_SID ?? savedWA?.accountSid
        const authToken  = process.env.TWILIO_AUTH_TOKEN  ?? savedWA?.authToken
        const from       = process.env.TWILIO_WHATSAPP_FROM
          ?? process.env.TWILIO_WHATSAPP_NUMBER
          ?? savedWA?.from

        if (!accountSid || !authToken || !from) {
          return 'WhatsApp not configured — connect in Settings → Connections'
        }

        const fromFmt = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`
        const toFmt   = to.startsWith('whatsapp:')   ? to   : `whatsapp:${to}`
        const resp = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ From: fromFmt, To: toFmt, Body: message }),
          },
        )
        if (!resp.ok) throw new Error(await resp.text())
        return `WhatsApp sent via Twilio to ${to}`
      }

      if (resolvedProvider === 'meta' || savedWA?.provider === 'meta') {
        const token   = process.env.META_WHATSAPP_TOKEN    ?? savedWA?.token
        const phoneId = process.env.META_WHATSAPP_PHONE_ID ?? savedWA?.phoneId

        if (!token || !phoneId) {
          return 'WhatsApp Meta not configured — connect in Settings → Connections'
        }

        const resp = await fetch(
          `https://graph.facebook.com/v18.0/${phoneId}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: to.replace('+', ''),
              type: 'text',
              text: { body: message },
            }),
          },
        )
        if (!resp.ok) throw new Error(await resp.text())
        return `WhatsApp sent via Meta to ${to}`
      }

      return 'WhatsApp not connected — go to Settings → Connections'
    }

    case 'facebookPost': {
      // Auto-chain: if content is empty or has no {{vars}}, use aiText
      const rawContent = (d.content as string) || ''
      const content = rawContent.includes('{{')
        ? resolveVars(rawContent, ctx)
        : ctx['aiText'] ?? rawContent

      if (!content.trim()) return 'Facebook Post — no content — skipped'

      const fbPage = await kv.get<{ pageId: string; pageAccessToken: string; pageName: string }>(
        `facebook:${email}`
      )
      if (!fbPage) return 'Facebook not connected — connect in Settings → Connections'

      const fbRes = await fetch(
        `https://graph.facebook.com/v18.0/${fbPage.pageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content, access_token: fbPage.pageAccessToken }),
        }
      )
      if (!fbRes.ok) {
        const fbErr = await fbRes.json() as { error?: { message: string } }
        throw new Error(fbErr.error?.message ?? 'Facebook post failed')
      }
      return `Posted to Facebook page "${fbPage.pageName}": ${content.slice(0, 60)}…`
    }

    case 'instagramPost': {
      // Auto-chain: if caption is empty or has no {{vars}}, use aiText
      const rawCaption = (d.caption as string) || ''
      const caption = rawCaption.includes('{{')
        ? resolveVars(rawCaption, ctx)
        : ctx['aiText'] ?? rawCaption

      const imageUrl = resolveVars((d.imageUrl as string) || '', ctx)

      if (!imageUrl.trim()) return 'Instagram Post — imageUrl is required — skipped'

      const igAccount = await kv.get<{ accountId: string; pageAccessToken: string; username: string }>(
        `instagram:${email}`
      )
      if (!igAccount) return 'Instagram not connected — connect in Settings → Connections'

      // Step 1: Create media container
      const containerRes = await fetch(
        `https://graph.facebook.com/v18.0/${igAccount.accountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url:    imageUrl,
            caption:      caption,
            access_token: igAccount.pageAccessToken,
          }),
        }
      )
      if (!containerRes.ok) {
        const containerErr = await containerRes.json() as { error?: { message: string } }
        throw new Error(containerErr.error?.message ?? 'Instagram media container creation failed')
      }
      const containerData = await containerRes.json() as { id?: string }
      if (!containerData.id) throw new Error('Instagram container ID missing')

      // Step 2: Publish the container
      const publishRes = await fetch(
        `https://graph.facebook.com/v18.0/${igAccount.accountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id:  containerData.id,
            access_token: igAccount.pageAccessToken,
          }),
        }
      )
      if (!publishRes.ok) {
        const publishErr = await publishRes.json() as { error?: { message: string } }
        throw new Error(publishErr.error?.message ?? 'Instagram publish failed')
      }
      return `Posted to Instagram @${igAccount.username}: ${caption.slice(0, 60)}…`
    }

    case 'telegram': {
      // Use node field first, then fall back to user's saved connection
      let chatId = resolveVars((d.chatId as string) || '', ctx)
      if (!chatId) {
        const saved = await kv.get<string>(`telegram-chatid:${email}`)
        if (saved) chatId = saved
      }

      const rawMsg  = (d.message as string) || ''
      const message = (rawMsg && rawMsg.includes('{{'))
        ? resolveVars(rawMsg, ctx)
        : ctx['aiText'] ?? ctx['leads'] ?? rawMsg

      if (!message || message.trim() === '') {
        return 'Telegram skipped — no message content'
      }

      const token = process.env.TELEGRAM_BOT_TOKEN
      if (!token) return 'Telegram — TELEGRAM_BOT_TOKEN not configured — skipped'
      if (!chatId) return 'Telegram not connected — add a Chat ID or connect in dashboard/connections'

      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
        },
      )
      if (!res.ok) throw new Error(await res.text())
      return `Telegram message sent to ${chatId}`
    }

    case 'slack': {
      // Use node field first, then fall back to user's saved connection
      let webhookUrl = resolveVars((d.webhookUrl as string) || '', ctx)
      if (!webhookUrl) {
        const saved = await kv.get<string>(`slack-webhook:${email}`)
        if (saved) webhookUrl = saved
      }

      const channel    = resolveVars((d.channel as string) || '#general', ctx)
      const rawMsg     = (d.message as string) || ''
      const message    = rawMsg.includes('{{')
        ? resolveVars(rawMsg, ctx)
        : ctx['aiText'] ?? ctx['leads'] ?? rawMsg

      if (!webhookUrl) return 'Slack not connected — paste a webhook URL or connect in dashboard/connections'

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          text: message,
          username: 'Bailey',
          icon_emoji: ':robot_face:',
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      return `Slack message sent to ${channel}`
    }

    case 'linkedinPost': {
      const rawContent = (d.content as string) || ''
      const content    = rawContent.includes('{{')
        ? resolveVars(rawContent, ctx)
        : ctx['aiText'] ?? rawContent

      const imageUrl = resolveVars((d.imageUrl as string) || '', ctx)

      if (!content.trim()) throw new Error('LinkedIn Post — no content to post')

      const li = await kv.get<{ accessToken: string; personId: string; name: string }>(`linkedin:${email}`)
      if (!li?.accessToken || !li?.personId) {
        throw new Error('LinkedIn account not connected — go to Dashboard → Connections → LinkedIn')
      }

      const postBody: Record<string, unknown> = {
        author:      `urn:li:person:${li.personId}`,
        commentary:  imageUrl ? `${content}\n\n${imageUrl}` : content,
        visibility:  'PUBLIC',
        distribution: {
          feedDistribution:              'MAIN_FEED',
          targetEntities:               [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState:              'PUBLISHED',
        isReshareDisableForOperator: false,
      }

      const postRes = await fetch('https://api.linkedin.com/rest/posts', {
        method: 'POST',
        headers: {
          'Authorization':              `Bearer ${li.accessToken}`,
          'Content-Type':               'application/json',
          'LinkedIn-Version':           '202304',
          'X-Restli-Protocol-Version':  '2.0.0',
        },
        body: JSON.stringify(postBody),
      })

      if (!postRes.ok) {
        const errText = await postRes.text()
        console.error('[linkedinPost] failed:', errText)
        throw new Error(`LinkedIn post failed (${postRes.status}) — check your connection`)
      }

      return `Posted to LinkedIn as ${li.name}`
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

    // ── Admin bypass ──────────────────────────────────────────────────────────
    const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'lilianajs27@gmail.com').toLowerCase()
    const isAdmin = session.email.toLowerCase() === ADMIN_EMAIL
    if (isAdmin) {
      console.log('[workflows] admin bypass for', session.email)
    }

    // ── Plan enforcement (skipped for admin) ──────────────────────────────────
    if (!isAdmin) {
      const sub = await kv.get<{ plan: string; status: string; trialEnd?: string }>(
        `sub:${session.email}`
      )
      const plan     = sub?.plan   ?? 'trial'
      const status   = sub?.status ?? 'trialing'
      const isTrialing = status === 'trialing'
      const isPro      = plan === 'pro'

      if (!isPro && !isTrialing) {
        // starter, growth, or any unknown non-pro plan
        return NextResponse.json({
          logs: [{
            nodeId: 'system', nodeType: 'system', nodeLabel: 'Upgrade Required',
            status: 'error',
            message: '🔒 Workflows are available on Pro plan only. Upgrade at baileyagents.com/pricing',
            timestamp: new Date().toISOString(),
          }],
        }, { status: 403 })
      }

      if (isTrialing) {
        const runsKey = `workflow-runs:${session.email}`
        const runs    = await kv.get<number>(runsKey) ?? 0
        if (runs >= 3) {
          return NextResponse.json({
            logs: [{
              nodeId: 'system', nodeType: 'system', nodeLabel: 'Trial Limit Reached',
              status: 'error',
              message: '⏳ You have used all 3 free trial workflow runs. Upgrade to Pro ($149/mo) for unlimited workflows. baileyagents.com/pricing',
              timestamp: new Date().toISOString(),
            }],
          }, { status: 403 })
        }
        await kv.set(runsKey, runs + 1)
        console.log(`[workflows] trial run ${runs + 1}/3 for ${session.email}`)
      }
      // Pro = unlimited ✅
    }
    // ─────────────────────────────────────────────────────────────────────────

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
        const output = await executeNode(node, context, anthropic, session.email.toLowerCase())
        const durationMs = Date.now() - start

        // Store under predictable auto name (e.g. "aiText") and always also under node ID
        const autoName = autoVarNames[node.type ?? '']
        const userVar  = (node.data.outputVar as string) || ''
        const varName  = userVar || autoName || node.id
        context[varName] = output
        // Also store under node ID so {{nodeId}} references always work
        if (varName !== node.id) context[node.id] = output

        console.log(`[WORKFLOW] node ${node.type} stored as "${varName}" = "${output.slice(0, 50)}..."`)
        console.log(`[WORKFLOW] context keys:`, Object.keys(context))

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

    // Update lastRun + save run history
    if (workflowId) {
      const wf = await kv.get<WorkflowRecord>(`workflow:${workflowId}`)
      if (wf) await kv.set(`workflow:${workflowId}`, { ...wf, lastRun: new Date().toISOString() })

      const hasError = logs.some(l => l.status === 'error')
      const errorEntry = logs.find(l => l.status === 'error')
      const runSummary = {
        runId:        String(Date.now()),
        runAt:        new Date().toISOString(),
        status:       hasError ? 'error' : 'success',
        durationMs:   logs.reduce((sum, l) => sum + (l.durationMs ?? 0), 0),
        nodeCount:    logs.length,
        errorMessage: errorEntry?.message?.slice(0, 120),
      }
      await kv.lpush(`run-history:${workflowId}`, runSummary)
      await kv.ltrim(`run-history:${workflowId}`, 0, 19)
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
