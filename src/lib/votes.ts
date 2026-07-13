import { getOrCreateSessionId, getRecordedChoice, recordChoice } from "@/lib/session";
import { getSupabaseClient } from "@/lib/supabase";
import type { VoteChoice, VoteStats } from "@/types/game";

const LOCAL_STATS_PREFIX = "do-not-press:stats:";
const LOCAL_TOTAL_KEY = "do-not-press:total";
export const INITIAL_TOTAL_VOTES = 12_482;

type StoredStats = Omit<VoteStats, "source">;
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

function hashQuestionId(questionId: string) {
  return [...questionId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

export function createMockStats(questionId: string): StoredStats {
  const hash = hashQuestionId(questionId);
  const totalCount = 620 + (hash * 47) % 1_900;
  const pressCount = Math.round(totalCount * (0.34 + (hash % 41) / 100));
  const dontPressCount = totalCount - pressCount;
  return { pressCount, dontPressCount, timeoutCount: 0, totalCount };
}

function readLocalStats(questionId: string): StoredStats {
  const stored = window.localStorage.getItem(`${LOCAL_STATS_PREFIX}${questionId}`);
  if (!stored) return createMockStats(questionId);
  try {
    return JSON.parse(stored) as StoredStats;
  } catch {
    return createMockStats(questionId);
  }
}

function writeLocalVote(questionId: string, choice: VoteChoice): VoteStats {
  const stats = readLocalStats(questionId);
  if (!getRecordedChoice(questionId)) {
    if (choice === "press") stats.pressCount += 1;
    if (choice === "dont_press") stats.dontPressCount += 1;
    if (choice === "timeout") stats.timeoutCount += 1;
    stats.totalCount += 1;
    recordChoice(questionId, choice);
    const total = Number(window.localStorage.getItem(LOCAL_TOTAL_KEY) ?? INITIAL_TOTAL_VOTES);
    window.localStorage.setItem(LOCAL_TOTAL_KEY, String(total + 1));
    window.localStorage.setItem(`${LOCAL_STATS_PREFIX}${questionId}`, JSON.stringify(stats));
  }
  return { ...stats, source: "local" };
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
    return Number(window.localStorage.getItem(LOCAL_TOTAL_KEY) ?? INITIAL_TOTAL_VOTES);
  }
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabaseが未設定です。");
  const { data, error } = await supabase.rpc("get_total_vote_count");
  if (error) throw new Error("総回答数を取得できませんでした。");
  return Number(data ?? 0);
}
