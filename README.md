# 絶対に押すな

メリットと代償を読み、10秒以内に赤いボタンを「押す」か「押さない」か決める、スマートフォン向けのエンドレス二択ゲームです。質問数による終了条件はなく、各問題の結果・自分の回答割合・多数派／少数派をその場でXへ共有できます。

## ゲームフロー

```text
トップ
→ 問題
→ 押す／押さない／時間切れ
→ その問題の結果
→ Xで共有、または次の問題
→ 以後繰り返し
```

- 3問制・総合診断・プレイヤータイプはありません。
- 未回答問題を優先し、直前の問題と同じカテゴリをできるだけ避けます。
- 108問をすべて回答したときだけ一巡扱いにし、再びシャッフルします。
- プレイ履歴は `do-not-press-play-history` に保存し、再読み込み後も継続します。
- 履歴には回答済みID、押した回数、押さなかった回数、時間切れ回数、総回答数、直前の問題・カテゴリを保存します。

## 技術構成

- Next.js 16 / React 19 / App Router
- TypeScript / Tailwind CSS 4 + カスタムCSS
- Supabase（Postgres / RLS / RPC）
- Vitest / ESLint / npm
- GitHub Pages

## セットアップ

Node.js 20.9以上が必要です。

```bash
npm install
cp .env.example .env.local
npm run dev
```

主なコマンド:

```bash
npm run dev
npm run lint
npm test
npm run build
node scripts/generate_supabase_seed.mjs
```

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=
```

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: ブラウザで使う公開用anon／publishable key
- `NEXT_PUBLIC_SITE_URL`: 共有・sitemap・OGPの公開URL
- `NEXT_PUBLIC_BASE_PATH`: GitHub Pagesでは `/do-not-press`

service role keyやsecret keyをブラウザへ渡さないでください。

## 問題データ

問題は [`src/data/questions.ts`](./src/data/questions.ts) で管理します。

```ts
{
  id: "q109",
  benefit: "毎日必ず定時に帰れる",
  consequence: "昼休みは毎日15分になる",
  category: "仕事",
  active: true,
  priority: 2,
}
```

追加・変更後は次を実行し、[`supabase/schema.sql`](./supabase/schema.sql) のseedを同期します。

```bash
node scripts/generate_supabase_seed.mjs
```

### カテゴリ

現在は各9問、合計108問です。

- お金・成功
- 恋愛
- 友人・家族
- 仕事
- 特殊能力
- 未来
- SNS
- 食べ物
- 日常生活
- 道徳・心理
- くだらない代償
- 究極の選択

### 品質基準

新しい問題は、次のうち最低2つ以上を満たす内容にします。

- 意見が割れそう
- メリットを本気で欲しい
- 代償が絶妙に嫌
- 価値観の違いが出る
- 少数派だと驚ける
- コメントで議論しやすい
- 一文で理解できる
- 友達へ送りたくなる

差別的・性的・政治的・宗教的な題材、病気・障害・災害・犯罪・死を軽く扱う題材、実在人物や企業への攻撃は追加しません。`active: false` の問題はゲームと静的な問題別ページから除外されます。`priority` は1〜5で、共有されやすい問題を少し選ばれやすくする手動値です。

## 問題選択とプレイ履歴

`selectNextQuestion` は次の順に候補を絞ります。

1. `active: true` の未回答問題
2. 直前とは異なる問題
3. 直前とは異なるカテゴリ
4. `priority` による軽い重み付き抽選

全有効問題を回答した場合だけ `answeredQuestionIds` を空にし、押した回数などの累計は維持します。投票集計用の `do-not-press-local-vote-stats`、匿名セッションID、プレイ履歴は別々のキーです。

## 結果と多数派判定

- 割合の分母は `press + dontPress` です。
- 時間切れは割合・多数派判定へ含めません。
- 有効回答が1票なら「最初の回答者です」。
- 2〜4票なら「まだ回答が集まっていません」。
- 5票以上で、自分と同じ回答が50%超なら多数派、50%未満なら少数派、50%なら真っ二つです。
- 結果画面には問題文、自分の回答、両方の割合、判定、X共有、次の問題を表示します。

## ローカル集計とSupabase集計

### Supabase接続時

- 回答を `votes` へ匿名セッション単位で保存します。
- 同一セッション・同一問題の重複票はDB制約で防ぎます。
- `get_vote_stats` と `get_total_vote_count` RPCから全ユーザー共通の実集計を取得します。
- RLSにより、ブラウザは有効問題の参照、投票の追加、集計RPCの実行だけが可能です。

### Supabase未接続時

- ランダム票や仮票は使いません。
- 実際の回答だけを `do-not-press-local-vote-stats` へ問題別に保存します。
- 保存形式は `{ [questionId]: { press, dontPress, timeout } }` です。
- ローカル票はその端末内だけの集計です。

### 計測リセット履歴

- 2026-07-18 17:22 JST: 本番Supabaseの `public.votes` 22件を0件へリセットし、元データを `private.votes_backup_20260718_1648` へ退避しました。
- 2026-07-19 13:09 JST: 再計測開始前に `public.votes` を `restart identity` 付きで再度リセットし、実テーブル・総回答数RPC・問題別RPCがすべて0件であることを確認しました。
- 問題データ `public.questions`、Supabase未接続時のローカル票、各端末のプレイ履歴はリセット対象外です。
- リセット前の匿名化済み一覧は [`reports/supabase-question-answer-list-2026-07-18.md`](./reports/supabase-question-answer-list-2026-07-18.md) に保存しています。

実行したSQL:

```sql
truncate table public.votes restart identity;
```

## X共有

問題結果の共有文には、問題、代償、自分の回答、同じ回答の割合、多数派／少数派等の判定、問いかけ、`#絶対に押すな` を含めます。

共有先は問題別ページです。

```text
https://8ega4.github.io/do-not-press/q/q030/?utm_source=x&utm_medium=social&utm_campaign=question_share&utm_content=q030
```

- URLは `URL` と `URLSearchParams` で生成します。
- `utm_source=x`
- `utm_medium=social`
- `utm_campaign=question_share`
- `utm_content=QUESTION_ID`
- `?og=2` は共有URLに使いません。
- `/q/[id]` は回答前に結果を見せず、回答後は通常のエンドレスプレイへ合流します。

## Supabase設定

1. Supabaseでプロジェクトを作成します。
2. [`supabase/schema.sql`](./supabase/schema.sql) をSQL Editorで実行します。
3. Project URLと公開用キーを環境変数へ設定します。
4. 問題更新時はseed生成後、生成ブロックをSupabaseへ適用します。

SQLは `questions` 108件、`votes`、RLS、重複防止制約、集計RPC、検索用インデックスを作成します。

## GitHub Pages

`main` へのpushで [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) が静的サイトを公開します。

公開URL: https://8ega4.github.io/do-not-press/

GitHub Actions Secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

ローカルでPages用の静的出力を確認する場合:

```bash
GITHUB_PAGES=true \
NEXT_PUBLIC_BASE_PATH=/do-not-press \
NEXT_PUBLIC_SITE_URL=https://8ega4.github.io/do-not-press \
npm run build
```

## デザイン資料

既存のモバイルUIコンセプトは [`design/mobile-ui-concept.png`](./design/mobile-ui-concept.png) にあります。画面の文字・ボタン・グラフはすべてHTML/CSSで実装しています。
