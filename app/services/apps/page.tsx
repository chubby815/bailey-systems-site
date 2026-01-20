import { Smartphone, Zap, MessageSquare, Layers, Code, Activity } from "lucide-react";

export default function Page() {
  const apps = [
    { title: "iOS & Android Apps", icon: Smartphone, desc: "Native-like experiences and app store support." },
    { title: "Fitness Apps", icon: Activity, desc: "Track workouts, subscriptions, and coaching plans." },
    { title: "Social Apps", icon: MessageSquare, desc: "Feeds, DMs, and engagement tools." },
    { title: "AI Chat Apps", icon: Zap, desc: "Integrated chat with persistent memory and personalization." },
    { title: "Workflow Tools", icon: Layers, desc: "Task orchestration, approvals, and automation." },
    { title: "Custom SaaS Apps", icon: Code, desc: "Bespoke SaaS with billing, roles, and analytics." },
  ];

  const features = [
    { icon: Zap, text: "Push notifications" },
    { icon: Smartphone, text: "Offline support" },
    { icon: Code, text: "Scalable backend" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold">Apps</h1>
          <p className="mt-3 text-lg text-white/70">Build delightful mobile and web apps that engage customers and drive retention.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {apps.map((s) => {
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
          <h2 className="text-2xl font-semibold">App launches done right</h2>
          <p className="mt-3 text-white/70">We ship apps with telemetry, build pipelines, and app store-ready artifacts so your launch is smooth and fast.</p>
        </section>
      </div>
    </section>
  );
}
