import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY!,
  baseURL: 'https://api.x.ai/v1'
})

function getStyleInstructions(
  description: string,
  tone: string,
  primaryColor: string,
  fontStyle: string
): string {
  const colorMap: Record<string, string> = {
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
  const hex = colorMap[primaryColor] || '#10b981'

  const fontMap: Record<string, string> = {
    'Modern':            'Inter + DM Sans',
    'Classic & Elegant': 'Playfair Display + Lora',
    'Bold & Strong':     'Space Grotesk + Inter',
    'Clean & Minimal':   'Inter + Plus Jakarta Sans',
  }
  const fonts = fontMap[fontStyle] || 'Inter + DM Sans'

  // description param is used implicitly via the tone branching below
  void description

  if (tone === 'Bold') {
    return `
DESIGN STYLE: NEO BRUTALISM
Colors: background #f5f0e8, 
  primary #000, accent ${hex}
Fonts: Space Grotesk + DM Mono
Rules:
- Thick 3-5px solid black borders
- Hard box-shadows: 6px 6px 0 #000
- ZERO border-radius
- Off-white background
- Buttons: solid ${hex}, black border
- Hover: translate(-3px,-3px)
- MASSIVE typography clamp(3rem,8vw,8rem)
- Uppercase headings
`
  }
  if (tone === 'Luxury') {
    return `
DESIGN STYLE: DARK LUXURY
Colors: background #080810, 
  primary ${hex}, text #f0f0f0
Fonts: ${fonts}
Rules:
- Deep dark premium background
- ${hex} gradient accents
- Glass morphism cards
- Subtle grain texture overlay
- Premium shadow depth
- Smooth hover transitions
`
  }
  if (tone === 'Minimal') {
    return `
DESIGN STYLE: LUXURY MINIMALIST
Colors: background #fafafa,
  primary ${hex}, text #1a1a1a
Fonts: ${fonts}
Rules:
- Massive white space 120px+ padding
- Thin borders rgba(0,0,0,0.08)
- ${hex} as ONLY color accent
- Light font weights 300-400
`
  }
  if (tone === 'Friendly') {
    return `
DESIGN STYLE: WARM MODERN
Colors: background #ffffff,
  primary ${hex}, text #1a1a1a
Fonts: ${fonts}
Rules:
- Warm approachable design
- Rounded corners 12-16px
- Soft shadows
- ${hex} for CTAs and accents
- Gradient hero soft colors
`
  }
  return `
DESIGN STYLE: DARK MODERN PREMIUM
Colors: background #080810,
  primary ${hex}, text #f0f0f0
Fonts: ${fonts}
Rules:
- Dark premium background
- ${hex} gradient accents
- Glass morphism cards
- Smooth CSS animations
- Intersection Observer reveals
- Sticky nav blur backdrop
`
}

function buildImagePrompts(
  businessName: string,
  industry: string,
  location: string,
  tone: string
): string[] {
  // businessName and location are embedded in the base prompt context
  void businessName
  void location

  const mood = tone === 'Luxury'
    ? 'luxury editorial dark moody cinematic'
    : tone === 'Bold'
    ? 'bold high contrast raw dramatic'
    : tone === 'Minimal'
    ? 'clean minimal white natural light'
    : 'professional commercial photography'

  const base =
    `${mood}, no text, no logos, ` +
    `no watermarks, photorealistic 4K`
  const ind = industry.toLowerCase()

  if (ind.includes('landscap') ||
      ind.includes('lawn')) {
    return [
      `Beautiful landscaped garden luxury ` +
        `home exterior, ${base}`,
      `Professional landscaper working ` +
        `outdoors, ${base}`,
      `Stunning outdoor living space ` +
        `patio, ${base}`,
    ]
  }
  if (ind.includes('restaurant') ||
      ind.includes('food')) {
    return [
      `Upscale restaurant interior ` +
        `atmospheric lighting, ${base}`,
      `Gourmet food plating artistic, ${base}`,
      `Professional chef cooking ` +
        `modern kitchen, ${base}`,
    ]
  }
  if (ind.includes('fitness') ||
      ind.includes('gym')) {
    return [
      `Modern luxury gym interior ` +
        `dramatic lighting, ${base}`,
      `Athletic person intense workout, ${base}`,
      `Premium gym equipment, ${base}`,
    ]
  }
  if (ind.includes('beauty') ||
      ind.includes('salon')) {
    return [
      `Luxury hair salon interior modern, ${base}`,
      `Hairstylist working on client, ${base}`,
      `Beauty spa relaxation treatment, ${base}`,
    ]
  }
  if (ind.includes('real estate') ||
      ind.includes('property')) {
    return [
      `Luxury modern home exterior ` +
        `golden hour, ${base}`,
      `Stunning interior design ` +
        `living room, ${base}`,
      `Real estate agent showing ` +
        `property, ${base}`,
    ]
  }
  if (ind.includes('tattoo')) {
    return [
      `Tattoo artist working on client ` +
        `dramatic lighting, ${base}`,
      `Detailed tattoo art close up, ${base}`,
      `Modern tattoo studio interior, ${base}`,
    ]
  }
  if (ind.includes('clean')) {
    return [
      `Spotless modern home interior, ${base}`,
      `Professional cleaning team ` +
        `working, ${base}`,
      `Clean bright kitchen after ` +
        `cleaning, ${base}`,
    ]
  }
  if (ind.includes('consult')) {
    return [
      `Modern professional office ` +
        `meeting room, ${base}`,
      `Business consultant team ` +
        `working, ${base}`,
      `Corporate office glass ` +
        `building, ${base}`,
    ]
  }
  if (ind.includes('auto') ||
      ind.includes('car')) {
    return [
      `Modern auto shop interior ` +
        `professional, ${base}`,
      `Mechanic working on luxury car, ${base}`,
      `Car detailing professional, ${base}`,
    ]
  }
  if (ind.includes('plumb') ||
      ind.includes('electric')) {
    return [
      `Professional tradesperson ` +
        `working, ${base}`,
      `Modern tools equipment ` +
        `professional, ${base}`,
      `Happy customer with ` +
        `technician, ${base}`,
    ]
  }
  return [
    `Professional ${industry} business ` +
      `environment, ${base}`,
    `Team working modern ${industry} ` +
      `office, ${base}`,
    `${industry} service delivered ` +
      `professionally, ${base}`,
  ]
}

async function generateGrokImages(
  businessName: string,
  industry: string,
  location: string,
  tone: string,
  count: number = 3
): Promise<string[]> {
  const prompts = buildImagePrompts(
    businessName, industry, location, tone
  )
  const images: string[] = []

  for (
    let i = 0;
    i < Math.min(count, prompts.length);
    i++
  ) {
    try {
      console.log(
        `[GROK] Generating image ${i+1}/${count}`
      )
      const response = await grok.images.generate({
        model:           'grok-2-vision-1212',
        prompt:          prompts[i],
        n:               1,
        response_format: 'b64_json',
      } as Parameters<typeof grok.images.generate>[0])

      const b64 = response.data?.[0]
        ? (response.data[0] as { b64_json?: string }).b64_json
        : undefined

      if (b64) {
        images.push(
          `data:image/jpeg;base64,${b64}`
        )
        console.log(`[GROK] ✅ Image ${i+1} done`)
      }
    } catch (err) {
      console.error(
        `[GROK] Image ${i+1} failed:`, err
      )
    }
  }

  console.log(
    `[GROK] Generated ${images.length}/${count}`
  )
  return images
}

export async function generateSiteHTML(params: {
  businessName:      string
  industry:          string
  location:          string
  services:          string
  tone:              string
  primaryColor:      string
  fontStyle:         string
  heroStyle:         string
  layoutStyle:       string
  tagline?:          string
  description?:      string
  contactEmail?:     string
  contactPhone?:     string
  businessHours?:    string
  facebookUrl?:      string
  instagramUrl?:     string
  enableChat?:       boolean
}): Promise<string> {
  const {
    businessName, industry, location,
    services, tone, primaryColor,
    fontStyle, heroStyle, layoutStyle,
    tagline, description,
    contactEmail, contactPhone,
    businessHours, facebookUrl,
    instagramUrl, enableChat
  } = params

  const fullDesc =
    `${businessName} ${industry} ${tone}`

  const styleInstructions = getStyleInstructions(
    fullDesc, tone, primaryColor, fontStyle
  )

  console.log('[BUILD] Generating Grok images...')
  const images = await generateGrokImages(
    businessName, industry, location, tone, 3
  )

  const heroImg  = images[0] || null
  const aboutImg = images[1] || null
  const svcImg   = images[2] || null

  const imageInstructions = heroImg ? `
REAL AI IMAGES — USE THESE EXACT PLACEHOLDERS:
Hero background: HERO_IMG_PLACEHOLDER
About section:   ABOUT_IMG_PLACEHOLDER  
Service card:    SERVICE_IMG_PLACEHOLDER

IMAGE RULES:
✅ HERO_IMG_PLACEHOLDER as hero background
✅ Dark overlay rgba(0,0,0,0.55) over hero
✅ ABOUT_IMG_PLACEHOLDER in about section
✅ SERVICE_IMG_PLACEHOLDER in service card
✅ All images: object-fit cover
❌ NEVER use emojis as images
❌ NEVER leave img src empty
` : `
No images — use premium CSS gradients.
NEVER use emojis as image replacements.
`

  const contactInfo = [
    contactEmail && `Email: ${contactEmail}`,
    contactPhone && `Phone: ${contactPhone}`,
    businessHours && `Hours: ${businessHours}`,
    facebookUrl && `Facebook: ${facebookUrl}`,
    instagramUrl && `Instagram: ${instagramUrl}`,
  ].filter(Boolean).join('\n')

  // heroStyle and layoutStyle used in the prompt below
  const prompt = `You are a senior front-end 
developer charging $5,000 per website.
Build a COMPLETE single-file HTML website.

Business: ${businessName}
Industry: ${industry}
Location: ${location}
Services: ${services}
${tagline ? `Tagline: ${tagline}` : ''}
${description ? `About: ${description}` : ''}
${contactInfo ? `Contact:\n${contactInfo}` : ''}

${styleInstructions}

${imageInstructions}

LAYOUT RULES:
- html body width 100% no overflow
- All sections full width
- Hero min-height 100vh width 100%
- overflow-x hidden on body
- Hero style: ${heroStyle}
- Layout style: ${layoutStyle}

REQUIRED SECTIONS:
1. NAV — fixed, logo, links, CTA, hamburger
2. HERO — 100vw 100vh, bold headline, 2 CTAs
3. STATS BAR — 4 impressive numbers
4. SERVICES — grid layout with images
5. ABOUT — two column, real story, real image
6. TESTIMONIALS — 3 specific real reviews
7. CONTACT — full form + phone + email + hours
8. FOOTER — links, social, copyright

COPY RULES:
- Zero Lorem Ipsum EVER
- Real compelling headlines
- Use business name: ${businessName}
- Use location: ${location}
- Strong CTAs everywhere

${enableChat ? `
CHAT WIDGET:
Floating button bottom right "Chat with us"
Opens simple chat panel
Matches site design
` : ''}

TECHNICAL:
- Single HTML file
- All CSS in style tag
- All JS in script tag  
- Google Fonts via @import
- CSS custom properties
- clamp() fluid typography
- Mobile responsive
- Intersection Observer reveals
- Minimum 400 lines

IMPORTANT:
Return ONLY the HTML.
Start with <!DOCTYPE html>
Use HERO_IMG_PLACEHOLDER, 
ABOUT_IMG_PLACEHOLDER,
SERVICE_IMG_PLACEHOLDER as placeholders.`

  console.log('[BUILD] Generating HTML...')

  const response = await anthropic.messages.create({
    model:      'claude-sonnet-4-5',
    max_tokens: 16000,
    messages:   [{ role: 'user', content: prompt }]
  })

  let html = (
    response.content[0] as { text: string }
  ).text.trim()

  html = html.replace(/^```html?\s*/i, '')
             .replace(/```\s*$/, '')
             .trim()

  if (heroImg) {
    html = html.replace(
      /HERO_IMG_PLACEHOLDER/g, heroImg
    )
  }
  if (aboutImg) {
    html = html.replace(
      /ABOUT_IMG_PLACEHOLDER/g, aboutImg
    )
  }
  if (svcImg) {
    html = html.replace(
      /SERVICE_IMG_PLACEHOLDER/g, svcImg
    )
  }

  if (!html.includes('</body>')) {
    html += '\n</body>\n</html>'
  }

  html = html.replace(
    /\.reveal\s*\{([^}]*?)opacity\s*:\s*0/g,
    '.reveal {$1opacity: 1'
  )

  html = html.replace(
    '</style>',
    `
  .reveal { opacity: 1 !important; }
  .reveal.hidden { 
    opacity: 0 !important;
    transform: translateY(40px) !important; 
  }
  .reveal.visible { 
    opacity: 1 !important;
    transform: translateY(0) !important; 
  }
</style>`
  )

  console.log(
    `[BUILD] Done: ` +
    `${html.split('\n').length} lines`
  )
  return html
}
