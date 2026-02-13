# Corporate Enthusiasts Idea Board

Scored, tracked, and ranked business ideas for the Corporate Enthusiasts collective.

## How It Works

1. **Submit an idea** via Claude Code (`/validate-idea`), Slack, or the web UI
2. **AI evaluates** it through a 7-stage pipeline (intake, workshop, thesis fit, market research, feasibility, monetization, summary)
3. **Scores are calculated** across 8 weighted criteria
4. **Results are stored** as structured JSON in this repo
5. **Rankings are auto-updated** after each evaluation

## Repository Structure

```
database/
  README.md              <- You are here
  RANKINGS.md            <- Auto-generated leaderboard
  schema.json            <- Idea data schema
  scoring-rubric.md      <- Scoring criteria + weights
  team-bios.md           <- Member bios (used by evaluator)
  ideas/
    <idea-slug>/
      idea.json          <- Structured data + scores
      notes.json         <- Team annotations
      history/
        YYYY-MM-DD-*.json  <- Evaluation snapshots
```

## Scoring Criteria

| Criterion | Weight | What It Measures |
|-----------|--------|------------------|
| Competition | 1.5x | Can we win without outspending? |
| Team Fit | 1.5x | Do we have a unique edge? |
| Bootstrappability | 1.25x | Can we launch for <$100? |
| Passive Potential | 1.25x | Does it run itself after setup? |
| Side Project Viability | 1.25x | Buildable in 4-8 hrs/week? |
| AI Leverage | 1.0x | Is AI core or bolted on? |
| Revenue Clarity | 1.0x | Will people pay? |
| Market Timing | 0.75x | Is now the right time? |

## Verdicts

- **STRONG** (75-100): Build this
- **PROMISING** (60-74): Worth exploring further
- **MEH** (45-59): Needs a pivot or better angle
- **PASS** (0-44): Move on

## Team

Ben, Troy, Nick, Jordan, Andrew

## Entry Points

- **Claude Code**: `/validate-idea` for deep evaluation
- **Slack**: Quick-submit via bot
- **Web UI**: Browse, filter, annotate *(coming soon)*
