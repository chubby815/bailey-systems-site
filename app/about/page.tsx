export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Me</h1>

      <p className="text-white/70 mb-6">
        My name is{" "}
        <span className="text-white font-semibold">Javier Sandoval</span>. I’m a
        software engineer who builds AI agents, websites, apps, automations, and
        full digital systems for businesses and creators.
      </p>

      <p className="text-white/70 mb-6">
        My work combines engineering and artificial intelligence to help people
        automate their operations, scale faster, and build smarter digital
        tools.
      </p>

      {/* SKILLS */}
      <h2 className="text-2xl font-semibold mt-10 mb-3">Skills</h2>

      <ul className="text-white/80 space-y-2">
        <li>• AI Agent Engineering</li>
        <li>• Website Development (Next.js)</li>
        <li>• App Development</li>
        <li>• Automation / Python</li>
        <li>• Workflow Systems</li>
        <li>• API Integrations</li>
      </ul>

      {/* AI AGENTS I BUILD */}
      <h2 className="text-2xl font-semibold mt-12 mb-3">AI Agents I Build</h2>

      <p className="text-white/70 mb-4">
        I design custom intelligent agents that can replace or assist full
        teams. Here are some of the agents I create:
      </p>

      <ul className="text-white/80 space-y-3">
        <li>
          <span className="text-white font-semibold">
            Customer Support Agent
          </span>
          <br />
          Books appointments, answers questions, handles support conversations.
        </li>

        <li>
          <span className="text-white font-semibold">Coding Assistant</span>
          <br />
          Writes code, debugs errors, builds features, and helps with
          development tasks.
        </li>

        <li>
          <span className="text-white font-semibold">
            Fitness & Nutrition Agent
          </span>
          <br />
          Builds custom workouts, meal plans, calorie tracking, macros, and
          daily health support.
        </li>

        <li>
          <span className="text-white font-semibold">Email Reply Agent</span>
          <br />
          Reads your inbox, drafts replies, manages email workflows
          automatically.
        </li>

        <li>
          <span className="text-white font-semibold">Sales & Lead Agent</span>
          <br />
          Replies to prospects, sends follow-ups, captures leads, and books
          calls.
        </li>

        <li>
          <span className="text-white font-semibold">Automation Agent</span>
          <br />
          Handles repetitive tasks, data entry, workflows, scheduling, and
          business automation.
        </li>

        <li>
          <span className="text-white font-semibold">
            BF / GF Companion Agent
          </span>
          <br />A personalized relationship-style companion agent that talks,
          listens, gives emotional support, remembers details about the user,
          and stays in character.
        </li>

        <li>
          <span className="text-white font-semibold">
            Custom Personality Agents
          </span>
          <br />
          Any character, coach, assistant, mentor, or unique role — fully
          customized to your needs.
        </li>
      </ul>
    </main>
  );
}
