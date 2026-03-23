import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.redirect(`${BASE_URL}/login`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 })
  }

  const redirectUri = `${BASE_URL}/api/auth/google/callback`
  const scope = 'https://www.googleapis.com/auth/spreadsheets'

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code',
    scope,
    access_type:   'offline',
    prompt:        'consent',
    state:         session.email,
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
