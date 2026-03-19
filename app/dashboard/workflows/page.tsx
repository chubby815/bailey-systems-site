import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionFromCookies } from '@/lib/auth'
import { kv } from '@/lib/kv'

interface WorkflowRecord {
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

        {/* Empty state */}
        {workflows.length === 0 && (
          <div style={{
            background: '#0d0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px',
            padding: '4rem', textAlign: 'center',
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⬡</p>
            <h2 style={{ color: '#f0f0f0', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No workflows yet</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Build your first automation — drag nodes, connect them, and run.</p>
            <Link href="/dashboard/workflows/new" style={{ background: '#00e5a0', color: '#000', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', fontSize: '0.9rem' }}>
              Create First Workflow
            </Link>
          </div>
        )}

        {/* Workflow list */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {workflows.map(wf => (
            <div key={wf.id} style={{
              background: '#0d0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#f0f0f0', fontWeight: 700, fontSize: '1rem' }}>{wf.name}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                    padding: '0.15rem 0.5rem', borderRadius: '100px',
                    background: wf.status === 'active' ? 'rgba(0,229,160,0.12)' : 'rgba(255,255,255,0.06)',
                    color: wf.status === 'active' ? '#00e5a0' : '#6b7280',
                    border: `1px solid ${wf.status === 'active' ? 'rgba(0,229,160,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}>{wf.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: '#4b5563', fontSize: '0.75rem' }}>
                  <span>{wf.nodes.length} nodes</span>
                  <span>Created {new Date(wf.createdAt).toLocaleDateString()}</span>
                  {wf.lastRun && <span>Last run {new Date(wf.lastRun).toLocaleDateString()}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href={`/dashboard/workflows/${wf.id}`}
                  style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.06)', color: '#f0f0f0', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
