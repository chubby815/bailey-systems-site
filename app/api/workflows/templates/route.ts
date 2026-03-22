import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const TEMPLATES = [
  {
    id: 'daily-instagram',
    name: 'Daily AI Instagram Post',
    description: 'Runs every morning — AI writes a caption, generates an image, posts to Instagram automatically.',
    icon: '📸',
    category: 'Social Media',
    nodes: [
      { id: 'n1', type: 'schedule',      position: { x: 80,  y: 150 }, data: { label: 'Every Morning',   cron: '0 9 * * *' } },
      { id: 'n2', type: 'baileyWrite',   position: { x: 320, y: 100 }, data: { label: 'Write Caption',   prompt: 'Write an engaging Instagram caption for a small business. Make it friendly, include 3 relevant hashtags.', outputVar: 'aiText' } },
      { id: 'n3', type: 'baileyImage',   position: { x: 320, y: 240 }, data: { label: 'Generate Image',  prompt: 'A professional, vibrant business photo suitable for Instagram' } },
      { id: 'n4', type: 'instagramPost', position: { x: 580, y: 150 }, data: { label: 'Post to Instagram', caption: '{{aiText}}', imageUrl: '{{imageUrl}}' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n1', target: 'n3' },
      { id: 'e3', source: 'n2', target: 'n4' },
      { id: 'e4', source: 'n3', target: 'n4' },
    ],
  },
  {
    id: 'lead-alert',
    name: 'New Lead Alert',
    description: 'Find leads in any industry and instantly send them to your Telegram.',
    icon: '🎯',
    category: 'Leads',
    nodes: [
      { id: 'n1', type: 'manual',          position: { x: 80,  y: 150 }, data: { label: 'Manual Trigger' } },
      { id: 'n2', type: 'baileyFindLeads', position: { x: 320, y: 150 }, data: { label: 'Find Leads', industry: 'Restaurant', location: 'Chicago', count: '5' } },
      { id: 'n3', type: 'telegram',        position: { x: 580, y: 150 }, data: { label: 'Send to Telegram', message: '{{leads}}' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  {
    id: 'weekly-newsletter',
    name: 'Weekly Email Newsletter',
    description: 'Every Monday, AI writes a newsletter and sends it to your list automatically.',
    icon: '✉️',
    category: 'Email',
    nodes: [
      { id: 'n1', type: 'schedule',    position: { x: 80,  y: 150 }, data: { label: 'Every Monday', cron: '0 8 * * 1' } },
      { id: 'n2', type: 'baileyWrite', position: { x: 320, y: 150 }, data: { label: 'Write Newsletter', prompt: 'Write a short, engaging weekly newsletter for a small business. Include a tip, an insight, and a call to action.', outputVar: 'aiText' } },
      { id: 'n3', type: 'sendEmail',   position: { x: 580, y: 150 }, data: { label: 'Send Newsletter', toEmail: '', subject: 'Your Weekly Update from Bailey', body: '{{aiText}}' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  {
    id: 'webhook-slack',
    name: 'Webhook → AI Summary → Slack',
    description: 'Receive any webhook, summarize the data with AI, post to Slack instantly.',
    icon: '⚡',
    category: 'Automation',
    nodes: [
      { id: 'n1', type: 'webhook',     position: { x: 80,  y: 150 }, data: { label: 'Webhook', path: 'my-hook' } },
      { id: 'n2', type: 'baileyWrite', position: { x: 320, y: 150 }, data: { label: 'Summarize', prompt: 'Summarize this data in 2 sentences: {{webhookData}}', outputVar: 'aiText' } },
      { id: 'n3', type: 'slack',       position: { x: 580, y: 150 }, data: { label: 'Post to Slack', channel: '#general', message: '{{aiText}}' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  {
    id: 'build-announce',
    name: 'Build Site & Announce',
    description: 'Generate a complete AI website and send the live URL to Telegram instantly.',
    icon: '🌐',
    category: 'Sites',
    nodes: [
      { id: 'n1', type: 'manual',          position: { x: 80,  y: 150 }, data: { label: 'Manual Trigger' } },
      { id: 'n2', type: 'baileyBuildSite', position: { x: 320, y: 150 }, data: { label: 'Build Site', businessName: 'My Business', industry: 'Consulting', tone: 'Professional' } },
      { id: 'n3', type: 'telegram',        position: { x: 580, y: 150 }, data: { label: 'Send URL', message: 'Your new site is live: {{siteUrl}}' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  {
    id: 'facebook-daily',
    name: 'Daily Facebook Post',
    description: 'AI writes and publishes a post to your Facebook page every day.',
    icon: '📘',
    category: 'Social Media',
    nodes: [
      { id: 'n1', type: 'schedule',     position: { x: 80,  y: 150 }, data: { label: 'Every Day', cron: '0 10 * * *' } },
      { id: 'n2', type: 'baileyWrite',  position: { x: 320, y: 150 }, data: { label: 'Write Post', prompt: 'Write an engaging Facebook post for a small business. Keep it under 150 words, friendly tone.', outputVar: 'aiText' } },
      { id: 'n3', type: 'facebookPost', position: { x: 580, y: 150 }, data: { label: 'Post to Facebook', content: '{{aiText}}' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
]

export async function GET() {
  return NextResponse.json({ templates: TEMPLATES })
}

export async function POST(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = session.email.toLowerCase()

  let body: { templateId: string }
  try {
    body = await req.json() as { templateId: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const template = TEMPLATES.find(t => t.id === body.templateId)
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const id  = genId()
  const now = new Date().toISOString()
  const record = {
    id,
    userId:    email,
    name:      template.name,
    nodes:     template.nodes,
    edges:     template.edges,
    createdAt: now,
    updatedAt: now,
    status:    'active' as const,
  }

  await kv.set(`workflow:${id}`, record)
  await kv.lpush(`workflows:${email}`, id)

  return NextResponse.json({ id, success: true })
}
