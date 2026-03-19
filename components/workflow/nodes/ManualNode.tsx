'use client'
import { Handle, Position } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#7c3aed'

type ManualData = { label: string }
type ManualNodeType = Node<ManualData, 'manual'>

export function ManualNode({ data, selected }: NodeProps<ManualNodeType>) {
  return (
    <div style={{
      background: '#0d0e10', border: `1px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '210px', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Trigger</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>{data.label}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
        Click Run to trigger manually
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
