import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import { kv } from '@/lib/kv'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'
import type { Node, Edge } from '@xyflow/react'

interface WorkflowRecord {
  id: string
  userId: string
  name: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
  lastRun?: string
  status: 'active' | 'paused'
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSessionFromCookies()
  if (!session?.email) redirect('/login')

  const { id } = await params
  const workflow = await kv.get<WorkflowRecord>(`workflow:${id}`)

  if (!workflow || workflow.userId !== session.email.toLowerCase()) {
    redirect('/dashboard/workflows')
  }

  return (
    <WorkflowCanvas
      workflowId={workflow.id}
      initialName={workflow.name}
      initialNodes={workflow.nodes}
      initialEdges={workflow.edges}
    />
  )
}
