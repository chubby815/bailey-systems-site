import { kv } from '@/lib/kv'

interface GoogleRecord {
  accessToken:  string
  refreshToken: string | null
  expiresAt:    string
  email:        string
  connectedAt:  string
}

interface RefreshResponse {
  access_token: string
  expires_in:   number
}

export async function getGoogleAccessToken(email: string): Promise<string | null> {
  const record = await kv.get<GoogleRecord>(`google:${email}`)
  if (!record) return null

  // If token is still valid (with 2 min buffer) return it
  const expiresAt = new Date(record.expiresAt).getTime()
  if (Date.now() < expiresAt - 2 * 60 * 1000) {
    return record.accessToken
  }

  // Token expired — refresh it
  if (!record.refreshToken) return null

  const clientId     = process.env.GOOGLE_CLIENT_ID     ?? ''
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ''

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: record.refreshToken,
      client_id:     clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    console.error('[google-token] refresh failed:', await res.text())
    return null
  }

  const data = await res.json() as RefreshResponse
  const newExpiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()

  await kv.set(`google:${email}`, {
    ...record,
    accessToken: data.access_token,
    expiresAt:   newExpiresAt,
  })

  return data.access_token
}
