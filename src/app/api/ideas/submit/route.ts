import { NextResponse } from "next/server";
import { putFileContent } from "@/lib/github";
import type { Idea, NotesFile } from "@/lib/types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, one_liner, description, submitter } = body;

  if (!name?.trim() || !one_liner?.trim()) {
    return NextResponse.json({ error: "name and one_liner required" }, { status: 400 });
  }

  const slug = slugify(name);
  const today = new Date().toISOString().split("T")[0];

  const idea: Idea = {
    id: slug,
    name: name.trim(),
    one_liner: one_liner.trim(),
    submitter: submitter || "unknown",
    created: today,
    updated: today,
    status: "draft",
    type: "other",
    effort_level: "solo",
    tags: [],
    brief: {
      problem: description || "",
      target_user: "",
      proposed_solution: "",
      value_prop: "",
      initial_revenue_model: "",
    },
    scores: {
      ai_leverage: { score: 0, reasoning: "" },
      competition: { score: 0, reasoning: "" },
      bootstrappability: { score: 0, reasoning: "" },
      revenue_clarity: { score: 0, reasoning: "" },
      passive_potential: { score: 0, reasoning: "" },
      team_fit: { score: 0, reasoning: "" },
      side_project_viability: { score: 0, reasoning: "" },
      market_timing: { score: 0, reasoning: "" },
    },
    composite_score: 0,
    verdict: "MEH",
    summary: "",
    evaluation_history: [],
  };

  const notes: NotesFile = { notes: [] };

  try {
    await putFileContent(
      `ideas/${slug}/idea.json`,
      JSON.stringify(idea, null, 2),
      `Add draft idea: ${name}`,
    );

    await putFileContent(
      `ideas/${slug}/notes.json`,
      JSON.stringify(notes, null, 2),
      `Initialize notes for ${slug}`,
    );

    return NextResponse.json({ id: slug }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit idea:", error);
    return NextResponse.json({ error: "Failed to create idea" }, { status: 500 });
  }
}
