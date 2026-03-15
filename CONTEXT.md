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

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js `latest` (currently resolves to ~16.x), App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS-in-JS inline styles (templates use inline only) |
| Database | Upstash Redis via `@vercel/kv` (`lib/kv.ts`) |
| Auth | Custom cookie-based JWT sessions (`lib/auth.ts`) + bcryptjs passwords |
| Payments | Stripe (`lib/stripe.ts`) — subscriptions, checkout, billing portal, webhooks |
| Email | Resend SDK (`lib/email.ts`) — verification, password reset, contact forms |
| AI | Anthropic `claude-sonnet-4-5` via API (site generation, Ask Bailey, all agents) |
| Animations | GSAP 3.14.2 (hero reveals, stat counters), custom `ScrollAnimator.tsx` (IntersectionObserver) |
| 3D/Visual | `@splinetool/react-spline`, `@react-three/fiber` (installed, used on marketing pages) |
| Deployment | Vercel |
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

---

## Complete File & Folder Map

```
bailey-systems-ai/
├── app/                          ← Next.js App Router pages and API routes
│   ├── page.tsx                  ← HOME / MARKETING page (baileyagents.com landing page)
│   ├── layout.tsx                ← Root layout — server component, reads auth cookie, passes isLoggedIn to Navbar
│   ├── globals.css               ← Global CSS + Tailwind + scroll-behavior + fade-in animation classes
│   │
│   ├── about/page.tsx            ← Marketing: About page
│   ├── agents/page.tsx           ← Marketing: AI Agents showcase page
│   ├── ai-agents/page.tsx        ← Marketing: Another AI agents page
│   ├── pricing/page.tsx          ← Marketing: Pricing/plans page (uses PRICING_PLANS from utils/constants.ts)
│   ├── consulting/page.tsx       ← Marketing: Consulting services page
│   ├── contacts/page.tsx         ← Marketing: Contact page
│   ├── reviews/page.tsx          ← Marketing: Customer reviews page
│   ├── videos/page.tsx           ← Marketing: Video library page
│   ├── login/page.tsx            ← Auth: Login / Sign up page (both on one page)
│   ├── forgot-password/page.tsx  ← Auth: Forgot password page
│   ├── reset-password/page.tsx   ← Auth: Reset password page (uses token from URL)
│   ├── verify-email/page.tsx     ← Auth: Email verification landing page
│   │
│   ├── dashboard/                ← PRODUCT: All dashboard pages (requires auth)
│   │   ├── page.tsx              ← Dashboard home — shows user's sites, plan status, past_due redirect
│   │   ├── layout.tsx            ← Dashboard layout wrapper
│   │   ├── billing/page.tsx      ← Billing portal page — shows plan, Stripe portal button, past_due banner
│   │   ├── agents/page.tsx       ← Agents dashboard — list of available AI agents with plan gating
│   │   ├── copywriter/page.tsx   ← AI Copywriter agent UI
│   │   ├── email/page.tsx        ← Email Marketer agent UI
│   │   ├── facebook/page.tsx     ← Facebook post generator UI
│   │   ├── leads/page.tsx        ← Lead Hunter agent UI (Pro only)
│   │   ├── roast/page.tsx        ← Website Roast agent UI
│   │   ├── sales/page.tsx        ← Sales Manager agent UI
│   │   └── support/page.tsx      ← Customer Support agent UI
│   │
│   ├── sites/[siteId]/
│   │   └── page.tsx              ← CRITICAL: Renders the generated website. If isOwner && editMode → shows SiteEditor. Otherwise → shows TemplateRenderer for live site. Does NOT render SiteShareBar in edit mode.
│   │
│   └── api/                      ← All API route handlers
│       ├── user/route.ts         ← POST: login/signup with bcrypt. GET: returns current user session.
│       ├── contact/route.ts      ← POST: sends contact form emails via Resend
│       ├── checkout/route.ts     ← Legacy checkout redirect (see also api/stripe/checkout)
│       │
│       ├── auth/
│       │   ├── logout/route.ts           ← Clears auth-token cookie
│       │   ├── verify-email/route.ts     ← Validates email verification token from Redis
│       │   ├── forgot-password/route.ts  ← Sends password reset email via Resend
│       │   ├── reset-password/route.ts   ← Validates reset token, updates hashed password
│       │   ├── resend-verification/route.ts ← Rate-limited resend of verification email
│       │   └── set-token/route.ts        ← Sets auth-token cookie (used after OAuth flows)
│       │
│       ├── stripe/
│       │   ├── checkout/route.ts ← Creates Stripe checkout session for plan upgrade
│       │   ├── portal/route.ts   ← Opens Stripe billing portal; recovers missing customerId from Stripe if needed
│       │   └── webhook/route.ts  ← Handles Stripe events (subscription created/updated/deleted/past_due). Has STRIPE_WEBHOOK_SECRET guard. force-dynamic + nodejs runtime.
│       │
│       ├── sites/
│       │   ├── generate/route.ts         ← POST: AI generates a new site from business info using Claude
│       │   └── [siteId]/
│       │       ├── route.ts              ← GET: fetch site. PATCH: save site edits. DELETE: delete site. Has ownership check (case-insensitive email comparison).
│       │       └── image/route.ts        ← POST: upload hero/about image as base64. DELETE: remove image.
│       │
│       ├── editor/
│       │   └── ask-bailey/
│       │       ├── route.ts              ← POST: Ask Bailey chat — returns suggested content/theme changes
│       │       └── apply/route.ts        ← POST: Apply Ask Bailey suggestions to site
│       │
│       ├── agents/ (AI agent API routes)
│       │   └── refine/route.ts           ← POST: refines agent output
│       ├── copywriter/generate/route.ts  ← POST: AI copywriter
│       ├── email/generate/route.ts       ← POST: Email marketer
│       ├── facebook/                     ← Facebook post generator + OAuth connect
│       ├── leads/generate/route.ts       ← POST: Lead Hunter (Pro only)
│       ├── roast/route.ts                ← POST: Website Roast agent
│       ├── sales/generate/route.ts       ← POST: Sales Manager
│       ├── support/generate/route.ts     ← POST: Customer Support agent
│       ├── content/generate/route.ts     ← POST: General content generation
│       ├── bailey-chat/route.ts          ← POST: Bailey chat assistant
│       ├── bailey-image/route.ts         ← POST: Image generation
│       ├── chat/route.ts                 ← POST: General chat
│       ├── usage/route.ts                ← GET/POST: AI usage tracking
│       │
│       └── admin/ (internal admin endpoints — no UI, called directly)
│           ├── delete-user/route.ts      ← GET ?email=x — deletes user from Redis (admin only)
│           ├── backfill-slugs/route.ts   ← Admin: backfills subdomain slugs
│           ├── reset-customer/route.ts   ← Admin: resets Stripe customer data
│           └── sync-subscription/route.ts ← Admin: syncs subscription from Stripe
│
├── components/                   ← All React components
│   │
│   ├── site/                     ← Components ONLY used for generated customer websites
│   │   ├── SiteEditor.tsx        ← CRITICAL: Full website editor. Fixed position shell, flex-column layout (toolbar top, main area flex-row). Sidebar pushes preview. No position:fixed for panels.
│   │   ├── TemplateRenderer.tsx  ← Picks which template to render based on site.template. Injects theme CSS variables. Passes isEditing prop.
│   │   ├── ScrollAnimator.tsx    ← Client component: IntersectionObserver fade-in. Adds 'visible' class when in viewport. Respects prefers-reduced-motion.
│   │   ├── HeroReveal.tsx        ← Client component: GSAP word-by-word hero headline reveal. Dynamic import of gsap. gsap.context() cleanup.
│   │   ├── StatCounter.tsx       ← Client component: GSAP ScrollTrigger count-up animation for stats. Dynamic import of gsap + ScrollTrigger.
│   │   ├── ContactFormBlock.tsx  ← Contact form that POSTs to /api/contact. Used in all 5 templates.
│   │   ├── TrustBadges.tsx       ← Trust badge pills and rating badge. Used in templates.
│   │   ├── SiteShareBar.tsx      ← "Your site is live" banner. ONLY shown in view mode — NOT shown in edit mode.
│   │   ├── LayoutRenderer.tsx    ← Legacy layout renderer (older system)
│   │   └── templates/            ← The 5 website templates
│   │       ├── darkpremium/index.tsx   ← Dark Premium: Tesla/Stripe aesthetic. Animated gradient, 12 floating particles, GSAP word reveal, glassmorphism cards, shine sweep on testimonials.
│   │       ├── neobrutalism/index.tsx  ← Neo Brutalism: Bold poster aesthetic. Animated diagonal grain, 3D press cards, image zoom on work cards.
│   │       ├── minimal/index.tsx       ← Modern Minimal: Apple/Linear aesthetic. GSAP word reveal, underline draw animation, subtle lift cards.
│   │       ├── magazine/index.tsx      ← Bold Magazine: Editorial/Vogue aesthetic. Ken Burns on hero image, text slide-in from left.
│   │       └── classic/index.tsx       ← Classic Business: Navy/gold trustworthy. Animated gradient, gold underline draw, GSAP stat counters.
│   │
│   ├── editor/
│   │   └── AskBailey.tsx         ← Ask Bailey chat panel inside SiteEditor. Connects to /api/editor/ask-bailey.
│   │
│   ├── agents/
│   │   └── RefineChat.tsx        ← Refine chat component for agent outputs
│   │
│   │ ← MARKETING/UI components (used on baileyagents.com pages):
│   ├── Navbar.tsx                ← Site navbar. Client component. Reads initialLoggedIn prop from layout.tsx. Shows/hides Log In button based on auth state.
│   ├── Footer.tsx                ← Site footer
│   ├── Hero.tsx                  ← Legacy hero component (some pages still use this)
│   ├── HeroInput.tsx             ← Homepage hero input — "Enter your business name" generates site
│   ├── AgentCards.tsx            ← Cards showing the AI agents on the homepage
│   ├── BaileyChat.tsx            ← Floating AI chat widget on marketing pages
│   ├── PricingCard.tsx           ← Pricing plan card component
│   ├── BentoGrid.tsx             ← Bento grid layout for features/agents
│   ├── BentoServices.tsx         ← Services bento grid
│   ├── SiteCard.tsx              ← Card showing a generated site in dashboard
│   ├── ContentMachine.tsx        ← Content machine marketing section
│   ├── Button.tsx                ← Reusable button component
│   ├── Input.tsx                 ← Reusable input component
│   ├── LogoutButton.tsx          ← Logout button (client component, calls /api/auth/logout)
│   ├── GoogleMap.tsx             ← Google Maps embed component
│   ├── FallingText.tsx           ← Animated falling text effect (marketing)
│   ├── FloatingVideoChat.tsx     ← Floating video chat component
│   ├── ReviewCard.jsx            ← Customer review card
│   ├── ServiceCard.jsx           ← Service card
│   ├── VideoCard.tsx             ← Video card for video library
│   ├── ChatBubble.tsx            ← Chat bubble UI
│   ├── ChatWindow.tsx            ← Chat window UI
│   ├── LeadsAgent.tsx            ← Lead Hunter agent UI component
│   ├── ProfessionalServices.tsx  ← Professional services section
│   ├── CleanTeam.tsx             ← Team section
│   ├── CharacterSelectTeam.tsx   ← Team member character cards
│   ├── HackerToggle.tsx          ← Hacker mode easter egg toggle
│   └── KonamiCode.tsx            ← Konami code easter egg
│
├── lib/                          ← Core server-side utilities
│   ├── kv.ts                     ← CRITICAL: All Redis/KV operations. Defines SiteRecord, UserRecord, SubscriptionRecord types. Functions: getSite, saveSite, deleteSite, getUserSites (batched, strips base64 images), getUserPlan (returns null for past_due), getSubscriptionByEmail, getUser, saveUser. Keys: site:{siteId}, user:{email}, subscription:{email}.
│   ├── auth.ts                   ← JWT session management. Functions: createSessionToken, getSession, requireAuth, clearSessionCookie, verifySession. Cookie name: auth-token. Session payload: { email, name }.
│   ├── stripe.ts                 ← Stripe client init. API version: "2026-02-25.clover".
│   ├── email.ts                  ← Resend email functions. Lazy-initialized (Resend client created inside each function, NOT at module level — required to fix Vercel build failures). From: "Bailey Agents <noreply@baileyagents.com>".
│   ├── site-theme.ts             ← ThemeConfig type, StructuredSiteContent type, FONT_SIZE_MULTIPLIERS, theme presets per template, default content generator.
│   ├── openai.ts                 ← Anthropic client setup (named openai.ts for legacy reasons — actually uses Anthropic SDK)
│   ├── ratelimit.ts              ← Rate limiting utility
│   ├── stripe-links.ts           ← Stripe payment link URLs
│   └── usage.ts                  ← AI usage tracking helpers
│
├── utils/
│   ├── constants.ts              ← NAV_LINKS, PRICING_PLANS (SaaSPricingPlan type, 3 tiers: starter $29, growth $79, pro $149), LEGACY_PRICING_PLANS, STATS, REVIEWS, VIDEO_LIBRARY, TRUST_ITEMS, DEFAULT_CHAT_MESSAGES
│   └── validations.ts            ← Form validation helpers
│
├── styles/
│   └── animations.css            ← Additional CSS animations (imported globally)
│
├── public/
│   ├── avatar.mp4                ← Video asset for marketing
│   ├── tem6.webp                 ← Template preview image
│   └── templates/README.md       ← Notes about template assets
│
├── middleware.ts                 ← ⚠️ DO NOT TOUCH. Handles auth redirects and subdomain routing.
├── next.config.js                ← Next.js config
├── tailwind.config.js            ← Tailwind config
├── tsconfig.json                 ← TypeScript config
└── package.json                  ← Dependencies (see key deps below)
```

