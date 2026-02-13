"use client";

import { useState } from "react";
import { TEAM_MEMBERS } from "@/lib/constants";
import Link from "next/link";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState<string>(TEAM_MEMBERS[0]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), author }),
      });
      if (res.ok) {
        setText("");
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setOpen(false);
        }, 1500);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] shadow-lg transition-all hover:border-[var(--border-focus)] hover:text-[var(--text-primary)]"
        title="Send feedback"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Modal backdrop + dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-lg font-semibold text-emerald-400">Thanks for the feedback!</p>
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                  Send Feedback
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] focus:border-[var(--border-focus)] focus:outline-none"
                  >
                    {TEAM_MEMBERS.map((m) => (
                      <option key={m} value={m} className="capitalize">{m}</option>
                    ))}
                  </select>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Bug, feature request, UX issue..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)] focus:outline-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <Link
                      href="/feedback"
                      onClick={() => setOpen(false)}
                      className="text-xs font-medium text-[var(--text-tertiary)] underline-offset-2 hover:text-[var(--text-secondary)] hover:underline"
                    >
                      View all feedback
                    </Link>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-focus)]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !text.trim()}
                        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40"
                      >
                        {submitting ? "Sending..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
