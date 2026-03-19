'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#f97316'

type DelayData = { label: string; duration: string; unit: string }
type DelayNodeType = Node<DelayData, 'delay'>

export function DelayNode({ id, data, selected }: NodeProps<DelayNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<DelayData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )
  return (
    <div style={{
      background: '#0d0e10', border: `1px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '210px', fontFamily: 'Inter, sans-serif',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Logic</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>{data.label}</span>
      </div>
      <div style={{ fontSize: '0.75rem' }}>
        <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Wait</label>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <input
            type="number"
            value={data.duration || '5'}
            onChange={e => update({ duration: e.target.value })}
            className="nodrag nopan"
            min="1"
            style={{ flex: 1, background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none' }}
          />
          <select
            value={data.unit || 'seconds'}
            onChange={e => update({ unit: e.target.value })}
            className="nodrag nopan"
            style={{ flex: 1, background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none' }}
          >
            <option>seconds</option>
            <option>minutes</option>
            <option>hours</option>
            <option>days</option>
          </select>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
