# Bailey Agents — Full Project Context

> **READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE.**
> This document exists so you make zero wrong assumptions about this project.
> Do not invent files. Do not guess at folder names. Do not create things that already exist.

---

## What This Project Is

**BaileyAgents.com** is a SaaS platform that uses AI to build professional websites for local businesses in under 60 seconds. It is a Next.js monorepo — the marketing site, the product dashboard, the website editor, and the customer-facing generated sites all live inside the **same codebase** at the same domain.

- The **marketing site** lives at `/` — sells the product to new visitors
- The **dashboard** lives at `/dashboard` — logged-in users manage their AI-generated sites and run AI agents
- The **site editor** lives at `/sites/[siteId]?edit=true` — where users edit their generated websites
- The **generated websites** are also served from `/sites/[siteId]` — customers' live business sites
- The **workflow builder** lives at `/dashboard/workflows` — visual drag-and-drop automation builder

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js `latest` (currently resolves to ~16.x), App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS-in-JS inline styles (templates use inline only) |
| Database | Upstash Redis via `@upstash/redis` (`lib/kv.ts`) |
| Auth | Custom cookie-based JWT sessions (`lib/auth.ts`) + bcryptjs passwords |
| Payments | Stripe (`lib/stripe.ts`) — subscriptions, checkout, billing portal, webhooks |
| Email | Resend SDK (`lib/email.ts`) — verification, password reset, contact forms |
| AI | Anthropic `claude-sonnet-4-5` via API (site generation, Ask Bailey, all agents) |
| Workflow Canvas | `@xyflow/react` v12 (React Flow) — visual node-based workflow builder |
| Animations | GSAP 3.14.2 (hero reveals, stat counters), custom `ScrollAnimator.tsx` (IntersectionObserver) |
| 3D/Visual | `@splinetool/react-spline`, `@react-three/fiber` (installed, used on marketing pages) |
| Deployment | Vercel Pro |
| Domain | baileyagents.com |

---

## Absolute Rules — Never Break These

1. **NEVER touch `middleware.ts`** — handles auth routing and subdomain logic. Breaking it locks everyone out.
2. **NEVER touch Stripe logic** (`lib/stripe.ts`, `app/api/stripe/`) unless explicitly asked.
3. **NEVER create a file that already exists.** Check the file tree below first.
4. **NEVER use `&&` to chain commands in PowerShell.** Use `;` instead.
5. **Always add `"use client"` to any file that uses React hooks** (`useState`, `useEffect`, `useRef`, etc.).
6. **0 TypeScript errors always.** Run `npx tsc --noEmit` to check before declaring done.
7. **Do NOT commit `.env.local`** — it contains secrets. Never suggest committing it.
8. **Emails send from `"Bailey Agents <noreply@baileyagents.com>"`** — do not change this.
9. **NEVER touch `app/layout.tsx` hide logic** without preserving BOTH `isCustomerSite` (`/sites/*`) AND `isWorkflowEditor` (`/dashboard/workflows/*`) checks.

---

## Complete File & Folder Map

