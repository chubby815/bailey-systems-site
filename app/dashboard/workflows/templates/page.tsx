'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Template {
  id:          string
  name:        string
  description: string
  icon:        string
  category:    string
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading,   setLoading]   = useState(true)
  const [cloning,   setCloning]   = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/workflows/templates')
      .then(r => r.json())
      .then((d: { templates: Template[] }) => {
        setTemplates(d.templates)
        setLoading(false)
      })
  }, [])

  async function useTemplate(templateId: string) {
    setCloning(templateId)
    const res  = await fetch('/api/workflows/templates', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ templateId }),
    })
    const data = await res.json() as { id?: string }
    if (res.ok && data.id) {
      router.push(`/dashboard/workflows/${data.id}`)
    } else {
      setCloning(null)
    }
  }

  const categories = [...new Set(templates.map(t => t.category))]

  return (
    <main style={{ minHeight: '100vh', background: '#08090a', color: '#f0f0f0', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        <a
          href="/dashboard/workflows"
          style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}
        >
          ← Back to Workflows
        </a>

        <p style={{ color: '#00e5a0', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          Workflow Templates
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Start with a template
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2.5rem' }}>
          Clone any template and customize it. Your workflow is ready in seconds.
        </p>

        {loading ? (
          <div style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>Loading templates…</div>
        ) : (
          categories.map(cat => (
            <div key={cat} style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#4b5563', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                {cat}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {templates.filter(t => t.category === cat).map(template => (
                  <div
                    key={template.id}
                    style={{
                      background: '#111214', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '14px', padding: '1.25rem', display: 'flex',
                      flexDirection: 'column', gap: '0.75rem', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,160,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                  >
                    <div style={{ fontSize: '1.75rem' }}>{template.icon}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{template.name}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.78rem', lineHeight: 1.5 }}>{template.description}</p>
                    </div>
                    <button
                      onClick={() => void useTemplate(template.id)}
                      disabled={cloning === template.id}
                      style={{
                        marginTop: 'auto', padding: '0.5rem 1rem',
                        background: cloning === template.id ? 'rgba(0,229,160,0.3)' : '#00e5a0',
                        color: '#000', border: 'none', borderRadius: '8px',
                        fontSize: '0.8rem', fontWeight: 700,
                        cursor: cloning === template.id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {cloning === template.id ? 'Opening…' : 'Use Template →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
