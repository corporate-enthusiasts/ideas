"use client";

import { useState } from "react";
import { TEAM_MEMBERS, NOTE_TYPE_CONFIG } from "@/lib/constants";
import type { NoteType } from "@/lib/types";

interface AddNoteFormProps {
  slug: string;
  onNoteAdded: () => void;
}

const selectClass = "cursor-pointer appearance-none rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] focus:border-[var(--border-focus)] focus:outline-none";

export default function AddNoteForm({ slug, onNoteAdded }: AddNoteFormProps) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState<string>(TEAM_MEMBERS[0]);
  const [noteType, setNoteType] = useState<NoteType>("general");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/ideas/${slug}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), author, type: noteType }),
      });
      if (res.ok) {
        setText("");
        onNoteAdded();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <select value={author} onChange={(e) => setAuthor(e.target.value)} className={selectClass}>
          {TEAM_MEMBERS.map((m) => (
            <option key={m} value={m} className="capitalize">{m}</option>
          ))}
        </select>
        <select value={noteType} onChange={(e) => setNoteType(e.target.value as NoteType)} className={selectClass}>
          {(Object.keys(NOTE_TYPE_CONFIG) as NoteType[]).map((t) => (
            <option key={t} value={t}>{NOTE_TYPE_CONFIG[t].emoji} {t}</option>
          ))}
        </select>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your note..."
        rows={3}
        className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting || !text.trim()}
        className="rounded-md bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-40"
      >
        {submitting ? "Saving..." : "Save Note"}
      </button>
    </form>
  );
}
