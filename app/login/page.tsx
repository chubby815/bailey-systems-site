"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  // URL error params (e.g. from email verify redirect)
  const urlError = searchParams.get("error");

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notVerifiedEmail, setNotVerifiedEmail] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  function switchMode(next: "login" | "signup") {
    setMode(next);
    setError(null);
    setNotVerifiedEmail(null);
    setSignupSuccess(false);
    setResendSent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotVerifiedEmail(null);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, mode }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
        email?: string;
      };

      if (!res.ok) {
        if (data.error === "email_not_verified") {
          setNotVerifiedEmail(data.email ?? email);
        } else {
          setError(data.error ?? "Authentication failed");
        }
        return;
      }

      if (mode === "signup") {
        setSignupSuccess(true);
        setPassword("");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!notVerifiedEmail) return;
    setResendLoading(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notVerifiedEmail }),
      });
      setResendSent(true);
    } catch {
      // silently fail — server errors are shown via state
    } finally {
      setResendLoading(false);
    }
  }

  const urlErrorMessage =
    urlError === "link_expired"
      ? "Your verification link has expired. Please request a new one below."
      : urlError === "invalid_link" || urlError === "invalid_reset_link"
      ? "That link is invalid. Please try again."
      : urlError === "verification_failed"
      ? "Email verification failed. Please try again or request a new link."
      : null;

  return (
    <main className="min-h-screen bg-[#08090a] text-white flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00e5a0]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Bailey<span className="text-[#00e5a0]">Agents</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-8">
          {/* Mode toggle */}
          <div className="flex bg-[#1a1c1f] rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "login" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "signup" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* URL-based error (from redirect) */}
          {urlErrorMessage && !notVerifiedEmail && !error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
              {urlErrorMessage}
            </div>
          )}

          {/* Signup success */}
          {signupSuccess ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">✅</div>
              <p className="text-white font-semibold text-sm mb-2">Check your inbox!</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                We sent a verification link to <strong className="text-white">{email}</strong>.
                Click the link to activate your account before logging in.
              </p>
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="mt-5 text-[#00e5a0] text-sm hover:underline"
              >
                Back to Log In →
              </button>
            </div>
          ) : notVerifiedEmail ? (
            /* Email not verified state */
            <div className="text-center py-2">
              <div className="text-3xl mb-3">📧</div>
              <p className="text-white font-semibold text-sm mb-2">Verify your email first</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                A verification link was sent to <strong className="text-white">{notVerifiedEmail}</strong>.
                Check your inbox (and spam folder).
              </p>
              {resendSent ? (
                <p className="text-[#00e5a0] text-xs">✅ New verification email sent!</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="text-[#00e5a0] text-sm hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Resend verification email"}
                </button>
              )}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setNotVerifiedEmail(null)}
                  className="text-gray-500 text-xs hover:text-gray-300"
                >
                  ← Back
                </button>
              </div>
            </div>
          ) : (
            /* Normal form */
            <>
              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === "signup" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-500 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="bg-[#1a1c1f] border border-white/[0.07] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#00e5a0] transition-colors"
                    />
                  </div>
                )}

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

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-500 uppercase tracking-widest">Password</label>
                    {mode === "login" && (
                      <Link href="/forgot-password" className="text-xs text-[#00e5a0] hover:underline">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="bg-[#1a1c1f] border border-white/[0.07] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#00e5a0] transition-colors"
                  />
                  {mode === "signup" && (
                    <p className="text-xs text-gray-600">Min 8 characters, 1 letter, 1 number</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 bg-[#00e5a0] text-black font-bold py-3 rounded-xl text-sm transition-all hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      {mode === "login" ? "Logging in..." : "Creating account..."}
                    </span>
                  ) : mode === "login" ? (
                    "Log In →"
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-400">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-gray-400">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="text-white text-sm animate-pulse">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
