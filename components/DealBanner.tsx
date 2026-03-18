'use client'
import { useState, useEffect } from 'react'

export default function DealBanner() {
  // Deal ends March 24 2026 midnight
  const DEAL_END = new Date('2026-03-24T00:00:00').getTime()

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const tick = () => {
      const diff = DEAL_END - Date.now()
      if (diff <= 0) {
        setExpired(true)
        return
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [DEAL_END])

  if (expired) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)',
      borderBottom: '1px solid #ff6600',
      padding: '1rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(255,102,0,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255,102,0,0.15)',
          border: '1px solid #ff6600',
          borderRadius: '100px',
          padding: '0.25rem 1rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#ff6600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
        }}>
          🚨 Limited Time Deal 🚨
        </div>

        {/* Main text */}
        <p style={{
          color: '#ffffff',
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          fontWeight: 600,
          margin: 0,
          lineHeight: 1.5,
        }}>
          Buy 1 AI Website — Get 1{' '}
          <span style={{ color: '#ff6600', fontWeight: 900 }}>FREE</span>
          {' '}for a friend.{' '}
          <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.9em' }}>
            No coding. No waiting. Built in seconds.
          </span>
        </p>

        {/* Countdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>⏳ Ends in</span>

          {[
            { value: timeLeft.days,    label: 'days' },
            { value: timeLeft.hours,   label: 'hrs' },
            { value: timeLeft.minutes, label: 'min' },
            { value: timeLeft.seconds, label: 'sec' },
          ].map(({ value, label }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {i > 0 && (
                <span style={{ color: '#ff6600', fontWeight: 700, fontSize: '1rem' }}>:</span>
              )}
              <div style={{
                background: '#0a0a0a',
                border: '1px solid #ff6600',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                minWidth: '2.5rem',
                textAlign: 'center',
              }}>
                <div style={{
                  color: '#ff6600',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {String(value).padStart(2, '0')}
                </div>
                <div style={{
                  color: '#4b5563',
                  fontSize: '0.6rem',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/pricing"
          style={{
            background: '#ff6600',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.85rem',
            padding: '0.5rem 1.5rem',
            borderRadius: '100px',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            boxShadow: '0 0 20px rgba(255,102,0,0.4)',
          }}
        >
          Claim Deal →
        </a>

      </div>
    </div>
  )
}
