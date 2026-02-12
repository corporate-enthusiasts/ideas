export interface IdeaBrief {
  problem: string;
  target_user: string;
  proposed_solution: string;
  value_prop: string;
  initial_revenue_model: string;
}

export interface ScoreEntry {
  score: number;
  reasoning: string;
}

export interface Scores {
  ai_leverage: ScoreEntry;
  competition: ScoreEntry;
  bootstrappability: ScoreEntry;
  revenue_clarity: ScoreEntry;
  passive_potential: ScoreEntry;
  team_fit: ScoreEntry;
  side_project_viability: ScoreEntry;
  market_timing: ScoreEntry;
}

export interface EvalHistoryEntry {
  date: string;
  score: number;
  verdict: Verdict;
  trigger: string;
}

export type Verdict = "STRONG" | "PROMISING" | "MEH" | "PASS";
export type IdeaStatus = "draft" | "evaluated" | "re-evaluated" | "building" | "archived";
export type EffortLevel = "solo" | "pair" | "team";
export type IdeaType = "consumer_app" | "smb_saas" | "smb_service" | "marketplace" | "saas" | "physical_product" | "other";
export type NoteType = "validation" | "concern" | "pivot" | "general";

export interface Idea {
  id: string;
  name: string;
  one_liner: string;
  submitter: string;
  created: string;
  updated: string;
  status: IdeaStatus;
  type: IdeaType;
  effort_level: EffortLevel;
  tags: string[];
  brief: IdeaBrief;
  scores: Scores;
  composite_score: number;
  verdict: Verdict;
  workshop?: Record<string, unknown>;
  market_research?: Record<string, unknown>;
  feasibility?: Record<string, unknown>;
  monetization?: Record<string, unknown>;
  summary: string;
  evaluation_history: EvalHistoryEntry[];
}

export interface Note {
  id: string;
  author: string;
  date: string;
  text: string;
  type: NoteType;
}

export interface NotesFile {
  notes: Note[];
}

export type SortOption = "score" | "newest" | "most_notes" | "status";
