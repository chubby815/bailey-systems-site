'use client'
import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

function Paywall({ tier }: { tier: string }) {
  const isElite = tier === 'elite'
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">{isElite ? '👑' : '🚀'}</div>
        <h1 className="text-3xl font-black mb-4">{isElite ? 'Bailey Elite' : 'Bailey Pro'}</h1>
        <p className="text-gray-400 mb-8">
          {isElite
            ? 'Unlimited power. 100 messages/day, 3 images, priority everything.'
            : 'Ask Bailey anything. Code, writing, business, research — plus image generation.'}
        </p>
        <div className="bg-[#111] rounded-2xl p-6 mb-6 text-left space-y-3">
          {isElite ? (
            <>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>100 messages per day</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>3 AI image generations per day</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>Bailey AI — full power</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>🇲🇽 Se habla español</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>Cancel anytime</span></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>20 messages per day</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>2 AI image generations per day</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>Bailey AI powered</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>🇲🇽 Se habla español</span></div>
              <div className="flex items-center gap-3 text-sm"><span className="text-[#00c48c]">✓</span><span>Cancel anytime</span></div>
            </>
          )}
        </div>
        <a
          href={isElite
            ? (process.env.NEXT_PUBLIC_STRIPE_ELITE_MONTHLY_LINK || '#')
            : (process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK || '#')}
          className="block bg-[#00c48c] text-black font-black py-4 rounded-2xl text-lg hover:bg-white transition"
        >
          {isElite ? 'Join Elite — $19.99/mo' : 'Join Pro — $4.99/mo'}
        </a>
        <p className="text-gray-600 text-xs mt-4">🔒 Secure payment via Stripe · Cancel anytime</p>
      </div>
    </div>
  )
}

function ProChat() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hey! I'm Bailey Pro 🚀 Ask me anything — code, writing, business, math, research. You have 20 messages and 2 images today. Use the 🎨 button to generate images!\n\n🇲🇽 ¡También puedo ayudarte en español! Solo escríbeme en español y te respondo igual."
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [usage, setUsage] = useState({ msgs: 0, imgs: 0 })
  const [showUpgrade, setShowUpgrade] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const urlToken = searchParams.get('token')
    const cookieToken = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('bailey_pro_auth='))
      ?.split('=')[1]
    const storageToken = localStorage.getItem('bailey_pro_token')

    const found = urlToken || cookieToken || storageToken

    if (found) {
      setToken(found)
      localStorage.setItem('bailey_pro_token', found)
      document.cookie = `bailey_pro_auth=${found}; path=/; max-age=31536000`
    }
    setChecking(false)
  }, [searchParams])

  useEffect(() => {
    if (token) {
      fetch(`/api/usage?token=${token}`)
        .then(r => r.json())
        .then(d => setUsage({ msgs: d.msgs || 0, imgs: d.imgs || 0 }))
        .catch(() => {})
    }
  }, [token])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (checking) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-sm animate-pulse">Loading Bailey Pro...</div>
    </div>
  )
  if (!token) return <Paywall tier="pro" />

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    const res = await fetch('/api/bailey-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        token,
      }),
    })
    const data = await res.json()
    setLoading(false)

    if (res.status === 429) {
      if (data.showUpgrade) setShowUpgrade(true)
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      return
    }

    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    setUsage(prev => ({ ...prev, msgs: data.used }))
  }

  const generateImage = async () => {
    if (!input.trim() || imgLoading) return
    const prompt = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: `🎨 Generate image: ${prompt}` }])
    setImgLoading(true)

    const res = await fetch('/api/bailey-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, token }),
    })
    const data = await res.json()
    setImgLoading(false)

    if (!res.ok) {
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Image generation failed.' }])
      return
    }

    setMessages(prev => [...prev, { role: 'assistant', content: 'Here is your generated image:', image: data.url }])
    setUsage(prev => ({ ...prev, imgs: data.used }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00c48c] flex items-center justify-center text-black font-black text-sm">B</div>
          <div>
            <div className="font-black text-sm flex items-center gap-2">
              Bailey Pro
              <span className="inline-flex items-center gap-1 bg-[#00c48c]/10 border border-[#00c48c]/30 text-[#00c48c] text-xs font-bold px-2 py-0.5 rounded-full">
                🇲🇽 Se habla español
              </span>
            </div>
            <div className="text-xs text-gray-500">Powered by Bailey AI</div>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>💬 {Math.max(0, 20 - usage.msgs)} msgs left</span>
          <span>🎨 {Math.max(0, 2 - usage.imgs)} images left</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#00c48c] flex items-center justify-center text-black font-black text-xs mr-2 mt-1 shrink-0">B</div>
            )}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-[#00c48c] text-black font-medium rounded-2xl rounded-br-sm' : 'bg-[#1a1a1a] text-gray-100 rounded-2xl rounded-bl-sm border border-white/5'} px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap`}>
              {msg.content}
              {msg.image && <img src={msg.image} alt="Generated" className="mt-3 rounded-xl w-full max-w-sm" />}
            </div>
          </div>
        ))}
        {(loading || imgLoading) && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[#00c48c] flex items-center justify-center text-black font-black text-xs mr-2 shrink-0">B</div>
            <div className="bg-[#1a1a1a] border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2 h-2 bg-[#00c48c] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {showUpgrade && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-[#111] border border-[#00c48c] rounded-2xl p-8 max-w-md text-center">
            <div className="text-4xl mb-4">👑</div>
            <h2 className="text-2xl font-black mb-2">Upgrade to Bailey Elite</h2>
            <p className="text-gray-400 text-sm mb-6">You've hit your daily limit. Elite gives you 100 messages/day, 3 images, and way more power.</p>
            <a href={process.env.NEXT_PUBLIC_STRIPE_ELITE_MONTHLY_LINK || '/elite'} target="_blank" rel="noopener noreferrer"
               className="block bg-[#00c48c] text-black font-black py-3 rounded-xl hover:bg-white transition mb-3">
              Upgrade to Elite — $19.99/mo
            </a>
            <button onClick={() => setShowUpgrade(false)} className="text-gray-600 text-sm hover:text-white transition">
              Maybe later
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 p-4 sticky bottom-0 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask Bailey anything..."
            className="flex-1 bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00c48c] transition"
          />
          <button onClick={generateImage} disabled={imgLoading || usage.imgs >= 2}
            className="bg-purple-600 text-white font-black px-4 py-3 rounded-xl hover:bg-purple-500 transition disabled:opacity-40 text-lg" title="Generate image">
            🎨
          </button>
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            className="bg-[#00c48c] text-black font-black px-5 py-3 rounded-xl hover:bg-white transition disabled:opacity-40 text-sm">
            Send
          </button>
        </div>
        <p className="text-center text-gray-700 text-xs mt-2">Bailey Pro · Resets midnight</p>
      </div>
    </div>
  )
}

export default function ProPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <ProChat />
    </Suspense>
  )
}
