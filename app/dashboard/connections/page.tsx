'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// ── Types ────────────────────────────────────────────────────────────────────

interface ConnectionStatus {
  telegram:  { connected: boolean; chatId?: string }
  slack:     { connected: boolean; webhookUrl?: string }
  whatsapp:  { connected: boolean; provider?: string }
  facebook:  { connected: boolean; pageName?: string }
  instagram: { connected: boolean; username?: string; accountName?: string }
  linkedin:  { connected: boolean; name?: string }
  google:    { connected: boolean }
}

type ConnectionId = keyof ConnectionStatus

interface SaveResult { success?: boolean; error?: string }

// ── Sidebar items (matches dashboard/page.tsx) ────────────────────────────────

const NAV = [
  { icon: '🌐', label: 'My Sites',        href: '/dashboard' },
  { icon: '⚡', label: 'Workflows',        href: '/dashboard/workflows' },
  { icon: '🎯', label: 'Lead Hunter',      href: '/dashboard/leads' },
  { icon: '✍️', label: 'Content Machine',  href: '/dashboard/content' },
  { icon: '🔥', label: 'Website Roast',    href: '/dashboard/roast' },
  { icon: '📘', label: 'Facebook',         href: '/dashboard/facebook' },
  { icon: '✉️', label: 'Email Marketer',   href: '/dashboard/email' },
  { icon: '✍️', label: 'Copywriter',       href: '/dashboard/copywriter' },
  { icon: '💰', label: 'Sales Manager',    href: '/dashboard/sales' },
  { icon: '🎧', label: 'Customer Support', href: '/dashboard/support' },
  { icon: '📊', label: 'Usage',            href: '/dashboard/usage' },
  { icon: '💳', label: 'Billing',          href: '/dashboard/billing' },
  { icon: '🔗', label: 'Connections',      href: '/dashboard/connections' },
]

// ── Main page ─────────────────────────────────────────────────────────────────

const ERROR_MESSAGES: Record<string, string> = {
  oauth_denied:   'Connection cancelled.',
  config:         'OAuth not configured — contact support.',
  token_exchange: 'Token exchange failed — please try again.',
  no_token:       'No access token returned — please try again.',
  pages_fetch:    'Could not fetch your pages — please try again.',
  no_pages:       'No Facebook pages found. Make sure you manage at least one page.',
  no_instagram:   'No Instagram Business Account found. Connect one to your Facebook page first.',
  server:         'Server error — please try again.',
}

