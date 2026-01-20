import { Check, Code, MessageSquare, Users, Cpu } from "lucide-react";

export default function Page() {
  const agents = [
    { title: "Customer Support Agent", icon: MessageSquare, desc: "Answer inquiries, escalate tickets, and summarize conversations for agents." },
    { title: "Coding Assistant", icon: Code, desc: "Autocomplete, lint, and scaffold snippets for your team." },
    { title: "Fitness & Nutrition Agent", icon: Users, desc: "Personalized plans, meal suggestions, and progress tracking." },
    { title: "Email Reply Agent", icon: MessageSquare, desc: "Write, summarize, and prioritize email replies automatically." },
    { title: "AI Companion", icon: Users, desc: "Conversational companion for social and wellbeing interactions." },
    { title: "Business Manager Agent", icon: Cpu, desc: "Run reports, schedule tasks, and help manage operations." },
    { title: "Social Media Agent", icon: MessageSquare, desc: "Draft posts, schedule publishing, and surface top-performing content." },
  ];

  const features = [
    { icon: Check, text: "24/7 availability" },
    { icon: Check, text: "Custom knowledge ingestion" },
    { icon: Check, text: "CRM & calendar integrations" },
    { icon: Check, text: "Human-in-the-loop fallback" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold">AI Agents</h1>
          <p className="mt-3 text-lg text-white/70">Deploy specialized AI agents that automate work, boost conversions, and scale teams.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {agents.map((a) => {
            const Icon = a.icon as any;
            return (
              <article key={a.title} className="rounded-xl border border-white/20 bg-white/5 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-800/30 p-3 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{a.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{a.desc}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <ul className="flex flex-wrap gap-3">
                    {features.slice(0, 3).map((f) => {
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
          <h2 className="text-2xl font-semibold">Why choose our agents?</h2>
          <p className="mt-3 text-white/70">Each agent ships with production-ready connectors, monitoring, and escalation logic so you can safely automate high-impact workflows.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((f) => {
              const FIcon = f.icon as any;
              return (
                <div key={f.text} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/3 p-4">
                  <FIcon className="mt-1 h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium">{f.text}</p>
                    <p className="text-sm text-white/70">Reliable, enterprise-grade implementation included.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
