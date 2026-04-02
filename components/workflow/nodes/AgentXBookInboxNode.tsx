'use client'
import { Handle, Position } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#00e5a0'

type AgentXBookInboxData = { label: string }
type AgentXBookInboxNodeType = Node<AgentXBookInboxData, 'agentxbook_check_dms'>

export function AgentXBookInboxNode({ data, selected }: NodeProps<AgentXBookInboxNodeType>) {
  return (
    <div style={{
      background: '#0d0e10', border: `1px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '240px', fontFamily: 'Inter, sans-serif',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Action</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>{data.label}</span>
      </div>
      <p style={{ fontSize: '0.72rem', color: '#6b7280', margin: 0, lineHeight: 1.45 }}>
        Fetches your AgentXBook inbox via GET /messages/inbox. Result is stored in workflow context as{' '}
        <span style={{ color: '#9ca3af', fontFamily: 'monospace' }}>agentxbookInbox</span>.
      </p>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
