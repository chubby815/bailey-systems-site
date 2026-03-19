import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'
import { randomBytes } from 'crypto'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code  = searchParams.get('code')
  const email = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !email) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=oauth_denied`)
  }

  const appId     = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET

  if (!appId || !appSecret) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=config`)
  }

  const redirectUri = `${BASE_URL}/api/auth/facebook/callback`

  console.log('[FB Callback] BASE_URL:', BASE_URL)
  console.log('[FB Callback] appId:', appId?.slice(0, 6))
  console.log('[FB Callback] redirectUri:', redirectUri)
  console.log('[FB Callback] code:', code?.slice(0, 20))

  try {
    // Exchange code for user access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', appId)
    tokenUrl.searchParams.set('client_secret', appSecret)
    tokenUrl.searchParams.set('redirect_uri', redirectUri)
    tokenUrl.searchParams.set('code', code)

    const tokenRes = await fetch(tokenUrl.toString())
    if (!tokenRes.ok) {
      const errorText = await tokenRes.text()
      console.error('[FB Callback] token error:', errorText)
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=token_exchange`)
    }

    const tokenData = await tokenRes.json() as { access_token?: string; error?: { message: string } }
    if (!tokenData.access_token) {
      console.error('[FB Callback] no access token:', tokenData.error?.message)
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_token`)
    }

    // Fetch user's Facebook pages
    const pagesUrl = new URL('https://graph.facebook.com/v18.0/me/accounts')
    pagesUrl.searchParams.set('access_token', tokenData.access_token)
    pagesUrl.searchParams.set('fields', 'id,name,access_token,fan_count,picture')

    const pagesRes = await fetch(pagesUrl.toString())
    if (!pagesRes.ok) {
      console.error('[FB Callback] pages fetch failed:', await pagesRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=pages_fetch`)
    }

    const pagesData = await pagesRes.json() as {
      data?: Array<{ id: string; name: string; access_token: string; fan_count?: number }>
    }

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_pages`)
    }

    console.log(`[FB Callback] found ${pagesData.data.length} pages for ${email}`)

    // If only one page, skip the selector and save directly
    if (pagesData.data.length === 1) {
      const page = pagesData.data[0]
      const { saveFacebookPage } = await import('@/lib/kv')
      await saveFacebookPage(email.toLowerCase(), {
        pageId:          page.id,
        pageName:        page.name,
        pageAccessToken: page.access_token,
        connectedAt:     new Date().toISOString(),
      })
      console.log(`[FB Callback] auto-connected single page "${page.name}" for ${email}`)
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?connected=facebook`)
    }

    // Multiple pages — store temporarily in Redis and let user choose
    const token = randomBytes(24).toString('hex')
    await kv.set(
      `fb-pages-pending:${token}`,
      { email: email.toLowerCase(), pages: pagesData.data },
      { ex: 300 }, // 5-minute TTL
    )

    console.log(`[FB Callback] stored ${pagesData.data.length} pages under token ${token.slice(0, 8)}…`)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections/facebook-pages?token=${token}`)
  } catch (err) {
    console.error('[FB Callback] unexpected error:', err)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=server`)
  }
}
