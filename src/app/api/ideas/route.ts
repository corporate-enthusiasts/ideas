import { NextResponse } from "next/server";
import { listIdeaSlugs, getFileContent } from "@/lib/github";
import type { Idea, NotesFile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slugs = await listIdeaSlugs();

    const ideas = await Promise.all(
      slugs.map(async (slug) => {
        const ideaResult = await getFileContent<Idea>(`ideas/${slug}/idea.json`);
        if (!ideaResult) return null;

        const notesResult = await getFileContent<NotesFile>(`ideas/${slug}/notes.json`);
        const noteCount = notesResult?.data?.notes?.length ?? 0;

        return { ...ideaResult.data, _noteCount: noteCount };
      }),
    );

    const filtered = ideas.filter(Boolean);
    filtered.sort((a, b) => (b!.composite_score ?? 0) - (a!.composite_score ?? 0));

    return NextResponse.json(filtered, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}
