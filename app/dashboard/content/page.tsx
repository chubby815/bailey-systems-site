import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies, getActivePlan } from "@/lib/auth";
import { ContentMachine } from "@/components/ContentMachine";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login?redirect=/dashboard/content");

  const plan = await getActivePlan(session.email);
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
        <aside className="w-52 border-r border-white/[0.07] min-h-[calc(100vh-57px)] py-6 hidden md:block sticky top-[57px]">
          {[
            { icon: "🌐", label: "My Sites",        href: "/dashboard" },
            { icon: "🎯", label: "Lead Hunter",      href: "/dashboard/leads" },
            { icon: "✍️", label: "Content Machine",  href: "/dashboard/content" },
            { icon: "📊", label: "Usage",            href: "/dashboard/usage" },
            { icon: "💳", label: "Billing",          href: "/dashboard/billing" },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all
                ${i === 2
                  ? "text-[#8b5cf6] bg-[#8b5cf6]/5 border-r-2 border-[#8b5cf6]"
                  : "text-gray-500 hover:text-white hover:bg-white/[0.03]"
                }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </aside>

        {/* Main content — client component */}
        <ContentMachine locked={locked} />
      </div>
    </main>
  );
}
