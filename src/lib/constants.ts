import type { Verdict, IdeaType, EffortLevel, IdeaStatus, NoteType, FeedbackStatus } from "./types";

export const TEAM_MEMBERS = ["ben", "troy", "nick", "andrew", "goose"] as const;

export const VERDICT_CONFIG: Record<Verdict, { emoji: string; color: string; bg: string; border: string; cssColor: string }> = {
  STRONG: { emoji: "\u{1F525}", color: "text-[var(--verdict-strong)]", bg: "bg-[var(--verdict-strong-bg)]", border: "border-[var(--verdict-strong)]", cssColor: "var(--verdict-strong)" },
  PROMISING: { emoji: "\u2705", color: "text-[var(--verdict-promising)]", bg: "bg-[var(--verdict-promising-bg)]", border: "border-[var(--verdict-promising)]", cssColor: "var(--verdict-promising)" },
  MEH: { emoji: "\u{1F914}", color: "text-[var(--verdict-meh)]", bg: "bg-[var(--verdict-meh-bg)]", border: "border-[var(--verdict-meh)]", cssColor: "var(--verdict-meh)" },
  PASS: { emoji: "\u274C", color: "text-[var(--verdict-pass)]", bg: "bg-[var(--verdict-pass-bg)]", border: "border-[var(--verdict-pass)]", cssColor: "var(--verdict-pass)" },
};

export const NOTE_TYPE_CONFIG: Record<NoteType, { emoji: string; color: string; cssColor: string }> = {
  validation: { emoji: "\u{1F7E2}", color: "text-[var(--note-validation)]", cssColor: "var(--note-validation)" },
  concern: { emoji: "\u{1F7E1}", color: "text-[var(--note-concern)]", cssColor: "var(--note-concern)" },
  pivot: { emoji: "\u{1F535}", color: "text-[var(--note-pivot)]", cssColor: "var(--note-pivot)" },
  general: { emoji: "\u26AA", color: "text-[var(--note-general)]", cssColor: "var(--note-general)" },
};

export const TYPE_LABELS: Record<IdeaType, string> = {
  consumer_app: "Consumer App",
  smb_saas: "SMB SaaS",
  smb_service: "SMB Service",
  marketplace: "Marketplace",
  saas: "SaaS",
  physical_product: "Physical Product",
  other: "Other",
};

export const EFFORT_LABELS: Record<EffortLevel, string> = {
  solo: "Solo Build",
  pair: "Pair Project",
  team: "Team Project",
};

export const STATUS_LABELS: Record<IdeaStatus, string> = {
  draft: "Draft",
  evaluated: "Evaluated",
  "re-evaluated": "Re-evaluated",
  building: "Building",
  archived: "Archived",
};

export const SCORE_LABELS: Record<string, string> = {
  ai_leverage: "AI Leverage",
  competition: "Competition",
  bootstrappability: "Bootstrappability",
  revenue_clarity: "Revenue Clarity",
  passive_potential: "Passive Potential",
  team_fit: "Team Fit",
  side_project_viability: "Side Project",
  market_timing: "Market Timing",
};

export const FEEDBACK_STATUS_CONFIG: Record<FeedbackStatus, { emoji: string; color: string; bg: string }> = {
  pending: { emoji: "🟡", color: "text-amber-400", bg: "bg-amber-400/10" },
  implemented: { emoji: "✅", color: "text-emerald-400", bg: "bg-emerald-400/10" },
};

export const SCORE_WEIGHTS: Record<string, number> = {
  competition: 1.5,
  team_fit: 1.5,
  bootstrappability: 1.25,
  passive_potential: 1.25,
  side_project_viability: 1.25,
  ai_leverage: 1.0,
  revenue_clarity: 1.0,
  market_timing: 0.75,
};
