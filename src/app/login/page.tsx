"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Wrong password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-muted)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469c-.94 0-1.823-.369-2.488-1.023z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">The Lab</h1>
          <p className="mt-1 text-[15px] text-[var(--text-tertiary)]">Corporate Enthusiasts idea pipeline</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
          <label className="mb-2 block text-[12px] font-medium text-[var(--text-tertiary)]">Team Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)] focus:outline-none"
          />

          {error && (
            <p className="mt-2 text-sm text-[var(--verdict-pass)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-4 w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40"
          >
            {loading ? "Checking..." : "Enter"}
          </button>

        </form>
      </div>
    </div>
  );
}
