'use client'
import { useState, useEffect } from 'react'

export default function DealBanner() {
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
      background: '#0a0b0c',
      border: '1px solid rgba(255,176,0,0.5)',
      padding: '1.25rem',
      maxWidth: '200px',
      boxShadow: '0 0 30px rgba(255,176,0,0.15), inset 0 0 0 1px rgba(75,83,32,0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.65rem',
      textAlign: 'center',
      clipPath: 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)',
    }}>

      {/* Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(255,176,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        background: 'rgba(255,176,0,0.1)',
        border: '1px solid rgba(255,176,0,0.4)',
        padding: '0.2rem 0.65rem',
        fontSize: '0.6rem',
        fontWeight: 700,
        color: '#ffb000',
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        fontFamily: 'var(--font-tactical)',
        position: 'relative',
        zIndex: 1,
      }}>
        ■ PRIORITY ALERT ■
      </div>

      {/* Main text */}
      <p style={{
        color: '#e5e5e0',
        fontSize: '0.8rem',
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.5,
        fontFamily: 'var(--font-tactical)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        position: 'relative',
        zIndex: 1,
      }}>
        BUY 1 AI WEBSITE —{' '}
        <span style={{ color: '#ffb000' }}>GET 1 FREE</span>
        {' '}FOR A FRIEND
      </p>

      {/* Countdown */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.3rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{ color: '#4b5320', fontSize: '0.65rem', fontFamily: 'var(--font-tactical)', letterSpacing: '0.1em' }}>⏱ MISSION ENDS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          {[
            { value: timeLeft.days,    label: 'D' },
            { value: timeLeft.hours,   label: 'H' },
            { value: timeLeft.minutes, label: 'M' },
            { value: timeLeft.seconds, label: 'S' },
          ].map(({ value, label }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {i > 0 && (
                <span style={{ color: '#4b5320', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-tactical)' }}>:</span>
              )}
              <div style={{
                background: '#111418',
                border: '1px solid rgba(75,83,32,0.4)',
                padding: '0.2rem 0.3rem',
                textAlign: 'center',
              }}>
                <div style={{
                  color: '#ffb000',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'var(--font-tactical)',
                }}>
                  {String(value).padStart(2, '0')}
                </div>
                <div style={{
                  color: '#4b5320',
                  fontSize: '0.5rem',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-tactical)',
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
          background: '#ffb000',
          color: '#0a0b0c',
          fontWeight: 800,
          fontSize: '0.65rem',
          padding: '0.45rem 1rem',
          textDecoration: 'none',
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          fontFamily: 'var(--font-tactical)',
          boxShadow: '0 0 12px rgba(255,176,0,0.3)',
          position: 'relative',
          zIndex: 1,
          whiteSpace: 'nowrap',
          clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
          display: 'block',
          width: '100%',
          textAlign: 'center',
        }}
      >
        ▶ CLAIM MISSION →
      </a>

    </div>
  )
}
