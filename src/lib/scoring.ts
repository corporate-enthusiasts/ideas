import Anthropic from "@anthropic-ai/sdk";
import { SCORE_WEIGHTS } from "./constants";
import type { Idea, Scores, ScoreEntry, Note, Verdict } from "./types";

const anthropic = new Anthropic();

const SCORE_KEYS = Object.keys(SCORE_WEIGHTS) as (keyof Scores)[];

interface ScoringResult {
  scores: Scores;
  composite_score: number;
  verdict: Verdict;
  market_growing: boolean;
  market_shrinking: boolean;
  has_moat: boolean;
  summary: string;
}

export function buildScoringPrompt(
  idea: Idea,
  notes: Note[],
  rubric: string,
  bios: string,
  previousScores?: Scores,
): string {
  let prompt = `You are evaluating a business idea for a team of 5 friends building side projects together.

## Scoring Rubric
${rubric}

## Team Bios
${bios}

## Idea: ${idea.name}
**One-liner:** ${idea.one_liner}

### Brief
- **Problem:** ${idea.brief.problem || "Not provided"}
- **Target User:** ${idea.brief.target_user || "Not provided"}
- **Proposed Solution:** ${idea.brief.proposed_solution || "Not provided"}
- **Value Prop:** ${idea.brief.value_prop || "Not provided"}
- **Revenue Model:** ${idea.brief.initial_revenue_model || "Not provided"}
`;

  if (notes.length > 0) {
    prompt += `\n### Notes & Context\n`;
    for (const note of notes) {
      prompt += `- [${note.date}] ${note.author} (${note.type}): ${note.text}\n`;
    }
  }

  if (previousScores) {
    prompt += `\n### Previous Scores (explain what changed and why)\n`;
    for (const key of SCORE_KEYS) {
      const prev = previousScores[key];
      prompt += `- ${key}: ${prev.score}/5 — ${prev.reasoning}\n`;
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

export async function callAnthropic(prompt: string): Promise<ScoringResult> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const parsed = JSON.parse(text);

  const scores = parsed.scores as Scores;
  const { composite_score, verdict } = calculateComposite(
    scores,
    parsed.market_growing,
    parsed.market_shrinking,
    parsed.has_moat,
  );

  return {
    scores,
    composite_score,
    verdict,
    market_growing: parsed.market_growing,
    market_shrinking: parsed.market_shrinking,
    has_moat: parsed.has_moat,
    summary: parsed.summary,
  };
}

export function calculateComposite(
  scores: Scores,
  marketGrowing: boolean,
  marketShrinking: boolean,
  hasMoat: boolean,
): { composite_score: number; verdict: Verdict } {
  let raw = 0;
  for (const key of SCORE_KEYS) {
    const entry = scores[key] as ScoreEntry;
    const weight = SCORE_WEIGHTS[key] ?? 1;
    raw += entry.score * weight;
  }

  const maxRaw = 5 * 9.5; // sum of all weights = 9.5
  let score = Math.round((raw / maxRaw) * 100);

  if (marketGrowing) score += 3;
  if (marketShrinking) score -= 5;
  if (hasMoat) score += 2;

  score = Math.max(0, Math.min(100, score));

  let verdict: Verdict;
  if (score >= 75) verdict = "STRONG";
  else if (score >= 60) verdict = "PROMISING";
  else if (score >= 45) verdict = "MEH";
  else verdict = "PASS";

  return { composite_score: score, verdict };
}
