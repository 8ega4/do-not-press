import { getOrCreateSessionId, recordChoice } from "@/lib/session";
import { getSupabaseClient } from "@/lib/supabase";
import type { VoteChoice, VoteStats } from "@/types/game";

export const LOCAL_VOTE_STATS_KEY = "do-not-press-local-vote-stats";

export type LocalVoteStats = Record<string, {
  press: number;
  dontPress: number;
  timeout: number;
}>;

type VoteStatsRow = {
  press_count: number | string;
  dont_press_count: number | string;
  timeout_count: number | string;
  total_count: number | string;
};

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function isVoteCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function readLocalVoteStats(): LocalVoteStats {
  try {
    const stored = window.localStorage.getItem(LOCAL_VOTE_STATS_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, LocalVoteStats[string]] => {
        const counts = entry[1] as Partial<LocalVoteStats[string]> | null;
        return Boolean(
          counts &&
          isVoteCount(counts.press) &&
          isVoteCount(counts.dontPress) &&
          isVoteCount(counts.timeout),
        );
      }),
    );
  } catch {
    return {};
  }
}

function saveLocalVoteStats(stats: LocalVoteStats) {
  try {
    window.localStorage.setItem(LOCAL_VOTE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // Storage can be disabled or full. The current result can still be shown.
  }
}

function writeLocalVote(questionId: string, choice: VoteChoice): VoteStats {
  const allStats = readLocalVoteStats();
  const current = allStats[questionId] ?? { press: 0, dontPress: 0, timeout: 0 };
  const next = {
    press: current.press + (choice === "press" ? 1 : 0),
    dontPress: current.dontPress + (choice === "dont_press" ? 1 : 0),
    timeout: current.timeout + (choice === "timeout" ? 1 : 0),
  };
  allStats[questionId] = next;
  saveLocalVoteStats(allStats);

  return {
    pressCount: next.press,
    dontPressCount: next.dontPress,
    timeoutCount: next.timeout,
    totalCount: next.press + next.dontPress + next.timeout,
    source: "local",
  };
}

function asSupabaseStats(data: VoteStatsRow | VoteStatsRow[] | null): VoteStats {
  const row = Array.isArray(data) ? data[0] : data;
  return {
    pressCount: Number(row?.press_count ?? 0),
    dontPressCount: Number(row?.dont_press_count ?? 0),
    timeoutCount: Number(row?.timeout_count ?? 0),
    totalCount: Number(row?.total_count ?? 0),
    source: "supabase",
  };
}

async function fetchSupabaseStats(questionId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabaseが未設定です。");
  const { data, error } = await supabase.rpc("get_vote_stats", { p_question_id: questionId });
  if (error) throw error;
  return asSupabaseStats(data as VoteStatsRow | VoteStatsRow[] | null);
}

export async function submitVote(questionId: string, choice: VoteChoice): Promise<VoteStats> {
  if (!hasSupabaseConfig()) return writeLocalVote(questionId, choice);

  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabaseが未設定です。");
  const { error } = await supabase.from("votes").insert({
    question_id: questionId,
    choice,
    session_id: getOrCreateSessionId(),
  });
  if (error && error.code !== "23505") throw new Error("回答を送信できませんでした。");
  recordChoice(questionId, choice);
  return fetchSupabaseStats(questionId);
}

export async function getTotalVotes() {
  if (!hasSupabaseConfig()) {
    return Object.values(readLocalVoteStats()).reduce(
      (total, counts) => total + counts.press + counts.dontPress + counts.timeout,
      0,
    );
  }
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabaseが未設定です。");
  const { data, error } = await supabase.rpc("get_total_vote_count");
  if (error) throw new Error("総回答数を取得できませんでした。");
  return Number(data ?? 0);
}
