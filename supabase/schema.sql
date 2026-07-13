-- 『絶対に押すな』MVP schema
-- Supabase SQL Editorでこのファイル全体を1回実行してください。

create table if not exists public.questions (
  id text primary key,
  benefit text not null,
  consequence text not null,
  category text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id bigint generated always as identity primary key,
  question_id text not null references public.questions(id) on delete cascade,
  session_id uuid not null,
  choice text not null check (choice in ('press', 'dont_press', 'timeout')),
  created_at timestamptz not null default now(),
  constraint votes_session_question_unique unique (session_id, question_id)
);

create index if not exists votes_question_id_created_at_idx on public.votes (question_id, created_at desc);
create index if not exists votes_created_at_idx on public.votes (created_at desc);

alter table public.questions enable row level security;
alter table public.votes enable row level security;

drop policy if exists "questions_are_publicly_readable" on public.questions;
create policy "questions_are_publicly_readable"
on public.questions for select to anon, authenticated using (active = true);

drop policy if exists "anonymous_votes_can_be_inserted" on public.votes;
create policy "anonymous_votes_can_be_inserted"
on public.votes for insert to anon, authenticated
with check (choice in ('press', 'dont_press', 'timeout'));

revoke all on public.questions from anon, authenticated;
revoke all on public.votes from anon, authenticated;
grant select on public.questions to anon, authenticated;
grant insert on public.votes to anon, authenticated;
grant usage, select on sequence public.votes_id_seq to anon, authenticated;

create or replace function public.get_vote_stats(p_question_id text)
returns table (press_count bigint, dont_press_count bigint, timeout_count bigint, total_count bigint)
language sql
security definer
set search_path = ''
stable
as $$
  select
    count(*) filter (where choice = 'press')::bigint,
    count(*) filter (where choice = 'dont_press')::bigint,
    count(*) filter (where choice = 'timeout')::bigint,
    count(*)::bigint
  from public.votes
  where question_id = p_question_id;
$$;

create or replace function public.get_total_vote_count()
returns bigint
language sql
security definer
set search_path = ''
stable
as $$
  select count(*)::bigint from public.votes;
$$;

revoke all on function public.get_vote_stats(text) from public;
revoke all on function public.get_total_vote_count() from public;
grant execute on function public.get_vote_stats(text) to anon, authenticated;
grant execute on function public.get_total_vote_count() to anon, authenticated;

insert into public.questions (id, benefit, consequence, category, active) values
  ('q001', '1億円もらえる', '一生Wi-Fiが1本になる', 'お金', true),
  ('q002', '10歳若返る', '全員から10歳年上に見られる', '日常生活', true),
  ('q003', '空を飛べる', '地面から30cmまでしか上がれない', '能力', true),
  ('q004', '好きな食べ物が一生無料になる', '味が半分になる', '食べ物', true),
  ('q005', '未来を見られる', '見えるのは3秒先まで', '未来', true),
  ('q006', 'どんな言語も話せる', '日本語を忘れる', '能力', true),
  ('q007', '一生働かなくてよくなる', '毎朝6時に強制起床する', '仕事', true),
  ('q008', '透明人間になれる', '透明な間はくしゃみが止まらない', '能力', true),
  ('q009', '100万円もらえる', '友達には1000万円入る', '友人関係', true),
  ('q010', '世界を救える', '誰にも気づかれない', '未来', true),
  ('q011', '好きな人と付き合える', '語尾が一生「にゃん」になる', '恋愛', true),
  ('q012', '一生風邪をひかない', '毎日どこかで小指をぶつける', '日常生活', true),
  ('q013', 'どんなゲームでも最強になれる', 'チュートリアルを絶対に飛ばせない', '日常生活', true),
  ('q014', '宝くじの当選番号がわかる', '番号を1つだけ忘れる', 'お金', true),
  ('q015', '毎日8時間熟睡できる', '夢の中ではずっと仕事をする', '仕事', true),
  ('q016', 'SNSのフォロワーが100万人になる', '投稿は毎回1文字だけ誤字になる', 'SNS', true),
  ('q017', '毎週3連休になる', '休日の天気は必ず小雨になる', '仕事', true),
  ('q018', '食べても体重が増えなくなる', 'ポテトはいつも1本だけ冷たい', '食べ物', true),
  ('q019', '人の心が読める', '相手にも自分の心が読まれる', '友人関係', true),
  ('q020', 'どこへでも瞬間移動できる', '到着するたび靴下が左右逆になる', '能力', true),
  ('q021', '初対面の人に必ず好かれる', '親友には毎回名前を呼び間違えられる', '友人関係', true),
  ('q022', '好きな会社に必ず入れる', '社内BGMが自分にだけ2倍速で聞こえる', '仕事', true),
  ('q023', '一生スマホの充電が切れない', '画面の明るさが常に70%になる', '日常生活', true),
  ('q024', '投稿が毎回必ずバズる', '一番伸びるコメントは母親から届く', 'SNS', true),
  ('q025', '理想のデートができる', '店内BGMがずっと自分の着信音になる', '恋愛', true),
  ('q026', 'どんな料理も5分で作れる', '盛り付けだけは必ず少し傾く', '食べ物', true),
  ('q027', '明日の出来事が全部わかる', '今日の予定を全部忘れる', '未来', true),
  ('q028', '毎月自由に使える10万円が増える', '財布から小銭だけ毎回床に落ちる', 'お金', true),
  ('q029', '写真写りが必ず完璧になる', '証明写真だけ毎回少し眠そうになる', 'SNS', true),
  ('q030', '一生信号に引っかからない', 'エレベーターは毎回すべての階に止まる', 'くだらない代償', true)
on conflict (id) do update set
  benefit = excluded.benefit,
  consequence = excluded.consequence,
  category = excluded.category,
  active = excluded.active;
