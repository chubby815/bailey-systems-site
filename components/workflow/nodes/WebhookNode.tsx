'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#7c3aed'

type WebhookData = { label: string; path: string }
type WebhookNodeType = Node<WebhookData, 'webhook'>

export function WebhookNode({ id, data, selected }: NodeProps<WebhookNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<WebhookData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )
  const fullUrl = `https://baileyagents.com/api/workflows/webhook/${data.path || 'my-hook'}`
  return (
    <div style={{
      background: '#0d0e10', border: `1px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '240px', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Trigger</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>{data.label}</span>
      </div>
      <div style={{ fontSize: '0.75rem' }}>
        <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Path</label>
        <input
          value={data.path || 'my-hook'}
          onChange={e => update({ path: e.target.value })}
          className="nodrag nopan"
          style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.4rem' }}
        />
        <div style={{ background: '#111214', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#4b5563', fontSize: '0.65rem', wordBreak: 'break-all' }}>{fullUrl}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