---

## Key Dependencies (from package.json)

```json
"next": "latest",
"react": "^19.2.3",
"react-dom": "^19.2.3",
"@anthropic-ai/sdk": "...",
"@vercel/kv": "...",
"stripe": "latest",
"resend": "...",
"bcryptjs": "...",
"jose": "...",
"gsap": "^3.14.2",
"@splinetool/react-spline": "...",
"@react-three/fiber": "...",
"@react-three/drei": "..."
```

**framer-motion is NOT installed.** Do not suggest it.

---

## Authentication System

- **Cookie:** `auth-token` (HTTP-only, secure)
- **Session format (JWT payload):** `{ email: string, name: string }`
- **Signup/Login:** `POST /api/user` — handles both. Checks if user exists: if yes → login (bcrypt compare). If no → signup (bcrypt hash, save UserRecord, send verification email via Resend).
- **Session reading (server):** `lib/auth.ts` → `getSession()` or `requireAuth()` — reads cookie from `next/headers`
- **Session reading (client):** `GET /api/user` — returns `{ email, name }` or 401
- **Email verification:** Required before full access. Token stored in Redis with expiry.
- **Password reset:** Token-based flow. Token in Redis, link sent via Resend.
- **Navbar auth:** `app/layout.tsx` (server component) reads cookie and passes `isLoggedIn` prop to `<Navbar />`. Navbar uses this as `initialLoggedIn` state, then verifies via `GET /api/user` on mount. This prevents flash of wrong state.

