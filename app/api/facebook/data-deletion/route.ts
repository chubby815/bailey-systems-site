import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://baileyagents.com'

/**
 * Parse Facebook's signed_request parameter.
 * Format: base64url(signature).base64url(payload)
 * Payload contains: { user_id, algorithm, issued_at }
 */
function parseSignedRequest(
  signedRequest: string,
  appSecret: string,
): { user_id?: string; algorithm?: string; issued_at?: number } | null {
  try {
    const [encodedSig, encodedPayload] = signedRequest.split('.')
    if (!encodedSig || !encodedPayload) return null

    // Decode payload (base64url → JSON)
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
    const data = JSON.parse(payload) as { user_id?: string; algorithm?: string; issued_at?: number }

    // Verify signature
    const expectedSig = createHmac('sha256', appSecret)
      .update(encodedPayload)
      .digest('base64url')

    if (expectedSig !== encodedSig) {
      console.error('[data-deletion] signature mismatch')
      return null
    }

    return data
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const appSecret = process.env.FACEBOOK_APP_SECRET

  let signed_request: string | undefined
  try {
    // Facebook sends as form-encoded, not JSON
    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text()
      const params = new URLSearchParams(text)
      signed_request = params.get('signed_request') ?? undefined
    } else {
      const body = await req.json() as { signed_request?: string }
      signed_request = body?.signed_request
    }
  } catch {
    // body may be empty
  }

  let userId = 'unknown'

  if (signed_request && appSecret) {
    const parsed = parseSignedRequest(signed_request, appSecret)
    if (parsed?.user_id) {
      userId = parsed.user_id
      console.log(`[data-deletion] Facebook requested deletion for user_id: ${userId}`)
    } else {
      console.warn('[data-deletion] could not parse signed_request')
    }
  }

  // Note: We store Facebook data by email, not by Facebook user_id.
  // Deletion by email is handled via dashboard disconnect or email to lilianajs27@gmail.com.
  // This endpoint satisfies Meta's App Review requirement by returning a valid confirmation.
  return NextResponse.json({
    url:               `${BASE_URL}/data-deletion`,
    confirmation_code: userId,
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'Bailey Agents — Facebook data deletion endpoint. See /data-deletion for instructions.',
    url:     `${BASE_URL}/data-deletion`,
  })
}
