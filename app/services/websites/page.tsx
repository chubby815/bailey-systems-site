import { Globe, Monitor, ShoppingCart, Code, Star } from "lucide-react";

export default function Page() {
  const sites = [
    { title: "Business Websites", icon: Globe, desc: "Conversion-first layouts for service businesses and agencies." },
    { title: "Restaurant Websites", icon: Monitor, desc: "Menus, reservations, and local SEO optimised pages." },
    { title: "Personal Portfolios", icon: Star, desc: "Beautiful profile pages for creators and professionals." },
    { title: "AI-powered Websites", icon: Code, desc: "Dynamic content generation and personalization with AI." },
    { title: "Fitness Coaching Sites", icon: Globe, desc: "Class schedules, bookings, and client portals." },
    { title: "E-commerce Stores", icon: ShoppingCart, desc: "Fast stores with checkout, inventory, and analytics." },
  ];

  const features = [
    { icon: Star, text: "Fast performance" },
    { icon: Globe, text: "SEO optimized" },
    { icon: Monitor, text: "Responsive across devices" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold">Websites</h1>
          <p className="mt-3 text-lg text-white/70">Beautiful, performant websites tailored for your business and growth goals.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sites.map((s) => {
            const Icon = s.icon as any;
            return (
              <article key={s.title} className="rounded-xl border border-white/20 bg-white/5 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-800/30 p-3 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{s.desc}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <ul className="flex gap-3">
                    {features.map((f) => {
                      const FIcon = f.icon as any;
                      return (
                        <li key={f.text} className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-1 text-sm">
                          <FIcon className="h-4 w-4 text-blue-400" />
                          <span className="text-white/80">{f.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <a href="/order" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700">Starting at $29.99</a>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-12 rounded-xl border border-white/20 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">Designed for conversion</h2>
          <p className="mt-3 text-white/70">Every site ships responsive, accessible, and optimized for search — with analytics and simple editing workflows.</p>
        </section>
      </div>
    </section>
  );
}
