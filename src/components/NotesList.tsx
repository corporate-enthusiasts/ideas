import { NOTE_TYPE_CONFIG } from "@/lib/constants";
import type { Note } from "@/lib/types";

export default function NotesList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-gray-500">No notes yet.</p>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => {
        const config = NOTE_TYPE_CONFIG[note.type] ?? NOTE_TYPE_CONFIG.general;
        return (
          <div key={note.id} className="rounded-md border border-gray-100 bg-white p-3">
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
              <span>{config.emoji}</span>
              <span className="font-medium capitalize">{note.author}</span>
              <span>({note.date})</span>
              <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${config.color} bg-gray-50`}>
                {note.type}
              </span>
            </div>
            <p className="text-sm text-gray-700">{note.text}</p>
          </div>
        );
      })}
    </div>
  );
}
