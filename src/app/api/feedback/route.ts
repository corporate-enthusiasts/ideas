import { NextResponse } from "next/server";
import { getFileContent, putFileContent } from "@/lib/github";
import type { FeedbackFile, FeedbackStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const PATH = "database/feedback/feedback.json";

export async function GET() {
  try {
    const result = await getFileContent<FeedbackFile>(PATH);
    if (!result) {
      return NextResponse.json({ feedback: [], _sha: null });
    }
    return NextResponse.json({ feedback: result.data.feedback, _sha: result.sha });
  } catch (error) {
    console.error("Failed to load feedback:", error);
    return NextResponse.json({ error: "Failed to load feedback" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { text, author } = body as { text: string; author: string };

  if (!text?.trim() || !author) {
    return NextResponse.json({ error: "text and author required" }, { status: 400 });
  }

  try {
    const existing = await getFileContent<FeedbackFile>(PATH);
    const feedback = existing?.data?.feedback ?? [];
    const sha = existing?.sha;

    const newItem = {
      id: `fb_${Math.floor(Date.now() / 1000)}`,
      author,
      text: text.trim(),
      date: new Date().toISOString().split("T")[0],
      status: "pending" as FeedbackStatus,
    };

    feedback.push(newItem);

    await putFileContent(
      PATH,
      JSON.stringify({ feedback }, null, 2),
      `Add feedback from ${author}`,
      sha,
    );

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Failed to add feedback:", error);
    return NextResponse.json({ error: "Failed to add feedback" }, { status: 500 });
  }
}
