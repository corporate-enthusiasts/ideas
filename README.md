# The Lab — AI-Powered Idea Evaluator

A business idea evaluation tool that uses AI to score ideas across 8 criteria and provide actionable verdicts. Submit an idea, get it scored by Claude, and track your idea pipeline.

**Live app:** [idea-board-wheat.vercel.app](https://idea-board-wheat.vercel.app)

## What It Does

- **Submit ideas** with a name, one-liner, and description
- **AI evaluation** scores each idea across 8 criteria (AI leverage, competition, bootstrappability, revenue clarity, passive potential, team fit, side project viability, market timing)
- **Verdict system** — STRONG / PROMISING / MEH / PASS based on weighted composite score
- **Re-evaluation** — add notes with new context, re-evaluate, and see score deltas
- **Filter and sort** — by type, effort level, status, verdict, or score
- **Notes system** — track validation signals, concerns, and pivot ideas

## Screenshots

<!-- TODO: Add screenshots after deploying guest mode -->

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **AI:** Anthropic Claude API (8-criteria scoring with structured output)
- **Database:** GitHub Contents API (JSON files as data, every change is a git commit)
- **Data fetching:** SWR with real-time revalidation
- **Deployment:** Vercel

## Built With

Built entirely with [Claude Code](https://claude.ai/code) — Anthropic's AI coding agent.

## Architecture

The app uses GitHub as its database via the Contents API. Each idea is stored as a JSON file at `database/ideas/<slug>/idea.json` with an accompanying `notes.json`. This gives a full git audit trail for every change.

The AI evaluation pipeline scores ideas in a single Anthropic API call across 8 weighted criteria, calculates a composite score, and assigns a verdict.

### Guest Mode

Visitors can browse all ideas, scores, and verdicts without logging in. Write operations (submitting ideas, adding notes, evaluating, editing tags) require team authentication. This is enforced at the middleware level — GET requests pass through freely, while POST/PUT/DELETE require an auth cookie.
