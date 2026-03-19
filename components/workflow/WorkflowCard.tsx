'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export interface WorkflowRecord {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
  lastRun?: string
  status: 'active' | 'paused'
  nodes: unknown[]
  edges: unknown[]
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 2) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface WorkflowListProps {
  initialWorkflows: WorkflowRecord[]
}

export function WorkflowList({ initialWorkflows }: WorkflowListProps) {
  const [workflows, setWorkflows] = useState(initialWorkflows)
  const [running, setRunning] = useState<string | null>(null)
  const [runResult, setRunResult] = useState<Record<string, 'success' | 'error'>>({})
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameVal, setRenameVal] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Element)) {
        setMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleRun(wf: WorkflowRecord) {
    setRunning(wf.id)
    setRunResult(prev => { const n = { ...prev }; delete n[wf.id]; return n })
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: wf.id }),
      })
      setRunResult(prev => ({ ...prev, [wf.id]: res.ok ? 'success' : 'error' }))
    } catch {
      setRunResult(prev => ({ ...prev, [wf.id]: 'error' }))
    } finally {
      setRunning(null)
      setTimeout(() => setRunResult(prev => { const n = { ...prev }; delete n[wf.id]; return n }), 3000)
    }
  }

  async function handleDuplicate(wf: WorkflowRecord) {
    setMenuOpen(null)
    const res = await fetch('/api/workflows/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duplicateId: wf.id }),
    })
    const data = await res.json() as { id?: string; error?: string; workflow?: WorkflowRecord }
    if (res.ok && data.workflow) {
      setWorkflows(prev => [data.workflow!, ...prev])
    }
  }

  async function handleDelete(wf: WorkflowRecord) {
    setMenuOpen(null)
    if (!confirm(`Delete "${wf.name}"? This cannot be undone.`)) return
    const res = await fetch('/api/workflows/save', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId: wf.id }),
    })
    if (res.ok) {
      setWorkflows(prev => prev.filter(w => w.id !== wf.id))
    }
  }

  async function handleRename(wf: WorkflowRecord) {
    const trimmed = renameVal.trim()
    setRenaming(null)
    setMenuOpen(null)
    if (!trimmed || trimmed === wf.name) return
    await fetch('/api/workflows/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId: wf.id, name: trimmed, nodes: wf.nodes, edges: wf.edges }),
    })
    setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, name: trimmed } : w))
  }

  if (workflows.length === 0) {
    return (
      <div style={{ background: '#0d0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⬡</p>
        <h2 style={{ color: '#f0f0f0', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No workflows yet</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Build your first automation — drag nodes, connect them, and run.</p>
        <Link href="/dashboard/workflows/new" style={{ background: '#00e5a0', color: '#000', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem' }}>
          Create First Workflow
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {workflows.map(wf => (
        <div key={wf.id} style={{
          background: '#0d0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
          padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
          fontFamily: 'Inter, sans-serif',
        }}>
          {/* Left: name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
              {renaming === wf.id ? (
                <input
                  autoFocus
                  value={renameVal}
                  onChange={e => setRenameVal(e.target.value)}
                  onBlur={() => void handleRename(wf)}
                  onKeyDown={e => { if (e.key === 'Enter') void handleRename(wf); if (e.key === 'Escape') setRenaming(null) }}
                  style={{ background: '#111214', border: '1px solid rgba(0,229,160,0.4)', borderRadius: '6px', padding: '0.2rem 0.5rem', color: '#f0f0f0', fontSize: '1rem', fontWeight: 700, outline: 'none', width: '220px' }}
                />
              ) : (
                <span style={{ color: '#f0f0f0', fontWeight: 700, fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {wf.name}
                </span>
              )}
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '0.15rem 0.5rem', borderRadius: '100px', flexShrink: 0,
                background: wf.status === 'active' ? 'rgba(0,229,160,0.1)' : 'rgba(255,255,255,0.05)',
                color: wf.status === 'active' ? '#00e5a0' : '#6b7280',
                border: `1px solid ${wf.status === 'active' ? 'rgba(0,229,160,0.25)' : 'rgba(255,255,255,0.07)'}`,
              }}>{wf.status}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: '#4b5563', fontSize: '0.72rem', flexWrap: 'wrap' }}>
              <span>{wf.nodes.length} node{wf.nodes.length !== 1 ? 's' : ''}</span>
              <span>Edited {timeAgo(wf.updatedAt)}</span>
              {wf.lastRun && <span>Last run {timeAgo(wf.lastRun)}</span>}
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
            {/* ▶ Run */}
            <button
              onClick={() => void handleRun(wf)}
              disabled={running === wf.id}
              style={{
                padding: '0.45rem 0.9rem',
                background: runResult[wf.id] === 'success' ? 'rgba(0,229,160,0.15)'
                  : runResult[wf.id] === 'error' ? 'rgba(239,68,68,0.15)'
                  : running === wf.id ? 'rgba(0,229,160,0.15)' : 'rgba(0,229,160,0.1)',
                color: runResult[wf.id] === 'success' ? '#00e5a0'
                  : runResult[wf.id] === 'error' ? '#ef4444'
                  : '#00e5a0',
                border: '1px solid rgba(0,229,160,0.2)', borderRadius: '8px',
                fontSize: '0.78rem', fontWeight: 700, cursor: running === wf.id ? 'not-allowed' : 'pointer',
              }}
            >
              {running === wf.id ? '⟳ Running…'
                : runResult[wf.id] === 'success' ? '✓ Done'
                : runResult[wf.id] === 'error' ? '✗ Failed'
                : '▶ Run'}
            </button>

            {/* Edit */}
            <Link
              href={`/dashboard/workflows/${wf.id}`}
              style={{ padding: '0.45rem 0.9rem', background: 'rgba(255,255,255,0.05)', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600 }}
            >
              Edit
            </Link>

            {/* ⋮ Menu */}
            <div style={{ position: 'relative' }} ref={menuOpen === wf.id ? menuRef : null}>
              <button
                onClick={() => setMenuOpen(menuOpen === wf.id ? null : wf.id)}
                style={{
                  padding: '0.45rem 0.6rem', background: 'rgba(255,255,255,0.04)', color: '#6b7280',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px',
                  fontSize: '1rem', cursor: 'pointer', lineHeight: 1,
                }}
              >⋮</button>

              {menuOpen === wf.id && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 50,
                  background: '#111214', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                  padding: '0.375rem', minWidth: '140px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}>
                  {[
                    {
                      label: 'Rename', icon: '✏️',
                      action: () => { setRenameVal(wf.name); setRenaming(wf.id); setMenuOpen(null) },
                    },
                    {
                      label: 'Duplicate', icon: '⧉',
                      action: () => void handleDuplicate(wf),
                    },
                    {
                      label: 'Delete', icon: '🗑', danger: true,
                      action: () => void handleDelete(wf),
                    },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                        padding: '0.5rem 0.75rem', background: 'transparent', border: 'none',
                        borderRadius: '7px', color: item.danger ? '#ef4444' : '#d1d5db',
                        fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                    >
                      <span style={{ fontSize: '0.75rem' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
