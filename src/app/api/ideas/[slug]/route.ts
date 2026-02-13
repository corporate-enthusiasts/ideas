import { NextResponse } from "next/server";
import { getFileContent } from "@/lib/github";
import type { Idea, NotesFile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const ideaResult = await getFileContent<Idea>(`database/ideas/${slug}/idea.json`);
    if (!ideaResult) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    let notes: NotesFile = { notes: [] };
    const notesResult = await getFileContent<NotesFile>(`database/ideas/${slug}/notes.json`);
    if (notesResult) {
      notes = notesResult.data;
    }

    return NextResponse.json({
      idea: ideaResult.data,
      notes: notes.notes,
      _ideaSha: ideaResult.sha,
      _notesSha: notesResult?.sha ?? null,
    });
  } catch (error) {
    console.error(`Failed to fetch idea ${slug}:`, error);
    return NextResponse.json({ error: "Failed to fetch idea" }, { status: 500 });
  }
}