```
bailey-systems-ai/
├── app/                          ← Next.js App Router pages and API routes
│   ├── page.tsx                  ← HOME / MARKETING page
│   ├── layout.tsx                ← Root layout — server component. Uses NavWrapper + FooterWrapper (client components) for nav visibility. Has Facebook domain verification meta tag. x-pathname header drives server-side hideNav for SSR; client-side usePathname() in wrappers handles client navigation.
│   ├── globals.css               ← Global CSS + Tailwind
│   │
│   ├── about/page.tsx
│   ├── agents/page.tsx
│   ├── ai-agents/page.tsx
│   ├── pricing/page.tsx
│   ├── consulting/page.tsx
│   ├── contacts/page.tsx
│   ├── reviews/page.tsx
│   ├── videos/page.tsx
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── verify-email/page.tsx
│   ├── privacy/page.tsx          ← Privacy policy — includes Facebook Data section with links to /dashboard/connections and /data-deletion
│   ├── data-deletion/page.tsx    ← Facebook data deletion instructions page — contact: lilianajs27@gmail.com, 24hr processing
│   │
│   ├── dashboard/
│   │   ├── page.tsx              ← Dashboard home — admin bypass prevents redirect to /pricing. Uses effectivePlan='pro' for admin display.
│   │   ├── layout.tsx            ← Dashboard layout wrapper
│   │   ├── billing/page.tsx
│   │   ├── agents/page.tsx
│   │   ├── copywriter/page.tsx
│   │   ├── email/page.tsx
│   │   ├── facebook/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── roast/page.tsx
│   │   ├── sales/page.tsx
│   │   ├── support/page.tsx
│   │   │
│   │   ├── connections/
│   │   │   ├── page.tsx          ← Connections dashboard — Facebook, Instagram, Telegram, Slack, WhatsApp, Google Sheets cards. Facebook: shows "Switch Page" + "Disconnect" when connected. Instagram: shows connect button. Reads ?connected= and ?error= URL params for flash banners.
│   │   │   └── facebook-pages/
│   │   │       └── page.tsx      ← Facebook page selector UI — 'use client'. Reads ?token= from URL, fetches pages from /api/connections/facebook/pages, shows cards, user picks one. Saves via /api/connections/facebook/select. Redirects to /dashboard/connections?connected=facebook on success.
│   │   │
│   │   └── workflows/
│   │       ├── page.tsx          ← Workflow list — server component. Reads workflows:{email} Redis list. Renders <WorkflowList>.
│   │       ├── new/page.tsx      ← New workflow — server component. Renders <WorkflowCanvas> with no initial data.
│   │       └── [id]/page.tsx     ← Existing workflow editor — server component. Loads workflow:{id} from Redis. Renders <WorkflowCanvas>.
│   │
│   ├── sites/[siteId]/
│   │   └── page.tsx              ← CRITICAL: Renders the generated website. If isOwner && editMode → SiteEditor. Otherwise → TemplateRenderer for live site.
│   │
│   └── api/
│       ├── user/route.ts
│       ├── contact/route.ts
│       ├── checkout/route.ts
│       │
│       ├── auth/
│       │   ├── logout/route.ts
│       │   ├── verify-email/route.ts
│       │   ├── forgot-password/route.ts
│       │   ├── reset-password/route.ts
│       │   ├── resend-verification/route.ts
│       │   ├── set-token/route.ts
│       │   ├── facebook/route.ts          ← GET: starts Facebook OAuth. Scopes: pages_manage_posts, pages_read_engagement, pages_show_list. Redirects to Facebook dialog. state=email.
│       │   ├── facebook/callback/route.ts ← GET: exchanges code, fetches pages. 1 page → saves directly to facebook:{email}. Multiple pages → stores in fb-pages-pending:{token} Redis (5-min TTL) → redirects to /dashboard/connections/facebook-pages?token=...
│       │   ├── instagram/route.ts         ← GET: starts Instagram OAuth (same Facebook app). Scopes: instagram_basic, instagram_content_publish, pages_show_list, pages_read_engagement.
│       │   └── instagram/callback/route.ts ← GET: exchanges code, finds page with instagram_business_account, fetches IG details, saves to instagram:{email}.
│       │
│       ├── stripe/
│       │   ├── checkout/route.ts
│       │   ├── portal/route.ts
│       │   └── webhook/route.ts
│       │
│       ├── sites/
│       │   ├── generate/route.ts         ← POST: AI generates site. Admin bypass skips all limits. Calls generateSiteHTML (Claude + Grok images). Returns { siteId, url, subdomainSlug, subdomainUrl }.
│       │   └── [siteId]/
│       │       ├── route.ts
│       │       └── image/route.ts
│       │
│       ├── editor/ask-bailey/
│       │   ├── route.ts
│       │   └── apply/route.ts
│       │
│       ├── workflows/
│       │   ├── run/route.ts    ← POST: executes workflow node by node. maxDuration=60. Admin bypass skips plan checks. Handles all node types. baileyBuildSite ACTUALLY generates a real site using generateSiteHTML and saves to Redis, returns live URL.
│       │   ├── save/route.ts   ← POST: saves workflow to Redis at workflow:{id}
│       │   └── list/route.ts   ← GET: returns user's workflow list
│       │
│       ├── connections/
│       │   ├── status/route.ts                    ← GET: returns all connection statuses (telegram, slack, whatsapp, facebook, instagram, google)
│       │   ├── facebook/pages/route.ts            ← GET ?token=: reads fb-pages-pending:{token}, returns page list (NO access tokens exposed to client)
│       │   ├── facebook/select/route.ts           ← POST { token, pageId }: saves selected page to facebook:{email}, deletes pending token
│       │   ├── facebook/disconnect/route.ts       ← DELETE: removes facebook:{email} from Redis
│       │   ├── telegram/verify/route.ts           ← POST { code }: looks up telegram-verify:{code} → saves chatId to telegram-chatid:{email}
│       │   ├── slack/save/route.ts                ← POST: saves Slack webhook URL to slack-webhook:{email}
│       │   └── whatsapp/save/route.ts             ← POST: saves WhatsApp config to whatsapp-config:{email}
│       │
│       ├── telegram/
│       │   └── webhook/route.ts  ← POST: receives Telegram updates from @BaileyOS_Bot. Generates 6-digit code, stores telegram-verify:{code} → chatId in Redis (5-min TTL), replies to user with code via Telegram Bot API. Registered webhook URL: https://baileyagents.com/api/telegram/webhook
│       │
│       ├── facebook/
│       │   ├── data-deletion/route.ts  ← POST: parses Facebook signed_request (HMAC-SHA256 verified), returns { url, confirmation_code } for Meta App Review compliance. GET: info message.
│       │   ├── status/route.ts         ← GET: returns { pageName, pageId } for connected Facebook page
│       │   └── post/route.ts           ← POST: posts to Facebook page via Graph API
│       │
│       ├── agents/refine/route.ts
│       ├── copywriter/generate/route.ts
│       ├── email/generate/route.ts
│       ├── leads/generate/route.ts
│       ├── roast/route.ts
│       ├── sales/generate/route.ts
│       ├── support/generate/route.ts
│       ├── content/generate/route.ts
│       ├── bailey-chat/route.ts
│       ├── bailey-image/route.ts
│       ├── chat/route.ts
│       ├── usage/route.ts
│       │
│       └── admin/
│           ├── delete-user/route.ts
│           ├── backfill-slugs/route.ts
│           ├── reset-customer/route.ts
│           └── sync-subscription/route.ts
│
├── components/
│   │
│   ├── site/
│   │   ├── SiteEditor.tsx
│   │   ├── TemplateRenderer.tsx
│   │   ├── ScrollAnimator.tsx
│   │   ├── HeroReveal.tsx
│   │   ├── StatCounter.tsx
│   │   ├── ContactFormBlock.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── SiteShareBar.tsx
│   │   ├── LayoutRenderer.tsx
│   │   └── templates/
│   │       ├── darkpremium/index.tsx
│   │       ├── neobrutalism/index.tsx
│   │       ├── minimal/index.tsx
│   │       ├── magazine/index.tsx
│   │       └── classic/index.tsx
│   │
│   ├── workflow/                          ← ALL workflow components live here
│   │   ├── WorkflowCanvas.tsx            ← CRITICAL: Main React Flow canvas. 'use client'. Top bar with workflow name + Run button always rendered (NOT conditional). nodeTypes registered here. Outside ReactFlow component.
│   │   ├── NodeSidebar.tsx               ← Left sidebar — draggable node categories: Triggers, AI Nodes, Actions, Logic
│   │   ├── WorkflowCard.tsx              ← Exports WorkflowList component used on the list page
│   │   ├── ExecutionLog.tsx              ← Shows live execution log output when workflow runs
│   │   └── nodes/
│   │       ├── ManualNode.tsx            ← Trigger: manual run. Outputs: trigger
│   │       ├── ScheduleNode.tsx          ← Trigger: cron schedule. Outputs: trigger
│   │       ├── WebhookNode.tsx           ← Trigger: incoming webhook. Outputs: trigger
│   │       ├── BaileyWriteNode.tsx       ← AI: generates text via Claude Haiku. Outputs: aiText
│   │       ├── BaileyFindLeadsNode.tsx   ← AI: generates leads JSON via Claude. Outputs: leads
│   │       ├── BaileyBuildSiteNode.tsx   ← AI: fields are businessName, industry, tone. Outputs: siteUrl (REAL live URL — actually generates site via Claude + Grok)
│   │       ├── SendEmailNode.tsx         ← Action: send email via Resend. Auto-chains aiText if body empty.
│   │       ├── FacebookPostNode.tsx      ← Action: post to Facebook page. Reads facebook:{email} from Redis. Auto-chains aiText.
│   │       ├── InstagramPostNode.tsx     ← Action: post to Instagram Business Account (color #E1306C). Reads instagram:{email}. Requires imageUrl field. Auto-chains aiText for caption.
│   │       ├── SlackNode.tsx             ← Action: send Slack message. Reads slack-webhook:{email}. Auto-chains aiText.
│   │       ├── TelegramNode.tsx          ← Action: send Telegram message. Reads telegram-chatid:{email}. Auto-chains aiText. Use {{siteUrl}} in message field to send site URL.
│   │       ├── WhatsAppNode.tsx          ← Action: send WhatsApp (Twilio or Meta). Auto-chains aiText.
│   │       ├── GoogleSheetsNode.tsx      ← Action: placeholder (OAuth not configured yet)
│   │       ├── IfConditionNode.tsx       ← Logic: conditional branching
│   │       └── DelayNode.tsx             ← Logic: wait X seconds/minutes (max 10s in practice)
│   │
│   ├── editor/AskBailey.tsx
│   ├── agents/RefineChat.tsx
│   │
│   ├── NavWrapper.tsx      ← 'use client'. Uses usePathname() to hide Navbar on /sites/* and /dashboard/workflows/* during client-side navigation. Fixes Run button visibility bug.
│   ├── FooterWrapper.tsx   ← 'use client'. Same pattern for Footer + BaileyChat together.
│   │
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── HeroInput.tsx
│   ├── AgentCards.tsx
│   ├── BaileyChat.tsx
│   ├── PricingCard.tsx
│   ├── BentoGrid.tsx
│   ├── BentoServices.tsx
│   ├── SiteCard.tsx
│   ├── ContentMachine.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── LogoutButton.tsx
│   ├── GoogleMap.tsx
│   ├── FallingText.tsx
│   ├── FloatingVideoChat.tsx
│   ├── ReviewCard.jsx
│   ├── ServiceCard.jsx
│   ├── VideoCard.tsx
│   ├── ChatBubble.tsx
│   ├── ChatWindow.tsx
│   ├── LeadsAgent.tsx
│   ├── ProfessionalServices.tsx
│   ├── CleanTeam.tsx
│   ├── CharacterSelectTeam.tsx
│   ├── HackerToggle.tsx
│   └── KonamiCode.tsx
│
├── lib/
│   ├── kv.ts                     ← CRITICAL: All Redis/KV operations. Types: SiteRecord, UserRecord, SubscriptionRecord, FacebookPageRecord, InstagramAccountRecord. Functions: getSite, saveSite, deleteSite, getUserSites, saveFacebookPage, getFacebookPage, saveInstagramAccount, getInstagramAccount, getUserPlan, getSubscriptionByEmail, getUser, saveUser.
│   ├── auth.ts                   ← JWT session management. getSession(req) for API routes. getSessionFromCookies() for server components. AUTH_SECRET env var (not JWT_SECRET).
│   ├── generate-site-html.ts     ← CRITICAL: generateSiteHTML() — calls Claude + Grok to produce full HTML site. Used by /api/sites/generate AND by baileyBuildSite workflow node.
│   ├── stripe.ts
│   ├── email.ts
│   ├── site-theme.ts
│   ├── openai.ts                 ← Anthropic client (named openai.ts for legacy reasons)
│   ├── ratelimit.ts
│   ├── stripe-links.ts
│   └── usage.ts
│
├── utils/
│   ├── constants.ts
│   └── validations.ts
│
├── styles/animations.css
├── public/
│   ├── avatar.mp4
│   ├── tem6.webp
│   └── templates/README.md
│
├── middleware.ts     ← ⚠️ DO NOT TOUCH
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Key Dependencies (from package.json)

```json
"next": "latest",
"react": "^19.2.3",
"react-dom": "^19.2.3",
"@anthropic-ai/sdk": "...",
"@upstash/redis": "...",
"@xyflow/react": "^12.x",
"stripe": "latest",
"resend": "...",
"bcryptjs": "...",
"jose": "...",
"gsap": "^3.14.2",
"@vercel/blob": "...",
"@splinetool/react-spline": "...",
"@react-three/fiber": "...",
"@react-three/drei": "..."
```

**framer-motion is NOT installed.** Do not suggest it.

---

## Authentication System

- **Cookie:** `auth-token` (HTTP-only, secure)
- **Session format (JWT payload):** `{ email: string, name: string }`
- **Auth secret env var:** `AUTH_SECRET` (NOT `JWT_SECRET`)
- **Signup/Login:** `POST /api/user`
- **Session reading (API routes):** `getSession(req)` from `lib/auth.ts` — reads from NextRequest cookies
- **Session reading (server components/pages):** `getSessionFromCookies()` from `lib/auth.ts` — reads from next/headers
- **Email verification:** Token stored in Redis `verify:{token}` → email, with expiry
- **Password reset:** Token stored in Redis `reset:{token}` → email

---

## Stripe / Subscriptions

- **Plans:** `starter` ($29/mo), `growth` ($79/mo), `pro` ($149/mo)
- **Subscription record in Redis:** key = `sub:{email}` (NOT `subscription:{email}`), type = `SubscriptionRecord { status, plan, customerId, subscriptionId }`
- **Plan gating:** `getUserPlan(email)` returns `null` for `past_due` or `canceled`
- **Webhook:** `/api/stripe/webhook/route.ts` — `force-dynamic` + `nodejs` runtime

---

## Redis Data Structure (Upstash KV)

| Key pattern | Value type | Purpose |
|---|---|---|
| `site:{siteId}` | `SiteRecord` JSON | A generated website |
| `html:{siteId}` | string | Full generated HTML (stored separately to avoid 1MB limit) |
| `slug:{subdomainSlug}` | siteId string | Reverse lookup for subdomain routing |
| `user:{email}` | `UserRecord` JSON | User account |
| `sub:{email}` | `SubscriptionRecord` JSON | Stripe subscription (note: `sub:` not `subscription:`) |
| `verify:{token}` | email string | Email verification token |
| `reset:{token}` | email string | Password reset token |
| `facebook:{email}` | `FacebookPageRecord` JSON | Connected Facebook page — `{ pageId, pageName, pageAccessToken, connectedAt }` |
| `instagram:{email}` | `InstagramAccountRecord` JSON | Connected Instagram account — `{ accountId, accountName, username, pageAccessToken, pageId, connectedAt }` |
| `fb-pages-pending:{token}` | `{ email, pages[] }` JSON | Temp storage for Facebook page selection (5-min TTL) |
| `telegram-chatid:{email}` | string | User's Telegram chat ID |
| `telegram-verify:{code}` | chatId string | 6-digit code → chatId mapping (5-min TTL) |
| `slack-webhook:{email}` | string | Slack webhook URL |
| `whatsapp-config:{email}` | `{ provider }` JSON | WhatsApp provider config |
| `workflows:{email}` | Redis list of IDs | User's workflow IDs |
| `workflow:{id}` | `WorkflowRecord` JSON | Full workflow — nodes, edges, name, userId, createdAt, lastRun |
| `workflow-runs:{email}` | number | Trial run counter (max 3 for trialing users) |
| `rl:{key}` | counter | Rate limiting |

---

## Workflow System

### How Workflows Execute (`app/api/workflows/run/route.ts`)

- `maxDuration = 60` seconds
- Admin bypass: `lilianajs27@gmail.com` skips all plan checks
- Non-admin: requires Pro plan OR trialing (max 3 trial runs)
- Execution order: topological sort from edges, falls back to `TYPE_PRIORITY` (Triggers=0, AI=1, Actions=2, Logic=3)
- Each node stores output under a predictable context variable name

### Context Variable Names (auto-chaining)

| Node type | Output stored as |
|---|---|
| `manual` / `schedule` / `webhook` | `trigger` |
| `baileyWrite` | `aiText` |
| `baileyFindLeads` | `leads` |
| `baileyBuildSite` | `siteUrl` (real live URL like `https://baileyagents.com/sites/abc123`) |
| `sendEmail` | `emailResult` |
| `telegram` | `telegramResult` |
| `slack` | `slackResult` |
| `facebookPost` | `postResult` |
| `instagramPost` | `instagramResult` |

