import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.redirect(`${BASE_URL}/login`)
  }

  const appId = process.env.FACEBOOK_APP_ID
  if (!appId) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=config`)
  }

  const redirectUri = `${BASE_URL}/api/auth/instagram/callback`
  const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement'

  const oauthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
  oauthUrl.searchParams.set('client_id', appId)
  oauthUrl.searchParams.set('redirect_uri', redirectUri)
  oauthUrl.searchParams.set('scope', scope)
  oauthUrl.searchParams.set('state', session.email.toLowerCase())
  oauthUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(oauthUrl.toString())
}
