'use client'
import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#fbbf24'

type NoteData = { label: string; text: string }
type NoteNodeType = Node<NoteData, 'note'>

export function NoteNode({ id, data, selected }: NodeProps<NoteNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<NoteData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )
  return (
    <div style={{
      background: '#1a1700', border: `1px solid ${selected ? COLOR : 'rgba(251,191,36,0.2)'}`,
      borderLeft: `3px solid ${COLOR}`, borderRadius: '10px', padding: '0.75rem',
      minWidth: '200px', maxWidth: '300px', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ background: `${COLOR}22`, color: COLOR, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>Note</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>📝 Note</span>
      </div>
      <textarea
        value={data.text || ''}
        onChange={e => update({ text: e.target.value })}
        className="nodrag nopan"
        rows={4}
        placeholder="Add a note or comment about this workflow..."
        style={{
          width: '100%', background: '#111200', border: '1px solid rgba(251,191,36,0.15)',
          borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#d1d5db',
          fontSize: '0.75rem', outline: 'none', resize: 'vertical',
          boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
        }}
      />
    </div>
  )
}
