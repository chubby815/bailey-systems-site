/**
 * utils/constants.ts
 * EXISTING constants preserved exactly.
 * UPDATED: PRICING_PLANS now reflects the 3 new SaaS subscription tiers.
 */

// ── Nav links ────────────────────────────────────────────────────────────────
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Consulting", href: "/consulting" },
  { label: "Contact", href: "/contacts" },
];

// ── Hero markers (legacy — used by Hero.tsx) ──────────────────────────────────
export const HERO_MARKERS = [
  { label: "Deal Desk Copilots" },
  { label: "Revenue Handoffs" },
  { label: "24/7 Compliance" },
];

// ── Stats (with detail field — used by Hero.tsx) ─────────────────────────────
export const STATS = [
  { label: "Response time",      value: "38s",   detail: "Customers get answers fast — day or night" },
  { label: "Projects delivered", value: "50+",   detail: "Real businesses growing with our systems" },
  { label: "Hours saved",        value: "780+",  detail: "Automated away for our clients every month" },
];

// ── Legacy PricingPlan type (used by PricingCard.tsx — do not change shape) ──
export type PricingPlan = {
  title: string;
  type: string;
  description: string;
  price: string;
  frequency: string;
  features: string[];
  cta: { label: string; href: string };
  popular?: boolean;
};

export const LEGACY_PRICING_PLANS: PricingPlan[] = [
  {
    title: "Business Core",
    type: "The Build",
    description: "Transparent investment models designed for immediate ROI.",
    price: "$1,200",
    frequency: "one-time",
    features: [
      "0.8s Load Speeds",
      "Mobile-Perfect",
      "SEO Built-in",
      "Zero Monthly Fees",
      "Lifetime Code Ownership",
    ],
    cta: { label: "Get Started", href: "#contact" },
    popular: true,
  },
  {
    title: "On-Demand Support",
    type: "Support",
    description: "Pay only for what you need, when you need it.",
    price: "Pay-As-You-Go",
    frequency: "as needed",
    features: [
      "Micro-Updates ($50/request)",
      "New Pages ($300+)",
      "Design Refreshes",
      "Security Audits",
    ],
    cta: { label: "Learn More", href: "#contact" },
  },
];

// ── New SaaS subscription plans (used by app/pricing/page.tsx) ────────────────
export type SaaSPricingPlan = {
  id: "starter" | "growth" | "pro";
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
};

export const PRICING_PLANS: SaaSPricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    billingPeriod: "/mo",
    description: "Perfect for solo operators and new businesses getting online fast.",
    features: [
      "1 AI Website",
      "Website Roast Agent",
      "20 AI runs/month",
      "Basic templates",
      "Custom subdomain hosting",
      "1 Basic AI Chatbot",
      "💬 Ask Bailey (3 edits/month)",
      "Email support",
    ],
    notIncluded: ["Lead Hunter", "Content Machine"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    billingPeriod: "/mo",
    description:
      "For growing businesses that need all three AI agents firing at full power.",
    features: [
      "Up to 3 AI Websites",
      "3 AI Agents",
      "Website Roast Agent",
      "Email Marketer Agent",
      "Customer Support Agent",
      "150 AI runs/month",
      "All templates",
      "Advanced AI Chatbot",
      "💬 Ask Bailey (15 edits/month)",
      "Priority support",
    ],
    notIncluded: ["Lead Hunter", "AI Copywriter", "Sales Manager"],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    billingPeriod: "/mo",
    description:
      "For agencies and power users who need unlimited output and custom branding.",
    features: [
      "Up to 25 AI Websites",
      "All 8 AI Agents",
      "Unlimited runs (fair use)",
      "Advanced templates",
      "Unlimited AI Chatbots",
      "💬 Ask Bailey (Unlimited)",
      "Custom branding & white-label",
      "Usage analytics dashboard",
      "API access",
      "Premium support",
    ],
    cta: "Start Building",
    highlighted: false,
  },
];

// ── Trust elements (used under pricing) ──────────────────────────────────────
export const TRUST_ITEMS = [
  { icon: "🔒", label: "Secure payment via Stripe" },
  { icon: "🗓️", label: "7-day free trial" },
  { icon: "❌", label: "Cancel anytime" },
  { icon: "📄", label: "No contracts" },
  { icon: "💳", label: "No card required to start" },
];

// ── Reviews (used by app/reviews/page.tsx) ────────────────────────────────────
export type Review = {
  name: string;
  role: string;
  quote: string;
  industry: string;
};

export const REVIEWS: Review[] = [
  {
    name: "Ivy Kinsley",
    role: "Chief Experience Officer, Northwind Clinics",
    quote:
      "Bailey Agents rerouted 83% of inbound calls to AI chat that felt indistinguishable from our coordinators. We're staffing weekends with three people now.",
    industry: "Healthcare",
  },
  {
    name: "Mateo Ruiz",
    role: "VP Revenue Operations, Alloy Solar",
    quote:
      "The agents do more than qualify leads—they surface the context our humans need. Handoff briefs cut ramp time for sellers by 40%.",
    industry: "Climate Tech",
  },
  {
    name: "Danielle Price",
    role: "COO, Maven Creative",
    quote:
      "Our fulfillment pod drafts scopes, routes files, and chases approvals automatically. It's the first automation that our producers actually love.",
    industry: "Creative Ops",
  },
];

// ── Video library (used by app/videos/page.tsx and components/VideoCard.tsx) ──
export type VideoResource = {
  title: string;
  description: string;
  href: string;
  thumbnail: string;
  category: string;
};

export const VIDEO_LIBRARY: VideoResource[] = [
  {
    title: "Agent mesh for RevOps",
    description: "How inbound chat syncs to Slack threads and CRM notes in under 30 seconds.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/placeholder-video.jpg",
    category: "Pipeline",
  },
  {
    title: "Fulfillment pod walk-through",
    description: "See AI pair with humans across briefs, QA, and approvals for agencies.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/placeholder-video.jpg",
    category: "Delivery",
  },
  {
    title: "Executive dashboard tour",
    description: "Unified telemetry across chat, SMS, and email with handoff metrics.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/placeholder-video.jpg",
    category: "Visibility",
  },
];

// ── Default chat messages (used by components/ChatWindow.tsx) ─────────────────
export const DEFAULT_CHAT_MESSAGES = [
  {
    role: "assistant" as const,
    content:
      "Hey there! 🐕 I'm Bailey, named after Javier's beagle! I can help you with questions about our services, pricing, location, or anything about Bailey Agents. What would you like to know?",
    timestamp: "09:00",
  },
  {
    role: "user" as const,
    content: "What services do you offer?",
    timestamp: "09:01",
  },
  {
    role: "assistant" as const,
    content:
      "We build custom AI Agents, Websites, Apps, and Automations! Projects start at $1,200. Based in Machesney Park, Illinois. Want to know more about any specific service?",
    timestamp: "09:02",
  },
];
