import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionFromCookies } from '@/lib/auth'
import { kv } from '@/lib/kv'
import { WorkflowList, type WorkflowRecord } from '@/components/workflow/WorkflowCard'

export default async function WorkflowsPage() {
  const session = await getSessionFromCookies()
  if (!session?.email) redirect('/login')

  const email = session.email.toLowerCase()
  const ids = await kv.lrange<string>(`workflows:${email}`, 0, 49)
  const workflows = (
    await Promise.all(ids.map(id => kv.get<WorkflowRecord>(`workflow:${id}`)))
  ).filter((w): w is WorkflowRecord => !!w && w.userId === email)

  return (
    <main style={{ minHeight: '100vh', background: '#08090a', padding: '7rem 1.5rem 4rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ color: '#00e5a0', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Automation</p>
            <h1 style={{ color: '#f0f0f0', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Workflows</h1>
          </div>
          <Link
            href="/dashboard/workflows/new"
            style={{
              background: '#00e5a0', color: '#000', fontWeight: 700, fontSize: '0.875rem',
              padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none',
            }}
          >
            + New Workflow
          </Link>
        </div>

        <WorkflowList initialWorkflows={workflows} />
      </div>
    </main>
  )
}
