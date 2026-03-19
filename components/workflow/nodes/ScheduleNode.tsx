'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#7c3aed'

type ScheduleData = { label: string; cron: string }
type ScheduleNodeType = Node<ScheduleData, 'schedule'>

export function ScheduleNode({ id, data, selected }: NodeProps<ScheduleNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<ScheduleData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )
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
      <div style={{ fontSize: '0.75rem' }}>
        <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Cron expression</label>
        <input
          value={data.cron || '0 9 * * *'}
          onChange={e => update({ cron: e.target.value })}
          className="nodrag nopan"
          style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
          placeholder="0 9 * * *"
        />
        <span style={{ color: '#4b5563', fontSize: '0.65rem', marginTop: '0.2rem', display: 'block' }}>min hr day month weekday</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
