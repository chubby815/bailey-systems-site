export type NavLink = {
  label: string;
  href: string;
};

export type Service = {
  track: string;
  title: string;
  description: string;
  layers: string[];
};

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

export type Review = {
  name: string;
  role: string;
  quote: string;
  industry: string;
};

export type VideoResource = {
  title: string;
  description: string;
  href: string;
  thumbnail: string;
  category: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Reviews", href: "/reviews" },
  { label: "Videos", href: "/videos" },
  { label: "Contact", href: "/contact" },
];

export const HERO_MARKERS = [
  { label: "Deal Desk Copilots" },
  { label: "Revenue Handoffs" },
  { label: "24/7 Compliance" },
];

export const STATS = [
  { label: "Avg. response time", value: "38s", detail: "Across chat + SMS" },
  { label: "Delivered client work", value: "$8k+", detail: "Real projects shipped" },
  { label: "Humans saved", value: "780+ hrs", detail: "Monthly workload removed" },
];

export const SERVICES: Service[] = [
  {
    track: "Acquisition",
    title: "Revenue Desks",
    description:
      "Qualify inbound leads, schedule demos, and push summaries into HubSpot, Salesforce, or custom CRMs automatically.",
    layers: ["Intent detection", "Calendar sync", "CRM enrichment"],
  },
  {
    track: "Delivery",
    title: "Fulfillment Pods",
    description:
      "Blend AI agents with fulfillment teams to produce briefs, outline deliverables, and request approval within minutes.",
    layers: ["Knowledge indexing", "Work request drafting", "Human approvals"],
  },
  {
    track: "Success",
    title: "Lifecycle Copilots",
    description:
      "Anticipate renewals, escalate risks, and capture testimonials with proactive nudges across email, SMS, and chat.",
    layers: ["Sentiment monitoring", "Account playbooks", "Ticket sync"],
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    title: "Custom Website",
    type: "Project-Based",
    description: "A production-ready website built to your specifications with modern tools and clean architecture.",
    price: "$1,200",
    frequency: "starting price",
    features: [
      "Responsive design for all devices",
      "Modern tech stack (Next.js, React)",
      "SEO optimization built-in",
      "Fast loading performance",
      "Contact forms and integrations",
      "Deployment and launch support",
    ],
    cta: { label: "Get Started", href: "#contact" },
    popular: true,
  },
  {
    title: "Optional Add-ons",
    type: "Post-Launch",
    description: "Extend your website with additional features and ongoing support.",
    price: "Variable",
    frequency: "as needed",
    features: [
      "Website updates: $50 per update",
      "AI chatbot integration: starting at $200",
      "Custom features priced individually",
      "Additional pages and sections",
      "Third-party API integrations",
    ],
    cta: { label: "Discuss Add-ons", href: "#contact" },
  },
];

export const REVIEWS: Review[] = [
  {
    name: "Ivy Kinsley",
    role: "Chief Experience Officer, Northwind Clinics",
    quote:
      "Bailey Systems rerouted 83% of inbound calls to AI chat that felt indistinguishable from our coordinators. We're staffing weekends with three people now.",
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

export const TIMELINE = [
  {
    label: "Day 1–3",
    title: "Signal mapping",
    detail: "Connect CRM, help desk, and knowledge base. Identify edge cases with your leads.",
  },
  {
    label: "Week 2",
    title: "Pilot launch",
    detail: "Ship a production-ready agent with human review prompts and fallback logic.",
  },
  {
    label: "Week 4",
    title: "Orchestration",
    detail: "Unlock multi-agent routing + analytics. Expand to new channels in days.",
  },
];

export const FAQS = [
  {
    question: "How do you keep humans in the loop?",
    answer:
      "We configure guardrails, escalation criteria, and Slack/SMS cues so operators can approve or take over instantly.",
  },
  {
    question: "Which CRMs and tools do you support?",
    answer:
      "Salesforce, HubSpot, Pipedrive, Zendesk, Intercom, Linear, ClickUp, Notion, custom REST APIs, and more via middleware.",
  },
  {
    question: "Can we deploy on-prem or inside our VPC?",
    answer:
      "Yes. Enterprise plans can run inside your VPC with private networking, audit logging, and customer-managed keys.",
  },
];

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/bailey-systems" },
  { label: "YouTube", href: "https://www.youtube.com/@baileysystems" },
  { label: "X", href: "https://x.com/baileysystems" },
];

export const DEFAULT_CHAT_MESSAGES = [
  {
    role: "assistant" as const,
    content: "You're connected to Bailey Systems. What workflow do you want to automate?",
    timestamp: "09:00",
  },
  {
    role: "user" as const,
    content: "Can you qualify leads from our website chat and pass hot ones to Slack?",
    timestamp: "09:01",
  },
  {
    role: "assistant" as const,
    content:
      "Absolutely. We'll deploy an intake agent that scores leads, books meetings, and posts summaries into your #deal-desk channel.",
    timestamp: "09:02",
  },
];

export const DASHBOARD_WIDGETS = [
  { label: "Active agents", value: "7", change: "+2 this week" },
  { label: "Avg. CSAT", value: "4.9", change: "via 864 chats" },
  { label: "Opportunities", value: "$420K", change: "in live pipeline" },
];

export const CONTACT_CHANNELS = [
  { label: "Email", value: "hello@bailey.systems" },
  { label: "HQ", value: "Deep Ellum, Dallas, TX" },
  { label: "Support", value: "support@bailey.systems" },
];