### Auto-chain Rules

- **Telegram, Slack, WhatsApp, Email, Facebook, Instagram** — if message/body field is empty or has no `{{...}}`, they automatically use `aiText` from context (then `leads` as fallback)
- Use `{{siteUrl}}` in the Telegram/Email message field to pass the Build Site output through
- Variables resolved via `{{variableName}}` syntax anywhere in node fields

### Typical Workflow Patterns

```
Manual → Bailey Write → Telegram        (AI writes text, sends to Telegram)
Manual → Bailey Write → Facebook Post   (AI writes post, publishes to FB page)
Manual → Build Site → Telegram          (builds real site, sends URL via Telegram — use {{siteUrl}} in message)
Schedule → Bailey Write → Send Email    (daily AI email)
```

---

## Facebook & Instagram OAuth

### Facebook Flow
1. User clicks "Connect Facebook" → hits `/api/auth/facebook` → redirects to Facebook OAuth dialog
2. Facebook redirects to `/api/auth/facebook/callback` with `code` and `state=email`
3. Callback exchanges code for token, fetches user's pages:
   - 1 page → saves directly to `facebook:{email}` in Redis
   - Multiple pages → stores in `fb-pages-pending:{token}` (5-min TTL) → redirects to `/dashboard/connections/facebook-pages?token=...`
