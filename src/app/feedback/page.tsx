"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import type { FeedbackItem, FeedbackStatus } from "@/lib/types";
import { FEEDBACK_STATUS_CONFIG } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function FeedbackPage() {
  const { data, error, isLoading, mutate } = useSWR<{ feedback: FeedbackItem[]; _sha: string }>(
    "/api/feedback",
    fetcher,
    { refreshInterval: 60000 },
  );

  const [activeTab, setActiveTab] = useState<FeedbackStatus>("pending");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const feedback = data?.feedback ?? [];

  const counts = useMemo(() => ({
    pending: feedback.filter((f) => f.status === "pending").length,
    implemented: feedback.filter((f) => f.status === "implemented").length,
  }), [feedback]);

  const filtered = useMemo(
    () => feedback.filter((f) => f.status === activeTab).sort((a, b) => b.date.localeCompare(a.date)),
    [feedback, activeTab],
  );

  async function toggleStatus(item: FeedbackItem) {
    const newStatus: FeedbackStatus = item.status === "pending" ? "implemented" : "pending";
    setTogglingId(item.id);
    try {
      const res = await fetch(`/api/feedback/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        mutate();
      }
    } finally {
      setTogglingId(null);
    }
  }

  const tabs: FeedbackStatus[] = ["pending", "implemented"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to ideas
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Feedback</h1>
        <p className="mt-1 text-[15px] text-[var(--text-tertiary)]">Bugs, feature requests, and UX issues</p>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {FEEDBACK_STATUS_CONFIG[tab].emoji} {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
              <div className="space-y-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-[var(--verdict-pass)] bg-[var(--verdict-pass-bg)] p-6 text-center text-sm text-[var(--verdict-pass)]">
          Failed to load feedback. Try refreshing.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-12 text-center">
          <p className="text-sm text-[var(--text-tertiary)]">
            {feedback.length === 0
              ? "No feedback yet. Use the chat button to submit some."
              : `No ${activeTab} feedback.`}
          </p>
        </div>
      )}

      {/* Feedback cards */}
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`animate-card-in stagger-${Math.min(i + 1, 8)} rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:border-[var(--border-focus)]`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-semibold capitalize text-[var(--text-primary)]">{item.author}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">{item.date}</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.text}</p>
              </div>
              <button
                onClick={() => toggleStatus(item)}
                disabled={togglingId === item.id}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                  item.status === "pending"
                    ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-400/10"
                    : "border-amber-500/30 text-amber-400 hover:bg-amber-400/10"
                }`}
              >
                {togglingId === item.id
                  ? "..."
                  : item.status === "pending"
                    ? "Mark done"
                    : "Reopen"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
