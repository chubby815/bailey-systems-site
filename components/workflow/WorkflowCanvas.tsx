'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { NodeSidebar, type NodeDef } from './NodeSidebar'
import { ExecutionLog, type LogEntry } from './ExecutionLog'
import { ScheduleNode }        from './nodes/ScheduleNode'
import { ManualNode }          from './nodes/ManualNode'
import { WebhookNode }         from './nodes/WebhookNode'
import { BaileyWriteNode }     from './nodes/BaileyWriteNode'
import { BaileyBuildSiteNode } from './nodes/BaileyBuildSiteNode'
import { BaileyFindLeadsNode } from './nodes/BaileyFindLeadsNode'
import { SendEmailNode }       from './nodes/SendEmailNode'
import { GoogleSheetsNode }    from './nodes/GoogleSheetsNode'
import { FacebookPostNode }    from './nodes/FacebookPostNode'
import { WhatsAppNode }        from './nodes/WhatsAppNode'
import { IfConditionNode }     from './nodes/IfConditionNode'
import { DelayNode }           from './nodes/DelayNode'
import { TelegramNode }        from './nodes/TelegramNode'
import { SlackNode }           from './nodes/SlackNode'

// ── HOC: wraps any node with a hoverable ✕ delete button ──────────────────
type AnyComp = React.ComponentType<Record<string, unknown>>

function withDelete(Comp: AnyComp): AnyComp {
  function DeleteWrapper(props: NodeProps<Node> & Record<string, unknown>) {
    const { deleteElements } = useReactFlow()
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Comp {...props} />
        <button
          className="nodrag nopan"
          title="Delete node"
          onClick={e => {
            e.stopPropagation()
            void deleteElements({ nodes: [{ id: props.id }] })
          }}
          style={{
            position: 'absolute', top: '6px', right: '6px', zIndex: 100,
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'rgba(239,68,68,0)', color: 'rgba(239,68,68,0)',
            border: '1px solid rgba(239,68,68,0)', cursor: 'pointer',
            fontSize: '9px', lineHeight: 1, padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget
            b.style.background = 'rgba(239,68,68,0.18)'
            b.style.color = '#ef4444'
            b.style.border = '1px solid rgba(239,68,68,0.35)'
          }}
          onMouseLeave={e => {
            const b = e.currentTarget
            b.style.background = 'rgba(239,68,68,0)'
            b.style.color = 'rgba(239,68,68,0)'
            b.style.border = '1px solid rgba(239,68,68,0)'
          }}
        >✕</button>
      </div>
    )
  }
  DeleteWrapper.displayName = `WithDelete(${Comp.displayName ?? Comp.name ?? 'Node'})`
  return DeleteWrapper as AnyComp
}

// ── nodeTypes — defined outside component to avoid re-renders ─────────────
const nodeTypes: NodeTypes = {
  schedule:        withDelete(ScheduleNode        as AnyComp) as NodeTypes[string],
  manual:          withDelete(ManualNode          as AnyComp) as NodeTypes[string],
  webhook:         withDelete(WebhookNode         as AnyComp) as NodeTypes[string],
  baileyWrite:     withDelete(BaileyWriteNode     as AnyComp) as NodeTypes[string],
  baileyBuildSite: withDelete(BaileyBuildSiteNode as AnyComp) as NodeTypes[string],
  baileyFindLeads: withDelete(BaileyFindLeadsNode as AnyComp) as NodeTypes[string],
  sendEmail:       withDelete(SendEmailNode       as AnyComp) as NodeTypes[string],
  googleSheets:    withDelete(GoogleSheetsNode    as AnyComp) as NodeTypes[string],
  facebookPost:    withDelete(FacebookPostNode    as AnyComp) as NodeTypes[string],
  whatsApp:        withDelete(WhatsAppNode        as AnyComp) as NodeTypes[string],
  ifCondition:     withDelete(IfConditionNode     as AnyComp) as NodeTypes[string],
  delay:           withDelete(DelayNode           as AnyComp) as NodeTypes[string],
  telegram:        withDelete(TelegramNode        as AnyComp) as NodeTypes[string],
  slack:           withDelete(SlackNode           as AnyComp) as NodeTypes[string],
}

export interface WorkflowCanvasProps {
  workflowId?: string
  initialName?: string
  initialNodes?: Node[]
  initialEdges?: Edge[]
}

