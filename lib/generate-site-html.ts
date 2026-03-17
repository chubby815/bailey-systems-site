import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { put } from '@vercel/blob'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY!,
  baseURL: 'https://api.x.ai/v1',
})

// ── Style system ──────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  'Emerald Green':  '#10b981',
  'Electric Blue':  '#0066ff',
  'Sunset Orange':  '#f97316',
  'Royal Purple':   '#7c3aed',
  'Fire Red':       '#ef4444',
  'Midnight Black': '#0a0a0a',
  'Golden Yellow':  '#eab308',
  'Hot Pink':       '#ec4899',
  'Cyan':           '#06b6d4',
  'Slate Gray':     '#64748b',
  'Rose Gold':      '#fb7185',
  'Deep Navy':      '#1e3a5f',
}

const FONT_MAP: Record<string, string> = {
  'Modern':            'Inter + DM Sans',
  'Classic & Elegant': 'Playfair Display + Lora',
  'Bold & Strong':     'Space Grotesk + Inter',
  'Clean & Minimal':   'Inter + Plus Jakarta Sans',
}

function getStyleInstructions(
  tone: string,
  primaryColor: string,
  fontStyle: string,
): string {
  const hex   = COLOR_MAP[primaryColor]  ?? '#10b981'
  const fonts = FONT_MAP[fontStyle]      ?? 'Inter + DM Sans'

  if (tone === 'Bold') {
    return `
DESIGN STYLE: NEO BRUTALISM — raw, loud, unapologetic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Colors:
  --bg:      #f5f0e8  (off-white parchment)
  --ink:     #0a0a0a  (pure black)
  --accent:  ${hex}
  --surface: #ffffff

Typography: Space Grotesk (headings, ALL CAPS) + DM Mono (body/labels)
Load via: @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=DM+Mono:wght@400;500&display=swap')

Rules — EVERY element follows these:
• Borders: 3-5px solid var(--ink) on ALL cards/buttons/sections
• Shadows: 6px 6px 0 var(--ink) — never softer
• border-radius: 0 EVERYWHERE — no exceptions
• Buttons: background var(--accent), black border, shadow 4px 4px 0 #000
• Hover on interactive: transform: translate(-4px,-4px); shadow 10px 10px 0 #000
• Hero headlines: clamp(4rem,10vw,9rem), ALL CAPS, letter-spacing -0.02em
• Section numbers: giant outline text 0 0 0 1px black, opacity 0.07
• Layout: tight grid, strong asymmetry, overlapping elements
• Stats bar: high contrast strips alternating --ink and --accent backgrounds
`
  }

  if (tone === 'Luxury') {
    return `
DESIGN STYLE: DARK LUXURY — cinematic, editorial, premium
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Colors:
  --bg:      #06060c  (near-black with blue tint)
  --surface: #0e0e18
  --card:    #12121f
  --border:  rgba(255,255,255,0.07)
  --text:    #f0f0f0
  --muted:   #6b7280
  --accent:  ${hex}

Typography: ${fonts}
Load via: @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap')

Rules:
• Body background: var(--bg) — NEVER white or light
• Section padding: clamp(5rem,12vw,10rem) vertical
• Headlines: Cormorant Garamond 600, clamp(3rem,7vw,6rem), letter-spacing -0.03em
• Subtext: Inter 300, #9ca3af, generous line-height 1.85
• Cards: background var(--card), border 1px solid var(--border), border-radius 16px
• Glass panels: backdrop-filter blur(20px), bg rgba(255,255,255,0.03)
• Accent ${hex}: used ONLY for CTAs, dividers, highlights — never overused
• Subtle grain texture on hero: svg noise filter
• Box shadows: 0 24px 80px rgba(0,0,0,0.5)
• Hover transitions: 0.4s cubic-bezier(0.16,1,0.3,1)
• Horizontal lines between sections: 1px solid rgba(255,255,255,0.06)
`
  }

  if (tone === 'Minimal') {
    return `
DESIGN STYLE: LUXURY MINIMAL — Apple meets Bottega Veneta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Colors:
  --bg:      #fafafa
  --surface: #ffffff
  --ink:     #111111
  --muted:   #6b7280
  --border:  rgba(0,0,0,0.07)
  --accent:  ${hex}

Typography: ${fonts}
Load via: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap')

Rules:
• White space is the design — sections get 140px+ top/bottom padding
• Typography: large, light weight (200-300), clamp(2.5rem,6vw,5rem)
• Only ONE color accent: ${hex} — everything else is black/white/grey
• Borders: 1px solid var(--border) — hairline only
• No shadows — depth through whitespace alone
• Images: full-width, object-cover, aspect-ratio locks
• Nav: transparent, no background, just logo + links
• Buttons: outline style — border 1.5px solid var(--ink), no fill
• Grid: strict 12-column, generous gutters
`
  }

  if (tone === 'Friendly') {
    return `
DESIGN STYLE: WARM MODERN — approachable, energetic, local
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Colors:
  --bg:       #ffffff
  --surface:  #f9fafb
  --ink:      #111827
  --muted:    #6b7280
  --accent:   ${hex}
  --warm:     ${hex}1a  (tint for backgrounds)

Typography: ${fonts}
Load via: @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap')

Rules:
• Corner radius: 12-16px on cards, 9999px on badges/pills
• Shadows: 0 4px 24px rgba(0,0,0,0.08) — warm and soft
• ${hex} used freely for CTAs, section accents, icon backgrounds
• Hero: gradient mesh background — multiple overlapping radial gradients in ${hex} tints
• Stats: big bold numbers in ${hex}, labels in --muted
• Cards: white bg, subtle shadow, border-top 3px solid ${hex}
• Testimonials: speech bubble style
• CTA section: ${hex} background with white text
`
  }

  // Default: Dark Professional
  return `
DESIGN STYLE: DARK PROFESSIONAL PREMIUM — modern SaaS meets local authority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Colors:
  --bg:      #080810
  --surface: #0f0f1a
  --card:    #13131f
  --border:  rgba(255,255,255,0.08)
  --text:    #f0f0f0
  --muted:   #71717a
  --accent:  ${hex}

Typography: ${fonts}
Load via: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap')

Rules:
• Background var(--bg) — dark throughout
• Section padding: clamp(5rem,10vw,8rem)
• Headlines: Inter 700, clamp(2.5rem,6vw,5rem), letter-spacing -0.03em
• Accent ${hex} for CTAs and key highlights
• Cards: background var(--card), border 1px solid var(--border), border-radius 20px
• Stats: large ${hex} numbers, muted labels
• Blur backdrop nav: bg rgba(8,8,16,0.8), backdrop-filter blur(20px)
• Gradient dividers: linear-gradient(90deg, transparent, ${hex}40, transparent)
`
}

