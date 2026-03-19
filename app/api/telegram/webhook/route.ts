import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

interface TelegramMessage {
  chat?: { id?: number }
  text?: string
}
interface TelegramUpdate {
  message?: TelegramMessage
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TelegramUpdate
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = String(message.chat?.id ?? '')
    const text   = message.text ?? ''

    if (!chatId) return NextResponse.json({ ok: true })

    if (text.startsWith('/start')) {
      // Generate 6-digit numeric code, store for 10 minutes
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      await kv.set(`telegram-verify:${code}`, chatId, { ex: 600 })

      const token = process.env.TELEGRAM_BOT_TOKEN
      if (token) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            parse_mode: 'HTML',
            text: [
              '🤖 <b>Bailey Agents</b>',
              '',
              'Your verification code is:',
              '',
              `<code>${code}</code>`,
              '',
              'Enter this code in the <b>Connections</b> page inside your dashboard.',
              'It expires in 10 minutes.',
            ].join('\n'),
          }),
        })
      }
    }
  } catch (err) {
    console.error('[telegram/webhook]', err)
  }

  // Always return 200 so Telegram stops retrying
  return NextResponse.json({ ok: true })
}
