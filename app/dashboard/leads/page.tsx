import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies, getActivePlan } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { LeadsAgent } from "@/components/LeadsAgent";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  let session = null;
  try { session = await getSessionFromCookies(); } catch { session = null; }
  if (!session) redirect("/login?redirect=/dashboard/leads");

  const plan = await getActivePlan(session.email).catch(() => null);
  if (!plan) redirect("/pricing?reason=subscription_required");

  const locked = plan !== "pro";

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
          Bailey<span className="text-[#00e5a0]">Systems</span>AI
        </Link>
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-white/[0.07] min-h-[calc(100vh-57px)] py-6 hidden md:flex flex-col sticky top-[57px]">
          <div className="flex-1">
            {[
              { icon: "🌐", label: "My Sites",        href: "/dashboard" },
              { icon: "🎯", label: "Lead Hunter",     href: "/dashboard/leads" },
              { icon: "✍️", label: "Content Machine", href: "/dashboard/content" },
              { icon: "📊", label: "Usage",           href: "/dashboard/usage" },
              { icon: "💳", label: "Billing",         href: "/dashboard/billing" },
              { icon: "🤖", label: "Get AgentXBook Agent", href: "/dashboard/agentxbook" },
            ].map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all
                  ${i === 1
                    ? "text-[#3b82f6] bg-[#3b82f6]/5 border-r-2 border-[#3b82f6]"
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

        {/* Main content — client component handles all interactivity */}
        <LeadsAgent locked={locked} />
      </div>
    </main>
  );
}
