'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function HeroInput() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStart = async () => {
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/user', { method: 'GET' })
      const data = await res.json()

      if (data.session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 mb-4">
      <div className="bg-[#0a0a0a] border-4 border-black shadow-[8px_8px_0_#0EA5E9] p-6 flex flex-col gap-4">
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="What type of business are you building?"
          rows={3}
          className="w-full bg-[#111] border-2 border-white/10 text-white placeholder-gray-600 rounded-none px-4 py-3 text-sm outline-none focus:border-[#0EA5E9] transition-colors resize-none font-medium"
        />
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-[#0EA5E9] text-black font-black py-4 text-sm uppercase tracking-widest border-2 border-black hover:bg-white hover:shadow-[4px_4px_0_#0a0a0a] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Start Building →'}
        </button>
        <p className="text-center text-gray-600 text-xs">
          No credit card required to get started
        </p>
      </div>
    </div>
  )
}