// ── Image prompts ─────────────────────────────────────────────────────────────

function buildImagePrompts(
  industry: string,
  tone: string,
): string[] {
  const mood =
    tone === 'Luxury'  ? 'luxury editorial cinematic dark moody, professional photography, dramatic lighting, award-winning composition' :
    tone === 'Bold'    ? 'bold raw dramatic high-contrast, editorial style, punchy composition' :
    tone === 'Minimal' ? 'clean minimal natural light, airy, white space, architectural photography' :
    tone === 'Friendly'? 'warm inviting natural light, candid lifestyle photography, golden hour' :
                         'professional commercial photography, dramatic lighting, premium brand imagery'

  const quality = 'photorealistic 8K, no text, no logos, no watermarks, no people with visible faces unless essential, sharp focus'
  const ind = industry.toLowerCase()

  if (ind.includes('landscap') || ind.includes('lawn')) return [
    `Breathtaking luxury residential garden at dusk, immaculate lawn, dramatic landscape lighting, estate home backdrop, ${mood}, ${quality}`,
    `Professional landscaping crew transforming outdoor space, wide angle shot, lush greenery, power equipment, ${mood}, ${quality}`,
    `Award-winning outdoor entertainment area, stone patio, infinity edge pool, perfectly manicured hedges, ${mood}, ${quality}`,
  ]

  if (ind.includes('restaurant') || ind.includes('food') || ind.includes('ramen') || ind.includes('sushi')) return [
    `Upscale restaurant interior, dramatic pendant lighting, rich textures, empty tables set for dinner, bokeh background, ${mood}, ${quality}`,
    `Chef hands plating exquisite dish, motion blur, kitchen steam, intense focus, close-up artistry, ${mood}, ${quality}`,
    `Hero food shot — perfectly composed gourmet dish, steam rising, dark moody table, atmospheric, ${mood}, ${quality}`,
  ]

  if (ind.includes('fitness') || ind.includes('gym') || ind.includes('yoga') || ind.includes('pilates')) return [
    `Ultra-modern gym interior, dramatic overhead lighting, empty floor space, premium equipment rows, ${mood}, ${quality}`,
    `Athletic silhouette in peak performance pose, dramatic side lighting, sweat detail, muscle definition, ${mood}, ${quality}`,
    `Premium workout equipment close-up, polished metal, rubber flooring, reflective surfaces, ${mood}, ${quality}`,
  ]

  if (ind.includes('beauty') || ind.includes('salon') || ind.includes('spa') || ind.includes('barber')) return [
    `Luxury salon interior, marble counters, soft lighting, immaculate styling stations, premium aesthetic, ${mood}, ${quality}`,
    `Close-up of skilled hands working with hair, precision, luxury tools, soft bokeh, ${mood}, ${quality}`,
    `Serene spa treatment room, candles, towels, zen atmosphere, natural materials, ${mood}, ${quality}`,
  ]

  if (ind.includes('real estate') || ind.includes('property') || ind.includes('realt')) return [
    `Stunning luxury home exterior at golden hour, immaculate landscaping, long driveway, architectural detail, ${mood}, ${quality}`,
    `Magazine-worthy living room interior, designer furniture, natural light flooding in, fresh flowers, ${mood}, ${quality}`,
    `Aerial view of premium residential neighborhood, manicured streets, luxury homes, blue sky, ${mood}, ${quality}`,
  ]

  if (ind.includes('tattoo') || ind.includes('ink') || ind.includes('piercing')) return [
    `Atmospheric tattoo studio, brick walls, neon sign glow, vintage aesthetic, professional equipment, ${mood}, ${quality}`,
    `Extreme close-up of intricate tattoo detail on skin, sharp needlepoint, artistic composition, ${mood}, ${quality}`,
    `Artist at work, concentration, gloves, ink bottles arranged, dramatic lighting from lamp, ${mood}, ${quality}`,
  ]

  if (ind.includes('clean') || ind.includes('maid') || ind.includes('janitorial')) return [
    `Immaculate luxury kitchen after professional cleaning, sparkling surfaces, natural light, editorial style, ${mood}, ${quality}`,
    `Professional cleaning team in action, uniforms, premium equipment, systematic approach, ${mood}, ${quality}`,
    `Before-and-after implied: pristine white bathroom, every surface gleaming, luxury fixtures, ${mood}, ${quality}`,
  ]

  if (ind.includes('consult') || ind.includes('legal') || ind.includes('financial') || ind.includes('account')) return [
    `Premium glass-wall boardroom, city skyline at dusk through floor-to-ceiling windows, executive setting, ${mood}, ${quality}`,
    `Professional hands on laptop, financial documents, luxury desk accessories, office detail, ${mood}, ${quality}`,
    `Architectural exterior of premium office building, glass facade, dramatic sky, authority, ${mood}, ${quality}`,
  ]

  if (ind.includes('auto') || ind.includes('car') || ind.includes('mechanic') || ind.includes('detailing')) return [
    `Luxury vehicle in pristine service bay, dramatic lighting, polished concrete, professional tools, ${mood}, ${quality}`,
    `Close-up of skilled mechanic hands working on premium engine, focus and expertise, ${mood}, ${quality}`,
    `Showroom-quality car detail — paint reflection, spotless finish, studio lighting, ${mood}, ${quality}`,
  ]

  if (ind.includes('plumb') || ind.includes('electr') || ind.includes('hvac') || ind.includes('roofing')) return [
    `Professional tradesperson at work, precision tools, clean uniform, focused expertise, ${mood}, ${quality}`,
    `Premium tools laid out professionally on work surface, organized, quality equipment, ${mood}, ${quality}`,
    `Satisfied homeowner in beautiful home, implied successful project completion, ${mood}, ${quality}`,
  ]

  if (ind.includes('night') || ind.includes('club') || ind.includes('bar') || ind.includes('lounge')) return [
    `Upscale nightclub interior, dramatic neon lighting, empty dance floor, VIP booths, atmospheric, ${mood}, ${quality}`,
    `Luxury bar counter, backlit spirits display, marble top, professional setup, editorial angle, ${mood}, ${quality}`,
    `Rooftop venue at night, city lights below, ambient lighting, premium outdoor setup, ${mood}, ${quality}`,
  ]

  // Generic fallback
  return [
    `Premium ${industry} business environment, dramatic professional photography, luxury branding aesthetic, ${mood}, ${quality}`,
    `Expert team at work in modern ${industry} setting, professional authority, premium equipment, ${mood}, ${quality}`,
    `Satisfied client experience, premium service delivery, aspirational lifestyle, ${mood}, ${quality}`,
  ]
}

