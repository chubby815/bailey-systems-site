export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Templates</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Website Templates
          </h2>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Business Website</li>
            <li>• Restaurant Template</li>
            <li>• Portfolio</li>
            <li>• Booking Site</li>
          </ul>
        </div>

        <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-white">
            App Templates
          </h2>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Receipt Scanner App</li>
            <li>• Fitness App</li>
            <li>• Chat App</li>
            <li>• Dashboard</li>
          </ul>
        </div>

        <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-white">
            AI Agent Templates
          </h2>
          <ul className="text-white/70 text-sm space-y-2">
            <li>• Support Bot</li>
            <li>• Email Agent</li>
            <li>• Fitness Agent</li>
            <li>• Coding Agent</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
