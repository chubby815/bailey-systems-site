"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-center">
      <div className="text-5xl mb-4">📧</div>
      <h2 className="text-white font-bold text-lg mb-2">Verify your email</h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        We sent a verification link to your email address.
        {email && (
          <>
            {" "}Check your inbox for <strong className="text-white">{email}</strong>.
          </>
        )}
      </p>

      {sent ? (
        <p className="text-[#00e5a0] text-sm">✅ Verification email resent! Check your inbox.</p>
      ) : (
        <>
          <p className="text-gray-500 text-xs mb-4">
            Didn&apos;t receive it? Check your spam folder or request a new link below.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleResend} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="bg-[#1a1c1f] border border-white/[0.07] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#00e5a0] transition-colors text-center"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00e5a0] text-black font-bold py-3 rounded-xl text-sm transition-all hover:bg-[#00ffb2] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>
          </form>
        </>
      )}

      <div className="mt-6">
        <Link href="/login" className="text-gray-500 text-xs hover:text-gray-300">
          ← Back to Log In
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-[#08090a] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00e5a0]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-extrabold tracking-tight">
            Bailey<span className="text-[#00e5a0]">Agents</span>
          </Link>
        </div>

        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-8">
          <Suspense fallback={<div className="text-gray-500 text-sm animate-pulse text-center">Loading...</div>}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
