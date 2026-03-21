import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

interface TelegramUpdate {
  message?: {
    chat: { id: number }
    text?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json() as TelegramUpdate
    const chat = update.message?.chat

    if (!chat?.id) {
      return NextResponse.json({ ok: true })
    }

    const chatId = String(chat.id)

    // Generate a random 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000))

    // Store in Redis with 5-minute TTL
    await kv.set(`telegram-verify:${code}`, chatId, { ex: 300 })

    // Send the code back to the user via Telegram Bot API
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      console.error('[telegram/webhook] TELEGRAM_BOT_TOKEN not set')
      return NextResponse.json({ ok: true })
    }

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Your Bailey verification code is:\n\n<b>${code}</b>\n\nEnter this in the Bailey Agents dashboard → Connections → Telegram.\n\nExpires in 5 minutes.`,
        parse_mode: 'HTML',
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[telegram/webhook] error:', err)
    return NextResponse.json({ ok: true })
  }
}
