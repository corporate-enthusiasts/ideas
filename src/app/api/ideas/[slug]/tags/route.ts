import { NextResponse } from "next/server";
import { getFileContent, putFileContent } from "@/lib/github";
import type { Idea } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const updates = await request.json();

  const path = `ideas/${slug}/idea.json`;

  try {
    const existing = await getFileContent<Idea>(path);
    if (!existing) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const idea = existing.data;
    const changedFields: string[] = [];

    if (updates.type && updates.type !== idea.type) {
      idea.type = updates.type;
      changedFields.push("type");
    }
    if (updates.effort_level && updates.effort_level !== idea.effort_level) {
      idea.effort_level = updates.effort_level;
      changedFields.push("effort_level");
    }
    if (updates.status && updates.status !== idea.status) {
      idea.status = updates.status;
      changedFields.push("status");
    }
    if (updates.tags) {
      idea.tags = updates.tags;
      changedFields.push("tags");
    }

    idea.updated = new Date().toISOString().split("T")[0];

    await putFileContent(
      path,
      JSON.stringify(idea, null, 2),
      `Update ${changedFields.join(", ")} for ${slug}`,
      existing.sha,
    );

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Failed to update tags:", error);
    return NextResponse.json({ error: "Failed to update tags" }, { status: 500 });
  }
}
