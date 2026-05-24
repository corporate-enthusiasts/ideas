# The Lab — Corporate Enthusiasts Idea Board

## Status: v1 Complete (Feb 12, 2026)

---

## What's Built (v1)

### Infrastructure
- **Repo**: `corporate-enthusiasts/ideas` (combined app + data)
  - `src/` — Next.js 15 app (App Router, TypeScript, Tailwind v4)
  - `database/` — idea data (JSON files, GitHub as source of truth)
- **Skills repo**: `corporate-enthusiasts/skills` — validate-idea pipeline (7-stage AI scoring)
- **Auth**: Shared password (`APP_PASSWORD` env var), httpOnly cookie, 30-day expiry
- **Design**: Dark theme with soft indigo accent, Manrope font, verdict-colored cards

### Features Working
- **Board view**: Card grid with score circles, verdict badges, filtering (type/effort/status/verdict), sorting (score/newest/notes/status)
- **Detail view**: Score bars with hover reasoning, brief section (problem/target/solution/value prop/revenue model), notes timeline, evaluation history, tag editor
- **Submit**: Draft idea creation via web form (creates `idea.json` + empty `notes.json` in GitHub)
- **Notes**: Add notes with type (validation/concern/pivot/general) and author
- **Tag editing**: Update type, effort level, status inline
- **Scoring**: Via `/validate-idea` Claude Code skill (7-stage pipeline: Intake → Workshop → Thesis Fit → Market Research → Feasibility → Monetization → Summary)

### Data Model
Each idea lives at `database/ideas/<slug>/`:
- `idea.json` — scores (8 criteria), verdict, brief, metadata, evaluation history
- `notes.json` — chronological notes with author/type/date

### Tech Stack
- Next.js 15, Tailwind v4, Octokit, SWR
- GitHub Contents API for all reads/writes (no database)
- PAT stored in env vars, all API calls server-side

---

## What's Next

### 0. Deploy to Vercel
- Import `corporate-enthusiasts/ideas` in Vercel
- Set env vars: `GITHUB_TOKEN`, `GITHUB_OWNER=corporate-enthusiasts`, `GITHUB_REPO=ideas`, `APP_PASSWORD`
- Auto-deploys on push to `main`

### 1. Slack Submission
Users should be able to submit ideas directly from Slack (where the team already hangs out).

**Requirements:**
- Slack slash command or bot that accepts an idea name + one-liner
- Creates a draft in the database (same as web submit)
- Posts confirmation back to the channel with a link to the idea on the web
- Stretch: Slack thread becomes the idea's notes (replies → notes)

**Open questions:**
- Slack app or n8n webhook?
- Which Slack workspace/channel?
- Should Slack submissions trigger auto-evaluation or stay as drafts?

### 2. Extend `/validate-idea` Skill — CLI for Everything
**Status:** Planned
**Approach decided:** Extend the existing `/validate-idea` skill to handle browsing/CRUD (one skill for everything). Reads/writes via `mcp__github-personal__get_file_contents` and `mcp__github-personal__push_files`.

**New commands** (existing quick/deep/score modes stay as-is):

| Command | What it does |
|---------|-------------|
| `/validate-idea list` | List all ideas as table (name, score, verdict, status) |
| `/validate-idea view <slug>` | Full details — brief, scores w/ reasoning, notes, eval history |
| `/validate-idea submit` | Interactive: prompt for name, one-liner, submitter → create draft in GitHub |
| `/validate-idea note <slug>` | Add a note (prompt for text, type, author) |

**Mode detection additions:**
- List mode: "list ideas", "show ideas", `/validate-idea list`
- View mode: "view \<slug\>", "show me \<slug\>", `/validate-idea view`
- Submit mode: "submit idea", "new idea", `/validate-idea submit`
- Note mode: "add note to \<slug\>", `/validate-idea note`

**How it works:**
- Data at `database/ideas/<slug>/idea.json` and `notes.json`
- `list`: read all `idea.json` files, format as sorted table
- `view`: read `idea.json` + `notes.json`, display formatted
- `submit`: prompt for fields, generate slug, push draft `idea.json` + empty `notes.json`
- `note`: read existing `notes.json`, append new note, push update

**File:** `corporate-enthusiasts/skills/validate-idea/SKILL.md` (pushed via MCP)

### 3. Web Evaluation API + Evaluate Button
**Status:** Planned
**Approach decided:** Single Anthropic API call for scoring (simpler/cheaper than 7-stage CLI pipeline). Button on detail page.

#### API: `POST /api/ideas/[slug]/evaluate`

