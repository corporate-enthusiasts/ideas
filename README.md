# The Lab — AI-Powered Idea Evaluator

A business idea evaluation tool that uses AI to score ideas across 8 weighted criteria and provide actionable verdicts. Submit an idea, get it scored by Claude, and track your idea pipeline.

**Live app:** [the-lab-ideas.vercel.app](https://the-lab-ideas.vercel.app)

## What It Does

- **Submit ideas** with a name, one-liner, and description
- **AI evaluation** scores each idea across 8 criteria with configurable weights
- **Verdict system** — STRONG / PROMISING / MEH / PASS based on weighted composite score
- **Re-evaluation** — add notes with new context, re-evaluate, and see score deltas
- **Filter and sort** — by type, effort level, status, verdict, or score
- **Notes system** — track validation signals, concerns, and pivot ideas
- **Feedback system** — submit feature requests and track implementation status

## How Scoring Works

Each idea is evaluated by Claude across **8 criteria**, scored 1-5, then combined into a **weighted composite score** (0-100).

### Criteria & Weights

| Criteria | Weight | What It Measures |
|----------|--------|------------------|
| **Competition** | 1.5x | How crowded is the market? Lower competition = higher score |
| **Team Fit** | 1.5x | Does this match our skills, interests, and capacity? |
| **Bootstrappability** | 1.25x | Can we build and launch this without funding? |
| **Passive Potential** | 1.25x | Can this generate revenue without constant active work? |
| **Side Project Viability** | 1.25x | Can we realistically build this alongside day jobs? |
| **AI Leverage** | 1.0x | How much does AI give us an unfair advantage here? |
| **Revenue Clarity** | 1.0x | Is the path to money obvious and proven? |
| **Market Timing** | 0.75x | Is now the right time for this? |

### Composite Score Calculation

1. Each criterion is scored **1-5** by Claude with reasoning
2. Scores are multiplied by their weights (total weight: 9.5)
3. Normalized to **0-100**: `(weighted_sum / 47.5) * 100`
4. **Bonus adjustments:**
   - Growing market: **+3 points**
   - Shrinking market: **-5 points**
   - Has defensible moat: **+2 points**
5. Clamped to 0-100

### Verdict Thresholds

| Verdict | Score | Meaning |
|---------|-------|---------|
| **STRONG** | 75+ | Strong candidate — seriously consider building |
| **PROMISING** | 60-74 | Worth exploring further with validation |
| **MEH** | 45-59 | Some potential but significant concerns |
| **PASS** | Below 45 | Doesn't fit our criteria right now |

### Tuning

Weights and thresholds are defined in `src/lib/constants.ts` (`SCORE_WEIGHTS`) and `src/lib/scoring.ts` (`calculateComposite`). To change how ideas are prioritized, adjust the weights — higher weight = more influence on the final score.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **AI:** Anthropic Claude API (8-criteria scoring with structured output)
- **Database:** GitHub Contents API (JSON files as data, every change is a git commit)
- **Data fetching:** SWR with real-time revalidation
- **Deployment:** Vercel

## Architecture

The app uses GitHub as its database via the Contents API. Each idea is stored as a JSON file at `database/ideas/<slug>/idea.json` with an accompanying `notes.json`. This gives a full git audit trail for every change.

The AI evaluation pipeline scores ideas in a single Anthropic API call across 8 weighted criteria, calculates a composite score, and assigns a verdict.

## Built With

Built entirely with [Claude Code](https://claude.ai/code) — Anthropic's AI coding agent.
