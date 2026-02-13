import { NextResponse } from "next/server";
import { getFileContent, getRawFileContent, putFileContent } from "@/lib/github";
import { buildScoringPrompt, callAnthropic } from "@/lib/scoring";
import type { Idea, NotesFile } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    // Load idea + notes + rubric + bios in parallel
    const [ideaResult, notesResult, rubric, bios] = await Promise.all([
      getFileContent<Idea>(`database/ideas/${slug}/idea.json`),
      getFileContent<NotesFile>(`database/ideas/${slug}/notes.json`),
      getRawFileContent("database/scoring-rubric.md"),
      getRawFileContent("database/team-bios.md"),
    ]);

    if (!ideaResult) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const idea = ideaResult.data;
    const ideaSha = ideaResult.sha;
    const notes = notesResult?.data?.notes ?? [];

    if (!rubric || !bios) {
      return NextResponse.json(
        { error: "Missing scoring rubric or team bios in database" },
        { status: 500 },
      );
    }

    // Determine if this is a re-evaluation
    const isReEval = idea.status !== "draft" && idea.composite_score > 0;
    const previousScores = isReEval ? idea.scores : undefined;
    const previousScore = isReEval ? idea.composite_score : 0;

    // Build prompt and call Anthropic
    const prompt = buildScoringPrompt(idea, notes, rubric, bios, previousScores);
    const result = await callAnthropic(prompt);

    // Update idea
    const today = new Date().toISOString().split("T")[0];
    const updatedIdea: Idea = {
      ...idea,
      scores: result.scores,
      composite_score: result.composite_score,
      verdict: result.verdict,
      summary: result.summary,
      status: isReEval ? "re-evaluated" : "evaluated",
      updated: today,
      evaluation_history: [
        ...(idea.evaluation_history || []),
        {
          date: today,
          score: result.composite_score,
          verdict: result.verdict,
          trigger: isReEval ? "web-re-eval" : "web-eval",
        },
      ],
    };

    // Save updated idea
    await putFileContent(
      `database/ideas/${slug}/idea.json`,
      JSON.stringify(updatedIdea, null, 2),
      `${isReEval ? "Re-evaluate" : "Evaluate"} ${idea.name} via web`,
      ideaSha,
    );

    return NextResponse.json({
      ...updatedIdea,
      _delta: isReEval ? result.composite_score - previousScore : null,
    });
  } catch (error) {
    console.error("Evaluation failed:", error);
    return NextResponse.json(
      { error: "Evaluation failed. Check server logs." },
      { status: 500 },
    );
  }
}
