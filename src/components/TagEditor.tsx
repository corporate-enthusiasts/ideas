"use client";

import { useState } from "react";
import { TYPE_LABELS, EFFORT_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { Idea, IdeaType, EffortLevel, IdeaStatus } from "@/lib/types";

interface TagEditorProps {
  idea: Idea;
  onUpdated: () => void;
}

const selectClass = "cursor-pointer appearance-none rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] focus:border-[var(--border-focus)] focus:outline-none";

export default function TagEditor({ idea, onUpdated }: TagEditorProps) {
  const [editing, setEditing] = useState(false);
  const [type, setType] = useState(idea.type);
  const [effort, setEffort] = useState(idea.effort_level);
  const [status, setStatus] = useState(idea.status);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/ideas/${idea.id}/tags`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, effort_level: effort, status }),
      });
      if (res.ok) {
        setEditing(false);
        onUpdated();
      }
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[var(--bg-surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
          {TYPE_LABELS[idea.type] ?? idea.type}
        </span>
        <span className="rounded-md bg-[var(--bg-surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
          {EFFORT_LABELS[idea.effort_level] ?? idea.effort_level}
        </span>
        <span className="rounded-md bg-[var(--bg-surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
          {STATUS_LABELS[idea.status] ?? idea.status}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="ml-1 text-[11px] font-medium text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent)]"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <select value={type} onChange={(e) => setType(e.target.value as IdeaType)} className={selectClass}>
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={effort} onChange={(e) => setEffort(e.target.value as EffortLevel)} className={selectClass}>
          {Object.entries(EFFORT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as IdeaStatus)} className={selectClass}>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="rounded-md bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--text-inverse)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={() => setEditing(false)} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">Cancel</button>
      </div>
    </div>
  );
}
