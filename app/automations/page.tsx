"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, Shield, Cpu, ArrowLeft } from "lucide-react";

const automationProducts = [
  {
    id: 1,
    name: "Single Workflow",
    price: "$799",
    image: "/vee.png",
    specs: [
      "One Automation Flow",
      "Basic Integration",
      "Email Notifications",
      "Error Logging",
      "30-Day Support",
      "1-Week Delivery"
    ],
    stripeLink: "https://buy.stripe.com/your-automation-link-1",
    tier: "starter"
  },
  {
    id: 2,
    name: "Multi-System Integration",
    price: "$1,999",
    image: "/vee.png",
    specs: [
      "3-5 Workflow Automations",
      "API Integrations",
      "Custom Logic",
      "Analytics Dashboard",
      "90-Day Support",
      "2-Week Delivery"
    ],
    stripeLink: "https://buy.stripe.com/your-automation-link-2",
    tier: "professional"
  },
  {
    id: 3,
    name: "Business Automation Suite",
    price: "$4,999",
    image: "/vee.png",
    specs: [
      "Unlimited Workflows",
      "Complete Integration",
      "AI-Powered Logic",
      "Real-time Monitoring",
      "6-Month Support",
      "3-Week Delivery"
    ],
    stripeLink: "https://buy.stripe.com/your-automation-link-3",
    tier: "premium"
  },
  {
    id: 4,
    name: "Custom App Development",
    price: "$7,999+",
    image: "/vee.png",
    specs: [
      "Full-Stack Application",
      "Custom Features",
      "Database Design",
      "Authentication System",
      "1-Year Support",
      "Custom Timeline"
    ],
    stripeLink: "https://buy.stripe.com/your-app-link-1",
    tier: "enterprise"
  }
];

export default function AutomationsPage() {
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
          <Zap size={16} />
          AUTOMATION MARKETPLACE
        </div>
        <h1 className="text-6xl font-black mb-6 text-black" style={{ letterSpacing: '-0.04em', fontWeight: 900 }}>
          Automations & Apps
          <span className="block w-48 h-2 bg-[#0EA5E9] mx-auto mt-4"></span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
          Workflow automation and custom applications that eliminate manual work.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {automationProducts.map((product) => (
          <div
            key={product.id}
            className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_#0a0a0a] hover:shadow-[12px_12px_0_#0a0a0a] transition-all"
          >
            {/* Product Image */}
            <div className="relative w-32 h-32 mx-auto mb-6 border-4 border-black overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>

            {/* Product Info */}
            <h3 className="text-3xl font-black text-black text-center mb-2" style={{ letterSpacing: '-0.03em' }}>
              {product.name}
            </h3>
            <p className="text-4xl font-black text-[#0EA5E9] text-center mb-6" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
              {product.price}
            </p>

            {/* Core Specs */}
            <div className="mb-6 bg-black/5 p-4 border-2 border-black">
              <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3" style={{ letterSpacing: '-0.01em' }}>
                CORE SPECS
              </h4>
              <ul className="space-y-2">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-[#0EA5E9]"></span>
                    <span className="font-medium">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={product.stripeLink}
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

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto text-center border-4 border-black bg-[#F4C430] p-12">
        <h2 className="text-3xl font-black text-black mb-4" style={{ letterSpacing: '-0.03em' }}>
          Need a Custom Solution?
        </h2>
        <p className="text-lg text-black mb-6 font-medium">
          We build automation systems and apps tailored to your exact workflow.
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
