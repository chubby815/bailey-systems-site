'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#f97316'

type IfConditionData = { label: string; leftVar: string; operator: string; rightValue: string }
type IfConditionNodeType = Node<IfConditionData, 'ifCondition'>

export function IfConditionNode({ id, data, selected }: NodeProps<IfConditionNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<IfConditionData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )
  return (
    <div style={{
      background: '#0d0e10', border: `1px solid ${selected ? COLOR : 'rgba(255,255,255,0.08)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '230px', fontFamily: 'Inter, sans-serif',
    }}>
      <Handle type="target" position={Position.Left} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Logic</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>{data.label}</span>
      </div>
      <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Variable</label>
            <input
              value={data.leftVar || ''}
              onChange={e => update({ leftVar: e.target.value })}
              className="nodrag nopan"
              placeholder="{{value}}"
              style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Op</label>
            <select
              value={data.operator || '=='}
              onChange={e => update({ operator: e.target.value })}
              className="nodrag nopan"
              style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.3rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
            >
              <option>=</option>
              <option>!=</option>
              <option>&gt;</option>
              <option>&lt;</option>
              <option>contains</option>
            </select>
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Value</label>
            <input
              value={data.rightValue || ''}
              onChange={e => update({ rightValue: e.target.value })}
              className="nodrag nopan"
              placeholder="true"
              style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>
      {/* True output */}
      <Handle type="source" position={Position.Right} id="true" style={{ background: '#00e5a0', border: '2px solid #00e5a0', width: 8, height: 8, top: '35%' }} />
      <div style={{ position: 'absolute', right: '-30px', top: 'calc(35% - 8px)', fontSize: '0.6rem', color: '#00e5a0', fontWeight: 700 }}>T</div>
      {/* False output */}
      <Handle type="source" position={Position.Right} id="false" style={{ background: '#ef4444', border: '2px solid #ef4444', width: 8, height: 8, top: '65%' }} />
      <div style={{ position: 'absolute', right: '-28px', top: 'calc(65% - 8px)', fontSize: '0.6rem', color: '#ef4444', fontWeight: 700 }}>F</div>
    </div>
  )
}
