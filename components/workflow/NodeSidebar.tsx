'use client'

interface NodeDef {
  type: string
  label: string
  category: string
  color: string
  defaultData: Record<string, string>
}

const NODE_DEFS: NodeDef[] = [
  // Triggers
  { type: 'schedule',         label: 'Schedule',         category: 'Triggers',  color: '#7c3aed', defaultData: { label: 'Schedule', cron: '0 9 * * *' } },
  { type: 'manual',           label: 'Manual',           category: 'Triggers',  color: '#7c3aed', defaultData: { label: 'Manual Trigger' } },
  { type: 'webhook',          label: 'Webhook',          category: 'Triggers',  color: '#7c3aed', defaultData: { label: 'Webhook', path: 'my-hook' } },
  // Bailey AI
  { type: 'baileyWrite',      label: 'Bailey Write',     category: 'Bailey AI', color: '#00e5a0', defaultData: { label: 'Bailey Write', prompt: '', outputVar: 'aiOutput' } },
  { type: 'baileyBuildSite',  label: 'Build Site',       category: 'Bailey AI', color: '#00e5a0', defaultData: { label: 'Build Site', businessName: '', industry: '', tone: 'Professional' } },
  { type: 'baileyFindLeads',  label: 'Find Leads',       category: 'Bailey AI', color: '#00e5a0', defaultData: { label: 'Find Leads', industry: '', location: '', count: '10' } },
  { type: 'baileyImage',      label: 'Bailey Image',     category: 'Bailey AI', color: '#a855f7', defaultData: { label: 'Bailey Image', prompt: '' } },
  // Actions
  { type: 'sendEmail',        label: 'Send Email',       category: 'Actions',   color: '#3b82f6', defaultData: { label: 'Send Email', toEmail: '', subject: '', body: '' } },
  { type: 'googleSheets',     label: 'Google Sheets',    category: 'Actions',   color: '#3b82f6', defaultData: { label: 'Google Sheets', spreadsheetId: '', sheetName: 'Sheet1', operation: 'append' } },
  { type: 'facebookPost',     label: 'Facebook Post',    category: 'Actions',   color: '#1877F2', defaultData: { label: 'Facebook Post', content: '' } },
  { type: 'instagramPost',    label: 'Instagram Post',   category: 'Actions',   color: '#E1306C', defaultData: { label: 'Instagram Post', caption: '', imageUrl: '' } },
  { type: 'linkedinPost',     label: 'LinkedIn Post',    category: 'Actions',   color: '#0A66C2', defaultData: { label: 'LinkedIn Post', content: '', imageUrl: '' } },
  { type: 'whatsApp',         label: 'WhatsApp Alert',   category: 'Actions',   color: '#3b82f6', defaultData: { label: 'WhatsApp Alert', provider: 'twilio', to: '', message: '' } },
  { type: 'telegram',         label: 'Telegram',         category: 'Actions',   color: '#229ED9', defaultData: { label: 'Telegram', chatId: '', message: '' } },
  { type: 'slack',            label: 'Slack',            category: 'Actions',   color: '#4A154B', defaultData: { label: 'Slack', webhookUrl: '', channel: '#general', message: '' } },
  // Logic
  { type: 'ifCondition',      label: 'IF Condition',     category: 'Logic',     color: '#f97316', defaultData: { label: 'IF Condition', leftVar: '', operator: '=', rightValue: '' } },
  { type: 'delay',            label: 'Delay',            category: 'Logic',     color: '#f97316', defaultData: { label: 'Delay', duration: '5', unit: 'seconds' } },
]

const CATEGORIES = ['Triggers', 'Bailey AI', 'Actions', 'Logic'] as const

interface NodeSidebarProps {
  onDragStart: (e: React.DragEvent, nodeDef: NodeDef) => void
}

export function NodeSidebar({ onDragStart }: NodeSidebarProps) {
  return (
    <div style={{
      width: '200px', flexShrink: 0, background: '#0a0b0d',
      borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto',
      fontFamily: 'Inter, sans-serif', padding: '0.75rem 0',
    }}>
      {CATEGORIES.map(cat => {
        const nodes = NODE_DEFS.filter(n => n.category === cat)
        return (
          <div key={cat} style={{ marginBottom: '0.5rem' }}>
            <p style={{
              color: '#4b5563', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', padding: '0.5rem 0.875rem 0.25rem',
            }}>{cat}</p>
            {nodes.map(node => (
              <div
                key={node.type}
                draggable
                onDragStart={e => onDragStart(e, node)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.45rem 0.875rem', cursor: 'grab',
                  borderLeft: `2px solid transparent`,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'
                  ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = node.color
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent'
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: node.color, flexShrink: 0 }} />
                <span style={{ color: '#d1d5db', fontSize: '0.78rem' }}>{node.label}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export { NODE_DEFS }
export type { NodeDef }
