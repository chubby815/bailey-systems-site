'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#4A154B'

type SlackData = { label: string; webhookUrl: string; channel: string; message: string }
type SlackNodeType = Node<SlackData, 'slack'>

export function SlackNode({ id, data, selected }: NodeProps<SlackNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<SlackData>) => updateNodeData(id, patch),
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
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Webhook URL</label>
          <input
            value={data.webhookUrl || ''}
            onChange={e => update({ webhookUrl: e.target.value })}
            className="nodrag nopan"
            placeholder="https://hooks.slack.com/services/..."
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Channel</label>
          <input
            value={data.channel || ''}
            onChange={e => update({ channel: e.target.value })}
            className="nodrag nopan"
            placeholder="#general"
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Message</label>
          <textarea
            value={data.message || ''}
            onChange={e => update({ message: e.target.value })}
            className="nodrag nopan"
            rows={2}
            placeholder="{{aiText}} — or leave blank to auto-use AI output"
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <p style={{ color: '#4b5563', fontSize: '0.68rem', margin: 0 }}>
          Paste a Slack Incoming Webhook URL above
        </p>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
