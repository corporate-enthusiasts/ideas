import { NOTE_TYPE_CONFIG } from "@/lib/constants";
import type { Note } from "@/lib/types";

export default function NotesList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">No notes yet. Be the first to add one.</p>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => {
        const config = NOTE_TYPE_CONFIG[note.type] ?? NOTE_TYPE_CONFIG.general;
        return (
          <div
            key={note.id}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg)] p-3.5"
            style={{ borderLeftWidth: "2px", borderLeftColor: config.cssColor }}
          >
            <div className="mb-1.5 flex items-center gap-2 text-[11px]">
              <span className="font-semibold capitalize text-[var(--text-primary)]">{note.author}</span>
              <span className="text-[var(--text-tertiary)]">{note.date}</span>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                style={{ color: config.cssColor, backgroundColor: `color-mix(in srgb, ${config.cssColor} 10%, transparent)` }}
              >
                {note.type}
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-[var(--text-primary)]">{note.text}</p>
          </div>
        );
      })}
    </div>
  );
}