---

## Stripe / Subscriptions

- **Plans:** `starter` ($29/mo), `growth` ($79/mo), `pro` ($149/mo)
- **Subscription record in Redis:** key = `subscription:{email}`, type = `SubscriptionRecord { status, plan, customerId, subscriptionId, priceId, currentPeriodEnd }`
- **Plan gating:** `getUserPlan(email)` in `lib/kv.ts` — returns `null` for `past_due` status (locks access)
- **Past due:** Dashboard redirects to `/dashboard/billing?reason=past_due`. Billing page shows a payment required banner.
- **Webhook:** `/api/stripe/webhook/route.ts` — `export const dynamic = "force-dynamic"`, `export const runtime = "nodejs"`. Has guard for missing `STRIPE_WEBHOOK_SECRET`.
- **Portal:** `/api/stripe/portal` — recovers missing `customerId` by searching Stripe by email if needed.

---

## Redis Data Structure (Upstash KV)

| Key pattern | Value type | Purpose |
|---|---|---|
| `site:{siteId}` | `SiteRecord` JSON | A generated website |
| `user:{email}` | `UserRecord` JSON | User account (hashed password, verified flag) |
| `subscription:{email}` | `SubscriptionRecord` JSON | Stripe subscription data |
| `verify:{token}` | email string | Email verification token |
| `reset:{token}` | email string | Password reset token |
| `rl:{key}` | counter | Rate limiting |

