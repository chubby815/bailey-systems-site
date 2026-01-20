export default function StartProjectPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Start a Project</h1>

      <form className="space-y-6">
        <input
          type="text"
          placeholder="Your name"
          className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
        />

        <select className="w-full p-3 rounded-lg bg-white/10 text-white outline-none">
          <option>Select project type</option>
          <option value="ai-agent">AI Agent</option>
          <option value="website">Website</option>
          <option value="app">App</option>
          <option value="automation">Automation</option>
        </select>

        <textarea
          placeholder="Describe your project..."
          className="w-full p-3 rounded-lg bg-white/10 text-white outline-none h-40"
        />

        <button className="w-full py-3 bg-blue-500 text-black font-semibold rounded-lg hover:bg-blue-400">
          Submit Project
        </button>
      </form>
    </main>
  );
}
