import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = process.env.PRO_SECRET
  return NextResponse.redirect(new URL(`/pro?token=${token}`, req.url))
}
