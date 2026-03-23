'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#5865F2'

type DiscordData = { label: string; webhookUrl: string; message: string; username?: string }
type DiscordNodeType = Node<DiscordData, 'discord'>

export function DiscordNode({ id, data, selected }: NodeProps<DiscordNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<DiscordData>) => updateNodeData(id, patch),
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
            placeholder="https://discord.com/api/webhooks/..."
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Message</label>
          <textarea
            value={data.message || ''}
            onChange={e => update({ message: e.target.value })}
            className="nodrag nopan"
            rows={3}
            placeholder="{{aiText}}"
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Bot name (optional)</label>
          <input
            value={data.username || ''}
            onChange={e => update({ username: e.target.value })}
            className="nodrag nopan"
            placeholder="Bailey"
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <p style={{ color: '#4b5563', fontSize: '0.68rem', margin: 0 }}>
          Paste a Discord channel webhook URL above
        </p>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
