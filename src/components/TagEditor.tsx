"use client";

import { useState } from "react";
import { TYPE_LABELS, EFFORT_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { Idea, IdeaType, EffortLevel, IdeaStatus } from "@/lib/types";

interface TagEditorProps {
  idea: Idea;
  onUpdated: () => void;
}

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
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {TYPE_LABELS[idea.type] ?? idea.type}
        </span>
        <span className="rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
          {EFFORT_LABELS[idea.effort_level] ?? idea.effort_level}
        </span>
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          {STATUS_LABELS[idea.status] ?? idea.status}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-blue-600 hover:underline"
        >
          Edit Tags
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <select value={type} onChange={(e) => setType(e.target.value as IdeaType)}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs">
          {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={effort} onChange={(e) => setEffort(e.target.value as EffortLevel)}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs">
          {Object.entries(EFFORT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as IdeaStatus)}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs">
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
      </div>
    </div>
  );
}
