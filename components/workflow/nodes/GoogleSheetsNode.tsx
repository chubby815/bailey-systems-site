'use client'
import { useCallback } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'

const COLOR = '#0F9D58'

type GoogleSheetsData = {
  label: string
  spreadsheetId: string
  sheetName: string
  operation: string
  values: string
}
type GoogleSheetsNodeType = Node<GoogleSheetsData, 'googleSheets'>

export function GoogleSheetsNode({ id, data, selected }: NodeProps<GoogleSheetsNodeType>) {
  const { updateNodeData } = useReactFlow()
  const update = useCallback(
    (patch: Partial<GoogleSheetsData>) => updateNodeData(id, patch),
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
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Spreadsheet ID</label>
          <input
            value={data.spreadsheetId || ''}
            onChange={e => update({ spreadsheetId: e.target.value })}
            className="nodrag nopan"
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs..."
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Sheet name</label>
          <input
            value={data.sheetName || 'Sheet1'}
            onChange={e => update({ sheetName: e.target.value })}
            className="nodrag nopan"
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Operation</label>
          <select
            value={data.operation || 'append'}
            onChange={e => update({ operation: e.target.value })}
            className="nodrag nopan"
            style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
          >
            <option value="append">Append row</option>
            <option value="read">Read rows</option>
          </select>
        </div>
        {(data.operation || 'append') === 'append' && (
          <div>
            <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Values (comma-separated)</label>
            <textarea
              value={data.values || ''}
              onChange={e => update({ values: e.target.value })}
              className="nodrag nopan"
              rows={2}
              placeholder="{{leads}}, {{aiText}}, or Name, Email, Phone"
              style={{ width: '100%', background: '#111214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.35rem 0.5rem', color: '#f0f0f0', fontSize: '0.75rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}
        <p style={{ color: '#4b5563', fontSize: '0.65rem', margin: 0 }}>
          Connect Google in Dashboard → Connections first
        </p>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: COLOR, border: `2px solid ${COLOR}`, width: 8, height: 8 }} />
    </div>
  )
}
