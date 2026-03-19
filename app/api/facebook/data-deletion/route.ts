import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let signed_request: string | undefined
  try {
    const body = await req.json() as { signed_request?: string }
    signed_request = body?.signed_request
  } catch {
    // body may be empty or non-JSON
  }

  return NextResponse.json({
    url:               'https://www.baileyagents.com/data-deletion',
    confirmation_code: signed_request ?? 'deleted',
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'Data deletion endpoint',
  })
}
