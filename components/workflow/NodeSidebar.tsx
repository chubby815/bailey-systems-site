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
  { type: 'agentxbook_post',  label: 'Post to AgentXBook', category: 'Actions', color: '#00e5a0', defaultData: { label: 'Post to AgentXBook', content: '', personality: 'Fun and Meme Queen 🐾', community: 'general' } },
  { type: 'agentxbook_get_feed', label: '🤖 Read AgentXBook Feed', category: 'Actions', color: '#00e5a0', defaultData: { label: '🤖 Read AgentXBook Feed', limit: '30', community: '', sort: 'new' } },
  { type: 'agentxbook_comment', label: '🤖 Comment on AgentXBook Post', category: 'Actions', color: '#00e5a0', defaultData: { label: '🤖 Comment on AgentXBook Post', content: '' } },
  { type: 'agentxbook_send_dm', label: '💬 Send AgentXBook DM', category: 'Actions', color: '#00e5a0', defaultData: { label: '💬 Send AgentXBook DM', to_agent: '', content: '' } },
  { type: 'agentxbook_check_dms', label: '💬 Check AgentXBook Inbox', category: 'Actions', color: '#00e5a0', defaultData: { label: '💬 Check AgentXBook Inbox' } },
  { type: 'whatsApp',         label: 'WhatsApp Alert',   category: 'Actions',   color: '#3b82f6', defaultData: { label: 'WhatsApp Alert', provider: 'twilio', to: '', message: '' } },
  { type: 'telegram',         label: 'Telegram',         category: 'Actions',   color: '#229ED9', defaultData: { label: 'Telegram', chatId: '', message: '' } },
  { type: 'slack',            label: 'Slack',            category: 'Actions',   color: '#4A154B', defaultData: { label: 'Slack', webhookUrl: '', channel: '#general', message: '' } },
  { type: 'discord',          label: 'Discord',          category: 'Actions',   color: '#5865F2', defaultData: { label: 'Discord', webhookUrl: '', message: '', username: 'Bailey' } },
  { type: 'httpRequest',      label: 'HTTP Request',     category: 'Actions',   color: '#f59e0b', defaultData: { label: 'HTTP Request', url: '', method: 'GET', headers: '{}', body: '' } },
  // Logic
  { type: 'ifCondition',      label: 'IF Condition',     category: 'Logic',     color: '#f97316', defaultData: { label: 'IF Condition', leftVar: '', operator: '=', rightValue: '' } },
  { type: 'delay',            label: 'Delay',            category: 'Logic',     color: '#f97316', defaultData: { label: 'Delay', duration: '5', unit: 'seconds' } },
  // Utility
  { type: 'note',             label: 'Note',             category: 'Utility',   color: '#fbbf24', defaultData: { label: 'Note', text: '' } },
  { type: 'setVariable',      label: 'Set Variable',     category: 'Utility',   color: '#06b6d4', defaultData: { label: 'Set Variable', varName: 'myVar', value: '' } },
]

const CATEGORIES = ['Triggers', 'Bailey AI', 'Actions', 'Logic', 'Utility'] as const

interface NodeSidebarProps {
  onDragStart: (e: React.DragEvent, nodeDef: NodeDef) => void
  onAddNode: (nodeDef: NodeDef) => void
}

export function NodeSidebar({ onDragStart, onAddNode }: NodeSidebarProps) {
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
                <span style={{ color: '#d1d5db', fontSize: '0.78rem', flex: 1 }}>{node.label}</span>
                {/* Tap-to-add button — visible on touch devices */}
                <button
                  onClick={() => onAddNode(node)}
                  title={`Add ${node.label}`}
                  style={{
                    background: `${node.color}22`,
                    border: `1px solid ${node.color}44`,
                    color: node.color,
                    borderRadius: '4px',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.85rem',
                    lineHeight: 1,
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  +
                </button>
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
