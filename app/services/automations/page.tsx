import { Mail, MessageSquare, Calendar, FileText, Repeat, Sparkles } from "lucide-react";

export default function Page() {
  const items = [
    { title: "SMS Automations", icon: MessageSquare, desc: "Automate transactional and campaign SMS with delivery tracking." },
    { title: "Email Sequences", icon: Mail, desc: "Multi-step email flows with personalization and analytics." },
    { title: "Appointment Systems", icon: Calendar, desc: "Booking pages, reminders, and calendar sync." },
    { title: "CRM Workflows", icon: Repeat, desc: "Trigger actions, update records, and auto-assign leads." },
    { title: "Auto-replies", icon: MessageSquare, desc: "Context-aware auto-responders for chat and email." },
    { title: "PDF Generation", icon: FileText, desc: "Programmatic PDF creation for invoices, reports, and receipts." },
    { title: "AI Agent Daily Tasks", icon: Sparkles, desc: "Recurring routines that keep your agents healthy and up-to-date." },
  ];

  const features = [
    { icon: Mail, text: "Reliable delivery" },
    { icon: Calendar, text: "Calendar integrations" },
    { icon: Repeat, text: "Scheduling & retries" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold">Automations</h1>
          <p className="mt-3 text-lg text-white/70">Automate repetitive tasks across SMS, email, CRM and documents to let your team focus on high-value work.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((i) => {
            const Icon = i.icon as any;
            return (
              <article key={i.title} className="rounded-xl border border-white/20 bg-white/5 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-800/30 p-3 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{i.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{i.desc}</p>
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
          <h2 className="text-2xl font-semibold">Automations that scale</h2>
          <p className="mt-3 text-white/70">From simple autoresponders to multi-step orchestration, we ship automations with observability, retries, and human handoff points.</p>
        </section>
      </div>
    </section>
  );
}
