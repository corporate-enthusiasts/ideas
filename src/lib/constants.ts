import type { Verdict, IdeaType, EffortLevel, IdeaStatus, NoteType } from "./types";

export const TEAM_MEMBERS = ["ben", "troy", "nick", "andrew", "goose"] as const;

export const VERDICT_CONFIG: Record<Verdict, { emoji: string; color: string; bg: string }> = {
  STRONG: { emoji: "\u{1F525}", color: "text-green-700", bg: "bg-green-100" },
  PROMISING: { emoji: "\u2705", color: "text-blue-700", bg: "bg-blue-100" },
  MEH: { emoji: "\u{1F914}", color: "text-yellow-700", bg: "bg-yellow-100" },
  PASS: { emoji: "\u274C", color: "text-red-700", bg: "bg-red-100" },
};

export const NOTE_TYPE_CONFIG: Record<NoteType, { emoji: string; color: string }> = {
  validation: { emoji: "\u{1F7E2}", color: "text-green-600" },
  concern: { emoji: "\u{1F7E1}", color: "text-yellow-600" },
  pivot: { emoji: "\u{1F535}", color: "text-blue-600" },
  general: { emoji: "\u26AA", color: "text-gray-600" },
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
