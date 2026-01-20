export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-lg mx-auto">
      <h1 className="text-4xl font-bold mb-8">Contact</h1>

      <p className="text-white/70 mb-6">
        Reach out anytime. I usually reply within the same day.
      </p>

      <div className="space-y-2 mb-10">
        <p className="text-white/80 text-sm">
          <span className="font-semibold text-white">Email:</span>
          <a
            href="mailto:Lilianajs27@gmail.com"
            className="text-blue-400 hover:underline ml-1"
          >
            Lilianajs27@gmail.com
          </a>
        </p>

        <p className="text-white/80 text-sm">
          <span className="font-semibold text-white">Phone:</span>
          <a
            href="tel:7798958325"
            className="text-blue-400 hover:underline ml-1"
          >
            779-895-8325
          </a>
        </p>
      </div>

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

        <textarea
          placeholder="Tell me about your project…"
          className="w-full p-3 rounded-lg bg-white/10 text-white outline-none h-40"
        />

        <button className="w-full py-3 bg-blue-500 text-black font-semibold rounded-lg hover:bg-blue-400">
          Submit
        </button>
      </form>
    </main>
  );
}
