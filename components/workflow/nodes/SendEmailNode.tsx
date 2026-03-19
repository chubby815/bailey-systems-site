'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#3b82f6'

type SendEmailData = { label: string; toEmail: string; subject: string; body: string }
type SendEmailNodeType = Node<SendEmailData, 'sendEmail'>

export function SendEmailNode({ id, data, selected }: NodeProps<SendEmailNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<SendEmailData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )
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
      <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {[
          { key: 'toEmail', label: 'To', placeholder: 'lead@example.com or {{email}}' },
          { key: 'subject', label: 'Subject', placeholder: 'Hello from {{businessName}}' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>{label}</label>
            <input
              value={(data[key as keyof SendEmailData] as string) || ''}
              onChange={e => update({ [key]: e.target.value } as Partial<SendEmailData>)}
              className="nodrag nopan"
              placeholder={placeholder}
              style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Body</label>
          <textarea
            value={data.body || ''}
            onChange={e => update({ body: e.target.value })}
            className="nodrag nopan"
            rows={3}
            placeholder="{{aiOutput}}"
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
