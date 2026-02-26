import Image from "next/image";
import { Hero } from "@/components/Hero";
import { PricingCard } from "@/components/PricingCard";
import ReviewCard from "@/components/ReviewCard";
import { PRICING_PLANS } from "@/utils/constants";
import { BentoGrid } from "@/components/BentoGrid";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4 py-16 text-black bg-[#faf9f6]">
      {/* HERO SECTION */}
      <section className="w-full max-w-6xl mb-32">
        <Hero />
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#0EA5E9] mb-32"></div>

      {/* BENTO GRID: Services, Team & Map */}
      <BentoGrid />

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#0EA5E9] mb-32"></div>

      {/* 3D STORE CTA */}
      <section className="w-full max-w-4xl mb-32">
        <div className="border-4 border-black bg-black p-12 shadow-[12px_12px_0_#0a0a0a] text-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/10 to-transparent animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 border-2 border-[#00ff41] bg-[#00ff41]/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#00ff41] mb-6">
              <span className="w-2 h-2 bg-[#00ff41] animate-pulse rounded-full" />
              IMMERSIVE EXPERIENCE
            </div>
            
            <h2 className="text-5xl font-black mb-6 text-[#00ff41]" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.03em', fontWeight: 900 }}>
              ENTER 3D STORE
            </h2>
            
            <p className="text-xl text-[#00ff41]/80 mb-8 leading-relaxed font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}>
              Walk through our virtual showroom. Interact with products. Meet Vee in 3D.
            </p>

            <a
              href="/store"
              className="inline-block px-12 py-5 bg-[#00ff41] text-black border-4 border-[#00ff41] font-black uppercase text-lg shadow-[0_0_30px_rgba(0,255,65,0.6)] hover:bg-transparent hover:text-[#00ff41] transition-all"
              style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}
            >
              🎮 LAUNCH EXPERIENCE
            </a>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#00ff41]/60" style={{ fontFamily: 'Courier New, Monaco, monospace' }}>
              <span>✓ WebGL Enabled</span>
              <span>✓ Mouse Interactive</span>
              <span>✓ Full 3D Environment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#0EA5E9] mb-32"></div>

      {/* ABOUT */}
      <section id="about" className="w-full max-w-4xl mb-32">
        <div className="border-4 border-black bg-white p-12 shadow-[12px_12px_0_#0a0a0a]">
          <h2 className="text-5xl font-black text-center mb-10 relative inline-block w-full" style={{ letterSpacing: '-0.03em', fontWeight: 900 }}>
            About Us
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#0EA5E9]"></span>
          </h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
            <p>
              We work alongside a small team of experienced software engineers and media specialists to design and build modern digital products for businesses.
            </p>
            <p>
              We focus on projects that actually get used — not demos or experiments. From customer-facing websites to backend automation that removes manual work from daily operations, our emphasis is on real-world delivery, performance, and reliability.
            </p>
            <p>
              Our approach is straightforward: build things that solve actual problems. Clean code, reliable systems, and tools that make your work easier. No hype, no buzzwords, just functional software supported by a tight, experienced team.
            </p>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#0EA5E9] mb-32"></div>

      {/* PRICING */}
      <section id="pricing" className="w-full max-w-6xl mb-32">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black relative inline-block mb-6" style={{ letterSpacing: '-0.03em', fontWeight: 900 }}>
            Pricing
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#0EA5E9]"></span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Transparent investment models designed for immediate ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.title} plan={plan} />
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#0EA5E9] mb-32"></div>

      {/* TESTIMONIALS */}
      <section id="reviews" className="w-full max-w-6xl text-center mb-20">
        <h2 className="text-5xl font-black relative inline-block mb-12" style={{ letterSpacing: '-0.03em', fontWeight: 900 }}>
          What People Are Saying
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#0EA5E9]"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReviewCard
            name="Michael R."
            quote="Bailey Systems AI built me a custom AI assistant that handles all my customer service. Game changer!"
          />

          <ReviewCard
            name="Sarah K."
            quote="The automation they built saves me 2 hours a day. Worth every cent."
          />

          <ReviewCard
            name="Tony L."
            quote="The website + AI agent combo doubled my business leads in a week."
          />
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#0EA5E9] mb-32"></div>

      {/* CONTACT */}
      <section id="contact" className="w-full max-w-4xl mb-20">
        <div className="border-4 border-black bg-white p-12 shadow-[12px_12px_0_#0a0a0a] text-center">
          <h2 className="text-5xl font-black mb-10 relative inline-block" style={{ letterSpacing: '-0.03em', fontWeight: 900 }}>
            📞 Get In Touch
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#0EA5E9]"></span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
            Ready to start a project? Reach out and I'll get back to you within 24 hours.
          </p>
          <div className="space-y-4 text-lg">
            <p>
              <span className="font-bold text-black">Email:</span>{" "}
              <a
                href="mailto:Lilianajs27@gmail.com"
                className="text-black hover:text-[#0EA5E9] transition-colors font-bold underline"
              >
                Lilianajs27@gmail.com
              </a>
            </p>
            <p>
              <span className="font-bold text-black">Phone:</span>{" "}
              <a
                href="tel:+17798956325"
                className="text-black hover:text-[#0EA5E9] transition-colors font-bold underline cursor-pointer"
              >
                779-895-6325
              </a>
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
