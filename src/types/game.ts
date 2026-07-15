export type Question = {
  id: string;
  benefit: string;
  consequence: string;
  category: string;
  active: boolean;
  priority?: number;
};

export type VoteChoice = "press" | "dont_press" | "timeout";

export type VoteStats = {
  pressCount: number;
  dontPressCount: number;
  timeoutCount: number;
  totalCount: number;
  source: "supabase" | "local";
};

export type PlayHistory = {
  answeredQuestionIds: string[];
  pressCount: number;
  dontPressCount: number;
  timeoutCount: number;
  totalAnswered: number;
  lastQuestionId?: string;
  lastCategory?: string;
};

export type VoteOutcomeStatus = "majority" | "minority" | "split" | "first" | "insufficient" | "timeout";

export type VoteOutcome = {
  status: VoteOutcomeStatus;
  label: string;
  sameAnswerPercent: number | null;
};