4. Page selector UI lets user pick → POST to `/api/connections/facebook/select` → saves to `facebook:{email}`

### Instagram Flow
1. User clicks "Connect Instagram" → hits `/api/auth/instagram` → redirects to Facebook OAuth (same app)
2. Callback at `/api/auth/instagram/callback` exchanges code, fetches pages with `instagram_business_account` field
3. First page with linked Instagram Business Account gets its IG details fetched and saved to `instagram:{email}`

### Required Facebook App Permissions (already approved in Meta)
- `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`
- `instagram_basic`, `instagram_content_publish`

### Facebook App Review Compliance
- Data deletion endpoint: `POST /api/facebook/data-deletion` — parses `signed_request`, HMAC-SHA256 verified
- Data deletion instructions: `/data-deletion` page
- Privacy policy: `/privacy` page with Facebook Data section

---

## Telegram Bot Setup

- **Bot name:** `@BaileyOS_Bot`
- **Webhook URL registered:** `https://baileyagents.com/api/telegram/webhook`
- **How it works:** User messages the bot → webhook fires → generates 6-digit code → stores `telegram-verify:{code}` → chatId in Redis (5-min TTL) → bot replies with code → user enters code in dashboard → `/api/connections/telegram/verify` saves chatId to `telegram-chatid:{email}`
- **Workflow sending:** Telegram node reads `telegram-chatid:{email}` from Redis, uses `TELEGRAM_BOT_TOKEN` to call Telegram Bot API

