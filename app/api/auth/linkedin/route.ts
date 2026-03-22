import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.redirect(`${BASE_URL}/login`)
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/connections?error=config`)
  }

  const redirectUri = `${BASE_URL}/api/auth/linkedin/callback`
  const scope       = 'openid profile email w_member_social'

  const oauthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization')
  oauthUrl.searchParams.set('response_type', 'code')
  oauthUrl.searchParams.set('client_id',     clientId)
  oauthUrl.searchParams.set('redirect_uri',  redirectUri)
  oauthUrl.searchParams.set('scope',         scope)
  oauthUrl.searchParams.set('state',         session.email.toLowerCase())

  return NextResponse.redirect(oauthUrl.toString())
}
