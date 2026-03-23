import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

interface GoogleTokenResponse {
  access_token:  string
  refresh_token?: string
  expires_in:    number
  token_type:    string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state') // email
  const error = searchParams.get('error')

  if (error || !code || !state) {
    console.error('[google/callback] error or missing params:', error)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=google_denied`)
  }

  const email = state.toLowerCase()
  const clientId     = process.env.GOOGLE_CLIENT_ID     ?? ''
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ''
  const redirectUri  = `${BASE_URL}/api/auth/google/callback`

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     clientId,
      client_secret: clientSecret,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    console.error('[google/callback] token exchange failed:', err)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=google_token`)
  }

  const tokens = await tokenRes.json() as GoogleTokenResponse

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()

  await kv.set(`google:${email}`, {
    accessToken:  tokens.access_token,
    refreshToken: tokens.refresh_token ?? null,
    expiresAt,
    email,
    connectedAt: new Date().toISOString(),
  })

  console.log(`[google/callback] connected Google Sheets for ${email}`)
  return NextResponse.redirect(`${BASE_URL}/dashboard/connections?success=google`)
}
