'use client'
import { useCallback, useRef, useState } from 'react'
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

// Defined outside component to avoid re-renders
const nodeTypes: NodeTypes = {
  schedule:        ScheduleNode        as NodeTypes[string],
  manual:          ManualNode          as NodeTypes[string],
  webhook:         WebhookNode         as NodeTypes[string],
  baileyWrite:     BaileyWriteNode     as NodeTypes[string],
  baileyBuildSite: BaileyBuildSiteNode as NodeTypes[string],
  baileyFindLeads: BaileyFindLeadsNode as NodeTypes[string],
  sendEmail:       SendEmailNode       as NodeTypes[string],
  googleSheets:    GoogleSheetsNode    as NodeTypes[string],
  facebookPost:    FacebookPostNode    as NodeTypes[string],
  whatsApp:        WhatsAppNode        as NodeTypes[string],
  ifCondition:     IfConditionNode     as NodeTypes[string],
  delay:           DelayNode           as NodeTypes[string],
}

export interface WorkflowCanvasProps {
  workflowId?: string
  initialName?: string
  initialNodes?: Node[]
  initialEdges?: Edge[]
}

// Inner editor — must be inside ReactFlowProvider
function WorkflowEditor({ workflowId, initialName, initialNodes, initialEdges }: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes ?? [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ?? [])
  const [workflowName, setWorkflowName] = useState(initialName ?? 'Untitled Workflow')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: '#4b5563' } }, eds)),
    [setEdges],
  )

  // Drag from sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData('application/reactflow')
      if (!raw) return
      const nodeDef: NodeDef = JSON.parse(raw)
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

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/workflows/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, name: workflowName, nodes, edges }),
      })
      const data = await res.json() as { id?: string; error?: string }
      if (res.ok) {
        setSaveMsg('Saved ✓')
        // Update URL to persisted ID without full reload
        if (data.id && !workflowId) {
          window.history.replaceState(null, '', `/dashboard/workflows/${data.id}`)
        }
      } else {
        setSaveMsg(data.error ?? 'Save failed')
      }
    } catch {
      setSaveMsg('Save failed')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }, [workflowId, workflowName, nodes, edges])

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setLogs([])
    try {
      const res = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, nodes, edges }),
      })
      const data = await res.json() as { logs?: LogEntry[]; error?: string }
      if (data.logs) setLogs(data.logs)
      else setLogs([{ nodeId: 'error', nodeType: 'system', nodeLabel: 'Error', status: 'error', message: data.error ?? 'Unknown error', timestamp: new Date().toISOString() }])
    } catch (err) {
      setLogs([{ nodeId: 'error', nodeType: 'system', nodeLabel: 'Network Error', status: 'error', message: String(err), timestamp: new Date().toISOString() }])
    } finally {
      setIsRunning(false)
    }
  }, [workflowId, nodes, edges])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#080810', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Top Bar ── */}
      <div style={{
        height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0 1rem', background: '#0a0b0d', borderBottom: '1px solid rgba(255,255,255,0.07)', zIndex: 20,
      }}>
        <a href="/dashboard/workflows" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saveMsg && <span style={{ color: saveMsg.includes('✓') ? '#00e5a0' : '#ef4444', fontSize: '0.8rem' }}>{saveMsg}</span>}
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
        {/* Left sidebar */}
        <NodeSidebar onDragStart={handleDragStart} />

        {/* Canvas */}
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
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Connect them with edges · Click Run to execute</p>
              </div>
            </div>
          )}

          {/* Execution log */}
          <ExecutionLog logs={logs} isRunning={isRunning} />
        </div>
      </div>
    </div>
  )
}

// Public export wrapped in provider
export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditor {...props} />
    </ReactFlowProvider>
  )
}
