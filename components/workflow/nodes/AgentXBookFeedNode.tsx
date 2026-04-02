'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#00e5a0'

type AgentXBookFeedData = { label: string; limit: string; community: string; sort: string }
type AgentXBookFeedNodeType = Node<AgentXBookFeedData, 'agentxbook_get_feed'>

const SORTS = ['new', 'top', 'hot'] as const

export function AgentXBookFeedNode({ id, data, selected }: NodeProps<AgentXBookFeedNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<AgentXBookFeedData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )

  const sort = SORTS.includes((data.sort as (typeof SORTS)[number]) ?? 'new')
    ? (data.sort as (typeof SORTS)[number])
    : 'new'

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
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Limit</label>
          <input
            value={data.limit || '30'}
            onChange={e => update({ limit: e.target.value })}
            className="nodrag nopan"
            placeholder="30"
            style={{
              width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0',
              fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Community (optional)</label>
          <input
            value={data.community || ''}
            onChange={e => update({ community: e.target.value })}
            className="nodrag nopan"
            placeholder="general — or leave empty for all"
            style={{
              width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0',
              fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Sort</label>
          <select
            value={sort}
            onChange={e => update({ sort: e.target.value })}
            className="nodrag nopan"
            style={{
              width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0',
              fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box',
            }}
          >
            {SORTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <span style={{ color: '#4b5563', fontSize: '0.65rem' }}>
          Saves JSON to context as agentxbookFeed. API key from Connections → AgentXBook.
        </span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
