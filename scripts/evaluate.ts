import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SCORE_WEIGHTS: Record<string, number> = {
  competition: 1.5,
  team_fit: 1.5,
  bootstrappability: 1.25,
  passive_potential: 1.25,
  side_project_viability: 1.25,
  ai_leverage: 1.0,
  revenue_clarity: 1.0,
  market_timing: 0.75,
};

const SCORE_KEYS = Object.keys(SCORE_WEIGHTS);

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npx tsx scripts/evaluate.ts <slug>");
  process.exit(1);
}

const root = join(import.meta.dirname, "..");
const ideaPath = join(root, `database/ideas/${slug}/idea.json`);

const idea = JSON.parse(readFileSync(ideaPath, "utf-8"));

let notes: Array<{ date: string; author: string; type: string; text: string }> = [];
try {
  const notesFile = JSON.parse(readFileSync(join(root, `database/ideas/${slug}/notes.json`), "utf-8"));
  notes = notesFile.notes ?? [];
} catch {
  // No notes file
}

const rubric = readFileSync(join(root, "database/scoring-rubric.md"), "utf-8");
const bios = readFileSync(join(root, "database/team-bios.md"), "utf-8");

const isReEval = idea.status !== "draft" && idea.composite_score > 0;

function buildPrompt(): string {
  let prompt = `You are evaluating a business idea for a team of 5 friends building side projects together.

## Scoring Rubric
${rubric}

## Team Bios
${bios}

## Idea: ${idea.name}
**One-liner:** ${idea.one_liner}

### Brief
- **Problem:** ${idea.brief?.problem || "Not provided"}
- **Target User:** ${idea.brief?.target_user || "Not provided"}
- **Proposed Solution:** ${idea.brief?.proposed_solution || "Not provided"}
- **Value Prop:** ${idea.brief?.value_prop || "Not provided"}
- **Revenue Model:** ${idea.brief?.initial_revenue_model || "Not provided"}
`;

  if (notes.length > 0) {
    prompt += `\n### Notes & Context\n`;
    for (const note of notes) {
      prompt += `- [${note.date}] ${note.author} (${note.type}): ${note.text}\n`;
    }
  }

  if (isReEval && idea.scores) {
    prompt += `\n### Previous Scores (explain what changed and why)\n`;
    for (const key of SCORE_KEYS) {
      const prev = idea.scores[key];
      if (prev) prompt += `- ${key}: ${prev.score}/5 — ${prev.reasoning}\n`;
    }
  }

  prompt += `
## Instructions

Score this idea on 8 criteria (1-5 each). For each score, provide specific reasoning (1-2 sentences).

Also determine:
- Is the market growing, shrinking, or stable?
- Does this idea have moat potential (network_effects, data, brand, switching_costs) or none?
- Write a 2-3 paragraph executive summary: is this worth building, top strengths, top concerns, recommended next steps.

Respond with ONLY a JSON object (no markdown fences) in this exact format:
{
  "scores": {
    "competition": { "score": <1-5>, "reasoning": "<string>" },
    "team_fit": { "score": <1-5>, "reasoning": "<string>" },
    "bootstrappability": { "score": <1-5>, "reasoning": "<string>" },
    "passive_potential": { "score": <1-5>, "reasoning": "<string>" },
    "side_project_viability": { "score": <1-5>, "reasoning": "<string>" },
    "ai_leverage": { "score": <1-5>, "reasoning": "<string>" },
    "revenue_clarity": { "score": <1-5>, "reasoning": "<string>" },
    "market_timing": { "score": <1-5>, "reasoning": "<string>" }
  },
  "market_growing": <boolean>,
  "market_shrinking": <boolean>,
  "has_moat": <boolean>,
  "summary": "<string>"
}`;

  return prompt;
}

async function callAnthropic(prompt: string) {
  console.log("Calling Anthropic API...");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const text = data.content[0].text;
  return JSON.parse(text);
}

function calculateComposite(
  scores: Record<string, { score: number }>,
  marketGrowing: boolean,
  marketShrinking: boolean,
  hasMoat: boolean,
) {
  let raw = 0;
  for (const key of SCORE_KEYS) {
    const entry = scores[key];
    const weight = SCORE_WEIGHTS[key] ?? 1;
    raw += entry.score * weight;
  }

  const maxRaw = 5 * 9.5;
  let score = Math.round((raw / maxRaw) * 100);

  if (marketGrowing) score += 3;
  if (marketShrinking) score -= 5;
  if (hasMoat) score += 2;

  score = Math.max(0, Math.min(100, score));

  let verdict: string;
  if (score >= 75) verdict = "STRONG";
  else if (score >= 60) verdict = "PROMISING";
  else if (score >= 45) verdict = "MEH";
  else verdict = "PASS";

  return { composite_score: score, verdict };
}

async function main() {
  console.log(`Evaluating idea: ${slug} (${idea.name})`);

  const prompt = buildPrompt();
  const result = await callAnthropic(prompt);

  const { composite_score, verdict } = calculateComposite(
    result.scores,
    result.market_growing,
    result.market_shrinking,
    result.has_moat,
  );

  const today = new Date().toISOString().split("T")[0];
  const updated = {
    ...idea,
    scores: result.scores,
    composite_score,
    verdict,
    summary: result.summary,
    status: isReEval ? "re-evaluated" : "evaluated",
    updated: today,
    evaluation_history: [
      ...(idea.evaluation_history || []),
      {
        date: today,
        score: composite_score,
        verdict,
        trigger: isReEval ? "web-re-eval" : "web-eval",
      },
    ],
  };

  writeFileSync(ideaPath, JSON.stringify(updated, null, 2) + "\n");
  console.log(`Done! ${idea.name}: ${composite_score} (${verdict})`);
}

main().catch((err) => {
  console.error("Evaluation failed:", err);
  process.exit(1);
});
