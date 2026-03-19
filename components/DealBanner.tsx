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
      position: 'fixed',
      left: '1.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 9999,
      background: '#0a0a0a',
      border: '2px solid #ff6600',
      borderRadius: '16px',
      padding: '1.25rem',
      maxWidth: '220px',
      boxShadow: '0 0 30px rgba(255,102,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      textAlign: 'center',
    }}>

      {/* Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '16px',
        background: 'radial-gradient(ellipse at center, rgba(255,102,0,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        background: 'rgba(255,102,0,0.15)',
        border: '1px solid #ff6600',
        borderRadius: '100px',
        padding: '0.2rem 0.75rem',
        fontSize: '0.65rem',
        fontWeight: 700,
        color: '#ff6600',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        position: 'relative',
        zIndex: 1,
      }}>
        🚨 Limited Time 🚨
      </div>

      {/* Main text */}
      <p style={{
        color: '#ffffff',
        fontSize: '0.9rem',
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.4,
        position: 'relative',
        zIndex: 1,
      }}>
        Buy 1 AI Website —{' '}
        <span style={{ color: '#ff6600', fontWeight: 900 }}>Get 1 FREE</span>
        {' '}for a friend
      </p>

      {/* Countdown */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>⏳ Ends in</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          {[
            { value: timeLeft.days,    label: 'd' },
            { value: timeLeft.hours,   label: 'h' },
            { value: timeLeft.minutes, label: 'm' },
            { value: timeLeft.seconds, label: 's' },
          ].map(({ value, label }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {i > 0 && (
                <span style={{ color: '#ff6600', fontWeight: 700, fontSize: '0.9rem' }}>:</span>
              )}
              <div style={{
                background: '#111214',
                border: '1px solid #ff6600',
                borderRadius: '5px',
                padding: '0.2rem 0.35rem',
                textAlign: 'center',
              }}>
                <div style={{
                  color: '#ff6600',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {String(value).padStart(2, '0')}
                </div>
                <div style={{
                  color: '#4b5563',
                  fontSize: '0.55rem',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.04em',
                }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href="/pricing"
        style={{
          background: '#ff6600',
          color: '#000',
          fontWeight: 800,
          fontSize: '0.75rem',
          padding: '0.5rem 1.25rem',
          borderRadius: '100px',
          textDecoration: 'none',
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          boxShadow: '0 0 16px rgba(255,102,0,0.5)',
          position: 'relative',
          zIndex: 1,
          whiteSpace: 'nowrap',
        }}
      >
        Claim Deal →
      </a>

    </div>
  )
}