// ── Inner editor — must be inside ReactFlowProvider ───────────────────────
function WorkflowEditor({ workflowId, initialName, initialNodes, initialEdges }: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()
  const isInitialMount = useRef(true)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes ?? [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ?? [])
  const [workflowName, setWorkflowName] = useState(initialName ?? 'Untitled Workflow')
  const [logs, setLogs]         = useState<LogEntry[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [saveMsg, setSaveMsg]   = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty]   = useState(false)
  // Track actual persisted workflow ID (may be created on first save)
  const [currentId, setCurrentId] = useState<string | undefined>(workflowId)

  // ── Mark dirty when nodes/edges change (skip initial mount) ───────────
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    setIsDirty(true)
  }, [nodes, edges])

  // ── Auto-save: 1s debounce, only fires when there are unsaved changes ──
  useEffect(() => {
    if (!workflowName || nodes.length === 0 || !isDirty) return

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/workflows/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workflowId: currentId ?? null,
            name: workflowName,
            nodes,
            edges,
          }),
        })
        const data = await res.json() as { id?: string }
        if (res.ok) {
          if (data.id && !currentId) {
            setCurrentId(data.id)
            window.history.replaceState(null, '', `/dashboard/workflows/${data.id}`)
          }
          setLastSaved(new Date())
          setIsDirty(false)
        }
      } catch {
        // silent auto-save failure — user can click Save manually
      }
    }, 1000)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, workflowName, isDirty, currentId])

  // ── Warn before leaving with unsaved changes ───────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // ── Connections ────────────────────────────────────────────────────────
  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: '#4b5563' } }, eds)),
    [setEdges],
  )

  // ── Drag-and-drop from sidebar ─────────────────────────────────────────
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData('application/reactflow')
      if (!raw) return
      const nodeDef: NodeDef = JSON.parse(raw) as NodeDef
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
      const newNode: Node = {
        id: `${nodeDef.type}-${Date.now()}`,
        type: nodeDef.type,
        position,
        data: { ...nodeDef.defaultData },
      }
      setNodes(nds => [...nds, newNode])
    },
    [screenToFlowPosition, setNodes],
  )

  const handleDragStart = useCallback((e: React.DragEvent, nodeDef: NodeDef) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDef))
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  // ── Manual save ────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/workflows/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: currentId, name: workflowName, nodes, edges }),
      })
      const data = await res.json() as { id?: string; error?: string }
      if (res.ok) {
        if (data.id && !currentId) {
          setCurrentId(data.id)
          window.history.replaceState(null, '', `/dashboard/workflows/${data.id}`)
        }
        setLastSaved(new Date())
        setIsDirty(false)
        setSaveMsg('Saved ✓')
      } else {
        setSaveMsg(data.error ?? 'Save failed')
      }
    } catch {
      setSaveMsg('Save failed')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }, [currentId, workflowName, nodes, edges])

  // ── Run ────────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setLogs([])
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: nodes,
          edges: edges,
          workflowId: currentId ?? null,
        }),
      })
      const data = await res.json() as { logs?: LogEntry[]; error?: string }

      if (data.logs) {
        setLogs(data.logs)
      }

      if (!res.ok) {
        setLogs(prev => [...prev, {
          nodeId: 'system', nodeType: 'system', nodeLabel: 'Error',
          status: 'error' as const,
          message: data.error ?? 'Run failed',
          timestamp: new Date().toISOString(),
        }])
      }
    } catch {
      setLogs(prev => [...prev, {
        nodeId: 'system', nodeType: 'system', nodeLabel: 'Network Error',
        status: 'error' as const,
        message: 'Network error — could not reach server',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setIsRunning(false)
    }
  }, [currentId, nodes, edges])

  // ── Save status label ──────────────────────────────────────────────────
  const savedAtStr = lastSaved
    ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#080810', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Top Bar ── */}
      <div style={{
        height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0 1rem', background: '#0a0b0d', borderBottom: '1px solid rgba(255,255,255,0.07)', zIndex: 20,
      }}>
        <a href="/dashboard/workflows" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none' }}>
          ← Workflows
        </a>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />
        <input
          value={workflowName}
          onChange={e => setWorkflowName(e.target.value)}
          style={{
            background: 'transparent', border: 'none', color: '#f0f0f0', fontSize: '0.9rem',
            fontWeight: 600, outline: 'none', minWidth: '160px', maxWidth: '300px',
          }}
        />

        {/* ── Status indicators ── */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Save message (errors / explicit saves) takes priority */}
          {saveMsg ? (
            <span style={{ color: saveMsg.includes('✓') ? '#00e5a0' : '#ef4444', fontSize: '0.78rem' }}>
              {saveMsg}
            </span>
          ) : isDirty ? (
            <span style={{ color: '#6b7280', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
              Unsaved changes
            </span>
          ) : savedAtStr ? (
            <span style={{ color: '#00e5a0', fontSize: '0.75rem' }}>
              Saved ✓ {savedAtStr}
            </span>
          ) : null}

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.06)', color: '#f0f0f0',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.8rem',
              fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            style={{
              padding: '0.4rem 1.25rem', background: isRunning ? 'rgba(0,229,160,0.4)' : '#00e5a0',
              color: '#000', border: 'none', borderRadius: '8px', fontSize: '0.8rem',
              fontWeight: 700, cursor: isRunning ? 'not-allowed' : 'pointer',
            }}
          >
            {isRunning ? '⟳ Running…' : '▶ Run'}
          </button>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <NodeSidebar onDragStart={handleDragStart} />

        <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            deleteKeyCode={['Delete', 'Backspace']}
            fitView
            defaultEdgeOptions={{ animated: false, style: { stroke: '#374151', strokeWidth: 1.5 } }}
            style={{ background: '#080810' }}
          >
            <Background variant={BackgroundVariant.Dots} color="#1f2023" gap={20} size={1} />
            <Controls
              style={{ background: '#0d0e10', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px' }}
            />
          </ReactFlow>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{ textAlign: 'center', color: '#374151' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⬡</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Drag nodes from the left to build your workflow</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Connect them · Select + Delete key to remove · Click Run to execute</p>
              </div>
            </div>
          )}

          <ExecutionLog logs={logs} isRunning={isRunning} />
        </div>
      </div>
    </div>
  )
}

// ── Public export wrapped in provider ─────────────────────────────────────
export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditor {...props} />
    </ReactFlowProvider>
  )
}
