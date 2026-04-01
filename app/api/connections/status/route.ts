import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { kv } from '@/lib/kv'
import type { FacebookPageRecord, InstagramAccountRecord } from '@/lib/kv'

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = session.email.toLowerCase()

  const [telegramChatId, slackWebhook, whatsappConfig, facebookPage, instagramAccount, linkedInAccount, googleAccount, agentXBookKey] = await Promise.all([
    kv.get<string>(`telegram-chatid:${email}`),
    kv.get<string>(`slack-webhook:${email}`),
    kv.get<{ provider: string }>(`whatsapp-config:${email}`),
    kv.get<FacebookPageRecord>(`facebook:${email}`),
    kv.get<InstagramAccountRecord>(`instagram:${email}`),
    kv.get<{ name: string; personId: string }>(`linkedin:${email}`),
    kv.get<{ accessToken: string; email: string }>(`google:${email}`),
    kv.get<string>(`agentxbook_key:${email}`),
  ])

  return NextResponse.json({
    telegram: telegramChatId
      ? { connected: true,  chatId:      telegramChatId }
      : { connected: false },
    slack: slackWebhook
      ? { connected: true,  webhookUrl:  slackWebhook }
      : { connected: false },
    whatsapp: whatsappConfig
      ? { connected: true,  provider:    whatsappConfig.provider }
      : { connected: false },
    facebook: facebookPage
      ? { connected: true,  pageName:    facebookPage.pageName }
      : { connected: false },
    instagram: instagramAccount
      ? { connected: true,  username:    instagramAccount.username, accountName: instagramAccount.accountName }
      : { connected: false },
    linkedin: linkedInAccount
      ? { connected: true,  name:        linkedInAccount.name }
      : { connected: false },
    google: googleAccount ? { connected: true } : { connected: false },
    agentxbook: agentXBookKey ? { connected: true } : { connected: false },
  })
}
