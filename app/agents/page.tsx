export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">AI Agents I Build</h1>

      <div className="space-y-8">
        <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold">Customer Support Agent</h2>
          <p className="text-white/70 mt-2">
            Books appointments, answers questions, handles support.
          </p>
        </div>

        <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold">Coding Assistant</h2>
          <p className="text-white/70 mt-2">
            Writes code, debugs errors, builds features.
          </p>
        </div>

        <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold">Fitness & Nutrition Agent</h2>
          <p className="text-white/70 mt-2">
            Custom workouts, meal plans, health tracking.
          </p>
        </div>

        <div className="border border-white/10 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold">Email Reply Agent</h2>
          <p className="text-white/70 mt-2">
            Reads inbox + drafts replies automatically.
          </p>
        </div>
      </div>
    </main>
  );
}
