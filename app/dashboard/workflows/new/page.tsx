import { redirect } from 'next/navigation'
import { getSessionFromCookies } from '@/lib/auth'
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas'

export default async function NewWorkflowPage() {
  const session = await getSessionFromCookies()
  if (!session?.email) redirect('/login')

  return <WorkflowCanvas initialName="Untitled Workflow" />
}