**Important:** `getUserSites()` fetches in batches and strips `heroImage`/`aboutImage` base64 content (replaces with `"[uploaded]"`) to avoid Upstash's 10MB payload limit.

---

## Generated Site Data Structure (SiteRecord)

```typescript
type SiteRecord = {
  siteId:         string;   // e.g. "abc123"
  userId:         string;   // owner's email (always lowercase)
  businessName:   string;
  location:       string;
  industry:       string;
  template:       string;   // "darkpremium" | "neobrutalism" | "minimal" | "magazine" | "classic"
  subdomainSlug?: string;   // e.g. "joes-plumbing"
  contactEmail?:  string;
  contactPhone?:  string;
  yearsInBusiness?: string;
  content?:       string;   // JSON string of StructuredSiteContent
  theme?:         string;   // JSON string of ThemeConfig
  heroImage?:     string;   // base64 encoded image (stripped in getUserSites)
  aboutImage?:    string;   // base64 encoded image (stripped in getUserSites)
  isPaused?:      boolean;
  createdAt?:     string;
}
```

---

## ThemeConfig Structure (lib/site-theme.ts)

```typescript
type ThemeConfig = {
  primaryColor?:  string;  // hex color
  headingColor?:  string;
  bodyColor?:     string;
  btnTextColor?:  string;
  accentColor?:   string;
  background?:    string;  // maps to --site-bg CSS variable
  surface?:       string;  // maps to --site-surface CSS variable
  fontFamily?:    string;  // "modern" | "classic" | "bold" | "minimal"
  buttonStyle?:   string;  // "rounded" | "sharp" | "pill"
  fontSize?:      string;  // "sm" | "md" | "lg" | "xl"
}
```

