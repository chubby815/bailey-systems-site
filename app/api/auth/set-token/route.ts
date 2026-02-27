import { NextRequest, NextResponse } from 'next/server'

const VALID_TOKENS: Record<string, string> = {
  [process.env.PRO_SECRET!]:   'pro',
  [process.env.ELITE_SECRET!]: 'elite',
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token || !VALID_TOKENS[token]) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const tier = VALID_TOKENS[token]
  const response = NextResponse.redirect(new URL(`/${tier}`, req.url))

  response.cookies.set(`bailey_${tier}_auth`, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return response
}