---

## Admin Bypass

**Admin email:** `lilianajs27@gmail.com` (set via `ADMIN_EMAIL` env var)

Admin bypasses are applied in:
- `app/api/workflows/run/route.ts` — skips all plan checks and trial limits
- `app/api/sites/generate/route.ts` — skips subscription check, rate limit, site limit, monthly usage limit, regen limit
- `app/dashboard/page.tsx` — never redirected to `/pricing`. Uses `effectivePlan = 'pro'` if actual plan is null/undefined.

---

## Layout — NavWrapper / FooterWrapper

`app/layout.tsx` uses `NavWrapper` and `FooterWrapper` (both `'use client'`) instead of server-side conditionals. This fixes a bug where the Navbar covered the workflow canvas Run button on client-side navigation.

- Server-side `x-pathname` check (`hideNav`) still computed in layout — used as `initialHideNav` prop for correct SSR
- Client-side `usePathname()` in NavWrapper/FooterWrapper handles all subsequent navigations
- Both hide on: `/sites/*` (customer sites) and `/dashboard/workflows/*` (workflow editor)
- `app/layout.tsx` also has Facebook domain verification meta tag in `<head>`

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis token |
| `ANTHROPIC_API_KEY` | Claude AI API key |
| `GROK_API_KEY` | xAI Grok API key (image generation in site builder) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `RESEND_API_KEY` | Resend email API key |
| `AUTH_SECRET` | Secret for signing session JWTs (NOT JWT_SECRET) |
| `NEXT_PUBLIC_BASE_URL` | `https://baileyagents.com` (no trailing slash) |
| `GOOGLE_PLACES_API_KEY` | Google Places API |
| `FACEBOOK_APP_ID` | Facebook/Meta app ID (also used for Instagram OAuth) |
| `FACEBOOK_APP_SECRET` | Facebook/Meta app secret |
| `TELEGRAM_BOT_TOKEN` | @BaileyOS_Bot token from BotFather |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | `BaileyOS_Bot` |
| `ADMIN_EMAIL` | `lilianajs27@gmail.com` — bypasses all plan limits |
| `TWILIO_ACCOUNT_SID` | Twilio for WhatsApp |
| `TWILIO_AUTH_TOKEN` | Twilio auth |
| `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+14155238886` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob CDN token |

