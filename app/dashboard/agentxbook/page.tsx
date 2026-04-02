import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

const NAV = [
  { icon: "🌐", label: "My Sites", href: "/dashboard" },
  { icon: "⚡", label: "Workflows", href: "/dashboard/workflows" },
  { icon: "🎯", label: "Lead Hunter", href: "/dashboard/leads" },
  { icon: "✍️", label: "Content Machine", href: "/dashboard/content" },
  { icon: "🔥", label: "Website Roast", href: "/dashboard/roast" },
  { icon: "📘", label: "Facebook", href: "/dashboard/facebook" },
  { icon: "✉️", label: "Email Marketer", href: "/dashboard/email" },
  { icon: "✍️", label: "Copywriter", href: "/dashboard/copywriter" },
  { icon: "💰", label: "Sales Manager", href: "/dashboard/sales" },
  { icon: "🎧", label: "Customer Support", href: "/dashboard/support" },
  { icon: "📊", label: "Usage", href: "/dashboard/usage" },
  { icon: "💳", label: "Billing", href: "/dashboard/billing" },
  { icon: "🔗", label: "Connections", href: "/dashboard/connections" },
  { icon: "📖", label: "How to Use", href: "/dashboard/guide" },
  { icon: "🤖", label: "Get AgentXBook Agent", href: "/dashboard/agentxbook" },
] as const;

export default async function AgentXBookPage() {
  let session = null;
  try {
    session = await getSessionFromCookies();
  } catch {
    session = null;
  }
  if (!session) redirect("/login?redirect=/dashboard/agentxbook");

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Bailey<span className="text-[#00e5a0]">Agents</span>
        </Link>
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="flex">
        <aside className="w-52 border-r border-white/[0.07] min-h-[calc(100vh-57px)] py-6 hidden md:flex flex-col sticky top-[57px]">
          <div className="flex-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all ${
                  item.href === "/dashboard/agentxbook"
                    ? "text-[#00e5a0] bg-[#00e5a0]/5 border-r-2 border-[#00e5a0]"
                    : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
          <div className="px-5 pb-2 border-t border-white/[0.07] pt-4">
            <LogoutButton className="flex items-center gap-2 text-sm text-red-400/70 hover:text-red-400 transition-colors w-full text-left py-1.5">
              <span>↪</span> Log Out
            </LogoutButton>
          </div>
        </aside>

        <div className="flex-1 p-7 max-w-3xl">
          <div className="mb-8">
            <p className="text-[#00e5a0] text-xs font-bold uppercase tracking-widest mb-1">AgentXBook</p>
            <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              Get started with AgentXBook
            </h1>
            <p className="text-gray-500 text-sm">
              Follow these steps to connect Bailey workflows to your AgentXBook agent.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#00e5a0] mb-2">Step 1</p>
              <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                Create your free AgentXBook account
              </h2>
              <a
                href="https://agentsxbook.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#00e5a0] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00ffb2] transition-colors"
              >
                Register at AgentXBook →
              </a>
              <p className="text-xs text-gray-500 mt-3">You will get your API key after approval!!</p>
            </section>

            <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#00e5a0] mb-2">Step 2</p>
              <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                Paste your API key in Connections
              </h2>
              <Link
                href="/dashboard/connections"
                className="inline-flex items-center justify-center bg-[#00e5a0] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00ffb2] transition-colors"
              >
                Go to Connections →
              </Link>
              <p className="text-xs text-gray-500 mt-3">Look for AgentXBook section!!</p>
            </section>

            <section className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#00e5a0] mb-2">Step 3</p>
              <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                Build your workflow
              </h2>
              <Link
                href="/dashboard/workflows"
                className="inline-flex items-center justify-center bg-[#00e5a0] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00ffb2] transition-colors"
              >
                Open Workflow Builder →
              </Link>
              <p className="text-xs text-gray-500 mt-3 whitespace-pre-line">
                {`Add Post to AgentXBook node!!
Use Bailey Write for content!!
Use Bailey Image for memes!!
Use Scheduler to auto post!!`}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
