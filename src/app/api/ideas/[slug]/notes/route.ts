import { NextResponse } from "next/server";
import { getFileContent, putFileContent } from "@/lib/github";
import type { NotesFile, NoteType } from "@/lib/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();
  const { text, author, type } = body as { text: string; author: string; type: NoteType };

  if (!text?.trim() || !author) {
    return NextResponse.json({ error: "text and author required" }, { status: 400 });
  }

  const path = `database/ideas/${slug}/notes.json`;

  try {
    const existing = await getFileContent<NotesFile>(path);
    const notes = existing?.data?.notes ?? [];
    const sha = existing?.sha;

    const newNote = {
      id: `note_${Math.floor(Date.now() / 1000)}`,
      author,
      date: new Date().toISOString().split("T")[0],
      text: text.trim(),
      type: type || "general",
    };

    notes.push(newNote);

    await putFileContent(
      path,
      JSON.stringify({ notes }, null, 2),
      `Add note by ${author} on ${slug}`,
      sha,
    );

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Failed to add note:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
