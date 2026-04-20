import { Suspense } from "react";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { getSessionFromCookies } from "@/lib/auth";

// Render dynamically — reads query params
export const dynamic = "force-dynamic";

async function ThankYouContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let planName = "your plan";
  let isSubscription = false;
  let customerEmail = "";

  // If Stripe session ID is present, fetch session details
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });

      isSubscription = session.mode === "subscription";
      customerEmail = session.customer_details?.email ?? "";
      const plan = session.metadata?.plan;
      if (plan) {
        planName = plan.charAt(0).toUpperCase() + plan.slice(1);
      }
    } catch (err) {
      console.error("[thank-you] stripe session fetch error:", err);
      // Non-fatal — degrade gracefully
    }
  }

  // If the user lost their session between Stripe checkout and the redirect
  // back here (e.g. paid in a fresh tab / incognito), don't pretend they're
  // logged in. Tell them to log in to access their dashboard.
  const userSession = await getSessionFromCookies();
  const hasSession = !!userSession?.email;

  return (
    <main className="min-h-screen bg-[#08090a] text-white flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00e5a0]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative text-center max-w-lg">
        <div className="text-6xl mb-6">🎉</div>

        <div className="inline-flex items-center gap-2 bg-[#00e5a0]/10 border border-[#00e5a0]/20 text-[#00e5a0] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
          {isSubscription ? "Subscription Active" : "Payment Confirmed"}
        </div>

        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Welcome to Bailey Agents
        </h1>

        <p className="text-gray-400 text-lg mb-2">
          {isSubscription
            ? `Your ${planName} plan is now active.`
            : "Your purchase was successful."}
        </p>

        {customerEmail && (
          <p className="text-gray-600 text-sm mb-8">
            Confirmation sent to <span className="text-gray-400">{customerEmail}</span>
          </p>
        )}

        {/* Logged-out notice — paid in a different session, must log in to access */}
        {!hasSession && (
          <div className="bg-[#0066ff]/10 border border-[#0066ff]/30 text-[#9ec5ff] rounded-2xl px-6 py-5 mb-8 text-sm leading-relaxed">
            <div className="font-semibold text-white mb-1">
              Subscription paid — log in to access your dashboard
            </div>
            We received your payment, but you&apos;re not logged in on this
            device. Sign in with the email you used at checkout to unlock your
            plan.
          </div>
        )}

        {/* Getting started checklist */}
        {isSubscription && hasSession && (
          <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-6 mb-8 text-left">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
              Getting Started
            </div>
            <div className="flex flex-col gap-3">
              {[
                { step: "1", label: "Build your first AI website", active: true },
                { step: "2", label: "Hunt your first 10 leads", active: false },
                { step: "3", label: "Generate your first content batch", active: false },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 text-sm">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold
                      ${item.active
                        ? "bg-[#00e5a0]/15 text-[#00e5a0]"
                        : "bg-[#1a1c1f] text-gray-600"
                      }`}
                  >
                    {item.step}
                  </div>
                  <span className={item.active ? "text-white" : "text-gray-600"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {hasSession ? (
            <Link
              href="/dashboard"
              className="bg-[#00e5a0] text-black font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)] transition-all"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <Link
              href={`/login?redirect=/dashboard${customerEmail ? `&email=${encodeURIComponent(customerEmail)}` : ""}`}
              className="bg-[#00e5a0] text-black font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)] transition-all"
            >
              Log in to access dashboard →
            </Link>
          )}
          <Link
            href="/"
            className="bg-transparent border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl text-sm hover:border-white/25 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#08090a] text-white flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading...</div>
        </main>
      }
    >
      <ThankYouContent searchParams={searchParams} />
    </Suspense>
  );
}
