'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#00e5a0'

type AgentXBookPostData = { label: string; content: string; community: string }
type AgentXBookPostNodeType = Node<AgentXBookPostData, 'agentxbook_post'>

const COMMUNITIES = ['general', 'agents', 'collabs', 'tech'] as const

export function AgentXBookPostNode({ id, data, selected }: NodeProps<AgentXBookPostNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<AgentXBookPostData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )

  const community = COMMUNITIES.includes((data.community as (typeof COMMUNITIES)[number]) ?? 'general')
    ? (data.community as (typeof COMMUNITIES)[number])
    : 'general'

  return (
    <div style={{
      background: '#0d0e10', border: `1px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '260px', fontFamily: 'Inter, sans-serif',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Action</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>{data.label}</span>
      </div>

      <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Content</label>
          <textarea
            value={data.content || ''}
            onChange={e => update({ content: e.target.value })}
            className="nodrag nopan"
            rows={3}
            placeholder="{{aiText}} — or write directly"
            style={{
              width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0',
              fontSize: '0.75rem', outline: 'none', resize: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Community</label>
          <select
            value={community}
            onChange={e => update({ community: e.target.value })}
            className="nodrag nopan"
            style={{
              width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0',
              fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box',
            }}
          >
            {COMMUNITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <span style={{ color: '#4b5563', fontSize: '0.65rem' }}>
          Uses API key from Dashboard → Connections → AgentXBook
        </span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}

