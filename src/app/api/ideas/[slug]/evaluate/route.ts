import { NextResponse } from "next/server";

const OWNER = process.env.GITHUB_OWNER || "corporate-enthusiasts";
const REPO = process.env.GITHUB_REPO || "ideas";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/evaluate.yml/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          ref: "main",
          inputs: { slug },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("GitHub Actions dispatch failed:", res.status, body);
      return NextResponse.json(
        { error: "Failed to trigger evaluation" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Evaluation started" },
      { status: 202 },
    );
  } catch (error) {
    console.error("Evaluation trigger failed:", error);
    return NextResponse.json(
      { error: "Failed to trigger evaluation" },
      { status: 500 },
    );
  }
}