export default function ConnectionsPage() {
  const [statuses, setStatuses]   = useState<ConnectionStatus | null>(null)
  const [expanded, setExpanded]   = useState<ConnectionId | null>(null)
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState<Record<string, string>>({})

  // Facebook disconnect
  const [fbDisconnecting, setFbDisconnecting] = useState(false)

  // Telegram verify
  const [telegramCode, setTelegramCode]   = useState('')
  // Slack
  const [slackWebhook, setSlackWebhook]   = useState('')
  // WhatsApp
  const [waProvider, setWaProvider]       = useState<'twilio' | 'meta'>('twilio')
  const [waAccountSid, setWaAccountSid]   = useState('')
  const [waAuthToken, setWaAuthToken]     = useState('')
  const [waFrom, setWaFrom]               = useState('')
  const [waMetaToken, setWaMetaToken]     = useState('')
  const [waPhoneId, setWaPhoneId]         = useState('')

  const searchParams = useSearchParams()

  useEffect(() => {
    void fetch('/api/connections/status')
      .then(r => r.json())
      .then((d: ConnectionStatus) => setStatuses(d))
      .catch(() => setStatuses({
        telegram:  { connected: false },
        slack:     { connected: false },
        whatsapp:  { connected: false },
        facebook:  { connected: false },
        instagram: { connected: false },
        linkedin:  { connected: false },
        google:    { connected: false },
      }))
  }, [])

  // Flash success/error from OAuth redirects
  useEffect(() => {
    const connected = searchParams.get('connected')
    const error     = searchParams.get('error')
    if (connected === 'facebook') {
      flash('facebook', '✓ Facebook page connected!')
    } else if (connected === 'instagram') {
      flash('instagram', '✓ Instagram account connected!')
    } else if (connected === 'linkedin') {
      flash('linkedin', '✓ LinkedIn account connected!')
    } else if (error) {
      const msg = ERROR_MESSAGES[error] ?? 'Connection failed — please try again.'
      // Show under whichever card is most likely — use generic top-level flash
      flash('facebook', msg)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function flash(id: string, msg: string) {
    setSaveMsg(prev => ({ ...prev, [id]: msg }))
    setTimeout(() => setSaveMsg(prev => { const n = { ...prev }; delete n[id]; return n }), 4000)
  }

  async function verifyTelegram() {
    if (!telegramCode.trim()) return
    setSaving(true)
    const res = await fetch('/api/connections/telegram/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: telegramCode.trim() }),
    })
    const data = await res.json() as SaveResult & { chatId?: string }
    setSaving(false)
    if (res.ok) {
      flash('telegram', '✓ Telegram connected!')
      setStatuses(prev => prev ? { ...prev, telegram: { connected: true, chatId: data.chatId } } : prev)
      setExpanded(null)
      setTelegramCode('')
    } else {
      flash('telegram', data.error ?? 'Invalid or expired code')
    }
  }

  async function saveSlack() {
    if (!slackWebhook.trim()) return
    setSaving(true)
    const res = await fetch('/api/connections/slack/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: slackWebhook.trim() }),
    })
    const data = await res.json() as SaveResult
    setSaving(false)
    if (res.ok) {
      flash('slack', '✓ Slack connected!')
      setStatuses(prev => prev ? { ...prev, slack: { connected: true, webhookUrl: slackWebhook.trim() } } : prev)
      setExpanded(null)
    } else {
      flash('slack', data.error ?? 'Save failed')
    }
  }

  async function saveWhatsApp() {
    setSaving(true)
    const payload = waProvider === 'twilio'
      ? { provider: 'twilio', accountSid: waAccountSid, authToken: waAuthToken, from: waFrom }
      : { provider: 'meta', token: waMetaToken, phoneId: waPhoneId }
    const res = await fetch('/api/connections/whatsapp/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json() as SaveResult
    setSaving(false)
    if (res.ok) {
      flash('whatsapp', '✓ WhatsApp connected!')
      setStatuses(prev => prev ? { ...prev, whatsapp: { connected: true, provider: waProvider } } : prev)
      setExpanded(null)
    } else {
      flash('whatsapp', data.error ?? 'Save failed')
    }
  }

  async function disconnectFacebook() {
    setFbDisconnecting(true)
    const res = await fetch('/api/connections/facebook/disconnect', { method: 'DELETE' })
    setFbDisconnecting(false)
    if (res.ok) {
      flash('facebook', '✓ Facebook disconnected')
      setStatuses(prev => prev ? { ...prev, facebook: { connected: false } } : prev)
      setExpanded(null)
    } else {
      flash('facebook', 'Disconnect failed — try again')
    }
  }

  const botUser = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? 'BaileyAgentsBot'

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Bailey<span className="text-[#00e5a0]">Agents</span>
        </Link>
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-white/[0.07] min-h-[calc(100vh-57px)] py-6 hidden md:block sticky top-[57px]">
          {NAV.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all ${
                item.href === '/dashboard/connections'
                  ? 'text-[#00e5a0] bg-[#00e5a0]/5 border-r-2 border-[#00e5a0]'
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 p-7 max-w-3xl">
          <div className="mb-8">
            <p className="text-[#00e5a0] text-xs font-bold uppercase tracking-widest mb-1">Integrations</p>
            <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Connections</h1>
            <p className="text-gray-500 text-sm">Connect your accounts so workflows can send messages and post content automatically.</p>
          </div>

          <div className="flex flex-col gap-4">

            {/* ── Telegram ── */}
            <ConnectionCard
              id="telegram"
              icon="📱"
              name="Telegram"
              color="#229ED9"
              description="Get workflow notifications and messages on Telegram"
              connected={statuses?.telegram.connected ?? false}
              detail={statuses?.telegram.chatId ? `Chat ID: ${statuses.telegram.chatId}` : undefined}
              expanded={expanded === 'telegram'}
              onToggle={() => setExpanded(expanded === 'telegram' ? null : 'telegram')}
              saveMsg={saveMsg['telegram']}
            >
              <div className="flex flex-col gap-3 pt-2">
                <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1 leading-relaxed">
                  <li>Open <a href={`https://t.me/${botUser}`} target="_blank" rel="noreferrer" className="text-[#229ED9] underline">t.me/{botUser}</a> and click <strong className="text-white">Start</strong></li>
                  <li>The bot will send you a 6-digit code</li>
                  <li>Enter it below and click Verify</li>
                </ol>
                <div className="flex gap-2">
                  <input
                    value={telegramCode}
                    onChange={e => setTelegramCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="flex-1 bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#229ED9] tracking-widest text-center"
                    onKeyDown={e => e.key === 'Enter' && void verifyTelegram()}
                  />
                  <button
                    onClick={() => void verifyTelegram()}
                    disabled={saving || !telegramCode.trim()}
                    className="bg-[#229ED9] text-white font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-[#1a8cc9] transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </ConnectionCard>

            {/* ── Slack ── */}
            <ConnectionCard
              id="slack"
              icon="💬"
              name="Slack"
              color="#4A154B"
              description="Post messages to your Slack workspace via Incoming Webhooks"
              connected={statuses?.slack.connected ?? false}
              expanded={expanded === 'slack'}
              onToggle={() => setExpanded(expanded === 'slack' ? null : 'slack')}
              saveMsg={saveMsg['slack']}
            >
              <div className="flex flex-col gap-3 pt-2">
                <p className="text-xs text-gray-500">
                  Go to <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" className="text-[#E01E5A] underline">api.slack.com/apps</a> → Your App → Incoming Webhooks → Add New Webhook to Workspace
                </p>
                <div className="flex gap-2">
                  <input
                    value={slackWebhook}
                    onChange={e => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="flex-1 bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4A154B]"
                  />
                  <button
                    onClick={() => void saveSlack()}
                    disabled={saving || !slackWebhook.trim()}
                    className="bg-[#4A154B] text-white font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                </div>
              </div>
            </ConnectionCard>

            {/* ── WhatsApp ── */}
            <ConnectionCard
              id="whatsapp"
              icon="💚"
              name="WhatsApp"
              color="#25D366"
              description="Send WhatsApp messages via Twilio or Meta Cloud API"
              connected={statuses?.whatsapp.connected ?? false}
              detail={statuses?.whatsapp.provider ? `Provider: ${statuses.whatsapp.provider}` : undefined}
              expanded={expanded === 'whatsapp'}
              onToggle={() => setExpanded(expanded === 'whatsapp' ? null : 'whatsapp')}
              saveMsg={saveMsg['whatsapp']}
            >
              <div className="flex flex-col gap-3 pt-2">
                {/* Provider toggle */}
                <div className="flex gap-2">
                  {(['twilio', 'meta'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setWaProvider(p)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        waProvider === p
                          ? 'bg-[#25D366]/15 border-[#25D366]/40 text-[#25D366]'
                          : 'bg-transparent border-white/[0.08] text-gray-500 hover:text-white'
                      }`}
                    >
                      {p === 'twilio' ? 'Twilio' : 'Meta Cloud API'}
                    </button>
                  ))}
                </div>

                {waProvider === 'twilio' && (
                  <div className="flex flex-col gap-2">
                    <input value={waAccountSid}  onChange={e => setWaAccountSid(e.target.value)}  placeholder="Account SID"          className="bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#25D366]" />
                    <input value={waAuthToken}   onChange={e => setWaAuthToken(e.target.value)}   placeholder="Auth Token"            className="bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#25D366]" type="password" />
                    <input value={waFrom}        onChange={e => setWaFrom(e.target.value)}         placeholder="From number e.g. +14155238886" className="bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#25D366]" />
                  </div>
                )}

                {waProvider === 'meta' && (
                  <div className="flex flex-col gap-2">
                    <input value={waMetaToken}  onChange={e => setWaMetaToken(e.target.value)}  placeholder="API Token (Bearer)"  className="bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#25D366]" type="password" />
                    <input value={waPhoneId}    onChange={e => setWaPhoneId(e.target.value)}    placeholder="Phone Number ID"     className="bg-[#0d0e10] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#25D366]" />
                  </div>
                )}

                <button
                  onClick={() => void saveWhatsApp()}
                  disabled={saving}
                  className="bg-[#25D366] text-black font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-[#20c05a] transition-colors self-start"
                >
                  Save WhatsApp Config
                </button>
              </div>
            </ConnectionCard>

            {/* ── Facebook ── */}
            <ConnectionCard
              id="facebook"
              icon="📘"
              name="Facebook"
              color="#1877F2"
              description="Post to your Facebook page from workflows"
              connected={statuses?.facebook.connected ?? false}
              detail={statuses?.facebook.pageName ? `Page: ${statuses.facebook.pageName}` : undefined}
              expanded={expanded === 'facebook'}
              onToggle={() => setExpanded(expanded === 'facebook' ? null : 'facebook')}
              saveMsg={saveMsg['facebook']}
            >
              {statuses?.facebook.connected ? (
                <div className="pt-2 flex flex-col gap-3">
                  <p className="text-xs text-gray-500">
                    Your Facebook page is connected. Bailey can now post to it from workflows.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <a
                      href="/api/auth/facebook"
                      className="inline-block bg-[#1877F2] text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#1565d8] transition-colors"
                    >
                      Switch Page →
                    </a>
                    <button
                      onClick={() => void disconnectFacebook()}
                      disabled={fbDisconnecting}
                      className="inline-block font-bold px-4 py-2 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      {fbDisconnecting ? 'Disconnecting…' : 'Disconnect'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-col gap-3">
                  <p className="text-xs text-gray-500">Connect your Facebook page to allow workflows to post content automatically.</p>
                  <a
                    href="/api/auth/facebook"
                    className="inline-block bg-[#1877F2] text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#1565d8] transition-colors self-start"
                  >
                    Connect Facebook →
                  </a>
                </div>
              )}
            </ConnectionCard>

            {/* ── Instagram ── */}
            <ConnectionCard
              id="instagram"
              icon="📸"
              name="Instagram"
              color="#E1306C"
              description="Post images and captions to your Instagram Business account"
              connected={statuses?.instagram.connected ?? false}
              detail={statuses?.instagram.username ? `@${statuses.instagram.username}` : undefined}
              expanded={expanded === 'instagram'}
              onToggle={() => setExpanded(expanded === 'instagram' ? null : 'instagram')}
              saveMsg={saveMsg['instagram']}
            >
              <div className="pt-2 flex flex-col gap-3">
                <p className="text-xs text-gray-500">
                  Requires an Instagram Business or Creator account connected to a Facebook page.
                  Make sure your Instagram account is linked to your Facebook page before connecting.
                </p>
                <a
                  href="/api/auth/instagram"
                  className="inline-block text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors self-start"
                  style={{ background: 'linear-gradient(135deg, #E1306C, #833AB4)' }}
                >
                  Connect Instagram →
                </a>
              </div>
            </ConnectionCard>

            {/* ── LinkedIn ── */}
            <ConnectionCard
              id="linkedin"
              icon="💼"
              name="LinkedIn"
              color="#0A66C2"
              description="Post text and updates to your LinkedIn profile from workflows"
              connected={statuses?.linkedin.connected ?? false}
              detail={statuses?.linkedin.name ? `Connected as ${statuses.linkedin.name}` : undefined}
              expanded={expanded === 'linkedin'}
              onToggle={() => setExpanded(expanded === 'linkedin' ? null : 'linkedin')}
              saveMsg={saveMsg['linkedin']}
            >
              <div className="pt-2 flex flex-col gap-3">
                <p className="text-xs text-gray-500">
                  Connect your LinkedIn profile to allow Bailey workflows to post content automatically.
                  Requires a LinkedIn app with <strong className="text-white">Share on LinkedIn</strong> and <strong className="text-white">Sign In with OpenID Connect</strong> products enabled.
                </p>
                <a
                  href="/api/auth/linkedin"
                  className="inline-block text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors self-start"
                  style={{ background: '#0A66C2' }}
                >
                  {statuses?.linkedin.connected ? 'Reconnect LinkedIn →' : 'Connect LinkedIn →'}
                </a>
              </div>
            </ConnectionCard>

            {/* ── Google Sheets ── */}
            <ConnectionCard
              id="google"
              icon="📊"
              name="Google Sheets"
              color="#0F9D58"
              description="Read and write data to Google Sheets from workflows"
              connected={false}
              expanded={expanded === 'google'}
              onToggle={() => setExpanded(expanded === 'google' ? null : 'google')}
              saveMsg={saveMsg['google']}
            >
              <div className="pt-2">
                <p className="text-xs text-gray-500">Google OAuth integration is coming soon. You&apos;ll be able to read and write Google Sheets rows from any workflow.</p>
              </div>
            </ConnectionCard>

          </div>
        </div>
      </div>
    </main>
  )
}

// ── ConnectionCard component ──────────────────────────────────────────────────

interface CardProps {
  id: string
  icon: string
  name: string
  color: string
  description: string
  connected: boolean
  detail?: string
  expanded: boolean
  onToggle: () => void
  saveMsg?: string
  children?: React.ReactNode
}

function ConnectionCard({ icon, name, color, description, connected, detail, expanded, onToggle, saveMsg, children }: CardProps) {
  return (
    <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden transition-all">
      <div className="flex items-center gap-4 p-5">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-sm text-white">{name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              connected
                ? 'text-[#00e5a0] bg-[#00e5a0]/10 border-[#00e5a0]/25'
                : 'text-gray-600 bg-white/[0.03] border-white/[0.07]'
            }`}>
              {connected ? '● Connected' : '○ Not connected'}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{detail ?? description}</p>
        </div>

        {/* Save message */}
        {saveMsg && (
          <span className={`text-xs font-medium flex-shrink-0 ${saveMsg.startsWith('✓') ? 'text-[#00e5a0]' : 'text-red-400'}`}>
            {saveMsg}
          </span>
        )}

        {/* Action button */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-lg border transition-all"
          style={expanded
            ? { background: `${color}18`, borderColor: `${color}40`, color }
            : { background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }
          }
        >
          {expanded ? 'Close' : connected ? 'Manage' : 'Connect'}
        </button>
      </div>

      {/* Expandable form area */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
          {children}
        </div>
      )}
    </div>
  )
}
