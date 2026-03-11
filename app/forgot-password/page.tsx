"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08090a] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00e5a0]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-extrabold tracking-tight">
            Bailey<span className="text-[#00e5a0]">Agents</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Reset your password</p>
        </div>

        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-8">
          {submitted ? (
            <div className="text-center py-2">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-white font-semibold mb-2">Check your inbox</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                If <strong className="text-white">{email}</strong> is registered, we&apos;ll send
                a password reset link within a few minutes.
              </p>
              <Link href="/login" className="text-[#00e5a0] text-sm hover:underline">
                ← Back to Log In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-white font-semibold mb-1 text-sm">Forgot your password?</h2>
              <p className="text-gray-500 text-xs mb-6 leading-relaxed">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="bg-[#1a1c1f] border border-white/[0.07] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#00e5a0] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 bg-[#00e5a0] text-black font-bold py-3 rounded-xl text-sm transition-all hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link →"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/login" className="text-gray-500 text-xs hover:text-gray-300">
                  ← Back to Log In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
