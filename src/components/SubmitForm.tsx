"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEAM_MEMBERS } from "@/lib/constants";

const inputClass = "w-full rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)] focus:outline-none";

export default function SubmitForm() {
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [submitter, setSubmitter] = useState<string>(TEAM_MEMBERS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !oneLiner.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/ideas/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          one_liner: oneLiner.trim(),
          description: description.trim(),
          submitter,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/ideas/${data.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-[var(--text-tertiary)]">Idea Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. BoatStash"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-[var(--text-tertiary)]">One-liner</label>
        <input
          type="text"
          value={oneLiner}
          onChange={(e) => setOneLiner(e.target.value)}
          placeholder="e.g. Photo-based parts inventory for cruisers"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-[var(--text-tertiary)]">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What problem does it solve? Who is it for?"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-[var(--text-tertiary)]">Your Name</label>
        <select
          value={submitter}
          onChange={(e) => setSubmitter(e.target.value)}
          className="cursor-pointer appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] focus:border-[var(--border-focus)] focus:outline-none"
        >
          {TEAM_MEMBERS.map((m) => (
            <option key={m} value={m} className="capitalize">{m}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-[var(--verdict-pass)]">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !name.trim() || !oneLiner.trim()}
        className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40"
      >
        {submitting ? "Saving..." : "Save as Draft"}
      </button>
    </form>
  );
}
