'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#f59e0b'

type HttpRequestData = {
  label: string
  url: string
  method: string
  headers: string
  body: string
}
type HttpRequestNodeType = Node<HttpRequestData, 'httpRequest'>

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0',
  fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box',
}

export function HttpRequestNode({ id, data, selected }: NodeProps<HttpRequestNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<HttpRequestData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  )

  const method = data.method || 'GET'

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

      <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {/* Method + URL row */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <select
            value={method}
            onChange={e => update({ method: e.target.value })}
            className="nodrag nopan"
            style={{ ...inputStyle, width: '80px', flexShrink: 0 }}
          >
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            value={data.url || ''}
            onChange={e => update({ url: e.target.value })}
            className="nodrag nopan"
            placeholder="https://api.example.com/data"
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>

        {/* Headers */}
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Headers (JSON)</label>
          <textarea
            value={data.headers || '{}'}
            onChange={e => update({ headers: e.target.value })}
            className="nodrag nopan"
            rows={2}
            placeholder='{"Content-Type": "application/json"}'
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>

        {/* Body — only shown when method is not GET */}
        {method !== 'GET' && (
          <div>
            <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.2rem' }}>Body (JSON)</label>
            <textarea
              value={data.body || ''}
              onChange={e => update({ body: e.target.value })}
              className="nodrag nopan"
              rows={3}
              placeholder='{"key": "value"}'
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>
        )}

        <span style={{ color: '#4b5563', fontSize: '0.65rem' }}>Response stored as {'{{httpResult}}'}</span>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
