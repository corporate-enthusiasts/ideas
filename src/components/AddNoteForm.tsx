"use client";

import { useState } from "react";
import { TEAM_MEMBERS, NOTE_TYPE_CONFIG } from "@/lib/constants";
import type { NoteType } from "@/lib/types";

interface AddNoteFormProps {
  slug: string;
  onNoteAdded: () => void;
}

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
        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          {TEAM_MEMBERS.map((m) => (
            <option key={m} value={m} className="capitalize">{m}</option>
          ))}
        </select>
        <select
          value={noteType}
          onChange={(e) => setNoteType(e.target.value as NoteType)}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
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
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting || !text.trim()}
        className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Note"}
      </button>
    </form>
  );
}
