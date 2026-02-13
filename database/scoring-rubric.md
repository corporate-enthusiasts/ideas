# Scoring Rubric

## Criteria & Weights

| Criterion | Weight | Why This Weight |
|-----------|--------|----------------|
| Competition | 1.5x | Can't outspend incumbents - must pick fights we can win |
| Team Fit | 1.5x | If we have no unique edge, why us? |
| Bootstrappability | 1.25x | No funding - must launch cheap |
| Passive Potential | 1.25x | We all have day jobs - can't babysit products |
| Side Project Viability | 1.25x | 4-8 hrs/week max |
| AI Leverage | 1.0x | Core thesis but not everything needs to be AI-first |
| Revenue Clarity | 1.0x | Important but can figure out monetization later |
| Market Timing | 0.75x | Nice to have, hard to control |

## Score Scale (1-5)

- **1-2:** Weak. Real concerns on this dimension.
- **3:** Neutral. Nothing special, nothing terrible.
- **4:** Strong. Clear advantage.
- **5:** Exceptional. Rare - reserve for genuinely outstanding fit.

Be rigorous. Most ideas should NOT score 5 on everything.

## Composite Score Formula

```
raw_weighted = (
  competition * 1.5 +
  team_fit * 1.5 +
  bootstrappability * 1.25 +
  passive_potential * 1.25 +
  side_project_viability * 1.25 +
  ai_leverage * 1.0 +
  revenue_clarity * 1.0 +
  market_timing * 0.75
)

max_possible = 5 * (1.5 + 1.5 + 1.25 + 1.25 + 1.25 + 1.0 + 1.0 + 0.75)
             = 5 * 9.5
             = 47.5

base_score = (raw_weighted / max_possible) * 100
```

## Modifiers

Applied after base score calculation:

| Condition | Modifier | Reasoning |
|-----------|----------|-----------|
| Market direction = growing | +3 | Rising tide helps |
| Market direction = shrinking | -5 | Uphill battle |
| Moat potential exists (not "none") | +2 | Long-term defensibility |

```
composite_score = base_score + modifiers
```

Cap at 100, floor at 0.

## Verdicts

| Score Range | Verdict | Meaning |
|-------------|---------|--------|
| 75-100 | **STRONG** | Build this. Clear advantages across multiple dimensions. |
| 60-74 | **PROMISING** | Worth exploring. Has strengths but also gaps to address. |
| 45-59 | **MEH** | Needs a pivot or better angle to be compelling. |
| 0-44 | **PASS** | Move on. Fundamental issues that can't be easily fixed. |

## Scoring Guidelines by Criterion

### AI Leverage
- **5:** AI IS the product - impossible without it
- **4:** AI provides 10x improvement over manual alternative
- **3:** AI helps but isn't central
- **2:** AI is bolted on
- **1:** No meaningful AI component

### Competition
- **5:** Blue ocean - no real competition, no funded startups
- **4:** Few competitors, all weak or unfocused
- **3:** Some competition but room for differentiation
- **2:** Crowded market, several strong players
- **1:** Red ocean - well-funded incumbents dominate

### Bootstrappability
- **5:** Launch for <$100, ship MVP in a weekend
- **4:** Launch for <$500, ship MVP in 2-4 weeks
- **3:** Needs $500-2K or significant dev time
- **2:** Needs $2-5K+ or infrastructure investment
- **1:** Requires significant capital to even start

### Revenue Clarity
- **5:** Obvious willingness to pay - evidence exists
- **4:** Strong signal - target users have budget and pain
- **3:** Plausible monetization but unvalidated
- **2:** Unclear who pays or how much
- **1:** "We'll figure out monetization later" vibes

### Passive Potential
- **5:** Set it and forget it
- **4:** Minimal maintenance - occasional updates
- **3:** Moderate ongoing work - customer support, content
- **2:** Significant active involvement needed
- **1:** Requires constant hands-on work

### Team Fit
- **5:** Perfect - unique expertise, network, or positioning
- **4:** Strong fit - skills and context give real advantage
- **3:** No special edge but no disadvantage
- **2:** Requires skills or resources we lack
- **1:** Wrong team for this

### Side Project Viability
- **5:** Buildable AND maintainable at 4-8 hrs/week
- **4:** Buildable at side-project pace, maintenance is light
- **3:** Can build it but maintenance might creep
- **2:** Tight at side-project pace
- **1:** Needs full-time attention

### Market Timing
- **5:** Perfect timing - technology just enabled this, demand is spiking
- **4:** Good timing - growing market, favorable conditions
- **3:** Neutral - market exists but no special timing advantage
- **2:** Questionable - might be too early or late
- **1:** Bad timing - market is dying or not ready
