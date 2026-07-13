import { getSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) return Response.json({ error: "Supabaseが未設定です。" }, { status: 503 });
  const { data, error } = await supabase.rpc("get_total_vote_count");
  if (error) return Response.json({ error: "総回答数を取得できませんでした。" }, { status: 502 });
  return Response.json({ totalCount: Number(data ?? 0) });
}