---

## The 5 Website Templates

All templates live in `components/site/templates/[name]/index.tsx`. They are **server components** (no hooks directly). Client-side animations are imported from separate client components (`HeroReveal`, `StatCounter`, `ScrollAnimator`).

Each template:
- Exports a named layout function (e.g. `DarkPremiumLayout`, `NeoBrutalismLayout`, etc.)
- Accepts `TemplateProps` which includes `site`, `content`, `primaryColor`, `heroImageUrl?`, `aboutImageUrl?`, `theme?`, `isEditing?`
- When `isEditing=true` is passed, navbars show a primary-color border + box-shadow so they're always visible in the editor
- All use inline CSS-in-JS styles (NO Tailwind inside templates)
- All have `overflowX: "clip"` on root div (NOT hidden — clip doesn't create a scroll container so sticky positioning works)

| Template | Aesthetic | Key colors |
|---|---|---|
| `darkpremium` | Tesla/Stripe, cinematic dark | `#080808` bg, `#0d0e10` surface, primary color glow |
| `neobrutalism` | Bold poster, raw energy | Cream `#fffef7` bg, black `#0a0a0a` surface, yellow `#FFE500` accent |
| `minimal` | Apple/Linear, clean whitespace | White bg, thin fonts, primary color accents |
| `magazine` | Vogue/Wired, full-bleed editorial | `#fafaf8` bg, dark hero, serif x sans type |
| `classic` | Trustworthy, navy/gold | Navy `#1a2744`, gold `#c9a84c`, white text |

---

## Site Editor Architecture (SiteEditor.tsx)

```
Fixed outer shell (position: fixed, full viewport, flex-column, zIndex: 200)
├── Toolbar (height: 52px, flexShrink: 0, dark bg)
│   ├── Left: panel toggle buttons (Themes, Content/Edit, Ask Bailey)
│   ├── Center: template name + saving indicator
│   └── Right: View Live ↗ button
│
└── Main area (flex: 1, display: flex, flex-row, overflow: hidden)
    ├── Left sidebar (width: 320px, flexShrink: 0) — conditionally shown
    │   ├── ThemesPanel — pick theme preset + template
    │   └── ContentPanel — 7 section tabs (Navbar, Hero, Services, About, Testimonials, CTA, Design)
    │       Each tab shows inputs for that section. Changes fire instantly in preview.
    │
    ├── Preview canvas (flex: 1, overflowY: auto, minWidth: 0)
    │   └── <TemplateRenderer isEditing={true} ... />
    │
    └── Right panel (width: 320px, flexShrink: 0) — Ask Bailey chat
        └── <AskBailey ... />
```

**Autosave:** 800ms debounce after any change. `hasChanges` ref tracks dirty state. "Saved ✓" indicator in toolbar.
**View Live:** Saves first, waits 1500ms, then opens live URL in new tab.

---

## Plan → Feature Access

| Feature | Starter ($29) | Growth ($79) | Pro ($149) |
|---|---|---|---|
| AI Websites | 1 | 3 | 25 |
| Website Roast Agent | ✓ | ✓ | ✓ |
| Email Marketer Agent | — | ✓ | ✓ |
| Customer Support Agent | — | ✓ | ✓ |
| Lead Hunter Agent | — | — | ✓ (Pro only) |
| AI Copywriter | — | — | ✓ |
| Sales Manager | — | — | ✓ |
| Ask Bailey edits | 3/mo | 15/mo | Unlimited |
| AI runs/mo | 20 | 150 | Unlimited |

---

## Environment Variables (What They Are)

These are in `.env.local` (NEVER commit this file) and in Vercel:

| Variable | Purpose |
|---|---|
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis token |
| `ANTHROPIC_API_KEY` | Claude AI API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key (client-safe) |
| `STRIPE_STARTER_PRICE_ID` | Stripe Price ID for $29/mo plan |
| `STRIPE_GROWTH_PRICE_ID` | Stripe Price ID for $79/mo plan |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for $149/mo plan |
| `RESEND_API_KEY` | Resend email API key |
| `JWT_SECRET` | Secret for signing session JWTs |
| `NEXT_PUBLIC_BASE_URL` | `https://baileyagents.com` (no trailing slash) |
| `GOOGLE_PLACES_API_KEY` | Google Places API for location lookup |
| `FACEBOOK_APP_ID` | Facebook app ID for social posting |
| `FACEBOOK_APP_SECRET` | Facebook app secret |

---

## Marketing Site Pages (baileyagents.com public pages)

| Route | File | What it is |
|---|---|---|
| `/` | `app/page.tsx` | Homepage — hero with business name input, agent cards, features, pricing teaser. Dark `#08090a` background. Brand color `#00e5a0` (green). Uses Tailwind + `font-syne` headings. |
| `/pricing` | `app/pricing/page.tsx` | Full pricing page — 3 plan cards from `PRICING_PLANS` in `utils/constants.ts` |
| `/about` | `app/about/page.tsx` | About the company |
| `/agents` | `app/agents/page.tsx` | AI agents showcase |
| `/consulting` | `app/consulting/page.tsx` | Consulting services |
| `/contacts` | `app/contacts/page.tsx` | Contact form |
| `/reviews` | `app/reviews/page.tsx` | Customer reviews |
| `/videos` | `app/videos/page.tsx` | Video library |
| `/login` | `app/login/page.tsx` | Login + signup (same page, toggle between modes) |

**Marketing color scheme:**
- Background: `#08090a` (near black)
- Brand accent: `#00e5a0` (bright green)
- Text: `#f0f0f0` (off-white)
- Muted text: `#9ca3af`
- Cards/surfaces: `#111214` or `#0d0e10`
- Borders: `rgba(255,255,255,0.08)` or `rgba(255,255,255,0.10)`

---

## Marketing Components (used on baileyagents.com pages only)

- `Navbar.tsx` — sticky top nav with auth-aware Log In/Dashboard buttons
- `Footer.tsx` — site footer with links
- `HeroInput.tsx` — the hero "Enter your business name" generator on homepage
- `AgentCards.tsx` — agent showcase cards on homepage
- `BaileyChat.tsx` — floating chat widget
- `BentoGrid.tsx`, `BentoServices.tsx` — bento-style feature grids
- `PricingCard.tsx` — individual pricing plan card
- `SiteCard.tsx` — shows a user's generated site in dashboard
- `ContentMachine.tsx` — content machine marketing section
- `FallingText.tsx` — animated falling text effect

---

## What Has Already Been Built (Do Not Rebuild)

- ✅ Complete auth system (signup, login, email verification, password reset, sessions)
- ✅ Stripe subscriptions (checkout, webhooks, portal, plan gating, past_due handling)
- ✅ 5 website templates (darkpremium, neobrutalism, minimal, magazine, classic)
- ✅ Wix-style site editor (7-tab sidebar, instant preview, autosave, Ask Bailey panel)
- ✅ GSAP animations across all 5 templates (HeroReveal, StatCounter, ScrollAnimator, particles, Ken Burns, etc.)
- ✅ Contact forms on all templates (sends real emails via Resend)
- ✅ Hero image + about image upload (base64, stored in Redis)
- ✅ Navbar editor (background color, link color pickers in sidebar)
- ✅ Admin endpoints (delete-user, backfill-slugs, reset-customer, sync-subscription)
- ✅ Rate limiting on sensitive endpoints
- ✅ Email from noreply@baileyagents.com

---

## Git Info

- **Repo:** `https://github.com/chubby815/bailey-systems-site.git`
- **Branch:** `main`
- **Latest commit:** `98c44f8` — GSAP animations across all 5 templates
- **Shell:** PowerShell — use `;` not `&&` to chain commands

---

*Last updated: March 2026. Context written from full conversation history.*
