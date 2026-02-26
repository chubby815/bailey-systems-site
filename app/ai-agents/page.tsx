"use client";

import Image from "next/image";
import Link from "next/link";
import { Bot, Zap, Heart, ArrowLeft, MessageCircle } from "lucide-react";

const utilityAgents = [
  {
    id: 1,
    name: "Support Assistant",
    price: "$499",
    image: "/vee.png",
    category: "Utility",
    specs: [
      "24/7 Customer Support",
      "FAQ Database",
      "Email Integration",
      "Basic Analytics",
      "30-Day Training",
      "Monthly Updates"
    ],
    stripeLink: "https://buy.stripe.com/your-agent-link-1"
  },
  {
    id: 2,
    name: "Dev Bot Pro",
    price: "$999",
    image: "/vee.png",
    category: "Utility",
    specs: [
      "Code Generation",
      "Documentation Writer",
      "Bug Detection",
      "Git Integration",
      "Custom Training",
      "90-Day Support"
    ],
    stripeLink: "https://buy.stripe.com/your-agent-link-2"
  },
  {
    id: 3,
    name: "Sales Agent",
    price: "$1,499",
    image: "/vee.png",
    category: "Utility",
    specs: [
      "Lead Qualification",
      "CRM Integration",
      "Follow-up Automation",
      "Meeting Scheduler",
      "Analytics Dashboard",
      "6-Month Support"
    ],
    stripeLink: "https://buy.stripe.com/your-agent-link-3"
  }
];

const companionPersonas = [
  {
    id: 4,
    name: "AI Friend",
    price: "$199",
    image: "/vee.png",
    category: "Companion",
    specs: [
      "Long-term Memory",
      "Personality Traits",
      "Voice-Enabled",
      "Daily Check-ins",
      "Emotional Support",
      "Lifetime Updates"
    ],
    stripeLink: "https://buy.stripe.com/your-companion-link-1"
  },
  {
    id: 5,
    name: "Romantic Partner AI",
    price: "$299",
    image: "/vee.png",
    category: "Companion",
    specs: [
      "Deep Conversations",
      "Relationship Memory",
      "Voice & Text",
      "Photo Recognition",
      "Anniversary Reminders",
      "Premium Support"
    ],
    stripeLink: "https://buy.stripe.com/your-companion-link-2"
  },
  {
    id: 6,
    name: "Custom Persona",
    price: "$799",
    image: "/vee.png",
    category: "Companion",
    specs: [
      "Fully Customizable",
      "RAG Integration",
      "Multi-modal (Voice/Text/Image)",
      "Advanced Memory",
      "Personality Fine-tuning",
      "1-Year Support"
    ],
    stripeLink: "https://buy.stripe.com/your-companion-link-3"
  }
];

export default function AIAgentsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-6 py-16">
      {/* Main Terminal Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white border-4 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-all uppercase text-sm shadow-[4px_4px_0_#0a0a0a]"
          style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}
        >
          <ArrowLeft size={20} />
          MAIN TERMINAL
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 border-2 border-black bg-[#0EA5E9] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white mb-6">
          <Bot size={16} />
          AI AGENT MARKETPLACE
        </div>
        <h1 className="text-6xl font-black mb-6 text-black" style={{ letterSpacing: '-0.04em', fontWeight: 900 }}>
          Custom AI Agents
          <span className="block w-48 h-2 bg-[#0EA5E9] mx-auto mt-4"></span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
          Production-ready AI agents for business and personal use. Deploy in minutes.
        </p>
      </div>

      {/* Utility Agents Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Zap size={32} className="text-[#0EA5E9]" strokeWidth={2.5} />
          <h2 className="text-4xl font-black text-black" style={{ letterSpacing: '-0.03em', fontWeight: 900 }}>
            Utility Agents
          </h2>
        </div>
        <p className="text-lg text-gray-600 mb-8 font-medium">
          Business-focused agents that automate workflows and increase productivity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {utilityAgents.map((agent) => (
            <div
              key={agent.id}
              className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_#0a0a0a] hover:shadow-[12px_12px_0_#0a0a0a] transition-all"
            >
              {/* Agent Image */}
              <div className="relative w-24 h-24 mx-auto mb-4 border-4 border-black overflow-hidden">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Agent Info */}
              <h3 className="text-2xl font-black text-black text-center mb-2" style={{ letterSpacing: '-0.03em' }}>
                {agent.name}
              </h3>
              <p className="text-3xl font-black text-[#0EA5E9] text-center mb-6" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
                {agent.price}
              </p>

              {/* Core Specs */}
              <div className="mb-6 bg-black/5 p-4 border-2 border-black">
                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3" style={{ letterSpacing: '-0.01em' }}>
                  CORE SPECS
                </h4>
                <ul className="space-y-2">
                  {agent.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-2 h-2 bg-[#0EA5E9]"></span>
                      <span className="font-medium">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={agent.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#00ff41] text-black border-4 border-black font-black text-center uppercase text-sm shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all"
                  style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}
                >
                  BUY NOW
                </a>
                <Link
                  href="/consulting"
                  className="block w-full py-3 bg-white text-black border-4 border-black font-bold text-center uppercase text-sm shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  CUSTOMIZE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Divider */}
      <div className="w-full max-w-7xl mx-auto h-2 bg-[#0EA5E9] mb-20"></div>

      {/* Companion Personas Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={32} className="text-[#0EA5E9]" strokeWidth={2.5} />
          <h2 className="text-4xl font-black text-black" style={{ letterSpacing: '-0.03em', fontWeight: 900 }}>
            Companion Personas
          </h2>
        </div>
        <p className="text-lg text-gray-600 mb-8 font-medium">
          Personal AI companions with deep memory and emotional intelligence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companionPersonas.map((agent) => (
            <div
              key={agent.id}
              className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_#0a0a0a] hover:shadow-[12px_12px_0_#0a0a0a] transition-all"
            >
              {/* Agent Image */}
              <div className="relative w-24 h-24 mx-auto mb-4 border-4 border-black overflow-hidden">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Agent Info */}
              <h3 className="text-2xl font-black text-black text-center mb-2" style={{ letterSpacing: '-0.03em' }}>
                {agent.name}
              </h3>
              <p className="text-3xl font-black text-[#0EA5E9] text-center mb-6" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
                {agent.price}
              </p>

              {/* Core Specs */}
              <div className="mb-6 bg-black/5 p-4 border-2 border-black">
                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3" style={{ letterSpacing: '-0.01em' }}>
                  CORE SPECS
                </h4>
                <ul className="space-y-2">
                  {agent.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className="w-2 h-2 bg-[#0EA5E9]"></span>
                      <span className="font-medium">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={agent.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#00ff41] text-black border-4 border-black font-black text-center uppercase text-sm shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all"
                  style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}
                >
                  BUY NOW
                </a>
                <Link
                  href="/consulting"
                  className="block w-full py-3 bg-white text-black border-4 border-black font-bold text-center uppercase text-sm shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  CUSTOMIZE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto text-center border-4 border-black bg-[#F4C430] p-12">
        <h2 className="text-3xl font-black text-black mb-4" style={{ letterSpacing: '-0.03em' }}>
          Need a Custom AI Agent?
        </h2>
        <p className="text-lg text-black mb-6 font-medium">
          We build agents with any personality, capability, or integration you need.
        </p>
        <Link
          href="/consulting"
          className="inline-block px-8 py-4 bg-black text-white border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all"
          style={{ letterSpacing: '-0.01em' }}
        >
          START A PROJECT
        </Link>
      </div>
    </main>
  );
}
