"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="text-center py-4">
        <p className="text-red-400 text-sm mb-4">Invalid or missing reset link.</p>
        <Link href="/forgot-password" className="text-[#00e5a0] text-sm hover:underline">
          Request a new link →
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/login?message=password_reset");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500 uppercase tracking-widest">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
          className="bg-[#1a1c1f] border border-white/[0.07] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#00e5a0] transition-colors"
        />
        <p className="text-xs text-gray-600">Min 8 characters, 1 letter, 1 number</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500 uppercase tracking-widest">Confirm Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
          className="bg-[#1a1c1f] border border-white/[0.07] text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#00e5a0] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 bg-[#00e5a0] text-black font-bold py-3 rounded-xl text-sm transition-all hover:bg-[#00ffb2] hover:shadow-[0_8px_30px_rgba(0,229,160,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Set New Password →"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <p className="text-gray-500 text-sm mt-2">Set a new password</p>
        </div>

        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl p-8">
          <h2 className="text-white font-semibold mb-1 text-sm">Choose a new password</h2>
          <p className="text-gray-500 text-xs mb-6">Make it strong and unique.</p>

          <Suspense fallback={<div className="text-gray-500 text-sm animate-pulse">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <div className="mt-5 text-center">
          <Link href="/login" className="text-gray-500 text-xs hover:text-gray-300">
            ← Back to Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
