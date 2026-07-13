export type Question = {
  id: string;
  benefit: string;
  consequence: string;
  category: string;
  active: boolean;
};

export type VoteChoice = "press" | "dont_press" | "timeout";

export type Vote = {
  id: string;
  questionId: string;
  choice: VoteChoice;
  createdAt: string;
};

export type VoteStats = {
  pressCount: number;
  dontPressCount: number;
  timeoutCount: number;
  totalCount: number;
  source: "supabase" | "local";
};

export type GameAnswer = {
  questionId: string;
  choice: VoteChoice;
};

export type PlayerType = {
  title: string;
  description: string;
};