// ── Image generation + Blob upload ───────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40)
}

async function generateGrokImages(
  businessName: string,
  industry: string,
  tone: string,
  count: number = 3,
): Promise<string[]> {
  const prompts = buildImagePrompts(industry, tone)
  const slug    = slugify(businessName)
  const urls: string[] = []

  for (let i = 0; i < Math.min(count, prompts.length); i++) {
    try {
      console.log(`[GROK] Generating image ${i + 1}/${count}: ${prompts[i].slice(0, 60)}…`)

      const response = await grok.images.generate({
        model:           'grok-imagine-image',
        prompt:          prompts[i],
        n:               1,
        response_format: 'b64_json',
      } as Parameters<typeof grok.images.generate>[0])

      const b64 = response.data?.[0]
        ? (response.data[0] as { b64_json?: string }).b64_json
        : undefined

      if (!b64) {
        console.warn(`[GROK] Image ${i + 1} returned no b64_json — skipping`)
        continue
      }

      // Upload to Vercel Blob CDN if token is available; fall back to base64 data URI
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const buffer   = Buffer.from(b64, 'base64')
          const filename = `site-images/${slug}-${i}-${Date.now()}.jpg`
          const blob     = await put(filename, buffer, {
            access:      'public',
            contentType: 'image/jpeg',
          })
          urls.push(blob.url)
          console.log(`[BLOB] ✅ Image ${i + 1} uploaded → ${blob.url}`)
        } catch (blobErr) {
          console.error(`[BLOB] Upload failed for image ${i + 1}, falling back to base64:`, blobErr)
          urls.push(`data:image/jpeg;base64,${b64}`)
        }
      } else {
        // No Blob token — use base64 data URI (will be large but functional)
        urls.push(`data:image/jpeg;base64,${b64}`)
        console.log(`[GROK] ✅ Image ${i + 1} ready (base64 fallback — add BLOB_READ_WRITE_TOKEN for CDN)`)
      }
    } catch (err) {
      console.error(`[GROK] Image ${i + 1} failed:`, err)
    }
  }

  console.log(`[GROK] ${urls.length}/${count} images ready`)
  return urls
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function generateSiteHTML(params: {
  businessName:  string
  industry:      string
  location:      string
  services:      string
  tone:          string
  primaryColor:  string
  fontStyle:     string
  heroStyle:     string
  layoutStyle:   string
  tagline?:      string
  description?:  string
  contactEmail?: string
  contactPhone?: string
  businessHours?:string
  facebookUrl?:  string
  instagramUrl?: string
  enableChat?:   boolean
}): Promise<string> {
  const {
    businessName, industry, location, services,
    tone, primaryColor, fontStyle, heroStyle, layoutStyle,
    tagline, description, contactEmail, contactPhone,
    businessHours, facebookUrl, instagramUrl, enableChat,
  } = params

  const styleInstructions = getStyleInstructions(tone, primaryColor, fontStyle)

  console.log('[BUILD] Generating Grok images…')
  const images   = await generateGrokImages(businessName, industry, tone, 2)
  const heroImg  = images[0] ?? null
  const aboutImg = images[1] ?? null

  const hex = COLOR_MAP[primaryColor] ?? '#10b981'

  const imageBlock = heroImg ? `
REAL CDN IMAGES — embed exactly as shown (these are real URLs, not placeholders):
  Hero background image URL:  HERO_IMG_PLACEHOLDER
  About section image URL:    ABOUT_IMG_PLACEHOLDER

How to use each:
  HERO: as CSS background-image on the hero section div, always with a dark overlay rgba(0,0,0,0.5) on top
  ABOUT: as <img> tag in the about section, object-fit cover, max-height 600px, border-radius per design style

Rules:
  ✅ HERO_IMG_PLACEHOLDER — hero background-image, full viewport cover
  ✅ ABOUT_IMG_PLACEHOLDER — about section photo, displayed as <img>
  ✅ ALL images use object-fit: cover
  ✅ Hero MUST have a dark overlay for text legibility
  ❌ NEVER use emoji as image replacements
  ❌ NEVER leave an img src empty
` : `
No AI images available — use premium CSS gradient backgrounds:
  Hero: radial-gradient or mesh gradient using ${hex}
  Cards: subtle tinted backgrounds
  NEVER use emojis as images
`

  const contactBlock = [
    contactEmail   && `Email: ${contactEmail}`,
    contactPhone   && `Phone: ${contactPhone}`,
    businessHours  && `Hours: ${businessHours}`,
    facebookUrl    && `Facebook: ${facebookUrl}`,
    instagramUrl   && `Instagram: ${instagramUrl}`,
  ].filter(Boolean).join('\n')

  const maxWidth =
    layoutStyle === 'Centered'   ? '800px'  :
    layoutStyle === 'Full Width' ? '100%'   : '1280px'

  const prompt = `You are an elite front-end developer. You build websites that get featured on Awwwards. Every site you produce is worth $10,000.

Build a COMPLETE, SINGLE-FILE HTML website for this business. No frameworks. Pure HTML + CSS + JS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Business Name: ${businessName}
Industry:      ${industry}
Location:      ${location}
Services:      ${services}
${tagline      ? `Tagline:   ${tagline}`     : ''}
${description  ? `About:     ${description}` : ''}
${contactBlock ? `Contact:\n${contactBlock}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${styleInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${imageBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• html, body: width 100%; overflow-x: hidden; margin: 0; padding: 0
• All sections: width: 100%; box-sizing: border-box
• Inner content max-width: ${maxWidth}; margin: 0 auto
• Hero: min-height: 100svh; width: 100%; position: relative
• Hero style preference: ${heroStyle}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED SECTIONS (all 8, in this order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NAVBAR
   • position: fixed; top: 0; width: 100%; z-index: 1000
   • backdrop-filter: blur(20px); transition on scroll
   • Logo (business name, styled), nav links, CTA button
   • Hamburger icon for mobile — working JS toggle

2. HERO — the most important section
   • min-height: 100svh, full viewport coverage
   • HERO_IMG_PLACEHOLDER as background-image + dark overlay
   • Animated entrance: headline words appear one by one (stagger with CSS keyframes)
   • Headline: clamp(3.5rem,8vw,8rem) — bold, specific, NOT generic
     Examples of GOOD headlines:
       "Sixty Years of Soulful Broth" (ramen restaurant)
       "Where the Atlantic Meets Artistry" (Miami beach club)
       "Hits Different at 1AM" (nightclub)
       "The Last Lawn You'll Ever Need" (landscaping)
     Write a headline THIS specific and bold for ${businessName}
   • Sub-headline: one vivid sentence about what makes this business special
   • TWO CTA buttons: primary filled + secondary ghost outline
   • Location badge with animated pulse dot

3. TRUST/STATS BAR
   • Full-width strip, 4 impressive stats
   • Big numbers + short labels
   • High contrast background

4. SERVICES GRID
   • 3-column grid (responsive)
   • Featured card uses ABOUT_IMG_PLACEHOLDER as a background accent if available; otherwise CSS gradient
   • Each card: icon, name, description
   • Hover effects per design style

5. ABOUT
   • Two-column layout: text left, ABOUT_IMG_PLACEHOLDER right
   • Real story about the business, specific to ${businessName} in ${location}
   • 2-3 stats in the text column

6. TESTIMONIALS
   • 3 authentic reviews — specific names, roles, quotes about real outcomes
   • Star ratings
   • Design per style guide (cards, masonry, or strips)

7. CONTACT
   • Full contact form: Name, Email, Phone, Message fields
   • Display: phone, email, hours if provided
   • Map placeholder or address block
   • Submit button with hover animation

8. FOOTER
   • Business name + tagline
   • Nav links, contact info, social links if provided
   • Copyright line with current year via JS
   ${enableChat ? `
9. AI CHAT WIDGET
   • Floating button bottom-right
   • Opens slide-up panel
   • Matches site design exactly
   ` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• ZERO Lorem Ipsum — every word is real, specific, compelling
• Every headline punches — no "Welcome to Our Website" garbage
• Business name (${businessName}) appears prominently throughout
• Location (${location}) used naturally in copy
• Testimonials sound like real humans, not marketing robots
• Stats must be believable and impressive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATIONS & INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Hero headline: word-by-word entrance (CSS keyframes, staggered animation-delay)
• Scroll reveals: IntersectionObserver — elements slide up + fade in as they enter viewport
• Nav: changes opacity/backdrop on scroll (JS scroll event listener)
• Buttons: scale + shadow on hover
• Stat counters: animate from 0 to final value on scroll enter
• Smooth scroll for anchor links

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Single .html file — all CSS in <style>, all JS in <script> at end of body
• Google Fonts via @import in <style> (load correct fonts per design style)
• CSS custom properties (--bg, --accent, --text, etc.) defined in :root
• clamp() for all typography and spacing — fully fluid responsive
• Mobile-first — works perfectly at 320px, 768px, 1440px
• Hamburger menu JS: toggle class, animate bars into X
• IntersectionObserver for all scroll reveals
• NO external JS libraries (no jQuery, no GSAP) — vanilla JS only
• Minimum 500 lines — this is a premium production website

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Return ONLY the raw HTML — no explanation, no markdown, no backticks
• Start immediately with <!DOCTYPE html>
• Use exactly these placeholder strings in the HTML:
    HERO_IMG_PLACEHOLDER
    ABOUT_IMG_PLACEHOLDER
• They will be replaced with real CDN image URLs after generation`

  console.log('[BUILD] Generating premium HTML…')

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-5',
    max_tokens: 16000,
    messages:   [{ role: 'user', content: prompt }],
  })

  let html = (response.content[0] as { text: string }).text.trim()

  // Strip any accidental markdown fences
  html = html.replace(/^```html?\s*/i, '').replace(/```\s*$/, '').trim()

  // Inject real image URLs
  if (heroImg)  html = html.replace(/HERO_IMG_PLACEHOLDER/g, heroImg)
  if (aboutImg) html = html.replace(/ABOUT_IMG_PLACEHOLDER/g, aboutImg)

  // Strip any remaining unreplaced placeholders (failed generation) so they
  // never appear as literal text or broken src attributes in the final page
  for (const ph of ['HERO_IMG_PLACEHOLDER', 'ABOUT_IMG_PLACEHOLDER', 'SERVICE_IMG_PLACEHOLDER']) {
    html = html.replace(new RegExp(`background-image:\\s*url\\(['"]?${ph}['"]?\\)`, 'g'), 'background-image: none')
    html = html.replace(new RegExp(`src=['"]?${ph}['"]?`, 'g'), 'src=""')
    html = html.replace(new RegExp(ph, 'g'), '')
  }

  // Ensure document closes properly
  if (!html.includes('</body>')) html += '\n</body>\n</html>'

  // Force all content visible — override any scroll-reveal hidden states
  html = html.replace(
    '</style>',
    `  /* Force all content visible */
  * { opacity: 1 !important; }
  [class*="reveal"],
  [class*="fade"],
  [class*="hidden"],
  [class*="animate"] {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }
</style>`,
  )

  const lineCount = html.split('\n').length
  console.log(`[BUILD] Done — ${lineCount} lines, ~${Math.round(html.length / 1024)}KB`)
  return html
}
