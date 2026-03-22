import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const email = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !email) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=oauth_denied`)
  }

  const clientId     = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=config`)
  }

  const redirectUri = `${BASE_URL}/api/auth/linkedin/callback`

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        redirect_uri:  redirectUri,
        client_id:     clientId,
        client_secret: clientSecret,
      }).toString(),
    })

    if (!tokenRes.ok) {
      console.error('[LinkedIn Callback] token error:', await tokenRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=token_exchange`)
    }

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string }
    if (!tokenData.access_token) {
      console.error('[LinkedIn Callback] no access token:', tokenData.error)
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_token`)
    }

    // Get person info via OpenID Connect userinfo endpoint
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!profileRes.ok) {
      console.error('[LinkedIn Callback] profile fetch failed:', await profileRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=server`)
    }

    const profile = await profileRes.json() as { sub: string; name?: string }

    await kv.set(`linkedin:${email.toLowerCase()}`, {
      accessToken: tokenData.access_token,
      personId:    profile.sub,
      name:        profile.name ?? email,
      connectedAt: new Date().toISOString(),
    })

    console.log(`[LinkedIn Callback] connected for ${email} — personId: ${profile.sub}`)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?connected=linkedin`)
  } catch (err) {
    console.error('[LinkedIn Callback] unexpected error:', err)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=server`)
  }
}
