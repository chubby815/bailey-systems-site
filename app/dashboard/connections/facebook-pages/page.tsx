'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface FBPage {
  id:       string
  name:     string
  fanCount?: number
}

export default function FacebookPagesPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const token        = searchParams.get('token') ?? ''

  const [pages,     setPages]     = useState<FBPage[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [selecting, setSelecting] = useState<string | null>(null)
  const [done,      setDone]      = useState('')

  useEffect(() => {
    if (!token) {
      setError('Missing token — please reconnect Facebook.')
      setLoading(false)
      return
    }
    void fetch(`/api/connections/facebook/pages?token=${token}`)
      .then(r => r.json())
      .then((d: { pages?: FBPage[]; error?: string }) => {
        if (d.error) {
          setError(d.error)
        } else {
          setPages(d.pages ?? [])
        }
      })
      .catch(() => setError('Failed to load pages — please try again.'))
      .finally(() => setLoading(false))
  }, [token])

  async function selectPage(pageId: string, pageName: string) {
    setSelecting(pageId)
    try {
      const res = await fetch('/api/connections/facebook/select', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, pageId }),
      })
      const data = await res.json() as { success?: boolean; pageName?: string; error?: string }
      if (res.ok && data.success) {
        setDone(data.pageName ?? pageName)
        setTimeout(() => router.push('/dashboard/connections?connected=facebook'), 1200)
      } else {
        setError(data.error ?? 'Failed to connect page — please try again.')
        setSelecting(null)
      }
    } catch {
      setError('Network error — please try again.')
      setSelecting(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Bailey<span className="text-[#00e5a0]">Agents</span>
        </Link>
        <Link href="/dashboard/connections" className="text-xs text-gray-500 hover:text-white transition-colors">
          ← Back to Connections
        </Link>
      </header>

      <div className="flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Title */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: '#1877F218', border: '1px solid #1877F230' }}>
              📘
            </div>
            <p className="text-[#00e5a0] text-xs font-bold uppercase tracking-widest mb-1">Facebook</p>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Select Your Facebook Page
            </h1>
            <p className="text-gray-500 text-sm">
              Choose which page you want Bailey to post to.
            </p>
          </div>

          {/* States */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="w-6 h-6 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading your pages…</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <Link
                href="/dashboard/connections"
                className="inline-block bg-[#1877F2] text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#1565d8] transition-colors"
              >
                Try Again
              </Link>
            </div>
          )}

          {done && (
            <div className="bg-[#00e5a0]/10 border border-[#00e5a0]/25 rounded-2xl p-5 text-center">
              <p className="text-[#00e5a0] font-bold text-lg mb-1">✓ Connected!</p>
              <p className="text-gray-400 text-sm">"{done}" is now connected. Redirecting…</p>
            </div>
          )}

          {!loading && !error && !done && pages.length > 0 && (
            <div className="flex flex-col gap-3">
              {pages.map(page => (
                <div
                  key={page.id}
                  className="bg-[#111214] border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between gap-4 transition-all hover:border-[#1877F2]/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: '#1877F218', border: '1px solid #1877F230' }}>
                      📘
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-white truncate">{page.name}</p>
                      {page.fanCount !== undefined && (
                        <p className="text-xs text-gray-500">
                          {page.fanCount.toLocaleString()} {page.fanCount === 1 ? 'follower' : 'followers'}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => void selectPage(page.id, page.name)}
                    disabled={!!selecting}
                    className="flex-shrink-0 font-bold px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
                    style={{
                      background:   selecting === page.id ? '#1565d8' : '#1877F2',
                      color:        '#fff',
                      minWidth:     '140px',
                    }}
                  >
                    {selecting === page.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                        Connecting…
                      </span>
                    ) : (
                      'Connect This Page'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
