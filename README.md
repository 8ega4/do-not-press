# 絶対に押すな

メリットと少し変な代償を読み、10秒以内に赤いボタンを「押す」か「押さない」か決める、スマートフォン向けブラウザゲームです。3問終了後にプレイヤータイプを表示し、問題や結果をXへ共有できます。

Supabaseが未設定でも、ブラウザの `localStorage` に実際の回答だけを保存して最後まで遊べます。

## 技術構成

- Next.js 16 / React 19 / App Router
- TypeScript
- Tailwind CSS 4 + カスタムCSS
- Supabase（Postgres / RLS / RPC）
- Vitest
- ESLint
- npm
- GitHub Pages / Vercelへデプロイ可能

## セットアップ

Node.js 20.9以上が必要です。

```bash
npm install
cp .env.example .env.local
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。Supabaseを使わない場合、環境変数は空のままで構いません。

主なコマンド:

```bash
npm run dev       # 開発サーバー
npm run lint      # ESLint
npm test          # ロジックテスト
npm run build     # 本番ビルド
npm start         # 本番サーバー
```

## 環境変数

`.env.example` を `.env.local` にコピーして設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=
```

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの公開用anon key
- `NEXT_PUBLIC_SITE_URL`: 共有URL・sitemap・OGPに使う公開URL。公開後は本番URLに変更します
- `NEXT_PUBLIC_BASE_PATH`: サブディレクトリ配信時のベースパス。GitHub Pagesでは `/do-not-press`

秘密鍵やservice role keyは、このMVPでは使いません。

## Supabase設定

1. Supabaseでプロジェクトを作成します。
2. SQL Editorを開きます。
3. [`supabase/schema.sql`](./supabase/schema.sql) の内容をすべて実行します。
4. Project Settings → APIからProject URLとanon keyを取得し、`.env.local`に設定します。
5. 開発サーバーを再起動します。

SQLは次を作成します。

- `questions`: 問題データ30件
- `votes`: 匿名セッションごとの回答
- 同一セッション・同一問題への重複回答を防ぐユニーク制約
- 公開問題の参照と匿名投票だけを許可するRLS
- 投票テーブルを直接公開せずに集計する `get_vote_stats` / `get_total_vote_count` 関数
- 問題別・日時別集計用インデックス

## フォールバック動作

Supabase環境変数が両方そろっていない場合は、自動的にローカル集計モードになります。

- 初期値は0票で、ランダム値や仮票は使用しない
- 回答確定時だけ、問題別の実回答数を `do-not-press-local-vote-stats` へ保存
- 保存形式は `{ [questionId]: { press, dontPress, timeout } }`
- 「押した割合」「押さなかった割合」は時間切れを除いた `press + dontPress` を分母にする
- 回答送信中は操作を無効化し、同じ回答操作による二重加算を防ぐ
- Supabase接続時にエラーが起きた場合は、回答画面に再試行を表示

ローカル集計は端末内だけの記録です。`localStorage` を削除すると0票へ戻ります。

## 問題データの追加方法

1. [`src/data/questions.ts`](./src/data/questions.ts) に一意なIDで問題を追加します。
2. Supabase利用時は [`supabase/schema.sql`](./supabase/schema.sql) のseedにも同じ行を追加し、SQL Editorでその `insert ... on conflict` を実行します。
3. `benefit`、`consequence`、`category`、`active` を設定します。

```ts
{
  id: "q031",
  benefit: "毎日必ず定時に帰れる",
  consequence: "帰宅時の信号は全部赤になる",
  category: "仕事",
  active: true,
}
```

## 共有とOGP

- 問題共有URL: `/q/QUESTION_ID`
- 問題結果と最終結果の「Xで共有」からXの投稿画面を新しいタブで開く
- 投稿本文と共有URLは `URLSearchParams` でエンコード
- 問題結果は現在の問題文と問題直リンク、最終結果は3問の結果とトップページURLを共有
- `public/og-image.png` の1200×630画像を全ページのOGPに設定
- `robots.ts`、`sitemap.ts`、日本語lang、viewport、theme-colorを設定

## GitHub Pagesへのデプロイ

`.github/workflows/deploy-pages.yml` が `main` へのpushを検知し、静的サイトを自動公開します。

1. GitHubのリポジトリ設定で Pages のSourceを `GitHub Actions` にします。
2. `main`へpushするか、Actions画面から `Deploy to GitHub Pages` を手動実行します。
3. 公開URLは `https://8ega4.github.io/do-not-press/` です。

GitHub PagesではNext.jsのサーバー機能を使えないため、Supabase利用時はブラウザからanon keyで直接接続します。データ保護は `supabase/schema.sql` のRLS、権限、重複制約で行います。GitHubのRepository secretsに次を登録すると実集計が有効になります。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

未登録の場合もローカル集計モードで遊べます。

ローカルでPages用の静的書き出しを確認する場合:

```bash
GITHUB_PAGES=true \
NEXT_PUBLIC_BASE_PATH=/do-not-press \
NEXT_PUBLIC_SITE_URL=https://8ega4.github.io/do-not-press \
npm run build
```

生成物は `out/` に出力されます。

## Vercelへのデプロイ

1. リポジトリをGitHubへpushします。
2. Vercelで `Add New Project` からリポジトリをImportします。
3. Framework Presetが `Next.js` であることを確認します。
4. Supabaseを使う場合は3つの環境変数をProduction / Previewに登録します。
5. Deploy後、`NEXT_PUBLIC_SITE_URL`を公開URLへ変更して再デプロイします。

Supabase未設定でもデプロイでき、その場合はローカル集計モードで動作します。

## 今後追加できる機能

- 本日の問題
- 人気問題ランキング
- ユーザー投稿問題
- 都道府県別集計
- 配信者モード / 視聴者投票
- 管理画面
- 問題の通報
- 結果画像の保存
- 多言語対応
- PWA化

## デザイン資料

実装前に作成したモバイル4状態のUIコンセプトは [`design/mobile-ui-concept.png`](./design/mobile-ui-concept.png) にあります。実際のUI文字・ボタン・グラフは画像ではなく、アクセシブルなHTML/CSSとして実装しています。
