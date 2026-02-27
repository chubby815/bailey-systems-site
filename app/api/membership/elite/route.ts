import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = process.env.ELITE_SECRET
  return NextResponse.redirect(new URL(`/elite?token=${token}`, req.url))
}
