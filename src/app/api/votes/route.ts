import { questions } from "@/data/questions";
import { getSupabaseClient } from "@/lib/supabase";
import type { VoteChoice, VoteStats } from "@/types/game";

const VALID_CHOICES = new Set<VoteChoice>(["press", "dont_press", "timeout"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type VoteStatsRow = {
  press_count: number | string;
  dont_press_count: number | string;
  timeout_count: number | string;
  total_count: number | string;
};

function asStats(data: VoteStatsRow | VoteStatsRow[] | null): VoteStats {
  const row = Array.isArray(data) ? data[0] : data;
  return {
    pressCount: Number(row?.press_count ?? 0),
    dontPressCount: Number(row?.dont_press_count ?? 0),
    timeoutCount: Number(row?.timeout_count ?? 0),
    totalCount: Number(row?.total_count ?? 0),
    source: "supabase",
  };
}

async function fetchStats(questionId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_vote_stats", { p_question_id: questionId });
  if (error) throw error;
  return asStats(data as VoteStatsRow | VoteStatsRow[] | null);
}

export async function GET(request: Request) {
  const questionId = new URL(request.url).searchParams.get("questionId");
  if (!questionId || !questions.some((question) => question.id === questionId)) {
    return Response.json({ error: "問題が見つかりません。" }, { status: 404 });
  }
  try {
    const stats = await fetchStats(questionId);
    if (!stats) return Response.json({ error: "Supabaseが未設定です。" }, { status: 503 });
    return Response.json(stats);
  } catch {
    return Response.json({ error: "集計を取得できませんでした。" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "リクエスト形式が正しくありません。" }, { status: 400 });
  }

  const candidate = body as { questionId?: unknown; choice?: unknown; sessionId?: unknown };
  if (
    typeof candidate.questionId !== "string" ||
    !questions.some((question) => question.id === candidate.questionId && question.active) ||
    typeof candidate.choice !== "string" ||
    !VALID_CHOICES.has(candidate.choice as VoteChoice) ||
    typeof candidate.sessionId !== "string" ||
    !UUID_PATTERN.test(candidate.sessionId)
  ) {
    return Response.json({ error: "回答内容が正しくありません。" }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) return Response.json({ error: "Supabaseが未設定です。" }, { status: 503 });

  const { error } = await supabase.from("votes").insert({
    question_id: candidate.questionId,
    choice: candidate.choice,
    session_id: candidate.sessionId,
  });

  if (error && error.code !== "23505") {
    return Response.json({ error: "回答を保存できませんでした。もう一度お試しください。" }, { status: 502 });
  }

  try {
    const stats = await fetchStats(candidate.questionId);
    return Response.json(stats, { status: 200 });
  } catch {
    return Response.json({ error: "回答は保存されましたが、集計を取得できませんでした。" }, { status: 502 });
  }
}
