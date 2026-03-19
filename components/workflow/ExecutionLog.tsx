'use client'
import { useState } from 'react'

export type LogEntry = {
  nodeId: string
  nodeType: string
  nodeLabel: string
  status: 'running' | 'success' | 'error' | 'skipped'
  message?: string
  output?: string
  durationMs?: number
  timestamp: string
}

interface ExecutionLogProps {
  logs: LogEntry[]
  isRunning: boolean
}

const STATUS_COLORS: Record<LogEntry['status'], string> = {
  running: '#eab308',
  success: '#00e5a0',
  error: '#ef4444',
  skipped: '#4b5563',
}

const STATUS_ICONS: Record<LogEntry['status'], string> = {
  running: '⟳',
  success: '✓',
  error: '✗',
  skipped: '—',
}

export function ExecutionLog({ logs, isRunning }: ExecutionLogProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
      background: '#0a0a0f', borderTop: '1px solid rgba(255,255,255,0.07)',
      fontFamily: 'Inter, monospace', transition: 'height 0.2s',
      height: expanded ? '200px' : '40px', overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0 1rem', height: '40px', cursor: 'pointer',
          borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
          userSelect: 'none',
        }}
      >
        <span style={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Execution Log
        </span>
        {isRunning && (
          <span style={{ color: '#eab308', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Running…
          </span>
        )}
        {logs.length > 0 && !isRunning && (
          <span style={{ color: logs.some(l => l.status === 'error') ? '#ef4444' : '#00e5a0', fontSize: '0.7rem' }}>
            {logs.some(l => l.status === 'error') ? `✗ Failed` : `✓ ${logs.length} steps complete`}
          </span>
        )}
        <span style={{ marginLeft: 'auto', color: '#4b5563', fontSize: '0.75rem' }}>{expanded ? '▼' : '▲'}</span>
      </div>

      {/* Log entries */}
      {expanded && (
        <div style={{ overflowY: 'auto', height: 'calc(200px - 40px)', padding: '0.5rem 1rem' }}>
          {logs.length === 0 && !isRunning && (
            <p style={{ color: '#374151', fontSize: '0.75rem', marginTop: '0.5rem' }}>No runs yet. Click ▶ Run to execute this workflow.</p>
          )}
          {logs.map((entry, i) => (
            <div key={`${entry.nodeId}-${i}`} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: STATUS_COLORS[entry.status], fontSize: '0.8rem', fontWeight: 700, width: '14px', flexShrink: 0 }}>
                {STATUS_ICONS[entry.status]}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.7rem', width: '60px', flexShrink: 0 }}>
                {entry.nodeType}
              </span>
              <span style={{ color: '#d1d5db', fontSize: '0.7rem', flex: 1 }}>
                <strong>{entry.nodeLabel}</strong>
                {entry.message && <span style={{ color: '#6b7280' }}> — {entry.message}</span>}
                {entry.output && (
                  <div style={{ color: '#4b5563', fontFamily: 'monospace', fontSize: '0.65rem', marginTop: '0.15rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {entry.output.length > 200 ? entry.output.slice(0, 200) + '…' : entry.output}
                  </div>
                )}
              </span>
              {entry.durationMs !== undefined && (
                <span style={{ color: '#4b5563', fontSize: '0.65rem', flexShrink: 0 }}>{entry.durationMs}ms</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
