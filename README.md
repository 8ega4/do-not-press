# 絶対に押すな

メリットと少し変な代償を読み、5秒以内に赤いボタンを「押す」か「押さない」か決める、スマートフォン向けブラウザゲームです。3問終了後にプレイヤータイプを表示し、問題や結果をSNSへ共有できます。

Supabaseが未設定でも、ブラウザの `localStorage` と初期モック集計で最後まで遊べます。

## 技術構成

- Next.js 16 / React 19 / App Router
- TypeScript
- Tailwind CSS 4 + カスタムCSS
- Supabase（Postgres / RLS / RPC）
- Vitest
- ESLint
- npm
- Vercelへのデプロイを想定

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
```

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの公開用anon key
- `NEXT_PUBLIC_SITE_URL`: 共有URL・sitemap・OGPに使う公開URL。Vercel公開後は本番URLに変更します

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

- 初期割合は問題IDから決まる再現可能なモック値
- 回答後の増分は `localStorage` に保存
- 匿名セッションIDと回答済み問題を保存し、更新連打による重複投票を抑制
- API接続時にエラーが起きた場合は、回答画面に再試行を表示

これはMVP向けの軽い対策です。localStorageを削除した投票までは防ぎません。

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
- Web Share API対応端末ではネイティブ共有を使用
- 非対応環境では共有文とURLをクリップボードへコピー
- ルートと各問題に動的OG画像を設定
- `robots.ts`、`sitemap.ts`、日本語lang、viewport、theme-colorを設定

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
