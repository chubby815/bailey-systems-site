import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookies, getActivePlan } from "@/lib/auth";
import EmailClient from "./EmailClient";

export const dynamic = "force-dynamic";

export default async function EmailMarketerPage() {
  let session = null;
  try { session = await getSessionFromCookies(); } catch { session = null; }
  if (!session) redirect("/login?redirect=/dashboard/email");

  const plan = await getActivePlan(session.email).catch(() => null);
  if (!plan) redirect("/pricing?reason=subscription_required");

  if (plan === "starter") {
    return (
      <main className="min-h-screen bg-[#08090a] text-white">
        <header className="border-b border-white/[0.07] bg-[#111214] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <Link href="/" className="font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Bailey<span className="text-[#00e5a0]">Agents</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-[#6b7280] hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </header>
        <div className="max-w-lg mx-auto px-6 py-16 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-black mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            Email Marketer
          </h1>
          <p className="text-[#6b7280] mb-8">
            This agent is available on Growth and Pro plans.
          </p>
          <ul className="text-left space-y-2 max-w-sm mx-auto text-sm text-[#9ca3af] mb-8">
            <li className="flex items-center gap-2"><span className="text-[#00e5a0]">✓</span> Cold outreach emails</li>
            <li className="flex items-center gap-2"><span className="text-[#00e5a0]">✓</span> Follow-up sequences</li>
            <li className="flex items-center gap-2"><span className="text-[#00e5a0]">✓</span> Newsletter campaigns</li>
          </ul>
          <Link
            href="/dashboard/billing"
            className="inline-block bg-[#00e5a0] hover:bg-[#00ffb2] text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Upgrade to Growth →
          </Link>
        </div>
      </main>
    );
  }

  return <EmailClient />;
}
