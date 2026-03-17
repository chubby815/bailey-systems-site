/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "oaidalleapiprodscus.blob.core.windows.net" },
    ],
  },
  async headers() {
    return [
      // ── Global security headers for all routes ─────────────────────────────
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control',             value: 'no-store, must-revalidate' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.anthropic.com https://api.openai.com https://api.stripe.com",
              // Allow framing baileyagents.com subdomains (editor iframe preview)
              "frame-src 'self' https://*.baileyagents.com https://js.stripe.com https://hooks.stripe.com",
            ].join('; '),
          },
        ],
      },
      // ── Site pages: allow embedding in the editor iframe ───────────────────
      // Next.js applies later rules after earlier ones for the same key, so
      // these headers override the global X-Frame-Options and CSP for /sites/*.
      {
        source: '/sites/:path*',
        headers: [
          // Override global DENY — frame-ancestors CSP takes precedence in
          // modern browsers, but SAMEORIGIN avoids a hard block as fallback.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Generated HTML uses Google Fonts and inline scripts from Claude
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https://api.anthropic.com https://api.stripe.com https://*.baileyagents.com",
              "frame-src 'self' https://*.baileyagents.com https://js.stripe.com https://hooks.stripe.com",
              // Allow the editor (any baileyagents.com origin) to frame site pages
              "frame-ancestors 'self' https://*.baileyagents.com https://baileyagents.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
