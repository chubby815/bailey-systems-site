import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'

export async function DELETE(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = session.email.toLowerCase()
  await kv.del(`facebook:${email}`)

  console.log(`[facebook/disconnect] removed facebook connection for ${email}`)
  return NextResponse.json({ success: true })
}
