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
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-4 shadow-[0_0_60px_rgba(0,229,160,0.08)]">
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="What type of business are you building?"
          rows={3}
          className="w-full bg-transparent text-[#f0f0f0] placeholder-[#4b5563] px-3 py-2 text-sm outline-none resize-none font-dm leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.07]">
          <span className="text-xs text-[#4b5563]">7-day free trial — card required, charged on day 7</span>
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-[#00e5a0] hover:bg-[#00ffb2] text-black text-sm font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Start Building →'}
          </button>
        </div>
      </div>
    </div>
  )
}