---

## Plan → Feature Access

| Feature | Starter ($29) | Growth ($79) | Pro ($149) |
|---|---|---|---|
| AI Websites | 1 | 3 | 25 |
| Website Roast Agent | ✓ | ✓ | ✓ |
| Email Marketer Agent | — | ✓ | ✓ |
| Customer Support Agent | — | ✓ | ✓ |
| Lead Hunter Agent | — | — | ✓ |
| AI Copywriter | — | — | ✓ |
| Sales Manager | — | — | ✓ |
| Workflows | — | — | ✓ (Pro only, 3 free trial runs) |
| Ask Bailey edits | 3/mo | 15/mo | Unlimited |

---

## The 5 Website Templates

All in `components/site/templates/[name]/index.tsx`. Server components. All inline CSS (NO Tailwind inside templates). All use `overflowX: "clip"` (NOT hidden).

| Template | Aesthetic | Key colors |
|---|---|---|
| `darkpremium` | Tesla/Stripe, cinematic dark | `#080808` bg, primary color glow |
| `neobrutalism` | Bold poster | Cream `#fffef7`, black, yellow `#FFE500` |
| `minimal` | Apple/Linear | White bg, thin fonts |
| `magazine` | Vogue/Wired editorial | `#fafaf8` bg, dark hero |
| `classic` | Trustworthy navy/gold | Navy `#1a2744`, gold `#c9a84c` |

