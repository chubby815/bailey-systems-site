import Image from "next/image";
import Link from "next/link";
import { HERO_MARKERS, STATS } from "@/utils/constants";
import { Button } from "./Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-4 border-black bg-white p-8 shadow-[12px_12px_0_#0a0a0a] md:p-16">
      <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 text-black">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-[#F4C430] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black">
            <span className="h-2 w-2 bg-black" />
            AI-powered systems
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Custom AI agents and websites for modern businesses.
            </h1>
            <p className="text-xl text-black/70 md:text-2xl leading-relaxed">
              Production-ready software that handles real work. AI agents, custom websites, 
              and automation tools built to solve actual problems.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="#pricing">Start a project</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="#about">Learn more</Link>
            </Button>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="border-4 border-black bg-white/50 p-4"
              >
                <dt className="text-sm text-black/60 font-semibold uppercase tracking-wide">{stat.label}</dt>
                <dd className="text-3xl font-bold text-black mt-1 relative inline-block">
                  {stat.value}
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#F4C430]"></span>
                </dd>
                <p className="text-xs text-black/50 mt-2">{stat.detail}</p>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="relative border-4 border-black bg-white p-0 shadow-[8px_8px_0_#0a0a0a] overflow-hidden">
            <Image
              src="/profile-photo.jpg"
              alt="Javier Sandoval - Software Engineer"
              width={600}
              height={700}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
