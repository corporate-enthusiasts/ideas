import { NextResponse } from "next/server";
import { getFileContent, putFileContent } from "@/lib/github";
import type { FeedbackFile } from "@/lib/types";

const PATH = "database/feedback/feedback.json";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!status || !["pending", "implemented"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const existing = await getFileContent<FeedbackFile>(PATH);
    if (!existing) {
      return NextResponse.json({ error: "Feedback file not found" }, { status: 404 });
    }

    const item = existing.data.feedback.find((f) => f.id === id);
    if (!item) {
      return NextResponse.json({ error: "Feedback item not found" }, { status: 404 });
    }

    item.status = status;

    await putFileContent(
      PATH,
      JSON.stringify(existing.data, null, 2),
      `Mark feedback ${id} as ${status}`,
      existing.sha,
    );

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update feedback:", error);
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}
