import { NextRequest, NextResponse } from 'next/server'
import { saveFacebookPage } from '@/lib/kv'

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

  try {
    // Exchange code for user access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', appId)
    tokenUrl.searchParams.set('client_secret', appSecret)
    tokenUrl.searchParams.set('redirect_uri', redirectUri)
    tokenUrl.searchParams.set('code', code)

    const tokenRes = await fetch(tokenUrl.toString())
    if (!tokenRes.ok) {
      console.error('[auth/facebook/callback] token exchange failed:', await tokenRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=token_exchange`)
    }

    const tokenData = await tokenRes.json() as { access_token?: string; error?: { message: string } }
    if (!tokenData.access_token) {
      console.error('[auth/facebook/callback] no access token:', tokenData.error?.message)
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_token`)
    }

    // Fetch user's Facebook pages
    const pagesUrl = new URL('https://graph.facebook.com/v18.0/me/accounts')
    pagesUrl.searchParams.set('access_token', tokenData.access_token)
    pagesUrl.searchParams.set('fields', 'id,name,access_token')

    const pagesRes = await fetch(pagesUrl.toString())
    if (!pagesRes.ok) {
      console.error('[auth/facebook/callback] pages fetch failed:', await pagesRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=pages_fetch`)
    }

    const pagesData = await pagesRes.json() as {
      data?: Array<{ id: string; name: string; access_token: string }>
    }

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_pages`)
    }

    const page = pagesData.data[0]

    await saveFacebookPage(email.toLowerCase(), {
      pageId:          page.id,
      pageName:        page.name,
      pageAccessToken: page.access_token,
      connectedAt:     new Date().toISOString(),
    })

    console.log(`[auth/facebook/callback] connected page "${page.name}" for ${email}`)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?connected=facebook`)
  } catch (err) {
    console.error('[auth/facebook/callback] unexpected error:', err)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=server`)
  }
}