---

## Site Editor Architecture

```
Fixed outer shell (position: fixed, full viewport, flex-column, zIndex: 200)
├── Toolbar (52px) — Left: panel toggles | Center: template name | Right: View Live
└── Main area (flex-row)
    ├── Left sidebar (320px) — ThemesPanel + ContentPanel (7 tabs)
    ├── Preview canvas — <TemplateRenderer isEditing={true} />
    └── Right panel (320px) — <AskBailey />
```

**Autosave:** 800ms debounce. **View Live:** saves first, waits 1500ms, opens live URL.

---

## Marketing Color Scheme

- Background: `#08090a`
- Brand accent: `#00e5a0` (green)
- Text: `#f0f0f0`
- Muted: `#9ca3af`
- Cards: `#111214` or `#0d0e10`
- Borders: `rgba(255,255,255,0.08)`

---

## What Has Already Been Built (Do Not Rebuild)

- ✅ Complete auth system (signup, login, email verification, password reset)
- ✅ Stripe subscriptions (checkout, webhooks, portal, plan gating)
- ✅ 5 website templates + GSAP animations
- ✅ Wix-style site editor (7-tab sidebar, autosave, Ask Bailey)
- ✅ Hero + about image upload (base64, Redis)
- ✅ Facebook OAuth + page selector UI
- ✅ Instagram OAuth
- ✅ Facebook disconnect button
- ✅ Facebook data deletion endpoint (Meta App Review compliant)
- ✅ Telegram bot webhook + dashboard connect flow (@BaileyOS_Bot)
- ✅ Slack + WhatsApp connections
- ✅ Full workflow builder (React Flow canvas, 14 node types)
- ✅ Workflow execution engine (topological sort, context chaining, auto-var names)
- ✅ baileyBuildSite node generates REAL sites (Claude + Grok, saves to Redis, returns live URL)
- ✅ Admin bypass for lilianajs27@gmail.com (unlimited runs, sites, no pricing redirect)
- ✅ NavWrapper + FooterWrapper (fixes Run button visibility on client navigation)
- ✅ Facebook domain verification meta tag in layout

---

## Git Info

- **Repo:** `https://github.com/chubby815/bailey-systems-site.git`
- **Branch:** `main`
- **Latest commit:** `0d724a8` — baileyBuildSite generates real sites
- **Shell:** PowerShell — use `;` not `&&` to chain commands

---

*Last updated: March 2026.*
