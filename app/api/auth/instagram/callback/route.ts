import { NextRequest, NextResponse } from 'next/server'
import { saveInstagramAccount } from '@/lib/kv'

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

  const redirectUri = `${BASE_URL}/api/auth/instagram/callback`

  try {
    // Exchange code for user access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', appId)
    tokenUrl.searchParams.set('client_secret', appSecret)
    tokenUrl.searchParams.set('redirect_uri', redirectUri)
    tokenUrl.searchParams.set('code', code)

    const tokenRes = await fetch(tokenUrl.toString())
    if (!tokenRes.ok) {
      console.error('[auth/instagram/callback] token exchange failed:', await tokenRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=token_exchange`)
    }

    const tokenData = await tokenRes.json() as { access_token?: string; error?: { message: string } }
    if (!tokenData.access_token) {
      console.error('[auth/instagram/callback] no access token:', tokenData.error?.message)
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_token`)
    }

    const userToken = tokenData.access_token

    // Fetch pages with Instagram Business Account field
    const pagesUrl = new URL('https://graph.facebook.com/v18.0/me/accounts')
    pagesUrl.searchParams.set('access_token', userToken)
    pagesUrl.searchParams.set('fields', 'id,name,access_token,instagram_business_account')

    const pagesRes = await fetch(pagesUrl.toString())
    if (!pagesRes.ok) {
      console.error('[auth/instagram/callback] pages fetch failed:', await pagesRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=pages_fetch`)
    }

    const pagesData = await pagesRes.json() as {
      data?: Array<{
        id: string
        name: string
        access_token: string
        instagram_business_account?: { id: string }
      }>
    }

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_pages`)
    }

    // Find first page with a connected Instagram Business Account
    const pageWithIg = pagesData.data.find(p => p.instagram_business_account?.id)
    if (!pageWithIg?.instagram_business_account?.id) {
      console.log(`[auth/instagram/callback] no instagram found for ${email} — pages: ${pagesData.data?.map(p => p.name).join(', ')}`)
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=no_instagram`)
    }

    // Fetch Instagram account details
    const igId = pageWithIg.instagram_business_account.id
    const igUrl = new URL(`https://graph.facebook.com/v18.0/${igId}`)
    igUrl.searchParams.set('fields', 'id,name,username')
    igUrl.searchParams.set('access_token', pageWithIg.access_token)

    const igRes = await fetch(igUrl.toString())
    if (!igRes.ok) {
      console.error('[auth/instagram/callback] IG details fetch failed:', await igRes.text())
      return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=server`)
    }
    const igData = await igRes.json() as { id: string; name?: string; username?: string }

    await saveInstagramAccount(email.toLowerCase(), {
      accountId:       igId,
      accountName:     igData.name ?? igData.username ?? 'Instagram Account',
      username:        igData.username ?? '',
      pageAccessToken: pageWithIg.access_token,
      pageId:          pageWithIg.id,
      connectedAt:     new Date().toISOString(),
    })

    console.log(`[auth/instagram/callback] connected Instagram "@${igData.username}" for ${email}`)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?connected=instagram`)
  } catch (err) {
    console.error('[auth/instagram/callback] unexpected error:', err)
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=server`)
  }
}
