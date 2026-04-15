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
      <div
        style={{
          background: "rgba(10,11,12,0.95)",
          border: "1px solid rgba(75,83,32,0.5)",
          boxShadow: "0 0 30px rgba(75,83,32,0.1), inset 0 1px 0 rgba(255,176,0,0.05)",
        }}
      >
        {/* Terminal header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            borderBottom: "1px solid rgba(75,83,32,0.3)",
            background: "rgba(75,83,32,0.06)",
          }}
        >
          <div style={{ width: "8px", height: "8px", background: "#ffb000", borderRadius: "1px" }} />
          <span style={{ fontSize: "9px", color: "#4b5320", fontFamily: "var(--font-tactical)", letterSpacing: "0.2em" }}>
            ENTER TARGET PROFILE:
          </span>
          <span style={{ marginLeft: "auto", fontSize: "9px", color: "#374151", fontFamily: "var(--font-tactical)" }}>
            SYS/AI-GEN-v2.1
          </span>
        </div>

        <div style={{ padding: "12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <span style={{ color: "#4b5320", fontFamily: "var(--font-tactical)", fontSize: "12px", marginTop: "6px", flexShrink: 0 }}>›_</span>
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="What type of business are you building?"
              rows={3}
              style={{
                flex: 1,
                background: "transparent",
                color: "#e5e5e0",
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "var(--font-tactical)",
                fontSize: "13px",
                lineHeight: "1.6",
                letterSpacing: "0.03em",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
              paddingTop: "10px",
              borderTop: "1px solid rgba(75,83,32,0.25)",
            }}
          >
            <span style={{ fontSize: "9px", color: "#374151", fontFamily: "var(--font-tactical)", letterSpacing: "0.1em" }}>
              7-DAY TRIAL · CHARGES ON DAY 7
            </span>

            <button
              onClick={handleStart}
              disabled={loading}
              style={{
                background: loading ? "rgba(75,83,32,0.3)" : "#ffb000",
                color: loading ? "#4b5320" : "#0a0b0c",
                border: "none",
                padding: "8px 20px",
                fontFamily: "var(--font-tactical)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
                transition: "all 0.2s ease",
                minWidth: "140px",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "10px", color: "#ffb000", letterSpacing: "0.15em" }}>DECRYPTING...</span>
                  <span
                    style={{
                      display: "block",
                      height: "2px",
                      background: "rgba(75,83,32,0.2)",
                      width: "100px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      className="decrypt-bar"
                      style={{
                        display: "block",
                        height: "100%",
                        background: "#ffb000",
                        width: "0%",
                      }}
                    />
                  </span>
                </span>
              ) : "▶ DEPLOY →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
