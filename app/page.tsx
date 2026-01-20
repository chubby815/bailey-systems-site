import { Hero } from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { PricingCard } from "@/components/PricingCard";
import ReviewCard from "@/components/ReviewCard";
import { PRICING_PLANS } from "@/utils/constants";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4 py-16 text-black bg-[#faf9f6]">
      {/* HERO SECTION */}
      <section className="w-full max-w-6xl mb-32">
        <Hero />
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#F4C430] mb-32"></div>

      {/* SERVICES PREVIEW */}
      <section
        id="services"
        className="w-full max-w-6xl text-center mb-32"
      >
        <div className="space-y-6 mb-12">
          <h2 className="text-5xl font-bold tracking-tight relative inline-block">
            Our AI Services
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
          </h2>
          <p className="text-xl text-black/70 max-w-2xl mx-auto">
            Choose from custom AI Agents, Websites, Apps, and Automations built
            just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title="AI Agents"
            description="Custom AI workers: customer support, coding agents, fitness coach, sales agents and more."
          />

          <ServiceCard
            title="Websites"
            description="Fast, modern, and optimized websites built with Next.js, Tailwind, and AI automation."
          />

          <ServiceCard
            title="Apps"
            description="Mobile and desktop apps powered by smart AI features and automation."
          />
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#F4C430] mb-32"></div>

      {/* ABOUT THE TEAM */}
      <section id="about" className="w-full max-w-4xl mb-32">
        <div className="border-4 border-black bg-white p-12 shadow-[12px_12px_0_#0a0a0a]">
          <h2 className="text-5xl font-bold tracking-tight text-center mb-10 relative inline-block w-full">
            About the Team
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#F4C430]"></span>
          </h2>
          <div className="space-y-6 text-lg text-black/80 leading-relaxed">
            <p>
              My name is Javier Sandoval. I work alongside a small team of experienced software engineers and media specialists to design and build modern digital products for businesses.
            </p>
            <p>
              Based in Machesney Park, Illinois, my background spans Computer Science and Criminal Justice. Over the years, we've built and shipped custom websites, applications, and AI-powered tools for modern businesses. Our work includes automation systems, internal tools, and production-ready platforms that handle real traffic and real users.
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
      <div className="w-full max-w-6xl h-2 bg-[#F4C430] mb-32"></div>

      {/* PRICING */}
      <section id="pricing" className="w-full max-w-6xl mb-32">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold tracking-tight relative inline-block mb-6">
            Pricing
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
          </h2>
          <p className="text-xl text-black/70 max-w-2xl mx-auto">
            Projects typically start at $1,200. Clear pricing, no hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.title} plan={plan} />
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full max-w-6xl h-2 bg-[#F4C430] mb-32"></div>

      {/* TESTIMONIALS */}
      <section id="reviews" className="w-full max-w-6xl text-center mb-20">
        <h2 className="text-5xl font-bold tracking-tight relative inline-block mb-12">
          What People Are Saying
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
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
      <div className="w-full max-w-6xl h-2 bg-[#F4C430] mb-32"></div>

      {/* CONTACT */}
      <section id="contact" className="w-full max-w-4xl mb-20">
        <div className="border-4 border-black bg-white p-12 shadow-[12px_12px_0_#0a0a0a] text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-10 relative inline-block">
            Get In Touch
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
          </h2>
          <p className="text-xl text-black/70 mb-8 leading-relaxed">
            Ready to start a project? Reach out and I'll get back to you within 24 hours.
          </p>
          <div className="space-y-4 text-lg">
            <p>
              <span className="font-bold text-black">Email:</span>{" "}
              <a
                href="mailto:Lilianajs27@gmail.com"
                className="text-black hover:text-[#F4C430] transition-colors font-semibold"
              >
                Lilianajs27@gmail.com
              </a>
            </p>
            <p>
              <span className="font-bold text-black">Phone:</span>{" "}
              <a
                href="tel:7798958325"
                className="text-black hover:text-[#F4C430] transition-colors font-semibold"
              >
                779-895-8325
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
