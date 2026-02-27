import Image from "next/image";
import { Hero } from "@/components/Hero";
import ReviewCard from "@/components/ReviewCard";
import { BentoGrid } from "@/components/BentoGrid";
import { STRIPE_LINKS } from "@/lib/stripe-links";

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
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto mb-32 w-full">
        <h2 className="text-4xl font-bold text-center mb-4">Pricing</h2>
        <p className="text-center text-gray-500 mb-12">Transparent pricing. No surprises.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Starter */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Starter</div>
            <div className="text-4xl font-black mb-1">$149</div>
            <div className="text-sm text-gray-500 mb-1">One-time</div>
            <div className="text-xs text-[#00c48c] font-bold mb-6">🎁 1 year hosting included</div>
            <ul className="text-sm text-gray-600 space-y-2 flex-1 mb-6">
              <li>✅ Custom one-page site</li>
              <li>✅ Mobile optimized</li>
              <li>✅ Contact form</li>
              <li>✅ SEO basics</li>
              <li>✅ 1 year hosting included</li>
            </ul>
            <a
              href={STRIPE_LINKS.starter}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white text-center py-3 rounded-xl font-bold hover:bg-gray-800 transition block"
            >
              Get Started
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">🔒 Secure checkout via Stripe</p>
          </div>

          {/* Basic */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Basic</div>
            <div className="text-4xl font-black mb-1">$300</div>
            <div className="text-sm text-gray-500 mb-6">One-time</div>
            <ul className="text-sm text-gray-600 space-y-2 flex-1 mb-6">
              <li>✅ Custom website (up to 5 pages)</li>
              <li>✅ Mobile responsive</li>
              <li>✅ Contact form</li>
              <li>✅ SEO basics</li>
              <li>✅ Delivered in 7 days</li>
            </ul>
            <a href={STRIPE_LINKS.basic}
               target="_blank"
               rel="noopener noreferrer"
               className="bg-black text-white text-center py-3 rounded-xl font-bold hover:bg-gray-800 transition block">
              Get Started
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">🔒 Secure checkout via Stripe</p>
          </div>

          {/* Edits */}
          <div className="border-2 border-blue-200 rounded-2xl p-6 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Edits</div>
            <div className="text-4xl font-black mb-1">$75</div>
            <div className="text-sm text-gray-500 mb-6">Per session</div>
            <ul className="text-sm text-gray-600 space-y-2 flex-1 mb-6">
              <li>✅ Text &amp; content updates</li>
              <li>✅ Design tweaks</li>
              <li>✅ New page or section</li>
              <li>✅ Bug fixes</li>
              <li>✅ Turnaround within 48hrs</li>
            </ul>
            <a href={STRIPE_LINKS.edits}
               target="_blank"
               rel="noopener noreferrer"
               className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition block">
              Book Edits
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">🔒 Secure checkout via Stripe</p>
          </div>

          {/* Pro */}
          <div className="border-2 border-[#00c48c] rounded-2xl p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00c48c] text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#00c48c] mb-2">Pro</div>
            <div className="text-4xl font-black mb-1">$500</div>
            <div className="text-sm text-gray-500 mb-6">One-time</div>
            <ul className="text-sm text-gray-600 space-y-2 flex-1 mb-6">
              <li>✅ Everything in Basic</li>
              <li>✅ AI chatbot integration</li>
              <li>✅ Custom chatbot training</li>
              <li>✅ Live chat widget</li>
              <li>✅ 1 month free edits</li>
            </ul>
            <a href={STRIPE_LINKS.pro}
               target="_blank"
               rel="noopener noreferrer"
               className="bg-[#00c48c] text-black text-center py-3 rounded-xl font-bold hover:bg-[#00a876] transition block">
              Get Pro
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">🔒 Secure checkout via Stripe</p>
          </div>

        </div>

        {/* Bailey Pro + Elite subscription cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Bailey Pro subscription */}
          <div className="border-2 border-purple-400 rounded-2xl p-6 flex flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Bailey Pro</div>
            <div className="text-4xl font-black mb-1">$4.99<span className="text-lg font-normal text-gray-400">/mo</span></div>
            <div className="text-sm text-gray-500 mb-6">Cancel anytime</div>
            <ul className="text-sm text-gray-600 space-y-2 flex-1 mb-6">
              <li>✅ 20 messages per day</li>
              <li>✅ 2 AI images per day (DALL-E 3)</li>
              <li>✅ Powered by Claude Sonnet</li>
              <li>✅ Code generation</li>
              <li>✅ Ask literally anything</li>
            </ul>
            <a href={STRIPE_LINKS.proMonthly} target="_blank" rel="noopener noreferrer"
               className="bg-purple-600 text-white text-center py-3 rounded-xl font-bold hover:bg-purple-500 transition block">
              Start Bailey Pro
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">🔒 Secure checkout via Stripe</p>
          </div>

          {/* Bailey Elite subscription */}
          <div className="border-2 border-yellow-400 rounded-2xl p-6 flex flex-col bg-black text-white relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
              MOST POWERFUL
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-2">Bailey Elite</div>
            <div className="text-4xl font-black mb-1 text-yellow-400">$19.99<span className="text-lg font-normal text-gray-400">/mo</span></div>
            <div className="text-sm text-gray-500 mb-6">Cancel anytime</div>
            <ul className="text-sm text-gray-300 space-y-2 flex-1 mb-6">
              <li>✅ 100 messages per day</li>
              <li>✅ 3 AI images per day (DALL-E 3)</li>
              <li>✅ Powered by Claude Sonnet</li>
              <li>✅ Code generation</li>
              <li>✅ Priority everything</li>
              <li>✅ Ask literally anything</li>
            </ul>
            <a href={STRIPE_LINKS.eliteMonthly} target="_blank" rel="noopener noreferrer"
               className="bg-yellow-400 text-black text-center py-3 rounded-xl font-bold hover:bg-white transition block">
              Join Bailey Elite 👑
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">🔒 Secure checkout via Stripe</p>
          </div>

        </div>

        {/* Premium — centered below all cards */}
        <div className="flex justify-center mt-6">
          <div className="border-2 border-yellow-400 rounded-2xl p-6 flex flex-col bg-black text-white w-full max-w-xs">
            <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-2">Premium</div>
            <div className="text-4xl font-black mb-1 text-yellow-400">Custom</div>
            <div className="text-sm text-gray-400 mb-6">Starting at $1,200</div>
            <ul className="text-sm text-gray-300 space-y-2 flex-1 mb-6">
              <li>✅ Full custom website</li>
              <li>✅ AI agents &amp; automation</li>
              <li>✅ Custom chatbots</li>
              <li>✅ Chatbot edits — $75/session</li>
              <li>✅ AI agent edits — $125/session</li>
              <li>✅ Ongoing priority support</li>
            </ul>
            <a href="mailto:Lilianajs27@gmail.com?subject=Premium Plan Inquiry"
               className="bg-yellow-400 text-black text-center py-3 rounded-xl font-bold hover:bg-yellow-300 transition block">
              Contact Us
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">Custom quote — we'll reach out within 24hrs</p>
          </div>
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

      <div className="mt-10 text-center">
        <a
          href="https://www.baileysystemsai.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bailey-glow text-lg font-semibold tracking-wide"
        >
          Built by www.baileysystemsai.com
        </a>
      </div>

    </main>
  );
}