**Flow:**
```
Browser clicks "Evaluate"
  → POST /api/ideas/[slug]/evaluate
    → Load idea.json + notes.json from GitHub
    → Load team-bios.md + scoring-rubric.md from GitHub
    → Call Anthropic API (single prompt, all 8 criteria at once)
    → Calculate composite score + verdict
    → Update idea.json in GitHub (scores, verdict, status, eval history)
    → Return results
```

**Key decisions:**
- **Single API call** — one Anthropic call scores all 8 criteria with structured JSON output. CLI `/validate-idea` stays interactive (7 stages); web version just needs fast scores.
- **Scoring prompt includes:** idea brief, scoring rubric (`database/scoring-rubric.md`), team bios (`database/team-bios.md`), notes + previous scores (if re-evaluating)
- **Composite score formula** (reuse from `constants.ts`): `raw = sum(score * weight)`, `base = (raw / 47.5) * 100` + modifiers (market growing +3, shrinking -5, moat +2). Verdict: STRONG 75+, PROMISING 60-74, MEH 45-59, PASS <45
- **Re-evaluation:** same endpoint — prompt includes previous scores + notes, status → re-evaluated, appends to `evaluation_history`, response includes score delta

#### UI: `EvaluateButton` component
- Shows "Evaluate" (drafts) or "Re-evaluate" (scored ideas)
- Click → POST, show "Evaluating..." disabled state
- Success → SWR `mutate()` refreshes page
- Error → inline error message
- After re-eval → show score delta
- Placed below score circle / "Unscored" badge in hero header

#### Files
- **New:** `src/lib/scoring.ts` — Anthropic API call, prompt builder, composite score calc
- **New:** `src/app/api/ideas/[slug]/evaluate/route.ts` — POST handler
- **New:** `src/components/EvaluateButton.tsx` — UI component
- **Modified:** `src/app/ideas/[slug]/page.tsx` — import + render EvaluateButton
- **Modified:** `.env.local` — add `ANTHROPIC_API_KEY`
- **Modified:** `package.json` — add `@anthropic-ai/sdk`

### Implementation Order (for 2 + 3)
1. Extend `/validate-idea` SKILL.md — add list/view/submit/note commands
2. `src/lib/scoring.ts` — scoring logic + Anthropic API integration
3. `src/app/api/ideas/[slug]/evaluate/route.ts` — API endpoint
4. `src/components/EvaluateButton.tsx` — UI component
5. Wire up — integrate button into detail page, install SDK, add env var

### Verification Checklist
1. `/validate-idea list` → table of all ideas with scores
2. `/validate-idea view boatstash` → full details
3. `/validate-idea submit` → creates draft in GitHub
4. `curl -X POST localhost:3000/api/ideas/boatstash/evaluate` → returns scores
5. Click Evaluate on detail page → loading state → scores appear
6. Add note → Re-evaluate → new scores + delta shown
7. Cross-surface: evaluate via web, view via CLI → data matches

### 4. Future Ideas (Not Prioritized)
- Comparison view (side-by-side ideas)
- RANKINGS.md auto-update via GitHub Action
- GitHub OAuth (replace shared password)
- Email/notification when an idea gets re-evaluated
- Team voting on ideas (thumbs up/down)
- Export to pitch deck format

---

## Architecture Notes

### GitHub as Database
All data flows through the GitHub Contents API. This means:
- Every change is a git commit (full audit trail for free)
- Multiple writers need to handle sha conflicts (GET sha → modify → PUT with sha)
- ~100 ideas is the practical limit before API rate limits matter
- The `database/` folder is the "schema" — any tool that reads/writes follows the same JSON structure

### Scoring Pipeline
The `/validate-idea` skill in `corporate-enthusiasts/skills` runs 7 stages:
1. **Intake** — parse raw idea into structured brief
2. **Workshop** — stress-test assumptions, sharpen positioning
3. **Thesis Fit** — score against team capabilities (reads team-bios.md)
4. **Market Research** — competition, timing, market size
5. **Feasibility** — technical complexity, bootstrappability
6. **Monetization** — revenue model clarity, passive potential
7. **Summary** — aggregate scores, assign verdict, write to repo

Re-evaluation runs the same pipeline but includes previous scores + new notes as context.

### Multi-Surface Access Pattern
The idea board needs to work across three surfaces:
```
Slack → webhook/bot → GitHub API → database/
Web UI → API routes → GitHub API → database/
Claude Code → MCP/skill → GitHub API → database/
```
All three converge on the same GitHub repo as source of truth.
