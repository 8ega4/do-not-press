-- 『絶対に押すな』MVP schema
-- Supabase SQL Editorでこのファイル全体を1回実行してください。

create table if not exists public.questions (
  id text primary key,
  benefit text not null,
  consequence text not null,
  category text not null,
  active boolean not null default true,
  priority smallint not null default 1 check (priority between 1 and 5),
  created_at timestamptz not null default now()
);

alter table public.questions add column if not exists priority smallint not null default 1;

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

-- BEGIN GENERATED QUESTIONS
-- This block is generated from src/data/questions.ts. Do not edit by hand.
insert into public.questions (id, benefit, consequence, category, active, priority) values
  ('q001', '1億円もらえる', '一生Wi-Fiが1本になる', 'お金・成功', true, 3),
  ('q002', '10歳若返る', '今の友人全員と初対面からやり直す', '日常生活', true, 3),
  ('q003', '空を飛べる', '地面から30cmまでしか上がれない', '特殊能力', true, 3),
  ('q004', '好きな食べ物が一生無料になる', '味が半分になる', '食べ物', true, 3),
  ('q005', '未来を見られる', '見えるのは3秒先まで', '未来', true, 3),
  ('q006', '世界中の言葉を話せる', '日本語では必ず敬語になる', '特殊能力', true, 3),
  ('q007', '一生働かなくてよくなる', '毎朝6時に必ず起きる', '仕事', true, 3),
  ('q008', '透明人間になれる', 'くしゃみだけ通常の3倍の音量になる', '特殊能力', true, 3),
  ('q009', '100万円もらえる', '親友には1000万円入る', '友人・家族', true, 3),
  ('q010', '世界を救える', '誰にも気づかれない', '究極の選択', true, 3),
  ('q011', '好きな人と両想いになれる', '自分の秘密をすべて知られる', '恋愛', true, 3),
  ('q012', '一生風邪をひかない', '毎日どこかで靴下が片方なくなる', '日常生活', true, 2),
  ('q013', 'どんなゲームでも最強になれる', 'チュートリアルを絶対に飛ばせない', '日常生活', true, 3),
  ('q014', '宝くじの当選番号がわかる', '番号を1つだけ忘れる', 'お金・成功', false, 1),
  ('q015', '毎日8時間熟睡できる', '夢の中ではずっと仕事をする', '仕事', true, 2),
  ('q016', 'SNSのフォロワーが100万人になる', '投稿は毎回1文字だけ誤字になる', 'SNS', true, 2),
  ('q017', '毎週3連休になる', '休日の天気は必ず小雨になる', '仕事', true, 3),
  ('q018', '食べても体重が増えなくなる', 'ポテトはいつも1本だけ冷たい', '食べ物', true, 2),
  ('q019', '人の心が読める', '相手にも自分の心が読まれる', '道徳・心理', true, 3),
  ('q020', 'どこへでも瞬間移動できる', '到着するたび靴下が左右逆になる', '特殊能力', true, 3),
  ('q021', '初対面の人に必ず好かれる', '親友には毎回名前を呼び間違えられる', '友人・家族', true, 2),
  ('q022', '好きな会社に必ず入れる', '社内BGMが自分にだけ2倍速で聞こえる', '仕事', true, 2),
  ('q023', '一生スマホの充電が切れない', '充電中は一切操作できない', '日常生活', true, 3),
  ('q024', '投稿が毎回必ずバズる', '一番伸びるコメントは母親から届く', 'SNS', true, 3),
  ('q025', '理想のデートができる', '翌日には内容を半分忘れる', '恋愛', true, 3),
  ('q026', 'どんな料理も5分で作れる', '盛り付けだけは必ず少し傾く', '食べ物', false, 1),
  ('q027', '明日の出来事が全部わかる', '今日の予定を全部忘れる', '未来', true, 3),
  ('q028', '毎月自由に使える10万円が増える', '財布から小銭だけ毎回床に落ちる', 'お金・成功', true, 2),
  ('q029', '写真写りが必ず完璧になる', '証明写真だけ毎回少し眠そうになる', 'SNS', true, 2),
  ('q030', '一生信号に引っかからない', 'エレベーターは毎回すべての階に止まる', 'くだらない代償', true, 3),
  ('q031', '欲しい物がすべて半額になる', '買った翌日に必ずさらに値下げされる', 'お金・成功', true, 3),
  ('q032', '年収が今の2倍になる', '給料日は毎月最終日の23時59分になる', 'お金・成功', true, 2),
  ('q033', 'どんな交渉にも勝てる', '値引き交渉だけは毎回失敗する', 'お金・成功', true, 2),
  ('q034', '一生家賃が無料になる', '部屋の間取りを選べない', 'お金・成功', true, 3),
  ('q035', '起業すれば必ず成功する', '会社名は自分の本名になる', 'お金・成功', true, 2),
  ('q036', '毎日1万円が財布に入る', '使わないと翌朝消える', 'お金・成功', true, 3),
  ('q037', '理想の相手と結婚できる', 'プロポーズの言葉を相手が決める', '恋愛', true, 2),
  ('q038', '好きな人から必ず返信が来る', '返信は毎回翌朝6時に届く', '恋愛', true, 2),
  ('q039', '恋人と一度も喧嘩しなくなる', '本音を言うまで毎回3秒かかる', '恋愛', true, 3),
  ('q040', '初恋の人と再会できる', '相手は当時の会話を全部覚えている', '恋愛', true, 3),
  ('q041', '理想の告白をされる', '場所は満員電車の中になる', '恋愛', true, 2),
  ('q042', '恋人の気持ちが色で見える', '自分の気持ちも常に見える', '恋愛', true, 3),
  ('q043', '毎週最高のデートができる', '行き先は当日まで教えてもらえない', '恋愛', true, 2),
  ('q044', '親友と一生仲良くいられる', '誕生日プレゼントは毎年おそろいになる', '友人・家族', true, 2),
  ('q045', '家族全員が自分の味方になる', '隠し事をするとすぐ顔に出る', '友人・家族', true, 3),
  ('q046', '友達の悩みを必ず解決できる', '自分の悩みは相談できない', '友人・家族', true, 3),
  ('q047', '親友の本音がわかる', '自分の本音も同時に伝わる', '友人・家族', true, 3),
  ('q048', '家族旅行が毎回無料になる', '行き先は家族会議でしか決められない', '友人・家族', true, 2),
  ('q049', '友達を何人でも作れる', '名前を覚えるのに一週間かかる', '友人・家族', true, 2),
  ('q050', '大切な人を必ず笑わせられる', '真面目な話でも一度は笑われる', '友人・家族', true, 3),
  ('q051', '毎日必ず定時に帰れる', '昼休みは毎日15分になる', '仕事', true, 3),
  ('q052', '上司から絶対に怒られない', '褒められることもない', '仕事', true, 3),
  ('q053', '会議がすべて10分で終わる', '議事録は毎回自分が書く', '仕事', true, 3),
  ('q054', '好きな仕事だけ担当できる', '席は入口の真正面になる', '仕事', true, 2),
  ('q055', '仕事のミスがゼロになる', '送信ボタンを毎回3回確認する', '仕事', true, 2),
  ('q056', '時間を5分だけ止められる', '使うたび自分も1分動けない', '特殊能力', true, 3),
  ('q057', '一度見たものを絶対に忘れない', '忘れたい記憶も消せない', '特殊能力', true, 3),
  ('q058', '動物と話せる', '虫の声も全部聞こえる', '特殊能力', true, 3),
  ('q059', 'どんな鍵でも開けられる', '自宅の鍵だけ毎回見失う', '特殊能力', true, 2),
  ('q060', '1日1回だけ瞬間移動できる', '到着地点を1mだけ外す', '特殊能力', true, 3),
  ('q061', '10年後の自分に会える', '質問できるのは1つだけ', '未来', true, 3),
  ('q062', '明日の天気を必ず当てられる', '自分の予定だけは雨になる', '未来', true, 2),
  ('q063', '人生の分岐点が光って見える', '正解は教えてもらえない', '未来', true, 3),
  ('q064', '一週間先のニュースが読める', '他人には内容を伝えられない', '未来', true, 3),
  ('q065', '老後のお金に一生困らない', '老後の住む場所は選べない', '未来', true, 3),
  ('q066', '未来の自分から助言が届く', '届くのは毎回一言だけ', '未来', true, 2),
  ('q067', '人生の残り休日数がわかる', '数字を忘れられない', '未来', true, 3),
  ('q068', '投稿に必ず1万いいね付く', '最初のコメントは必ず母親', 'SNS', true, 3),
  ('q069', 'どんな動画も100万再生される', '自分は完成動画を見られない', 'SNS', true, 3),
  ('q070', '炎上しないアカウントになる', '冗談だけ毎回説明が必要になる', 'SNS', true, 2),
  ('q071', '推しに必ず投稿を見てもらえる', '誤字のある投稿だけ見られる', 'SNS', true, 3),
  ('q072', 'フォローした人と必ず仲良くなれる', 'ミュート機能が使えなくなる', 'SNS', true, 2),
  ('q073', '写真の加工が一瞬で完璧になる', '元画像は毎回自動で消える', 'SNS', true, 2),
  ('q074', '一生どの店でも行列に並ばない', '注文は店員のおまかせになる', '食べ物', true, 3),
  ('q075', '高級料理を毎日無料で食べられる', '飲み物は水しか選べない', '食べ物', true, 3),
  ('q076', 'カロリーを気にせず食べられる', '食後に必ず30分眠くなる', '食べ物', true, 3),
  ('q077', 'どんな店でも予約が取れる', '席は必ず入口の近くになる', '食べ物', true, 2),
  ('q078', '苦手な食べ物が全部好きになる', '今の一番好きな物が普通になる', '食べ物', true, 3),
  ('q079', '冷蔵庫に毎朝好きな物が入る', '賞味期限はその日まで', '食べ物', true, 2),
  ('q080', '毎朝一瞬で身支度が終わる', '服装は前日に決め直せない', '日常生活', true, 2),
  ('q081', '探し物が必ず10秒で見つかる', '見つけた直後に別の物をなくす', '日常生活', true, 3),
  ('q082', '満員電車で必ず座れる', '降りる駅の直前にしか空かない', '日常生活', true, 3),
  ('q083', '洗濯物が一瞬で乾く', '靴下だけ左右が入れ替わる', '日常生活', true, 2),
  ('q084', '家の掃除が毎日自動で終わる', '物の位置が毎回少し変わる', '日常生活', true, 3),
  ('q085', '嘘を見抜ける', '自分も一切嘘をつけない', '道徳・心理', true, 3),
  ('q086', '誰からも嫌われなくなる', '誰の一番にもなれない', '道徳・心理', true, 3),
  ('q087', '後悔を1つだけ消せる', 'そこから得た教訓も忘れる', '道徳・心理', true, 3),
  ('q088', '他人の才能を1つもらえる', '相手はその才能を少し失う', '道徳・心理', true, 3),
  ('q089', '一生正しい選択だけできる', '選ばなかった未来を毎回知る', '道徳・心理', true, 3),
  ('q090', '誰とでも本音で話せる', '建前が一切使えなくなる', '道徳・心理', true, 3),
  ('q091', '自分の短所を1つ消せる', '長所も1つランダムに消える', '道徳・心理', true, 3),
  ('q092', '一度だけ過去の選択を変えられる', '今の思い出が1つ消える', '道徳・心理', true, 3),
  ('q093', '一生蚊に刺されない', '自分の周りだけ常に小バエが1匹飛ぶ', 'くだらない代償', true, 3),
  ('q094', '靴ひもが絶対ほどけない', '靴を脱ぐたび結び直す必要がある', 'くだらない代償', true, 2),
  ('q095', '信号がいつも青になる', '自動ドアは毎回少し遅れて開く', 'くだらない代償', true, 3),
  ('q096', '傘を一生なくさない', '雨の日は必ず家に置いてある', 'くだらない代償', true, 2),
  ('q097', 'レジで絶対に並ばない', '会計後にレシートが必ず2枚出る', 'くだらない代償', true, 2),
  ('q098', 'どんなペンも一生インク切れしない', '字が毎回少しだけ右上がりになる', 'くだらない代償', true, 2),
  ('q099', '寝ぐせが一切つかない', '前髪だけ毎朝1mm短く見える', 'くだらない代償', true, 2),
  ('q100', '電子レンジの待ち時間がゼロになる', '完成音だけ10秒鳴り続ける', 'くだらない代償', true, 2),
  ('q101', '一生お金に困らない', '自分の仕事は誰の記憶にも残らない', '究極の選択', true, 3),
  ('q102', '大切な人の夢を必ず叶えられる', '自分の夢は1つ諦める', '究極の選択', true, 3),
  ('q103', '人生を最初からやり直せる', '今の記憶は半分だけ残る', '究極の選択', true, 3),
  ('q104', '誰か1人を必ず幸せにできる', '相手を自分では選べない', '究極の選択', true, 3),
  ('q105', '一生失敗しなくなる', '挑戦した実感もなくなる', '究極の選択', true, 3),
  ('q106', 'すべての疑問の答えがわかる', '誰にも説明できない', '究極の選択', true, 3),
  ('q107', '過去の自分に一言だけ送れる', '今の自分には内容が残らない', '究極の選択', true, 3),
  ('q108', '理想の人生を選び直せる', '今まで出会った人とは全員初対面になる', '究極の選択', true, 3),
  ('q109', '宝くじに一度だけ必ず当たる', '当選したことを誰にも言えない', 'お金・成功', true, 3),
  ('q110', 'どんな料理も一瞬で作れる', '自分は味見できない', '食べ物', true, 3)
on conflict (id) do update set
  benefit = excluded.benefit,
  consequence = excluded.consequence,
  category = excluded.category,
  active = excluded.active,
  priority = excluded.priority;
-- END GENERATED QUESTIONS
