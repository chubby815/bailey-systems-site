import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = process.env.PRO_SECRET || 'bailey_pro_2026'
  const response = NextResponse.redirect(new URL(`/pro?token=${token}`, req.url))

  response.cookies.set('bailey_pro_auth', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return response
}
