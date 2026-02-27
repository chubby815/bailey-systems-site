import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = process.env.ELITE_SECRET || 'bailey_elite_2026'
  const response = NextResponse.redirect(new URL(`/elite?token=${token}`, req.url))

  response.cookies.set('bailey_elite_auth', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return response
}
