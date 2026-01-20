export default function PricingPage() {
  return (
    <div className="py-16 px-4 text-white">
      <h1 className="text-4xl font-bold mb-8">Pricing</h1>

      <p className="text-lg mb-10 max-w-2xl">
        Choose the plan that fits your needs. Bailey Systems AI gives you the
        tools to automate your business, build AI agents, create websites, apps,
        and more.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* BASIC PLAN */}
        <div className="border border-white/20 rounded-2xl p-8 bg-black">
          <h2 className="text-3xl font-semibold mb-4">Basic</h2>
          <p className="text-gray-300 mb-6">
            Perfect for individuals or small businesses starting with AI tools.
          </p>

          <ul className="space-y-2 text-gray-300 mb-6">
            <li>• 1 Custom AI Agent</li>
            <li>• 1 Website Template</li>
            <li>• Basic automations</li>
            <li>• Email support</li>
          </ul>

          <div className="text-4xl font-bold mb-6">$19.99/mo</div>

          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-lg">
            Choose Basic
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="border border-white/20 rounded-2xl p-8 bg-black">
          <h2 className="text-3xl font-semibold mb-4">Pro</h2>
          <p className="text-gray-300 mb-6">
            Full power of Bailey Systems. Ideal for creators, developers, and
            businesses.
          </p>

          <ul className="space-y-2 text-gray-300 mb-6">
            <li>• Unlimited AI Agents</li>
            <li>• Unlimited Websites + Apps</li>
            <li>• Advanced Automations</li>
            <li>• Priority support</li>
            <li>• Business tools</li>
          </ul>

          <div className="text-4xl font-bold mb-6">$49.99/mo</div>

          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-lg">
            Choose Pro
          </button>
        </div>
      </div>
    </div>
  );
}
