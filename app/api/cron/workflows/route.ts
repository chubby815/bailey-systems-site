import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

export const maxDuration = 300

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

interface ScheduleRecord {
  email:          string
  cronExpression: string
  workflowId:     string
  lastRun?:       string
  enabled:        boolean
}

// Matches common cron patterns: *, */n, n, n,m
function matchesCron(expression: string, now: Date): boolean {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return false
  const [minPat, hrPat, domPat, monPat, dowPat] = parts

  function matches(pat: string, val: number): boolean {
    if (pat === '*') return true
    if (pat.startsWith('*/')) return val % parseInt(pat.slice(2)) === 0
    if (pat.includes(',')) return pat.split(',').map(Number).includes(val)
    return parseInt(pat) === val
  }

  return (
    matches(minPat, now.getMinutes()) &&
    matches(hrPat,  now.getHours())   &&
    matches(domPat, now.getDate())    &&
    matches(monPat, now.getMonth() + 1) &&
    matches(dowPat, now.getDay())
  )
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization: Bearer {CRON_SECRET}
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const now = new Date()
  console.log(`[cron/workflows] tick at ${now.toISOString()}`)

  try {
    const workflowIds = await kv.smembers<string[]>('scheduled-workflows')
    if (!workflowIds || workflowIds.length === 0) {
      return NextResponse.json({ ran: 0, message: 'No scheduled workflows' })
    }

    let ran = 0
    const skipped: string[] = []
    const errors:  string[] = []

    for (const workflowId of workflowIds) {
      try {
        const schedule = await kv.get<ScheduleRecord>(`schedule:${workflowId}`)
        if (!schedule?.enabled || !schedule.cronExpression) {
          skipped.push(`${workflowId}: disabled or no expression`)
          continue
        }

        // Prevent double-run: skip if ran in the last 4 minutes
        if (schedule.lastRun) {
          const diffMs = now.getTime() - new Date(schedule.lastRun).getTime()
          if (diffMs < 4 * 60 * 1000) {
            skipped.push(`${workflowId}: ran ${Math.round(diffMs / 1000)}s ago`)
            continue
          }
        }

        if (!matchesCron(schedule.cronExpression, now)) {
          skipped.push(`${workflowId}: cron not due`)
          continue
        }

        console.log(`[cron] ▶ running ${workflowId} for ${schedule.email}`)

        const res = await fetch(`${BASE_URL}/api/workflows/run`, {
          method: 'POST',
          headers: {
            'Content-Type':    'application/json',
            'x-cron-secret':   cronSecret ?? 'cron',
          },
          body: JSON.stringify({ workflowId, _cronEmail: schedule.email }),
        })

        if (res.ok) {
          await kv.set(`schedule:${workflowId}`, { ...schedule, lastRun: now.toISOString() })
          ran++
          console.log(`[cron] ✅ ${workflowId} done`)
        } else {
          const errText = await res.text()
          errors.push(`${workflowId}: ${errText.slice(0, 120)}`)
          console.error(`[cron] ❌ ${workflowId} failed:`, errText.slice(0, 200))
        }
      } catch (err) {
        errors.push(`${workflowId}: ${String(err).slice(0, 120)}`)
        console.error(`[cron] ❌ ${workflowId} exception:`, err)
      }
    }

    console.log(`[cron] done — ran: ${ran}, skipped: ${skipped.length}, errors: ${errors.length}`)
    return NextResponse.json({ ran, total: workflowIds.length, skipped: skipped.length, errors })
  } catch (err) {
    console.error('[cron/workflows] fatal:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
